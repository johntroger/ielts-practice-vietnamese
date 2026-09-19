import {
  normalizeReadingAnswer,
  extractWordLimit,
  countIeltsWords,
  expandOptionalBrackets,
  matchFlexibleTFNG,
  matchRomanNumerals,
  diagnoseReadingQuestion,
  scoreReadingExam
} from '../src/utils/readingScorer.js';

console.log('====================================================');
console.log('TEST SUITE: STEP 1 - CAMBRIDGE READING SCORING ENGINE');
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
// TEST 1: Flexible T/F/NG and Y/N/NG Mapping
// ----------------------------------------------------
console.log('--- 1. Testing Flexible T/F/NG and Y/N/NG ---');

const qTF = { id: 1, order: 1, type: 'true_false_not_given', answer: 'TRUE' };
const resT1 = diagnoseReadingQuestion(qTF, 'T');
assert(resT1.isCorrect && resT1.status === 'CORRECT', 'Abbreviation "T" matches "TRUE"');

const resT2 = diagnoseReadingQuestion(qTF, 'true');
assert(resT2.isCorrect && resT2.status === 'CORRECT', 'Lowercase "true" matches "TRUE"');

const qNG = { id: 2, order: 2, type: 'true_false_not_given', answer: 'NOT GIVEN' };
const resNG = diagnoseReadingQuestion(qNG, 'ng');
assert(resNG.isCorrect && resNG.status === 'CORRECT', 'Abbreviation "ng" matches "NOT GIVEN"');

const qYN = { id: 3, order: 3, type: 'yes_no_not_given', answer: 'YES' };
const resY = diagnoseReadingQuestion(qYN, 'y');
assert(resY.isCorrect && resY.status === 'CORRECT', 'Abbreviation "y" matches "YES"');

const resCross = diagnoseReadingQuestion(qYN, 'TRUE');
assert(resCross.isCorrect && resCross.diagnosticMessage.includes('Lưu ý quy cách làm bài'), 'Cross-match TRUE for YES marks correct with warning');

const resWrongTF = diagnoseReadingQuestion(qTF, 'FALSE');
assert(!resWrongTF.isCorrect && resWrongTF.status === 'WRONG_ANSWER', 'Wrong TF value marked as WRONG_ANSWER');

// ----------------------------------------------------
// TEST 2: Word Limit Violation Enforcement
// ----------------------------------------------------
console.log('\n--- 2. Testing Word Limit Violations ---');

const qWordLimit = {
  id: 4,
  order: 4,
  type: 'summary_completion',
  answer: 'ancient vessels',
  instruction: 'Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage.'
};

const resExceeded = diagnoseReadingQuestion(qWordLimit, 'ancient roman vessels', qWordLimit.instruction);
assert(
  !resExceeded.isCorrect && resExceeded.status === 'WORD_LIMIT_ERROR',
  'Writing 3 words when instruction is NO MORE THAN TWO WORDS triggers WORD_LIMIT_ERROR (0 pts)',
  `Status: ${resExceeded.status}, msg: ${resExceeded.diagnosticMessage}`
);

const resExactWords = diagnoseReadingQuestion(qWordLimit, 'ancient vessels', qWordLimit.instruction);
assert(
  resExactWords.isCorrect && resExactWords.status === 'CORRECT',
  'Writing 2 words complies with NO MORE THAN TWO WORDS'
);

const qOneWord = {
  id: 5,
  order: 5,
  type: 'sentence_completion',
  answer: 'conservation',
  instruction: 'Choose ONE WORD ONLY from the passage.'
};
const resOneWordFail = diagnoseReadingQuestion(qOneWord, 'good conservation', qOneWord.instruction);
assert(
  !resOneWordFail.isCorrect && resOneWordFail.status === 'WORD_LIMIT_ERROR',
  'Writing 2 words for ONE WORD ONLY triggers WORD_LIMIT_ERROR'
);

// Cambridge Hyphen Rule: "Hyphenated words count as single words"
assert(countIeltsWords('state-of-the-art') === 1, 'Hyphenated compound word "state-of-the-art" counts as 1 word');
assert(countIeltsWords('twenty-one books') === 2, '"twenty-one books" counts as 2 words');

// ----------------------------------------------------
// TEST 3: Cambridge Optional Brackets Expansion
// ----------------------------------------------------
console.log('\n--- 3. Testing Optional Brackets Expansion ---');

const qBracket = {
  id: 6,
  order: 6,
  type: 'fill_in_the_blank',
  answer: '(a) library'
};

const resBr1 = diagnoseReadingQuestion(qBracket, 'library');
assert(resBr1.isCorrect, '"library" matches "(a) library"');

const resBr2 = diagnoseReadingQuestion(qBracket, 'a library');
assert(resBr2.isCorrect, '"a library" matches "(a) library"');

const qPluralBracket = {
  id: 7,
  order: 7,
  type: 'fill_in_the_blank',
  answer: 'car(s)'
};
assert(diagnoseReadingQuestion(qPluralBracket, 'car').isCorrect, '"car" matches "car(s)"');
assert(diagnoseReadingQuestion(qPluralBracket, 'cars').isCorrect, '"cars" matches "car(s)"');

// ----------------------------------------------------
// TEST 4: Roman Numerals for Matching Headings
// ----------------------------------------------------
console.log('\n--- 4. Testing Roman Numerals for Matching Headings ---');

const qHeading = {
  id: 8,
  order: 8,
  type: 'matching_headings',
  answer: 'vii'
};

assert(diagnoseReadingQuestion(qHeading, 'vii').isCorrect, 'Lowercase "vii" matches "vii"');
assert(diagnoseReadingQuestion(qHeading, 'VII').isCorrect, 'Uppercase "VII" matches "vii"');
assert(diagnoseReadingQuestion(qHeading, 'Heading vii').isCorrect, '"Heading vii" matches "vii"');
assert(!diagnoseReadingQuestion(qHeading, 'viii').isCorrect, '"viii" does not match "vii"');

// ----------------------------------------------------
// TEST 5: Plural (-s/-es) and Spelling Discrepancy Diagnostics
// ----------------------------------------------------
console.log('\n--- 5. Testing Plural & Spelling Diagnostics ---');

const qPlural = {
  id: 9,
  order: 9,
  type: 'summary_completion',
  answer: 'vessels'
};
const resMissingS = diagnoseReadingQuestion(qPlural, 'vessel');
assert(
  !resMissingS.isCorrect && resMissingS.status === 'PLURAL_ERROR',
  'Writing singular "vessel" for plural "vessels" triggers PLURAL_ERROR',
  `Status: ${resMissingS.status}, msg: ${resMissingS.diagnosticMessage}`
);

const qSpelling = {
  id: 10,
  order: 10,
  type: 'summary_completion',
  answer: 'commercial'
};
const resSpell = diagnoseReadingQuestion(qSpelling, 'comercial');
assert(
  !resSpell.isCorrect && resSpell.status === 'SPELLING_ERROR',
  'Writing "comercial" (1 letter slip) triggers SPELLING_ERROR',
  `Status: ${resSpell.status}, msg: ${resSpell.diagnosticMessage}`
);

// ----------------------------------------------------
// TEST 6: Full 40-Question Exam Scoring Integration
// ----------------------------------------------------
console.log('\n--- 6. Testing Full Exam Simulation ---');

const dummyTestData = {
  id: 'test-demo-cambridge',
  title: 'Cambridge Academic Demo Exam',
  passages: [
    {
      passageNumber: 1,
      title: 'Passage 1',
      questionGroups: [
        {
          type: 'true_false_not_given',
          instruction: 'Choose TRUE, FALSE or NOT GIVEN',
          questions: [
            { id: 1, order: 1, answer: 'TRUE' },
            { id: 2, order: 2, answer: 'FALSE' },
            { id: 3, order: 3, answer: 'NOT GIVEN' },
            { id: 4, order: 4, answer: 'TRUE' },
            { id: 5, order: 5, answer: 'FALSE' }
          ]
        },
        {
          type: 'summary_completion',
          instruction: 'Choose NO MORE THAN TWO WORDS from the passage.',
          questions: [
            { id: 6, order: 6, answer: 'ancient vessels' },
            { id: 7, order: 7, answer: '(a) library' },
            { id: 8, order: 8, answer: 'polyethylene glycol' },
            { id: 9, order: 9, answer: 'olive oil' },
            { id: 10, order: 10, answer: 'museum' }
          ]
        }
      ]
    }
  ]
};

const userAnswers = {
  1: 'T',                      // CORRECT (via abbreviation)
  2: 'FALSE',                  // CORRECT (exact)
  3: 'ng',                     // CORRECT (via abbreviation)
  4: 'FALSE',                  // WRONG_ANSWER
  5: '',                       // UNANSWERED
  6: 'ancient roman vessels',  // WORD_LIMIT_ERROR (3 words > 2)
  7: 'library',                // CORRECT (via bracket expansion)
  8: 'polyethylen glycol',     // SPELLING_ERROR
  9: 'olive oils',             // PLURAL_ERROR
  10: 'museum'                 // CORRECT (exact)
};

const examResult = scoreReadingExam({
  testData: dummyTestData,
  userAnswers,
  timeSpentSeconds: 1200
});

assert(examResult.correctCount === 5, 'Correct count is 5 out of 10');
assert(examResult.errorBreakdown.CORRECT === 5, 'errorBreakdown.CORRECT === 5');
assert(examResult.errorBreakdown.WORD_LIMIT_ERROR === 1, 'errorBreakdown.WORD_LIMIT_ERROR === 1');
assert(examResult.errorBreakdown.PLURAL_ERROR === 1, 'errorBreakdown.PLURAL_ERROR === 1');
assert(examResult.errorBreakdown.SPELLING_ERROR === 1, 'errorBreakdown.SPELLING_ERROR === 1');
assert(examResult.errorBreakdown.WRONG_ANSWER === 1, 'errorBreakdown.WRONG_ANSWER === 1');
assert(examResult.errorBreakdown.UNANSWERED === 1, 'errorBreakdown.UNANSWERED === 1');
assert(Array.isArray(examResult.passageStats) && examResult.passageStats.length === 3, 'passageStats has 3 passages');
assert(Array.isArray(examResult.typeStats) && examResult.typeStats.length >= 2, 'typeStats calculated');

console.log('\n====================================================');
console.log(`RESULTS: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}
