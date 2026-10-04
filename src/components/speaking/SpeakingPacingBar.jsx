import React, { useMemo } from 'react';
import { Clock, Zap, AlertTriangle, CheckCircle2, Award, Flag, Sparkles } from 'lucide-react';
import { 
  PACING_PHASES, 
  getActivePacingPhase, 
  getFluencySafeZone 
} from '../../services/speakingFluencyService.js';

export { PACING_PHASES, getActivePacingPhase, getFluencySafeZone };


/**
 * Speaking Pacing Bar Component
 * Real-time Visual Rhythm Assistant for IELTS Speaking Part 2
 */
export default function SpeakingPacingBar({
  secondsElapsed = 0,
  isActive = false,
  compact = false,
  showStrategyTip = true,
  theme = 'dark'
}) {
  const sec = Math.max(0, Math.min(130, Number(secondsElapsed) || 0));
  const activePhase = useMemo(() => getActivePacingPhase(sec), [sec]);
  const safeZone = useMemo(() => getFluencySafeZone(sec), [sec]);

  const percentPhase1 = Math.min(25, (Math.min(30, sec) / 120) * 100);
  const percentPhase2 = Math.min(37.5, (Math.max(0, Math.min(45, sec - 30)) / 120) * 100);
  const percentPhase3 = Math.min(25, (Math.max(0, Math.min(30, sec - 75)) / 120) * 100);
  const percentPhase4 = Math.min(12.5, (Math.max(0, Math.min(15, sec - 105)) / 120) * 100);

  const formattedTime = `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
  const isWrapUpWarning = sec >= 105 && sec <= 120;

  return (
    <div className={`rounded-2xl border transition-all select-none text-left ${
      theme === 'dark' 
        ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-xl' 
        : 'bg-white border-slate-200 text-slate-800 shadow-md'
    } ${compact ? 'p-2.5 sm:p-3' : 'p-3.5 sm:p-4 space-y-2.5'}`}>
      
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg ${
            isWrapUpWarning 
              ? 'bg-rose-500/20 text-rose-400 animate-pulse' 
              : 'bg-indigo-500/20 text-indigo-400'
          }`}>
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Thanh Căn Nhịp 2 Phút (Pacing Bar)
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${safeZone.badgeClass}`}>
                {safeZone.label}
              </span>
            </div>
            {!compact && (
              <p className="text-[11px] text-slate-400 font-medium">
                4 Chặng Vàng Cambridge: Giữ nhịp 1:45 - 2:00 không lo hụt ý hay cháy giờ
              </p>
            )}
          </div>
        </div>

        {/* Live Clock Display */}
        <div className="text-right shrink-0">
          <span className={`text-base sm:text-lg font-mono font-black ${
            isWrapUpWarning 
              ? 'text-rose-400 animate-pulse' 
              : sec >= 75 
                ? 'text-emerald-400' 
                : 'text-amber-400'
          }`}>
            {formattedTime} <span className="text-xs text-slate-500 font-normal">/ 02:00</span>
          </span>
          {isWrapUpWarning && (
            <span className="block text-[10px] font-extrabold text-rose-400 uppercase tracking-wider">
              ⚠️ Đang về đích ({120 - sec}s)
            </span>
          )}
        </div>
      </div>

      {/* The 4-Stage Segmented Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex shadow-inner relative">
          
          {/* Phase 1: 0 - 30s (25%) */}
          <div 
            className="bg-emerald-500 transition-all duration-300 h-full relative"
            style={{ width: `${percentPhase1}%` }}
            title="Chặng 1 (0 - 30s): Mở đầu & bối cảnh"
          />

          {/* Phase 2: 30 - 75s (37.5%) */}
          <div 
            className="bg-blue-500 transition-all duration-300 h-full relative"
            style={{ width: `${percentPhase2}%` }}
            title="Chặng 2 (30 - 75s): Diễn biến chi tiết"
          />

          {/* Phase 3: 75 - 105s (25%) */}
          <div 
            className="bg-amber-500 transition-all duration-300 h-full relative"
            style={{ width: `${percentPhase3}%` }}
            title="Chặng 3 (75 - 105s): Cao trào & điểm nhấn"
          />

          {/* Phase 4: 105 - 120s (12.5%) */}
          <div 
            className="bg-rose-500 transition-all duration-300 h-full relative"
            style={{ width: `${percentPhase4}%` }}
            title="Chặng 4 (105 - 120s): Bài học & đúc kết"
          />

          {/* 75s Safe Zone Marker Line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white/60 z-10 pointer-events-none" 
            style={{ left: '62.5%' }}
            title="Mốc 1:15 (Tối thiểu không bị non giờ)"
          />

          {/* 105s Mastery Marker Line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-300/80 z-10 pointer-events-none" 
            style={{ left: '87.5%' }}
            title="Mốc 1:45 (Bắt đầu kết bài)"
          />
        </div>

        {/* Milestone Labels Under Bar */}
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 px-0.5">
          <span className={sec <= 30 ? 'text-emerald-400 font-extrabold' : ''}>
            0s <span className="hidden sm:inline font-normal">(Bắt đầu)</span>
          </span>
          <span className={sec > 30 && sec <= 75 ? 'text-blue-400 font-extrabold' : ''}>
            30s <span className="hidden sm:inline font-normal">(Chi tiết)</span>
          </span>
          <span className={sec > 75 && sec <= 105 ? 'text-amber-400 font-extrabold' : 'text-slate-400'}>
            1:15 <span className="hidden sm:inline font-normal">(Cao trào)</span>
          </span>
          <span className={sec > 105 && sec <= 120 ? 'text-rose-400 font-extrabold' : 'text-slate-400'}>
            1:45 <span className="hidden sm:inline font-normal">(Kết bài)</span>
          </span>
          <span className="text-purple-400 font-extrabold">
            2:00 <span className="hidden sm:inline font-normal">(Chạm đích)</span>
          </span>
        </div>
      </div>

      {/* Real-Time Phase Coaching Tip */}
      {showStrategyTip && (
        <div className={`p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between gap-2.5 ${
          isWrapUpWarning
            ? 'bg-rose-950/70 border-rose-500/60 text-rose-200'
            : activePhase.phase === 3
              ? 'bg-amber-950/70 border-amber-500/60 text-amber-200'
              : activePhase.phase === 2
                ? 'bg-blue-950/70 border-blue-500/60 text-blue-200'
                : 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
        }`}>
          <div className="flex items-center space-x-2 min-w-0">
            <div className="p-1 rounded-md bg-white/10 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="font-black text-[11px] uppercase tracking-wider block">
                {activePhase.titleVi}:
              </span>
              <p className="text-[11px] opacity-90 leading-snug">
                {activePhase.strategyVi}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right hidden sm:block">
            <span className="text-[10px] font-bold opacity-75 uppercase block">Trọng tâm:</span>
            <span className="text-[11px] font-black bg-white/10 px-2 py-0.5 rounded-md">
              {activePhase.bulletTarget}
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
