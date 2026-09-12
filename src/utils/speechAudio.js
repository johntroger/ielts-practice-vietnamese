/**
 * speechAudio.js - Ultra-robust Speech Synthesis & Web Audio Engine
 * Solves all browser and OS quirks:
 * 1. Chromium Garbage Collection bug (persists utterance on window Set)
 * 2. Chromium stuck queue (resume() and safe asynchronous cancel handling)
 * 3. Windows OS missing en-GB pack (automatically falls back to en-US or best available English voice)
 * 4. Asynchronous voice loading (handles onvoiceschanged and eagerly reloads)
 * 5. Web Audio API chime as instant auditory feedback so user immediately hears sound
 * 6. Chromium 15-second speech boundary timeout bug (automatic pause/resume keepalive)
 */

if (typeof window !== 'undefined') {
  if (!window.__activeUtterances) {
    window.__activeUtterances = new Set();
  }
}

let voicesCache = [];

export function getAvailableVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  try {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      voicesCache = list;
    }
  } catch (e) {}
  return voicesCache;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  getAvailableVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      getAvailableVoices();
    };
  }
}

// Shared persistent AudioContext to prevent garbage collection and browser suspension
let sharedAudioCtx = null;

export function getAudioContext() {
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
export function playChimeTone({ freq = 659.25, type = 'sine', duration = 0.2, volume = 0.3 } = {}) {
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
 * Find the optimal voice for IELTS practice (British/UK preferred, fallback to any English)
 */
export function findBestIELTSVoice(accent = 'en-GB') {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Exact match for requested accent (e.g. en-GB, en_GB)
  let found = voices.find(v => v.lang === accent || v.lang.replace('_', '-') === accent);
  if (found) return found;

  // 2. UK / British keywords in voice name
  found = voices.find(v => 
    v.lang.startsWith('en') && 
    (v.name.includes('UK') || v.name.includes('British') || v.name.includes('England') || 
     v.name.includes('George') || v.name.includes('Hazel') || v.name.includes('Susan'))
  );
  if (found) return found;

  // 3. High quality natural English voices (Edge / Chrome Natural / Online)
  found = voices.find(v => 
    v.lang.startsWith('en') && 
    (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Microsoft'))
  );
  if (found) return found;

  // 4. Any English voice (e.g. en-US Microsoft David, en-AU, etc.)
  found = voices.find(v => v.lang.startsWith('en'));
  if (found) return found;

  // 5. System default
  return voices.find(v => v.default) || voices[0];
}

/**
 * Speak text with automatic voice selection, stuck queue clearance, GC protection,
 * and seamless fallback.
 */
export function speakText(text, {
  rate = 0.95,
  pitch = 1.0,
  volume = 1.0,
  lang = 'en-GB',
  playChimeFirst = false,
  onStart,
  onEnd,
  onError
} = {}) {
  if (!text || typeof text !== 'string') {
    onEnd?.();
    return;
  }

  // 1. Play immediate audio cue if requested
  if (playChimeFirst) {
    playChimeTone({ freq: 659.25, duration: 0.15, volume: 0.25 });
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('speechSynthesis is not supported in this browser.');
    onError?.('Trình duyệt không hỗ trợ Web Speech API.');
    onEnd?.();
    return;
  }

  try {
    // Unpause queue if stuck in Chromium
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const cleanText = text.replace(/[\r\n]+/g, ' ').trim();
    if (!cleanText) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Prevent GC in V8
    if (window.__activeUtterances) {
      window.__activeUtterances.add(utterance);
    }
    window.__activeSpeechUtterance = utterance;

    utterance.rate = Math.max(0.6, Math.min(1.4, Number(rate) || 0.95));
    utterance.pitch = Math.max(0.8, Math.min(1.2, Number(pitch) || 1.0));
    utterance.volume = Math.max(0.1, Math.min(1.0, Number(volume) || 1.0));

    // Voice selection
    const chosenVoice = findBestIELTSVoice(lang);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang;
    } else {
      utterance.lang = lang;
    }

    let keepAliveTimer = null;

    const cleanup = () => {
      if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = null;
      }
      if (window.__activeUtterances) {
        window.__activeUtterances.delete(utterance);
      }
      if (window.__activeSpeechUtterance === utterance) {
        window.__activeSpeechUtterance = null;
      }
    };

    utterance.onstart = () => {
      // Start keepalive heartbeat for sentences longer than 10s
      keepAliveTimer = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          cleanup();
        } else {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 9000);

      onStart?.();
    };

    utterance.onend = () => {
      cleanup();
      onEnd?.();
    };

    utterance.onerror = (e) => {
      // Only treat non-interrupted errors as real issues
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('SpeechSynthesisUtterance error:', e);
        onError?.(e);
      }
      cleanup();
      onEnd?.();
    };

    // Execute speak: if already speaking, cancel previous and defer speak by 25ms to avoid Chromium cancel bug
    const executeSpeak = () => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
      setTimeout(executeSpeak, 25);
    } else {
      executeSpeak();
    }
  } catch (err) {
    console.error('speakText initialization failed:', err);
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
  if (typeof window !== 'undefined' && window.__activeUtterances) {
    window.__activeUtterances.clear();
  }
  if (typeof window !== 'undefined') {
    window.__activeSpeechUtterance = null;
  }
}
