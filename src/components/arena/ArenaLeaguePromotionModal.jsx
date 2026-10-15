import React from 'react';
import { Trophy, ArrowRight, Sparkles, Award, Zap, X } from 'lucide-react';
import { useTranslation } from '../../i18n';

/**
 * src/components/arena/ArenaLeaguePromotionModal.jsx
 * 
 * Celebratory Modal triggered upon Sunday Midnight / Weekly Reset
 * when the user finishes in the Top 20% of their League Tier.
 */
export default function ArenaLeaguePromotionModal({
  isOpen = false,
  transition = null,
  onClose
}) {
  const { t, isEn } = useTranslation();

  if (!isOpen || !transition) return null;

  const isPromotion = transition.action === 'promoted';
  const tierColor = {
    bronze: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    silver: 'bg-slate-400/20 text-slate-300 border-slate-400/40',
    gold: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    platinum: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    diamond: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/50 rounded-3xl p-6 text-white shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Decorative Golden Ambient Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Fanfare Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/30 to-purple-600/30 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 shadow-xl shadow-amber-500/20 mb-4 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        {/* Title */}
        <span className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isEn ? 'WEEKLY LEAGUE ROLLOVER' : 'TỔNG KẾT TUẦN BẢNG ĐẤU'}</span>
          <Sparkles className="w-3.5 h-3.5" />
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight leading-tight mb-2">
          {isPromotion 
            ? (isEn ? '🎉 LEAGUE PROMOTED!' : '🎉 CHÚC MỪNG THĂNG HẠNG!') 
            : (isEn ? 'Weekly League Summary' : 'Tổng Kết Tuần Bảng Đấu')}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          {isPromotion
            ? (isEn 
                ? `You finished rank #${transition.userRank} in the Top 20%! You have ascended to a higher tier league.`
                : `Bạn xuất sắc cán đích hạng #${transition.userRank} trong Top 20%! Bạn đã thăng cấp lên giải đấu danh giá hơn.`)
            : (isEn
                ? `Weekly reset completed. Defend your rank in the new week!`
                : `Tuần thi đấu mới đã bắt đầu. Hãy thi đấu để thăng hạng tuần này!`)}
        </p>

        {/* Promotion Tier Visual Step */}
        <div className="flex items-center justify-center gap-3 w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-5">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border ${tierColor[transition.previousTier] || tierColor.bronze}`}>
            {t(`arena.${transition.previousTier}`) || transition.previousTier}
          </span>

          <ArrowRight className="w-5 h-5 text-amber-400 animate-pulse" />

          <span className={`text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl border shadow-lg ${tierColor[transition.newTier] || tierColor.silver}`}>
            {t(`arena.${transition.newTier}`) || transition.newTier}
          </span>
        </div>

        {/* Bonus XP Reward */}
        {transition.bonusXp > 0 && (
          <div className="w-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/50 rounded-2xl p-3.5 flex items-center justify-between mb-6 shadow-md">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  {isEn ? 'Weekly Starter Reward' : 'Thưởng Khởi Đầu Tuần Mới'}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {isEn ? 'Promotion Clearance Bonus' : 'Phần thưởng thăng hạng xuất sắc'}
                </span>
              </div>
            </div>
            <span className="text-lg font-black text-amber-300 font-mono">
              +{transition.bonusXp} XP
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/30 active:scale-95"
        >
          {isEn ? 'Enter Arena Now' : 'Vào Đấu Ngay'}
        </button>
      </div>
    </div>
  );
}
