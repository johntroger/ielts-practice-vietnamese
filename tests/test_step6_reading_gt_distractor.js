import { 
  calculateReadingBandScore, 
  getReadingBandComparison,
  IELTS_ACADEMIC_READING_BAND_TABLE,
  IELTS_GENERAL_READING_BAND_TABLE
} from '../src/data/readingTasks.js';

import {
  READING_DISTRACTOR_TRAPS,
  analyzeReadingDistractor,
  diagnoseReadingQuestion,
  scoreReadingExam
} from '../src/utils/readingScorer.js';

console.log('--- STARTING STEP 6 TEST SUITE: READING ACADEMIC VS GT & DISTRACTORS ---');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// -------------------------------------------------------------
// 1. Cambridge Academic vs General Training Band Conversions
// -------------------------------------------------------------
console.log('\n[1] Academic vs General Training Band Conversions:');

assert(calculateReadingBandScore(40, 'academic') === 9.0, 'Raw 40 Academic is Band 9.0');
assert(calculateReadingBandScore(40, 'general_training') === 9.0, 'Raw 40 General Training is Band 9.0');
assert(calculateReadingBandScore(39, 'academic') === 9.0, 'Raw 39 Academic is Band 9.0 (Cambridge Academic 39-40 is Band 9.0)');
assert(calculateReadingBandScore(38, 'academic') === 8.5, 'Raw 38 Academic is Band 8.5');
assert(calculateReadingBandScore(39, 'general_training') === 8.5, 'Raw 39 General Training is Band 8.5');

// Cambridge key differentiator: Raw 30
assert(calculateReadingBandScore(30, 'academic') === 7.0, 'Raw 30 Academic is Band 7.0');
assert(calculateReadingBandScore(30, 'general_training') === 6.0, 'Raw 30 General Training is Band 6.0 (Cambridge GT standard)');
assert(calculateReadingBandScore(30, 'gt') === 6.0, 'Alias "gt" works correctly');

// Key differentiator: Raw 34
assert(calculateReadingBandScore(34, 'academic') === 7.5, 'Raw 34 Academic is Band 7.5');
assert(calculateReadingBandScore(34, 'general_training') === 7.0, 'Raw 34 General Training is Band 7.0');

// Key differentiator: Raw 23
assert(calculateReadingBandScore(23, 'academic') === 6.0, 'Raw 23 Academic is Band 6.0');
assert(calculateReadingBandScore(23, 'general_training') === 5.0, 'Raw 23 General Training is Band 5.0');

// Floor & Edge Cases
assert(calculateReadingBandScore(0, 'academic') === 2.0, 'Raw 0 Academic is floor 2.0');
assert(calculateReadingBandScore(0, 'general_training') === 2.0, 'Raw 0 GT is floor 2.0');
assert(calculateReadingBandScore(-5, 'academic') === 2.0, 'Negative score clamped to 0 -> Band 2.0');
assert(calculateReadingBandScore(50, 'academic') === 9.0, 'Exceeded score clamped to 40 -> Band 9.0');

// -------------------------------------------------------------
// 2. getReadingBandComparison helper
// -------------------------------------------------------------
console.log('\n[2] Reading Band Comparison Helper:');
const comp30 = getReadingBandComparison(30);
assert(comp30.rawScore === 30, 'Comparison raw score is 30');
assert(comp30.academicBand === 7.0, 'Comparison Academic band is 7.0');
assert(comp30.generalBand === 6.0, 'Comparison General band is 6.0');
assert(comp30.difference === 1.0, 'Comparison difference is 1.0 band');

const comp40 = getReadingBandComparison(40);
assert(comp40.academicBand === 9.0 && comp40.generalBand === 9.0, 'Comparison at 40 is 9.0 vs 9.0');
assert(comp40.difference === 0.0, 'Comparison difference at 40 is 0.0');

// -------------------------------------------------------------
// 3. Distractor Trap Archetype 1: TRAP_EXTRAPOLATION_NOT_GIVEN
// -------------------------------------------------------------
console.log('\n[3] Distractor Trap: TRAP_EXTRAPOLATION_NOT_GIVEN:');
const trap1 = analyzeReadingDistractor({
  question: { answer: 'NOT GIVEN', questionText: 'The Romans exported wine to Northern Europe.' },
  rawUserAnswer: 'TRUE',
  status: 'WRONG_ANSWER',
  passageText: 'The cargo included terracotta amphorae loaded with olive oil and marble slabs.'
});

assert(trap1 !== null, 'Trap 1 detected');
assert(trap1.trapCode === 'TRAP_EXTRAPOLATION_NOT_GIVEN', 'Identified as TRAP_EXTRAPOLATION_NOT_GIVEN');
assert(trap1.severity === 'high', 'Trap severity is high');
assert(trap1.analysis.includes('NOT GIVEN'), 'Analysis mentions NOT GIVEN');

// -------------------------------------------------------------
// 4. Distractor Trap Archetype 2: TRAP_ABSOLUTE_VS_QUALIFIED
// -------------------------------------------------------------
console.log('\n[4] Distractor Trap: TRAP_ABSOLUTE_VS_QUALIFIED:');
const trap2 = analyzeReadingDistractor({
  question: { answer: 'FALSE', questionText: 'All ancient Roman vessels completely disintegrated upon excavation.' },
  rawUserAnswer: 'TRUE',
  status: 'WRONG_ANSWER',
  evidenceQuote: 'Specialists impregnated the timbers with polyethylene glycol, solidifying some wooden structures.',
  passageText: 'Some vessels were partially preserved.'
});

assert(trap2 !== null, 'Trap 2 detected');
assert(trap2.trapCode === 'TRAP_ABSOLUTE_VS_QUALIFIED', 'Identified as TRAP_ABSOLUTE_VS_QUALIFIED');
assert(trap2.analysis.includes('tuyệt đối'), 'Analysis notes extreme qualifiers');

// -------------------------------------------------------------
// 5. Distractor Trap Archetype 3: TRAP_IMPLICIT_NEGATION
// -------------------------------------------------------------
console.log('\n[5] Distractor Trap: TRAP_IMPLICIT_NEGATION:');
const trap3 = analyzeReadingDistractor({
  question: { answer: 'FALSE', questionText: 'Modern maritime regulations regularly govern planetary geoengineering.' },
  rawUserAnswer: 'TRUE',
  status: 'WRONG_ANSWER',
  evidenceQuote: 'The international community currently lacks any binding treaty to govern atmospheric manipulation.',
  passageText: 'International bodies fail to enforce planetary cooling laws.'
});

assert(trap3 !== null, 'Trap 3 detected');
assert(trap3.trapCode === 'TRAP_IMPLICIT_NEGATION', 'Identified as TRAP_IMPLICIT_NEGATION');
assert(trap3.analysis.includes('phủ định ngầm'), 'Analysis highlights subtle negation');

// -------------------------------------------------------------
// 6. Distractor Trap Archetype 4: TRAP_TEMPORAL_SHIFT
// -------------------------------------------------------------
console.log('\n[6] Distractor Trap: TRAP_TEMPORAL_SHIFT:');
const trap4 = analyzeReadingDistractor({
  question: { answer: 'FALSE', questionText: 'Pisa currently serves as the primary military naval port of Italy.' },
  rawUserAnswer: 'TRUE',
  status: 'WRONG_ANSWER',
  evidenceQuote: 'Pisa was known in antiquity as a vibrant port and naval centre.',
  passageText: 'Historically the fleet dominated Mediterranean waters.'
});

assert(trap4 !== null, 'Trap 4 detected');
assert(trap4.trapCode === 'TRAP_TEMPORAL_SHIFT', 'Identified as TRAP_TEMPORAL_SHIFT');
assert(trap4.analysis.includes('thời gian'), 'Analysis highlights temporal shift');

// -------------------------------------------------------------
// 7. Distractor Trap Archetype 5: TRAP_SURFACE_KEYWORD_MATCH
// -------------------------------------------------------------
console.log('\n[7] Distractor Trap: TRAP_SURFACE_KEYWORD_MATCH:');
const trap5 = analyzeReadingDistractor({
  question: { answer: 'polyethylene glycol', questionText: 'What substance was sprayed to preserve the timber?' },
  rawUserAnswer: 'fermented fish sauce',
  status: 'WRONG_ANSWER',
  evidenceQuote: 'The cargo included terracotta amphorae loaded with fermented fish sauce (garum) from southern Spain.',
  passageText: 'To preserve timber specialists applied polyethylene glycol wax.'
});

assert(trap5 !== null, 'Trap 5 detected');
assert(trap5.trapCode === 'TRAP_SURFACE_KEYWORD_MATCH', 'Identified as TRAP_SURFACE_KEYWORD_MATCH');
assert(trap5.analysis.includes('nguyên văn') || trap5.analysis.includes('bề mặt'), 'Analysis explains surface lure');

// -------------------------------------------------------------
// 8. Correct Answers and Unanswered Questions Have Null Traps
// -------------------------------------------------------------
console.log('\n[8] Non-traps (Correct & Unanswered):');
const correctCheck = analyzeReadingDistractor({
  question: { answer: 'TRUE' },
  rawUserAnswer: 'TRUE',
  status: 'CORRECT'
});
assert(correctCheck === null, 'Correct answer returns null distractor');

const unansCheck = analyzeReadingDistractor({
  question: { answer: 'TRUE' },
  rawUserAnswer: '',
  status: 'UNANSWERED'
});
assert(unansCheck === null, 'Unanswered question returns null distractor');

// -------------------------------------------------------------
// 9. Master scoreReadingExam Integration with Distractor Summary & GT
// -------------------------------------------------------------
console.log('\n[9] scoreReadingExam Integration:');

const mockPassage = {
  id: 'p1',
  passageNumber: 1,
  paragraphs: [
    { id: 'A', text: 'Pisa was historically an ancient Roman port with fermented fish sauce in storage.' }
  ],
  questionGroups: [
    {
      id: 'qg-1',
      type: 'true_false_not_given',
      instruction: 'TRUE / FALSE / NOT GIVEN',
      questions: [
        {
          id: 1,
          order: 1,
          questionText: 'Pisa currently functions as an active port.',
          answer: 'FALSE',
          evidenceQuote: 'Pisa was historically an ancient port.'
        },
        {
          id: 2,
          order: 2,
          questionText: 'The Romans exported fish sauce to China.',
          answer: 'NOT GIVEN',
          evidenceQuote: ''
        },
        {
          id: 3,
          order: 3,
          questionText: 'The discovery included ancient Roman vessels.',
          answer: 'TRUE',
          evidenceQuote: 'remains of over thirty Roman ships.'
        }
      ]
    }
  ]
};

const academicResult = scoreReadingExam({
  testData: { id: 'test-1', title: 'Test 1', passages: [mockPassage] },
  userAnswers: {
    1: 'TRUE', // Temporal trap
    2: 'TRUE', // Extrapolation trap
    3: 'TRUE'  // Correct
  },
  timeSpentSeconds: 120,
  moduleType: 'academic'
});

assert(academicResult.moduleType === 'academic', 'Result reports academic module');
assert(academicResult.correctCount === 1, '1 correct answer');
assert(academicResult.bandComparison !== undefined, 'bandComparison object is present');
assert(academicResult.distractorSummary !== undefined, 'distractorSummary is present');
assert(academicResult.distractorSummary.totalTrapsIdentified >= 2, 'At least 2 traps identified in exam');
assert(academicResult.distractorSummary.TRAP_TEMPORAL_SHIFT >= 1, 'Temporal shift counted');
assert(academicResult.distractorSummary.TRAP_EXTRAPOLATION_NOT_GIVEN >= 1, 'Extrapolation counted');

const gtResult = scoreReadingExam({
  testData: { id: 'test-gt', title: 'GT Test', passages: [mockPassage] },
  userAnswers: { 1: 'FALSE', 2: 'NOT GIVEN', 3: 'TRUE' }, // 3/3
  moduleType: 'general_training'
});

assert(gtResult.moduleType === 'general_training', 'GT test recognized');
assert(gtResult.distractorSummary.totalTrapsIdentified === 0, '0 traps on perfect score');

console.log(`\n========================================`);
console.log(`STEP 6 TESTS COMPLETED: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`========================================\n`);

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
