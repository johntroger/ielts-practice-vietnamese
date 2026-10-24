/**
 * src/components/arena/realms/ArenaGatePortalCard.jsx
 * 
 * Interactive Portal Card representing an individual IELTS Part/Task Gate.
 * Displays stars mastery, target band, XP rewards, and Enter/Replay trigger.
 */

import React from 'react';
import { Star, Lock, Zap, Coins, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../../i18n';
import { triggerHaptic } from '../../../utils/hapticHelper.js';

export default function ArenaGatePortalCard({
  gate,
  stars = 0,
  isUnlocked = false,
  bestScore = 0,
  onEnterGate
}) {
  const { isEn } = useTranslation();

  const isMastered = stars >= 3;
  const isPassed = stars >= 1;

  const handleCardClick = () => {
    if (!isUnlocked) {
      triggerHaptic('boundaryAlert');
      return;
    }
    triggerHaptic('chipTap');
    onEnterGate?.(gate);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 select-none ${
        !isUnlocked
          ? 'bg-slate-950/60 border-slate-800/60 opacity-60 cursor-not-allowed'
          : isMastered
            ? 'bg-gradient-to-br from-amber-950/30 via-slate-900 to-purple-950/40 border-amber-500/50 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/15 cursor-pointer ring-1 ring-amber-400/20 hover:scale-[1.01]'
            : isPassed
              ? 'bg-gradient-to-br from-slate-900/90 via-slate-900 to-indigo-950/40 border-indigo-700/60 hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/10 cursor-pointer hover:scale-[1.01]'
              : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-500 hover:shadow-md cursor-pointer hover:scale-[1.01]'
      }`}
    >
      {/* Top Meta: Part Label, Band Badge & Lock / Check icon */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {gate.partLabel}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80">
            {gate.targetBand}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {!isUnlocked ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-400 text-[10px] font-bold border border-slate-700">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>{isEn ? 'Locked' : 'Khóa'}</span>
            </div>
          ) : isMastered ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/40 shadow-xs animate-pulse">
              <span>👑 {isEn ? 'MASTERED' : 'HOÀN THÀNH'}</span>
            </div>
          ) : isPassed ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              <span>{isEn ? 'Passed' : 'Đã Vượt'}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Title & Description */}
      <div className="flex flex-col gap-1 mb-3">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-100 group-hover:text-white leading-snug">
          {isEn ? gate.titleEn : gate.titleVi}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {isEn ? gate.descEn : gate.descVi}
        </p>
      </div>

      {/* Bottom Bar: 3 Stars, Rewards & Action Button */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {/* 3 Stars Container */}
        <div className="flex items-center gap-1">
          {[1, 2, 3].map(starNum => {
            const hasStar = stars >= starNum;
            return (
              <Star
                key={starNum}
                className={`w-4 h-4 transition-transform duration-200 ${
                  hasStar
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)] scale-105'
                    : 'text-slate-700 fill-slate-800'
                }`}
              />
            );
          })}
        </div>

        {/* Rewards Chips: Base XP & Gold */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-black text-amber-400 font-mono">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>+{gate.baseXp * 5} XP</span>
          </span>

          {/* Action Trigger */}
          {isUnlocked ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs transition-all shadow-xs cursor-pointer active:scale-95 ${
                isMastered
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  : isPassed
                    ? 'bg-slate-800 hover:bg-indigo-600/30 text-indigo-200 border border-slate-700 hover:border-indigo-500/60'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/20'
              }`}
            >
              {isPassed ? (
                <>
                  <RotateCcw className="w-3 h-3 text-indigo-300" />
                  <span>{isEn ? 'Replay' : 'Chơi lại'}</span>
                </>
              ) : (
                <>
                  <span>{isEn ? 'Enter Gate' : 'Vào Ải'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : (
            <span className="text-[10px] text-slate-500 font-medium">
              {isEn ? `Requires 1★ on Gate ${gate.gateNumber - 1}` : `Cần 1★ ở Ải ${gate.gateNumber - 1}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
