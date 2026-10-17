import assert from 'node:assert';
import { INITIAL_READING_TESTS } from '../src/data/readingTasks.js';
import { pastPaper101Test6 } from '../src/data/reading/pastPaper101Test6.js';
import { pastPaper101Test7 } from '../src/data/reading/pastPaper101Test7.js';
import { pastPaper101Test8 } from '../src/data/reading/pastPaper101Test8.js';
import { pastPaper101Test9 } from '../src/data/reading/pastPaper101Test9.js';
import { READING_MICRO_DRILLS } from '../src/data/readingMicroDrills.js';
import { ARENA_101_READING_QUESTIONS } from '../src/data/arenaQuestions101Reading.js';

console.log('🧪 RUNNING VERIFICATION SUITE: 101 Reading Past Papers - Batch 2 (Tests 6, 7, 8, 9)...');

// 1. Verify Registration in INITIAL_READING_TESTS
const testIds = INITIAL_READING_TESTS.map(t => t.id);
assert.ok(testIds.includes('past-paper-101-reading-test-6'), 'Test 6 should be registered');
assert.ok(testIds.includes('past-paper-101-reading-test-7'), 'Test 7 should be registered');
assert.ok(testIds.includes('past-paper-101-reading-test-8'), 'Test 8 should be registered');
assert.ok(testIds.includes('past-paper-101-reading-test-9'), 'Test 9 should be registered');
console.log('✅ 1. All Batch 2 tests (6, 7, 8, 9) properly registered in INITIAL_READING_TESTS');

// 2. Validate completeness and question counts (40 questions each)
const batch2Tests = [
  { test: pastPaper101Test6, num: 6 },
  { test: pastPaper101Test7, num: 7 },
  { test: pastPaper101Test8, num: 8 },
  { test: pastPaper101Test9, num: 9 }
];

batch2Tests.forEach(({ test, num }) => {
  assert.strictEqual(test.passages.length, 3, `Test ${num} should have 3 passages`);
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

// 3. Verify Official Key alignment for Test 6 (Pages 467-469)
const t6Q1 = pastPaper101Test6.passages[0].questionGroups[0].questions[0];
assert.strictEqual(t6Q1.correctAnswer, 'B');
const t6Q10 = pastPaper101Test6.passages[0].questionGroups[1].questions[0];
assert.ok(t6Q10.acceptableAnswers.includes('sea water') && t6Q10.acceptableAnswers.includes('salt'));
const t6Q14 = pastPaper101Test6.passages[1].questionGroups[0].questions[0];
assert.strictEqual(t6Q14.correctAnswer, 'iv');
const t6Q27 = pastPaper101Test6.passages[2].questionGroups[0].questions[0];
assert.strictEqual(t6Q27.correctAnswer, 'C');
const t6Q40 = pastPaper101Test6.passages[2].questionGroups[2].questions[1];
assert.strictEqual(t6Q40.correctAnswer, 'grape growers');
console.log('✅ Test 6 official answer keys match Pages 467-469');

// 4. Verify Official Key alignment for Test 7 (Page 470)
const t7Q1 = pastPaper101Test7.passages[0].questionGroups[0].questions[0];
assert.strictEqual(t7Q1.correctAnswer, 'YES');
const t7Q7 = pastPaper101Test7.passages[0].questionGroups[1].questions[0];
assert.strictEqual(t7Q7.correctAnswer, 'ecological release');
const t7Q14 = pastPaper101Test7.passages[1].questionGroups[0].questions[0];
assert.strictEqual(t7Q14.correctAnswer, 'presentation');
const t7Q27 = pastPaper101Test7.passages[2].questionGroups[0].questions[0];
assert.strictEqual(t7Q27.correctAnswer, 'D');
const t7Q40 = pastPaper101Test7.passages[2].questionGroups[3].questions[0];
assert.strictEqual(t7Q40.correctAnswer, 'A');
console.log('✅ Test 7 official answer keys match Page 470');

// 5. Verify Official Key alignment for Test 8 (Page 471)
const t8Q1 = pastPaper101Test8.passages[0].questionGroups[0].questions[0];
assert.strictEqual(t8Q1.correctAnswer, '(severe) drought');
const t8Q9 = pastPaper101Test8.passages[0].questionGroups[2].questions[0];
assert.strictEqual(t8Q9.correctAnswer, 'FALSE');
const t8Q14 = pastPaper101Test8.passages[1].questionGroups[0].questions[0];
assert.strictEqual(t8Q14.correctAnswer, 'navigation and communications');
const t8Q27 = pastPaper101Test8.passages[2].questionGroups[0].questions[0];
assert.strictEqual(t8Q27.correctAnswer, 'iii');
const t8Q40 = pastPaper101Test8.passages[2].questionGroups[2].questions[0];
assert.strictEqual(t8Q40.correctAnswer, 'B');
console.log('✅ Test 8 official answer keys match Page 471');

// 6. Verify Official Key alignment for Test 9 (Page 472)
const t9Q1 = pastPaper101Test9.passages[0].questionGroups[0].questions[0];
assert.strictEqual(t9Q1.correctAnswer, 'B');
const t9Q10 = pastPaper101Test9.passages[0].questionGroups[2].questions[0];
assert.strictEqual(t9Q10.correctAnswer, 'animal rights');
const t9Q15 = pastPaper101Test9.passages[1].questionGroups[0].questions[0];
assert.strictEqual(t9Q15.correctAnswer, 'D');
const t9Q28 = pastPaper101Test9.passages[2].questionGroups[0].questions[0];
assert.strictEqual(t9Q28.correctAnswer, 'iv');
const t9Q40 = pastPaper101Test9.passages[2].questionGroups[2].questions[3];
assert.strictEqual(t9Q40.correctAnswer, 'TRUE');
console.log('✅ Test 9 official answer keys match Page 472');

// 7. Verify Micro-Drills and Arena expansion
const drillIds = READING_MICRO_DRILLS.map(d => d.id);
assert.ok(drillIds.includes('drill-101-batch2-tfng-4'), 'Batch 2 drill 4 should exist');
assert.ok(drillIds.includes('drill-101-batch2-para-5'), 'Batch 2 drill 5 should exist');
assert.ok(drillIds.includes('drill-101-batch2-tfng-6'), 'Batch 2 drill 6 should exist');
assert.ok(drillIds.includes('drill-101-batch2-para-7'), 'Batch 2 drill 7 should exist');

const arena101Ids = ARENA_101_READING_QUESTIONS.map(q => q.id);
assert.ok(arena101Ids.includes('arena_101_read_otter_vision_20'), 'Arena question 20 should exist');
assert.ok(arena101Ids.includes('arena_101_read_ecological_release_21'), 'Arena question 21 should exist');
assert.ok(arena101Ids.includes('arena_101_read_cellphone_plane_22'), 'Arena question 22 should exist');
assert.ok(arena101Ids.includes('arena_101_read_satellite_asia_23'), 'Arena question 23 should exist');
console.log('✅ Micro-drills and Arena questions properly integrated');

// 8. Verify Zero Vietnamese Leaks in English Mode for Batch 2 Arena Questions
const batch2ArenaQuestions = ARENA_101_READING_QUESTIONS.filter(q => 
  ['arena_101_read_otter_vision_20', 'arena_101_read_ecological_release_21', 'arena_101_read_cellphone_plane_22', 'arena_101_read_satellite_asia_23'].includes(q.id)
);
const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

batch2ArenaQuestions.forEach(q => {
  assert.ok(!vietnameseRegex.test(q.promptEn), `Arena ${q.id} promptEn contains Vietnamese: ${q.promptEn}`);
  assert.ok(!vietnameseRegex.test(q.contextEn), `Arena ${q.id} contextEn contains Vietnamese`);
  assert.ok(!vietnameseRegex.test(q.explanationEn), `Arena ${q.id} explanationEn contains Vietnamese`);
  q.optionsEn.forEach(opt => {
    assert.ok(!vietnameseRegex.test(opt), `Arena ${q.id} optionEn contains Vietnamese: ${opt}`);
  });
});
console.log('✅ Strict Global English UI verified (0% Vietnamese leaks in English mode)');

console.log('\n🎉 ALL TESTS IN BATCH 2 PASSED WITH 100% SUCCESS!');
