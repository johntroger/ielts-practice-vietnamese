import assert from 'node:assert';
import { INITIAL_READING_TESTS } from '../src/data/readingTasks.js';
import { pastPaper101Test3 } from '../src/data/reading/pastPaper101Test3.js';
import { pastPaper101Test4 } from '../src/data/reading/pastPaper101Test4.js';
import { pastPaper101Test5 } from '../src/data/reading/pastPaper101Test5.js';
import { READING_MICRO_DRILLS } from '../src/data/readingMicroDrills.js';
import { ARENA_101_READING_QUESTIONS } from '../src/data/arenaQuestions101Reading.js';

console.log('🧪 RUNNING VERIFICATION SUITE: 101 Reading Past Papers - Batch 1 (Tests 3, 4, 5)...');

// 1. Verify Registration in INITIAL_READING_TESTS
const testIds = INITIAL_READING_TESTS.map(t => t.id);
assert.ok(testIds.includes('past-paper-101-reading-test-3'), 'Test 3 should be registered');
assert.ok(testIds.includes('past-paper-101-reading-test-4'), 'Test 4 should be registered');
assert.ok(testIds.includes('past-paper-101-reading-test-5'), 'Test 5 should be registered');
console.log('✅ 1. All Batch 1 tests properly registered in INITIAL_READING_TESTS');

// 2. Validate Test 3, 4, 5 completeness and question counts
const batch1Tests = [
  { test: pastPaper101Test3, expectedPassages: 3, num: 3 },
  { test: pastPaper101Test4, expectedPassages: 3, num: 4 },
  { test: pastPaper101Test5, expectedPassages: 3, num: 5 }
];

batch1Tests.forEach(({ test, expectedPassages, num }) => {
  assert.strictEqual(test.passages.length, expectedPassages, `Test ${num} should have 3 passages`);
  
  let totalQuestions = 0;
  test.passages.forEach(p => {
    assert.ok(p.paragraphs && p.paragraphs.length > 0, `Passage ${p.id} should have paragraphs`);
    assert.ok(p.title && p.titleEn, `Passage ${p.id} should have titles`);
    p.questionGroups.forEach(qg => {
      assert.ok(qg.questions && qg.questions.length > 0, `Question group ${qg.id} should have questions`);
      qg.questions.forEach(q => {
        totalQuestions++;
        assert.ok(q.id !== undefined, `Question in Test ${num} missing id`);
        assert.ok(q.questionNumber !== undefined || q.order !== undefined, `Question in Test ${num} missing question number`);
        assert.ok(q.correctAnswer || q.answer, `Question in Test ${num} missing correctAnswer`);
        assert.ok(q.explanation && q.explanationEn, `Question in Test ${num} missing bilingual explanation`);
        assert.ok(q.evidence || q.evidenceQuote, `Question in Test ${num} missing evidence quote`);
      });
    });
  });
  assert.strictEqual(totalQuestions, 40, `Test ${num} must have exactly 40 questions (found ${totalQuestions})`);
  console.log(`✅ Test ${num} verified: 3 passages, 40 questions, bilingual explanations and evidence`);
});

// 3. Verify Official Key alignment for Test 3 (Page 464)
const t3P1Q1 = pastPaper101Test3.passages[0].questionGroups[0].questions[0];
assert.strictEqual(t3P1Q1.answer || t3P1Q1.correctAnswer, 'F');
const t3Q14 = pastPaper101Test3.passages[1].questionGroups[0].questions[0];
assert.strictEqual(t3Q14.answer || t3Q14.correctAnswer, 'v');
const t3Q28 = pastPaper101Test3.passages[2].questionGroups[0].questions[0];
assert.strictEqual(t3Q28.answer || t3Q28.correctAnswer, '400,000 years ago');
console.log('✅ Test 3 official answer keys match Page 464');

// 4. Verify Official Key alignment for Test 4 (Page 465)
const t4Q1 = pastPaper101Test4.passages[0].questionGroups[0].questions[0];
assert.strictEqual(t4Q1.correctAnswer, 'E');
const t4Q9 = pastPaper101Test4.passages[0].questionGroups[1].questions[0];
assert.strictEqual(t4Q9.correctAnswer, 'NO');
const t4Q14 = pastPaper101Test4.passages[1].questionGroups[0].questions[0];
assert.strictEqual(t4Q14.correctAnswer, 'G');
const t4Q27 = pastPaper101Test4.passages[2].questionGroups[0].questions[0];
assert.strictEqual(t4Q27.correctAnswer, 'iv');
const t4Q33 = pastPaper101Test4.passages[2].questionGroups[1].questions[0];
assert.strictEqual(t4Q33.correctAnswer, 'collaborative and interactive');
console.log('✅ Test 4 official answer keys match Page 465');

// 5. Verify Official Key alignment for Test 5 (Page 466)
const t5Q1 = pastPaper101Test5.passages[0].questionGroups[0].questions[0];
assert.strictEqual(t5Q1.correctAnswer, 'A');
const t5Q7 = pastPaper101Test5.passages[0].questionGroups[1].questions[0];
assert.strictEqual(t5Q7.correctAnswer, 'TRUE');
const t5Q14 = pastPaper101Test5.passages[1].questionGroups[0].questions[0];
assert.strictEqual(t5Q14.correctAnswer, 'TRUE');
const t5Q19 = pastPaper101Test5.passages[1].questionGroups[1].questions[0];
assert.ok(t5Q19.acceptableAnswers.includes('high-pressure air gun') || t5Q19.correctAnswer.includes('air gun'));
const t5Q28 = pastPaper101Test5.passages[2].questionGroups[0].questions[0];
assert.strictEqual(t5Q28.correctAnswer, 'D');
const t5Q39 = pastPaper101Test5.passages[2].questionGroups[2].questions[0];
assert.strictEqual(t5Q39.correctAnswer, 'B');
console.log('✅ Test 5 official answer keys match Page 466');

// 6. Verify Micro-Drills and Arena expansion
const drillIds = READING_MICRO_DRILLS.map(d => d.id);
assert.ok(drillIds.includes('drill-101-batch1-tfng-1'), 'Batch 1 drill 1 should exist');
assert.ok(drillIds.includes('drill-101-batch1-para-2'), 'Batch 1 drill 2 should exist');
assert.ok(drillIds.includes('drill-101-batch1-para-3'), 'Batch 1 drill 3 should exist');

const arena101Ids = ARENA_101_READING_QUESTIONS.map(q => q.id);
assert.ok(arena101Ids.includes('arena_101_read_navigation_17'), 'Arena question 17 should exist');
assert.ok(arena101Ids.includes('arena_101_read_oregon_18'), 'Arena question 18 should exist');
assert.ok(arena101Ids.includes('arena_101_read_marketing_19'), 'Arena question 19 should exist');
console.log('✅ Micro-drills and Arena questions properly integrated');

// 7. Verify Zero Vietnamese Leaks in English Mode for Batch 1 Arena Questions
const batch1ArenaQuestions = ARENA_101_READING_QUESTIONS.filter(q => 
  ['arena_101_read_navigation_17', 'arena_101_read_oregon_18', 'arena_101_read_marketing_19'].includes(q.id)
);
const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

batch1ArenaQuestions.forEach(q => {
  assert.ok(!vietnameseRegex.test(q.promptEn), `Arena ${q.id} promptEn contains Vietnamese: ${q.promptEn}`);
  assert.ok(!vietnameseRegex.test(q.contextEn), `Arena ${q.id} contextEn contains Vietnamese`);
  assert.ok(!vietnameseRegex.test(q.explanationEn), `Arena ${q.id} explanationEn contains Vietnamese`);
  q.optionsEn.forEach(opt => {
    assert.ok(!vietnameseRegex.test(opt), `Arena ${q.id} optionEn contains Vietnamese: ${opt}`);
  });
});
console.log('✅ Strict Global English UI verified (0% Vietnamese leaks in English mode)');

console.log('\n🎉 ALL TESTS IN BATCH 1 PASSED WITH 100% SUCCESS!');