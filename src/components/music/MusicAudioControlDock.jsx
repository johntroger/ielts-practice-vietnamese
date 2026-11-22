import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Repeat,
  PauseCircle,
  Volume2,
  VolumeX,
  FastForward,
  RefreshCw,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../../i18n/index.js';

function formatClock(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function MusicAudioControlDock({
  audioEngine,
  lines = [],
  activeLineIndex = 0,
  onSelectLineIndex,
  onReplayActiveLine,
  isAutoLoopLine = false,
  onToggleAutoLoopLine,
  isAutoPauseLine = false,
  onToggleAutoPauseLine,
  isKeyboardOpen = false
}) {
  const { isEn } = useTranslation();
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);

  const {
    isPlaying,
    isLoading,
    currentTime = 0,
    duration = 0,
    playbackRate = 1.0,
    volume = 1.0,
    isMuted = false,
    bufferedPercent = 0,
    errorMessage = null,
    togglePlay,
    seek,
    changePlaybackRate,
    toggleMute
  } = audioEngine || {};

  const progressPct = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  // Detect if we are currently in an instrumental Intro or long Instrumental Gap (> 5s before next line)
  const firstLine = lines[0];
  const nextUpcomingLine = lines.find(l => l.start > currentTime + 1.5);
  const isDuringIntro = firstLine && firstLine.start > 3.5 && currentTime < firstLine.start - 1.5;
  const activeTimeMatch = lines.some(l => currentTime >= l.start - 0.5 && currentTime <= l.end + 0.5);
  const isDuringInstrumentalGap =
    !isDuringIntro &&
    !activeTimeMatch &&
    nextUpcomingLine &&
    nextUpcomingLine.start - currentTime > 5.0;

  const skipTargetLine = isDuringIntro ? firstLine : isDuringInstrumentalGap ? nextUpcomingLine : null;

  const handleProgressBarClick = (e) => {
    if (!duration || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    seek?.(fraction * duration);
  };

  const handlePrevLine = () => {
    const prevIdx = Math.max(0, activeLineIndex - 1);
    onSelectLineIndex?.(prevIdx, true);
  };

  const handleNextLine = () => {
    const nextIdx = Math.min(Math.max(0, lines.length - 1), activeLineIndex + 1);
    onSelectLineIndex?.(nextIdx, true);
  };

  // ULTRA-SLIM MOBILE VIRTUAL KEYBOARD COMPANION BAR
  // Preserves maximum vertical typing space when phone keyboard is open
  if (isKeyboardOpen) {
    return (
      <div className="bg-slate-950 text-slate-100 border-t border-slate-800 px-2.5 py-1.5 shrink-0 select-none z-20 flex items-center justify-between gap-1.5">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={togglePlay}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md active:scale-95 cursor-pointer shrink-0 ${
              isPlaying ? 'bg-emerald-600' : 'bg-gradient-to-r from-rose-600 to-purple-600'
            }`}
            aria-label={isPlaying ? (isEn ? 'Pause' : 'Tạm dừng') : (isEn ? 'Play' : 'Phát')}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onReplayActiveLine}
            className="h-9 px-2.5 rounded-xl bg-slate-900 text-amber-300 border border-amber-500/40 text-xs font-extrabold flex items-center space-x-1 active:scale-95 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Replay' : 'Nghe lại'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={onToggleAutoLoopLine}
            className={`h-9 px-2 rounded-xl border text-[11px] font-extrabold flex items-center space-x-1 cursor-pointer ${
              isAutoLoopLine
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>{isEn ? 'Loop' : 'Lặp'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleAutoPauseLine}
            className={`h-9 px-2 rounded-xl border text-[11px] font-extrabold flex items-center space-x-1 cursor-pointer ${
              isAutoPauseLine
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <PauseCircle className="w-3.5 h-3.5" />
            <span>{isEn ? 'Pause' : 'Dừng'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const rates = [0.75, 0.85, 1.0, 1.15];
              const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
              changePlaybackRate?.(nextRate);
            }}
            className="h-9 px-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-[11px] font-mono font-bold cursor-pointer"
          >
            {playbackRate}x
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 border-t border-slate-800 px-3 sm:px-5 pt-2 pb-[max(0.625rem,env(safe-area-inset-bottom))] shrink-0 select-none shadow-2xl z-20">
      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-amber-600/90 text-white text-xs flex items-center justify-between font-semibold">
          <div className="flex items-center space-x-2 min-w-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={togglePlay}
            className="ml-3 px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[11px] font-bold cursor-pointer shrink-0"
          >
            {isEn ? 'Retry' : 'Thử lại'}
          </button>
        </div>
      )}

      {/* Floating Skip Intro / Instrumental Solo Banner */}
      {skipTargetLine && (
        <div className="mb-2 flex items-center justify-between px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-rose-900/90 border border-purple-500/40 text-[11px] sm:text-xs animate-in fade-in duration-200">
          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
            <span className="text-slate-200 font-medium truncate">
              {isDuringIntro
                ? (isEn
                    ? `Intro • Vocals at ${formatClock(skipTargetLine.start)}`
                    : `Nhạc dạo • Vào lời lúc ${formatClock(skipTargetLine.start)}`)
                : (isEn
                    ? `Interlude • Next line at ${formatClock(skipTargetLine.start)}`
                    : `Nhạc dạo giữa bài • Câu tiếp lúc ${formatClock(skipTargetLine.start)}`)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              seek?.(Math.max(0, skipTargetLine.start - 0.3));
              if (!isPlaying) togglePlay?.();
            }}
            className="ml-2 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] flex items-center space-x-1 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <FastForward className="w-3.5 h-3.5 fill-current" />
            <span>
              {isDuringIntro
                ? (isEn ? 'Skip Intro' : 'Bỏ nhạc dạo')
                : (isEn ? 'Skip' : 'Tới lời')}
            </span>
          </button>
        </div>
      )}

      {/* Interactive Scrubber Timeline with Lyric Line Markers */}
      <div className="mb-2 flex items-center space-x-2">
        <span className="font-mono text-[11px] font-bold text-emerald-400 w-9 sm:w-10 text-right shrink-0">
          {formatClock(currentTime)}
        </span>

        <div
          onClick={handleProgressBarClick}
          className="group relative flex-1 h-2.5 sm:h-2.5 bg-slate-800 hover:h-3 rounded-full overflow-hidden cursor-pointer transition-all"
          title={isEn ? 'Click anywhere to seek song timeline' : 'Bấm vị trí bất kỳ để tua bài hát'}
        >
          <div
            className="absolute left-0 top-0 bottom-0 bg-slate-700/70 transition-all duration-300"
            style={{ width: `${bufferedPercent}%` }}
          />
          {duration > 0 &&
            lines.map((line, idx) => {
              const leftPct = Math.min(99.5, Math.max(0.5, (line.start / duration) * 100));
              const isCurrent = idx === activeLineIndex;
              return (
                <div
                  key={line.id || idx}
                  style={{ left: `${leftPct}%` }}
                  className={`absolute top-0 bottom-0 w-0.5 pointer-events-none ${
                    isCurrent ? 'bg-amber-300 z-10 w-1' : 'bg-slate-600/70'
                  }`}
                />
              );
            })}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-100"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <span className="font-mono text-[11px] text-slate-400 w-9 sm:w-10 shrink-0">
          {formatClock(duration)}
        </span>
      </div>

      {/* Main Transport & Dictation Ergonomics Row — Optimized for both 375px Mobile & Desktop */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: Playback Transport Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          <button
            type="button"
            onClick={handlePrevLine}
            disabled={activeLineIndex <= 0}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title={isEn ? 'Previous lyric line' : 'Câu hát trước'}
          >
            <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 ${
              isPlaying
                ? 'bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500'
            }`}
            title={isPlaying ? (isEn ? 'Pause song' : 'Tạm dừng nhạc') : (isEn ? 'Play song' : 'Phát nhạc')}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleNextLine}
            disabled={activeLineIndex >= lines.length - 1}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title={isEn ? 'Next lyric line' : 'Câu hát tiếp theo'}
          >
            <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Replay Active Line Button (Tab shortcut) */}
          <button
            type="button"
            onClick={onReplayActiveLine}
            className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-[11px] sm:text-xs font-bold flex items-center space-x-1 transition-all active:scale-95 cursor-pointer"
            title={isEn ? 'Replay current line from beginning (Shortcut: Tab)' : 'Nghe lại câu hiện tại từ đầu (Phím tắt: Tab)'}
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline sm:inline">{isEn ? 'Replay' : 'Nghe lại'}</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.2 rounded bg-slate-800 text-amber-200 font-mono text-[10px] border border-slate-700">
              Tab
            </kbd>
          </button>
        </div>

        {/* Right: Dictation Assist Switches (Single scrollable strip on very small phones) */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto scrollbar-none shrink">
          {/* 1. Auto-Loop Current Line Switch */}
          <button
            type="button"
            onClick={onToggleAutoLoopLine}
            className={`h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl border text-[11px] sm:text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer shrink-0 ${
              isAutoLoopLine
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-xs'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={
              isEn
                ? 'Auto-Loop Active Line: Repeats the current sentence until you finish typing'
                : 'Tự lặp câu đang nghe: Lặp đi lặp lại câu hiện tại cho tới khi bạn gõ xong'
            }
          >
            <Repeat className={`w-3.5 h-3.5 shrink-0 ${isAutoLoopLine ? 'text-emerald-400' : ''}`} />
            <span>{isEn ? 'Loop' : 'Lặp'}</span>
            <span
              className={`hidden sm:inline px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                isAutoLoopLine ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isAutoLoopLine ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* 2. Auto-Pause at Line End Switch */}
          <button
            type="button"
            onClick={onToggleAutoPauseLine}
            className={`h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl border text-[11px] sm:text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer shrink-0 ${
              isAutoPauseLine
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-xs'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={
              isEn
                ? 'Auto-Pause at Line End: Pauses music automatically at the end of each line so you have time to type'
                : 'Tự dừng cuối câu: Tự động tạm dừng nhạc khi hết câu để bạn thoải mái gõ chữ'
            }
          >
            <PauseCircle className={`w-3.5 h-3.5 shrink-0 ${isAutoPauseLine ? 'text-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isEn ? 'Auto-Pause' : 'Tự dừng'}</span>
            <span className="sm:hidden">{isEn ? 'Pause' : 'Dừng'}</span>
            <span
              className={`hidden sm:inline px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                isAutoPauseLine ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isAutoPauseLine ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* 3. Playback Speed Selector */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsSpeedOpen(prev => !prev)}
              className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[11px] sm:text-xs font-mono font-bold cursor-pointer"
              title={isEn ? 'Adjust song speed' : 'Chỉnh tốc độ phát nhạc'}
            >
              {playbackRate}x
            </button>
            {isSpeedOpen && (
              <div className="absolute right-0 bottom-full mb-1.5 w-24 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 flex flex-col">
                {[0.75, 0.85, 1.0, 1.15].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      changePlaybackRate?.(rate);
                      setIsSpeedOpen(false);
                    }}
                    className={`px-3 py-1.5 text-xs text-left font-mono hover:bg-slate-800 cursor-pointer flex items-center justify-between ${
                      playbackRate === rate ? 'text-emerald-400 font-bold bg-slate-800/70' : 'text-slate-300'
                    }`}
                  >
                    <span>{rate}x</span>
                    {rate === 0.75 && (
                      <span className="text-[9px] text-amber-400 font-sans">
                        {isEn ? 'Slow' : 'Chậm'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Mute / Volume Toggle (Hidden on extra-small phones where hardware buttons exist) */}
          <button
            type="button"
            onClick={toggleMute}
            className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 items-center justify-center transition-colors cursor-pointer shrink-0"
            title={isMuted ? (isEn ? 'Unmute' : 'Bật âm') : (isEn ? 'Mute' : 'Tắt âm')}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
