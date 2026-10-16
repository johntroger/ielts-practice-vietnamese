/**
 * tests/test_step161_arena_haptic_tactile_mobile_affixes_and_loot_drop.js
 * 
 * Verification suite for Phase 1:
 * 1. Tactile Haptic Vibration Engine (hapticHelper.js & useArenaAudio integration).
 * 2. Mobile Ergonomics Quick-Affix & Special Character Bar in ArenaTextInputCard.jsx.
 * 3. Mystery Relic Loot Drop (evaluateMysteryLootDrop in xpCalculator.js).
 * 4. Transparent Loot Bonus decomposition in ArenaSprintSummaryModal.jsx.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  triggerHaptic, 
  isHapticSupported, 
  setHapticEnabled, 
  getHapticEnabled,
  HAPTIC_PATTERNS 
} from '../src/utils/hapticHelper.js';
import { 
  evaluateMysteryLootDrop, 
  calculateSprintXp, 
  ARENA_LOOT_TIERS 
} from '../src/services/gamification/xpCalculator.js';
import { startSprintAction, finishSprintAction } from '../src/hooks/useArenaSprintEngine.js';

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('\n--- Running Step 163: Arena Haptic Feedback, Mobile Quick-Affixes & Mystery Loot Tests ---');

// 1. Haptic Engine presets and safe execution
it('1. Haptic helper provides calibrated vibration presets and safe fallback', () => {
  assert.ok(HAPTIC_PATTERNS.correct, 'Must define correct haptic pattern');
  assert.ok(HAPTIC_PATTERNS.wrong, 'Must define wrong haptic pattern');
  assert.ok(HAPTIC_PATTERNS.loot, 'Must define loot haptic pattern');
  assert.ok(HAPTIC_PATTERNS.chipTap, 'Must define chipTap micro-tap');

  // Verify safe execution in Node.js (navigator is undefined or lacks vibrate)
  assert.strictEqual(isHapticSupported(), false, 'Node environment must report isHapticSupported = false');
  assert.strictEqual(triggerHaptic('correct'), false, 'triggerHaptic must safely return false in Node');

  setHapticEnabled(false);
  assert.strictEqual(getHapticEnabled(), false);
  setHapticEnabled(true);
  assert.strictEqual(getHapticEnabled(), true);
});

// 2. Mystery Loot Drop evaluation
it('2. evaluateMysteryLootDrop awards tiered relics based on exam performance', () => {
  // Low score (< 3 correct): 0% chance
  const poorRun = evaluateMysteryLootDrop({ correctAnswers: 2, totalQuestions: 7 });
  assert.strictEqual(poorRun, null, 'Must not drop loot for < 3 correct answers');

  // Perfect score (7/7) with boss cleared: 100% guarantee Crown
  const flawlessRun = evaluateMysteryLootDrop({ 
    correctAnswers: 7, 
    totalQuestions: 7, 
    isBossCleared: true, 
    maxCombo: 7,
    rng: () => 0.5 
  });
  assert.ok(flawlessRun, 'Flawless run must guarantee loot');
  assert.strictEqual(flawlessRun.id, ARENA_LOOT_TIERS.CROWN.id);
  assert.strictEqual(flawlessRun.bonusXp, 30);

  // High score (7/7) without boss: Crystal
  const highRun = evaluateMysteryLootDrop({ 
    correctAnswers: 7, 
    totalQuestions: 7, 
    isBossCleared: false, 
    maxCombo: 5,
    rng: () => 0.5 
  });
  assert.strictEqual(highRun.id, ARENA_LOOT_TIERS.CRYSTAL.id);
  assert.strictEqual(highRun.bonusXp, 20);
});

// 3. calculateSprintXp incorporates lootBonus and expands cap
it('3. calculateSprintXp incorporates lootBonus and properly expands max cap', () => {
  const normalResult = calculateSprintXp({
    correctAnswers: 7,
    streakCount: 0,
    totalSeconds: 30,
    difficulty: 'medium',
    timeRemaining: 150,
    isBossCleared: false,
    lootBonus: 0
  });

  const lootResult = calculateSprintXp({
    correctAnswers: 7,
    streakCount: 0,
    totalSeconds: 30,
    difficulty: 'medium',
    timeRemaining: 150,
    isBossCleared: false,
    lootBonus: 25
  });

  assert.strictEqual(lootResult.lootBonus, 25);
  assert.strictEqual(normalResult.lootBonus, 0);
  assert.strictEqual(lootResult.finalXp - normalResult.finalXp, 25, 'finalXp must reflect +25 lootBonus');
});

// 4. finishSprintAction integrates mystery loot into match summary
it('4. finishSprintAction evaluates mystery loot and includes in summary', () => {
  const activeState = startSprintAction([{ id: 'q1' }, { id: 'q2' }, { id: 'q3' }, { id: 'q4' }], 180, 'medium');
  const completed = finishSprintAction({
    ...activeState,
    score: 4,
    timeRemaining: 100,
    duration: 180,
    isBossCleared: true,
    maxCombo: 4
  });

  assert.ok(completed.summary, 'Summary must exist');
  assert.ok(completed.summary.finalXp > 0, 'Final XP must be > 0');
  if (completed.summary.mysteryLoot) {
    assert.ok(completed.summary.lootBonus > 0, 'lootBonus must match mysteryLoot');
  }
});

// 5. ArenaTextInputCard includes Quick-Affix & Special Character Bar
it('5. ArenaTextInputCard renders Quick-Affix chip bar with triggerHaptic', () => {
  const code = fs.readFileSync(path.resolve('src/components/arena/ArenaTextInputCard.jsx'), 'utf-8');
  assert.ok(code.includes('triggerHaptic'), 'ArenaTextInputCard must import and call triggerHaptic');
  assert.ok(code.includes('-tion') && code.includes('-ment') && code.includes('-able'), 'Card must render quick affixes');
  assert.ok(code.includes('overflow-x-auto'), 'Affix bar must support horizontal touch scrolling');
});

// 6. ArenaSprintSummaryModal renders Mystery Loot Drop card and haptic fanfare
it('6. ArenaSprintSummaryModal renders Mystery Loot Drop card and haptic fanfare', () => {
  const code = fs.readFileSync(path.resolve('src/components/arena/ArenaSprintSummaryModal.jsx'), 'utf-8');
  assert.ok(code.includes('summary.mysteryLoot'), 'Summary modal must check for summary.mysteryLoot');
  assert.ok(code.includes("triggerHaptic('loot')"), 'Summary modal must fire loot haptic fanfare');
  assert.ok(code.includes('summary.lootBonus > 0'), 'Summary modal must render lootBonus chip in table');
});

// 7. Locales contain mystery loot translations
it('7. Both Vietnamese and English locales provide mystery loot keys', () => {
  const viCode = fs.readFileSync(path.resolve('src/i18n/locales/vi.js'), 'utf-8');
  const enCode = fs.readFileSync(path.resolve('src/i18n/locales/en.js'), 'utf-8');

  assert.ok(viCode.includes('mysteryLootLabel:'), 'vi.js must have mysteryLootLabel');
  assert.ok(viCode.includes('mysteryRelicBadge:'), 'vi.js must have mysteryRelicBadge');
  assert.ok(enCode.includes('mysteryLootLabel:'), 'en.js must have mysteryLootLabel');
  assert.ok(enCode.includes('mysteryRelicBadge:'), 'en.js must have mysteryRelicBadge');
});

console.log(`\nAll ${passedTests}/${totalTests} Step 163 Haptic & Loot Tests Passed Successfully! 🎉\n`);
