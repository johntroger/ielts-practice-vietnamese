import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle2, Unlock, ChevronDown, ChevronLeft, ChevronRight, Swords } from 'lucide-react';
import { getWallet } from '../../services/gamification/atlasWalletService';
import * as eventBus from '../../services/gamification/eventBus';

/**
 * Compact live Scholastic Gold balance pill for Studio Headers (/pronunciation & /conversation).
 * Automatically refreshes whenever Atlas Arena awards Gold or a Batch is purchased.
 */
export function GoldWalletHeaderBadge({ isEn = false, onOpenArena, compact = false }) {
  const [gold, setGold] = useState(() => getWallet().gold || 0);

  useEffect(() => {
    setGold(getWallet().gold || 0);
    const handler = (updatedWallet) => {
      if (updatedWallet && typeof updatedWallet.gold === 'number') {
        setGold(updatedWallet.gold);
      } else {
        setGold(getWallet().gold || 0);
      }
    };
    const unsub = eventBus.on('wallet_updated', handler);
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => onOpenArena?.()}
      className={`inline-flex items-center space-x-1 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 font-black transition-all cursor-pointer shrink-0 active:scale-95 ${
        compact ? 'px-2 h-8 text-[11px]' : 'px-2 h-9 sm:h-8 text-[11px]'
      }`}
      title={
        isEn
          ? 'Scholastic Gold earned in Atlas English Arena — Tap to play & earn more Gold to unlock batches!'
          : 'Vàng kiếm được từ Atlas English Arena — Bấm để chơi game cày thêm Vàng mở khóa Lô mới!'
      }
    >
      <span>🪙</span>
      <span>{gold.toLocaleString()}</span>
      {!compact && onOpenArena && (
        <span className="hidden xl:inline-flex items-center space-x-0.5 pl-1 ml-0.5 border-l border-amber-500/30 text-[10px] text-amber-200">
          <Swords className="w-2.5 h-2.5" />
          <span>{isEn ? 'Earn' : 'Cày Vàng'}</span>
        </span>
      )}
    </button>
  );
}

/**
 * Scalable Batch Selector Strip supporting 2 to 100+ auto-generated batches.
 * - <= 5 batches: displays direct interactive pills.
 * - > 5 batches: displays a focused window (active + next batch) + dropdown selector for all batches.
 * - Optionally includes a dedicated "Personal Vault & Custom" pill (`personalCount > 0`) that is always unlocked.
 */
export default function BatchSelectorStrip({
  batches = [],
  selectedBatchIndex = 1, // number (1..N) or 'personal'
  onSelectBatch,
  personalCount = 0,
  isEn = false,
  isMobileSheet = false
}) {
  if (!Array.isArray(batches) || batches.length === 0) return null;

  const showDropdown = batches.length > 5;
  const activeBatch =
    typeof selectedBatchIndex === 'number'
      ? batches.find(b => b.batchIndex === selectedBatchIndex) || batches[0]
      : null;

  const currentNumericIndex =
    typeof selectedBatchIndex === 'number' ? selectedBatchIndex : 1;
  const canGoPrevBatch = typeof selectedBatchIndex === 'number' && currentNumericIndex > 1;
  const canGoNextBatch =
    typeof selectedBatchIndex === 'number' && currentNumericIndex < batches.length;

  return (
    <div className="space-y-1.5">
      {showDropdown ? (
        /* Scalable Stepper + Full-Width Dropdown (> 5 batches): Zero clipping on 260px sidebars & narrow phones */
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={!canGoPrevBatch}
              onClick={() => onSelectBatch(Math.max(1, currentNumericIndex - 1))}
              aria-label={isEn ? 'Previous batch' : 'Lô trước'}
              className={`${
                isMobileSheet ? 'w-9 h-9' : 'w-7 h-7'
              } rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-35 text-slate-200 border border-slate-700 flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed active:scale-95 transition-all`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="relative flex-1 min-w-0">
              <select
                value={selectedBatchIndex === 'personal' ? 'personal' : String(selectedBatchIndex)}
                onChange={(e) => {
                  const val = e.target.value;
                  onSelectBatch(val === 'personal' ? 'personal' : Number(val));
                }}
                aria-label={isEn ? 'Select batch' : 'Chọn Lô bài tập'}
                className={`w-full appearance-none rounded-xl border font-black cursor-pointer focus:outline-none transition-colors truncate ${
                  selectedBatchIndex === 'personal'
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-200 focus:border-amber-400'
                    : activeBatch && !activeBatch.isUnlocked
                    ? 'bg-amber-950/50 border-amber-500/50 text-amber-200 focus:border-amber-400'
                    : 'bg-indigo-600/20 border-indigo-500/50 text-indigo-100 focus:border-indigo-400'
                } ${
                  isMobileSheet
                    ? 'pl-3 pr-8 min-h-[36px] text-xs'
                    : 'pl-2.5 pr-7 h-7 text-[11px]'
                }`}
              >
                {personalCount > 0 && (
                  <option value="personal" className="bg-slate-900 text-amber-200">
                    {isEn ? `📒 Personal Vault (${personalCount})` : `📒 Sổ Tay & Tự Tạo (${personalCount})`}
                  </option>
                )}
                {batches.map((b) => (
                  <option key={b.batchId} value={String(b.batchIndex)} className="bg-slate-900 text-slate-100">
                    {isEn
                      ? `${b.isCompleted ? '✅' : b.isUnlocked ? '🔓' : '🔒'} Batch ${b.batchIndex}/${batches.length} (${b.isUnlocked ? `${b.completedCount}/${b.totalCount}` : `${b.costGold} 🪙`})`
                      : `${b.isCompleted ? '✅' : b.isUnlocked ? '🔓' : '🔒'} Lô ${b.batchIndex}/${batches.length} (${b.isUnlocked ? `${b.completedCount}/${b.totalCount}` : `${b.costGold} 🪙`})`}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              disabled={!canGoNextBatch}
              onClick={() => onSelectBatch(Math.min(batches.length, currentNumericIndex + 1))}
              aria-label={isEn ? 'Next batch' : 'Lô tiếp theo'}
              className={`${
                isMobileSheet ? 'w-9 h-9' : 'w-7 h-7'
              } rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-35 text-slate-200 border border-slate-700 flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed active:scale-95 transition-all`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Compact Direct Pills (<= 5 batches): Flex-wrap so no pill is ever clipped */
        <div className="flex flex-wrap items-center gap-1.5 py-0.5">
          {personalCount > 0 && (
            <button
              type="button"
              onClick={() => onSelectBatch('personal')}
              className={`${
                isMobileSheet ? 'px-3 min-h-[36px] text-xs' : 'px-2 py-1 text-[10px]'
              } rounded-xl font-black whitespace-nowrap cursor-pointer border transition-all active:scale-95 shrink-0 ${
                selectedBatchIndex === 'personal'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                  : 'bg-amber-950/40 text-amber-300 border-amber-500/35 hover:bg-amber-900/50'
              }`}
            >
              {isEn ? `📒 Vault (${personalCount})` : `📒 Sổ Tay (${personalCount})`}
            </button>
          )}

          {batches.map((b) => {
            const isSelected = selectedBatchIndex === b.batchIndex;
            return (
              <button
                key={b.batchId}
                type="button"
                onClick={() => onSelectBatch(b.batchIndex)}
                className={`${
                  isMobileSheet ? 'px-3 min-h-[36px] text-xs' : 'px-2 py-1 text-[10px]'
                } rounded-xl font-black whitespace-nowrap cursor-pointer border transition-all active:scale-95 shrink-0 flex items-center space-x-1 ${
                  isSelected
                    ? b.isUnlocked
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-xs'
                      : 'bg-amber-600 text-white border-amber-400 shadow-xs'
                    : b.isCompleted
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                    : b.isUnlocked
                    ? `${isMobileSheet ? 'bg-slate-950' : 'bg-slate-900'} text-slate-200 border-slate-700 hover:border-indigo-400`
                    : `${isMobileSheet ? 'bg-slate-950/70' : 'bg-slate-900/70'} text-slate-400 border-slate-800 hover:border-amber-500/50`
                }`}
              >
                {b.isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : b.isUnlocked ? (
                  <Unlock className="w-3 h-3 shrink-0 opacity-80" />
                ) : (
                  <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                )}
                <span>
                  {isEn ? `Batch ${b.batchIndex}` : `Lô ${b.batchIndex}`}
                </span>
                <span className="opacity-80 font-mono text-[10px]">
                  {b.isUnlocked ? `${b.completedCount}/${b.totalCount}` : `${b.costGold}🪙`}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Compact Active Batch Progress Bar */}
      {activeBatch && activeBatch.isUnlocked && (
        <div className="flex items-center gap-2 text-[10px]">
          <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                activeBatch.isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{
                width: `${Math.min(100, Math.round((activeBatch.completedCount / Math.max(1, activeBatch.totalCount)) * 100))}%`
              }}
            />
          </div>
          <span className="font-mono font-bold text-slate-400 shrink-0">
            {isEn
              ? `Batch ${activeBatch.batchIndex}/${batches.length}: ${activeBatch.completedCount}/${activeBatch.totalCount}`
              : `Lô ${activeBatch.batchIndex}/${batches.length}: ${activeBatch.completedCount}/${activeBatch.totalCount}`}
          </span>
        </div>
      )}
    </div>
  );
}
