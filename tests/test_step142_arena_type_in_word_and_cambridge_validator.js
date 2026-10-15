import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { 
  normalizeCambridgeString, 
  isAnswerAcceptable, 
  generateVisualDiff 
} from '../src/services/gamification/cambridgeAnswerValidator.js';
import { 
  adaptSpellingTrap, 
  adaptListeningSpellingDrill, 
  generateArenaSprintQuestions 
} from '../src/adapters/sprintQuestionAdapter.js';
import { 
  setUserInputTextAction, 
  checkAnswerAction, 
  nextQuestionAction, 
  retrySprintAction, 
  ARENA_SPRINT_PHASES 
} from '../src/hooks/useArenaSprintEngine.js';

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

console.log('\n--- Running Step 142: Type-in Word Exercise & Cambridge Answer Validator Tests ---');

// 1. Cambridge Answer Validator: String Normalization
it('1. normalizeCambridgeString cleans whitespace, punctuation, and casing', () => {
  assert.strictEqual(normalizeCambridgeString('  Accommodation!  '), 'accommodation');
  assert.strictEqual(normalizeCambridgeString('twenty-four'), 'twenty four');
  assert.strictEqual(normalizeCambridgeString('Dr. Smith, M.D.'), 'dr smith md');
  assert.strictEqual(normalizeCambridgeString('Café'), 'cafe');
});

// 2. Cambridge Answer Validator: UK/US Parity & Currency/Number Normalization
it('2. isAnswerAcceptable recognizes UK/US spelling variants and currency/number forms', () => {
  // UK / US spelling variants
  assert.strictEqual(isAnswerAcceptable('color', ['colour']), true);
  assert.strictEqual(isAnswerAcceptable('organise', ['organize']), true);
  assert.strictEqual(isAnswerAcceptable('theater', ['theatre']), true);
  assert.strictEqual(isAnswerAcceptable('traveled', ['travelled']), true);
  assert.strictEqual(isAnswerAcceptable('program', ['programme']), true);

  // Number words vs digits
  assert.strictEqual(isAnswerAcceptable('twenty four', ['24']), true);
  assert.strictEqual(isAnswerAcceptable('24', ['twenty four']), true);
  assert.strictEqual(isAnswerAcceptable('15', ['fifteen']), true);

  // Currencies
  assert.strictEqual(isAnswerAcceptable('50 pounds', ['£50']), true);
  assert.strictEqual(isAnswerAcceptable('£50', ['50 pounds']), true);
  assert.strictEqual(isAnswerAcceptable('$100', ['100 dollars']), true);
});

// 3. Cambridge Answer Validator: Strict Spelling Mode for Spelling Demons
it('3. isAnswerAcceptable strictly rejects misspelled words in strictSpelling mode', () => {
  // Common IELTS traps must NOT be forgiven when strictSpelling is true
  assert.strictEqual(isAnswerAcceptable('accomodation', ['accommodation'], { strictSpelling: true }), false);
  assert.strictEqual(isAnswerAcceptable('embarass', ['embarrass'], { strictSpelling: true }), false);
  assert.strictEqual(isAnswerAcceptable('definately', ['definitely'], { strictSpelling: true }), false);
  assert.strictEqual(isAnswerAcceptable('seperate', ['separate'], { strictSpelling: true }), false);

  // Correct spelling passes
  assert.strictEqual(isAnswerAcceptable('accommodation', ['accommodation'], { strictSpelling: true }), true);
  assert.strictEqual(isAnswerAcceptable('  ACCOMMODATION  ', ['accommodation'], { strictSpelling: true }), true);
});

// 4. Cambridge Answer Validator: Visual Character Diffing
it('4. generateVisualDiff generates exact match, insert, and delete tokens for feedback', () => {
  const perfectDiff = generateVisualDiff('accommodation', 'accommodation');
  assert.ok(perfectDiff.every(token => token.type === 'match'));

  const typoDiff = generateVisualDiff('accomodation', 'accommodation');
  assert.ok(typoDiff.some(token => token.type === 'wrong' || token.type === 'missing' || token.type === 'extra'));

  // Test empty input diff
  const emptyDiff = generateVisualDiff('', 'word');
  assert.ok(emptyDiff.some(token => token.type === 'missing'));
});

// 5. Adapter: adaptSpellingTrap assigns interactionType: text_input
it('5. adaptSpellingTrap sets interactionType: text_input and acceptableAnswers while preserving options', () => {
  const sample = {
    id: 'sp-test-1',
    word: 'millennium',
    correct: 'millennium',
    distractors: ['millenium', 'milennium', 'milenium'],
    contextSentence: 'The dawn of the new millennium brought rapid technological advances.',
    explanationEn: '"millennium" has double l and double n.'
  };

  const adapted = adaptSpellingTrap(sample);
  assert.strictEqual(adapted.interactionType, 'text_input');
  assert.strictEqual(adapted.strictSpelling, true);
  assert.deepStrictEqual(adapted.acceptableAnswers, ['millennium']);
  assert.strictEqual(adapted.correctAnswer, 'millennium');
  assert.strictEqual(adapted.options.length, 4);
});

// 6. Adapter: adaptListeningSpellingDrill generates type-in audio questions
it('6. adaptListeningSpellingDrill generates authentic listening type-in question', () => {
  const sample = {
    id: 'ldrill-spell-test',
    type: 'listening-spelling',
    promptAudioText: 'The street name is R-A-V-E-N-S-B-O-U-R-N-E Crescent.',
    correctAnswer: 'Ravensbourne',
    acceptableAnswers: ['Ravensbourne', 'ravensbourne'],
    explanation: 'The speaker spells out Ravensbourne.'
  };

  const adapted = adaptListeningSpellingDrill(sample);
  assert.strictEqual(adapted.type, 'listening_spelling');
  assert.strictEqual(adapted.interactionType, 'text_input');
  assert.strictEqual(adapted.strictSpelling, true);
  assert.strictEqual(adapted.correctAnswer, 'Ravensbourne');
  assert.ok(adapted.audioText.length > 0);
  assert.ok(adapted.acceptableAnswers.includes('Ravensbourne'));
});

// 7. Adapter: generateArenaSprintQuestions includes type_in questions in sprint
it('7. generateArenaSprintQuestions incorporates interactive text_input questions', () => {
  const questions = generateArenaSprintQuestions({ count: 7, recordHistory: false });
  assert.strictEqual(questions.length, 7);
  const textInputQuestions = questions.filter(q => q.interactionType === 'text_input');
  assert.ok(textInputQuestions.length >= 1, 'Should include at least 1 interactive text-input question in standard sprint');
});

// 8. Engine State Machine: setUserInputTextAction updates userInputText
it('8. setUserInputTextAction cleanly updates state.userInputText', () => {
  const initialState = {
    phase: ARENA_SPRINT_PHASES.ACTIVE,
    userInputText: ''
  };

  const updated = setUserInputTextAction(initialState, 'accommodate');
  assert.strictEqual(updated.userInputText, 'accommodate');
});

// 9. Engine State Machine: checkAnswerAction validates text_input correctly
it('9. checkAnswerAction validates text_input using Cambridge validator and generates diff', () => {
  const mockTextInputQ = {
    id: 'spelling_test',
    type: 'spelling',
    interactionType: 'text_input',
    strictSpelling: true,
    acceptableAnswers: ['millennium'],
    correctAnswer: 'millennium'
  };

  const activeState = {
    phase: ARENA_SPRINT_PHASES.ACTIVE,
    questions: [mockTextInputQ],
    currentIndex: 0,
    selectedOption: null,
    userInputText: 'millennium',
    score: 0,
    combo: 0,
    maxCombo: 0,
    shieldState: { remainingShields: 3, mistakesRecorded: [] }
  };

  // Correct answer
  const correctResult = checkAnswerAction(activeState);
  assert.strictEqual(correctResult.isCorrect, true);
  assert.strictEqual(correctResult.score, 1);
  assert.strictEqual(correctResult.combo, 1);
  assert.strictEqual(correctResult.phase, ARENA_SPRINT_PHASES.REVIEWING_ANSWER);
  assert.ok(correctResult.validationResult);
  assert.strictEqual(correctResult.validationResult.isCorrect, true);

  // Incorrect answer (penalized path when grace exhausted)
  const wrongState = {
    ...activeState,
    userInputText: 'millenium',
    hasUsedNearMiss: true
  };
  const wrongResult = checkAnswerAction(wrongState);
  assert.strictEqual(wrongResult.isCorrect, false);
  assert.strictEqual(wrongResult.score, 0);
  assert.strictEqual(wrongResult.combo, 0);
  assert.strictEqual(wrongResult.shieldState.remainingShields, 2);
  assert.ok(wrongResult.validationResult.diff.length > 0);
});

// 10. Engine State Machine: nextQuestionAction and retrySprintAction reset text input
it('10. nextQuestionAction and retrySprintAction reset userInputText and validationResult', () => {
  const reviewingState = {
    phase: ARENA_SPRINT_PHASES.REVIEWING_ANSWER,
    questions: [{ id: 'q1' }, { id: 'q2' }],
    currentIndex: 0,
    userInputText: 'typed answer',
    validationResult: { isCorrect: true },
    isAnswerChecked: true
  };

  const nextState = nextQuestionAction(reviewingState);
  assert.strictEqual(nextState.currentIndex, 1);
  assert.strictEqual(nextState.userInputText, '');
  assert.strictEqual(nextState.validationResult, null);
  assert.strictEqual(nextState.isAnswerChecked, false);

  const defeatedState = {
    phase: ARENA_SPRINT_PHASES.DEFEATED,
    shieldState: { remainingShields: 0, mistakesRecorded: [] },
    userInputText: 'leftover',
    validationResult: { isCorrect: false }
  };
  const retriedState = retrySprintAction(defeatedState);
  assert.strictEqual(retriedState.userInputText, '');
  assert.strictEqual(retriedState.validationResult, null);
});

// 11. UI Integration: ArenaTextInputCard and ArenaQuestionCard
it('11. ArenaTextInputCard has anti-autocorrect attributes and ArenaQuestionCard embeds it', () => {
  const inputCardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaTextInputCard.jsx'), 'utf-8');
  assert.ok(inputCardCode.includes('autoComplete="off"'));
  assert.ok(inputCardCode.includes('autoCorrect="off"'));
  assert.ok(inputCardCode.includes('autoCapitalize="none"'));
  assert.ok(inputCardCode.includes('spellCheck={false}'));
  assert.ok(inputCardCode.includes('inputRef.current.focus()'));
  assert.ok(inputCardCode.includes('value={activeValue}'));
  assert.ok(inputCardCode.includes('onChange={(e) => activeChange?.(e.target.value)}'));

  const questionCardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');
  assert.ok(questionCardCode.includes('ArenaTextInputCard'));
  assert.ok(questionCardCode.includes('isTextInput ?'));
  assert.ok(questionCardCode.includes('disabled={isTextInput ? !userInputText?.trim() : selectedOption === null}'));

  const modalCode = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
  assert.ok(modalCode.includes('userInputText={sprint.userInputText}'));
  assert.ok(modalCode.includes('onUserInputChange={sprint.setUserInputText}'));
  assert.ok(modalCode.includes('validationResult={sprint.validationResult}'));
});

console.log(`\nAll ${passedTests}/${totalTests} Step 142 tests PASSED successfully!\n`);
