import assert from 'assert';
import { pastPaper101Test10 } from '../src/data/reading/pastPaper101Test10.js';
import { pastPaper101Test11 } from '../src/data/reading/pastPaper101Test11.js';
import { pastPaper101Test12 } from '../src/data/reading/pastPaper101Test12.js';
import { pastPaper101Test13 } from '../src/data/reading/pastPaper101Test13.js';
import { INITIAL_READING_TESTS } from '../src/data/readingTasks.js';
import { READING_MICRO_DRILLS } from '../src/data/readingMicroDrills.js';
import { ARENA_101_READING_QUESTIONS } from '../src/data/arenaQuestions101Reading.js';

console.log('--- STARTING VERIFICATION OF BATCH 3 (TESTS 10, 11, 12, 13) ---');

const batch3Tests = [
  { test: pastPaper101Test10, id: '101-reading-test-10', num: 10 },
  { test: pastPaper101Test11, id: '101-reading-test-11', num: 11 },
  { test: pastPaper101Test12, id: '101-reading-test-12', num: 12 },
  { test: pastPaper101Test13, id: '101-reading-test-13', num: 13 }
];

// 1. Verify structure, 40 questions, answers & locators for all 4 tests
batch3Tests.forEach(({ test, id, num }) => {
  assert.strictEqual(test.id, id, `Test ${num} ID mismatch`);
  assert.strictEqual(test.sections.length, 3, `Test ${num} must have exactly 3 passages`);
  
  let questionCount = 0;
  const questionNumbers = [];

  test.sections.forEach((sec, secIdx) => {
    assert.ok(sec.title && sec.titleEn, `Test ${num} Passage ${secIdx + 1} missing title/titleEn`);
    assert.ok(sec.passage && sec.passage.length > 500, `Test ${num} Passage ${secIdx + 1} text too short or missing`);

    sec.questionGroups.forEach((grp, grpIdx) => {
      assert.ok(grp.instruction && grp.instructionEn, `Test ${num} Grp ${grpIdx} missing instruction`);
      grp.questions.forEach(q => {
        questionCount++;
        questionNumbers.push(q.questionNumber);
        assert.ok(q.text, `Test ${num} Q${q.questionNumber} missing text`);
        assert.ok(q.correctAnswer, `Test ${num} Q${q.questionNumber} missing correctAnswer`);
        assert.ok(q.explanation && q.explanationEn, `Test ${num} Q${q.questionNumber} missing bilingual explanations`);
        assert.ok(q.evidence !== undefined, `Test ${num} Q${q.questionNumber} missing evidence field`);
      });
    });
  });

  assert.strictEqual(questionCount, 40, `Test ${num} must have exactly 40 questions, got ${questionCount}`);
  for (let i = 1; i <= 40; i++) {
    assert.ok(questionNumbers.includes(i), `Test ${num} is missing question number ${i}`);
  }
  console.log(`[PASS] Test ${num}: 40 questions, 3 passages, all bilingual explanations and locators intact.`);
});

// 2. Verify registration in INITIAL_READING_TESTS
['101-reading-test-10', '101-reading-test-11', '101-reading-test-12', '101-reading-test-13'].forEach(id => {
  const found = INITIAL_READING_TESTS.find(t => t.id === id);
  assert.ok(found, `INITIAL_READING_TESTS is missing ${id}`);
});
console.log('[PASS] All 4 tests successfully registered in INITIAL_READING_TESTS.');

// 3. Verify Micro-Drills
['drill-101-batch3-tfng-10', 'drill-101-batch3-tfng-11', 'drill-101-batch3-para-12', 'drill-101-batch3-tfng-13'].forEach(id => {
  const drill = READING_MICRO_DRILLS.find(d => d.id === id);
  assert.ok(drill, `READING_MICRO_DRILLS missing ${id}`);
  assert.ok(drill.titleEn && drill.categoryEn && drill.explanationEn, `Drill ${id} missing English metadata`);
});
console.log('[PASS] Batch 3 micro-drills successfully registered and verified.');

// 4. Verify Arena Questions & Strict Global English UI (0% Vietnamese in English fields)
const arenaIds = [
  'arena_101_read_koala_digest_24',
  'arena_101_read_writing_rebus_25',
  'arena_101_read_bestcom_privacy_26',
  'arena_101_read_mars_meteorite_27'
];

arenaIds.forEach(id => {
  const q = ARENA_101_READING_QUESTIONS.find(item => item.id === id);
  assert.ok(q, `ARENA_101_READING_QUESTIONS missing ${id}`);
  assert.ok(q.promptEn && q.promptEn.length > 10, `Arena Q ${id} missing promptEn`);
  assert.ok(q.contextEn && q.contextEn.length > 20, `Arena Q ${id} missing contextEn`);
  assert.ok(q.correctAnswerEn, `Arena Q ${id} missing correctAnswerEn`);
  assert.ok(q.optionsEn && q.optionsEn.length >= 4, `Arena Q ${id} missing optionsEn`);
  assert.ok(q.explanationEn && q.explanationEn.length > 10, `Arena Q ${id} missing explanationEn`);

  // Vietnamese diacritic regex check to guarantee 0% Vietnamese in English mode
  const vnRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i;
  assert.ok(!vnRegex.test(q.promptEn), `Arena Q ${id} promptEn contains Vietnamese!`);
  assert.ok(!vnRegex.test(q.contextEn), `Arena Q ${id} contextEn contains Vietnamese!`);
  assert.ok(!vnRegex.test(q.correctAnswerEn), `Arena Q ${id} correctAnswerEn contains Vietnamese!`);
  assert.ok(!vnRegex.test(q.explanationEn), `Arena Q ${id} explanationEn contains Vietnamese!`);
  q.optionsEn.forEach((opt, idx) => {
    assert.ok(!vnRegex.test(opt), `Arena Q ${id} optionsEn[${idx}] contains Vietnamese: "${opt}"!`);
  });
});
console.log('[PASS] Batch 3 arena questions verified with 100% Strict Global English UI compliance (0% Vietnamese).');

console.log('--- ALL BATCH 3 VERIFICATIONS PASSED SUCCESSFULLY (100%) ---');
