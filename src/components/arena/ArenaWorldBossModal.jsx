import React from 'react';
import { Skull, X, Flame, Award, Zap, Shield, Swords, Calendar, Info, CheckCircle2 } from 'lucide-react';
import { 
  getDailyWorldBoss, 
  DAILY_WORLD_BOSSES, 
  WORLD_BOSS_QUALIFYING_DAMAGE, 
  WORLD_BOSS_RAID_BONUS_XP,
  WORLD_BOSS_MAX_HP 
} from '../../services/gamification/worldBossRaidService.js';
import { useTranslation } from '../../i18n';

/**
 * src/components/arena/ArenaWorldBossModal.jsx
 * 
 * Interactive Raid Intel & Strategy Briefing Modal for Daily Cambridge World Boss Raid.
 * Explains raid mechanics, damage formulas, weekly rotation, and allows direct 1-click sprint launch.
 */
export default function ArenaWorldBossModal({
  isOpen = false,
  onClose,
  onStartSprint,
  isEn = false
}) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const currentBoss = getDailyWorldBoss();
  const hpPercent = Math.max(0, Math.round((currentBoss.currentHp / currentBoss.maxHp) * 100));
  const playerDmg = currentBoss.playerDamageDealt || 0;
  const isMilestoneReached = playerDmg >= WORLD_BOSS_QUALIFYING_DAMAGE;
  const currentDayIndex = new Date().getUTCDay();

  const dayNamesVi = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-rose-500/40 rounded-2xl shadow-2xl text-white flex flex-col max-h-[92dvh] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border-b border-rose-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40">
              <Skull className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-white leading-snug">
                {isEn ? 'Daily World Boss Raid Intel' : 'Hồ Sơ Săn Boss Thế Giới Hằng Ngày'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {isEn ? 'Global Community Cambridge Titan Event' : 'Chiến dịch săn trùm khảo thí toàn máy chủ'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isEn ? 'Close' : 'Đóng'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto min-h-0 text-xs">
          {/* Active Boss Card Showcase */}
          <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/20 border border-rose-500/30 rounded-xl p-3 flex flex-col gap-2.5">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
                {currentBoss.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {isEn ? 'Today\'s Titan' : 'Boss Hôm Nay'}
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">
                    ({isEn ? dayNamesEn[currentDayIndex] : dayNamesVi[currentDayIndex]})
                  </span>
                </div>
                <h4 className="text-base font-black text-white mt-0.5">
                  {isEn ? currentBoss.nameEn : currentBoss.nameVi}
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {isEn ? currentBoss.descriptionEn : currentBoss.descriptionVi}
                </p>
                <div className="mt-1 text-[11px] font-semibold text-rose-300">
                  <span className="text-slate-400">{isEn ? 'Weakness: ' : 'Điểm yếu: '}</span>
                  <span className="underline decoration-rose-500/50">{currentBoss.weakness}</span>
                </div>
              </div>
            </div>

            {/* Boss HP Bar */}
            <div className="pt-1.5 border-t border-rose-500/20">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-bold">{isEn ? 'Server Global HP' : 'Máu Boss Toàn Máy Chủ'}</span>
                </span>
                <span className="font-mono text-xs font-bold text-rose-200">
                  {currentBoss.currentHp.toLocaleString()} / {currentBoss.maxHp.toLocaleString()} ({hpPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Player Personal Damage & Raid Milestone */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                {isEn ? 'Your Damage Today' : 'Sát thương của bạn hôm nay'}
              </div>
              <div className="text-lg font-black text-rose-400 font-mono mt-0.5">
                {playerDmg.toLocaleString()} dmg
              </div>
            </div>
            <div className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 ${
              isMilestoneReached
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}>
              <Award className="w-4 h-4 shrink-0" />
              <div>
                <div>{isMilestoneReached ? (isEn ? 'Raid Bonus Claimed!' : 'Đã nhận thưởng Raid!') : (isEn ? `Goal: ${WORLD_BOSS_QUALIFYING_DAMAGE} dmg` : `Mục tiêu: ${WORLD_BOSS_QUALIFYING_DAMAGE} dmg`)}</div>
                <div className="text-[9px] font-normal text-slate-400">
                  {isMilestoneReached ? (isEn ? `+${WORLD_BOSS_RAID_BONUS_XP} XP credited to weekly rank` : `Đã cộng +${WORLD_BOSS_RAID_BONUS_XP} XP vào rank`) : (isEn ? `Reach 400 dmg to earn +${WORLD_BOSS_RAID_BONUS_XP} XP` : `Đạt 400 dmg nhận ngay +${WORLD_BOSS_RAID_BONUS_XP} XP`)}
                </div>
              </div>
            </div>
          </div>

          {/* How It Works & Damage Formula */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Swords className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isEn ? 'How To Deal Boss Damage' : 'Cách Gây Sát Thương Lên Boss'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isEn 
                ? 'Every sprint match in Atlas English Arena automatically inflicts damage onto the daily World Boss:' 
                : 'Mỗi trận đấu trong Đấu Trường sẽ tự động quy đổi thành sát thương tấn công Boss Thế Giới:'}
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
              <div className="bg-slate-900/80 border border-slate-700/70 rounded-lg p-1.5">
                <div className="text-[10px] text-slate-400 font-sans">{isEn ? '1 Correct Q' : '1 Câu Đúng'}</div>
                <div className="text-xs font-black text-indigo-300 mt-0.5">+120 dmg</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-700/70 rounded-lg p-1.5">
                <div className="text-[10px] text-slate-400 font-sans">{isEn ? '1 Max Combo' : '1 Combo'}</div>
                <div className="text-xs font-black text-amber-300 mt-0.5">+30 dmg</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-700/70 rounded-lg p-1.5">
                <div className="text-[10px] text-slate-400 font-sans">{isEn ? 'Boss Clear' : 'Hạ Trùm Q7'}</div>
                <div className="text-xs font-black text-rose-300 mt-0.5">+250 dmg</div>
              </div>
            </div>
          </div>

          {/* 7-Day Weekly Titan Rotation List */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-300 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? '7-Day Cambridge Titan Rotation' : 'Lịch Xoay Tua 7 Boss Cambridge Trong Tuần'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {DAILY_WORLD_BOSSES.map((boss) => {
                const isToday = boss.dayIndex === currentDayIndex;
                return (
                  <div 
                    key={boss.id}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-[11px] ${
                      isToday 
                        ? 'bg-rose-950/30 border-rose-500/50 text-rose-200' 
                        : 'bg-slate-950/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-base shrink-0">{boss.icon}</span>
                    <div className="min-w-0 flex-1 truncate">
                      <div className="font-bold truncate flex items-center gap-1">
                        <span>{isEn ? boss.nameEn : boss.nameVi}</span>
                        {isToday && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-rose-500/30 text-rose-300 uppercase font-extrabold">
                            {isEn ? 'TODAY' : 'HÔM NAY'}
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate">
                        {isEn ? dayNamesEn[boss.dayIndex] : dayNamesVi[boss.dayIndex]} • {boss.weakness}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            {isEn ? 'Close' : 'Đóng'}
          </button>
          {onStartSprint && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartSprint();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs transition-all shadow-md shadow-rose-600/30 cursor-pointer flex items-center gap-1.5"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{isEn ? 'Raid Boss Now' : 'Tham Gia Săn Boss Ngay'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
