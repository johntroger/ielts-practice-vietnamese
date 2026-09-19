import {
  normalizeAnswer,
  countIeltsWords,
  extractWordLimit,
  validateWordLimit,
  expandOptionalBrackets,
  canonicalizeIELTSAnswer,
  diagnoseQuestionAnswer,
  scoreListeningExam
} from '../src/utils/listeningScorer.js';

console.log('====================================================');
console.log('TEST SUITE: STEP 3 - CAMBRIDGE LISTENING SCORING ENGINE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (details) console.error(`   Details: ${details}`);
  }
}

// ----------------------------------------------------
// TEST 1: IELTS Word Count & Hyphenated Compounds
// ----------------------------------------------------
console.log('--- 1. Testing Word Counting & Hyphenated Compounds ---');
assert(countIeltsWords('library') === 1, 'Single word counts as 1');
assert(countIeltsWords('state-of-the-art') === 1, 'Hyphenated compound word "state-of-the-art" counts as 1 word');
assert(countIeltsWords('twenty-one') === 1, '"twenty-one" counts as 1 word');
assert(countIeltsWords('twenty one books') === 3, '"twenty one books" counts as 3 words');
assert(countIeltsWords('') === 0, 'Empty string counts as 0');

// ----------------------------------------------------
// TEST 2: Extracting Word Limit from Instructions
// ----------------------------------------------------
console.log('\n--- 2. Testing Word Limit Extraction ---');
const limit1 = extractWordLimit('Write ONE WORD ONLY for each answer.');
assert(limit1.maxWords === 1 && !limit1.allowNumber, 'ONE WORD ONLY extracts maxWords: 1');

const limit2 = extractWordLimit('Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.');
assert(limit2.maxWords === 2 && limit2.allowNumber, 'NO MORE THAN TWO WORDS AND/OR A NUMBER extracts maxWords: 2 and allowNumber: true');

const limit3 = extractWordLimit('Write NO MORE THAN THREE WORDS for each answer.');
assert(limit3.maxWords === 3, 'NO MORE THAN THREE WORDS extracts maxWords: 3');

// ----------------------------------------------------
// TEST 3: Word Limit Validation & Enforcement
// ----------------------------------------------------
console.log('\n--- 3. Testing Word Limit Violation Enforcement ---');
const v1 = validateWordLimit('public central library', 'Write NO MORE THAN TWO WORDS for each answer.');
assert(v1.isValid === false, 'Writing 3 words when instruction is TWO WORDS triggers violation');
assert(v1.userWordCount === 3, 'Calculates user word count: 3');

const v2 = validateWordLimit('central library', 'Write NO MORE THAN TWO WORDS for each answer.');
assert(v2.isValid === true, 'Writing 2 words complies with TWO WORDS limit');

const v3 = validateWordLimit('a car', 'Write ONE WORD ONLY for each answer.');
assert(v3.isValid === false, 'Writing 2 words for ONE WORD ONLY triggers violation');

// ----------------------------------------------------
// TEST 4: Optional Brackets Expansion
// ----------------------------------------------------
console.log('\n--- 4. Testing Optional Brackets Expansion in Keys ---');
const exp1 = expandOptionalBrackets('(a) library');
assert(exp1.includes('library') && exp1.includes('a library'), 'Expands "(a) library" into ["library", "a library"]');

const exp2 = expandOptionalBrackets('car(s)');
assert(exp2.includes('car') && exp2.includes('cars'), 'Expands "car(s)" into ["car", "cars"]');

const exp3 = expandOptionalBrackets('(in) July');
assert(exp3.includes('july') && exp3.includes('in july'), 'Expands "(in) July" into ["july", "in july"]');

// ----------------------------------------------------
// TEST 5: Question Diagnosis with Word Limit & Diagnostics
// ----------------------------------------------------
console.log('\n--- 5. Testing Question Diagnosis & Diagnostic Categories ---');

// Case 5.1: Word Limit Violation (Candidate writes 3 words for 2-word limit)
const qLimit = {
  id: 'q1',
  order: 1,
  answer: 'local library',
  instruction: 'Write NO MORE THAN TWO WORDS for each answer.'
};
const diagLimit = diagnoseQuestionAnswer(qLimit, 'the local library', qLimit.instruction);
assert(diagLimit.status === 'WORD_LIMIT_ERROR', 'Exceeding word limit produces WORD_LIMIT_ERROR');
assert(diagLimit.isCorrect === false, 'Word limit error results in 0 points (isCorrect === false)');
assert(diagLimit.badgeLabel.includes('Quá số từ'), 'Badge label indicates "Quá số từ"');

// Case 5.2: Bracketed Key Matching
const qBracket = {
  id: 'q2',
  order: 2,
  answer: '(a) library'
};
const diagBracket1 = diagnoseQuestionAnswer(qBracket, 'library');
assert(diagBracket1.status === 'CORRECT' && diagBracket1.isCorrect === true, '"library" matches "(a) library"');

const diagBracket2 = diagnoseQuestionAnswer(qBracket, 'a library');
assert(diagBracket2.status === 'CORRECT' && diagBracket2.isCorrect === true, '"a library" matches "(a) library"');

// Case 5.3: Plural Discrepancy
const qPlural = {
  id: 'q3',
  order: 3,
  answer: 'vessels'
};
const diagPlural = diagnoseQuestionAnswer(qPlural, 'vessel');
assert(diagPlural.status === 'PLURAL_ERROR', 'Missing -s produces PLURAL_ERROR');

// Case 5.4: Stem Repetition
const qStem = {
  id: 'q4',
  order: 4,
  answer: 'station',
  prefixText: 'next to the train'
};
const diagStem = diagnoseQuestionAnswer(qStem, 'train station');
assert(diagStem.status === 'STEM_REPETITION_ERROR', 'Repeating prefix word produces STEM_REPETITION_ERROR');

// Case 5.5: Spelling Mistake
const qSpell = {
  id: 'q5',
  order: 5,
  answer: 'restaurant'
};
const diagSpell = diagnoseQuestionAnswer(qSpell, 'resturant');
assert(diagSpell.status === 'SPELLING_ERROR', 'Minor spelling typo produces SPELLING_ERROR');

// Case 5.6: Unanswered
const diagUnanswered = diagnoseQuestionAnswer(qSpell, '');
assert(diagUnanswered.status === 'UNANSWERED', 'Empty answer produces UNANSWERED');

// ----------------------------------------------------
// TEST 6: Full Listening Exam Scoring Simulation
// ----------------------------------------------------
console.log('\n--- 6. Testing Full Listening Exam Scoring Simulation ---');

const mockListeningTest = {
  id: 'cam-18-test-1',
  title: 'Cambridge IELTS 18 Test 1 Listening',
  parts: [
    {
      partNumber: 1,
      title: 'Part 1',
      questionGroups: [
        {
          type: 'note_completion',
          instruction: 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
          questions: [
            { order: 1, id: 'q1', answer: 'central library' },
            { order: 2, id: 'q2', answer: '35 pounds' },
            { order: 3, id: 'q3', answer: 'green park' },
            { order: 4, id: 'q4', answer: 'vessels' },
            { order: 5, id: 'q5', answer: 'telephone' }
          ]
        }
      ]
    },
    {
      partNumber: 2,
      title: 'Part 2',
      questionGroups: [
        {
          type: 'multiple_choice',
          questions: [
            { order: 6, id: 'q6', answer: 'B' },
            { order: 7, id: 'q7', answer: 'A' },
            { order: 8, id: 'q8', answer: 'C' },
            { order: 9, id: 'q9', answer: 'B' },
            { order: 10, id: 'q10', answer: 'D' }
          ]
        }
      ]
    }
  ]
};

const userAnswers = {
  1: 'central library',             // CORRECT
  2: '£35',                        // CORRECT (canonical currency)
  3: 'the big green park',         // WORD_LIMIT_ERROR (3 words > 2 words limit!)
  4: 'vessel',                     // PLURAL_ERROR (missing -s)
  5: 'telephon',                   // SPELLING_ERROR
  6: 'B',                          // CORRECT
  7: 'A',                          // CORRECT
  8: 'A',                          // WRONG_ANSWER
  9: 'B'                           // CORRECT
  // 10 is UNANSWERED
};

const scoredExam = scoreListeningExam({
  testData: mockListeningTest,
  userAnswers,
  timeSpentSeconds: 1800
});

assert(scoredExam.correctCount === 5, 'Correct count is 5 out of 10 (Got: ' + scoredExam.correctCount + ')');
assert(scoredExam.errorBreakdown.CORRECT === 5, 'errorBreakdown.CORRECT === 5');
assert(scoredExam.errorBreakdown.WORD_LIMIT_ERROR === 1, 'errorBreakdown.WORD_LIMIT_ERROR === 1');
assert(scoredExam.errorBreakdown.PLURAL_ERROR === 1, 'errorBreakdown.PLURAL_ERROR === 1');
assert(scoredExam.errorBreakdown.SPELLING_ERROR === 1, 'errorBreakdown.SPELLING_ERROR === 1');
assert(scoredExam.errorBreakdown.WRONG_ANSWER === 1, 'errorBreakdown.WRONG_ANSWER === 1');
assert(scoredExam.errorBreakdown.UNANSWERED === 1, 'errorBreakdown.UNANSWERED === 1');
assert(typeof scoredExam.band === 'number' && scoredExam.band >= 4.0, 'Calculates valid band score: ' + scoredExam.band);

console.log('\n====================================================');
console.log(`RESULTS: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}
