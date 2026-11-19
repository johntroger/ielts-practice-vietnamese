/**
 * src/components/arena/realms/ArenaSkillRealmsHub.jsx
 * 
 * Interactive Hub for the 4 Skill Realms (Listening, Reading, Writing, Speaking).
 * Features:
 * - 4-Room Segmented Switcher with glowing skill theme badges
 * - Star Progress Tracker per realm & overall
 * - Gate Portal Cards grid for the active realm
 * - Guardian Trial Climax Banner
 * - Compact single-screen layout with zero scroll clipping
 */

import React, { useState } from 'react';
import { Star, Shield, Trophy, Sparkles, ChevronRight, Crown, Flame, Lock } from 'lucide-react';
import { useTranslation } from '../../../i18n';
import HeadingInfoTip from '../../common/HeadingInfoTip.jsx';
import { 
  SKILL_REALMS, 
  SKILL_REALM_IDS, 
  getRealmStats, 
  getAllRealmsOverallStats, 
  isGateUnlocked, 
  getGateStars 
} from '../../../services/gamification/skillRealmsEngine.js';
import ArenaGatePortalCard from './ArenaGatePortalCard.jsx';
import { triggerHaptic } from '../../../utils/hapticHelper.js';

const REALM_THEME_STYLES = {
  listening: {
    selected: 'bg-slate-900 border-cyan-500/70 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950/30 scale-[1.01]',
    badge: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
  },
  reading: {
    selected: 'bg-slate-900 border-emerald-500/70 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/30 scale-[1.01]',
    badge: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
  },
  writing: {
    selected: 'bg-slate-900 border-purple-500/70 ring-2 ring-purple-500/40 shadow-lg shadow-purple-950/30 scale-[1.01]',
    badge: 'bg-purple-500/15 border-purple-500/40 text-purple-300'
  },
  speaking: {
    selected: 'bg-slate-900 border-amber-500/70 ring-2 ring-amber-500/40 shadow-lg shadow-amber-950/30 scale-[1.01]',
    badge: 'bg-amber-500/15 border-amber-500/40 text-amber-300'
  }
};

export default function ArenaSkillRealmsHub({
  progress,
  activeRealmId,
  onSelectRealm,
  onEnterGate,
  onChallengeGuardian
}) {
  const { isEn } = useTranslation();
  const [selectedRealmId, setSelectedRealmId] = useState(activeRealmId || SKILL_REALM_IDS.LISTENING);

  const activeRealm = SKILL_REALMS.find(r => r.id === selectedRealmId) || SKILL_REALMS[0];
  const realmStats = getRealmStats(progress, selectedRealmId);
  const overallStats = getAllRealmsOverallStats(progress);

  const handleRealmTabClick = (realmId) => {
    triggerHaptic('chipTap');
    setSelectedRealmId(realmId);
    onSelectRealm?.(realmId);
  };

  return (
    <div className="w-full flex-1 flex flex-col max-w-5xl mx-auto p-1 sm:p-4 lg:overflow-hidden gap-2 sm:gap-3 animate-fade-in select-none">
      {/* Ultra-Compact Header Bar: Title + (i) + Global Stars Pill */}
      <div className="w-full flex items-center justify-between gap-2 px-1 sm:px-3.5 py-1 sm:py-2.5 sm:bg-slate-900/90 sm:border sm:border-indigo-900/40 sm:rounded-2xl shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base sm:text-xl shrink-0">🏛️</span>
          <h2 className="text-xs sm:text-base font-black text-slate-100 tracking-tight truncate">
            {isEn ? 'Skill Realms' : 'Cung Điện Kỹ Năng'}
          </h2>
          <HeadingInfoTip
            title={isEn ? 'Skill Realms (16 Gates)' : 'Cung Điện Kỹ Năng (16 Ải)'}
            content={isEn 
              ? '• Conquer 16 official Cambridge Part & Task Gates across 4 skills\n• Earn 1-3 Stars per Gate based on accuracy\n• Clear all Gates in a Realm (1★+) to unlock its Realm Guardian Boss!'
              : '• Chinh phục 16 Ải chuẩn Part & Task Cambridge thuộc 4 kỹ năng\n• Đạt 1-3 Sao mỗi Ải theo độ chính xác\n• Vượt qua toàn bộ Ải (1★+) của một kỹ năng để mở khóa Thủ Lĩnh Cung Điện!'}
            dark={true}
            isEn={isEn}
          />
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-black text-xs shadow-xs shrink-0">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{overallStats.grandTotalStars}/{overallStats.grandMaxStars}</span>
        </div>
      </div>

      {/* 4-Room Segmented Switcher Tabs (Single compact row) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 shrink-0">
        {SKILL_REALMS.map(realm => {
          const isSelected = realm.id === selectedRealmId;
          const rStats = getRealmStats(progress, realm.id);
          const themeStyle = REALM_THEME_STYLES[realm.id] || REALM_THEME_STYLES.listening;
          const shortName = {
            listening: isEn ? 'Listening' : 'Nghe',
            reading: isEn ? 'Reading' : 'Đọc',
            writing: isEn ? 'Writing' : 'Viết',
            speaking: isEn ? 'Speaking' : 'Nói'
          }[realm.id] || (isEn ? realm.nameEn : realm.nameVi);
          
          return (
            <button
              key={realm.id}
              type="button"
              onClick={() => handleRealmTabClick(realm.id)}
              className={`flex flex-col items-center sm:items-stretch py-1.5 px-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl border text-center sm:text-left transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] ${
                isSelected
                  ? themeStyle.selected
                  : 'bg-slate-900/60 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-center sm:justify-between gap-1 w-full">
                <span className="text-base sm:text-xl leading-none">{realm.icon}</span>
                <div className="flex items-center gap-0.5 font-mono text-[10px] sm:text-[11px] font-bold text-amber-300">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 fill-amber-400" />
                  <span>{rStats.totalStars}/{rStats.maxStars}</span>
                </div>
              </div>

              <span className={`text-[11px] sm:text-xs font-extrabold truncate w-full mt-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {shortName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Gates for Active Realm + Guardian Climax Boss at Bottom */}
      <div className="w-full lg:flex-1 lg:overflow-y-auto lg:pr-1 flex flex-col gap-2 sm:gap-2.5 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
          {activeRealm.gates.map(gate => {
            const gateStars = getGateStars(progress, gate.id);
            const unlocked = isGateUnlocked(progress, activeRealm.id, gate.id);
            const gateProg = progress?.gates?.[gate.id];

            return (
              <ArenaGatePortalCard
                key={gate.id}
                gate={gate}
                stars={gateStars}
                isUnlocked={unlocked}
                bestScore={gateProg?.bestScore || 0}
                onEnterGate={onEnterGate}
              />
            );
          })}
        </div>

        {/* Guardian Trial Climax Banner (Positioned cleanly after the Gates) */}
        <div className={`w-full p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-2 shrink-0 shadow-md ${
          realmStats.isGuardianDefeated
            ? 'bg-gradient-to-r from-amber-950/60 via-purple-950/50 to-slate-900 border-amber-400/70 shadow-amber-950/30 ring-1 ring-amber-400/30'
            : realmStats.isGuardianUnlocked
              ? 'bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border-amber-500/50'
              : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
        }`}>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-amber-500/40 flex items-center justify-center text-base shrink-0">
              {activeRealm.guardian.icon}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider shrink-0">
                  {isEn ? 'Boss:' : 'Trùm:'}
                </span>
                <span className="text-xs font-extrabold text-slate-100 truncate">
                  {isEn ? activeRealm.guardian.nameEn : activeRealm.guardian.nameVi}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                {realmStats.isGuardianDefeated
                  ? (isEn ? '👑 Conquered! Replay anytime' : '👑 Đã hạ gục! Có thể đấu lại')
                  : realmStats.isGuardianUnlocked
                    ? (isEn ? 'All Gates passed! Ready to challenge!' : 'Đã mở khóa! Sẵn sàng khiêu chiến!')
                    : (isEn ? `Pass all ${activeRealm.gates.length} Gates (1★+) to unlock` : `Đạt 1★+ cả ${activeRealm.gates.length} Ải để mở khóa`)}
              </span>
            </div>
          </div>

          {realmStats.isGuardianUnlocked ? (
            <button
              type="button"
              onClick={() => onChallengeGuardian?.(activeRealm)}
              className="flex items-center gap-1 px-3 py-1.5 min-h-[34px] rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-all shrink-0"
            >
              <Crown className="w-3.5 h-3.5 text-amber-200" />
              <span>{realmStats.isGuardianDefeated ? (isEn ? 'Replay' : 'Đấu Lại') : (isEn ? 'Fight' : 'Đấu')}</span>
            </button>
          ) : (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 text-slate-500 text-[10px] font-bold border border-slate-700/60 shrink-0">
              <Lock className="w-3 h-3" />
              <span>{rStatsSummary(realmStats)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function rStatsSummary(realmStats) {
  return `${realmStats.passedGates || 0}/${realmStats.totalGates || 4}`;
}
