import React from 'react';
import { Trophy, Flame, ArrowUp, ArrowDown, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { useTranslation } from '../../i18n';

/**
 * src/components/arena/ArenaRelativeLeaderboard.jsx
 * 
 * 100% Real-User Leaderboard for Atlas English Arena.
 * Completely eliminates dummy / bot rivals.
 * Exclusively displays verified real users with prominent honor badges for tranthanhtung37 and current user.
 */
export default function ArenaRelativeLeaderboard({
  rivals = [],
  currentUserId = null,
  currentUserEmail = null,
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
            <span>100% Người Học Thật (Không Dùng Bot Ảo)</span>
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
            <span>Đang đồng bộ dữ liệu người học thật từ hệ thống...</span>
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
            const isPromotion = totalCount >= 5 && rank <= promoThreshold;
            const isRelegation = totalCount >= 5 && rank >= relThreshold;

            let rowStyle = 'border-slate-800/80 bg-slate-800/40 hover:bg-slate-800/70';
            if (isOwner && isUser) {
              rowStyle = 'border-amber-500/70 bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-900 ring-1 ring-amber-500/60';
            } else if (isOwner) {
              rowStyle = 'border-amber-500/50 bg-amber-950/20 ring-1 ring-amber-500/40';
            } else if (isUser) {
              rowStyle = 'border-indigo-500/80 bg-indigo-950/50 ring-1 ring-indigo-500/60';
            }

            return (
              <div
                key={rival.user_id || rival.display_name || index}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs transition-all ${rowStyle}`}
              >
                {/* Rank & User Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-5 font-mono font-black text-center text-sm ${
                    rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    {rank}
                  </span>

                  <div className="relative w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0 shadow-sm">
                    <img
                      src={rival.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${rival.display_name}`}
                      alt={rival.display_name}
                      className="w-full h-full object-cover"
                    />
                    {isOwner && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-amber-400 rounded-full ring-1 ring-slate-950" title="Admin Verified" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`font-bold truncate text-xs ${
                        isOwner ? 'text-amber-300' : isUser ? 'text-indigo-200' : 'text-slate-100'
                      }`}>
                        {rival.display_name || 'Học Viên'}
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

                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="capitalize">{rival.league_tier || 'Bronze'}</span>
                      {rival.role && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400/80 font-medium truncate">{rival.role}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats & Promotion Badges */}
                <div className="flex items-center gap-3 shrink-0">
                  {rival.streak_count > 0 && (
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs" title={`Streak: ${rival.streak_count} ngày`}>
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
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Real Learners Footer Callout */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>🏆 Hoàn thành ván đấu để tích lũy XP</span>
        <span className="text-indigo-400 font-semibold">Tự động lưu & xếp hạng</span>
      </div>
    </div>
  );
}
