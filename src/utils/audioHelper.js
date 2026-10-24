/**
 * src/utils/audioHelper.js
 * 
 * High-Performance Dual-Audio Facade for Atlas English Arena.
 * Gracefully integrates existing soundcheckAudio.js and speechAudio.js:
 * - Cambridge 4-note ascending chime soundcheck
 * - Native Web Speech API standard voice (en-GB rate 0.95)
 * - Safe browser audio unlock gesture
 * - Synchronous stopAll() to eliminate acoustic echo before recording
 */

import { playIELTSSoundcheck, stopIELTSSoundcheck } from './soundcheckAudio.js';
import { speakText, stopSpeech } from './speechAudio.js';

let sharedAudioCtx = null;

function getSharedAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Unlocks AudioContext immediately on first user touch / click.
 */
export function unlockAudioContext() {
  const ctx = getSharedAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

/**
 * Plays pure 4-note ascending musical chime (C5-E5-G5-C6) WITHOUT voiceover.
 */
export function playChimeTone({ volume = 0.4, onStart, onEnd } = {}) {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) {
      onEnd?.();
      return;
    }

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    const clampedVol = Math.max(0.05, Math.min(1.0, Number(volume) || 0.4));
    masterGain.gain.setValueAtTime(clampedVol, now);
    masterGain.connect(ctx.destination);

    onStart?.();

    // 4 harmonic bell notes: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.5Hz)
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.25 },
      { freq: 659.25, time: 0.12, dur: 0.25 },
      { freq: 783.99, time: 0.24, dur: 0.28 },
      { freq: 1046.50, time: 0.36, dur: 0.55 }
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, now + n.time);

      gain.gain.setValueAtTime(0, now + n.time);
      gain.gain.linearRampToValueAtTime(0.5, now + n.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur);
    });

    setTimeout(() => {
      onEnd?.();
    }, 950);
  } catch (e) {
    onEnd?.();
  }
}

/**
 * Plays Cambridge 4-note soundcheck chime with official spoken prompt.
 */
export function playSoundcheck({ onStart, onEnd } = {}) {
  return playIELTSSoundcheck({ volume: 1.0, onStart, onEnd });
}

let sharedArenaAudioElement = null;
let sharedArenaClipTimer = null;
let activeLoadedListener = null;
let currentPlaySessionId = 0;

function stopArenaHtmlAudio() {
  currentPlaySessionId++;
  if (sharedArenaClipTimer) {
    clearInterval(sharedArenaClipTimer);
    sharedArenaClipTimer = null;
  }
  if (sharedArenaAudioElement) {
    try {
      if (activeLoadedListener) {
        sharedArenaAudioElement.removeEventListener('loadedmetadata', activeLoadedListener);
        activeLoadedListener = null;
      }
      sharedArenaAudioElement.pause();
      sharedArenaAudioElement.currentTime = 0;
      // Detach audio source so buffered media immediately ceases
      sharedArenaAudioElement.removeAttribute('src');
      sharedArenaAudioElement.load();
    } catch (e) {}
  }
}

/**
 * Stops all ongoing soundcheck chimes, R2 HTML5 audio streams, and speech synthesis.
 * Essential to eliminate acoustic feedback before mic recording and when exiting games.
 */
export function stopAllAudio() {
  stopArenaHtmlAudio();
  stopIELTSSoundcheck();
  stopSpeech();
}

/**
 * Plays Cloudflare R2 studio audio clip (if audioUrl provided) or speaks text using Cambridge en-GB voice (rate 0.95).
 */
export function speakArenaText(textOrQuestion, { audioUrl, clipStart = 0, clipEnd = 0, onStart, onEnd, onError } = {}) {
  stopAllAudio();

  const isObj = textOrQuestion && typeof textOrQuestion === 'object';
  const resolvedText = isObj ? (textOrQuestion.audioText || textOrQuestion.context || '') : String(textOrQuestion || '');
  const resolvedUrl = (isObj ? textOrQuestion.audioUrl : audioUrl) || null;
  const resolvedStart = Number((isObj ? textOrQuestion.clipStart : clipStart) || 0);
  const resolvedEnd = Number((isObj ? textOrQuestion.clipEnd : clipEnd) || 0);

  const sessionId = ++currentPlaySessionId;

  if (resolvedUrl && typeof window !== 'undefined' && typeof Audio !== 'undefined') {
    try {
      if (!sharedArenaAudioElement) {
        sharedArenaAudioElement = new Audio();
      }
      const audio = sharedArenaAudioElement;
      audio.preload = 'auto';
      audio.src = resolvedUrl;

      const startPlayback = () => {
        if (sessionId !== currentPlaySessionId) return;
        try {
          if (resolvedStart > 0 && Math.abs(audio.currentTime - resolvedStart) > 0.5) {
            audio.currentTime = resolvedStart;
          } else if (resolvedStart === 0) {
            audio.currentTime = 0;
          }
        } catch (e) {}

        audio.play().then(() => {
          if (sessionId !== currentPlaySessionId) {
            try {
              audio.pause();
              audio.currentTime = 0;
              audio.removeAttribute('src');
            } catch (e) {}
            return;
          }
          onStart?.();
          if (resolvedEnd > resolvedStart) {
            sharedArenaClipTimer = setInterval(() => {
              if (sessionId !== currentPlaySessionId || audio.currentTime >= resolvedEnd || audio.paused || audio.ended) {
                stopArenaHtmlAudio();
                onEnd?.();
              }
            }, 100);
          } else {
            audio.onended = () => {
              if (sessionId === currentPlaySessionId) {
                stopArenaHtmlAudio();
                onEnd?.();
              }
            };
          }
        }).catch((err) => {
          if (sessionId !== currentPlaySessionId) return;
          // Fallback to TTS if autoplay/network blocked
          if (resolvedText) {
            speakText(resolvedText, { voiceLang: 'en-GB', rate: 0.95, pitch: 1.0, onStart, onEnd, onError });
          } else {
            onError?.(err);
          }
        });
      };

      if (audio.readyState >= 1) {
        startPlayback();
      } else {
        activeLoadedListener = () => {
          if (activeLoadedListener) {
            audio.removeEventListener('loadedmetadata', activeLoadedListener);
            activeLoadedListener = null;
          }
          startPlayback();
        };
        audio.addEventListener('loadedmetadata', activeLoadedListener, { once: true });
        audio.load();
      }
      return;
    } catch (e) {
      // Fallback to TTS below
    }
  }

  return speakText(resolvedText, {
    voiceLang: 'en-GB',
    rate: 0.95,
    pitch: 1.0,
    onStart,
    onEnd,
    onError
  });
}

/**
 * Plays subtle Web Audio SFX (Correct Ding / Wrong Buzz / Dynamic Combo Scale).
 * When combo >= 1, pitch ascends along the Pythagorean harmonic scale (C5 -> D5 -> E5 -> G5 -> A5 -> C6).
 */
export function playArenaSfx(type = 'correct', comboCount = 0) {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'correct') {
      // Harmonic combo pitch scaling: C5 (523), D5 (587), E5 (659), F#5 (740), G5 (784), A5 (880), B5 (987), C6 (1046)
      const comboScale = [523.25, 587.33, 659.25, 739.99, 783.99, 880.00, 987.77, 1046.50];
      const noteIdx = Math.min(comboScale.length - 1, Math.max(0, comboCount));
      const baseFreq = comboScale[noteIdx];
      const targetFreq = baseFreq * 1.5;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.16);
      gain.gain.setValueAtTime(0.20, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    } else {
      // Gentle warning thud: 220Hz -> 146Hz
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220.0, now);
      osc.frequency.linearRampToValueAtTime(146.83, now + 0.18);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch (err) {
    // Non-blocking for SFX
  }
}
