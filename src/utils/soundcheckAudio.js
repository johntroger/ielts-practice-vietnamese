/**
 * soundcheckAudio.js - High-fidelity Web Audio API & Speech Synthesizer for CD-IELTS Soundcheck
 * Features:
 * - 100% zero-latency offline harmonic chime (Cambridge Exam Bells)
 * - Native Speech Synthesis standard voice check
 * - Volume dynamic scaling (0.0 to 1.0)
 * - Safe browser audio unlock
 */

let activeAudioCtx = null;

export function playIELTSSoundcheck({ volume = 1.0, onStart, onEnd } = {}) {
  try {
    stopIELTSSoundcheck();

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    
    activeAudioCtx = new AudioContext();
    if (activeAudioCtx.state === 'suspended') {
      activeAudioCtx.resume();
    }

    const now = activeAudioCtx.currentTime;
    const masterGain = activeAudioCtx.createGain();
    const clampedVol = Math.max(0.05, Math.min(1.0, Number(volume) || 1.0));
    masterGain.gain.setValueAtTime(clampedVol, now);
    masterGain.connect(activeAudioCtx.destination);

    onStart?.();

    // 1. Cambridge 4-note ascending harmonic chime: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.5Hz)
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.45 },
      { freq: 659.25, time: 0.28, dur: 0.45 },
      { freq: 783.99, time: 0.56, dur: 0.5 },
      { freq: 1046.50, time: 0.88, dur: 0.9 }
    ];

    notes.forEach(n => {
      if (!activeAudioCtx) return;
      const osc = activeAudioCtx.createOscillator();
      const gain = activeAudioCtx.createGain();
      
      // Warm chime tone: sine wave with slight overtone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, now + n.time);

      gain.gain.setValueAtTime(0, now + n.time);
      gain.gain.linearRampToValueAtTime(0.35 * clampedVol, now + n.time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur);
    });

    // 2. CD-IELTS Official Announcement Speech Check
    const speechDelayMs = 1200;
    const speechTimeout = setTimeout(() => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          'This is an IELTS listening soundcheck. If you can hear this sound clearly, please put on your headphones and adjust the volume.'
        );
        utterance.volume = clampedVol;
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        // Try to pick authentic British or English voice
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(v => v.lang === 'en-GB' || v.name.includes('UK') || v.name.includes('British') || v.lang.startsWith('en'));
        if (enVoice) {
          utterance.voice = enVoice;
        }

        utterance.onend = () => {
          onEnd?.();
        };
        utterance.onerror = () => {
          onEnd?.();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback timer if speech synthesis is not supported
        setTimeout(() => {
          onEnd?.();
        }, 1500);
      }
    }, speechDelayMs);

    return () => {
      clearTimeout(speechTimeout);
      stopIELTSSoundcheck();
      onEnd?.();
    };
  } catch (err) {
    console.warn('IELTS Soundcheck Web Audio failed:', err);
    onEnd?.();
    return false;
  }
}

export function stopIELTSSoundcheck() {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  if (activeAudioCtx) {
    try {
      activeAudioCtx.close();
    } catch (e) {}
    activeAudioCtx = null;
  }
}
