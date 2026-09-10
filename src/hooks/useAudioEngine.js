import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useAudioEngine - HTML5 Audio Engine & State Machine
 * Features:
 * - Robust state machine: 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error'
 * - Clean browser autoplay unlock without play/pause race conditions
 * - Automatic fallback source recovery on 404 / network errors
 * - Safe memory management & auto-cleanup on unmount / skill change
 * - Strict vs Practice seek controls
 * - Time tracking, duration, buffering progress, speed rate controls
 */
export function useAudioEngine({
  initialSrc = '',
  fallbackSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
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
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentActiveSrc, setCurrentActiveSrc] = useState(initialSrc);

  // Initialize HTML5 Audio instance
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioState('ready');
      setErrorMessage(null);
    };

    const handleCanPlay = () => {
      if (audioState === 'loading' || audioState === 'idle') {
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
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
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
      setCurrentActiveSrc(initialSrc);
      audio.playbackRate = playbackRate;
      audio.load();
    }
  }, [initialSrc, playbackRate]);

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
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      setIsUnlocked(true);
      setAudioState('playing');
    } catch (err) {
      if (err.name === 'AbortError') {
        // Interrupted play request (normal when seeking or quickly toggling), safe to ignore
        return;
      }
      console.warn('Audio play caught error:', err);
      if (err.name === 'NotAllowedError') {
        setErrorMessage('Trình duyệt cần tương tác: Bạn vui lòng bấm nút Play để bắt đầu nghe.');
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
        }
      } else {
        setErrorMessage('Không thể phát âm thanh: ' + (err.message || 'Lỗi mạng'));
      }
    }
  }, [fallbackSrc]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.pause();
    } catch (e) {}
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

  return {
    audioRef,
    audioState,
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
