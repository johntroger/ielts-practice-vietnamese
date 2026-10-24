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
    <div className="w-full flex-1 flex flex-col max-w-4xl mx-auto p-3 sm:p-5 overflow-hidden gap-3 animate-fade-in select-none">
      {/* Top Expedition HUD: Gold, Shields, Relics & Timer */}
      <div className="w-full bg-slate-900/90 border border-indigo-900/40 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Gold */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-black text-sm shadow-xs">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{runState.gold || 0}</span>
            <span className="text-[10px] text-amber-400 font-sans uppercase tracking-wider font-bold">Gold</span>
          </div>

          {/* Shields */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono font-black text-sm shadow-xs">
            <Shield className="w-4 h-4 text-rose-400 fill-rose-500/30" />
            <span>{runState.shields}/{runState.maxShields || 5}</span>
            <span className="text-[10px] text-rose-400 font-sans uppercase tracking-wider font-bold">Shields</span>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono font-black text-sm shadow-xs">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{formatTime(runState.timeRemaining || 0)}</span>
          </div>
        </div>

        {/* Action Buttons: Restart Expedition & Abandon Run */}
        <div className="flex items-center gap-2">
          {onRestartRun && (
            <button
              type="button"
              onClick={onRestartRun}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 transition-all cursor-pointer shadow-xs active:scale-95"
              title={isEn ? 'Start a fresh expedition from Floor 1' : 'Bắt đầu lại chuyến leo tháp từ Tầng 1'}
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? 'Restart' : 'Làm Lại'}</span>
            </button>
          )}

          {/* Abandon Run */}
          <button
            type="button"
            onClick={onAbandonRun}
            className="text-xs text-slate-400 hover:text-rose-400 font-medium px-2.5 py-1.5 rounded-lg border border-transparent hover:border-rose-900/40 hover:bg-rose-950/20 transition-all cursor-pointer"
          >
            {isEn ? 'Abandon' : 'Rút Lui'}
          </button>
        </div>
      </div>

      {/* Relics Deck Bar */}
      <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-2 flex items-center gap-2 overflow-x-auto shrink-0 shadow-inner">
        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isEn ? 'Relics:' : 'Cổ Vật:'}</span>
        </span>
        {runState.relics && runState.relics.length > 0 ? (
          runState.relics.map((relic, idx) => (
            <div
              key={relic.id || idx}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-700/60 text-xs text-indigo-200 font-bold shrink-0 shadow-xs cursor-help"
              title={isEn ? `${relic.nameEn}: ${relic.descEn}` : `${relic.nameVi}: ${relic.descVi}`}
            >
              <span className="text-sm">{relic.icon}</span>
              <span className="truncate max-w-[120px]">{isEn ? relic.nameEn : relic.nameVi}</span>
            </div>
          ))
        ) : (
          <span className="text-xs text-slate-500 italic">
            {isEn ? 'No relics yet. Clear Elites or Treasure.' : 'Chưa có cổ vật. Tìm trong Hòm hoặc Tinh Anh.'}
          </span>
        )}
      </div>

      {/* Vertical Map Floors Ascension View */}
      <div className="w-full flex-1 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 overflow-y-auto flex flex-col-reverse gap-2 shadow-2xl relative">
        {floors.map((floor, idx) => {
          const isCurrent = idx === currentFloorIdx;
          const isPast = idx < currentFloorIdx;
          const isFuture = idx > currentFloorIdx;

          return (
            <div
              key={floor.floorNumber}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                isCurrent
                  ? 'bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/60 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-400/40 scale-[1.01]'
                  : isPast
                    ? 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-700/60 text-slate-300 shadow-xs'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border ${getNodeBadgeColor(floor.type)}`}>
                  {floor.icon}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base">
                      {isEn ? floor.titleEn : floor.titleVi}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider animate-pulse">
                        {isEn ? 'Current Floor' : 'Tầng Hiện Tại'}
                      </span>
                    )}
                    {isPast && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                        {isEn ? 'Cleared' : 'Đã Vượt Qua'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {floor.type.toUpperCase()} • {floor.rewardGold ? `+${floor.rewardGold} Gold` : ''} {floor.dropsRelic ? (isEn ? '• 💎 Guaranteed Relic' : '• 💎 Rớt Cổ Vật') : ''}
                  </span>
                </div>
              </div>

              {isCurrent && (
                <button
                  type="button"
                  onClick={() => onEnterFloor?.(floor, false)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                >
                  <span>{isEn ? 'Enter Chamber' : 'Tiến Vào Tầng'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {isPast && (
                <button
                  type="button"
                  onClick={() => onEnterFloor?.(floor, true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/60 text-slate-200 hover:text-indigo-200 font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                  title={isEn ? `Replay Floor ${floor.floorNumber}` : `Chơi lại Tầng ${floor.floorNumber}`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isEn ? `Replay Floor ${floor.floorNumber}` : `Chơi Lại Tầng ${floor.floorNumber}`}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
