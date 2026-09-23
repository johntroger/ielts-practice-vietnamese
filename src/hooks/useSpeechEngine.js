import { useState, useEffect, useRef, useCallback } from 'react';
import { speakingSoundEffects } from '../utils/speakingSoundEffects';
import { splitTextIntoUtteranceChunks } from '../utils/speechAudio';

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
  const [speechConfidenceStats, setSpeechConfidenceStats] = useState({
    averageConfidence: 1.0,
    confidenceHistory: [],
    lowConfidenceCount: 0
  });
  const confidenceHistoryRef = useRef([]);

  // 2. TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const lastSpokenTextRef = useRef('');

  // 3. Audio Recorder & RAM-only storage
  const [audioClips, setAudioClips] = useState({}); // { [clipId]: { blob, url, duration } }
  const audioClipsRef = useRef({});
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
  const ttsSessionIdRef = useRef(0);
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
    };
  }, []);

  // Helper: Pick best matched native voice for examiner profile
  const getExaminerVoice = useCallback((targetExaminerId) => {
    let voices = availableVoices;
    // If state availableVoices is empty, query live voices from window.speechSynthesis
    if ((!voices || voices.length === 0) && typeof window !== 'undefined' && window.speechSynthesis) {
      voices = window.speechSynthesis.getVoices() || [];
    }
    if (!voices || voices.length === 0) return null;

    if (targetExaminerId === 'examiner-oliver') {
      // US Male / Natural (Supports Edge Microsoft Natural + Chrome Google + Standard US)
      const usVoices = voices.filter(v => v.lang && (v.lang === 'en-US' || v.lang.startsWith('en_US') || v.lang.startsWith('en-US')));
      return usVoices.find(v => /ryan|guy|christopher|eric|natural.*us|male|david|alex|aaron/i.test(v.name)) 
        || usVoices[0] 
        || voices.find(v => v.lang && v.lang.startsWith('en'))
        || voices[0];
    }

    if (targetExaminerId === 'examiner-eleanor') {
      // UK Female (Supports Edge Microsoft Natural + Chrome Google UK + Standard UK)
      const ukVoices = voices.filter(v => v.lang && (v.lang === 'en-GB' || v.lang.startsWith('en_GB') || v.lang.startsWith('en-GB')));
      return ukVoices.find(v => /libby|sonia|hazel|susan|victoria|natural.*uk|female/i.test(v.name)) 
        || ukVoices[0] 
        || voices.find(v => v.lang && v.lang.startsWith('en'))
        || voices[0];
    }

    // Default Arthur: UK Male / Natural RP (Supports Edge Microsoft Ryan / George + Chrome Google UK)
    const ukVoices = voices.filter(v => v.lang && (v.lang === 'en-GB' || v.lang.startsWith('en_GB') || v.lang.startsWith('en-GB')));
    return ukVoices.find(v => /ryan|george|arthur|daniel|oliver|natural.*uk|male/i.test(v.name)) 
      || ukVoices[0] 
      || voices.find(v => v.lang && v.lang.startsWith('en'))
      || voices[0];
  }, [availableVoices]);

  // =========================================================================
  // 2. TTS: SPEAK METHOD WITH SENTENCE CHUNKING (NO 10S CUTOFF) & GC PROTECTION
  // =========================================================================
  const speak = useCallback((text, options = {}, onEndCallback = null) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const sessionId = ++ttsSessionIdRef.current;

    // Clear previous speech immediately
    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (e) {}

    if (ttsKeepAliveTimerRef.current) {
      clearInterval(ttsKeepAliveTimerRef.current);
      ttsKeepAliveTimerRef.current = null;
    }

    lastSpokenTextRef.current = text;
    speakingSoundEffects.playExaminerChime();

    const chunks = splitTextIntoUtteranceChunks(text, 140);
    if (chunks.length === 0) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const chosenExaminer = options.examinerId || examinerId;
    const voice = getExaminerVoice(chosenExaminer);
    const targetLang = voice?.lang || 'en-GB';
    const targetRate = options.rate || 0.95;
    const targetPitch = options.pitch || 1.0;

    let currentIndex = 0;
    let hasEnded = false;

    const finishSpeech = () => {
      if (hasEnded) return;
      hasEnded = true;
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
      if (typeof window !== 'undefined' && window.__ielts_active_utterance) {
        window.__ielts_active_utterance = null;
      }
      if (onEndCallback) onEndCallback();
    };

    const playNextChunk = () => {
      if (sessionId !== ttsSessionIdRef.current) return;

      if (currentIndex >= chunks.length) {
        finishSpeech();
        return;
      }

      const chunkText = chunks[currentIndex];
      const utterance = new SpeechSynthesisUtterance(chunkText);

      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = targetLang;
      utterance.volume = 1.0;
      utterance.rate = targetRate;
      utterance.pitch = targetPitch;

      // GC Protection in Chromium
      currentUtteranceRef.current = utterance;
      if (typeof window !== 'undefined') {
        window.__ielts_active_utterance = utterance;
      }

      utterance.onstart = () => {
        if (sessionId !== ttsSessionIdRef.current) return;
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        if (sessionId !== ttsSessionIdRef.current) return;
        currentIndex++;
        // Small 30ms gap between sentence clauses avoids audio queue stutter
        setTimeout(playNextChunk, 30);
      };

      utterance.onerror = (e) => {
        if (sessionId !== ttsSessionIdRef.current) return;
        if (e.error === 'interrupted' || e.error === 'canceled') {
          return;
        }
        console.warn('Speech synthesis chunk error:', e);
        currentIndex++;
        if (currentIndex < chunks.length) {
          setTimeout(playNextChunk, 40);
        } else {
          finishSpeech();
        }
      };

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
    };

    setIsSpeaking(true);
    setTimeout(playNextChunk, 25);
  }, [examinerId, getExaminerVoice]);

  const stopSpeaking = useCallback(() => {
    ttsSessionIdRef.current++;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (ttsKeepAliveTimerRef.current) {
      clearInterval(ttsKeepAliveTimerRef.current);
      ttsKeepAliveTimerRef.current = null;
    }
    currentUtteranceRef.current = null;
    if (typeof window !== 'undefined') {
      window.__ielts_active_utterance = null;
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
        if (item && item[0]) {
          const piece = item[0].transcript || '';
          if (item.isFinal) {
            newlyFinalized += piece.trim() + ' ';
            const conf = typeof item[0].confidence === 'number' && item[0].confidence > 0
              ? item[0].confidence
              : 0.88;
            confidenceHistoryRef.current.push(conf);
          } else {
            liveInterim += piece;
          }
        }
      }

      if (newlyFinalized) {
        accumulatedTranscriptRef.current = (accumulatedTranscriptRef.current + ' ' + newlyFinalized).replace(/\s+/g, ' ').trim();
        setTranscript(accumulatedTranscriptRef.current);

        const history = confidenceHistoryRef.current;
        if (history.length > 0) {
          const sum = history.reduce((a, b) => a + b, 0);
          const avg = Math.round((sum / history.length) * 100) / 100;
          const lowCount = history.filter(c => c < 0.70).length;
          setSpeechConfidenceStats({
            averageConfidence: avg,
            confidenceHistory: [...history],
            lowConfidenceCount: lowCount
          });
        }
      }
      setInterimTranscript(liveInterim.trim());
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition status notice:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        // If STT cloud service is restricted, do NOT kill audio recording!
        // We have direct Gemini Multimodal Audio STT fallback.
        setSpeechError('stt-service-unavailable');
      } else if (event.error === 'no-speech') {
        // Silence pause detected in Chrome, watchdog will auto-restart if still intentional
      } else if (event.error === 'network') {
        // Network drop in cloud STT - do not crash candidate audio recording
        console.warn('Speech recognition network warning');
      } else if (event.error === 'aborted') {
        // Normal abort
      }
    };

    recognition.onend = () => {
      // Watchdog Auto-Reconnect: if candidate is still actively recording, restart STT cleanly
      if (isIntentionalListeningRef.current) {
        setTimeout(() => {
          if (isIntentionalListeningRef.current) {
            try {
              recognition.start();
            } catch (err) {
              // If current recognition instance is in invalid state, recreate fresh instance
              try {
                const fresh = initSpeechRecognition();
                recognitionRef.current = fresh;
                if (fresh) fresh.start();
              } catch (e) {
                console.warn('Watchdog STT restart warning:', e);
              }
            }
          }
        }, 120);
      } else {
        setInterimTranscript('');
      }
    };

    return recognition;
  }, [isSpeechRecognitionSupported]);

  // Start candidate microphone listening + media recorder (Fault-Tolerant & Reliable)
  const startListening = useCallback(async (clipId = 'clip_current') => {
    setSpeechError(null);
    currentClipIdRef.current = clipId;
    isIntentionalListeningRef.current = true;

    // 1. Check browser mediaDevices support
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errMsg = 'Trình duyệt của bạn không hỗ trợ tính năng ghi âm qua Micro (navigator.mediaDevices.getUserMedia). Vui lòng sử dụng Google Chrome, Edge hoặc Safari và truy cập qua HTTPS.';
      setSpeechError('unsupported');
      isIntentionalListeningRef.current = false;
      setIsListening(false);
      throw new Error(errMsg);
    }

    // 2. Request microphone stream
    let stream = null;
    try {
      if (
        !mediaStreamRef.current || 
        !mediaStreamRef.current.active || 
        mediaStreamRef.current.getAudioTracks().length === 0 || 
        mediaStreamRef.current.getAudioTracks().some(t => t.readyState === 'ended')
      ) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        mediaStreamRef.current = stream;
      } else {
        stream = mediaStreamRef.current;
      }
    } catch (err) {
      console.warn('Microphone permission error:', err);
      setSpeechError('not-allowed');
      isIntentionalListeningRef.current = false;
      setIsListening(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('Trình duyệt đang CHẶN quyền truy cập Microphone! Hãy nhấp vào biểu tượng Ổ khóa (🔒) bên trái thanh địa chỉ URL, chọn Micro và chuyển sang "Cho phép (Allow)".');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        throw new Error('Không tìm thấy thiết bị Microphone nào được cắm vào máy tính/điện thoại của bạn.');
      } else {
        throw new Error('Không thể kết nối Micro: ' + (err.message || err.name));
      }
    }

    // Microphone acquired! Turn UI to listening immediately
    setIsListening(true);

    // 3. Setup AudioContext & Volume Analyser Node (Safely isolated)
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass && stream) {
        let actx = audioContextRef.current;
        if (!actx || actx.state === 'closed') {
          actx = new AudioContextClass();
          audioContextRef.current = actx;
        }
        if (actx.state === 'suspended') {
          await actx.resume();
        }
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
        }, 80);
      }
    } catch (actxErr) {
      console.warn('AudioContext visualizer warning (recording continues):', actxErr);
    }

    // 4. Setup MediaRecorder for RAM-only audio clip (Safely isolated)
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }

      if (window.MediaRecorder && stream) {
        recordedChunksRef.current = [];
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : '';

        const recorder = mimeType 
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);

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

          setAudioClips(prev => {
            const updated = {
              ...prev,
              [currentClipIdRef.current]: {
                blob,
                url,
                duration,
                createdAt: Date.now()
              }
            };
            audioClipsRef.current = updated;
            return updated;
          });
        };

        recordingStartTimeRef.current = Date.now();
        recorder.start(250); // Slice chunks every 250ms
        mediaRecorderRef.current = recorder;
      }
    } catch (mrErr) {
      console.warn('MediaRecorder error:', mrErr);
    }

    // 5. Start Speech Recognition (Safely isolated so STT issues do NOT break audio recording)
    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
        recognitionRef.current = null;
      }

      const recognition = initSpeechRecognition();
      recognitionRef.current = recognition;

      if (recognition) {
        try {
          recognition.start();
        } catch (sttErr) {
          console.warn('Speech recognition immediate start notice:', sttErr);
        }
      }
    } catch (recErr) {
      console.warn('Speech recognition setup warning:', recErr);
    }
  }, [initSpeechRecognition]);

  // Stop listening instantly and finalize audio clip
  const stopListening = useCallback(() => {
    isIntentionalListeningRef.current = false;
    // OPTIMISTIC UI: Instant visual feedback to user (0ms lag)
    setIsListening(false);
    setInterimTranscript('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        try { recognitionRef.current.abort(); } catch (err) {}
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
  }, []);

  const resetTranscript = useCallback(() => {
    accumulatedTranscriptRef.current = '';
    confidenceHistoryRef.current = [];
    setTranscript('');
    setInterimTranscript('');
    setSpeechConfidenceStats({
      averageConfidence: 1.0,
      confidenceHistory: [],
      lowConfidenceCount: 0
    });
  }, []);

  const setCustomTranscript = useCallback((text) => {
    accumulatedTranscriptRef.current = text || '';
    setTranscript(text || '');
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
      audioClipsRef.current = updated;
      return updated;
    });
  }, []);

  const clearAudioClips = useCallback(() => {
    // Revoke all in-memory Blob URLs immediately to free browser RAM
    Object.values(audioClipsRef.current).forEach(clip => {
      if (clip && clip.url) {
        try {
          URL.revokeObjectURL(clip.url);
        } catch (e) {}
      }
    });
    audioClipsRef.current = {};
    setAudioClips({});
  }, []);

  // Full Unmount Cleanup (Strictly executes ONCE on component unmount)
  useEffect(() => {
    return () => {
      // 1. Stop Speech Synthesis
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (ttsKeepAliveTimerRef.current) {
        clearInterval(ttsKeepAliveTimerRef.current);
        ttsKeepAliveTimerRef.current = null;
      }

      // 2. Stop Recognition
      isIntentionalListeningRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
        recognitionRef.current = null;
      }

      // 3. Stop MediaRecorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
        mediaRecorderRef.current = null;
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
        volumeIntervalRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try { audioContextRef.current.close(); } catch (e) {}
        audioContextRef.current = null;
      }

      // 6. Revoke memory Blobs
      Object.values(audioClipsRef.current).forEach(clip => {
        if (clip && clip.url) {
          try { URL.revokeObjectURL(clip.url); } catch (e) {}
        }
      });
      audioClipsRef.current = {};
    };
  }, []);

  return {
    // STT State & Methods
    isListening,
    transcript,
    interimTranscript,
    speechError,
    speechConfidenceStats,
    isSpeechRecognitionSupported,
    startListening,
    stopListening,
    resetTranscript,
    setCustomTranscript,

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
