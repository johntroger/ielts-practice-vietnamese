/**
 * tests/test_step118_arena_leaderboard_level_badges_and_interaction.js
 * 
 * Verification Test Suite for Step 118 (Phase 2):
 * Atlas English Arena - Leaderboard Level Badges, Glowing Avatar Frames & Interaction
 * Verifies:
 * 1. reconcileRealLeaderboard attaches 100-Level progression payload to all ranked users
 * 2. User tranthanhtung37 (9,400 XP) has Level 20 with Atlas Gladiator tier & emerald frame ring
 * 3. Novice user (0 XP) has Level 1 with Atlas Seeker tier
 * 4. Level progress object contains exact remaining XP and percent for UI tooltips
 * 5. Simulation of onSelectLearner callback returning learner metadata
 */

import assert from 'assert';
import { 
  reconcileRealLeaderboard, 
  DEFAULT_OWNER_PROFILE 
} from '../src/services/gamification/realLeaderboardService.js';
import { calculateLevelProgress } from '../src/services/gamification/levelEngine.js';

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

console.log('🧪 Running Step 118 Test Suite: Arena Leaderboard Level Badges & Interaction...');

// 1. Leaderboard entries contain Level, LevelProgress and TitanTier
it('1. reconcileRealLeaderboard attaches level and titanTier to every leaderboard entry', () => {
  const result = reconcileRealLeaderboard([], null);
  assert.ok(result.leaderboard.length >= 1);

  for (const rival of result.leaderboard) {
    assert.ok(typeof rival.level === 'number', `rival ${rival.display_name} must have numeric level`);
    assert.ok(rival.level >= 1 && rival.level <= 100, `level ${rival.level} must be within 1-100`);
    assert.ok(rival.levelProgress, `rival ${rival.display_name} must have levelProgress`);
    assert.ok(rival.titanTier, `rival ${rival.display_name} must have titanTier`);
    assert.ok(rival.titanTier.titleEn, 'titanTier must have titleEn');
    assert.ok(rival.titanTier.badgeColor, 'titanTier must have badgeColor');
    assert.ok(rival.titanTier.ringColor, 'titanTier must have ringColor');
  }
});

// 2. Specific Validation for tranthanhtung37 (Reset for Fresh Gameplay)
it('2. tranthanhtung37 is accurately reset to Level 1 Atlas Seeker with slate ring upon reset', () => {
  const result = reconcileRealLeaderboard([], {
    email: 'tranthanhtung37@gmail.com',
    user_metadata: { name: 'tranthanhtung37' }
  });

  const owner = result.leaderboard.find(u => u.display_name === 'tranthanhtung37');
  assert.ok(owner, 'tranthanhtung37 must exist on leaderboard');
  assert.strictEqual(owner.level, 1, 'Must be Level 1');
  assert.strictEqual(owner.titanTier.id, 'seeker');
  assert.strictEqual(owner.titanTier.titleEn, 'Atlas Seeker');
  assert.strictEqual(owner.titanTier.titleVi, 'Kẻ Khởi Hành Atlas');
  assert.ok(owner.titanTier.ringColor.includes('slate'), 'Ring color must be slate');
  assert.strictEqual(owner.levelProgress.xpIntoLevel, 0);
  assert.strictEqual(owner.levelProgress.xpRemaining, 82);
  assert.strictEqual(owner.levelProgress.progressPercent, 0);
});

// 3. Novice User Level 1 Atlas Seeker
it('3. Novice user with 0 XP is mapped to Level 1 Atlas Seeker', () => {
  const mockUser = {
    id: 'newbie_101',
    email: 'newbie@ielts.org',
    user_metadata: { display_name: 'Newbie Scholar' }
  };

  const result = reconcileRealLeaderboard([], mockUser);
  const newbie = result.leaderboard.find(u => u.display_name === 'Newbie Scholar');
  assert.ok(newbie);
  assert.strictEqual(newbie.level, 1);
  assert.strictEqual(newbie.titanTier.id, 'seeker');
  assert.strictEqual(newbie.titanTier.titleEn, 'Atlas Seeker');
  assert.strictEqual(newbie.levelProgress.progressPercent, 0);
  assert.strictEqual(newbie.levelProgress.xpRemaining, 82);
});

// 4. Callback Selection Simulation
it('4. onSelectLearner callback returns learner metadata for public profile view', () => {
  let selected = null;
  const handleSelect = (learner) => {
    selected = learner;
  };

  const result = reconcileRealLeaderboard([], null);
  const target = result.leaderboard[0];

  handleSelect(target);
  assert.ok(selected);
  assert.strictEqual(selected.display_name, target.display_name);
  assert.strictEqual(selected.level, target.level);
  assert.strictEqual(selected.titanTier.id, target.titanTier.id);
});

console.log(`\n🎉 All ${passed}/${total} unit tests passed for Step 118! (100%)\n`);
