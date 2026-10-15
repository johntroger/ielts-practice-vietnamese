import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { 
  skipQuestionAction, 
  nextQuestionAction, 
  retrySprintAction, 
  startSprintAction, 
  ARENA_SPRINT_PHASES 
} from '../src/hooks/useArenaSprintEngine.js';
import { setupKeyboardNavigation } from '../src/utils/keyboardNavigator.js';
import { vi } from '../src/i18n/locales/vi.js';
import { en } from '../src/i18n/locales/en.js';

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
    throw err;
  }
}

console.log('\n--- Running Step 143: Arena Skip Question & Esc Hotkey Tests ---');

// 1. Engine: skipQuestionAction during ACTIVE phase
it('1. skipQuestionAction marks question as skipped, breaks combo, deducts shield, and transitions to review', () => {
  const mockQ = {
    id: 'test_q1',
    prompt: 'What is the synonym of redundant?',
    options: ['Superfluous', 'Essential', 'Crucial', 'Imperative'],
    correctIndex: 0,
    correctAnswer: 'Superfluous'
  };

  const activeState = {
    phase: ARENA_SPRINT_PHASES.ACTIVE,
    questions: [mockQ, { id: 'test_q2' }],
    currentIndex: 0,
    selectedOption: null,
    userInputText: '',
    score: 0,
    combo: 3,
    maxCombo: 3,
    shieldState: { remainingShields: 3, mistakesRecorded: [] },
    isAnswerChecked: false,
    isCorrect: null,
    isSkipped: false
  };

  const result = skipQuestionAction(activeState);

  assert.strictEqual(result.phase, ARENA_SPRINT_PHASES.REVIEWING_ANSWER);
  assert.strictEqual(result.isAnswerChecked, true);
  assert.strictEqual(result.isCorrect, false);
  assert.strictEqual(result.isSkipped, true);
  assert.strictEqual(result.combo, 0, 'Combo streak must be reset to 0');
  assert.strictEqual(result.shieldState.remainingShields, 2, 'One shield must be deducted on skip');
  assert.ok(result.validationResult, 'validationResult must be populated');
  assert.strictEqual(result.validationResult.isSkipped, true);
});

// 2. Engine: skipQuestionAction when remainingShields === 1 transitions to DEFEATED
it('2. skipQuestionAction transitions to DEFEATED when last shield is lost', () => {
  const mockQ = { id: 'test_boss', correctAnswer: 'inevitable' };
  const lastShieldState = {
    phase: ARENA_SPRINT_PHASES.ACTIVE,
    questions: [mockQ],
    currentIndex: 0,
    shieldState: { remainingShields: 1, mistakesRecorded: [] },
    combo: 1,
    isAnswerChecked: false
  };

  const result = skipQuestionAction(lastShieldState);
  assert.strictEqual(result.phase, ARENA_SPRINT_PHASES.DEFEATED);
  assert.strictEqual(result.shieldState.remainingShields, 0);
  assert.strictEqual(result.isSkipped, true);
});

// 3. Engine: skipQuestionAction during REVIEWING_ANSWER acts as nextQuestion
it('3. skipQuestionAction during REVIEWING_ANSWER advances to next question', () => {
  const reviewingState = {
    phase: ARENA_SPRINT_PHASES.REVIEWING_ANSWER,
    questions: [{ id: 'q1' }, { id: 'q2' }],
    currentIndex: 0,
    isAnswerChecked: true,
    isCorrect: false,
    isSkipped: true
  };

  const result = skipQuestionAction(reviewingState);
  assert.strictEqual(result.phase, ARENA_SPRINT_PHASES.ACTIVE);
  assert.strictEqual(result.currentIndex, 1);
  assert.strictEqual(result.isSkipped, false);
  assert.strictEqual(result.isAnswerChecked, false);
});

// 4. Engine: nextQuestionAction and retrySprintAction reset isSkipped
it('4. nextQuestionAction and retrySprintAction cleanly reset isSkipped to false', () => {
  const reviewingState = {
    phase: ARENA_SPRINT_PHASES.REVIEWING_ANSWER,
    questions: [{ id: 'q1' }, { id: 'q2' }],
    currentIndex: 0,
    isSkipped: true
  };

  const nextState = nextQuestionAction(reviewingState);
  assert.strictEqual(nextState.isSkipped, false);

  const defeatedState = {
    phase: ARENA_SPRINT_PHASES.DEFEATED,
    shieldState: { remainingShields: 0, mistakesRecorded: [] },
    isSkipped: true
  };

  const retriedState = retrySprintAction(defeatedState);
  assert.strictEqual(retriedState.isSkipped, false);
});

// 5. UI: ArenaQuestionCard renders Skip button and skipped explanation styling
it('5. ArenaQuestionCard renders Skip button with Esc indicator and amber banner on skip', () => {
  const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');
  assert.ok(cardCode.includes('SkipForward'), 'ArenaQuestionCard imports SkipForward icon');
  assert.ok(cardCode.includes('onSkipQuestion'), 'ArenaQuestionCard accepts onSkipQuestion prop');
  assert.ok(cardCode.includes('isSkipped'), 'ArenaQuestionCard accepts isSkipped prop');
  assert.ok(cardCode.includes('arena.skipQuestion'), 'ArenaQuestionCard uses i18n skipQuestion key');
  assert.ok(cardCode.includes('arena.questionSkipped'), 'ArenaQuestionCard uses i18n questionSkipped key');
  assert.ok(cardCode.includes('bg-amber-950/30 border-amber-800/50 text-amber-300'), 'Uses amber banner when isSkipped');
});

// 6. UI: ArenaTextInputCard handles Escape key and renders skipped notice
it('6. ArenaTextInputCard handles Escape key in handleKeyDown and displays skipped state', () => {
  const inputCardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaTextInputCard.jsx'), 'utf-8');
  assert.ok(inputCardCode.includes("e.key === 'Escape'"), 'ArenaTextInputCard listens to Escape key');
  assert.ok(inputCardCode.includes('onSkip'), 'ArenaTextInputCard accepts onSkip prop');
  assert.ok(inputCardCode.includes('Question skipped without input'), 'Displays skipped message when skipped without text');
});

// 7. UI: AtlasEnglishArenaModal wires handleSkipQuestion and keyboard onSkip
it('7. AtlasEnglishArenaModal wires handleSkipQuestion to onSkip and passes to ArenaQuestionCard', () => {
  const modalCode = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
  assert.ok(modalCode.includes('const handleSkipQuestion = useCallback('), 'Defines handleSkipQuestion callback');
  assert.ok(modalCode.includes('sprint.skipQuestion()'), 'Calls sprint.skipQuestion() on skip');
  assert.ok(modalCode.includes('onSkipQuestion={handleSkipQuestion}'), 'Passes onSkipQuestion to ArenaQuestionCard');
  assert.ok(modalCode.includes('isSkipped={sprint.isSkipped}'), 'Passes isSkipped to ArenaQuestionCard');
});

// 8. Keyboard Navigation: Escape key triggers onSkip even when typing in input
it('8. keyboardNavigator triggers onSkip on Escape key even when typing inside INPUT', () => {
  let skipCalled = false;
  const listeners = {};
  global.window = {
    addEventListener: (evt, fn) => { listeners[evt] = fn; },
    removeEventListener: (evt) => { delete listeners[evt]; }
  };

  const cleanup = setupKeyboardNavigation({
    onSkip: () => { skipCalled = true; },
    isActive: true
  });

  // Press Escape while focused on an input element
  let defaultPrevented = false;
  listeners.keydown({
    key: 'Escape',
    preventDefault: () => { defaultPrevented = true; },
    target: { tagName: 'INPUT' }
  });

  assert.strictEqual(skipCalled, true, 'Escape must invoke onSkip even when focused inside INPUT');
  assert.strictEqual(defaultPrevented, true, 'Escape must prevent default');

  cleanup();
  delete global.window;
});

// 9. i18n Localization: vi.js and en.js contain skip translations
it('9. vi.js and en.js contain accurate bilingual keys for skipQuestion and questionSkipped', () => {
  assert.ok(vi.arena.skipQuestion, 'vi.js contains arena.skipQuestion');
  assert.ok(vi.arena.questionSkipped, 'vi.js contains arena.questionSkipped');
  assert.ok(en.arena.skipQuestion, 'en.js contains arena.skipQuestion');
  assert.ok(en.arena.questionSkipped, 'en.js contains arena.questionSkipped');
});

console.log(`\nAll ${passedTests}/${totalTests} Step 143 tests PASSED successfully!\n`);
