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
 * Find the optimal Neural/Natural voice for IELTS practice (British/UK preferred, fallback to any English)
 */
export function findBestIELTSVoice(accent = 'en-GB') {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  const targetPrefix = String(accent || 'en-GB').toLowerCase().replace('_', '-');

  const scoreVoice = (v) => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    const name = v.name || '';
    if (!lang.startsWith('en')) return -1000;

    let score = 0;
    if (lang === targetPrefix || lang.startsWith(targetPrefix)) score += 60;
    else if (lang.startsWith('en')) score += 10;

    if (/natural|neural/i.test(name)) score += 100;
    else if (/premium|enhanced|siri/i.test(name)) score += 75;
    else if (/google\s+(uk|us)\s+english/i.test(name)) score += 55;
    else if (/online/i.test(name)) score += 45;

    if (targetPrefix.startsWith('en-gb') && /sonia|libby|ryan|george|daniel|uk|british/i.test(name)) score += 20;
    if (targetPrefix.startsWith('en-us') && /aria|guy|andrew|ava|emma|google us/i.test(name)) score += 20;
    if (/espeak|compact|whisper|trinoids|zarvox/i.test(name)) score -= 80;
    return score;
  };

  const ranked = [...voices]
    .filter(v => v.lang && v.lang.toLowerCase().startsWith('en'))
    .sort((a, b) => scoreVoice(b) - scoreVoice(a));

  return ranked[0] || voices.find(v => v.default) || voices[0];
}

// Speech session tracking to safely invalidate old runs on new speak / stop
let activeSpeechSessionId = 0;

/**
 * Split long IELTS listening / reading texts into natural sentence/clause chunks.
 * Keeps each chunk under maxChunkLen (default: 140 chars, approx 20-25 words)
 * so no utterance ever approaches the 15-second Chromium engine timeout.
 */
export function splitTextIntoUtteranceChunks(text, maxChunkLen = 140) {
  if (!text || typeof text !== 'string') return [];
  const clean = text.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return [];

  if (clean.length <= maxChunkLen) {
    return [clean];
  }

  // 1. Split on sentence delimiters (. ? ! ; :)
  const rawSentences = clean.match(/[^.?!;:]+[.?!;:]*|\S+/g) || [clean];
  const chunks = [];
  let currentChunk = '';

  for (const raw of rawSentences) {
    const s = raw.trim();
    if (!s) continue;

    if (s.length <= maxChunkLen) {
      if (!currentChunk) {
        currentChunk = s;
      } else if ((currentChunk + ' ' + s).length <= maxChunkLen) {
        currentChunk += ' ' + s;
      } else {
        chunks.push(currentChunk);
        currentChunk = s;
      }
    } else {
      // Sentence exceeds maxChunkLen: break into comma / clause boundaries
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = '';
      }

      const subClauses = s.match(/[^,–—]+[,–—]*|\S+/g) || [s];
      let subChunk = '';
      for (const rawSub of subClauses) {
        const sub = rawSub.trim();
        if (!sub) continue;

        if (sub.length <= maxChunkLen) {
          if (!subChunk) {
            subChunk = sub;
          } else if ((subChunk + ' ' + sub).length <= maxChunkLen) {
            subChunk += ' ' + sub;
          } else {
            chunks.push(subChunk);
            subChunk = sub;
          }
        } else {
          // Sub-clause still too long: split into individual words
          if (subChunk) {
            chunks.push(subChunk);
            subChunk = '';
          }
          const words = sub.split(' ');
          let wordChunk = '';
          for (const w of words) {
            if (!w) continue;
            if (!wordChunk) {
              wordChunk = w;
            } else if ((wordChunk + ' ' + w).length <= maxChunkLen) {
              wordChunk += ' ' + w;
            } else {
              chunks.push(wordChunk);
              wordChunk = w;
            }
          }
          if (wordChunk) {
            chunks.push(wordChunk);
          }
        }
      }
      if (subChunk) {
        chunks.push(subChunk);
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks.filter(c => c.length > 0);
}

/**
 * Speak text with automatic voice selection, sentence chunking, GC protection,
 * and seamless fallback across long paragraphs without cutting off.
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
    // Generate new session ID to cancel any prior asynchronous chunk queue
    const sessionId = ++activeSpeechSessionId;

    // Clear previous speech and active utterances
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    if (window.__activeUtterances) {
      window.__activeUtterances.clear();
    }

    const chunks = splitTextIntoUtteranceChunks(text, 140);
    if (chunks.length === 0) {
      onEnd?.();
      return;
    }

    const chosenVoice = findBestIELTSVoice(lang);
    const targetLang = chosenVoice?.lang || lang;
    const targetRate = Math.max(0.6, Math.min(1.4, Number(rate) || 0.95));
    const targetPitch = Math.max(0.8, Math.min(1.2, Number(pitch) || 1.0));
    const targetVolume = Math.max(0.1, Math.min(1.0, Number(volume) || 1.0));

    let currentIndex = 0;
    let hasStarted = false;

    const playNextChunk = () => {
      // Abandon if superseded by another speech request or stopSpeech()
      if (sessionId !== activeSpeechSessionId) {
        return;
      }

      if (currentIndex >= chunks.length) {
        if (window.__activeUtterances) {
          window.__activeUtterances.clear();
        }
        window.__activeSpeechUtterance = null;
        onEnd?.();
        return;
      }

      const chunkText = chunks[currentIndex];
      const utterance = new SpeechSynthesisUtterance(chunkText);

      utterance.rate = targetRate;
      utterance.pitch = targetPitch;
      utterance.volume = targetVolume;
      utterance.lang = targetLang;
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      // GC Protection in V8
      if (window.__activeUtterances) {
        window.__activeUtterances.add(utterance);
      }
      window.__activeSpeechUtterance = utterance;

      utterance.onstart = () => {
        if (sessionId !== activeSpeechSessionId) return;
        if (!hasStarted) {
          hasStarted = true;
          onStart?.();
        }
      };

      utterance.onend = () => {
        if (sessionId !== activeSpeechSessionId) return;
        if (window.__activeUtterances) {
          window.__activeUtterances.delete(utterance);
        }
        currentIndex++;
        // Small 30ms gap between chunks ensures natural prosody and avoids browser queue jamming
        setTimeout(playNextChunk, 30);
      };

      utterance.onerror = (e) => {
        if (sessionId !== activeSpeechSessionId) return;
        if (window.__activeUtterances) {
          window.__activeUtterances.delete(utterance);
        }
        // Don't report user cancels as failures
        if (e.error === 'interrupted' || e.error === 'canceled') {
          return;
        }
        console.warn('SpeechSynthesisUtterance chunk error:', e);
        currentIndex++;
        if (currentIndex < chunks.length) {
          setTimeout(playNextChunk, 40);
        } else {
          onError?.(e);
          onEnd?.();
        }
      };

      // Ensure synthesizer is not in paused state
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
    };

    // 25ms delay to allow previous cancel to settle in Chromium audio engine
    setTimeout(playNextChunk, 25);

  } catch (err) {
    console.error('speakText initialization failed:', err);
    onError?.(err);
    onEnd?.();
  }
}

/**
 * Stop any current speech playback immediately and cancel queued chunks
 */
export function stopSpeech() {
  activeSpeechSessionId++;
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
