import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { speakText, stopSpeech, playChimeTone } from '../../utils/speechAudio';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * MicroDrillAudioBar - Authentic CD-IELTS Style Audio Player Bar for Practice Rooms
 * Provides:
 * - Real-time seconds counter (00:00 / 00:15)
 * - Visual buffering and loaded completion indicator (khi nào thì load xong)
 * - Clickable progress scrubbing bar
 * - Dual-engine playback (Google UK TTS stream + Web Speech API fallback)
 * - Speed control (0.8x, 1.0x, 1.2x)
 * - Sound wave animation
 */
export default function MicroDrillAudioBar({
  drillId,
  audioText = '',
  directAudioUrl = '',
  title = 'Audio bài luyện nghe (Chuẩn Anh-Anh)',
  accent = 'en-GB'
}) {
  const audioRef = useRef(null);
  const tickerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [isBufferReady, setIsBufferReady] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Compute estimate duration from text length (~140 words per minute => ~2.3 words/sec)
  const estimatedSeconds = Math.max(3, Math.ceil((audioText ? audioText.split(/\s+/).length : 6) / 2.2));

  // Construct Google Native TTS stream URL
  const streamUrl = directAudioUrl || (audioText ? `https://translate.google.com/translate_tts?ie=UTF-8&tl=${accent}&client=tw-ob&q=${encodeURIComponent(audioText.slice(0, 350))}` : '');

  // Reset states when drillId changes
  useEffect(() => {
    stopSpeech();
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (e) {}
    }
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
    }

    setIsPlaying(false);
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(estimatedSeconds);
    setBufferedPercent(0);
    setIsBufferReady(false);
    setFallbackMode(false);
    setLoadError(null);

    const audio = audioRef.current;
    if (audio && streamUrl) {
      audio.src = streamUrl;
      audio.playbackRate = playbackRate;
      audio.load();
    }
  }, [drillId, streamUrl]);

  // Handle audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0 && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
      setIsBufferReady(true);
      setBufferedPercent(100);
      setLoadError(null);
    };

    const onCanPlay = () => {
      setIsLoading(false);
      setIsBufferReady(true);
      if (bufferedPercent < 50) setBufferedPercent(100);
    };

    const onProgress = () => {
      try {
        if (audio.buffered.length > 0 && audio.duration > 0) {
          const loaded = audio.buffered.end(audio.buffered.length - 1);
          const pct = Math.min(100, Math.round((loaded / audio.duration) * 100));
          setBufferedPercent(pct);
          if (pct >= 90) setIsBufferReady(true);
        }
      } catch (e) {}
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0 && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onWaiting = () => {
      setIsLoading(true);
    };

    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onError = () => {
      console.warn('MicroDrillAudioBar stream note: switching to Web Speech synthesizer fallback.');
      setFallbackMode(true);
      setIsLoading(false);
      setIsBufferReady(true);
      setBufferedPercent(100);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('progress', onProgress);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('progress', onProgress);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [bufferedPercent]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (tickerRef.current) clearInterval(tickerRef.current);
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch (e) {}
      }
    };
  }, []);

  // Play / Pause toggle
  const togglePlay = () => {
    // 1. Immediate audio chime feedback so user knows sound hardware is active
    playChimeTone({ freq: 659.25, duration: 0.15, volume: 0.25 });

    if (fallbackMode) {
      if (isPlaying) {
        stopSpeech();
        if (tickerRef.current) clearInterval(tickerRef.current);
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        setCurrentTime(0);
        const startTime = Date.now();
        const dur = duration || estimatedSeconds;

        if (tickerRef.current) clearInterval(tickerRef.current);
        tickerRef.current = setInterval(() => {
          const elapsed = ((Date.now() - startTime) / 1000) * playbackRate;
          if (elapsed >= dur) {
            clearInterval(tickerRef.current);
            setIsPlaying(false);
            setCurrentTime(0);
          } else {
            setCurrentTime(elapsed);
          }
        }, 100);

        speakText(audioText, {
          rate: playbackRate,
          lang: accent,
          playChimeFirst: false,
          onStart: () => setIsPlaying(true),
          onEnd: () => {
            if (tickerRef.current) clearInterval(tickerRef.current);
            setIsPlaying(false);
            setCurrentTime(0);
          },
          onError: () => {
            if (tickerRef.current) clearInterval(tickerRef.current);
            setIsPlaying(false);
          }
        });
      }
      return;
    }

    // Standard HTML5 Audio
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((err) => {
            console.warn('Audio play failed, switching synchronously to Speech Synthesizer fallback:', err);
            setFallbackMode(true);
            setIsLoading(false);
            setIsPlaying(true);
            setCurrentTime(0);
            
            const startTime = Date.now();
            const dur = duration || estimatedSeconds;
            if (tickerRef.current) clearInterval(tickerRef.current);
            tickerRef.current = setInterval(() => {
              const elapsed = ((Date.now() - startTime) / 1000) * playbackRate;
              if (elapsed >= dur) {
                clearInterval(tickerRef.current);
                setIsPlaying(false);
                setCurrentTime(0);
              } else {
                setCurrentTime(elapsed);
              }
            }, 100);

            speakText(audioText, {
              rate: playbackRate,
              lang: accent,
              playChimeFirst: false,
              onStart: () => setIsPlaying(true),
              onEnd: () => {
                if (tickerRef.current) clearInterval(tickerRef.current);
                setIsPlaying(false);
                setCurrentTime(0);
              },
              onError: () => {
                if (tickerRef.current) clearInterval(tickerRef.current);
                setIsPlaying(false);
              }
            });
          });
      }
    }
  };

  // Replay from beginning
  const handleReplay = () => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      } catch (e) {}
    }
    if (fallbackMode) {
      stopSpeech();
      if (tickerRef.current) clearInterval(tickerRef.current);
      setCurrentTime(0);
      setIsPlaying(false);
    }
    togglePlay();
  };

  // Seek bar click
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = fraction * (duration || estimatedSeconds);
    setCurrentTime(targetSec);

    if (audioRef.current && !fallbackMode) {
      try {
        audioRef.current.currentTime = targetSec;
      } catch (e) {}
    }
  };

  // Speed change
  const handleSpeedChange = (newRate) => {
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  // Volume toggle
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 shadow-lg space-y-2.5">
      {/* Hidden HTML5 Audio Element with no-referrer to prevent Google TTS 404 block */}
      <audio 
        ref={audioRef} 
        preload="auto" 
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        src={streamUrl} 
      />

      {/* HEADER: Title & Buffer Status (Khi nào thì load xong) */}
      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center space-x-2 font-bold text-slate-200 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="truncate">{title}</span>
        </div>

        {/* Load status badge */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {isLoading ? (
            <span className="px-2 py-0.5 rounded-full bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold flex items-center space-x-1 animate-pulse">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>Đang đệm: {bufferedPercent}%...</span>
            </span>
          ) : isBufferReady || bufferedPercent >= 90 ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Đã tải xong 100% ({Math.round(duration || estimatedSeconds)}s)</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-amber-900/60 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
              Đệm: {bufferedPercent}%
            </span>
          )}
        </div>
      </div>

      {/* MAIN CONTROLS ROW */}
      <div className="flex items-center justify-between gap-3">
        {/* Play/Pause Button + Time + Wave */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={togglePlay}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer shrink-0 ${
              isPlaying 
                ? 'bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-400/40 shadow-emerald-900/50' 
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-rose-900/40'
            }`}
            title={isPlaying ? 'Tạm dừng' : 'Bắt đầu nghe'}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Nghe lại từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Time Counter (Bao nhiêu s) */}
          <div className="flex items-baseline space-x-1 font-mono text-xs sm:text-sm">
            <span className="font-black text-emerald-400">{formatTime(currentTime)}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 font-bold">{formatTime(duration || estimatedSeconds)}</span>
          </div>

          {/* Sound wave bars */}
          <div className="hidden sm:flex items-center space-x-0.5 h-4 px-2 bg-slate-900 rounded-md border border-slate-800">
            <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-200 ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
            <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-150 ${isPlaying ? 'h-4 animate-bounce' : 'h-1'}`} style={{ animationDelay: '100ms' }} />
            <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-300 ${isPlaying ? 'h-2.5 animate-pulse' : 'h-1'}`} style={{ animationDelay: '200ms' }} />
            <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-150 ${isPlaying ? 'h-3.5 animate-bounce' : 'h-1'}`} style={{ animationDelay: '300ms' }} />
            <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-200 ${isPlaying ? 'h-2 animate-pulse' : 'h-1'}`} style={{ animationDelay: '150ms' }} />
          </div>
        </div>

        {/* Speed & Volume Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Speed Buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleSpeedChange(0.8)}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${playbackRate === 0.8 ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-400 hover:text-white'}`}
              title="Tốc độ 0.8x (Chậm)"
            >
              0.8x
            </button>
            <button
              type="button"
              onClick={() => handleSpeedChange(1.0)}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${playbackRate === 1.0 ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-400 hover:text-white'}`}
              title="Tốc độ 1.0x (Chuẩn)"
            >
              1.0x
            </button>
            <button
              type="button"
              onClick={() => handleSpeedChange(1.2)}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${playbackRate === 1.2 ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-400 hover:text-white'}`}
              title="Tốc độ 1.2x (Nhanh)"
            >
              1.2x
            </button>
          </div>

          {/* Mute / Unmute */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* SCRUBBING PROGRESS BAR (Hiển thị tải & vị trí nghe) */}
      <div className="relative py-1 cursor-pointer group" onClick={handleSeek}>
        {/* Background track */}
        <div className="w-full h-2 sm:h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
          {/* Buffer Bar (Khi nào load xong) */}
          <div 
            className="absolute top-0 left-0 bottom-0 bg-slate-700/80 transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(bufferedPercent, isBufferReady ? 100 : 0)}%` }}
            title={`Bộ đệm đã tải: ${bufferedPercent}%`}
          />
          {/* Played Bar */}
          <div 
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-100 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Scrub handle knob */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md border-2 border-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ left: `calc(${progressPercent}% - 7px)` }}
        />
      </div>

      {/* FOOTER HELPER HINT */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 px-0.5">
        <span>Bấm vào bất kỳ điểm nào trên thanh để tua đến số giây tương ứng</span>
        <span>{accent === 'en-GB' ? 'Giọng đọc chuẩn Cambridge (Anh-Anh)' : 'Giọng đọc quốc tế'}</span>
      </div>
    </div>
  );
}
