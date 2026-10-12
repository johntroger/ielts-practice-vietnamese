/**
 * tests/test_step117_level_progression_mathematical_engine.js
 * 
 * Verification Test Suite for Step 117:
 * 100-Level Mathematical Progression Engine for Atlas English Arena (levelEngine.js)
 * Verifies:
 * 1. Exact cumulative XP milestones calculation: 22*(L-1)^2 + 60*(L-1)
 * 2. Closed-form reverse calculation (XP -> Level 1 to 100)
 * 3. Edge-cases: 0 XP, negative, null, string numbers, floats, beyond max level
 * 4. Specific user validation: tranthanhtung37 (9,400 XP -> Lv.20 Atlas Gladiator)
 * 5. Detailed level progression payload (progress percent, xp remaining, next level base)
 * 6. 6 Mythic Atlas Titan Tiers assignment (Seeker -> Gladiator -> Centurion -> Skybearer -> Titan -> Primordial)
 */

import assert from 'assert';
import {
  calculateXpForLevel,
  calculateLevelFromXp,
  calculateLevelProgress,
  getLevelTierInfo,
  ATLAS_TITAN_TIERS,
  MAX_ATLAS_LEVEL
} from '../src/services/gamification/levelEngine.js';

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

console.log('🧪 Running Step 117 Test Suite: 100-Level Atlas Titans Mathematical Engine...');

// 1. Base Cumulative XP Calculations
it('1. calculateXpForLevel produces exact 100-level progression milestones', () => {
  assert.strictEqual(calculateXpForLevel(1), 0, 'Level 1 requires 0 XP');
  assert.strictEqual(calculateXpForLevel(2), 82, 'Level 2 requires 82 XP (quick win in 1 sprint)');
  assert.strictEqual(calculateXpForLevel(3), 208, 'Level 3 requires 208 XP');
  assert.strictEqual(calculateXpForLevel(4), 378, 'Level 4 requires 378 XP');
  assert.strictEqual(calculateXpForLevel(5), 592, 'Level 5 requires 592 XP');
  assert.strictEqual(calculateXpForLevel(10), 2322, 'Level 10 requires 2,322 XP');
  assert.strictEqual(calculateXpForLevel(20), 9082, 'Level 20 requires 9,082 XP');
  assert.strictEqual(calculateXpForLevel(21), 10000, 'Level 21 requires 10,000 XP');
  assert.strictEqual(calculateXpForLevel(50), 55762, 'Level 50 requires 55,762 XP');
  assert.strictEqual(calculateXpForLevel(100), 221562, 'Level 100 requires 221,562 XP (long-term master)');
});

// 2. Reverse Level Extraction from Total XP
it('2. calculateLevelFromXp correctly maps XP intervals to levels 1 to 100', () => {
  assert.strictEqual(calculateLevelFromXp(0), 1);
  assert.strictEqual(calculateLevelFromXp(81), 1);
  assert.strictEqual(calculateLevelFromXp(82), 2);
  assert.strictEqual(calculateLevelFromXp(207), 2);
  assert.strictEqual(calculateLevelFromXp(208), 3);
  assert.strictEqual(calculateLevelFromXp(2321), 9);
  assert.strictEqual(calculateLevelFromXp(2322), 10);
  assert.strictEqual(calculateLevelFromXp(9082), 20);
  assert.strictEqual(calculateLevelFromXp(9999), 20);
  assert.strictEqual(calculateLevelFromXp(10000), 21);
  assert.strictEqual(calculateLevelFromXp(221562), 100);
  assert.strictEqual(calculateLevelFromXp(500000), 100, 'Level caps at MAX_ATLAS_LEVEL (100)');
});

// 3. User tranthanhtung37 Specific Real Verification
it('3. Specific user tranthanhtung37 with 9,400 XP is calculated as Lv.20 Atlas Gladiator', () => {
  const xp = 9400;
  const progress = calculateLevelProgress(xp);

  assert.strictEqual(progress.level, 20, 'Must be Level 20');
  assert.strictEqual(progress.currentLevelBaseXp, 9082);
  assert.strictEqual(progress.nextLevelBaseXp, 10000);
  assert.strictEqual(progress.xpIntoLevel, 318); // 9400 - 9082 = 318 XP
  assert.strictEqual(progress.xpRequiredForNextLevel, 918); // 10000 - 9082 = 918 XP
  assert.strictEqual(progress.xpRemaining, 600); // 10000 - 9400 = 600 XP to Lv.21!
  assert.strictEqual(progress.progressPercent, 35); // round(318 / 918 * 100) = 35%
  assert.strictEqual(progress.tier.id, 'gladiator');
  assert.strictEqual(progress.tier.titleEn, 'Atlas Gladiator');
  assert.strictEqual(progress.tier.titleVi, 'Đấu Sĩ Đấu Trường');
  assert.strictEqual(progress.isMaxLevel, false);
});

// 4. Edge Cases Robustness
it('4. Handles edge cases gracefully (negative, null, undefined, strings, floats)', () => {
  assert.strictEqual(calculateLevelFromXp(-500), 1);
  assert.strictEqual(calculateLevelFromXp(null), 1);
  assert.strictEqual(calculateLevelFromXp(undefined), 1);
  assert.strictEqual(calculateLevelFromXp('500'), 4);
  assert.strictEqual(calculateLevelFromXp(82.9), 2);

  const prog0 = calculateLevelProgress(0);
  assert.strictEqual(prog0.level, 1);
  assert.strictEqual(prog0.progressPercent, 0);
  assert.strictEqual(prog0.xpRemaining, 82);

  const progMax = calculateLevelProgress(300000);
  assert.strictEqual(progMax.level, 100);
  assert.strictEqual(progMax.progressPercent, 100);
  assert.strictEqual(progMax.xpRemaining, 0);
  assert.strictEqual(progMax.isMaxLevel, true);
  assert.strictEqual(progMax.tier.id, 'primordial');
});

// 5. 6 Mythic Atlas Titan Tier Classifications
it('5. getLevelTierInfo maps levels to 6 prestigious Atlas Titan tiers', () => {
  assert.strictEqual(getLevelTierInfo(1).id, 'seeker');
  assert.strictEqual(getLevelTierInfo(10).id, 'seeker');
  assert.strictEqual(getLevelTierInfo(11).id, 'gladiator');
  assert.strictEqual(getLevelTierInfo(25).id, 'gladiator');
  assert.strictEqual(getLevelTierInfo(26).id, 'centurion');
  assert.strictEqual(getLevelTierInfo(45).id, 'centurion');
  assert.strictEqual(getLevelTierInfo(46).id, 'skybearer');
  assert.strictEqual(getLevelTierInfo(70).id, 'skybearer');
  assert.strictEqual(getLevelTierInfo(71).id, 'titan');
  assert.strictEqual(getLevelTierInfo(90).id, 'titan');
  assert.strictEqual(getLevelTierInfo(91).id, 'primordial');
  assert.strictEqual(getLevelTierInfo(100).id, 'primordial');
});

console.log(`\n🎉 All ${passed}/${total} unit tests passed for Step 117! (100%)\n`);
