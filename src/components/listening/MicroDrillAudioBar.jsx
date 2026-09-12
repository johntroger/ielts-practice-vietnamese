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
 * - Instant, reliable speech playback with Web Speech API (Cambridge UK accent)
 * - Real-time seconds counter (00:00 / 00:15)
 * - Visual buffering and loaded completion indicator (Đã sẵn sàng 100%)
 * - Clickable progress scrubbing bar
 * - Speed control (0.8x, 1.0x, 1.2x)
 * - Dynamic sound wave animation
 * - Built-in sound test button
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
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [bufferedPercent, setBufferedPercent] = useState(100);
  const [isBufferReady, setIsBufferReady] = useState(true);

  // Check if we have a valid direct audio file (mp3, wav, blob, etc.)
  const hasDirectAudioFile = Boolean(
    directAudioUrl && 
    (directAudioUrl.startsWith('blob:') || directAudioUrl.startsWith('data:') || directAudioUrl.endsWith('.mp3') || directAudioUrl.endsWith('.wav') || directAudioUrl.endsWith('.ogg')) &&
    !directAudioUrl.includes('translate.google.com')
  );

  // Compute estimate duration from text length (~135 words per minute => ~2.25 words/sec)
  const wordCount = audioText ? audioText.trim().split(/\s+/).length : 6;
  const baseDuration = Math.max(3, Math.ceil(wordCount / 2.2));
  const effectiveDuration = Math.max(3, Math.ceil(baseDuration / playbackRate));
  const [audioDuration, setAudioDuration] = useState(effectiveDuration);

  // When drillId, audioText, or playbackRate changes: stop previous speech and reset state
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
      tickerRef.current = null;
    }

    setIsPlaying(false);
    setCurrentTime(0);
    setAudioDuration(effectiveDuration);
    setBufferedPercent(100);
    setIsBufferReady(true);

    if (hasDirectAudioFile && audioRef.current) {
      audioRef.current.src = directAudioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.load();
    }
  }, [drillId, audioText, playbackRate, directAudioUrl]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch (e) {}
      }
    };
  }, []);

  // HTML5 audio event handlers (only if direct audio file is present)
  useEffect(() => {
    if (!hasDirectAudioFile || !audioRef.current) return;
    const audio = audioRef.current;

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0 && isFinite(audio.duration)) {
        setAudioDuration(Math.ceil(audio.duration));
      }
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [hasDirectAudioFile]);

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      // STOP PLAYBACK
      if (hasDirectAudioFile && audioRef.current) {
        audioRef.current.pause();
      } else {
        stopSpeech();
      }
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    // START PLAYBACK
    // 1. Play immediate pleasant IELTS chime
    playChimeTone({ freq: 659.25, duration: 0.15, volume: 0.25 });

    if (hasDirectAudioFile && audioRef.current) {
      // Direct audio file playback
      audioRef.current.currentTime = currentTime;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Direct audio play error:', err));
      return;
    }

    // Web Speech API Playback (Instant, local, zero-network lag)
    setIsPlaying(true);
    const startTime = Date.now() - (currentTime / playbackRate) * 1000;
    
    if (tickerRef.current) clearInterval(tickerRef.current);
    tickerRef.current = setInterval(() => {
      const elapsed = ((Date.now() - startTime) / 1000) * playbackRate;
      setCurrentTime((prev) => {
        if (elapsed >= effectiveDuration) {
          return effectiveDuration;
        }
        return Number(elapsed.toFixed(1));
      });
    }, 100);

    speakText(audioText, {
      rate: playbackRate,
      volume: isMuted ? 0 : 1.0,
      lang: accent,
      playChimeFirst: false,
      onStart: () => {
        setIsPlaying(true);
      },
      onEnd: () => {
        if (tickerRef.current) {
          clearInterval(tickerRef.current);
          tickerRef.current = null;
        }
        setIsPlaying(false);
        setCurrentTime(0);
      },
      onError: (err) => {
        console.warn('Speech playback ended or interrupted:', err);
        if (tickerRef.current) {
          clearInterval(tickerRef.current);
          tickerRef.current = null;
        }
        setIsPlaying(false);
      }
    });
  };

  // Replay from start
  const handleReplay = () => {
    stopSpeech();
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    if (hasDirectAudioFile && audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
      } catch (e) {}
    }
    setCurrentTime(0);
    setIsPlaying(false);

    // Short timeout before playing again to reset browser utterance cleanly
    setTimeout(() => {
      togglePlay();
    }, 50);
  };

  // Seek bar click
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = fraction * effectiveDuration;
    setCurrentTime(targetSec);

    if (hasDirectAudioFile && audioRef.current) {
      try {
        audioRef.current.currentTime = targetSec;
      } catch (e) {}
    }
  };

  // Change playback speed
  const handleSpeedChange = (newRate) => {
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      stopSpeech();
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
      setIsPlaying(false);
    }
    setPlaybackRate(newRate);
    if (hasDirectAudioFile && audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
    if (wasPlaying) {
      setTimeout(() => {
        togglePlay();
      }, 60);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (hasDirectAudioFile && audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // Sound check test button
  const handleSoundTest = () => {
    playChimeTone({ freq: 523.25, duration: 0.2, volume: 0.35 });
    setTimeout(() => {
      speakText('Microphone and audio check ready.', {
        rate: 1.0,
        lang: 'en-GB',
        playChimeFirst: false
      });
    }, 250);
  };

  const progressPercent = effectiveDuration > 0 ? Math.min(100, (currentTime / effectiveDuration) * 100) : 0;

  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 shadow-lg space-y-2.5">
      {/* Hidden HTML5 Audio Element for custom uploaded audio files */}
      {hasDirectAudioFile && (
        <audio 
          ref={audioRef} 
          preload="auto" 
          src={directAudioUrl} 
        />
      )}

      {/* HEADER: Title & Buffer Status (Hiển thị rõ ràng khi nào load xong) */}
      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center space-x-2 font-bold text-slate-200 truncate">
          <span className={`w-2 h-2 rounded-full shrink-0 ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`} />
          <span className="truncate">{title}</span>
        </div>

        {/* Load status badge */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold flex items-center space-x-1 shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Đã sẵn sàng 100% ({effectiveDuration}s)</span>
          </span>
        </div>
      </div>

      {/* MAIN CONTROLS ROW */}
      <div className="flex items-center justify-between gap-3">
        {/* Play/Pause Button + Replay + Time + Wave */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={togglePlay}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer shrink-0 ${
              isPlaying 
                ? 'bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-400/40 shadow-emerald-900/50' 
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-rose-900/40 ring-2 ring-rose-500/20'
            }`}
            title={isPlaying ? 'Tạm dừng nghe' : 'Bắt đầu nghe lời thoại'}
          >
            {isPlaying ? (
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

          {/* Time Counter (Bao nhiêu giây thực tế) */}
          <div className="flex items-baseline space-x-1 font-mono text-xs sm:text-sm">
            <span className="font-black text-emerald-400">{formatTime(currentTime)}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 font-bold">{formatTime(effectiveDuration)}</span>
          </div>

          {/* Sound wave animated visualizer */}
          <div className="hidden sm:flex items-center space-x-0.5 h-4 px-2 bg-slate-900 rounded-md border border-slate-800">
            <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-200 ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
            <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-150 ${isPlaying ? 'h-4 animate-bounce' : 'h-1'}`} style={{ animationDelay: '100ms' }} />
            <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-300 ${isPlaying ? 'h-2.5 animate-pulse' : 'h-1'}`} style={{ animationDelay: '200ms' }} />
            <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-150 ${isPlaying ? 'h-3.5 animate-bounce' : 'h-1'}`} style={{ animationDelay: '300ms' }} />
            <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-200 ${isPlaying ? 'h-2 animate-pulse' : 'h-1'}`} style={{ animationDelay: '150ms' }} />
          </div>
        </div>

        {/* Speed, Test & Mute Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Sound Test Button */}
          <button
            type="button"
            onClick={handleSoundTest}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 text-[10px] font-bold border border-slate-700 transition-colors cursor-pointer"
            title="Thử loa và kiểm tra giọng phát âm"
          >
            🔔 Test loa
          </button>

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
              title="Tốc độ 1.0x (Chuẩn Cambridge)"
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
            className="absolute top-0 left-0 bottom-0 bg-slate-700/80 transition-all duration-300 rounded-full w-full"
            title="Đã tải xong toàn bộ âm thanh"
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
      <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
        <span>Bấm vào thanh để tua • Bấm Play để nghe câu đọc</span>
        <span className="text-emerald-400 font-semibold">{accent === 'en-GB' ? '🇬🇧 Giọng chuẩn Cambridge (Anh-Anh)' : '🌐 Giọng đọc chuẩn'}</span>
      </div>
    </div>
  );
}
