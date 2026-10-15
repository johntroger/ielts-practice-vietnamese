/**
 * tests/test_step148_arena_unikey_and_near_miss_grace.js
 * 
 * Verifies Phase 2 Upgrades:
 * 1. Smart Unikey / Vietnamese IME Artifacts Cleaner (cleanVietnameseImeArtifacts).
 * 2. IME-tolerant answer acceptance for learners typing with Telex/VNI enabled.
 * 3. Exact Levenshtein distance calculation for spelling precision.
 * 4. Near-Miss detection (distance === 1).
 * 5. State Machine Grace Window (protects combo & shields on first 1-character typo).
 * 6. UI Integration in ArenaTextInputCard and ArenaQuestionCard.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  normalizeCambridgeString,
  cleanVietnameseImeArtifacts,
  calculateLevenshteinDistance,
  isNearMissAnswer,
  isAnswerAcceptable 
} from '../src/services/gamification/cambridgeAnswerValidator.js';
import { 
  checkAnswerAction, 
  skipQuestionAction,
  nextQuestionAction,
  retrySprintAction,
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

console.log('\n--- Running Step 148: Unikey IME Filter & Near-Miss Grace Window Tests ---');

// 1. cleanVietnameseImeArtifacts cleans Telex / VNI artifacts
it('1. cleanVietnameseImeArtifacts correctly converts ư->w, đ->d/dd, and removes accents', () => {
  assert.strictEqual(cleanVietnameseImeArtifacts('ưednesday'), 'wednesday');
  assert.strictEqual(cleanVietnameseImeArtifacts('ưhat'), 'what');
  assert.strictEqual(cleanVietnameseImeArtifacts('đay'), 'day');
  assert.strictEqual(cleanVietnameseImeArtifacts('ađress', true), 'address');
  assert.strictEqual(cleanVietnameseImeArtifacts('cômmittêe'), 'committee');
  assert.strictEqual(cleanVietnameseImeArtifacts('bâzaar'), 'bazaar');
});

// 2. isAnswerAcceptable accepts answers typed with Unikey enabled
it('2. isAnswerAcceptable accepts words typed with Unikey/Telex enabled', () => {
  assert.strictEqual(isAnswerAcceptable('ưednesday', ['Wednesday']), true);
  assert.strictEqual(isAnswerAcceptable('ađress', ['address']), true);
  assert.strictEqual(isAnswerAcceptable('cômmittêe', ['committee']), true);
  assert.strictEqual(isAnswerAcceptable('envirônment', ['environment']), true);
});

// 3. calculateLevenshteinDistance accurately computes edit distance
it('3. calculateLevenshteinDistance computes accurate character edit distance', () => {
  assert.strictEqual(calculateLevenshteinDistance('Wednesday', 'Wednesday'), 0);
  assert.strictEqual(calculateLevenshteinDistance('Wednesda', 'Wednesday'), 1); // 1 deletion
  assert.strictEqual(calculateLevenshteinDistance('Wednesdayy', 'Wednesday'), 1); // 1 insertion
  assert.strictEqual(calculateLevenshteinDistance('Wednesdsy', 'Wednesday'), 1); // 1 substitution
  assert.strictEqual(calculateLevenshteinDistance('Wensday', 'Wednesday'), 2); // 2 edits
  assert.strictEqual(calculateLevenshteinDistance('Monday', 'Wednesday'), 5);
});

// 4. isNearMissAnswer detects distance === 1 including IME tolerance
it('4. isNearMissAnswer detects distance === 1 including IME tolerance', () => {
  const miss1 = isNearMissAnswer('Wednesda', ['Wednesday']);
  assert.strictEqual(miss1.isNearMiss, true);
  assert.strictEqual(miss1.minDistance, 1);
  assert.strictEqual(miss1.closestTarget, 'wednesday');

  // Typo with Unikey ư: "ưednesda" -> cleaned to "wednesda" (dist 1)
  const missIme = isNearMissAnswer('ưednesda', ['Wednesday']);
  assert.strictEqual(missIme.isNearMiss, true);
  assert.strictEqual(missIme.minDistance, 1);

  // Exact match is NOT a near-miss
  const exact = isNearMissAnswer('Wednesday', ['Wednesday']);
  assert.strictEqual(exact.isNearMiss, false);
  assert.strictEqual(exact.minDistance, 0);

  // Dist 2 is NOT a near-miss
  const dist2 = isNearMissAnswer('Wensday', ['Wednesday']);
  assert.strictEqual(dist2.isNearMiss, false);
  assert.strictEqual(dist2.minDistance, 2);
});

// 5. checkAnswerAction activates Near-Miss grace window on 1st typo without penalty
it('5. checkAnswerAction grants Near-Miss grace retry without deducting shields or breaking combo', () => {
  const activeState = {
    phase: ARENA_SPRINT_PHASES.ACTIVE,
    questions: [{
      id: 'sp-58',
      interactionType: 'text_input',
      type: 'spelling',
      correctAnswer: 'Wednesday',
      acceptableAnswers: ['Wednesday']
    }],
    currentIndex: 0,
    userInputText: 'Wednesda', // 1 character missing
    hasUsedNearMiss: false,
    nearMissState: null,
    isAnswerChecked: false,
    score: 3,
    combo: 3,
    maxCombo: 3,
    shieldState: { remainingShields: 3, mistakesRecorded: [] }
  };

  const graceState = checkAnswerAction(activeState);

  // Must STAY in ACTIVE phase, shields & combo must NOT be deducted
  assert.strictEqual(graceState.phase, ARENA_SPRINT_PHASES.ACTIVE);
  assert.strictEqual(graceState.isAnswerChecked, false);
  assert.strictEqual(graceState.hasUsedNearMiss, true);
  assert.ok(graceState.nearMissState && graceState.nearMissState.isNearMiss === true);
  assert.strictEqual(graceState.shieldState.remainingShields, 3);
  assert.strictEqual(graceState.combo, 3);
  assert.strictEqual(graceState.score, 3);

  // Attempt 2: User fixes the typo to "Wednesday"
  const correctedState = {
    ...graceState,
    userInputText: 'Wednesday'
  };
  const solvedState = checkAnswerAction(correctedState);
  assert.strictEqual(solvedState.phase, ARENA_SPRINT_PHASES.REVIEWING_ANSWER);
  assert.strictEqual(solvedState.isCorrect, true);
  assert.strictEqual(solvedState.score, 4);
  assert.strictEqual(solvedState.combo, 4);
  assert.strictEqual(solvedState.shieldState.remainingShields, 3);
  assert.strictEqual(solvedState.nearMissState, null);
});

// 6. checkAnswerAction penalizes if 2nd attempt fails after Near-Miss
it('6. checkAnswerAction penalizes if 2nd attempt fails after Near-Miss grace window', () => {
  const graceUsedState = {
    phase: ARENA_SPRINT_PHASES.ACTIVE,
    questions: [{
      id: 'sp-58',
      interactionType: 'text_input',
      type: 'spelling',
      correctAnswer: 'Wednesday',
      acceptableAnswers: ['Wednesday']
    }],
    currentIndex: 0,
    userInputText: 'Wednesdsy', // still 1 typo, but grace already used!
    hasUsedNearMiss: true,
    nearMissState: { isNearMiss: true },
    isAnswerChecked: false,
    score: 2,
    combo: 2,
    shieldState: { remainingShields: 3, mistakesRecorded: [] }
  };

  const failedState = checkAnswerAction(graceUsedState);
  assert.strictEqual(failedState.phase, ARENA_SPRINT_PHASES.REVIEWING_ANSWER);
  assert.strictEqual(failedState.isCorrect, false);
  assert.strictEqual(failedState.combo, 0); // combo broken
  assert.strictEqual(failedState.shieldState.remainingShields, 2); // shield deducted
  assert.strictEqual(failedState.nearMissState, null);
});

// 7. Transitions cleanly reset nearMissState and hasUsedNearMiss
it('7. nextQuestionAction and retrySprintAction reset near-miss flags', () => {
  const reviewing = {
    phase: ARENA_SPRINT_PHASES.REVIEWING_ANSWER,
    questions: [{ id: 'q1' }, { id: 'q2' }],
    currentIndex: 0,
    nearMissState: { isNearMiss: true },
    hasUsedNearMiss: true
  };
  const next = nextQuestionAction(reviewing);
  assert.strictEqual(next.nearMissState, null);
  assert.strictEqual(next.hasUsedNearMiss, false);

  const defeated = {
    phase: ARENA_SPRINT_PHASES.DEFEATED,
    shieldState: { remainingShields: 0 },
    nearMissState: { isNearMiss: true },
    hasUsedNearMiss: true
  };
  const retried = retrySprintAction(defeated);
  assert.strictEqual(retried.nearMissState, null);
  assert.strictEqual(retried.hasUsedNearMiss, false);
});

// 8. UI Integration in ArenaTextInputCard & ArenaQuestionCard
it('8. UI components properly embed nearMissState banner and amber glowing styling', () => {
  const inputCode = fs.readFileSync(path.resolve('src/components/arena/ArenaTextInputCard.jsx'), 'utf-8');
  assert.ok(inputCode.includes('nearMissState'), 'ArenaTextInputCard must accept nearMissState');
  assert.ok(inputCode.includes('Almost there!'), 'Must include near-miss banner text');
  assert.ok(inputCode.includes('Suýt đúng rồi!'), 'Must include Vietnamese banner text');
  assert.ok(inputCode.includes('border-amber-500'), 'Must include amber border on near-miss');
  assert.ok(inputCode.includes('inputRef.current.select()'), 'Must select text on near miss');

  const qCardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');
  assert.ok(qCardCode.includes('nearMissState'), 'ArenaQuestionCard must handle nearMissState');
  assert.ok(qCardCode.includes('nearMissState={nearMissState}'), 'Must pass nearMissState to child');

  const modalCode = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
  assert.ok(modalCode.includes('isNearMissAnswer'), 'AtlasEnglishArenaModal must import isNearMissAnswer');
  assert.ok(modalCode.includes('nearMissState={sprint.nearMissState}'), 'AtlasEnglishArenaModal must pass nearMissState');
});

console.log(`\nAll ${passedTests}/${totalTests} Step 148 tests PASSED successfully!\n`);
