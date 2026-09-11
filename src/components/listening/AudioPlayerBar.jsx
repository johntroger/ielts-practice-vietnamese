import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  FastForward, 
  Lock, 
  Sparkles, 
  Headphones,
  AlertCircle
} from 'lucide-react';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayerBar({
  audioEngine,
  examMode = 'practice', // 'strict' | 'practice'
  activePart = 1,
  onSelectPart,
  parts = []
}) {
  const {
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
    togglePlay,
    seek,
    changePlaybackRate,
    changeVolume,
    toggleMute
  } = audioEngine;

  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressBarClick = (e) => {
    if (examMode === 'strict') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    seek(fraction * duration);
  };

  // Check if buffer is actively pre-loading or waiting on mobile
  const isPreloadingBuffer = !isBufferReady && !isPlaying && duration > 0 && bufferedPercent < 3;

  return (
    <div className="sticky top-0 z-10 bg-slate-950 text-slate-100 border-b border-slate-800 shadow-md">
      {/* Top Banner if Error */}
      {errorMessage && (
        <div className="bg-amber-600/90 text-white text-xs px-3 py-1 flex items-center justify-between font-medium">
          <div className="flex items-center space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={togglePlay}
            className="underline text-[11px] hover:text-amber-100 font-bold ml-2"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Network Stalling Warning on Mobile */}
      {isStalled && isPlaying && (
        <div className="bg-indigo-600/95 text-white text-[11px] px-3 py-0.5 flex items-center justify-center space-x-1.5 font-medium animate-pulse">
          <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
          <span>Mạng di động đang tải tiếp âm thanh ({bufferedPercent}% đã đệm)...</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 py-2 sm:px-4 sm:py-2.5 flex flex-col gap-1.5">
        {/* ROW 1: Controls & Status */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Left: Play/Pause & Time & Wave */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <button
                onClick={togglePlay}
                disabled={isLoading || isPreloadingBuffer}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all active:scale-95 shrink-0 ${
                  isPreloadingBuffer
                    ? 'bg-slate-700 cursor-wait ring-2 ring-amber-400/40 opacity-90'
                    : isPlaying 
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40 ring-2 ring-emerald-400/40' 
                    : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-rose-900/30'
                }`}
                title={
                  isPreloadingBuffer
                    ? `Đang nạp trước bộ đệm (${bufferedPercent}%)... vui lòng chờ vài giây để nghe mượt mà`
                    : isPlaying
                    ? 'Tạm dừng'
                    : 'Phát bài nghe'
                }
              >
                {isLoading || isPreloadingBuffer ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current translate-x-0.5" />
                )}
              </button>

              {/* Mobile Pre-flight buffer badge */}
              {isPreloadingBuffer && (
                <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full shadow-xs animate-pulse whitespace-nowrap">
                  {bufferedPercent}%
                </span>
              )}
            </div>

            {/* Time Indicators */}
            <div className="flex items-baseline space-x-1 font-mono text-xs sm:text-sm">
              <span className="font-bold text-emerald-400">{formatTime(currentTime)}</span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">{formatTime(duration)}</span>
            </div>

            {/* Audio Waves Animation */}
            <div className="hidden md:flex items-center space-x-0.5 h-4 px-2 bg-slate-900/80 rounded-md border border-slate-800">
              <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-200 ${isPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
              <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-150 ${isPlaying ? 'h-4 animate-bounce' : 'h-1'}`} style={{ animationDelay: '100ms' }} />
              <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-300 ${isPlaying ? 'h-2.5 animate-pulse' : 'h-1'}`} style={{ animationDelay: '200ms' }} />
              <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-150 ${isPlaying ? 'h-3.5 animate-bounce' : 'h-1'}`} style={{ animationDelay: '300ms' }} />
              <div className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-200 ${isPlaying ? 'h-2 animate-pulse' : 'h-1'}`} style={{ animationDelay: '150ms' }} />
            </div>

            {/* Buffer percent indicator */}
            {bufferedPercent > 0 && bufferedPercent < 100 && (
              <span className="hidden lg:inline text-[10px] text-slate-400 font-mono" title="Dung lượng âm thanh đã tải sẵn vào bộ nhớ đệm">
                Đệm: {bufferedPercent}%
              </span>
            )}
          </div>

          {/* Center: Exam Mode Badge & Part Quick Selector */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
            {parts.map((p) => (
              <button
                key={p.partNumber}
                onClick={() => onSelectPart && onSelectPart(p.partNumber)}
                className={`px-2 py-1 rounded-md text-xs font-bold transition-all shrink-0 ${
                  activePart === p.partNumber
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Part {p.partNumber}
              </button>
            ))}
          </div>

          {/* Right: Mode Badge, Speed, Volume */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Strict / Practice Indicator */}
            {examMode === 'strict' ? (
              <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Khóa tua (Strict)</span>
              </span>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                  className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 transition-colors"
                  title="Tốc độ phát"
                >
                  {playbackRate}x
                </button>
                {isSpeedMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-24 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 flex flex-col">
                    {[0.8, 1.0, 1.1, 1.25].map(rate => (
                      <button
                        key={rate}
                        onClick={() => {
                          changePlaybackRate(rate);
                          setIsSpeedMenuOpen(false);
                        }}
                        className={`px-3 py-1.5 text-xs text-left font-mono hover:bg-slate-800 transition-colors ${
                          playbackRate === rate ? 'text-emerald-400 font-bold bg-slate-800/60' : 'text-slate-300'
                        }`}
                      >
                        {rate}x {rate === 1.0 && '(Chuẩn)'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Volume Toggle */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMuted ? 'Bật âm' : 'Tắt âm'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>

        {/* ROW 2: Interactive Audio Progress Bar */}
        <div 
          onClick={handleProgressBarClick}
          className={`group relative h-2 bg-slate-800 rounded-full overflow-hidden transition-all ${
            examMode === 'strict' ? 'cursor-not-allowed opacity-90' : 'cursor-pointer hover:h-2.5'
          }`}
          title={examMode === 'strict' ? 'Chế độ thi thật: Không thể tua âm thanh' : 'Bấm để tua đến vị trí mong muốn'}
        >
          {/* Buffered track */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-slate-700/60 transition-all duration-300"
            style={{ width: `${bufferedPercent}%` }}
          />
          {/* Played track */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-600 via-rose-500 to-emerald-400 rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

      </div>
    </div>
  );
}
