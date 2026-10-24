import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, ChevronRight, Gift, Sparkles, Trophy } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { 
  getDailySprintsData, 
  claimAtlasKnowledgeVault, 
  isDailySprintsAllCompleted 
} from '../../services/gamification/atlasDailyQuestService.js';
import { triggerHaptic } from '../../utils/hapticHelper.js';
import { playArenaSfx } from '../../utils/audioHelper.js';

export default function AtlasDailySprintCard({ onClaimVault, onStartSprint }) {
  const { t, isEn } = useTranslation();
  const [data, setData] = useState(() => getDailySprintsData());
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setData(getDailySprintsData());
    if (typeof window !== 'undefined') {
      window.addEventListener('atlas_daily_sprints_updated', handleUpdate);
      window.addEventListener('focus', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('atlas_daily_sprints_updated', handleUpdate);
        window.removeEventListener('focus', handleUpdate);
      }
    };
  }, []);

  const completedCount = data.quests.filter(q => q.isCompleted).length;
  const isAllDone = isDailySprintsAllCompleted(data);

  const handleClaim = () => {
    setIsClaiming(true);
    triggerHaptic('comboMilestone');
    playArenaSfx('vault');
    const res = claimAtlasKnowledgeVault();
    if (res.success) {
      setData(getDailySprintsData());
      onClaimVault?.(res.reward);
    }
    setIsClaiming(false);
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-indigo-500/30 rounded-2xl p-3 sm:p-3.5 backdrop-blur-md shadow-lg shadow-indigo-950/20">
      {/* Header: Title + Progress Counter */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Target className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs sm:text-sm font-black text-slate-100 truncate">
            {isEn ? 'Daily Objectives' : 'Mục Tiêu Ngày'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-mono font-bold text-indigo-300">
            {completedCount}/3
          </span>
          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3 Quest Rows */}
      <div className="flex flex-col gap-1.5 mb-2.5">
        {data.quests.map((quest) => {
          const isDone = quest.isCompleted;
          const percent = Math.min(100, Math.round((quest.current / quest.target) * 100));

          return (
            <div 
              key={quest.id}
              className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all ${
                isDone 
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="text-sm shrink-0">{quest.icon}</span>
                <div className="min-w-0">
                  <div className={`font-bold truncate text-[11px] sm:text-xs ${isDone ? 'line-through opacity-70 text-emerald-400' : 'text-slate-200'}`}>
                    {isEn ? quest.titleEn : quest.titleVi}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate hidden sm:block">
                    {isEn ? quest.descEn : quest.descVi}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[10px] text-amber-400 font-bold">
                  +{quest.rewardXp} XP
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                    {quest.current}/{quest.target}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vault Claim CTA or Status */}
      {isAllDone ? (
        data.isVaultClaimed ? (
          <div className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isEn ? 'Vault Claimed!' : 'Đã Nhận Rương!'}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClaim}
            disabled={isClaiming}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/30 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.98] animate-pulse"
          >
            <Gift className="w-4 h-4 shrink-0" />
            <span>{isEn ? 'Claim Knowledge Vault' : 'Nhận Rương Tri Thức'}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )
      ) : (
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>{isEn ? 'Complete all 3 for Vault:' : 'Hoàn thành 3 mục tiêu:'}</span>
          <span className="font-mono font-bold text-amber-300">+120 XP & Shield 💎</span>
        </div>
      )}
    </div>
  );
}
