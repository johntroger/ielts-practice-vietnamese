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
  if (isKeyboardOpen) {
    return (
      <div className="bg-slate-950 text-slate-100 border-t border-slate-800 px-2.5 py-1 shrink-0 select-none z-20 flex items-center justify-between gap-1.5">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={togglePlay}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md active:scale-95 cursor-pointer shrink-0 ${
              isPlaying ? 'bg-emerald-600' : 'bg-gradient-to-r from-rose-600 to-purple-600'
            }`}
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onReplayActiveLine}
            className="h-8 px-2.5 rounded-xl bg-slate-900 text-amber-300 border border-amber-500/40 text-xs font-extrabold flex items-center space-x-1 active:scale-95 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isEn ? 'Replay' : 'Nghe lại'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={onToggleAutoLoopLine}
            className={`h-8 px-2 rounded-xl border text-[11px] font-extrabold flex items-center space-x-1 cursor-pointer ${
              isAutoLoopLine
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Repeat className="w-3 h-3" />
            <span>{isEn ? 'Loop' : 'Lặp'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleAutoPauseLine}
            className={`h-8 px-2 rounded-xl border text-[11px] font-extrabold flex items-center space-x-1 cursor-pointer ${
              isAutoPauseLine
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <PauseCircle className="w-3 h-3" />
            <span>{isEn ? 'Pause' : 'Dừng'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const rates = [0.75, 0.85, 1.0, 1.15];
              const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
              changePlaybackRate?.(nextRate);
            }}
            className="h-8 px-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-[11px] font-mono font-bold cursor-pointer"
          >
            {playbackRate}x
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 border-t border-slate-800 px-2.5 sm:px-4 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shrink-0 select-none shadow-2xl z-20">
      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-1.5 px-2.5 py-1 rounded-lg bg-amber-600/90 text-white text-xs flex items-center justify-between font-semibold">
          <div className="flex items-center space-x-1.5 min-w-0">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={togglePlay}
            className="ml-2 px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[11px] font-bold cursor-pointer shrink-0"
          >
            {isEn ? 'Retry' : 'Thử lại'}
          </button>
        </div>
      )}

      {/* Compact Skip Intro / Interlude Pill */}
      {skipTargetLine && (
        <div className="mb-1.5 flex items-center justify-between px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-rose-900/90 border border-purple-500/40 text-[11px] animate-in fade-in duration-150">
          <div className="flex items-center space-x-1.5 min-w-0">
            <Sparkles className="w-3 h-3 text-amber-300 shrink-0 animate-pulse" />
            <span className="text-slate-200 font-medium truncate">
              {isDuringIntro
                ? (isEn
                    ? `Intro • Vocals at ${formatClock(skipTargetLine.start)}`
                    : `Nhạc dạo • Vào lời lúc ${formatClock(skipTargetLine.start)}`)
                : (isEn
                    ? `Interlude • Next line at ${formatClock(skipTargetLine.start)}`
                    : `Nhạc dạo • Câu tiếp lúc ${formatClock(skipTargetLine.start)}`)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              seek?.(Math.max(0, skipTargetLine.start - 0.3));
              if (!isPlaying) togglePlay?.();
            }}
            className="ml-2 px-2 py-0.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] flex items-center space-x-1 cursor-pointer shrink-0"
          >
            <FastForward className="w-3 h-3 fill-current" />
            <span>{isDuringIntro ? (isEn ? 'Skip Intro' : 'Bỏ nhạc dạo') : (isEn ? 'Skip' : 'Tới lời')}</span>
          </button>
        </div>
      )}

      {/* Mobile Scrubber Row (Visible only on < lg; on Desktop lg+ the scrubber merges inline into the single main bar!) */}
      <div className="lg:hidden mb-1.5 flex items-center space-x-2">
        <span className="font-mono text-[10px] font-bold text-emerald-400 w-8 text-right shrink-0">
          {formatClock(currentTime)}
        </span>
        <div
          onClick={handleProgressBarClick}
          className="relative flex-1 h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer"
        >
          <div
            className="absolute left-0 top-0 bottom-0 bg-slate-700/70"
            style={{ width: `${bufferedPercent}%` }}
          />
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-slate-400 w-8 shrink-0">
          {formatClock(duration)}
        </span>
      </div>

      {/* Unified Single-Row Studio Bar (Desktop merges Transport + Scrubber + Dictation Switches in 1 slim row!) */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Playback Transport Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={handlePrevLine}
            disabled={activeLineIndex <= 0}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title={isEn ? 'Previous lyric line' : 'Câu hát trước'}
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer shrink-0 ${
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
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title={isEn ? 'Next lyric line' : 'Câu hát tiếp theo'}
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onReplayActiveLine}
            className="h-8 px-2 sm:px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center space-x-1 transition-all active:scale-95 cursor-pointer"
            title={isEn ? 'Replay current line (Shortcut: Tab)' : 'Nghe lại câu hiện tại (Phím tắt: Tab)'}
          >
            <RotateCcw className="w-3 h-3 shrink-0" />
            <span>{isEn ? 'Replay' : 'Nghe lại'}</span>
            <kbd className="hidden xl:inline-block px-1 py-0.2 rounded bg-slate-800 text-amber-200 font-mono text-[9px] border border-slate-700">
              Tab
            </kbd>
          </button>
        </div>

        {/* Center (Desktop lg+ Only): Inline Interactive Timeline Scrubber */}
        <div className="hidden lg:flex items-center space-x-2.5 flex-1 max-w-2xl mx-3">
          <span className="font-mono text-[11px] font-bold text-emerald-400 w-10 text-right shrink-0">
            {formatClock(currentTime)}
          </span>
          <div
            onClick={handleProgressBarClick}
            className="group relative flex-1 h-2 bg-slate-800 hover:h-2.5 rounded-full overflow-hidden cursor-pointer transition-all"
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
          <span className="font-mono text-[11px] text-slate-400 w-10 shrink-0">
            {formatClock(duration)}
          </span>
        </div>

        {/* Right: Dictation Assist Switches */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleAutoLoopLine}
            className={`h-8 px-2 rounded-lg border text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer shrink-0 ${
              isAutoLoopLine
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isEn ? 'Auto-Loop Active Line' : 'Tự lặp lại câu đang nghe'}
          >
            <Repeat className="w-3 h-3 shrink-0" />
            <span>{isEn ? 'Loop' : 'Lặp'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleAutoPauseLine}
            className={`h-8 px-2 rounded-lg border text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer shrink-0 ${
              isAutoPauseLine
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isEn ? 'Auto-Pause at Line End' : 'Tự dừng khi hết câu'}
          >
            <PauseCircle className="w-3 h-3 shrink-0" />
            <span>{isEn ? 'Pause' : 'Dừng'}</span>
          </button>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsSpeedOpen(prev => !prev)}
              className="h-8 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[11px] font-mono font-bold cursor-pointer"
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

          <button
            type="button"
            onClick={toggleMute}
            className="hidden sm:flex w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 items-center justify-center transition-colors cursor-pointer shrink-0"
            title={isMuted ? (isEn ? 'Unmute' : 'Bật âm') : (isEn ? 'Mute' : 'Tắt âm')}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
