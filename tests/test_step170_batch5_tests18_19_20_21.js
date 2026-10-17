import assert from 'assert';
import { pastPaper101Test18 } from '../src/data/reading/pastPaper101Test18.js';
import { pastPaper101Test19 } from '../src/data/reading/pastPaper101Test19.js';
import { pastPaper101Test20 } from '../src/data/reading/pastPaper101Test20.js';
import { pastPaper101Test21 } from '../src/data/reading/pastPaper101Test21.js';
import { INITIAL_READING_TESTS } from '../src/data/readingTasks.js';
import { READING_MICRO_DRILLS } from '../src/data/readingMicroDrills.js';
import { ARENA_101_READING_QUESTIONS } from '../src/data/arenaQuestions101Reading.js';

console.log('--- STARTING VERIFICATION OF BATCH 5 (TESTS 18, 19, 20, 21) ---');

const batch5Tests = [
  { test: pastPaper101Test18, id: '101-reading-test-18', num: 18 },
  { test: pastPaper101Test19, id: '101-reading-test-19', num: 19 },
  { test: pastPaper101Test20, id: '101-reading-test-20', num: 20 },
  { test: pastPaper101Test21, id: '101-reading-test-21', num: 21 }
];

// 1. Verify structure, 40 questions, answers & locators for all 4 tests
batch5Tests.forEach(({ test, id, num }) => {
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
['101-reading-test-18', '101-reading-test-19', '101-reading-test-20', '101-reading-test-21'].forEach(id => {
  const found = INITIAL_READING_TESTS.find(t => t.id === id);
  assert.ok(found, `INITIAL_READING_TESTS is missing ${id}`);
});
console.log('[PASS] All 4 tests successfully registered in INITIAL_READING_TESTS.');

// 3. Verify Micro-Drills
['drill-101-batch5-tfng-18', 'drill-101-batch5-para-19', 'drill-101-batch5-tfng-20', 'drill-101-batch5-para-21'].forEach(id => {
  const drill = READING_MICRO_DRILLS.find(d => d.id === id);
  assert.ok(drill, `READING_MICRO_DRILLS is missing ${id}`);
  assert.ok(drill.title && drill.titleEn, `Drill ${id} missing titleEn`);
  assert.ok(drill.category && drill.categoryEn, `Drill ${id} missing categoryEn`);
  assert.ok(drill.explanation && drill.explanationEn, `Drill ${id} missing explanationEn`);
});
console.log('[PASS] All 4 micro-drills verified in READING_MICRO_DRILLS.');

// 4. Verify Arena Questions
['arena_101_read_millennium_bridge_32', 'arena_101_read_strontium_lapita_33', 'arena_101_read_permastore_memory_34', 'arena_101_read_ear_voice_span_35'].forEach(id => {
  const q = ARENA_101_READING_QUESTIONS.find(item => item.id === id);
  assert.ok(q, `ARENA_101_READING_QUESTIONS is missing ${id}`);
  assert.ok(q.promptEn && q.contextEn && q.explanationEn && q.correctAnswerEn, `Arena Q ${id} missing required English fields`);
  assert.strictEqual(q.optionsEn.length, 4, `Arena Q ${id} optionsEn must have 4 options`);

  // Verify Strict Global English UI (0% Vietnamese diacritics in English mode fields)
  const vietnameseDiacriticRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i;
  assert.ok(!vietnameseDiacriticRegex.test(q.promptEn), `Arena Q ${id} promptEn has Vietnamese diacritics`);
  assert.ok(!vietnameseDiacriticRegex.test(q.contextEn), `Arena Q ${id} contextEn has Vietnamese diacritics`);
  assert.ok(!vietnameseDiacriticRegex.test(q.explanationEn), `Arena Q ${id} explanationEn has Vietnamese diacritics`);
  assert.ok(!vietnameseDiacriticRegex.test(q.correctAnswerEn), `Arena Q ${id} correctAnswerEn has Vietnamese diacritics`);
  q.optionsEn.forEach((opt, oIdx) => {
    assert.ok(!vietnameseDiacriticRegex.test(opt), `Arena Q ${id} optionsEn[${oIdx}] has Vietnamese diacritics`);
  });
});
console.log('[PASS] All 4 Arena questions verified in ARENA_101_READING_QUESTIONS with 0% Vietnamese diacritics in English mode.');

console.log('=== ALL BATCH 5 VERIFICATION GATES PASSED! ===');
