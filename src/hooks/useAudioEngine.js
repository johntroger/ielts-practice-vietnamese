import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useAudioEngine - HTML5 Audio Engine & State Machine
 * Features:
 * - Robust state machine: 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error'
 * - Clean browser autoplay unlock without play/pause race conditions
 * - Direct DOM element state checking to avoid asynchronous race conditions on fast clicks
 * - Exposes boolean helpers: isPlaying, isLoading, isEnded
 * - Automatic fallback source recovery on 404 / network errors
 * - Safe memory management & auto-cleanup on unmount / skill change
 * - Strict vs Practice seek controls
 * - Time tracking, duration, buffering progress, speed rate controls
 */
export function useAudioEngine({
  initialSrc = '',
  fallbackSrc = 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
  examMode = 'practice', // 'strict' | 'practice'
  onTimeUpdate = null,
  onEnded = null,
  onError = null
} = {}) {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  
  const [audioState, setAudioState] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error'
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [isBufferReady, setIsBufferReady] = useState(false);
  const [isStalled, setIsStalled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentActiveSrc, setCurrentActiveSrc] = useState(initialSrc);

  // Helper to compute buffered percent and check minimum buffer readiness
  const updateBufferInfo = useCallback((audio) => {
    if (!audio || !audio.duration || audio.duration <= 0) return;
    try {
      if (audio.buffered.length > 0) {
        // Find buffer chunk covering currentTime or first chunk
        let currentLoadedEnd = 0;
        const cur = audio.currentTime || 0;
        for (let i = 0; i < audio.buffered.length; i++) {
          const start = audio.buffered.start(i);
          const end = audio.buffered.end(i);
          if (cur >= start && cur <= end) {
            currentLoadedEnd = end;
            break;
          }
        }
        if (currentLoadedEnd === 0 && audio.buffered.length > 0) {
          currentLoadedEnd = audio.buffered.end(audio.buffered.length - 1);
        }

        const pct = Math.min(100, Math.round((currentLoadedEnd / audio.duration) * 100));
        setBufferedPercent(pct);

        // Buffer is considered ready if either canplaythrough triggered, or at least 3% or 10 seconds loaded ahead
        const secondsAhead = currentLoadedEnd - cur;
        if (pct >= 3 || secondsAhead >= 10 || currentLoadedEnd >= audio.duration - 1) {
          setIsBufferReady(true);
        }
      }
    } catch (e) {}
  }, []);

  // Initialize HTML5 Audio instance
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioState('ready');
      setErrorMessage(null);
      updateBufferInfo(audio);
    };

    const handleCanPlay = () => {
      setAudioState(prev => (prev === 'loading' || prev === 'idle' ? 'ready' : prev));
      updateBufferInfo(audio);
    };

    const handleCanPlayThrough = () => {
      setIsBufferReady(true);
      setIsStalled(false);
      updateBufferInfo(audio);
    };

    const handleProgress = () => {
      updateBufferInfo(audio);
    };

    const handleWaiting = () => {
      setIsStalled(true);
      setAudioState('loading');
    };

    const handleStalled = () => {
      setIsStalled(true);
    };

    const handlePlaying = () => {
      setAudioState('playing');
      setIsStalled(false);
      setErrorMessage(null);
    };

    const handleTimeUpdate = () => {
      const cur = audio.currentTime || 0;
      setCurrentTime(cur);
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
      if (onTimeUpdate) {
        onTimeUpdate(cur);
      }
      updateBufferInfo(audio);
    };

    const handlePlay = () => {
      setAudioState('playing');
      setIsStalled(false);
      setErrorMessage(null);
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
    };

    const handlePause = () => {
      if (audio.currentTime >= audio.duration && audio.duration > 0) {
        setAudioState('ended');
      } else {
        setAudioState('paused');
      }
    };

    const handleEnded = () => {
      setAudioState('ended');
      if (onEnded) {
        onEnded();
      }
    };

    const handleError = (e) => {
      console.warn('Audio error on src:', audio.src, e);
      // Auto fallback if initial source fails
      if (fallbackSrc && audio.src !== fallbackSrc) {
        console.log('Switching to fallback audio source:', fallbackSrc);
        audio.src = fallbackSrc;
        setCurrentActiveSrc(fallbackSrc);
        audio.load();
        return;
      }
      setAudioState('error');
      const err = audio.error ? ('Lỗi âm thanh: code ' + audio.error.code) : 'Không thể tải tệp âm thanh';
      setErrorMessage(err);
      if (onError) {
        onError(err);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    if (initialSrc) {
      setAudioState('loading');
      audio.src = initialSrc;
      setCurrentActiveSrc(initialSrc);
      audio.load();
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('progress', handleProgress);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      
      try {
        audio.pause();
        audio.src = '';
        audio.load();
      } catch (e) {}

      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {}
        audioContextRef.current = null;
      }
      audioRef.current = null;
    };
  }, []);

  // Update source when initialSrc changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (initialSrc && audio.src !== initialSrc) {
      setAudioState('loading');
      setCurrentTime(0);
      setBufferedPercent(0);
      audio.src = initialSrc;
      setCurrentActiveSrc(initialSrc);
      audio.playbackRate = playbackRate;
      audio.load();
    }
  }, [initialSrc, playbackRate]);

  // Real-time smooth timer ticker while playing (ensures ultra-responsive UI updates)
  useEffect(() => {
    let timerId = null;
    if (audioState === 'playing') {
      timerId = setInterval(() => {
        const audio = audioRef.current;
        if (audio && !audio.paused && !audio.ended) {
          const cur = audio.currentTime || 0;
          setCurrentTime(cur);
          if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
            setDuration(audio.duration);
          }
          if (onTimeUpdate) {
            onTimeUpdate(cur);
          }
        }
      }, 100);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [audioState, onTimeUpdate]);

  // Unlock browser autoplay policy on user click
  const unlockAudio = useCallback(async () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && !audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      setIsUnlocked(true);
      return true;
    } catch (err) {
      console.warn('Unlock audio context note:', err);
      setIsUnlocked(true);
      return true;
    }
  }, []);

  // Play controls
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume().catch(() => {});
      }
      setErrorMessage(null);
      setAudioState('loading');
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      setIsUnlocked(true);
      setAudioState('playing');
    } catch (err) {
      if (err.name === 'AbortError') {
        // Interrupted play request (rapid clicking or pause), safe to ignore
        return;
      }
      console.warn('Audio play caught error:', err);
      if (err.name === 'NotAllowedError') {
        setErrorMessage('Trình duyệt cần tương tác: Bạn vui lòng bấm nút Play để bắt đầu nghe.');
        setAudioState('paused');
      } else if (fallbackSrc && audio.src !== fallbackSrc) {
        // Attempt fallback
        audio.src = fallbackSrc;
        setCurrentActiveSrc(fallbackSrc);
        audio.load();
        try {
          await audio.play();
          setErrorMessage(null);
          setAudioState('playing');
        } catch (e) {
          setErrorMessage('Vui lòng kiểm tra kết nối mạng để phát âm thanh.');
          setAudioState('error');
        }
      } else {
        setErrorMessage('Không thể phát âm thanh: ' + (err.message || 'Lỗi mạng'));
        setAudioState('error');
      }
    }
  }, [fallbackSrc]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.pause();
      setAudioState('paused');
    } catch (e) {}
  }, []);

  // Direct element check to avoid state desync on fast clicking
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused && !audio.ended) {
      pause();
    } else {
      play();
    }
  }, [pause, play]);

  // Seeking
  const seek = useCallback((targetSeconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (examMode === 'strict') {
      console.warn('Seeking is locked in Strict Exam Mode.');
      return;
    }

    const safeTime = Math.max(0, Math.min(Number(targetSeconds) || 0, audio.duration || 1800));
    try {
      audio.currentTime = safeTime;
      setCurrentTime(safeTime);
    } catch (e) {}
  }, [examMode]);

  // Volume
  const changeVolume = useCallback((newVol) => {
    const audio = audioRef.current;
    if (!audio) return;
    const safeVol = Math.max(0, Math.min(1, Number(newVol) || 0));
    audio.volume = safeVol;
    setVolume(safeVol);
    if (safeVol > 0 && isMuted) {
      setIsMuted(false);
      audio.muted = false;
    }
  }, [isMuted]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !isMuted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
  }, [isMuted]);

  // Speed rate (Practice only)
  const changePlaybackRate = useCallback((rate) => {
    if (examMode === 'strict') {
      console.warn('Playback rate cannot be changed in Strict Exam Mode.');
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    const validRate = Number(rate) || 1.0;
    audio.playbackRate = validRate;
    setPlaybackRate(validRate);
  }, [examMode]);

  // Calculated boolean status
  const isPlaying = audioState === 'playing';
  const isLoading = audioState === 'loading';
  const isEnded = audioState === 'ended';

  // Force preload method (useful for mobile user touch / soundcheck)
  const forcePreload = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    await unlockAudio();
    try {
      if (audioState === 'idle' || audioState === 'ready') {
        audio.load();
      }
    } catch (e) {}
  }, [unlockAudio, audioState]);

  // Dynamic load new audio URL
  const loadAudio = useCallback((newSrc) => {
    const audio = audioRef.current;
    if (!audio || !newSrc) return;
    setAudioState('loading');
    setCurrentTime(0);
    setErrorMessage(null);
    setIsBufferReady(false);
    setIsStalled(false);
    audio.src = newSrc;
    setCurrentActiveSrc(newSrc);
    audio.load();
  }, []);

  return {
    audioRef,
    audioState,
    isPlaying,
    isLoading,
    isEnded,
    isBufferReady,
    isStalled,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    bufferedPercent,
    errorMessage,
    isUnlocked,
    currentActiveSrc,
    unlockAudio,
    forcePreload,
    loadAudio,
    play,
    pause,
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
    changePlaybackRate,
    clearError: () => setErrorMessage(null)
  };
}
