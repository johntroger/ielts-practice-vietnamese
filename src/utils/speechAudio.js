/**
 * speechAudio.js - Ultra-robust Speech Synthesis & Web Audio Engine
 * Solves common browser issues:
 * 1. Chromium Garbage Collection bug (persists utterance on window ref)
 * 2. Chromium stuck queue (calls cancel() and resume() prior to speaking)
 * 3. Windows OS missing en-GB pack (automatically falls back to en-US, en-AU, or best available English voice)
 * 4. Asynchronous voice loading (handles onvoiceschanged)
 * 5. Web Audio API chime as instant auditory feedback so user immediately hears sound
 */

// Keep active utterance in global scope to prevent V8/Chromium garbage collection
let activeUtterance = null;
let voicesCache = [];

function loadVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        voicesCache = v;
      }
    } catch (e) {}
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}

// Shared persistent AudioContext to prevent garbage collection and browser suspension
let sharedAudioCtx = null;

function getAudioContext() {
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
 * Play a short, pleasant Web Audio API cue chime
 * This guarantees the user hears immediate sound feedback upon clicking
 */
export function playChimeTone({ freq = 587.33, type = 'sine', duration = 0.22, volume = 0.35 } = {}) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    console.warn('playChimeTone error:', e);
  }
}

/**
 * Speak text with automatic voice selection, stuck queue clearance, and GC protection
 */
export function speakText(text, {
  rate = 0.9,
  pitch = 1.0,
  volume = 1.0,
  lang = 'en-GB',
  playChimeFirst = true,
  onStart,
  onEnd,
  onError
} = {}) {
  if (!text || typeof text !== 'string') return;

  // 1. Play immediate audio cue so user knows sound is working
  if (playChimeFirst) {
    playChimeTone({ freq: 659.25, duration: 0.18, volume: 0.25 });
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('speechSynthesis is not supported in this browser.');
    onError?.('Trình duyệt không hỗ trợ Web Speech API.');
    return;
  }

  try {
    // 2. Clear any stuck or paused queue in Chromium
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Refresh voices if empty
    if (voicesCache.length === 0) {
      loadVoices();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Pin to module-level and window to prevent garbage collection
    activeUtterance = utterance;
    window.__activeSpeechUtterance = utterance;

    utterance.rate = Math.max(0.6, Math.min(1.4, Number(rate) || 0.9));
    utterance.pitch = Math.max(0.8, Math.min(1.2, Number(pitch) || 1.0));
    utterance.volume = Math.max(0.1, Math.min(1.0, Number(volume) || 1.0));

    // 3. Intelligent Voice Selection (handles Windows without en-GB)
    const voices = voicesCache.length > 0 ? voicesCache : window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      // Priority 1: Exact en-GB voice
      let selectedVoice = voices.find(v => v.lang === 'en-GB' || v.lang === 'en_GB');
      
      // Priority 2: Any English voice with UK/British in name
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('UK') || v.name.includes('British') || v.name.includes('England') || v.name.includes('George') || v.name.includes('Hazel') || v.name.includes('Susan')));
      }

      // Priority 3: High-quality natural/online English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Microsoft')));
      }

      // Priority 4: Any English voice (e.g. en-US Microsoft David on Windows)
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }

      // Priority 5: System default voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.default) || voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        utterance.lang = 'en-US';
      }
    } else {
      // Default to en-US for maximum compatibility with Windows SAPI
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      activeUtterance = null;
      window.__activeSpeechUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesisUtterance error:', e);
      activeUtterance = null;
      window.__activeSpeechUtterance = null;
      onError?.(e);
      onEnd?.();
    };

    // Directly speak without asynchronous setTimeout to preserve transient user activation in Chrome
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Failed to execute speak:', err);
      onError?.(err);
      onEnd?.();
    }
  } catch (err) {
    console.error('speakText initialization failed:', err);
    activeUtterance = null;
    window.__activeSpeechUtterance = null;
    onError?.(err);
    onEnd?.();
  }
}

/**
 * Stop any current speech playback
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  activeUtterance = null;
  window.__activeSpeechUtterance = null;
}
