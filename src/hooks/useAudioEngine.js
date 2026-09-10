import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useAudioEngine - HTML5 Audio Engine & State Machine with Web Audio DynamicsCompressor
 * Features:
 * - Robust state machine: 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error'
 * - Web Audio API DynamicsCompressorNode for automatic volume normalization (chống chói tai)
 * - Autoplay policy unlocking mechanism
 * - Safe memory management & auto-cleanup on unmount / skill change
 * - Strict vs Practice seek controls
 * - Time tracking, duration, buffering progress, speed rate controls
 */
export function useAudioEngine({
  initialSrc = '',
  examMode = 'practice', // 'strict' (khóa tua) | 'practice' (tự do tua)
  onTimeUpdate = null,
  onEnded = null,
  onError = null
} = {}) {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const compressorRef = useRef(null);
  
  const [audioState, setAudioState] = useState('idle'); // 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error'
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Initialize HTML5 Audio instance & Web Audio DynamicsCompressor
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    // Optional Web Audio Compressor setup for audio leveling
    const setupAudioCompressor = () => {
      if (audioContextRef.current) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;

          // Connect audio element through DynamicsCompressorNode
          const source = ctx.createMediaElementSource(audio);
          const compressor = ctx.createDynamicsCompressor();
          compressor.threshold.setValueAtTime(-24, ctx.currentTime);
          compressor.knee.setValueAtTime(30, ctx.currentTime);
          compressor.ratio.setValueAtTime(12, ctx.currentTime);
          compressor.attack.setValueAtTime(0.003, ctx.currentTime);
          compressor.release.setValueAtTime(0.25, ctx.currentTime);
          compressorRef.current = compressor;

          source.connect(compressor);
          compressor.connect(ctx.destination);
        }
      } catch (err) {
        console.warn('Web Audio DynamicsCompressor not initialized (fallback to direct playback):', err);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioState('ready');
      setErrorMessage(null);
    };

    const handleCanPlayThrough = () => {
      if (audioState === 'loading') {
        setAudioState('ready');
      }
    };

    const handleTimeUpdate = () => {
      const cur = audio.currentTime || 0;
      setCurrentTime(cur);
      if (onTimeUpdate) {
        onTimeUpdate(cur);
      }

      // Track buffer progress
      if (audio.buffered.length > 0 && audio.duration > 0) {
        try {
          const loaded = audio.buffered.end(audio.buffered.length - 1);
          setBufferedPercent(Math.min(100, Math.round((loaded / audio.duration) * 100)));
        } catch (e) {}
      }
    };

    const handlePlay = () => {
      setAudioState('playing');
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
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
      console.warn('useAudioEngine error:', e);
      setAudioState('error');
      const err = audio.error ? `Lỗi âm thanh: code ${audio.error.code}` : 'Không thể tải tệp âm thanh';
      setErrorMessage(err);
      if (onError) {
        onError(err);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Initial source if provided
    if (initialSrc) {
      setAudioState('loading');
      audio.src = initialSrc;
      audio.load();
    }

    // Cleanup when component unmounts
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
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
      audio.playbackRate = playbackRate;
      audio.load();
    }
  }, [initialSrc, playbackRate]);

  // Unlock browser autoplay policy on user click
  const unlockAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        audio.pause();
      }
      setIsUnlocked(true);
      return true;
    } catch (err) {
      console.warn('Unlock audio note (normal before track chosen):', err);
      setIsUnlocked(true);
      return false;
    }
  }, []);

  // Play controls
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      setIsUnlocked(true);
    } catch (err) {
      console.error('Playback failed:', err);
      setAudioState('error');
      setErrorMessage('Trình duyệt chặn tự động phát âm thanh. Vui lòng bấm Bắt đầu làm bài.');
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (audioState === 'playing') {
      pause();
    } else {
      play();
    }
  }, [audioState, pause, play]);

  // Seeking
  const seek = useCallback((targetSeconds) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    if (examMode === 'strict') {
      console.warn('Seeking is locked in Strict Exam Mode.');
      return;
    }

    const clamped = Math.max(0, Math.min(targetSeconds, audio.duration));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, [examMode]);

  // Jump to specific evidence timestamp (used for review & diagnosis)
  const jumpToEvidence = useCallback((timestampSeconds) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const clamped = Math.max(0, Math.min(timestampSeconds, audio.duration));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
    play();
  }, [play]);

  // Speed controls
  const changePlaybackRate = useCallback((rate) => {
    const audio = audioRef.current;
    if (!audio) return;
    const validRate = Math.max(0.5, Math.min(2.0, rate));
    audio.playbackRate = validRate;
    setPlaybackRate(validRate);
  }, []);

  // Volume controls
  const changeVolume = useCallback((vol) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(1.0, vol));
    audio.volume = clamped;
    setVolume(clamped);
    if (clamped === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  }, [isMuted]);

  return {
    audioRef,
    audioState,
    isPlaying: audioState === 'playing',
    isLoading: audioState === 'loading',
    isEnded: audioState === 'ended',
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    bufferedPercent,
    errorMessage,
    isUnlocked,
    play,
    pause,
    togglePlay,
    seek,
    jumpToEvidence,
    changePlaybackRate,
    changeVolume,
    toggleMute,
    unlockAudio
  };
}
