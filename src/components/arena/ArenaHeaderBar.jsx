import React from 'react';
import { Volume2, VolumeX, X, Shield, Zap, Maximize2, Minimize2 } from 'lucide-react';
import { useTranslation } from '../../i18n';

/**
 * src/components/arena/ArenaHeaderBar.jsx
 * 
 * High-Density Exam Telemetry Bar for Atlas English Arena.
 * Features:
 * - Real-time countdown timer with 10s urgent pulsing
 * - 5 Interactive Shields tracker
 * - Combo streak multiplier pill
 * - Fullscreen toggle, quick mute & exit buttons
 */
export default function ArenaHeaderBar({
  timeRemaining = 180,
  totalTime = 180,
  remainingShields = 5,
  maxShields = 5,
  combo = 0,
  currentIndex = 0,
  totalQuestions = 7,
  isMuted = false,
  isFullscreen = false,
  isSpeedrunMode = false,
  onToggleSpeedrun,
  onToggleMute,
  onToggleFullscreen,
  onClose
}) {
  const { t, isEn } = useTranslation();
  const isDanger = timeRemaining <= 30;
  const isWarning = timeRemaining > 30 && timeRemaining <= 60;
  const progressPercent = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white select-none shrink-0 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Left: Progress & Combo Burst */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 border border-slate-700/60 shadow-xs">
            <span>{t('arena.stageQuestionHeader', { num: currentIndex + 1, total: totalQuestions }) || `Q${currentIndex + 1}/${totalQuestions}`}</span>
          </div>

          {combo >= 5 ? (
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/25 to-rose-500/25 text-amber-300 border border-amber-400/60 px-2.5 py-0.5 rounded-full text-xs font-black animate-combo-burst shadow-sm shadow-amber-500/30">
              <Zap className="w-3.5 h-3.5 fill-amber-400 animate-bounce" />
              <span>{combo}x {t('arena.superCombo')}</span>
            </div>
          ) : combo >= 2 ? (
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full text-xs font-bold animate-combo-burst shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>{combo}x {t('arena.combo')}</span>
            </div>
          ) : null}
        </div>

        {/* Center: Dynamic Urgency Timer & Bar */}
        <div className="flex flex-col items-center flex-1 max-w-xs">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`text-base sm:text-lg font-mono font-black tracking-wider ${
              isDanger 
                ? 'text-rose-400 animate-pulse' 
                : isWarning 
                  ? 'text-amber-300' 
                  : 'text-slate-100'
            }`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-300 ${
                isDanger 
                  ? 'bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 animate-pulse' 
                  : isWarning 
                    ? 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300' 
                    : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Speedrun Toggle, 5 Shields, Audio, Fullscreen & Close */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Speedrun Auto-Advance Toggle */}
          {onToggleSpeedrun && (
            <button
              type="button"
              onClick={onToggleSpeedrun}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs select-none active:scale-95 ${
                isSpeedrunMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-amber-950/40'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-300'
              }`}
              title={t('arena.speedrunTitle') || (isEn ? 'Speedrun: Auto-advances immediately on correct answer' : 'Bứt tốc: Tự động qua câu khi làm đúng')}
            >
              <Zap className={`w-3.5 h-3.5 ${isSpeedrunMode ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline font-mono">
                {t('arena.speedrunMode') || (isEn ? 'Speedrun' : 'Bứt Tốc')}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${isSpeedrunMode ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
            </button>
          )}

          {/* Shields */}
          <div className="flex items-center gap-0.5" title={`${remainingShields}/${maxShields} ${t('arena.shieldCount')}`}>
            {Array.from({ length: maxShields }).map((_, i) => (
              <Shield
                key={i}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                  i < remainingShields 
                    ? 'text-cyan-400 fill-cyan-400' 
                    : 'text-slate-700 fill-transparent'
                }`}
              />
            ))}
          </div>

          {/* Mute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className="p-1 sm:p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="p-1 sm:p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {/* Close / Exit */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title={t('common.close')}
            aria-label={t('common.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full-width dynamic energy bar running along header bottom */}
      <div className="w-full h-0.5 sm:h-1 bg-slate-800/80 relative overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            isDanger 
              ? 'bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 animate-pulse shadow-xs shadow-rose-500' 
              : isWarning 
                ? 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300' 
                : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
}
