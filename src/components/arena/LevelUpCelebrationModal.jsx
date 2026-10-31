import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Share2, 
  X, 
  Award, 
  Flame, 
  Crown 
} from 'lucide-react';
import { useTranslation } from '../../i18n';

/**
 * src/components/arena/LevelUpCelebrationModal.jsx
 * 
 * High-Octane Level-Up Celebration Modal for Atlas English Arena.
 * Features:
 * - Dynamic level & Atlas Titan tier fanfare
 * - Milestone reward & glowing avatar frame unlock announcement
 * - Fireworks / Particle ambient styling
 */
export default function LevelUpCelebrationModal({
  isOpen = false,
  oldLevel = 1,
  newLevel = 2,
  tier = null,
  onClose,
  onContinue
}) {
  const { t, isEn } = useTranslation();

  if (!isOpen) return null;

  const titanTier = tier || {
    titleVi: 'Đấu Sĩ Đấu Trường',
    titleEn: 'Atlas Gladiator',
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
    ringColor: 'ring-emerald-500/50',
    accentText: 'text-emerald-400'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-lg animate-fadeIn select-none">
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-indigo-950/80 to-slate-950 border border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-white flex flex-col items-center text-center gap-5 overflow-hidden ring-1 ring-indigo-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Ambient Particle Glow */}
        <div className="absolute -top-20 -left-20 w-52 h-52 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Triumphant Level-Up Badge Icon */}
        <div className="relative mt-2">
          {/* Animated Glow Halo */}
          <div className="absolute inset-0 rounded-3xl blur-xl bg-gradient-to-tr from-amber-400 via-indigo-500 to-purple-600 opacity-70 animate-pulse" />
          
          <div className={`relative w-24 h-24 rounded-3xl bg-slate-900 border-2 border-amber-400/80 flex flex-col items-center justify-center shadow-2xl ring-4 ${titanTier.ringColor}`}>
            <Crown className="w-6 h-6 text-amber-400 mb-0.5 animate-bounce" />
            <span className="text-2xl font-black font-mono text-white tracking-wider">
              Lv.{newLevel}
            </span>
          </div>
        </div>

        {/* Level Up Announcement Headlines */}
        <div className="flex flex-col gap-1.5 relative z-10">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-400">
            <Sparkles className="w-4 h-4 fill-amber-400" />
            <span>{t('arena.levelUpHeader')}</span>
            <Sparkles className="w-4 h-4 fill-amber-400" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {t('arena.levelUpCongrats', { level: newLevel })}
          </h2>

          <div className="flex items-center justify-center gap-2 mt-1">
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg border ${titanTier.badgeColor}`}>
              {isEn ? (titanTier.titleEn || titanTier.titleVi) : (titanTier.titleVi || titanTier.titleEn)}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              ({isEn ? titanTier.titleVi : titanTier.titleEn})
            </span>
          </div>
        </div>

        {/* Unlocked Privileges Card */}
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5 text-left text-xs relative z-10">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {t('arena.rewardsTitle')}
          </span>

          <div className="flex items-center gap-2.5 text-slate-200">
            <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-cyan-300 font-mono">
              +{15 + ([11, 26, 46, 71, 91].includes(newLevel) ? 50 : 0)} 💎 {isEn ? 'Atlas Diamonds Awarded' : 'Kim Cương Atlas'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-200">
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span>{t('arena.rewardAvatarFrame')}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-200">
            <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <span>{t('arena.rewardTitlePromotion')}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-200">
            <div className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Award className="w-3.5 h-3.5" />
            </div>
            <span>{t('arena.rewardProfilePrestige')}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            onClose?.();
            onContinue?.();
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] relative z-10"
        >
          <span>{t('arena.continueToNextLevel', { nextLevel: newLevel + 1 })}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
