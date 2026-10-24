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
import { Star, Shield, Trophy, Sparkles, ChevronRight, Crown, Flame } from 'lucide-react';
import { useTranslation } from '../../../i18n';
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
    <div className="w-full flex-1 flex flex-col max-w-5xl mx-auto p-2.5 sm:p-4 overflow-hidden gap-3 animate-fade-in select-none">
      {/* Top Banner: Global Stars Progress Bar */}
      <div className="w-full bg-slate-900/90 border border-indigo-900/40 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-indigo-600/20 to-purple-600/30 border border-amber-500/40 flex items-center justify-center text-xl shadow-xs">
            🏛️
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-slate-100 tracking-tight">
                {isEn ? 'IELTS Skill Realms' : 'Tứ Đại Cung Điện Khảo Thí'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                {isEn ? '16 Part / Task Gates' : '16 Ải Khảo Thí'}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {isEn 
                ? 'Conquer authentic Cambridge Parts & Tasks, earn stars, and challenge Realm Guardians!'
                : 'Chinh phục từng Part & Task Cambridge thật, tích lũy 3 sao và khiêu chiến Thủ Lĩnh Cung Điện!'}
            </p>
          </div>
        </div>

        {/* Global Stars Tracker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-black text-sm shadow-xs">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{overallStats.grandTotalStars}/{overallStats.grandMaxStars}</span>
            <span className="text-[10px] text-amber-400 font-sans uppercase font-bold tracking-wider">
              {isEn ? 'Stars' : 'Sao'}
            </span>
          </div>

          <div className="hidden sm:flex flex-col gap-1 w-24">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/80">
              <div 
                className="bg-gradient-to-r from-amber-400 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${overallStats.overallPercentage}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono text-right">{overallStats.overallPercentage}%</span>
          </div>
        </div>
      </div>

      {/* 4-Room Segmented Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
        {SKILL_REALMS.map(realm => {
          const isSelected = realm.id === selectedRealmId;
          const rStats = getRealmStats(progress, realm.id);
          const themeStyle = REALM_THEME_STYLES[realm.id] || REALM_THEME_STYLES.listening;
          
          return (
            <button
              key={realm.id}
              type="button"
              onClick={() => handleRealmTabClick(realm.id)}
              className={`flex flex-col p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] ${
                isSelected
                  ? themeStyle.selected
                  : 'bg-slate-900/60 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xl sm:text-2xl">{realm.icon}</span>
                <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-amber-300">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{rStats.totalStars}/{rStats.maxStars}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className={`text-xs sm:text-sm font-extrabold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {isEn ? realm.nameEn : realm.nameVi}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {rStats.masteredGates}/{rStats.totalGates} {isEn ? 'Mastered' : 'Hoàn thành'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Guardian Trial Climax Banner */}
      <div className={`w-full p-2.5 sm:p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 shrink-0 shadow-md ${
        realmStats.isGuardianDefeated
          ? 'bg-gradient-to-r from-amber-950/60 via-purple-950/50 to-slate-900 border-amber-400/70 shadow-amber-950/30 ring-1 ring-amber-400/30'
          : realmStats.isGuardianUnlocked
            ? 'bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border-amber-500/50'
            : 'bg-slate-900/50 border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-amber-500/40 flex items-center justify-center text-lg shrink-0">
            {activeRealm.guardian.icon}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                {isEn ? 'Guardian Trial:' : 'Thủ Lĩnh Cung Điện:'}
              </span>
              <span className="text-xs font-extrabold text-slate-200 truncate">
                {isEn ? activeRealm.guardian.nameEn : activeRealm.guardian.nameVi}
              </span>
              {realmStats.isGuardianDefeated && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-400/50 animate-pulse">
                  👑 {isEn ? 'DEFEATED' : 'ĐÃ ĐÁNH BẠI'}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 truncate">
              {realmStats.isGuardianDefeated
                ? (isEn ? 'Guardian conquered! Replay anytime to sharpen your Climax reflex.' : 'Đã khuất phục Thủ Lĩnh! Bạn có thể khiêu chiến lại bất cứ lúc nào.')
                : realmStats.isGuardianUnlocked
                  ? (isEn ? 'All Gates passed! Ready to challenge the Guardian for a Legendary Relic!' : 'Đã vượt qua tất cả các ải! Sẵn sàng khiêu chiến để nhận Cổ Vật Huyền Thoại!')
                  : (isEn ? `Pass all ${activeRealm.gates.length} Gates with at least 1★ to unlock this trial.` : `Vượt qua tất cả ${activeRealm.gates.length} Ải (đạt ít nhất 1★) để mở khóa khiêu chiến.`)}
            </span>
          </div>
        </div>

        {realmStats.isGuardianUnlocked && (
          <button
            type="button"
            onClick={() => onChallengeGuardian?.(activeRealm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-xs shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
          >
            <Crown className="w-3.5 h-3.5 text-amber-200" />
            <span>{realmStats.isGuardianDefeated ? (isEn ? 'Replay Guardian' : 'Đấu Lại Thủ Lĩnh') : (isEn ? 'Challenge Guardian' : 'Khiêu Chiến')}</span>
          </button>
        )}
      </div>

      {/* Grid of Gates for Active Realm */}
      <div className="w-full flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
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
      </div>
    </div>
  );
}
