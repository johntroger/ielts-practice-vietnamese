/**
 * tests/test_step209_atlas_treasury_wallet_and_currency_economy.js
 * 
 * Comprehensive Test Suite for Step 209:
 * ATLAS TREASURY, DUAL-CURRENCY WALLET & GAME ECONOMY
 * 
 * Verifies:
 * 1. Initial wallet creation and default balance integrity.
 * 2. Scholastic Gold adding and spending with exact balance tracking.
 * 3. Daily Blitz Gold Soft Cap (500 Gold/day) boundary enforcement.
 * 4. Uncapped Skill Realm Gold accumulation.
 * 5. Atlas Diamonds adding, spending, and insufficient funds protection.
 * 6. Inventory management, item purchasing, and consumption.
 * 7. Transaction history audit logging (latest 20 transactions).
 * 8. Retroactive Backfill Migration for veteran learners.
 */

import assert from 'assert';
import {
  getWallet,
  saveWallet,
  addGold,
  addDiamonds,
  spendCurrency,
  consumeInventoryItem,
  getInventoryItemQuantity,
  checkAndApplyRetroactiveBackfill,
  getDailyBlitzGoldEarned,
  resetWalletForTesting,
  CURRENCY_TYPES,
  DAILY_BLITZ_GOLD_LIMIT
} from '../src/services/gamification/atlasWalletService.js';

console.log('🧪 Running Step 209: Atlas Treasury Wallet & Currency Economy Tests...\n');

let totalTests = 0;
let passedTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

// Reset state before tests
resetWalletForTesting();

// 1. Initial Wallet State
it('1. Initializes empty wallet with 0 Gold, 0 Diamonds, empty inventory and backfill unearned', () => {
  const wallet = getWallet();
  assert.strictEqual(wallet.gold, 0, 'Initial gold must be 0');
  assert.strictEqual(wallet.diamonds, 0, 'Initial diamonds must be 0');
  assert.deepStrictEqual(wallet.inventory, {}, 'Initial inventory must be empty object');
  assert.strictEqual(wallet.backfillClaimed, false, 'Backfill must be initially unearned');
});

// 2. Gold Adding & Transaction Logging
it('2. addGold increases balance and records audit transaction', () => {
  const res = addGold(150, 'Completed Listening Gate 1', false);
  assert.strictEqual(res.actualAdded, 150);
  assert.strictEqual(res.currentGold, 150);
  assert.strictEqual(res.capHit, false);

  const wallet = getWallet();
  assert.strictEqual(wallet.gold, 150);
  assert.strictEqual(wallet.transactions.length, 1);
  assert.strictEqual(wallet.transactions[0].amount, 150);
  assert.strictEqual(wallet.transactions[0].currency, CURRENCY_TYPES.GOLD);
});

// 3. Daily Blitz Soft Cap Enforcement
it('3. addGold enforces Daily Soft Cap of 500 Gold for Blitz mode', () => {
  resetWalletForTesting();
  
  // Add 400 blitz gold
  const r1 = addGold(400, 'Blitz Match 1', true);
  assert.strictEqual(r1.actualAdded, 400);
  assert.strictEqual(r1.capHit, false);
  assert.strictEqual(getDailyBlitzGoldEarned(), 400);

  // Add another 150 blitz gold (should only allow 100 to hit 500 limit)
  const r2 = addGold(150, 'Blitz Match 2', true);
  assert.strictEqual(r2.actualAdded, 100);
  assert.strictEqual(r2.capHit, true);
  assert.strictEqual(getDailyBlitzGoldEarned(), DAILY_BLITZ_GOLD_LIMIT);

  // Next blitz should award 0 gold
  const r3 = addGold(50, 'Blitz Match 3', true);
  assert.strictEqual(r3.actualAdded, 0);
  assert.strictEqual(r3.capHit, true);

  // Skill Realms gate reward is NOT blitz and should ignore cap
  const rRealms = addGold(200, 'Realm Gate Completed', false);
  assert.strictEqual(rRealms.actualAdded, 200);
  assert.strictEqual(rRealms.capHit, false);
});

// 4. Diamonds Adding & Insufficient Funds Guard
it('4. addDiamonds increments gems and spendCurrency prevents negative balance', () => {
  resetWalletForTesting();

  // Add 30 diamonds
  const rGems = addDiamonds(30, 'Level Up 5');
  assert.strictEqual(rGems.actualAdded, 30);
  assert.strictEqual(rGems.currentDiamonds, 30);

  // Attempt to buy something costing 50 diamonds (insufficient)
  const buyFailed = spendCurrency(CURRENCY_TYPES.DIAMONDS, 50, 'item_dual_perk', 'Dual Perk Slot');
  assert.strictEqual(buyFailed.success, false);
  assert.strictEqual(buyFailed.message, 'insufficient_funds');
  assert.strictEqual(buyFailed.remainingBalance, 30);

  // Buy something costing 25 diamonds (sufficient)
  const buyOk = spendCurrency(CURRENCY_TYPES.DIAMONDS, 25, 'item_streak_freeze', 'Atlas Streak Freeze', 1);
  assert.strictEqual(buyOk.success, true);
  assert.strictEqual(buyOk.remainingBalance, 5);
  assert.strictEqual(getInventoryItemQuantity('item_streak_freeze'), 1);
});

// 5. Inventory Consumption
it('5. consumeInventoryItem reduces quantity and removes depleted items', () => {
  assert.strictEqual(getInventoryItemQuantity('item_streak_freeze'), 1);
  const consumed = consumeInventoryItem('item_streak_freeze');
  assert.strictEqual(consumed, true);
  assert.strictEqual(getInventoryItemQuantity('item_streak_freeze'), 0);

  // Cannot consume non-existent item
  const consumeEmpty = consumeInventoryItem('item_streak_freeze');
  assert.strictEqual(consumeEmpty, false);
});

// 6. Retroactive Backfill Migration
it('6. checkAndApplyRetroactiveBackfill awards veteran bonus once and prevents double claiming', () => {
  resetWalletForTesting();

  // Learner is Level 20 with 8 completed gates
  const backfill = checkAndApplyRetroactiveBackfill(20, 8);
  assert.strictEqual(backfill.awarded, true);
  assert.strictEqual(backfill.diamondsAwarded, (20 - 1) * 15); // 285 diamonds
  assert.strictEqual(backfill.goldAwarded, 8 * 30); // 240 gold

  const wallet = getWallet();
  assert.strictEqual(wallet.diamonds, 285);
  assert.strictEqual(wallet.gold, 240);
  assert.strictEqual(wallet.backfillClaimed, true);

  // Calling again must not double award
  const backfillSecondTime = checkAndApplyRetroactiveBackfill(20, 8);
  assert.strictEqual(backfillSecondTime.awarded, false);
  assert.strictEqual(backfillSecondTime.diamondsAwarded, 0);
  assert.strictEqual(backfillSecondTime.goldAwarded, 0);

  const walletUnchanged = getWallet();
  assert.strictEqual(walletUnchanged.diamonds, 285);
  assert.strictEqual(walletUnchanged.gold, 240);
});

// 7. Verify Inflow Hook in Daily Quests (Atlas Knowledge Vault)
it('7. claimAtlasKnowledgeVault awards +100 Gold and +10 Diamonds to wallet', async () => {
  resetWalletForTesting();
  const { claimAtlasKnowledgeVault, getDailySprintsData, recordDailyQuestProgress, QUEST_TYPES } = await import('../src/services/gamification/atlasDailyQuestService.js');

  // Complete all 3 daily quests
  recordDailyQuestProgress(QUEST_TYPES.COMPLETE_SPRINT, 1);
  recordDailyQuestProgress(QUEST_TYPES.AUDIO_BLITZ_ACCURACY, 5);
  recordDailyQuestProgress(QUEST_TYPES.DEAL_BOSS_DAMAGE, 300);

  const claimRes = claimAtlasKnowledgeVault();
  assert.strictEqual(claimRes.success, true);
  assert.strictEqual(claimRes.reward.bonusGold, 100);
  assert.strictEqual(claimRes.reward.bonusDiamonds, 10);

  const wallet = getWallet();
  assert.strictEqual(wallet.gold, 100);
  assert.strictEqual(wallet.diamonds, 10);
});

// 8. Verify Mistake Pardon Scroll functionality
it('8. pardonMistakes resolves up to requested number of unresolved mistakes', async () => {
  const { recordMistake, getStoredMistakes, pardonMistakes, clearMistakeVault } = await import('../src/services/gamification/mistakeVaultService.js');
  clearMistakeVault();

  // Add 3 sample mistakes
  recordMistake({ id: 'q_err_1', prompt: 'Question 1', type: 'spelling', options: ['A', 'B'] }, 0);
  recordMistake({ id: 'q_err_2', prompt: 'Question 2', type: 'tfng', options: ['True', 'False'] }, 1);
  recordMistake({ id: 'q_err_3', prompt: 'Question 3', type: 'vocab', options: ['C', 'D'] }, 0);

  const before = getStoredMistakes();
  assert.strictEqual(before.filter(m => !m.resolved).length, 3);

  // Pardon 2 mistakes
  const pardonedCount = pardonMistakes(2);
  assert.strictEqual(pardonedCount, 2);

  const after = getStoredMistakes();
  const unresolved = after.filter(m => !m.resolved);
  assert.strictEqual(unresolved.length, 1);
  assert.strictEqual(unresolved[0].id, 'q_err_1');
});

// 9. Verify Dual-Perk Engine & Emergency Aegis Shield Elixir
it('9. useArenaSprintEngine supports Dual-Perks and emergency Aegis Shield Elixir', async () => {
  const { 
    startSprintAction, 
    activatePerkAction, 
    consumeAegisElixirAction,
    ARENA_SPRINT_PHASES 
  } = await import('../src/hooks/useArenaSprintEngine.js');

  const mockQuestions = [
    { id: 'q1', prompt: 'Select correct synonym', options: ['Huge', 'Tiny', 'Micro', 'Minuscule'], correctIndex: 0 }
  ];

  // Start with Dual-Perks: chronos_freeze and oracle_insight
  const sprintState = startSprintAction(mockQuestions, 180, 'hard', {
    equippedPerks: ['chronos_freeze', 'oracle_insight']
  });

  assert.strictEqual(sprintState.phase, ARENA_SPRINT_PHASES.ACTIVE);
  assert.deepStrictEqual(sprintState.equippedPerks, ['chronos_freeze', 'oracle_insight']);
  assert.strictEqual(sprintState.isPerkUsed, false);

  // Activate Perk 1: Chronos Freeze
  const freezeState = activatePerkAction(sprintState, 'chronos_freeze');
  assert.strictEqual(freezeState.timeRemaining, 195); // 180 + 15s
  assert.deepStrictEqual(freezeState.usedPerks, ['chronos_freeze']);
  assert.strictEqual(freezeState.isPerkUsed, false); // Still has 1 perk left

  // Activate Perk 2: Oracle Insight
  const oracleState = activatePerkAction(freezeState, 'oracle_insight');
  assert.strictEqual(oracleState.eliminatedOptions.length, 1);
  assert.deepStrictEqual(oracleState.usedPerks, ['chronos_freeze', 'oracle_insight']);
  assert.strictEqual(oracleState.isPerkUsed, true); // All perks used

  // Test Emergency Aegis Shield Elixir
  // If shields are 3, elixir cannot be used
  const normalShieldsState = { ...oracleState, shieldState: { shields: 3, maxShields: 3 } };
  const rejectedElixir = consumeAegisElixirAction(normalShieldsState);
  assert.strictEqual(rejectedElixir.shieldState.shields, 3);

  // If down to 1 shield, elixir restores +1 shield
  const lowShieldsState = { ...oracleState, shieldState: { shields: 1, maxShields: 3 } };
  const restoredElixir = consumeAegisElixirAction(lowShieldsState);
  assert.strictEqual(restoredElixir.shieldState.shields, 2);
});

// 10. Verify Treasury Store Catalog Integrity
it('10. TREASURY_ITEMS catalog has all 4 sections, prices, and valid currencies', async () => {
  const { TREASURY_ITEMS, TREASURY_TABS } = await import('../src/services/gamification/atlasTreasuryCatalog.js');

  assert.ok(Array.isArray(TREASURY_ITEMS));
  assert.strictEqual(TREASURY_ITEMS.length >= 7, true);

  const sections = new Set(TREASURY_ITEMS.map(i => i.section));
  assert.strictEqual(sections.has(TREASURY_TABS.SURVIVAL), true);
  assert.strictEqual(sections.has(TREASURY_TABS.TACTICAL), true);
  assert.strictEqual(sections.has(TREASURY_TABS.SCHOLASTIC), true);
  assert.strictEqual(sections.has(TREASURY_TABS.PRESTIGE), true);

  for (const item of TREASURY_ITEMS) {
    assert.ok(item.id, 'Item must have an ID');
    assert.ok(item.nameEn, `Item ${item.id} must have English name`);
    assert.ok(item.nameVi, `Item ${item.id} must have Vietnamese name`);
    assert.ok(item.descEn, `Item ${item.id} must have English description`);
    assert.ok(item.descVi, `Item ${item.id} must have Vietnamese description`);
    assert.ok(item.price > 0, `Item ${item.id} must have price > 0`);
    assert.ok(['gold', 'diamonds'].includes(item.currency), `Item ${item.id} must use valid currency`);
  }
});

console.log(`\n===============================================================`);
console.log(`🎉 All ${passedTests}/${totalTests} Step 209 (Atlas Treasury & Economy) Unit Tests Passed Cleanly!`);
console.log(`===============================================================\n`);
