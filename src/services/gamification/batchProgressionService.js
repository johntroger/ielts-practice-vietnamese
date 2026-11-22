/**
 * src/services/gamification/batchProgressionService.js
 *
 * Progressive Batch Unlocking & Gold Economy Engine for /pronunciation & /conversation.
 *
 * Core Rules:
 * 1. Dynamic Forward Slicing (`while (cursor < items.length)`):
 *    - Batch 1 (`starterSize`) is always the largest batch and 100% FREE for both Guests & Registered users.
 *    - Batch 2, 3, ... N (`batchSize` each) are automatically generated as the bank expands to thousands of items.
 *    - Existing batches never shift when new items are appended to the bank.
 * 2. Unlock Requirements for Batch N (N >= 2):
 *    - Must complete 100% of Batch N-1 (Mastery Gate).
 *    - Must be signed in (`currentUser !== null`) to hold a Gold wallet and unlock Batch 2+.
 *    - Must spend Scholastic Gold (600–750 Gold ≈ at least 10 Atlas English Arena matches).
 * 3. Forward-Compatible Persistence:
 *    - Once `batchId` is purchased in `wallet.inventory`, that batch stays permanently unlocked
 *      even if more items are later added to an earlier batch.
 */

import {
  getWallet,
  spendCurrency,
  CURRENCY_TYPES
} from './atlasWalletService.js';

export const AVERAGE_GOLD_PER_ARENA_MATCH = 60;

export const BATCH_TRACK_CONFIGS = {
  pron_words: {
    starterSize: 15,
    batchSize: 10,
    costGold: 600,
    labelEn: 'Single Words',
    labelVi: 'Từ Đơn Học Thuật'
  },
  pron_stress: {
    starterSize: 6,
    batchSize: 4,
    costGold: 600,
    labelEn: 'Stress Shift',
    labelVi: 'Chuyển Trọng Âm'
  },
  pron_phrases: {
    starterSize: 10,
    batchSize: 6,
    costGold: 650,
    labelEn: 'Phrases & Linking',
    labelVi: 'Cụm Từ & Nối Âm'
  },
  pron_sentences: {
    starterSize: 8,
    batchSize: 5,
    costGold: 700,
    labelEn: 'Full Sentences',
    labelVi: 'Câu & Ngữ Điệu'
  },
  pron_twisters: {
    starterSize: 6,
    batchSize: 4,
    costGold: 750,
    labelEn: 'Twisters',
    labelVi: 'Xoắn Lưỡi'
  },
  conv_roleplay: {
    starterSize: 8,
    batchSize: 5,
    costGold: 650,
    labelEn: 'Roleplay Conversations',
    labelVi: 'Đối Thoại Nhập Vai'
  },
  conv_shadowing: {
    starterSize: 20,
    batchSize: 12,
    costGold: 700,
    labelEn: 'Speech Shadowing',
    labelVi: 'Nhại Giọng IELTS'
  }
};

/**
 * Deterministically partitions a canonical array of drills/scenarios into progressive batches
 * (Batch 1 = starterSize, Batch 2..N = batchSize) and computes mastery & Gold unlock status.
 */
export function buildTrackBatches({
  items = [],
  trackKey = 'pron_words',
  completedIdSet = new Set(),
  wallet = null,
  currentUser = null
}) {
  const cfg = BATCH_TRACK_CONFIGS[trackKey] || {
    starterSize: 15,
    batchSize: 10,
    costGold: 600,
    labelEn: 'Practice Bank',
    labelVi: 'Ngân Hàng Luyện Tập'
  };

  const safeItems = Array.isArray(items) ? items : [];
  if (safeItems.length === 0) return [];

  const activeWallet = wallet || getWallet();
  const goldBalance = Math.max(0, Number(activeWallet?.gold) || 0);
  const inventory = activeWallet?.inventory || {};

  const batches = [];
  let cursor = 0;
  let batchIndex = 1;

  while (cursor < safeItems.length) {
    const size = batchIndex === 1 ? cfg.starterSize : cfg.batchSize;
    const slice = safeItems.slice(cursor, cursor + size);
    const batchId = `${trackKey}_batch_${batchIndex}`;

    let completedCount = 0;
    for (let i = 0; i < slice.length; i++) {
      if (completedIdSet.has(slice[i]?.id)) {
        completedCount += 1;
      }
    }

    const totalCount = slice.length;
    const isCompleted = totalCount > 0 && completedCount >= totalCount;
    const prevBatch = batches[batches.length - 1] || null;

    // Batch 1 is always free & unlocked; Batch 2+ is permanently unlocked once present in wallet.inventory
    const isPurchased = batchIndex === 1 || (inventory[batchId]?.quantity || 0) > 0;
    const isUnlocked = isPurchased;
    const costGold = batchIndex === 1 ? 0 : cfg.costGold;

    let unlockBlockReason = 'unlocked';
    let prevRemainingCount = 0;
    let missingGold = 0;
    let estimatedArenaMatchesLeft = 0;

    if (!isUnlocked) {
      if (prevBatch && !prevBatch.isCompleted) {
        unlockBlockReason = 'need_complete_prev';
        prevRemainingCount = Math.max(0, prevBatch.totalCount - prevBatch.completedCount);
      } else if (!currentUser) {
        unlockBlockReason = 'need_auth';
      } else if (goldBalance < costGold) {
        unlockBlockReason = 'need_gold';
        missingGold = costGold - goldBalance;
        estimatedArenaMatchesLeft = Math.max(1, Math.ceil(missingGold / AVERAGE_GOLD_PER_ARENA_MATCH));
      } else {
        unlockBlockReason = 'ready';
      }
    }

    batches.push({
      batchId,
      batchIndex,
      trackKey,
      items: slice,
      totalCount,
      completedCount,
      remainingCount: Math.max(0, totalCount - completedCount),
      isCompleted,
      isUnlocked,
      costGold,
      unlockBlockReason,
      prevBatchIndex: prevBatch ? prevBatch.batchIndex : null,
      prevRemainingCount,
      missingGold,
      estimatedArenaMatchesLeft,
      goldBalance
    });

    cursor += size;
    batchIndex += 1;
  }

  return batches;
}

/**
 * Purchases and permanently unlocks a locked batch using Scholastic Gold from Atlas English Arena.
 */
export function purchaseBatchUnlock({
  batchId,
  batchLabel = '',
  costGold = 600,
  currentUser = null
}) {
  if (!currentUser) {
    return { success: false, message: 'need_auth', remainingBalance: getWallet().gold };
  }
  if (!batchId || costGold <= 0) {
    return { success: false, message: 'invalid_batch', remainingBalance: getWallet().gold };
  }

  const wallet = getWallet();
  if ((wallet.inventory?.[batchId]?.quantity || 0) > 0) {
    return { success: true, message: 'already_unlocked', remainingBalance: wallet.gold };
  }

  return spendCurrency(
    CURRENCY_TYPES.GOLD,
    costGold,
    batchId,
    batchLabel || batchId,
    1
  );
}
