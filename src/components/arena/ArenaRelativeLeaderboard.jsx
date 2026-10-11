import React from 'react';
import { Trophy, Flame, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from '../../i18n';

/**
 * src/components/arena/ArenaRelativeLeaderboard.jsx
 * 
 * Dynamic Relative Leaderboard Slice (+-5 rivals around user).
 * Visualizes:
 * - Promotion Zone (Top 20%)
 * - Safe Zone
 * - Relegation Zone (Bottom 15%)
 * - Seamless offline/cloud synchronized rivals
 */
export default function ArenaRelativeLeaderboard({
  rivals = [],
  currentUserId = null,
  userWeeklyXp = 0,
  leagueTier = 'bronze'
}) {
  const { t } = useTranslation();

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
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
      {/* Header: League Tier & Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-200">
            {t('arena.leaderboardTitle')}
          </h3>
        </div>

        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tierColors}`}>
          {t(`arena.${leagueTier}`) || leagueTier}
        </span>
      </div>

      {/* Rivals List */}
      <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
        {rivals.map((rival, index) => {
          const isUser = rival.user_id === currentUserId || rival.isCurrentUser;
          const rank = rival.rank || index + 1;
          const isPromotion = rank <= promoThreshold;
          const isRelegation = rank >= relThreshold;

          let rowBorder = 'border-slate-800/60 bg-slate-800/30';
          if (isUser) {
            rowBorder = 'border-indigo-500/80 bg-indigo-950/40 ring-1 ring-indigo-500/50';
          }

          return (
            <div
              key={rival.user_id || index}
              className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-colors ${rowBorder}`}
            >
              {/* Rank & User Info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-5 font-mono font-bold text-center ${
                  rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-amber-600' : 'text-slate-500'
                }`}>
                  {rank}
                </span>

                <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden shrink-0">
                  <img
                    src={rival.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${rival.display_name}`}
                    alt={rival.display_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-1.5 truncate">
                  <span className={`font-semibold truncate ${isUser ? 'text-indigo-200' : 'text-slate-200'}`}>
                    {rival.display_name || 'Candidate'}
                  </span>
                  {isUser && (
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1 rounded font-bold">
                      YOU
                    </span>
                  )}
                </div>
              </div>

              {/* Stats & Promotion Badges */}
              <div className="flex items-center gap-3 shrink-0">
                {rival.streak_count > 0 && (
                  <div className="flex items-center gap-0.5 text-amber-400 text-[11px]" title="Streak">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    <span>{rival.streak_count}</span>
                  </div>
                )}

                <div className="text-right min-w-[50px]">
                  <span className="font-mono font-bold text-slate-100">
                    {rival.weekly_xp || 0}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-0.5">XP</span>
                </div>

                {/* Zone Indicator */}
                {isPromotion ? (
                  <ArrowUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" title={t('arena.promotionZone')} />
                ) : isRelegation ? (
                  <ArrowDown className="w-3.5 h-3.5 text-rose-400 shrink-0" title={t('arena.relegationZone')} />
                ) : (
                  <div className="w-3.5 h-3.5 shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
