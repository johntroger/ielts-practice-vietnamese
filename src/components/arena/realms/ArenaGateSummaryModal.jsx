/**
 * src/components/arena/realms/ArenaGateSummaryModal.jsx
 * 
 * Climax Result & Stars Award Modal for IELTS Skill Realms Gate Sprint.
 * Displays 1-3 Stars reveal, XP/Gold earnings, and Next Gate progression.
 */

import React, { useEffect } from 'react';
import { Star, Award, Zap, Coins, Clock, RotateCcw, ChevronRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../../i18n';
import { triggerHaptic } from '../../../utils/hapticHelper.js';
import { playArenaSfx } from '../../../utils/audioHelper.js';

export default function ArenaGateSummaryModal({
  result,
  gate,
  realm,
  nextGate,
  onReplay,
  onNextGate,
  onClose
}) {
  const { isEn } = useTranslation();

  if (!result || !gate) return null;

  const stars = result.starsAwarded || 0;
  const isMastered = stars >= 3;
  const isPassed = stars >= 1;

  useEffect(() => {
    if (isMastered) {
      triggerHaptic('comboMilestone');
      playArenaSfx('victory');
    } else if (result.isNewlyUnlocked) {
      triggerHaptic('loot');
      playArenaSfx('surge');
    } else if (isPassed) {
      playArenaSfx('correct');
    } else {
      playArenaSfx('wrong');
    }
  }, [isMastered, result.isNewlyUnlocked, isPassed]);

  return (
    <div className="relative w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white shadow-2xl flex flex-col items-center gap-4 text-center animate-fade-in select-none">
      {/* Top Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3.5 right-3.5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
        title={isEn ? 'Return to Hub' : 'Quay về Cung Điện'}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Top Gate Badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {gate.partLabel}
        </span>
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/80">
          {gate.targetBand}
        </span>
      </div>

      {/* Main Title */}
      <div>
        <h2 className="text-lg sm:text-2xl font-black text-slate-100 tracking-tight">
          {isEn ? gate.titleEn : gate.titleVi}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isMastered
            ? (isEn ? '🌟 3 Stars Mastery!' : '🌟 Đạt 3 sao hoàn hảo!')
            : isPassed
              ? (isEn ? '🎉 Gate Cleared!' : '🎉 Vượt ải thành công!')
              : (isEn ? 'Reach 60%+ to clear this gate.' : 'Cần đạt 60%+ để qua ải.')}
        </p>
      </div>

      {/* 3 Stars Animated Container */}
      <div className="flex items-center justify-center gap-3 py-2">
        {[1, 2, 3].map(starNum => {
          const hasStar = stars >= starNum;
          return (
            <div
              key={starNum}
              className={`p-2 rounded-2xl border transition-all duration-300 transform ${
                hasStar
                  ? 'bg-amber-500/20 border-amber-500/50 scale-110 shadow-lg shadow-amber-500/20 animate-bounce'
                  : 'bg-slate-800/40 border-slate-800 text-slate-700 scale-95'
              }`}
            >
              <Star
                className={`w-8 h-8 sm:w-10 sm:h-10 ${
                  hasStar
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                    : 'text-slate-700 fill-slate-800'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Stats Summary Grid: XP, Gold, Accuracy, Time */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
        {/* XP */}
        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center">
          <div className="flex items-center gap-1 text-amber-400 font-mono font-black text-base sm:text-lg">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>+{result.finalXp || 0}</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">XP</span>
        </div>

        {/* Gold */}
        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center">
          <div className="flex items-center gap-1 text-amber-400 font-mono font-black text-base sm:text-lg">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>+{result.rewardGold || 0}</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Gold</span>
        </div>

        {/* Accuracy */}
        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center">
          <span className="font-mono font-black text-base sm:text-lg text-emerald-400">
            {result.accuracy || 0}%
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            {isEn ? 'Accuracy' : 'Độ chính xác'}
          </span>
        </div>

        {/* Time Remaining */}
        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center">
          <div className="flex items-center gap-1 text-indigo-400 font-mono font-black text-base sm:text-lg">
            <Clock className="w-4 h-4" />
            <span>{result.timeRemainingSeconds || 0}s</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            {isEn ? 'Remaining' : 'Còn lại'}
          </span>
        </div>
      </div>

      {/* Newly Unlocked Banner */}
      {result.isNewlyUnlocked && nextGate && (
        <div className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 flex items-center justify-center gap-2 text-xs text-emerald-300 font-bold animate-pulse shadow-md">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>
            {isEn 
              ? `Unlocked: Gate ${nextGate.gateNumber} (${nextGate.partLabel})`
              : `Mở khóa: Ải ${nextGate.gateNumber} (${nextGate.partLabel})`}
          </span>
        </div>
      )}

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full mt-2">
        <button
          type="button"
          onClick={onReplay}
          className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-slate-300" />
          <span>{isEn ? 'Replay' : 'Chơi Lại'}</span>
        </button>

        {isPassed && nextGate && onNextGate ? (
          <button
            type="button"
            onClick={onNextGate}
            className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
          >
            <span>{isEn ? 'Next Gate' : 'Ải Tiếp Theo'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
          >
            <span>{isEn ? 'Return' : 'Quay Lại'}</span>
          </button>
        )}
      </div>

      {/* Tertiary Return Link if Next Gate is shown */}
      {isPassed && nextGate && onNextGate && (
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer underline underline-offset-4"
        >
          {isEn ? '← Return to Hub' : '← Quay lại Sảnh'}
        </button>
      )}
    </div>
  );
}
