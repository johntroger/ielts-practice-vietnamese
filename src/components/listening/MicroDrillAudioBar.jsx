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
  AlertCircle,
  UploadCloud,
  Layers
} from 'lucide-react';
import { saveAudioBlob, getAudioPlayableUrl } from '../../utils/audioStorage';
import { CURATED_LISTENING_AUDIO_SOURCES } from '../../data/listening/curatedAudioSources';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * MicroDrillAudioBar - High-Fidelity HTML5 Audio Engine for Micro-Drills
 * Inherits the rock-solid, production-tested audio architecture from AudioPlayerBar & useAudioEngine.
 * 
 * Features:
 * - 100% Native HTML5 Audio playback (Zero dependency on unreliable browser SpeechSynthesis)
 * - Automatic Fallback on network errors to local /audio/cam18_test1_audio.mp3
 * - Audio clip timestamp support (clipStart, clipEnd) for focused micro-drill repetitions
 * - Real-time seconds counter (00:00 / 00:20), buffering indicator & interactive scrub bar
 * - Speed controls (0.8x, 1.0x, 1.2x) & volume controls
 * - Built-in Sound Test & Custom Audio File Uploader (.mp3, .wav)
 */
export default function MicroDrillAudioBar({
  drillId,
  audioText = '',
  audioUrl = '/audio/cam18_test1_audio.mp3',
  fallbackAudioUrl = '/audio/cam18_test1_audio.mp3',
  clipStart = 0,
  clipEnd = 0,
  title = 'Audio bài luyện nghe chuẩn Cambridge',
  accent = 'en-GB'
}) {
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const fallbackTriedRef = useRef(false);

  // Active audio URL (can be customized by user upload or source picker)
  const [activeSrc, setActiveSrc] = useState(audioUrl || '/audio/cam18_test1_audio.mp3');
  const [activeClipStart, setActiveClipStart] = useState(Number(clipStart) || 0);
  const [activeClipEnd, setActiveClipEnd] = useState(Number(clipEnd) || 0);

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [rawDuration, setRawDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [bufferedPercent, setBufferedPercent] = useState(100);
  const [isBufferReady, setIsBufferReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Source picker modal state
  const [isSourcePickerOpen, setIsSourcePickerOpen] = useState(false);
  const [customUploadedName, setCustomUploadedName] = useState(null);

  // Has clip segment
  const hasClip = activeClipEnd > activeClipStart && activeClipEnd > 0;
  const clipDuration = hasClip ? (activeClipEnd - activeClipStart) : (rawDuration || 20);

  // Update source when drillId or props change
  useEffect(() => {
    setActiveSrc(audioUrl || fallbackAudioUrl || '/audio/cam18_test1_audio.mp3');
    setActiveClipStart(Number(clipStart) || 0);
    setActiveClipEnd(Number(clipEnd) || 0);
    fallbackTriedRef.current = false;
    setCustomUploadedName(null);
  }, [drillId, audioUrl, fallbackAudioUrl, clipStart, clipEnd]);

  // Initialize and update HTML5 Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const updateBuffer = () => {
      try {
        if (audio.buffered.length > 0 && audio.duration > 0) {
          const loaded = audio.buffered.end(audio.buffered.length - 1);
          const pct = Math.min(100, Math.round((loaded / audio.duration) * 100));
          setBufferedPercent(pct);
          if (pct >= 5 || loaded >= 5) {
            setIsBufferReady(true);
          }
        }
      } catch (e) {}
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setRawDuration(Math.ceil(audio.duration));
      }
      setIsLoading(false);
      setIsBufferReady(true);
      setErrorMessage(null);
      updateBuffer();

      if (hasClip && activeClipStart > 0) {
        try {
          audio.currentTime = activeClipStart;
        } catch (e) {}
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setIsBufferReady(true);
      updateBuffer();
    };

    const handleTimeUpdate = () => {
      const cur = audio.currentTime || 0;
      if (hasClip) {
        if (cur >= activeClipEnd) {
          // Reached end of clip -> pause and loop back to clipStart
          audio.pause();
          try {
            audio.currentTime = activeClipStart;
          } catch (e) {}
          setIsPlaying(false);
          setCurrentTime(0);
          return;
        }
        setCurrentTime(Math.max(0, cur - activeClipStart));
      } else {
        setCurrentTime(cur);
      }
      updateBuffer();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (hasClip) {
        try {
          audio.currentTime = activeClipStart;
        } catch (e) {}
      }
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setErrorMessage(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      console.warn('MicroDrillAudioBar error on source:', audio.src);
      // Auto-fallback recovery (exactly like useAudioEngine)
      if (!fallbackTriedRef.current && fallbackAudioUrl && audio.src !== fallbackAudioUrl) {
        fallbackTriedRef.current = true;
        audio.src = fallbackAudioUrl;
        audio.load();
        return;
      }
      // Ultimate local fallback
      if (audio.src !== '/audio/cam18_test1_audio.mp3') {
        fallbackTriedRef.current = true;
        audio.src = '/audio/cam18_test1_audio.mp3';
        audio.load();
        return;
      }
      setErrorMessage('Không thể phát âm thanh. Vui lòng kiểm tra kết nối.');
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('progress', updateBuffer);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    setIsLoading(true);
    setCurrentTime(0);
    audio.src = activeSrc;
    audio.playbackRate = playbackRate;
    audio.volume = volume;
    audio.muted = isMuted;
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('progress', updateBuffer);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);

      try {
        audio.pause();
        audio.src = '';
      } catch (e) {}
      audioRef.current = null;
    };
  }, [activeSrc, activeClipStart, activeClipEnd, hasClip]);

  // Play / Pause toggle
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      // If clip is used and outside bounds, reset to clip start
      if (hasClip && (audio.currentTime < activeClipStart || audio.currentTime >= activeClipEnd)) {
        try {
          audio.currentTime = activeClipStart;
        } catch (e) {}
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            setErrorMessage(null);
          })
          .catch((err) => {
            console.warn('Audio play caught error:', err);
            setIsLoading(false);
            setIsPlaying(false);
            if (err.name === 'NotAllowedError') {
              setErrorMessage('Vui lòng bấm nút Play để trình duyệt cho phép phát âm thanh.');
            }
          });
      }
    }
  };

  // Replay from start of clip
  const handleReplay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (hasClip) {
        audio.currentTime = activeClipStart;
      } else {
        audio.currentTime = 0;
      }
      setCurrentTime(0);
    } catch (e) {}

    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  // Seek bar click
  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));

    if (hasClip) {
      const targetTime = activeClipStart + fraction * (activeClipEnd - activeClipStart);
      try {
        audio.currentTime = targetTime;
        setCurrentTime(fraction * (activeClipEnd - activeClipStart));
      } catch (e) {}
    } else {
      const targetTime = fraction * (rawDuration || audio.duration || 20);
      try {
        audio.currentTime = targetTime;
        setCurrentTime(targetTime);
      } catch (e) {}
    }
  };

  // Change playback rate
  const handleSpeedChange = (newRate) => {
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  // Sound Test (Generates short clear Cambridge exam chime tone via Web Audio API)
  const handleSoundTest = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {}
  };

  // Handle local user MP3 upload (re-uses saveAudioBlob from audioStorage.js)
  const handleUploadAudio = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const storageId = `micro-drill-${Date.now()}`;
      await saveAudioBlob(storageId, file, { name: file.name });
      const playableUrl = await getAudioPlayableUrl(storageId);
      if (playableUrl) {
        setActiveSrc(playableUrl);
        setActiveClipStart(0);
        setActiveClipEnd(0);
        setCustomUploadedName(file.name);
        setIsSourcePickerOpen(false);
      }
    } catch (err) {
      console.error('Error loading custom audio file:', err);
      alert('Không thể nạp tệp âm thanh này. Vui lòng chọn tệp .mp3 hoặc .wav hợp lệ.');
    } finally {
      setIsLoading(false);
    }
  };

  // Progress percentage
  const progressPercent = clipDuration > 0 ? Math.min(100, (currentTime / clipDuration) * 100) : 0;

  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 shadow-lg space-y-2.5">
      {/* Error alert if audio failed */}
      {errorMessage && (
        <div className="bg-amber-600/90 text-white text-xs px-3 py-1.5 rounded-lg flex items-center justify-between font-medium">
          <div className="flex items-center space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button 
            type="button" 
            onClick={togglePlay} 
            className="underline font-bold text-[11px] cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* HEADER: Title & Buffer Status */}
      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center space-x-2 font-bold text-slate-200 truncate">
          <span className={`w-2 h-2 rounded-full shrink-0 ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
          <span className="truncate">
            {customUploadedName ? `Tệp tải lên: ${customUploadedName}` : title}
          </span>
        </div>

        {/* Load status badge */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {isLoading ? (
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold flex items-center space-x-1 animate-pulse">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>Đang tải audio...</span>
            </span>
          ) : isBufferReady || bufferedPercent > 0 ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold flex items-center space-x-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Đã load xong ({Math.round(clipDuration)}s)</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 font-mono text-[10px] font-bold">
              Đệm: {bufferedPercent}%
            </span>
          )}
        </div>
      </div>

      {/* MAIN CONTROLS ROW */}
      <div className="flex items-center justify-between gap-3">
        {/* Play/Pause Button + Replay + Time + Waves */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={togglePlay}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer shrink-0 ${
              isPlaying 
                ? 'bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-400/40 shadow-emerald-900/50' 
                : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-rose-900/40 ring-2 ring-rose-500/20'
            }`}
            title={isLoading ? 'Đang nạp âm thanh...' : isPlaying ? 'Tạm dừng bài nghe' : 'Bắt đầu phát âm thanh'}
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
            title="Nghe lại đoạn này từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Time Counter */}
          <div className="flex items-baseline space-x-1 font-mono text-xs sm:text-sm">
            <span className="font-black text-emerald-400">{formatTime(currentTime)}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 font-bold">{formatTime(clipDuration)}</span>
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

        {/* Speed, Test & Source Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Sound Test Button */}
          <button
            type="button"
            onClick={handleSoundTest}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 text-[10px] font-bold border border-slate-700 transition-colors cursor-pointer"
            title="Kiểm tra chuông tai nghe / loa"
          >
            🔔 Test loa
          </button>

          {/* Speed Buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleSpeedChange(0.8)}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${playbackRate === 0.8 ? 'bg-emerald-600 text-white font-black' : 'text-slate-400 hover:text-white'}`}
              title="Tốc độ 0.8x (Chậm)"
            >
              0.8x
            </button>
            <button
              type="button"
              onClick={() => handleSpeedChange(1.0)}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${playbackRate === 1.0 ? 'bg-emerald-600 text-white font-black' : 'text-slate-400 hover:text-white'}`}
              title="Tốc độ 1.0x (Chuẩn Cambridge)"
            >
              1.0x
            </button>
            <button
              type="button"
              onClick={() => handleSpeedChange(1.2)}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${playbackRate === 1.2 ? 'bg-emerald-600 text-white font-black' : 'text-slate-400 hover:text-white'}`}
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

          {/* Source Picker / Upload Modal Toggle */}
          <button
            type="button"
            onClick={() => setIsSourcePickerOpen(!isSourcePickerOpen)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
            title="Đổi nguồn audio hoặc tải tệp âm thanh của riêng bạn lên"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SCRUBBING PROGRESS BAR */}
      <div className="relative py-1 cursor-pointer group" onClick={handleSeek}>
        <div className="w-full h-2 sm:h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
          {/* Buffered track */}
          <div 
            className="absolute top-0 left-0 bottom-0 bg-slate-700/70 transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(bufferedPercent, isBufferReady ? 100 : 0)}%` }}
          />
          {/* Played track */}
          <div 
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-red-600 via-rose-500 to-emerald-400 transition-all duration-100 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Scrub knob */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md border-2 border-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ left: `calc(${progressPercent}% - 7px)` }}
        />
      </div>

      {/* FOOTER HELPER HINT */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
        <span>Bấm trên thanh để tua đoạn nghe • HTML5 Audio Engine chuẩn thi Cambridge</span>
        <span className="text-emerald-400 font-semibold">🇬🇧 Giọng bản xứ Anh - Anh chuẩn BBC</span>
      </div>

      {/* DROP-DOWN SOURCE PICKER & UPLOADER (giống phần tạo đề) */}
      {isSourcePickerOpen && (
        <div className="pt-2.5 mt-2 border-t border-slate-800 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nguồn âm thanh (Giống Phần Tạo Đề):</span>
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-0.5 rounded bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/40 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
            >
              <UploadCloud className="w-3 h-3" />
              <span>Tải file MP3 của bạn lên</span>
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg" 
              className="hidden" 
              onChange={handleUploadAudio} 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {/* Default Cambridge 18 */}
            <button
              type="button"
              onClick={() => {
                setActiveSrc('/audio/cam18_test1_audio.mp3');
                setActiveClipStart(Number(clipStart) || 0);
                setActiveClipEnd(Number(clipEnd) || 0);
                setCustomUploadedName(null);
                setIsSourcePickerOpen(false);
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <p className="font-bold text-emerald-400">Audio Cambridge 18 Test 1 (Gốc)</p>
              <p className="text-[10px] text-slate-500">Tệp âm thanh nội bộ ổn định 100%</p>
            </button>

            {/* Curated Archive Sources */}
            {CURATED_LISTENING_AUDIO_SOURCES.slice(0, 3).map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => {
                  setActiveSrc(src.audioUrl);
                  setActiveClipStart(0);
                  setActiveClipEnd(30);
                  setCustomUploadedName(src.title);
                  setIsSourcePickerOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer truncate"
              >
                <p className="font-bold text-indigo-300 truncate">{src.title}</p>
                <p className="text-[10px] text-slate-500">{src.accent} • {src.durationText}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
