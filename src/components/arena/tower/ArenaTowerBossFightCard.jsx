/**
 * src/components/arena/tower/ArenaTowerBossFightCard.jsx
 * 
 * Interactive Cambridge Boss Battle Card for Floor 10 / Floor 20 encounters.
 * Features Boss HP bar, turn damage floating numbers, and phase alerts.
 */

import React from 'react';
import { useTranslation } from '../../../i18n';
import { Skull, Flame, Zap, ShieldAlert } from 'lucide-react';

export default function ArenaTowerBossFightCard({
  boss,
  lastDamageDealt = 0,
  isCriticalHit = false
}) {
  const { t, isEn } = useTranslation();

  if (!boss) return null;

  const currentHp = Math.max(0, boss.currentHp || 0);
  const maxHp = boss.maxHp || 600;
  const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

  const isEnraged = hpPercent <= 35;

  return (
    <div className={`w-full max-w-2xl sm:max-w-3xl lg:max-w-5xl mx-auto rounded-2xl p-3 sm:p-4 bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-purple-950/40 border-2 ${
      isEnraged ? 'border-red-500 shadow-xl shadow-red-950/50 animate-pulse' : 'border-amber-500/50 shadow-lg'
    } flex flex-col gap-2 relative overflow-hidden select-none`}>
      {/* Boss Identity Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="text-3xl sm:text-4xl p-2 rounded-2xl bg-rose-500/20 border border-rose-500/40 shrink-0">
            {boss.avatar || '👑'}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-sm sm:text-lg text-white truncate">
                {isEn ? boss.nameEn : boss.nameVi}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black border border-rose-500/40 uppercase tracking-wider">
                {isEn ? boss.titleEn : boss.titleVi}
              </span>
              {isEnraged && (
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider animate-bounce">
                  🔥 {isEn ? 'ENRAGED PHASE' : 'GIAI ĐOẠN CUỒNG NỘ'}
                </span>
              )}
            </div>
            <p className="text-xs text-rose-300/80 italic mt-0.5">
              {isEn ? boss.attackDescEn : boss.attackDescVi}
            </p>
          </div>
        </div>

        {/* Floating Damage Indicator */}
        {lastDamageDealt > 0 && (
          <div className="flex flex-col items-end animate-bounce">
            <span className={`font-mono font-black text-lg sm:text-2xl ${
              isCriticalHit ? 'text-amber-300 text-2xl sm:text-3xl' : 'text-rose-400'
            }`}>
              -{lastDamageDealt} HP
            </span>
            {isCriticalHit && (
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/60 shadow-xs">
                ⚡ {isEn ? 'CRITICAL HIT!' : 'ĐÒN CHÍ MẠNG!'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Dynamic Boss HP Bar */}
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex justify-between items-baseline text-xs font-mono font-bold">
          <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Skull className="w-3.5 h-3.5 text-rose-400" />
            <span>Boss Health</span>
          </span>
          <span className="text-rose-300">
            {currentHp} / {maxHp} ({Math.round(hpPercent)}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner p-0.5 border border-slate-700/60">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isEnraged
                ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 animate-pulse'
                : 'bg-gradient-to-r from-rose-600 to-purple-600'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
