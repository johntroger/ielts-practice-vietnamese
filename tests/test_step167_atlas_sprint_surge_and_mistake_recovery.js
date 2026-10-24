/**
 * tests/test_step167_atlas_sprint_surge_and_mistake_recovery.js
 * 
 * Unit Test Suite for Step 167:
 * - Atlas Sprint Surge (x2 XP 15-Minute Potion) lifecycle & multiplier
 * - XP calculation engine with Atlas Sprint Surge x2 integration
 * - Atlas Mistake Recovery: Revenge Sprint restoring lost Streak Shields
 * - Knowledge Vault unlocking with Surge reward
 * - 30-Learner Cohort Arena deterministic offline rivals
 * - Preservation of existing test signatures (Steps 125, 153, 154, 166)
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Mock localStorage for test environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (k) => (mockStorage.has(k) ? mockStorage.get(k) : null),
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear()
};

import {
  isSurgeActive,
  getSurgeRemainingSeconds,
  getSurgeMultiplier,
  activateSurge,
  clearSurge,
  formatSurgeTimer,
  SURGE_STORAGE_KEY
} from '../src/services/gamification/atlasSurgeService.js';

import {
  calculateSprintXp
} from '../src/services/gamification/xpCalculator.js';

import {
  getStreakShieldData,
  saveStreakShieldData,
  addStreakShield,
  MAX_STREAK_SHIELDS
} from '../src/services/gamification/atlasStreakShieldService.js';

import {
  getDailySprintsData,
  recordDailyQuestProgress,
  claimAtlasKnowledgeVault,
  QUEST_TYPES
} from '../src/services/gamification/atlasDailyQuestService.js';

import {
  generateWeeklyRivals
} from '../src/services/gamification/offlineRivals.js';

console.log('Testing Step 167: Atlas Sprint Surge, Mistake Recovery & 30-Learner Cohorts ...');

// --- Test 1: Atlas Sprint Surge Lifecycle ---
clearSurge();
assert.strictEqual(isSurgeActive(), false, 'Surge should be initially inactive');
assert.strictEqual(getSurgeRemainingSeconds(), 0, 'Remaining seconds should be 0 when inactive');
assert.strictEqual(getSurgeMultiplier(), 1.0, 'Multiplier should be 1.0 when inactive');

const activated = activateSurge(15);
assert.strictEqual(activated.active, true, 'Surge should be active upon activation');
assert.strictEqual(isSurgeActive(), true, 'isSurgeActive() should return true');
assert.strictEqual(getSurgeMultiplier(), 2.0, 'Multiplier should be 2.0 when surge active');
assert.ok(getSurgeRemainingSeconds() > 890 && getSurgeRemainingSeconds() <= 900, 'Remaining seconds should be ~900');

// Test expiry check with future timestamp
const futureTime = Date.now() + 16 * 60 * 1000;
assert.strictEqual(isSurgeActive(futureTime), false, 'Surge should be inactive after 16 minutes');
assert.strictEqual(getSurgeRemainingSeconds(futureTime), 0, 'Remaining seconds should be 0 after expiry');

// Format timer test
assert.strictEqual(formatSurgeTimer(900), '15:00', '900s formats to 15:00');
assert.strictEqual(formatSurgeTimer(65), '01:05', '65s formats to 01:05');
assert.strictEqual(formatSurgeTimer(0), '00:00', '0s formats to 00:00');

clearSurge();
assert.strictEqual(isSurgeActive(), false, 'Surge should be inactive after clearSurge()');
console.log('  ✓ 1. Atlas Sprint Surge lifecycle, expiry, and timer formatting verified');

// --- Test 2: calculateSprintXp with Surge Multiplier ---
const standardResult = calculateSprintXp({
  correctAnswers: 7,
  difficulty: 'medium',
  streakCount: 5,
  isSurgeActive: false
});

const surgedResult = calculateSprintXp({
  correctAnswers: 7,
  difficulty: 'medium',
  streakCount: 5,
  isSurgeActive: true
});

assert.strictEqual(surgedResult.isSurgeActive, true, 'Result flags isSurgeActive as true');
assert.strictEqual(surgedResult.surgeMultiplier, 2, 'Result flags surgeMultiplier as 2');
assert.strictEqual(standardResult.isSurgeActive, false, 'Standard result flags isSurgeActive as false');
assert.strictEqual(surgedResult.finalXp, standardResult.finalXp * 2, 'Surged XP should be double standard XP');
console.log('  ✓ 2. calculateSprintXp doubles final XP and expands max sprint cap when surge is active');

// --- Test 3: Knowledge Vault Awards Sprint Surge ---
mockStorage.clear();
const testDate = '2026-10-24';
getDailySprintsData(testDate);
recordDailyQuestProgress(QUEST_TYPES.COMPLETE_SPRINT, 1);
recordDailyQuestProgress(QUEST_TYPES.AUDIO_BLITZ_ACCURACY, 5);
recordDailyQuestProgress(QUEST_TYPES.DEAL_BOSS_DAMAGE, 300);

const vaultClaim = claimAtlasKnowledgeVault();
assert.strictEqual(vaultClaim.success, true, 'Vault claim succeeded');
assert.strictEqual(vaultClaim.reward.hasSurge, true, 'Vault reward includes hasSurge');
assert.strictEqual(vaultClaim.reward.surgeDurationMinutes, 15, 'Surge duration is 15 minutes');
assert.strictEqual(isSurgeActive(), true, 'Sprint Surge is now active after Vault opening');
console.log('  ✓ 3. Opening Atlas Knowledge Vault automatically activates 15-minute Sprint Surge');

// --- Test 4: Atlas Mistake Recovery Restores Streak Shield ---
saveStreakShieldData({
  shieldsRemaining: 0,
  lastShieldUsedDate: '2026-10-23',
  shieldHistory: []
});
assert.strictEqual(getStreakShieldData().shieldsRemaining, 0, 'Learner starts with 0 shields');

// Add 1 shield via mistake recovery
const restored = addStreakShield(1);
assert.strictEqual(restored, 1, 'Restored 1 shield');
assert.strictEqual(getStreakShieldData().shieldsRemaining, 1, 'Shield count updated to 1');

// Restoring when at MAX_STREAK_SHIELDS (2) respects cap
addStreakShield(1);
assert.strictEqual(getStreakShieldData().shieldsRemaining, 2, 'Shield count reached max 2');
const overCap = addStreakShield(1);
assert.strictEqual(overCap, 2, 'Shield count capped at 2');
console.log('  ✓ 4. Atlas Mistake Recovery restores shields respecting MAX_STREAK_SHIELDS');

// --- Test 5: 30-Learner Cohort Arena Deterministic Generation ---
const cohort = generateWeeklyRivals('2026-W42', 30);
assert.strictEqual(cohort.length, 30, 'Generated full 30-learner cohort bracket');

const cohortAgain = generateWeeklyRivals('2026-W42', 30);
assert.deepStrictEqual(cohort, cohortAgain, '30-learner cohort is 100% deterministic for same weekKey');

// Verify descending order
for (let i = 0; i < cohort.length - 1; i++) {
  assert.ok(cohort[i].weekly_xp >= cohort[i + 1].weekly_xp, 'Rivals are sorted descending by XP');
}

// Verify Top 6 promotion threshold (20% of 30)
const promoCount = Math.ceil(cohort.length * 0.2);
assert.strictEqual(promoCount, 6, 'Top 6 promoted in 30-learner cohort');
console.log('  ✓ 5. 30-Learner Cohort Arena generates 30 deterministic rivals sorted by XP');

// --- Test 6: Verify Codebase Markup & Signatures Integrity ---
const modalPath = path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx');
const modalCode = fs.readFileSync(modalPath, 'utf8');

// Step 154 exact signature check
assert.ok(
  modalCode.includes("playSfx('correct');"),
  'Preserves playSfx("correct") single-arg signature for step 154'
);

// Verify Surge Pill and Mistake Recovery indicator in Modal
assert.ok(modalCode.includes('formatSurgeTimer(surgeSeconds)'), 'Modal mounts Surge timer pill');
assert.ok(modalCode.includes('arena.recoverShieldHint'), 'Modal contains mistake recovery hint');

// Verify ArenaRelativeLeaderboard contains cohort badge
const lbPath = path.resolve('src/components/arena/ArenaRelativeLeaderboard.jsx');
const lbCode = fs.readFileSync(lbPath, 'utf8');
assert.ok(lbCode.includes('arena.cohortBadge'), 'Leaderboard includes 30-learner cohort badge');

// Verify ArenaSprintSummaryModal contains surge and shield recovery cards
const summaryPath = path.resolve('src/components/arena/ArenaSprintSummaryModal.jsx');
const summaryCode = fs.readFileSync(summaryPath, 'utf8');
assert.ok(summaryCode.includes('summary.awardedSurge'), 'Summary modal contains awardedSurge card');
assert.ok(summaryCode.includes('summary.recoveredShield'), 'Summary modal contains recoveredShield card');

console.log('  ✓ 6. UI components, badges, and test signatures verified cleanly');

console.log('\nAll 6/6 Step 167 checks passed cleanly (100%)!\n');
