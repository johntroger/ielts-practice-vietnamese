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
 * Plays Cambridge 4-note soundcheck chime.
 */
export function playSoundcheck({ onStart, onEnd } = {}) {
  return playIELTSSoundcheck({ volume: 1.0, onStart, onEnd });
}

/**
 * Stops all ongoing soundcheck chimes and speech synthesis.
 * Essential to eliminate acoustic feedback before mic recording.
 */
export function stopAllAudio() {
  stopIELTSSoundcheck();
  stopSpeech();
}

/**
 * Speaks text using Cambridge en-GB voice (rate 0.95).
 */
export function speakArenaText(text, { onStart, onEnd, onError } = {}) {
  stopAllAudio();
  return speakText(text, {
    voiceLang: 'en-GB',
    rate: 0.95,
    pitch: 1.0,
    onStart,
    onEnd,
    onError
  });
}

/**
 * Plays subtle Web Audio SFX (Correct Ding / Wrong Buzz).
 */
export function playArenaSfx(type = 'correct') {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'correct') {
      // Pleasant dual chime: 587Hz -> 880Hz
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
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
