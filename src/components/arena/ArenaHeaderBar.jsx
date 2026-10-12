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
  timeRemaining = 90,
  totalTime = 90,
  remainingShields = 5,
  maxShields = 5,
  combo = 0,
  currentIndex = 0,
  totalQuestions = 7,
  isMuted = false,
  isFullscreen = false,
  onToggleMute,
  onToggleFullscreen,
  onClose
}) {
  const { t } = useTranslation();
  const isUrgent = timeRemaining <= 10;
  const progressPercent = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 text-white select-none shrink-0">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Progress & Combo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-300 border border-slate-700/60">
            <span>{t('arena.stageQuestionHeader', { num: currentIndex + 1, title: '' }) || `Q${currentIndex + 1}/${totalQuestions}`}</span>
          </div>

          {combo >= 2 && (
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>{combo}x {t('arena.combo')}</span>
            </div>
          )}
        </div>

        {/* Center: Timer Bar & Time Display */}
        <div className="flex flex-col items-center flex-1 max-w-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`text-base font-black tracking-wider ${isUrgent ? 'text-red-400 animate-bounce' : 'text-slate-100'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isUrgent ? 'bg-red-500' : 'bg-indigo-500'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: 5 Shields, Audio & Close */}
        <div className="flex items-center gap-3">
          {/* Shields */}
          <div className="flex items-center gap-0.5" title={`${remainingShields}/${maxShields} ${t('arena.shieldCount')}`}>
            {Array.from({ length: maxShields }).map((_, i) => (
              <Shield
                key={i}
                className={`w-4 h-4 transition-colors ${
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
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {/* Close / Exit */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
            title={t('common.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
