/**
 * src/components/arena/tower/ArenaTowerMapView.jsx
 * 
 * Interactive Procedural Map for the Tower of Babel Roguelite Expedition.
 * Displays vertical tower ascension, current floor avatar, relics HUD, and floor selection.
 */

import React from 'react';
import { useTranslation } from '../../../i18n';
import { 
  TOWER_NODE_TYPES 
} from '../../../services/gamification/towerOfBabelEngine.js';
import { 
  Shield, 
  Coins, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Trophy,
  Flame,
  ArrowUpCircle,
  RotateCcw
} from 'lucide-react';

export default function ArenaTowerMapView({
  runState,
  onEnterFloor,
  onAbandonRun,
  onRestartRun
}) {
  const { t, isEn } = useTranslation();

  if (!runState) return null;

  const currentFloorIdx = runState.currentFloorIndex || 0;
  const floors = runState.floors || [];
  const activeFloor = floors[currentFloorIdx];

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const getNodeBadgeColor = (type) => {
    switch (type) {
      case TOWER_NODE_TYPES.BOSS:
        return 'bg-gradient-to-r from-amber-500/30 to-rose-600/30 border-amber-500/60 text-amber-300 ring-2 ring-amber-400/40';
      case TOWER_NODE_TYPES.ELITE:
        return 'bg-purple-950/50 border-purple-600/50 text-purple-300';
      case TOWER_NODE_TYPES.TREASURE:
        return 'bg-yellow-950/50 border-yellow-500/50 text-yellow-300';
      case TOWER_NODE_TYPES.CAMPFIRE:
        return 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300';
      case TOWER_NODE_TYPES.SHOP:
        return 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300';
      default:
        return 'bg-slate-800/60 border-slate-700/60 text-slate-300';
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col max-w-4xl mx-auto p-1 sm:p-4 lg:overflow-hidden gap-2 sm:gap-2.5 animate-fade-in select-none">
      {/* Compact Single-Row Expedition HUD: Gold, Shields, Timer & Actions */}
      <div className="w-full bg-slate-900/90 border border-indigo-900/40 rounded-2xl px-2.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 shadow-xl backdrop-blur-md shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          {/* Gold */}
          <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-black text-xs sm:text-sm shadow-xs shrink-0">
            <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{runState.gold || 0}</span>
          </div>

          {/* Shields */}
          <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono font-black text-xs sm:text-sm shadow-xs shrink-0">
            <Shield className="w-3.5 h-3.5 text-rose-400 fill-rose-500/30 shrink-0" />
            <span>{runState.shields}/{runState.maxShields || 5}</span>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono font-black text-xs sm:text-sm shadow-xs shrink-0">
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{formatTime(runState.timeRemaining || 0)}</span>
          </div>
        </div>

        {/* Action Buttons: Restart & Abandon */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onRestartRun && (
            <button
              type="button"
              onClick={onRestartRun}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold px-2.5 py-1.5 min-h-[32px] rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 transition-all cursor-pointer shadow-xs active:scale-95"
              title={isEn ? 'Start a fresh expedition from Floor 1' : 'Bắt đầu lại chuyến leo tháp từ Tầng 1'}
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">{isEn ? 'Restart' : 'Làm Lại'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAbandonRun}
            className="text-xs text-slate-400 hover:text-rose-400 font-medium px-2 py-1.5 min-h-[32px] rounded-lg border border-transparent hover:border-rose-900/40 hover:bg-rose-950/20 transition-all cursor-pointer"
          >
            {isEn ? 'Abandon' : 'Rút Lui'}
          </button>
        </div>
      </div>

      {/* Relics Deck Bar (Only rendered when relics are collected) */}
      {runState.relics && runState.relics.length > 0 && (
        <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-2.5 py-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 shadow-inner">
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'Relics:' : 'Cổ Vật:'}</span>
          </span>
          {runState.relics.map((relic, idx) => (
            <div
              key={relic.id || idx}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-950/70 border border-indigo-700/60 text-xs text-indigo-200 font-bold shrink-0 shadow-xs cursor-help"
              title={isEn ? `${relic.nameEn}: ${relic.descEn}` : `${relic.nameVi}: ${relic.descVi}`}
            >
              <span className="text-sm">{relic.icon}</span>
              <span className="truncate max-w-[120px]">{isEn ? relic.nameEn : relic.nameVi}</span>
            </div>
          ))}
        </div>
      )}

      {/* Vertical Map Floors Ascension View */}
      <div className="w-full lg:flex-1 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-2 sm:p-4 lg:overflow-y-auto overflow-x-hidden flex flex-col-reverse gap-1.5 sm:gap-2 shadow-2xl relative">
        {floors.map((floor, idx) => {
          const isCurrent = idx === currentFloorIdx;
          const isPast = idx < currentFloorIdx;

          return (
            <div
              key={floor.floorNumber}
              className={`w-full flex items-center justify-between p-2 sm:p-2.5 rounded-xl border gap-2 transition-all duration-200 ${
                isCurrent
                  ? 'bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/60 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-400/40'
                  : isPast
                    ? 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-700/60 text-slate-300 shadow-xs'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 opacity-55'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-sm sm:text-base border shrink-0 ${getNodeBadgeColor(floor.type)}`}>
                  {floor.icon}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-extrabold text-xs sm:text-sm leading-snug text-slate-100 truncate">
                      {isEn ? floor.titleEn : floor.titleVi}
                    </span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider animate-pulse shrink-0">
                        {isEn ? 'Now' : 'Hiện tại'}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 truncate">
                    {floor.type.toUpperCase()} {floor.rewardGold ? `• +${floor.rewardGold}🪙` : ''} {floor.dropsRelic ? (isEn ? '• 💎 Relic' : '• 💎 Cổ Vật') : ''}
                  </span>
                </div>
              </div>

              {isCurrent && (
                <button
                  type="button"
                  onClick={() => onEnterFloor?.(floor, false)}
                  className="shrink-0 flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 min-h-[34px] rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <span>{isEn ? 'Enter' : 'Tiến Vào'}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              )}

              {isPast && (
                <button
                  type="button"
                  onClick={() => onEnterFloor?.(floor, true)}
                  className="shrink-0 flex items-center justify-center gap-1 px-2.5 py-1.5 min-h-[32px] rounded-xl bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/60 text-slate-200 hover:text-indigo-200 font-bold text-[11px] shadow-xs transition-all cursor-pointer active:scale-95"
                  title={isEn ? `Replay Floor ${floor.floorNumber}` : `Chơi lại Tầng ${floor.floorNumber}`}
                >
                  <RotateCcw className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span>{isEn ? 'Replay' : 'Chơi Lại'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
