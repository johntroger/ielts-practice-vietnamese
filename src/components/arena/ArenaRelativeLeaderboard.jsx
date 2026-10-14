import React from 'react';
import { Trophy, Flame, ArrowUp, ArrowDown, ShieldCheck, Sparkles, UserCheck, Shield, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../i18n';

/**
 * src/components/arena/ArenaRelativeLeaderboard.jsx
 * 
 * 100% Real-User Leaderboard for Atlas English Arena.
 * Completely eliminates dummy / bot rivals.
 * Displays 100-Level Atlas Progression Badges, Glowing Avatar Frames,
 * and enables interactive click-to-view peer scholar profile.
 */
export default function ArenaRelativeLeaderboard({
  rivals = [],
  currentUserId = null,
  currentUserEmail = null,
  userWeeklyXp = 0,
  leagueTier = 'bronze',
  onSelectLearner = null
}) {
  const { t, isEn } = useTranslation();

  const tierColors = {
    bronze: 'text-amber-600 bg-amber-500/10 border-amber-500/30',
    silver: 'text-slate-300 bg-slate-400/10 border-slate-400/30',
    gold: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    platinum: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    diamond: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
  }[leagueTier] || 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';

  const totalCount = rivals.length || 1;
  const promoThreshold = Math.ceil(totalCount * 0.2);
  const relThreshold = totalCount - Math.ceil(totalCount * 0.15);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-2xl backdrop-blur-md">
      {/* Header: League Tier & Real Users Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <h3 className="text-sm font-bold text-slate-100">
              {t('arena.leaderboardTitle')}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <UserCheck className="w-3 h-3 text-emerald-400" />
            <span>{t('arena.realLearnersOnly')}</span>
          </div>
        </div>

        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${tierColors}`}>
          {t(`arena.${leagueTier}`) || leagueTier}
        </span>
      </div>

      {/* Real Learners List */}
      <div className="flex flex-col gap-2 max-h-[380px] md:max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
        {rivals.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            <span>{t('arena.syncingRealLearners')}</span>
          </div>
        ) : (
          rivals.map((rival, index) => {
            const isOwner = rival.isOwner || 
                            rival.display_name === 'tranthanhtung37' || 
                            rival.email === 'tranthanhtung37@gmail.com';

            const isUser = rival.isCurrentUser || 
                           (currentUserId && rival.user_id === currentUserId) ||
                           (currentUserEmail && rival.email === currentUserEmail) ||
                           (currentUserEmail === 'tranthanhtung37@gmail.com' && isOwner);

            const rank = rival.rank || index + 1;
            const level = rival.level || 1;
            const titanTier = rival.titanTier || {
              titleVi: 'Kẻ Khởi Hành',
              titleEn: 'Atlas Seeker',
              badgeColor: 'bg-slate-800 text-slate-300 border-slate-600',
              ringColor: 'ring-slate-600',
              accentText: 'text-slate-300'
            };

            const isPromotion = totalCount >= 5 && rank <= promoThreshold;
            const isRelegation = totalCount >= 5 && rank >= relThreshold;

            let rowStyle = 'border-slate-800/80 bg-slate-800/40 hover:bg-slate-800/80 hover:border-indigo-500/50';
            if (isOwner && isUser) {
              rowStyle = 'border-amber-500/70 bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-900 ring-1 ring-amber-500/60 hover:ring-amber-400';
            } else if (isOwner) {
              rowStyle = 'border-amber-500/50 bg-amber-950/20 ring-1 ring-amber-500/40 hover:ring-amber-400/80';
            } else if (isUser) {
              rowStyle = 'border-indigo-500/80 bg-indigo-950/50 ring-1 ring-indigo-500/60 hover:ring-indigo-400';
            }

            return (
              <div
                key={rival.user_id || rival.display_name || index}
                onClick={() => onSelectLearner?.(rival)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs transition-all duration-200 cursor-pointer select-none group hover:scale-[1.01] active:scale-[0.99] ${rowStyle}`}
                title={t('arena.learnerTitle', { name: rival.display_name || t('arena.anonymousLearner') })}
              >
                {/* Rank, Glowing Avatar & Level Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-5 font-mono font-black text-center text-sm ${
                    rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    {rank}
                  </span>

                  {/* Glowing Frame Avatar */}
                  <div className={`relative w-8 h-8 rounded-full bg-slate-800 overflow-hidden shrink-0 shadow-sm ring-2 ${titanTier.ringColor} transition-transform group-hover:scale-105`}>
                    <img
                      src={rival.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${rival.display_name}`}
                      alt={rival.display_name}
                      className="w-full h-full object-cover"
                    />
                    {isOwner && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-400 rounded-full ring-1 ring-slate-950" title="Admin Verified" />
                    )}
                  </div>

                  {/* Names, Level Badge & Titan Tier Title */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      {/* Level Badge */}
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded border shadow-xs shrink-0 ${titanTier.badgeColor}`}>
                        Lv.{level}
                      </span>

                      <span className={`font-bold truncate text-xs group-hover:text-white transition-colors ${
                        isOwner ? 'text-amber-300' : isUser ? 'text-indigo-200' : 'text-slate-100'
                      }`}>
                        {rival.display_name || t('arena.anonymousLearner')}
                      </span>

                      {/* Prominent Badges */}
                      {isOwner && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-black tracking-wide shrink-0">
                          👑 ADMIN
                        </span>
                      )}

                      {isUser && (
                        <span className="text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 px-1.5 py-0.2 rounded font-black tracking-wide shrink-0">
                          YOU
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className={`font-semibold ${titanTier.accentText}`}>
                        {isEn ? (titanTier.titleEn || titanTier.titleVi) : (titanTier.titleVi || titanTier.titleEn)}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{rival.league_tier || 'Bronze'}</span>
                    </div>
                  </div>
                </div>

                {/* Stats & Click Chevron */}
                <div className="flex items-center gap-3 shrink-0">
                  {rival.streak_count > 0 && (
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs" title={`Streak: ${rival.streak_count}d`}>
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rival.streak_count}</span>
                    </div>
                  )}

                  <div className="text-right min-w-[55px]">
                    <span className="font-mono font-black text-slate-100 text-sm">
                      {rival.weekly_xp || 0}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-0.5 font-bold">XP</span>
                  </div>

                  {/* Zone Indicator (when total players >= 5) */}
                  {totalCount >= 5 && (
                    isPromotion ? (
                      <ArrowUp className="w-4 h-4 text-emerald-400 shrink-0" title={t('arena.promotionZone')} />
                    ) : isRelegation ? (
                      <ArrowDown className="w-4 h-4 text-rose-400 shrink-0" title={t('arena.relegationZone')} />
                    ) : (
                      <div className="w-4 h-4 shrink-0" />
                    )
                  )}

                  {/* Hover Chevron */}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Real Learners Interactive Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>{t('arena.clickToViewProfile')}</span>
        <span className="text-indigo-400 font-semibold">{t('arena.autoPromotionNotice')}</span>
      </div>
    </div>
  );
}
