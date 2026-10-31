/**
 * src/services/gamification/atlasWalletService.js
 * 
 * Production Wallet & Dual-Currency Management Engine for Atlas English Arena.
 * 
 * Features:
 * 1. Dual-Currency State Management:
 *    - 🪙 Scholastic Gold (Soft Currency): Earned via questions, combos, gates, and towers.
 *    - 💎 Atlas Diamonds/Gems (Hard Currency): Earned via level milestones, streaks, and perfect 3-star gates.
 * 2. Anti-Inflation Protection:
 *    - Daily Soft Cap for blitz repetition (default 500 Gold / day).
 *    - Uncapped earnings for mastering new Skill Realm gates.
 * 3. Retroactive Backfill Migration:
 *    - Awards existing learners retroactively based on their current Level and passed gates.
 * 4. Transparent Inventory & Transaction Audit Log (Latest 20 entries).
 * 5. Safe LocalStorage persistence with defensive fallback.
 */

import { safeGet, safeSet } from '../../utils/storageService.js';
import * as eventBus from './eventBus.js';

export const WALLET_STORAGE_KEY = 'ielts_atlas_wallet_v1';
export const DAILY_GOLD_CAP_STORAGE_KEY = 'ielts_atlas_daily_gold_cap_v1';
export const DAILY_BLITZ_GOLD_LIMIT = 500;

export const CURRENCY_TYPES = {
  GOLD: 'gold',
  DIAMONDS: 'diamonds'
};

export const TRANSACTION_TYPES = {
  EARN: 'earn',
  SPEND: 'spend'
};

/**
 * Returns today's YYYY-MM-DD string in local timezone
 */
export function getLocalTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Creates default wallet data structure
 */
export function createInitialWallet() {
  return {
    gold: 0,
    diamonds: 0,
    inventory: {}, // itemId -> { quantity: number, purchasedAt: string, isActive?: boolean }
    transactions: [], // array of last 20 transactions
    backfillClaimed: false,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Retrieves the current wallet state
 * @returns {Object}
 */
export function getWallet() {
  const stored = safeGet(WALLET_STORAGE_KEY, null);
  if (stored && typeof stored.gold === 'number' && typeof stored.diamonds === 'number') {
    return {
      gold: Math.max(0, stored.gold),
      diamonds: Math.max(0, stored.diamonds),
      inventory: stored.inventory || {},
      transactions: Array.isArray(stored.transactions) ? stored.transactions : [],
      backfillClaimed: Boolean(stored.backfillClaimed),
      updatedAt: stored.updatedAt || new Date().toISOString()
    };
  }
  const initial = createInitialWallet();
  safeSet(WALLET_STORAGE_KEY, initial);
  return initial;
}

/**
 * Saves wallet state safely
 * @param {Object} wallet 
 */
export function saveWallet(wallet) {
  if (!wallet) return;
  const sanitized = {
    gold: Math.max(0, Math.floor(wallet.gold || 0)),
    diamonds: Math.max(0, Math.floor(wallet.diamonds || 0)),
    inventory: wallet.inventory || {},
    transactions: (wallet.transactions || []).slice(0, 20),
    backfillClaimed: Boolean(wallet.backfillClaimed),
    updatedAt: new Date().toISOString()
  };
  safeSet(WALLET_STORAGE_KEY, sanitized);
  eventBus.emit('wallet_updated', sanitized);
  return sanitized;
}

/**
 * Gets daily gold earnings tracked for the blitz cap
 */
export function getDailyBlitzGoldEarned() {
  const today = getLocalTodayKey();
  const stored = safeGet(DAILY_GOLD_CAP_STORAGE_KEY, null);
  if (stored && stored.date === today && typeof stored.amount === 'number') {
    return stored.amount;
  }
  return 0;
}

/**
 * Records blitz gold into the daily cap tracker
 * @param {number} amount 
 */
function recordDailyBlitzGold(amount) {
  const today = getLocalTodayKey();
  const current = getDailyBlitzGoldEarned();
  safeSet(DAILY_GOLD_CAP_STORAGE_KEY, {
    date: today,
    amount: current + amount
  });
}

/**
 * Adds Scholastic Gold to wallet with optional daily cap protection
 * @param {number} amount - Amount of gold to add
 * @param {string} reason - Human-readable reason or event code
 * @param {boolean} isBlitz - Whether this comes from blitz practice (subject to daily cap)
 * @returns {{ actualAdded: number, currentGold: number, capHit: boolean }}
 */
export function addGold(amount, reason = 'Practice Reward', isBlitz = false) {
  if (amount <= 0) {
    const w = getWallet();
    return { actualAdded: 0, currentGold: w.gold, capHit: false };
  }

  let finalAmount = Math.floor(amount);
  let capHit = false;

  if (isBlitz) {
    const alreadyEarned = getDailyBlitzGoldEarned();
    const remainingCap = Math.max(0, DAILY_BLITZ_GOLD_LIMIT - alreadyEarned);
    if (remainingCap <= 0) {
      const w = getWallet();
      return { actualAdded: 0, currentGold: w.gold, capHit: true };
    }
    if (finalAmount > remainingCap) {
      finalAmount = remainingCap;
      capHit = true;
    }
    recordDailyBlitzGold(finalAmount);
  }

  const wallet = getWallet();
  wallet.gold += finalAmount;

  const transaction = {
    id: `tx-gold-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: TRANSACTION_TYPES.EARN,
    currency: CURRENCY_TYPES.GOLD,
    amount: finalAmount,
    reason,
    timestamp: new Date().toISOString()
  };

  wallet.transactions = [transaction, ...wallet.transactions].slice(0, 20);
  saveWallet(wallet);

  return {
    actualAdded: finalAmount,
    currentGold: wallet.gold,
    capHit
  };
}

/**
 * Adds Atlas Diamonds to wallet (not capped)
 * @param {number} amount - Amount of diamonds to add
 * @param {string} reason - Reason for reward (e.g. 'Level Up 25', 'Streak 7 Days')
 * @returns {{ actualAdded: number, currentDiamonds: number }}
 */
export function addDiamonds(amount, reason = 'Milestone Reward') {
  if (amount <= 0) {
    const w = getWallet();
    return { actualAdded: 0, currentDiamonds: w.diamonds };
  }

  const finalAmount = Math.floor(amount);
  const wallet = getWallet();
  wallet.diamonds += finalAmount;

  const transaction = {
    id: `tx-gem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: TRANSACTION_TYPES.EARN,
    currency: CURRENCY_TYPES.DIAMONDS,
    amount: finalAmount,
    reason,
    timestamp: new Date().toISOString()
  };

  wallet.transactions = [transaction, ...wallet.transactions].slice(0, 20);
  saveWallet(wallet);

  return {
    actualAdded: finalAmount,
    currentDiamonds: wallet.diamonds
  };
}

/**
 * Spends currency to purchase an item
 * @param {string} currency - 'gold' or 'diamonds'
 * @param {number} cost - Price of the item
 * @param {string} itemId - Identifier of the item
 * @param {string} itemName - Display name
 * @param {number} quantity - Quantity of items purchased
 * @returns {{ success: boolean, message: string, remainingBalance: number }}
 */
export function spendCurrency(currency, cost, itemId, itemName = '', quantity = 1) {
  if (cost <= 0) {
    return { success: false, message: 'invalid_cost', remainingBalance: 0 };
  }

  const wallet = getWallet();
  const isGold = currency === CURRENCY_TYPES.GOLD;
  const currentBalance = isGold ? wallet.gold : wallet.diamonds;

  if (currentBalance < cost) {
    return {
      success: false,
      message: 'insufficient_funds',
      remainingBalance: currentBalance
    };
  }

  if (isGold) {
    wallet.gold -= cost;
  } else {
    wallet.diamonds -= cost;
  }

  // Update inventory
  if (itemId) {
    const currentItem = wallet.inventory[itemId] || { quantity: 0, firstPurchasedAt: new Date().toISOString() };
    wallet.inventory[itemId] = {
      ...currentItem,
      quantity: (currentItem.quantity || 0) + quantity,
      lastPurchasedAt: new Date().toISOString()
    };
  }

  // Record spend transaction
  const transaction = {
    id: `tx-spend-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: TRANSACTION_TYPES.SPEND,
    currency,
    amount: cost,
    reason: `Purchased: ${itemName || itemId}`,
    itemId,
    timestamp: new Date().toISOString()
  };

  wallet.transactions = [transaction, ...wallet.transactions].slice(0, 20);
  saveWallet(wallet);

  return {
    success: true,
    message: 'purchase_success',
    remainingBalance: isGold ? wallet.gold : wallet.diamonds
  };
}

/**
 * Consumes 1 quantity of an inventory item (e.g. using an Elixir)
 * @param {string} itemId 
 * @returns {boolean} Whether consumption was successful
 */
export function consumeInventoryItem(itemId) {
  if (!itemId) return false;
  const wallet = getWallet();
  const item = wallet.inventory[itemId];
  if (!item || item.quantity <= 0) return false;

  item.quantity -= 1;
  if (item.quantity <= 0) {
    delete wallet.inventory[itemId];
  }
  saveWallet(wallet);
  return true;
}

/**
 * Checks if user owns an item or has active quantity
 * @param {string} itemId 
 * @returns {number} Quantity owned (0 if none)
 */
export function getInventoryItemQuantity(itemId) {
  if (!itemId) return 0;
  const wallet = getWallet();
  return wallet.inventory?.[itemId]?.quantity || 0;
}

/**
 * Performs retroactive backfill for existing learners based on current level & completed gates
 * @param {number} currentLevel - Current learner level (1-100)
 * @param {number} completedGatesCount - Total gates passed across realms
 * @returns {{ awarded: boolean, goldAwarded: number, diamondsAwarded: number }}
 */
export function checkAndApplyRetroactiveBackfill(currentLevel = 1, completedGatesCount = 0) {
  const wallet = getWallet();
  if (wallet.backfillClaimed) {
    return { awarded: false, goldAwarded: 0, diamondsAwarded: 0 };
  }

  const safeLevel = Math.max(1, currentLevel || 1);
  const safeGates = Math.max(0, completedGatesCount || 0);

  // Formula: 15 diamonds per level above 1, plus 30 gold per completed gate
  const diamondsAwarded = Math.max(0, (safeLevel - 1) * 15);
  const goldAwarded = safeGates * 30;

  if (diamondsAwarded > 0 || goldAwarded > 0) {
    wallet.diamonds += diamondsAwarded;
    wallet.gold += goldAwarded;

    wallet.transactions.unshift({
      id: `tx-backfill-${Date.now()}`,
      type: TRANSACTION_TYPES.EARN,
      currency: 'both',
      amount: `${goldAwarded} 🪙, ${diamondsAwarded} 💎`,
      reason: `Retroactive Veteran Reward (Lv.${safeLevel}, ${safeGates} Gates)`,
      timestamp: new Date().toISOString()
    });
  }

  wallet.backfillClaimed = true;
  saveWallet(wallet);

  return {
    awarded: diamondsAwarded > 0 || goldAwarded > 0,
    goldAwarded,
    diamondsAwarded
  };
}

/**
 * Resets wallet for testing purposes
 */
export function resetWalletForTesting() {
  const initial = createInitialWallet();
  safeSet(WALLET_STORAGE_KEY, initial);
  safeSet(DAILY_GOLD_CAP_STORAGE_KEY, null);
  return initial;
}
