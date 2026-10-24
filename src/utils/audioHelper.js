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
 * Plays Duolingo-style crystal chime with shimmering harmonics.
 * Frequency ascends along Pythagorean scale based on comboCount.
 */
function playHarmonicCrystalChime(ctx, now, comboCount = 0) {
  const comboScale = [523.25, 587.33, 659.25, 739.99, 783.99, 880.00, 987.77, 1046.50];
  const noteIdx = Math.min(comboScale.length - 1, Math.max(0, comboCount));
  const fundamental = comboScale[noteIdx];
  const fifth = fundamental * 1.4983; // Pure 5th
  const octave = fundamental * 2.0;

  // Master Gain for chime
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.001, now);
  master.gain.linearRampToValueAtTime(0.24, now + 0.006); // 6ms crisp attack
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.42); // 420ms natural decay
  master.connect(ctx.destination);

  // Osc 1: Fundamental Sine (warm body)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(fundamental, now);
  osc1.connect(master);
  osc1.start(now);
  osc1.stop(now + 0.42);

  // Osc 2: Harmonic 5th (adds musical richness)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(fifth, now);
  gain2.gain.setValueAtTime(0.35, now);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
  osc2.connect(gain2);
  gain2.connect(master);
  osc2.start(now);
  osc2.stop(now + 0.28);

  // Osc 3: High Crystal Octave (sparkle shimmer)
  const osc3 = ctx.createOscillator();
  const gain3 = ctx.createGain();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(octave, now);
  gain3.gain.setValueAtTime(0.40, now);
  gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
  osc3.connect(gain3);
  gain3.connect(master);
  osc3.start(now);
  osc3.stop(now + 0.45);

  // Extra high harmonic on high combo
  if (comboCount >= 3) {
    const osc4 = ctx.createOscillator();
    const gain4 = ctx.createGain();
    osc4.type = 'sine';
    osc4.frequency.setValueAtTime(fundamental * 3.0, now);
    gain4.gain.setValueAtTime(0.20, now);
    gain4.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc4.connect(gain4);
    gain4.connect(master);
    osc4.start(now);
    osc4.stop(now + 0.35);
  }
}

/**
 * Plays soft double felt-thud for incorrect answers (Duolingo polite cue).
 * Uses low-pass filtered triangle waves to prevent acoustic harshness.
 */
function playGentleMistakeCue(ctx, now) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.18, now);
  master.connect(ctx.destination);

  // Lowpass filter to ensure soft, warm sound
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, now);
  filter.connect(master);

  // First gentle mallet bounce (G3 = 196Hz)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(196, now);
  osc1.frequency.linearRampToValueAtTime(180, now + 0.12);
  gain1.gain.setValueAtTime(0.001, now);
  gain1.gain.linearRampToValueAtTime(0.6, now + 0.005);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  osc1.connect(gain1);
  gain1.connect(filter);
  osc1.start(now);
  osc1.stop(now + 0.12);

  // Second descending soft bounce (E3 = 164Hz)
  const t2 = now + 0.09;
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(164.81, t2);
  osc2.frequency.linearRampToValueAtTime(146, t2 + 0.14);
  gain2.gain.setValueAtTime(0.001, t2);
  gain2.gain.linearRampToValueAtTime(0.5, t2 + 0.005);
  gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.14);
  osc2.connect(gain2);
  gain2.connect(filter);
  osc2.start(t2);
  osc2.stop(t2 + 0.14);
}

/**
 * Plays tactile acoustic wooden pop / switch click for buttons.
 */
function playTactileClickCue(ctx, now) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.025);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.025);
}

/**
 * Plays magical golden harp glissando for Knowledge Vault unbox & loot drops.
 */
function playVaultGlissando(ctx, now) {
  const notes = [392.0, 523.25, 659.25, 783.99, 1046.50, 1318.51];
  notes.forEach((freq, idx) => {
    const t = now + idx * 0.05;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);
  });
}

/**
 * Plays electrical lightning whoosh + chime for Atlas Sprint Surge activation.
 */
function playSurgePowerup(ctx, now) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.exponentialRampToValueAtTime(1400, now + 0.22);
  filter.Q.setValueAtTime(3.0, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.20, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.30);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.30);

  const bell = ctx.createOscillator();
  const bellGain = ctx.createGain();
  bell.type = 'sine';
  bell.frequency.setValueAtTime(1046.5, now + 0.15);
  bellGain.gain.setValueAtTime(0.001, now + 0.15);
  bellGain.gain.linearRampToValueAtTime(0.25, now + 0.16);
  bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.50);
  bell.connect(bellGain);
  bellGain.connect(ctx.destination);
  bell.start(now + 0.15);
  bell.stop(now + 0.50);
}

/**
 * Plays crystalline aegis bell for Mistake Recovery shield restoration.
 */
function playShieldRestoredChime(ctx, now) {
  const bell = ctx.createOscillator();
  const bellGain = ctx.createGain();
  bell.type = 'sine';
  bell.frequency.setValueAtTime(987.77, now);
  bell.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12);
  bellGain.gain.setValueAtTime(0.001, now);
  bellGain.gain.linearRampToValueAtTime(0.25, now + 0.008);
  bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
  bell.connect(bellGain);
  bellGain.connect(ctx.destination);
  bell.start(now);
  bell.stop(now + 0.55);

  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(130.81, now);
  subGain.gain.setValueAtTime(0.001, now);
  subGain.gain.linearRampToValueAtTime(0.18, now + 0.05);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);
  sub.connect(subGain);
  subGain.connect(ctx.destination);
  sub.start(now);
  sub.stop(now + 0.40);
}

/**
 * Plays triumphant victory fanfare for match completion and boss defeat.
 */
function playVictoryFanfare(ctx, now) {
  const notes = [
    { freq: 523.25, t: 0.00, dur: 0.16 },
    { freq: 659.25, t: 0.10, dur: 0.16 },
    { freq: 783.99, t: 0.20, dur: 0.18 },
    { freq: 1046.50, t: 0.32, dur: 0.55 }
  ];

  notes.forEach(n => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(n.freq, now + n.t);
    gain.gain.setValueAtTime(0.001, now + n.t);
    gain.gain.linearRampToValueAtTime(0.22, now + n.t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + n.t);
    osc.stop(now + n.t + n.dur);
  });
}

/**
 * High-Fidelity Web Audio SFX Engine for Atlas English Arena.
 * Supports:
 * - 'correct': Crystal bell chime with combo scale & overtone shimmer
 * - 'wrong': Gentle soft double felt-thud (Duolingo-style polite cue)
 * - 'click' / 'tap': Tactile wooden mechanical switch click
 * - 'vault' / 'loot' / 'chest': Magical golden harp glissando + chime
 * - 'surge' / 'powerup': Electrical lightning sweep + bell
 * - 'shield' / 'shield_restore': Crystalline aegis protective bell + sub-bass
 * - 'victory' / 'fanfare': Triumphant ascending victory fanfare
 * - 'boss_hit': Heavy resonant boss strike
 */
export function playArenaSfx(type = 'correct', comboCount = 0) {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (type) {
      case 'correct':
        playHarmonicCrystalChime(ctx, now, comboCount);
        break;
      case 'wrong':
        playGentleMistakeCue(ctx, now);
        break;
      case 'click':
      case 'tap':
        playTactileClickCue(ctx, now);
        break;
      case 'vault':
      case 'loot':
      case 'chest':
        playVaultGlissando(ctx, now);
        break;
      case 'surge':
      case 'powerup':
        playSurgePowerup(ctx, now);
        break;
      case 'shield':
      case 'shield_restore':
        playShieldRestoredChime(ctx, now);
        break;
      case 'victory':
      case 'fanfare':
      case 'boss_hit':
        playVictoryFanfare(ctx, now);
        break;
      default:
        playHarmonicCrystalChime(ctx, now, comboCount);
        break;
    }
  } catch (err) {
    // Non-blocking for SFX
  }
}
