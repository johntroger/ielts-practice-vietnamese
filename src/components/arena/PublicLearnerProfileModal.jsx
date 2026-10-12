import React, { useState } from 'react';
import { 
  X, 
  Trophy, 
  Flame, 
  Sparkles, 
  Heart, 
  Swords, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Share2 
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { safeGet, safeSet } from '../../utils/storageService.js';

/**
 * src/components/arena/PublicLearnerProfileModal.jsx
 * 
 * Interactive Public Scholar Profile Modal for Atlas English Arena.
 * Allows learners to view each other's 100-Level progression, glowing frame,
 * send Kudos (High-Five / Cheer), view author tasks, and challenge in the Arena.
 */
export default function PublicLearnerProfileModal({
  learner = null,
  isOpen = false,
  onClose,
  onChallengeSprint = null
}) {
  const { t } = useTranslation();
  const [hasCheered, setHasCheered] = useState(false);
  const [kudosCount, setKudosCount] = useState(() => {
    if (!learner) return 0;
    const key = `ielts_kudos_${learner.display_name || learner.user_id}`;
    return Number(safeGet(key, learner.isOwner ? 128 : 12));
  });

  if (!isOpen || !learner) return null;

  const isOwner = learner.isOwner || 
                  learner.display_name === 'tranthanhtung37' || 
                  learner.email === 'tranthanhtung37@gmail.com';

  const level = learner.level || 1;
  const titanTier = learner.titanTier || {
    titleVi: 'Kẻ Khởi Hành Atlas',
    titleEn: 'Atlas Seeker',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-600',
    ringColor: 'ring-slate-600',
    accentText: 'text-slate-300'
  };

  const progress = learner.levelProgress || {
    progressPercent: 35,
    xpIntoLevel: 318,
    xpRequiredForNextLevel: 918,
    xpRemaining: 600,
    nextLevelBaseXp: 10000
  };

  const handleSendKudo = () => {
    if (hasCheered) return;
    const nextCount = kudosCount + 1;
    setKudosCount(nextCount);
    setHasCheered(true);
    const key = `ielts_kudos_${learner.display_name || learner.user_id}`;
    safeSet(key, nextCount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-white flex flex-col gap-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Ambient Glow */}
        <div className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br ${
          isOwner ? 'from-amber-500 to-indigo-600' : 'from-indigo-500 to-purple-600'
        }`} />

        {/* Top Action Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>HỒ SƠ ĐẤU SĨ ATLAS • PUBLIC SCHOLAR</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Đóng hồ sơ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header Profile Identity */}
        <div className="flex items-center gap-4 relative z-10">
          {/* Glowing Avatar Frame */}
          <div className={`relative w-20 h-20 rounded-2xl bg-slate-800 overflow-hidden shrink-0 shadow-lg ring-4 ${titanTier.ringColor}`}>
            <img
              src={learner.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${learner.display_name}`}
              alt={learner.display_name}
              className="w-full h-full object-cover"
            />
            {isOwner && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-amber-400 rounded-full ring-2 ring-slate-950" title="Admin Verified" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-100 truncate">
                {learner.display_name || 'Học Viên'}
              </h2>
              {isOwner && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded font-black tracking-wide">
                  👑 ADMIN
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg border shadow-xs ${titanTier.badgeColor}`}>
                CẤP {level}
              </span>
              <span className={`text-xs font-bold ${titanTier.accentText}`}>
                {titanTier.titleEn}
              </span>
            </div>

            <span className="text-[11px] text-slate-400 mt-0.5">
              {isOwner ? 'Quản Trị Viên & Tác Giả Hơn 210 Đề Thi' : 'Đấu Sĩ Tích Cực Trên Hệ Thống'}
            </span>
          </div>
        </div>

        {/* Level XP Progress Bar Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2.5 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Tiến Trình Cấp Độ (XP Progress)</span>
            <span className="font-mono font-bold text-indigo-300">
              {progress.progressPercent}%
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${
                isOwner ? 'from-amber-500 to-indigo-500' : 'from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${progress.progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>{learner.total_xp || 0} Total XP</span>
            <span>
              {progress.isMaxLevel ? 'MAX LEVEL' : `Cần thêm ${progress.xpRemaining} XP lên Lv.${level + 1}`}
            </span>
          </div>
        </div>

        {/* 4 Key Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-sm font-black text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{learner.streak_count || 1}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Chuỗi Streak</div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-sm font-black text-indigo-300 font-mono">
              {learner.weekly_xp || 0}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">XP Tuần Này</div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-sm font-black text-cyan-300 capitalize">
              {learner.league_tier || 'Bronze'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Hạng Giải Đấu</div>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-sm font-black text-rose-400 flex items-center justify-center gap-1 font-mono">
              <Heart className={`w-3.5 h-3.5 ${hasCheered ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{kudosCount}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Lượt Bái Phục</div>
          </div>
        </div>

        {/* Showcase Badges (Tủ Kính 3 Huy Hiệu Danh Dự) */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col gap-2 relative z-10">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            🏅 Huy Hiệu Danh Dự Đạt Được
          </span>
          <div className="grid grid-cols-3 gap-2">
            {/* Badge 1: Streak Master */}
            <div className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 ${
              (learner.streak_count || 1) >= 7 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                : 'bg-slate-800/30 border-slate-800 text-slate-500'
            }`}>
              <Flame className="w-4 h-4" />
              <span className="text-[10px] font-bold">Chuỗi Bất Bại</span>
              <span className="text-[9px] text-slate-400 font-mono">Streak {learner.streak_count || 1}d</span>
            </div>

            {/* Badge 2: Sharpshooter */}
            <div className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 ${
              level >= 5
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/30 border-slate-800 text-slate-500'
            }`}>
              <Trophy className="w-4 h-4" />
              <span className="text-[10px] font-bold">Xạ Thủ Phản Xạ</span>
              <span className="text-[9px] text-slate-400 font-mono">Cấp {level}</span>
            </div>

            {/* Badge 3: Master Architect / Contributor */}
            <div className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 ${
              isOwner
                ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                : 'bg-slate-800/30 border-slate-800 text-slate-500'
            }`}>
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-bold">Đại Sư Kiến Tạo</span>
              <span className="text-[9px] text-slate-400 font-mono">{isOwner ? '210+ Đề Thi' : 'Đấu Sĩ'}</span>
            </div>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1 relative z-10">
          {/* Send Kudo Cheer Button */}
          <button
            type="button"
            onClick={handleSendKudo}
            disabled={hasCheered}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
              hasCheered
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 cursor-default'
                : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200 active:scale-95'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasCheered ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
            <span>{hasCheered ? 'Đã Gửi Bái Phục 👏' : 'Bái Phục / Cổ Vũ 👏'}</span>
          </button>

          {/* Challenge Sprint Button */}
          <button
            type="button"
            onClick={() => {
              onClose?.();
              onChallengeSprint?.();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
          >
            <Swords className="w-4 h-4" />
            <span>Vào Đua Điểm Đấu Trường</span>
          </button>
        </div>
      </div>
    </div>
  );
}
