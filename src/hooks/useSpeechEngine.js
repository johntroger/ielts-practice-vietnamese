import { useState, useEffect, useRef, useCallback } from 'react';
import { speakingSoundEffects } from '../utils/speakingSoundEffects';

/**
 * useSpeechEngine
 * Master Audio, STT & TTS Orchestrator for IELTS Speaking Studio.
 * Complies with Core Architectural Constraints:
 * 1. Zero Permanent Voice Storage: Blobs strictly in RAM, revokes URLs on cleanup.
 * 2. Chromium KeepAlive TTS: Anti-freeze timer for long examiner utterances.
 * 3. Watchdog Auto-Reconnect STT: Restarts recognition on silence timeout.
 * 4. AnalyserNode volume meter for 60 FPS organic waveform.
 */
export function useSpeechEngine({
  examinerId = 'examiner-arthur',
  onCandidateSpeechEnd = null
} = {}) {
  // 1. STT State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState(null); // null | 'not-allowed' | 'no-speech' | 'network' | 'unsupported'

  // 2. TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const lastSpokenTextRef = useRef('');

  // 3. Audio Recorder & RAM-only storage
  const [audioClips, setAudioClips] = useState({}); // { [clipId]: { blob, url, duration } }
  const currentClipIdRef = useRef('clip_current');
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingStartTimeRef = useRef(null);

  // 4. Web Audio Analyser for Visualizer
  const [analyserNode, setAnalyserNode] = useState(null);
  const [micLevel, setMicLevel] = useState(0); // 0 to 100
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const volumeIntervalRef = useRef(null);

  // Internal Refs for Engine Logic
  const recognitionRef = useRef(null);
  const isIntentionalListeningRef = useRef(false);
  const accumulatedTranscriptRef = useRef('');
  const ttsKeepAliveTimerRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  // Check Web Speech API support
  const isSpeechRecognitionSupported = typeof window !== 'undefined' && 
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  // =========================================================================
  // 1. INITIALIZE & PRELOAD VOICES (TTS)
  // =========================================================================
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (ttsKeepAliveTimerRef.current) {
        clearInterval(ttsKeepAliveTimerRef.current);
      }
    };
  }, []);

  // Helper: Pick best matched native voice for examiner profile
  const getExaminerVoice = useCallback((targetExaminerId) => {
    if (!availableVoices || availableVoices.length === 0) return null;

    if (targetExaminerId === 'examiner-oliver') {
      // US Male / Natural
      const usVoices = availableVoices.filter(v => v.lang && (v.lang === 'en-US' || v.lang.startsWith('en_US')));
      return usVoices.find(v => /male|david|alex|guy|aaron|george/i.test(v.name)) || usVoices[0] || availableVoices[0];
    }

    if (targetExaminerId === 'examiner-eleanor') {
      // UK Female
      const ukVoices = availableVoices.filter(v => v.lang && (v.lang === 'en-GB' || v.lang.startsWith('en_GB')));
      return ukVoices.find(v => /female|hazel|susan|victoria|sonia/i.test(v.name)) || ukVoices[0] || availableVoices[0];
    }

    // Default Arthur: UK Male / Natural RP
    const ukVoices = availableVoices.filter(v => v.lang && (v.lang === 'en-GB' || v.lang.startsWith('en_GB')));
    return ukVoices.find(v => /male|george|daniel|oliver/i.test(v.name)) || ukVoices[0] || availableVoices[0];
  }, [availableVoices]);

  // =========================================================================
  // 2. TTS: SPEAK METHOD WITH CHROMIUM ANTI-FREEZE
  // =========================================================================
  const speak = useCallback((text, options = {}, onEndCallback = null) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) {
      if (onEndCallback) onEndCallback();
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();
    if (ttsKeepAliveTimerRef.current) {
      clearInterval(ttsKeepAliveTimerRef.current);
      ttsKeepAliveTimerRef.current = null;
    }

    lastSpokenTextRef.current = text;
    speakingSoundEffects.playExaminerChime();

    const utterance = new SpeechSynthesisUtterance(text);
    const chosenExaminer = options.examinerId || examinerId;
    const voice = getExaminerVoice(chosenExaminer);
    
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'en-GB';
    } else {
      utterance.lang = 'en-GB';
    }

    utterance.rate = options.rate || 0.95; // Steady examiner pace
    utterance.pitch = options.pitch || 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      // Chromium Keep-Alive Interval: Pause & Resume every 9s to prevent frozen speech
      ttsKeepAliveTimerRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 9000);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (ttsKeepAliveTimerRef.current) {
        clearInterval(ttsKeepAliveTimerRef.current);
        ttsKeepAliveTimerRef.current = null;
      }
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
      if (ttsKeepAliveTimerRef.current) {
        clearInterval(ttsKeepAliveTimerRef.current);
        ttsKeepAliveTimerRef.current = null;
      }
      if (onEndCallback) onEndCallback();
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [examinerId, getExaminerVoice]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (ttsKeepAliveTimerRef.current) {
      clearInterval(ttsKeepAliveTimerRef.current);
      ttsKeepAliveTimerRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const repeatLastQuestion = useCallback((onEndCallback = null) => {
    if (lastSpokenTextRef.current) {
      speak(lastSpokenTextRef.current, {}, onEndCallback);
    }
  }, [speak]);

  // =========================================================================
  // 3. STT & MICROPHONE ENGINE (WATCHDOG AUTO-RECONNECT)
  // =========================================================================
  const initSpeechRecognition = useCallback(() => {
    if (!isSpeechRecognitionSupported) {
      setSpeechError('unsupported');
      return null;
    }

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Best recognition accuracy across accents

    recognition.onresult = (event) => {
      let liveInterim = '';
      let newlyFinalized = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          newlyFinalized += item[0].transcript + ' ';
        } else {
          liveInterim += item[0].transcript;
        }
      }

      if (newlyFinalized) {
        accumulatedTranscriptRef.current += newlyFinalized;
        setTranscript(accumulatedTranscriptRef.current.trim());
      }
      setInterimTranscript(liveInterim.trim());
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setSpeechError('not-allowed');
        isIntentionalListeningRef.current = false;
        setIsListening(false);
      } else if (event.error === 'no-speech') {
        // Normal silence timeout in Chrome, watchdog will auto-restart if still intentional
      } else if (event.error === 'network') {
        setSpeechError('network');
      }
    };

    recognition.onend = () => {
      // Watchdog Auto-Reconnect: if user hasn't explicitly clicked stop, restart immediately
      if (isIntentionalListeningRef.current) {
        try {
          recognition.start();
        } catch (err) {
          setTimeout(() => {
            if (isIntentionalListeningRef.current) {
              try { recognition.start(); } catch (e) {}
            }
          }, 80);
        }
      } else {
        setIsListening(false);
        setInterimTranscript('');
      }
    };

    return recognition;
  }, [isSpeechRecognitionSupported]);

  // Start candidate microphone listening + media recorder
  const startListening = useCallback(async (clipId = 'clip_current') => {
    setSpeechError(null);
    currentClipIdRef.current = clipId;
    isIntentionalListeningRef.current = true;

    // 1. Setup AudioContext & Volume Analyser Node
    try {
      if (!mediaStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        mediaStreamRef.current = stream;

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          const actx = new AudioContextClass();
          audioContextRef.current = actx;
          const source = actx.createMediaStreamSource(stream);
          const analyser = actx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          setAnalyserNode(analyser);

          // Volume Level Polling
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
          volumeIntervalRef.current = setInterval(() => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < 8; i++) sum += dataArray[i];
            const level = Math.min(100, Math.round((sum / 8) * (100 / 128)));
            setMicLevel(level);
          }, 100);
        }
      }
    } catch (err) {
      console.warn('Microphone permission error:', err);
      setSpeechError('not-allowed');
      isIntentionalListeningRef.current = false;
      setIsListening(false);
      return;
    }

    // 2. Setup MediaRecorder for RAM-only audio clip
    try {
      if (window.MediaRecorder && mediaStreamRef.current) {
        recordedChunksRef.current = [];
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';

        const recorder = mimeType 
          ? new MediaRecorder(mediaStreamRef.current, { mimeType })
          : new MediaRecorder(mediaStreamRef.current);

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const duration = recordingStartTimeRef.current 
            ? Math.round((Date.now() - recordingStartTimeRef.current) / 1000) 
            : 0;
          const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          const url = URL.createObjectURL(blob);

          setAudioClips(prev => ({
            ...prev,
            [currentClipIdRef.current]: {
              blob,
              url,
              duration,
              createdAt: Date.now()
            }
          }));
        };

        recordingStartTimeRef.current = Date.now();
        recorder.start(250); // Slice chunks every 250ms
        mediaRecorderRef.current = recorder;
      }
    } catch (err) {
      console.warn('MediaRecorder error:', err);
    }

    // 3. Start Speech Recognition
    if (!recognitionRef.current) {
      recognitionRef.current = initSpeechRecognition();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        // Already started
        setIsListening(true);
      }
    }
  }, [initSpeechRecognition]);

  // Stop listening and finalize audio clip
  const stopListening = useCallback(() => {
    isIntentionalListeningRef.current = false;
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }

    setInterimTranscript('');
  }, []);

  const resetTranscript = useCallback(() => {
    accumulatedTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // =========================================================================
  // 4. ZERO PERMANENT VOICE STORAGE CLEANUP
  // =========================================================================
  const deleteAudioClip = useCallback((clipId) => {
    setAudioClips(prev => {
      const target = prev[clipId];
      if (target && target.url) {
        try { URL.revokeObjectURL(target.url); } catch (e) {}
      }
      const updated = { ...prev };
      delete updated[clipId];
      return updated;
    });
  }, []);

  const clearAudioClips = useCallback(() => {
    // Revoke all in-memory Blob URLs immediately to free browser RAM
    Object.values(audioClips).forEach(clip => {
      if (clip && clip.url) {
        try {
          URL.revokeObjectURL(clip.url);
        } catch (e) {}
      }
    });
    setAudioClips({});
  }, [audioClips]);

  // Full Unmount Cleanup
  useEffect(() => {
    return () => {
      // 1. Stop Speech Synthesis
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (ttsKeepAliveTimerRef.current) {
        clearInterval(ttsKeepAliveTimerRef.current);
      }

      // 2. Stop Recognition
      isIntentionalListeningRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }

      // 3. Stop MediaRecorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }

      // 4. Stop Hardware Audio Tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
          try { track.stop(); } catch (e) {}
        });
        mediaStreamRef.current = null;
      }

      // 5. Close Audio Context & clear interval
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try { audioContextRef.current.close(); } catch (e) {}
      }

      // 6. Revoke memory Blobs
      clearAudioClips();
    };
  }, [clearAudioClips]);

  return {
    // STT State & Methods
    isListening,
    transcript,
    interimTranscript,
    speechError,
    isSpeechRecognitionSupported,
    startListening,
    stopListening,
    resetTranscript,

    // TTS State & Methods
    isSpeaking,
    speak,
    stopSpeaking,
    repeatLastQuestion,
    availableVoices,

    // Audio Clips (RAM-only)
    audioClips,
    deleteAudioClip,
    clearAudioClips,

    // Volume Meter & Visualizer
    analyserNode,
    micLevel
  };
}
