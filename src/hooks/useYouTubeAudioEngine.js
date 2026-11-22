import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useYouTubeAudioEngine
 *
 * Wraps the official YouTube IFrame Player API with the exact same interface as `useAudioEngine`
 * so `MusicAudioControlDock` and `MusicListeningStudioModal` can seamlessly control both
 * Cloudflare R2 MP3 tracks and official US-UK YouTube Hit embeds (Auto-Loop, Auto-Pause, Seek, Speed).
 */

let ytApiPromise = null;

function loadYouTubeIframeApi() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevReady === 'function') {
        try { prevReady(); } catch (e) {}
      }
      resolve(window.YT);
    };

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      document.head.appendChild(tag);
    }
  });

  return ytApiPromise;
}

export function useYouTubeAudioEngine({
  youtubeId = '',
  enabled = false
} = {}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const pollRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Initialize / switch YouTube video when enabled & youtubeId changes
  useEffect(() => {
    if (!enabled || !youtubeId) {
      setIsPlaying(false);
      setIsLoading(false);
      setCurrentTime(0);
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        try { playerRef.current.pauseVideo(); } catch (e) {}
      }
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentTime(0);

    loadYouTubeIframeApi().then((YT) => {
      if (cancelled || !containerRef.current) return;

      // If player already exists, load the new videoId
      if (playerRef.current && typeof playerRef.current.cueVideoById === 'function') {
        try {
          playerRef.current.cueVideoById(youtubeId);
          setIsLoading(false);
          return;
        } catch (e) {}
      }

      // Create fresh YT.Player inside containerRef
      const mountEl = document.createElement('div');
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(mountEl);

      playerRef.current = new YT.Player(mountEl, {
        videoId: youtubeId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : undefined
        },
        events: {
          onReady: (ev) => {
            if (cancelled) return;
            setIsLoading(false);
            try {
              const dur = ev.target.getDuration();
              if (dur > 0) setDuration(dur);
            } catch (e) {}
          },
          onStateChange: (ev) => {
            if (cancelled) return;
            const YTState = window.YT?.PlayerState;
            if (!YTState) return;
            if (ev.data === YTState.PLAYING) {
              setIsPlaying(true);
              setIsLoading(false);
              try {
                const dur = ev.target.getDuration();
                if (dur > 0) setDuration(dur);
              } catch (e) {}
            } else if (ev.data === YTState.PAUSED || ev.data === YTState.ENDED || ev.data === YTState.CUED) {
              setIsPlaying(false);
              setIsLoading(false);
            } else if (ev.data === YTState.BUFFERING) {
              setIsLoading(true);
            }
          },
          onError: () => {
            if (cancelled) return;
            setIsLoading(false);
            setIsPlaying(false);
            setErrorMessage('Video cannot be embedded or is unavailable. Please try another track.');
          }
        }
      });
    });

    // High-frequency 100ms time poll while enabled
    pollRef.current = setInterval(() => {
      const p = playerRef.current;
      if (p && typeof p.getCurrentTime === 'function') {
        try {
          const cur = p.getCurrentTime() || 0;
          setCurrentTime(cur);
          const dur = p.getDuration();
          if (dur > 0) setDuration(dur);
        } catch (e) {}
      }
    }, 100);

    return () => {
      cancelled = true;
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [enabled, youtubeId]);

  // Cleanup player on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try { playerRef.current.destroy(); } catch (e) {}
      }
      playerRef.current = null;
    };
  }, []);

  const play = useCallback(() => {
    try {
      playerRef.current?.playVideo?.();
    } catch (e) {}
  }, []);

  const pause = useCallback(() => {
    try {
      playerRef.current?.pauseVideo?.();
    } catch (e) {}
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((seconds) => {
    const safeSec = Math.max(0, Number(seconds) || 0);
    setCurrentTime(safeSec);
    try {
      playerRef.current?.seekTo?.(safeSec, true);
    } catch (e) {}
  }, []);

  const changePlaybackRate = useCallback((rate) => {
    const r = Number(rate) || 1.0;
    setPlaybackRate(r);
    try {
      playerRef.current?.setPlaybackRate?.(r);
    } catch (e) {}
  }, []);

  const toggleMute = useCallback(() => {
    try {
      if (isMuted) {
        playerRef.current?.unMute?.();
        setIsMuted(false);
        setVolume(1.0);
      } else {
        playerRef.current?.mute?.();
        setIsMuted(true);
        setVolume(0);
      }
    } catch (e) {}
  }, [isMuted]);

  return {
    containerRef,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    bufferedPercent: 100,
    errorMessage,
    play,
    pause,
    togglePlay,
    seek,
    changePlaybackRate,
    toggleMute
  };
}
