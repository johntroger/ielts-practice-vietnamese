/**
 * tests/test_step149_arena_mobile_ergonomics_and_spelling_analytics.js
 * 
 * Verifies Phase 3 Upgrades:
 * 1. Persistent Lexical Typing & Spelling Demons Analytics Service (typingStatsService.js).
 * 2. Typing stats recording in useArenaSprintEngine (correct, near-miss rescued, incorrect, skipped).
 * 3. Mobile Ergonomics & Viewport Pinning in ArenaTextInputCard.jsx.
 * 4. Spelling & Typing Mastery Section in UserProfileModal.jsx.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

// Setup Mock localStorage for Node test environment
const mockStorage = {};
global.localStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};
globalThis.localStorage = global.localStorage;

import { 
  getTypingStats, 
  recordTypingAttempt, 
  getTopSpellingDemons, 
  getTypingBadges, 
  resetTypingStats,
  TYPING_STATS_STORAGE_KEY 
} from '../src/services/gamification/typingStatsService.js';

import { 
  checkAnswerAction, 
  skipQuestionAction,
  ARENA_SPRINT_PHASES 
} from '../src/hooks/useArenaSprintEngine.js';

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

console.log('\n--- Running Step 149: Mobile Ergonomics & Lexical Typing Analytics Tests ---');

// 1. typingStatsService initial state & accuracy calculation
it('1. typingStatsService returns clean initial state with 0% accuracy', () => {
  resetTypingStats();
  const stats = getTypingStats();
  assert.strictEqual(stats.totalTyped, 0);
  assert.strictEqual(stats.correctCount, 0);
  assert.strictEqual(stats.nearMissRescued, 0);
  assert.strictEqual(stats.skippedCount, 0);
  assert.strictEqual(stats.accuracyRate, 0);
  assert.deepStrictEqual(stats.demons, {});
});

// 2. recordTypingAttempt correctly updates counts and computes accuracy
it('2. recordTypingAttempt tracks correct, near-miss rescues, incorrect, and skipped attempts', () => {
  resetTypingStats();

  // Correct attempt
  recordTypingAttempt({ word: 'accommodate', isCorrect: true });
  let stats = getTypingStats();
  assert.strictEqual(stats.totalTyped, 1);
  assert.strictEqual(stats.correctCount, 1);
  assert.strictEqual(stats.accuracyRate, 100);

  // Near-miss rescued attempt
  recordTypingAttempt({ word: 'maintenance', isCorrect: true, wasNearMissRescued: true });
  stats = getTypingStats();
  assert.strictEqual(stats.totalTyped, 2);
  assert.strictEqual(stats.correctCount, 2);
  assert.strictEqual(stats.nearMissRescued, 1);
  assert.strictEqual(stats.accuracyRate, 100);

  // Missed spelling demon attempt
  recordTypingAttempt({ word: 'millennium', isCorrect: false });
  stats = getTypingStats();
  assert.strictEqual(stats.totalTyped, 3);
  assert.strictEqual(stats.correctCount, 2);
  assert.strictEqual(stats.accuracyRate, 67);
  assert.strictEqual(stats.demons['millennium'], 1);

  // Skipped typing attempt
  recordTypingAttempt({ word: 'pronunciation', isCorrect: false, isSkipped: true });
  stats = getTypingStats();
  assert.strictEqual(stats.totalTyped, 4);
  assert.strictEqual(stats.skippedCount, 1);
  assert.strictEqual(stats.demons['pronunciation'], 1);
});

// 3. getTopSpellingDemons sorts by frequency descending and honors limit
it('3. getTopSpellingDemons orders demons by mistake count descending', () => {
  resetTypingStats();
  recordTypingAttempt({ word: 'bizarre', isCorrect: false });
  recordTypingAttempt({ word: 'millennium', isCorrect: false });
  recordTypingAttempt({ word: 'millennium', isCorrect: false });
  recordTypingAttempt({ word: 'millennium', isCorrect: false });
  recordTypingAttempt({ word: 'gauge', isCorrect: false });
  recordTypingAttempt({ word: 'gauge', isCorrect: false });

  const top3 = getTopSpellingDemons(3);
  assert.strictEqual(top3.length, 3);
  assert.strictEqual(top3[0].word, 'millennium');
  assert.strictEqual(top3[0].count, 3);
  assert.strictEqual(top3[1].word, 'gauge');
  assert.strictEqual(top3[1].count, 2);
  assert.strictEqual(top3[2].word, 'bizarre');
  assert.strictEqual(top3[2].count, 1);
});

// 4. getTypingBadges awards badges according to progression criteria
it('4. getTypingBadges computes unlocked status based on typing metrics', () => {
  // Test locked badges
  const lockedBadges = getTypingBadges({
    totalTyped: 2,
    correctCount: 2,
    nearMissRescued: 0,
    accuracyRate: 100
  });
  assert.strictEqual(lockedBadges.find(b => b.id === 'typing_scout').unlocked, false);
  assert.strictEqual(lockedBadges.find(b => b.id === 'near_miss_savior').unlocked, false);
  assert.strictEqual(lockedBadges.find(b => b.id === 'flawless_speller').unlocked, false);

  // Test unlocked badges
  const unlockedBadges = getTypingBadges({
    totalTyped: 32,
    correctCount: 28,
    nearMissRescued: 2,
    accuracyRate: 88
  });
  assert.strictEqual(unlockedBadges.find(b => b.id === 'typing_scout').unlocked, true);
  assert.strictEqual(unlockedBadges.find(b => b.id === 'near_miss_savior').unlocked, true);
  assert.strictEqual(unlockedBadges.find(b => b.id === 'flawless_speller').unlocked, true);
  assert.strictEqual(unlockedBadges.find(b => b.id === 'lexical_titan').unlocked, true);
});

// 5. useArenaSprintEngine records typing attempts during live match
it('5. useArenaSprintEngine checkAnswerAction updates typing stats on text_input correct/error', () => {
  resetTypingStats();

  const mockQuestion = {
    id: 'drill_type_1',
    interactionType: 'text_input',
    type: 'spelling',
    correctAnswer: 'maintenance',
    acceptableAnswers: ['maintenance']
  };

  const activeState = {
    phase: ARENA_SPRINT_PHASES.ACTIVE,
    questions: [mockQuestion],
    currentIndex: 0,
    userInputText: 'maintenance',
    score: 0,
    combo: 0,
    maxCombo: 0,
    shieldState: { remaining: 5, total: 5, history: [] },
    hasUsedNearMiss: false
  };

  // Submit correct answer
  const correctState = checkAnswerAction(activeState);
  assert.strictEqual(correctState.isCorrect, true);

  const statsAfterCorrect = getTypingStats();
  assert.strictEqual(statsAfterCorrect.totalTyped, 1);
  assert.strictEqual(statsAfterCorrect.correctCount, 1);

  // Submit rescued near-miss answer
  const rescuedInputState = {
    ...activeState,
    userInputText: 'maintenance',
    hasUsedNearMiss: true // Simulating second attempt after grace window
  };
  checkAnswerAction(rescuedInputState);
  const statsAfterRescue = getTypingStats();
  assert.strictEqual(statsAfterRescue.nearMissRescued, 1);

  // Submit completely wrong answer (2 typos)
  const wrongInputState = {
    ...activeState,
    userInputText: 'mayntinance',
    hasUsedNearMiss: false
  };
  checkAnswerAction(wrongInputState);
  const statsAfterWrong = getTypingStats();
  assert.strictEqual(statsAfterWrong.demons['maintenance'], 1);
});

// 6. useArenaSprintEngine skipQuestionAction records skipped typing word
it('6. useArenaSprintEngine skipQuestionAction records skipped text_input question', () => {
  resetTypingStats();

  const mockQuestion = {
    id: 'drill_type_skip',
    interactionType: 'text_input',
    type: 'spelling',
    correctAnswer: 'conscientious',
    acceptableAnswers: ['conscientious']
  };

  const activeState = {
    phase: ARENA_SPRINT_PHASES.ACTIVE,
    questions: [mockQuestion],
    currentIndex: 0,
    userInputText: '',
    score: 0,
    combo: 0,
    shieldState: { remaining: 5, total: 5, history: [] },
    hasUsedNearMiss: false
  };

  skipQuestionAction(activeState);
  const stats = getTypingStats();
  assert.strictEqual(stats.totalTyped, 1);
  assert.strictEqual(stats.skippedCount, 1);
  assert.strictEqual(stats.demons['conscientious'], 1);
});

// 7. ArenaTextInputCard UI implements mobile ergonomics & keyboard attributes
it('7. ArenaTextInputCard has inputMode, enterKeyHint, clear button, and viewport scroll', () => {
  const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaTextInputCard.jsx'), 'utf-8');
  assert.ok(cardCode.includes('enterKeyHint="go"'), 'Must have enterKeyHint="go"');
  assert.ok(cardCode.includes('inputMode="text"'), 'Must have inputMode="text"');
  assert.ok(cardCode.includes('data-lpignore="true"'), 'Must have data-lpignore="true"');
  assert.ok(cardCode.includes('scrollToInput'), 'Must include scrollToInput helper');
  assert.ok(cardCode.includes('scrollIntoView'), 'Must call scrollIntoView for viewport pinning');
  assert.ok(cardCode.includes('handleClear'), 'Must include handleClear button logic');
  assert.ok(cardCode.includes('SkipForward'), 'Must render Skip button in mobile action bar');
  assert.ok(cardCode.includes('CornerDownLeft'), 'Must render Submit button in mobile action bar');
});

// 8. UserProfileModal UI renders Spelling & Lexical Typing Mastery section
it('8. UserProfileModal renders Spelling & Lexical Typing Mastery with KPI chips and badges', () => {
  const modalCode = fs.readFileSync(path.resolve('src/components/UserProfileModal.jsx'), 'utf-8');
  assert.ok(modalCode.includes('getTypingStats'), 'Must import getTypingStats');
  assert.ok(modalCode.includes('getTopSpellingDemons'), 'Must import getTopSpellingDemons');
  assert.ok(modalCode.includes('getTypingBadges'), 'Must import getTypingBadges');
  assert.ok(modalCode.includes('Spelling & Lexical Typing Mastery'), 'Must display English title');
  assert.ok(modalCode.includes('Chính Tả & Luyện Gõ Arena'), 'Must display Vietnamese title');
  assert.ok(modalCode.includes('typingStats.totalTyped'), 'Must display words typed count');
  assert.ok(modalCode.includes('typingStats.accuracyRate'), 'Must display accuracy rate');
  assert.ok(modalCode.includes('typingStats.nearMissRescued'), 'Must display near-miss rescued count');
  assert.ok(modalCode.includes('topSpellingDemons'), 'Must render top spelling demons');
});

console.log(`\nStep 149 Suite Passed: ${passedTests}/${totalTests} tests successful (100%).\n`);
