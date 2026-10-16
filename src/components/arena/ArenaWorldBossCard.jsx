import React from 'react';
import { Skull, ShieldAlert, Zap, Award, Flame } from 'lucide-react';
import { getDailyWorldBoss, WORLD_BOSS_QUALIFYING_DAMAGE } from '../../services/gamification/worldBossRaidService.js';

/**
 * src/components/arena/ArenaWorldBossCard.jsx
 * 
 * Compact Lobby Banner Component for Daily Cambridge World Boss Raid.
 * Showcases today's rotating Titan Boss, global community HP pool, and player milestone progress.
 * Optimized for single-screen zero-scroll layout.
 */
export default function ArenaWorldBossCard({ isEn = false }) {
  const boss = getDailyWorldBoss();

  const hpPercent = Math.max(0, Math.round((boss.currentHp / boss.maxHp) * 100));
  const playerDmg = boss.playerDamageDealt || 0;
  const isMilestoneReached = playerDmg >= WORLD_BOSS_QUALIFYING_DAMAGE;

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-rose-500/30 rounded-2xl p-2.5 sm:p-3 shadow-md relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-2.5 relative z-10">
        {/* Boss Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-xl shadow-inner shrink-0">
            {boss.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 shrink-0">
                <Skull className="w-2.5 h-2.5" />
                {isEn ? 'Daily World Boss Raid' : 'Săn Boss Thế Giới Hằng Ngày'}
              </span>
              {boss.currentHp <= 0 && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  {isEn ? 'DEFEATED' : 'ĐÃ HẠ GỤC'}
                </span>
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-black text-white mt-0.5 truncate">
              {isEn ? boss.nameEn : boss.nameVi}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">
              {isEn ? `Weakness: ${boss.weakness}` : `Điểm yếu: ${boss.weakness}`}
            </p>
          </div>
        </div>

        {/* Player Raid Contribution Badge */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-lg px-2 py-1 shrink-0">
          <div className="text-right">
            <div className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider">
              {isEn ? 'Your Dmg' : 'Sát thương'}
            </div>
            <div className="text-[11px] sm:text-xs font-black text-rose-400">
              {playerDmg.toLocaleString()}
            </div>
          </div>
          <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 ${
            isMilestoneReached 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            <Award className="w-3 h-3" />
            <span>{isMilestoneReached ? '+20 XP ✓' : `${playerDmg}/${WORLD_BOSS_QUALIFYING_DAMAGE}`}</span>
          </div>
        </div>
      </div>

      {/* Global Boss HP Bar */}
      <div className="mt-2">
        <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 mb-0.5">
          <span className="flex items-center gap-1">
            <Flame className="w-2.5 h-2.5 text-rose-400" />
            <span>{isEn ? 'Global Boss HP' : 'Máu Boss Toàn Máy Chủ'}</span>
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-200">
            {boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()} ({hpPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 relative">
          <div 
            className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
