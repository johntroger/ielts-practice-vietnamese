/**
 * tests/test_step116_arena_real_leaderboard_user_system.js
 * 
 * Verification Test Suite for Step 116:
 * Atlas English Arena - 100% Real-User Leaderboard System (No Fake Bot Rivals)
 * Verifies:
 * 1. Default verified presence of tranthanhtung37 (Admin & Top Scholar)
 * 2. Complete absence of dummy/bot rivals (Alex Cambridge, Elena V., etc.)
 * 3. Accurate current user reconciliation (highlighting YOU)
 * 4. Distinct sorting and rank calculation by weekly XP
 * 5. Score submission and state update mechanics
 */

import assert from 'assert';
import { 
  DEFAULT_OWNER_PROFILE, 
  isUserOwner, 
  reconcileRealLeaderboard, 
  fetchRealLeaderboard, 
  submitRealSprintScore,
  REAL_LEADERBOARD_STORAGE_KEY
} from '../src/services/gamification/realLeaderboardService.js';
import { safeSet, safeGet } from '../src/utils/storageService.js';

let passed = 0;
let total = 0;

function it(desc, fn) {
  total++;
  try {
    fn();
    passed++;
  } catch (err) {
    console.error(`❌ Failed: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

async function runTests() {
  console.log('🧪 Running Step 116 Test Suite: Real-User Arena Leaderboard System...');

  // 1. Owner Profile Verification
  it('1. DEFAULT_OWNER_PROFILE contains verified metadata for tranthanhtung37', () => {
    assert.strictEqual(DEFAULT_OWNER_PROFILE.display_name, 'tranthanhtung37');
    assert.strictEqual(DEFAULT_OWNER_PROFILE.email, 'tranthanhtung37@gmail.com');
    assert.strictEqual(DEFAULT_OWNER_PROFILE.isOwner, true);
    assert.ok(DEFAULT_OWNER_PROFILE.weekly_xp > 0);
  });

  // 2. isUserOwner helper checks
  it('2. isUserOwner accurately detects tranthanhtung37 across various user representations', () => {
    assert.strictEqual(isUserOwner({ email: 'tranthanhtung37@gmail.com' }), true);
    assert.strictEqual(isUserOwner({ id: DEFAULT_OWNER_PROFILE.user_id }), true);
    assert.strictEqual(isUserOwner({ user_metadata: { name: 'tranthanhtung37' } }), true);
    assert.strictEqual(isUserOwner({ display_name: 'tranthanhtung37' }), true);
    assert.strictEqual(isUserOwner({ email: 'random_user@gmail.com' }), false);
    assert.strictEqual(isUserOwner(null), false);
  });

  // 3. No Fake Bot Rivals in Reconciled Leaderboard
  it('3. reconcileRealLeaderboard produces ONLY real users, completely omitting dummy bot rivals', () => {
    const result = reconcileRealLeaderboard([], null);
    assert.ok(result.leaderboard.length >= 1);
    
    // Ensure no dummy bot names exist
    const dummyNames = ['Alex Cambridge', 'Elena V.', 'Marcus IELTS 8.5', 'Sophia Chen', 'David Oxford'];
    for (const rival of result.leaderboard) {
      assert.ok(!dummyNames.includes(rival.display_name), `Found illegal dummy bot: ${rival.display_name}`);
    }

    // Ensure tranthanhtung37 is present
    const owner = result.leaderboard.find(u => u.display_name === 'tranthanhtung37');
    assert.ok(owner, 'tranthanhtung37 must be present in real leaderboard');
    assert.strictEqual(owner.isOwner, true);
  });

  // 4. Current User as Owner tranthanhtung37
  it('4. When active user is tranthanhtung37, their entry is marked with isCurrentUser: true', () => {
    const result = reconcileRealLeaderboard([], {
      email: 'tranthanhtung37@gmail.com',
      user_metadata: { name: 'tranthanhtung37' }
    });

    const owner = result.leaderboard.find(u => u.display_name === 'tranthanhtung37');
    assert.ok(owner);
    assert.strictEqual(owner.isCurrentUser, true);
    assert.strictEqual(result.currentRank, 1);
  });

  // 5. Current User as a Separate Student
  it('5. When active user is another learner, both tranthanhtung37 and learner are displayed', () => {
    const otherUser = {
      id: 'student_456',
      email: 'student@ielts.vn',
      user_metadata: { display_name: 'Minh Chau' }
    };

    const result = reconcileRealLeaderboard([], otherUser);
    assert.strictEqual(result.leaderboard.length, 2);

    const owner = result.leaderboard.find(u => u.display_name === 'tranthanhtung37');
    assert.ok(owner);
    assert.strictEqual(owner.isCurrentUser, undefined);

    const student = result.leaderboard.find(u => u.display_name === 'Minh Chau');
    assert.ok(student);
    assert.strictEqual(student.isCurrentUser, true);
    assert.strictEqual(student.user_id, 'student_456');
  });

  // 6. Ranking Order & Tiebreakers
  it('6. Real users are sorted strictly descending by weekly XP', () => {
    const mockUsers = [
      { display_name: 'HocVienA', weekly_xp: 500, total_xp: 1000 },
      { display_name: 'HocVienB', weekly_xp: 3500, total_xp: 7000 },
      { display_name: 'tranthanhtung37', weekly_xp: 2850, total_xp: 9400 }
    ];

    const result = reconcileRealLeaderboard(mockUsers, null);
    assert.strictEqual(result.leaderboard[0].display_name, 'HocVienB');
    assert.strictEqual(result.leaderboard[0].rank, 1);
    assert.strictEqual(result.leaderboard[1].display_name, 'tranthanhtung37');
    assert.strictEqual(result.leaderboard[1].rank, 2);
    assert.strictEqual(result.leaderboard[2].display_name, 'HocVienA');
    assert.strictEqual(result.leaderboard[2].rank, 3);
  });

  // 7. submitRealSprintScore updates local cache and handles valid XP
  it('7. submitRealSprintScore increases weekly XP and total XP cleanly', async () => {
    const testUser = {
      id: 'test_score_runner',
      email: 'runner@ielts.org',
      user_metadata: { display_name: 'RunnerX' }
    };

    const before = reconcileRealLeaderboard([], testUser);
    const beforeXp = before.leaderboard.find(u => u.display_name === 'RunnerX')?.weekly_xp || 0;

    const res = await submitRealSprintScore({
      currentUser: testUser,
      deltaXp: 120,
      streakCount: 3
    });
    assert.strictEqual(res.success, true);

    const after = reconcileRealLeaderboard(safeGet(REAL_LEADERBOARD_STORAGE_KEY, []), testUser);
    const afterUser = after.leaderboard.find(u => u.display_name === 'RunnerX');
    assert.ok(afterUser);
    assert.strictEqual(afterUser.weekly_xp, beforeXp + 120);
  });

  console.log(`\n🎉 All ${passed}/${total} unit tests passed for Step 116! (100%)\n`);
}

runTests();
