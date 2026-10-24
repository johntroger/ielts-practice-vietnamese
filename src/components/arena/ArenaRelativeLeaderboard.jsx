import React, { useMemo } from 'react';
import { Trophy, Flame, ArrowUp, ArrowDown, ShieldCheck, Sparkles, UserCheck, Shield, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { computeGhostRivalPacing } from '../../services/gamification/leagueEngine.js';

/**
 * src/components/arena/ArenaRelativeLeaderboard.jsx
 * 
 * 100% Real-User Leaderboard for Atlas English Arena.
 * Completely eliminates dummy / bot rivals.
 * Phase 3 Upgrades:
 * - Ghost Rival Pacing Callout (Overtake push & Leader lead stats)
 * - Visual Promotion Zone Boundary (Top 20% Emerald line)
 * - Visual Relegation Zone Boundary (Bottom 15% Rose line)
 * - Status indicators on each row (Up, Down, Safe)
 * - Interactive click-to-view peer scholar profile
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

  const pacing = useMemo(() => computeGhostRivalPacing(rivals, currentUserId), [rivals, currentUserId]);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col gap-2.5 shadow-2xl backdrop-blur-md">
      {/* Header: League Tier & Real Users Badge */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              {t('arena.leaderboardTitle')}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-400 font-medium">
            <UserCheck className="w-3 h-3 text-emerald-400" />
            <span>{t('arena.realLearnersOnly')}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline-flex text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60">
            {t('arena.cohortBadge')}
          </span>
          <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tierColors}`}>
            {t(`arena.${leagueTier}`) || leagueTier}
          </span>
        </div>
      </div>

      {/* Ghost Rival Near-Pacing Callout */}
      {pacing.aheadRival && (
        <div className="bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-500/40 rounded-xl px-2.5 sm:px-3 py-1.5 flex items-center justify-between text-[11px] shadow-sm animate-fade-in gap-2">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold min-w-0 truncate">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
            <span className="truncate">
              {isEn ? `+${pacing.xpToOvertake} XP to pass` : `+${pacing.xpToOvertake} XP để vượt`} <strong className="text-white underline">@{pacing.aheadRival.display_name}</strong>
            </span>
            <span className="text-amber-400/80 font-mono text-[10px] shrink-0">#{pacing.aheadRival.rank}</span>
          </div>
          <span className="text-[10px] text-amber-300 font-mono font-bold shrink-0 px-1.5 py-0.5 rounded bg-amber-500/20 whitespace-nowrap">
            ⚡ 1 sprint
          </span>
        </div>
      )}

      {pacing.isLeader && (
        <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-indigo-950/40 border border-amber-400/50 rounded-xl px-2.5 sm:px-3 py-1.5 flex items-center justify-between text-[11px] shadow-sm animate-fade-in gap-2">
          <div className="flex items-center gap-1.5 text-amber-200 font-bold min-w-0 truncate">
            <span>👑</span>
            <span className="truncate">{isEn ? 'Dominating League #1!' : 'Thống lĩnh Bảng đấu #1!'}</span>
            {pacing.behindRival && (
              <span className="text-amber-300/80 font-semibold text-[10px] shrink-0">
                (+{pacing.leadXp} XP {isEn ? 'lead' : 'cách biệt'})
              </span>
            )}
          </div>
          <span className="text-[10px] text-amber-300 font-mono uppercase font-black shrink-0 px-1.5 py-0.5 rounded bg-amber-500/20 whitespace-nowrap">Top 1</span>
        </div>
      )}

      {/* Real Learners List */}
      <div className="flex flex-col gap-1.5 max-h-[240px] sm:max-h-[280px] md:max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
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

            const isGuest = rival.isGuest || 
                            rival.user_id === 'guest_player' || 
                            /bạn\s*\(khách\)/i.test(rival.display_name) || 
                            /you\s*\(guest\)/i.test(rival.display_name) ||
                            rival.display_name_en === 'You (Guest)';

            const resolvedDisplayName = isGuest
              ? (isEn ? 'You (Guest)' : 'Bạn (Khách)')
              : (rival.display_name || t('arena.anonymousLearner'));

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

            const showPromoDivider = totalCount >= 5 && index === promoThreshold && index > 0;
            const showRelDivider = totalCount >= 5 && index === (relThreshold - 1) && index > promoThreshold;

            return (
              <React.Fragment key={rival.user_id || rival.display_name || index}>
                {/* Visual Promotion Zone Boundary Line */}
                {showPromoDivider && (
                  <div className="flex items-center gap-2 py-1 select-none">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      ▲ {t('arena.promotionZone') || (isEn ? 'Promotion Zone (Top 20%)' : 'Vùng Thăng Hạng (Top 20%)')}
                    </span>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                  </div>
                )}

                {/* Visual Relegation Zone Boundary Line */}
                {showRelDivider && (
                  <div className="flex items-center gap-2 py-1 select-none">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/40">
                      ▼ {t('arena.relegationZone') || (isEn ? 'Relegation Zone (Bottom 15%)' : 'Vùng Nguy Hiểm (15% Cuối)')}
                    </span>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
                  </div>
                )}

                <div
                  onClick={() => onSelectLearner?.(rival)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all duration-200 cursor-pointer select-none group hover:scale-[1.01] active:scale-[0.99] ${rowStyle}`}
                  title={t('arena.learnerTitle', { name: rival.display_name || t('arena.anonymousLearner') })}
                >
                  {/* Rank, Glowing Avatar & Level Info */}
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-1.5">
                    <span className={`w-4 sm:w-5 font-mono font-black text-center text-xs sm:text-sm shrink-0 ${
                      rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      {rank}
                    </span>

                    {/* Glowing Frame Avatar */}
                    <div className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 overflow-hidden shrink-0 shadow-sm ring-2 ${titanTier.ringColor} transition-transform group-hover:scale-105`}>
                      <img
                        src={rival.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${rival.display_name}`}
                        alt={rival.display_name}
                        className="w-full h-full object-cover"
                      />
                      {isOwner && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-amber-400 rounded-full ring-1 ring-slate-950" title="Admin Verified" />
                      )}
                    </div>

                    {/* Names, Level Badge & Titan Tier Title */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                        {/* Level Badge */}
                        <span className={`text-[9px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.2 rounded border shadow-xs shrink-0 whitespace-nowrap ${titanTier.badgeColor}`}>
                          Lv.{level}
                        </span>

                        <span className={`font-bold truncate text-xs min-w-0 group-hover:text-white transition-colors ${
                          isOwner ? 'text-amber-300' : isUser ? 'text-indigo-200' : 'text-slate-100'
                        }`}>
                          {resolvedDisplayName}
                        </span>

                        {/* Badges - single unified badge for owner/user to prevent name truncation */}
                        {isOwner ? (
                          <span className="text-[9px] sm:text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-black tracking-wide shrink-0 whitespace-nowrap">
                            👑 {isUser ? (isEn ? 'ADMIN (YOU)' : 'ADMIN (BẠN)') : 'ADMIN'}
                          </span>
                        ) : isUser ? (
                          <span className="text-[9px] sm:text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 px-1.5 py-0.2 rounded font-black tracking-wide shrink-0 whitespace-nowrap">
                            {isEn ? 'YOU' : 'BẠN'}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-400 min-w-0 truncate">
                        <span className={`font-semibold truncate ${titanTier.accentText}`}>
                          {isEn ? (titanTier.titleEn || titanTier.titleVi) : (titanTier.titleVi || titanTier.titleEn)}
                        </span>
                        <span className="shrink-0">•</span>
                        <span className="capitalize shrink-0">{rival.league_tier || 'Bronze'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats & Click Chevron */}
                  <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                    {rival.streak_count > 0 && (
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs" title={`Streak: ${rival.streak_count}d`}>
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rival.streak_count}</span>
                      </div>
                    )}

                    <div className="text-right min-w-[50px] sm:min-w-[55px]">
                      <span className="font-mono font-black text-slate-100 text-xs sm:text-sm">
                        {rival.weekly_xp || 0}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-0.5 font-bold">XP</span>
                    </div>

                    {/* Zone Indicator (when total players >= 5) */}
                    {totalCount >= 5 && (
                      isPromotion ? (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded shadow-xs" title={t('arena.promotionZone')}>
                          <ArrowUp className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="hidden sm:inline">{isEn ? 'Up' : 'Lên'}</span>
                        </span>
                      ) : isRelegation ? (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 rounded shadow-xs" title={t('arena.relegationZone')}>
                          <ArrowDown className="w-3 h-3 text-rose-400 shrink-0" />
                          <span className="hidden sm:inline">{isEn ? 'Down' : 'Rớt'}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 px-1" title={t('arena.safeZone') || (isEn ? 'Safe Zone' : 'An Toàn')}>
                          ―
                        </span>
                      )
                    )}

                    {/* Hover Chevron */}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Real Learners Interactive Footer */}
      <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
        <span>{t('arena.clickToViewProfile')}</span>
        <span className="text-indigo-400 font-semibold">{t('arena.autoPromotionNotice')}</span>
      </div>
    </div>
  );
}
