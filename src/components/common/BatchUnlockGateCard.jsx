import React from 'react';
import { Lock, Unlock, Trophy, Swords, LogIn, ArrowLeft, Sparkles } from 'lucide-react';

/**
 * Shared Batch Unlock & Celebration Gate Card for /pronunciation & /conversation.
 * Handles all 4 progression states:
 * 1. `need_complete_prev`: Must finish remaining items in Batch N-1 first.
 * 2. `need_auth`: Guest completed Batch 1 — prompt sign-in to earn Gold & unlock Batch 2+.
 * 3. `need_gold`: Logged-in user completed Batch N-1 but needs more Gold from Atlas English Arena.
 * 4. `ready`: Ready to spend Gold and permanently unlock Batch N!
 */
export default function BatchUnlockGateCard({
  targetBatch,
  isCelebrationMode = false, // true when shown after completing Batch N-1
  isEn = false,
  compact = false,
  onUnlockBatch,
  onGoToPrevBatch,
  onOpenAuth,
  onOpenArena,
  onShowCompletedItems
}) {
  if (!targetBatch) return null;

  const {
    batchIndex,
    totalCount,
    costGold,
    unlockBlockReason,
    prevBatchIndex,
    prevRemainingCount,
    goldBalance,
    missingGold,
    estimatedArenaMatchesLeft
  } = targetBatch;

  const pad = compact ? 'p-4 space-y-2.5' : 'p-6 sm:p-8 space-y-4';

  return (
    <div
      className={`${pad} rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 border border-amber-500/35 text-center shadow-xl`}
    >
      <div className="flex justify-center">
        {isCelebrationMode || unlockBlockReason === 'ready' ? (
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg">
            {unlockBlockReason === 'ready' ? (
              <Sparkles className="w-6 h-6" />
            ) : (
              <Trophy className="w-6 h-6" />
            )}
          </div>
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className={`${compact ? 'text-sm' : 'text-base sm:text-lg'} font-black text-white`}>
          {isCelebrationMode
            ? isEn
              ? `🎉 Batch ${prevBatchIndex} Complete! Unlock Batch ${batchIndex} (${totalCount} items)`
              : `🎉 Hoàn Thành 100% Lô ${prevBatchIndex}! Mở Khóa Lô ${batchIndex} (${totalCount} bài)`
            : isEn
            ? `Batch ${batchIndex} Locked (${totalCount} items)`
            : `Lô ${batchIndex} Đang Khóa (${totalCount} bài)`}
        </h3>

        {unlockBlockReason === 'need_complete_prev' && (
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            {isEn
              ? `Finish the remaining ${prevRemainingCount} item${prevRemainingCount > 1 ? 's' : ''} in Batch ${prevBatchIndex} first, then spend ${costGold} 🪙 Gold from Atlas English Arena to unlock Batch ${batchIndex}.`
              : `Hãy hoàn thành nốt ${prevRemainingCount} bài còn lại của Lô ${prevBatchIndex} trước, sau đó dùng ${costGold} 🪙 Vàng kiếm từ Atlas English Arena để mở khóa Lô ${batchIndex}.`}
          </p>
        )}

        {unlockBlockReason === 'need_auth' && (
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            {isEn
              ? `Sign in to your account to play Atlas English Arena, earn Scholastic Gold, and unlock Batch ${batchIndex} (${costGold} 🪙 Gold).`
              : `Đăng nhập tài khoản để chơi game Atlas English Arena tích Vàng và mở khóa vĩnh viễn Lô ${batchIndex} (Giá: ${costGold} 🪙 Vàng).`}
          </p>
        )}

        {unlockBlockReason === 'need_gold' && (
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            {isEn
              ? `Unlocking Batch ${batchIndex} requires ${costGold} 🪙 Gold. Your wallet has ${goldBalance} 🪙 (need ${missingGold} 🪙 more — about ${estimatedArenaMatchesLeft} Atlas Arena match${estimatedArenaMatchesLeft > 1 ? 'es' : ''}).`
              : `Cần ${costGold} 🪙 Vàng để mở khóa Lô ${batchIndex}. Ví bạn hiện có ${goldBalance} 🪙 (còn thiếu ${missingGold} 🪙 — tương đương ~${estimatedArenaMatchesLeft} trận chơi Atlas Arena).`}
          </p>
        )}

        {unlockBlockReason === 'ready' && (
          <p className="text-xs text-emerald-200 max-w-md mx-auto leading-relaxed font-semibold">
            {isEn
              ? `You have mastered Batch ${prevBatchIndex} and collected enough Gold (${goldBalance} 🪙)! Unlock Batch ${batchIndex} permanently now.`
              : `Bạn đã hoàn thành Lô ${prevBatchIndex} và tích đủ Vàng (${goldBalance} 🪙)! Bấm nút bên dưới để mở khóa vĩnh viễn Lô ${batchIndex}.`}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {unlockBlockReason === 'need_complete_prev' && onGoToPrevBatch && (
          <button
            type="button"
            onClick={() => onGoToPrevBatch(prevBatchIndex)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center space-x-1.5 cursor-pointer transition-all shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {isEn ? `Back to Batch ${prevBatchIndex}` : `Quay lại hoàn thành Lô ${prevBatchIndex}`}
            </span>
          </button>
        )}

        {unlockBlockReason === 'need_auth' && onOpenAuth && (
          <button
            type="button"
            onClick={() => onOpenAuth()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center space-x-1.5 cursor-pointer transition-all shadow-md"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>
              {isEn ? `Sign In to Unlock Batch ${batchIndex}` : `Đăng Nhập Để Chơi Game & Mở Lô ${batchIndex}`}
            </span>
          </button>
        )}

        {unlockBlockReason === 'need_gold' && onOpenArena && (
          <button
            type="button"
            onClick={() => onOpenArena()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center space-x-1.5 cursor-pointer transition-all shadow-lg"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>
              {isEn ? 'Play Atlas Arena to Earn Gold' : 'Vào Atlas Arena Cày Vàng Ngay'}
            </span>
          </button>
        )}

        {unlockBlockReason === 'ready' && onUnlockBatch && (
          <button
            type="button"
            onClick={() => onUnlockBatch(targetBatch)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs sm:text-sm font-black flex items-center space-x-1.5 cursor-pointer transition-all shadow-lg ring-2 ring-emerald-400/40 active:scale-95"
          >
            <Unlock className="w-4 h-4" />
            <span>
              {isEn
                ? `Unlock Batch ${batchIndex} (${costGold} 🪙 Gold)`
                : `Mở Khóa Lô ${batchIndex} (${costGold} 🪙 Vàng)`}
            </span>
          </button>
        )}

        {isCelebrationMode && onShowCompletedItems && (
          <button
            type="button"
            onClick={() => onShowCompletedItems()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold cursor-pointer transition-colors"
          >
            {isEn ? `Review Batch ${prevBatchIndex}` : `Ôn lại bài Lô ${prevBatchIndex}`}
          </button>
        )}
      </div>
    </div>
  );
}
