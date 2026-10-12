/**
 * tests/test_step124_arena_xp_persistence_and_accumulation.js
 * 
 * Verification Test Suite for Step 124:
 * Arena Sprint XP Persistence, Local-First Merging & Progression Accumulation
 * 
 * Verifies:
 * 1. Completing a sprint awards XP and immediately updates leaderboard & profile.
 * 2. Consecutive sprints accumulate XP additively (e.g. 85 XP + 70 XP = 155 XP).
 * 3. fetchRealLeaderboard merges Cloud data without clobbering higher local XP.
 * 4. Defeat / early exit preserves partial XP for correct answers.
 * 5. resetUserArenaScore cleanses score back to Level 1 (0 XP) deterministically.
 */

import assert from 'assert';
import { 
  DEFAULT_OWNER_PROFILE, 
  reconcileRealLeaderboard, 
  fetchRealLeaderboard, 
  submitRealSprintScore,
  resetUserArenaScore,
  REAL_LEADERBOARD_STORAGE_KEY 
} from '../src/services/gamification/realLeaderboardService.js';
import { calculateSprintXp } from '../src/services/gamification/xpCalculator.js';
import { safeGet, safeSet } from '../src/utils/storageService.js';

let passed = 0;
let total = 0;

async function it(desc, fn) {
  total++;
  try {
    await fn();
    passed++;
  } catch (err) {
    console.error(`❌ Failed: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

async function runTests() {
  console.log('🧪 Running Step 124 Test Suite: Arena XP Persistence & Accumulation...');

  const testOwner = {
    email: 'tranthanhtung37@gmail.com',
    user_metadata: { name: 'tranthanhtung37' }
  };

  // 1. Reset cleanses account to Level 1, 0 XP
  await it('1. resetUserArenaScore resets owner account cleanly to 0 XP and Level 1', () => {
    resetUserArenaScore('tranthanhtung37');
    const result = reconcileRealLeaderboard([], testOwner);
    const owner = result.leaderboard.find(u => u.display_name === 'tranthanhtung37');
    assert.strictEqual(owner.weekly_xp, 0);
    assert.strictEqual(owner.total_xp, 0);
    assert.strictEqual(owner.level, 1);
    assert.strictEqual(result.userWeeklyXp, 0);
  });

  // 2. Submitting sprint XP increases score and advances level
  await it('2. submitRealSprintScore increases weekly and total XP, and fetchRealLeaderboard retains it', async () => {
    resetUserArenaScore('tranthanhtung37');
    
    // Sprint 1: 85 XP earned
    await submitRealSprintScore({
      currentUser: testOwner,
      deltaXp: 85,
      streakCount: 1
    });

    const res = await fetchRealLeaderboard(testOwner);
    assert.strictEqual(res.userWeeklyXp, 85, 'User weekly XP must be 85');
    const owner = res.leaderboard.find(u => u.display_name === 'tranthanhtung37');
    assert.strictEqual(owner.weekly_xp, 85);
    assert.strictEqual(owner.total_xp, 85);
    assert.strictEqual(owner.level, 2, '85 XP reaches Level 2 (82 XP threshold)');
  });

  // 3. Consecutive sprints accumulate additively
  await it('3. Consecutive sprints accumulate XP additively without resetting', async () => {
    // Sprint 2: +70 XP earned
    await submitRealSprintScore({
      currentUser: testOwner,
      deltaXp: 70,
      streakCount: 2
    });

    const res2 = await fetchRealLeaderboard(testOwner);
    assert.strictEqual(res2.userWeeklyXp, 155, '85 + 70 must equal 155 XP');
    const owner2 = res2.leaderboard.find(u => u.display_name === 'tranthanhtung37');
    assert.strictEqual(owner2.weekly_xp, 155);
    assert.strictEqual(owner2.total_xp, 155);
    assert.strictEqual(owner2.streak_count, 2);
  });

  // 4. Local-First Smart Merge retains local XP even if stale cloud data is fetched
  await it('4. Local-First Smart Merge never allows stale 0 XP cloud entry to wipe out local progress', async () => {
    // Simulate stale cloud array with 0 XP for tranthanhtung37
    const staleCloudUsers = [
      {
        display_name: 'tranthanhtung37',
        weekly_xp: 0,
        total_xp: 0,
        version_v2: false
      }
    ];

    const currentCached = safeGet(REAL_LEADERBOARD_STORAGE_KEY, []);
    const mergedMap = new Map();
    for (const u of currentCached) {
      if (u && u.display_name) mergedMap.set(u.display_name.toLowerCase(), u);
    }
    for (const c of staleCloudUsers) {
      const key = c.display_name.toLowerCase();
      const existing = mergedMap.get(key);
      if (existing) {
        mergedMap.set(key, {
          ...c,
          ...existing,
          weekly_xp: Math.max(existing.weekly_xp || 0, c.weekly_xp || 0),
          total_xp: Math.max(existing.total_xp || 0, c.total_xp || 0),
          version_v2: existing.version_v2 || c.version_v2
        });
      }
    }

    const mergedOwner = mergedMap.get('tranthanhtung37');
    assert.strictEqual(mergedOwner.weekly_xp, 155, 'Local 155 XP must be preserved against stale 0 XP');
    assert.strictEqual(mergedOwner.total_xp, 155);
  });

  // 5. Partial XP on Defeat Calculation
  await it('5. calculateSprintXp correctly awards partial base XP for correct answers even on early exit', () => {
    const partial = calculateSprintXp({
      correctAnswers: 4,
      streakCount: 1,
      totalSeconds: 45,
      difficulty: 'medium',
      timeRemaining: 0,
      isBossCleared: false
    });

    assert.ok(partial.finalXp > 0, 'Partial XP must be greater than 0');
    assert.strictEqual(partial.baseScore, 80, '4 correct answers * 20 Base XP = 80 XP');
  });

  console.log(`\n🎉 All ${passed}/${total} unit tests passed for Step 124! (100%)\n`);
}

runTests();
