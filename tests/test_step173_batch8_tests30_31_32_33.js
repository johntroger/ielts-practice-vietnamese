import assert from 'node:assert';
import { pastPaper101Test30 } from '../src/data/reading/pastPaper101Test30.js';
import { pastPaper101Test31 } from '../src/data/reading/pastPaper101Test31.js';
import { pastPaper101Test32 } from '../src/data/reading/pastPaper101Test32.js';
import { pastPaper101Test33 } from '../src/data/reading/pastPaper101Test33.js';
import { INITIAL_READING_TESTS } from '../src/data/readingTasks.js';
import { READING_MICRO_DRILLS } from '../src/data/readingMicroDrills.js';
import { ARENA_101_READING_QUESTIONS } from '../src/data/arenaQuestions101Reading.js';

console.log('🧪 Starting Verification Suite for Batch 8 (Tests 30, 31, 32, 33)...');

const tests = [
  { data: pastPaper101Test30, id: '101-reading-test-30', num: 30 },
  { data: pastPaper101Test31, id: '101-reading-test-31', num: 31 },
  { data: pastPaper101Test32, id: '101-reading-test-32', num: 32 },
  { data: pastPaper101Test33, id: '101-reading-test-33', num: 33 }
];

tests.forEach(({ data, id, num }) => {
  console.log(`Checking Test ${num} (${id})...`);
  assert.strictEqual(data.id, id, `Test ${num} ID mismatch`);
  assert.strictEqual(data.sections.length, 3, `Test ${num} must have exactly 3 sections`);

  let count = 0;
  data.sections.forEach((sec, sIdx) => {
    assert.ok(sec.passage && sec.passage.length > 500, `Test ${num} Passage ${sIdx + 1} too short`);
    assert.ok(sec.questionGroups && sec.questionGroups.length > 0, `Test ${num} Sec ${sIdx + 1} has no questionGroups`);
    sec.questionGroups.forEach(g => {
      assert.ok(g.questions && g.questions.length > 0, `Group ${g.id} has no questions`);
      g.questions.forEach(q => {
        count++;
        assert.ok(q.id !== undefined, `Question missing id in Test ${num}`);
        assert.ok(q.questionNumber !== undefined, `Question missing questionNumber in Test ${num}`);
        assert.ok(q.correctAnswer, `Question ${q.questionNumber} missing correctAnswer in Test ${num}`);
        assert.ok(q.explanationEn, `Question ${q.questionNumber} missing explanationEn in Test ${num}`);
        assert.ok(q.evidence, `Question ${q.questionNumber} missing evidence in Test ${num}`);
      });
    });
  });

  assert.strictEqual(count, 40, `Test ${num} must contain exactly 40 questions, found ${count}`);
  console.log(`  -> Test ${num}: 40/40 questions verified successfully!`);
});

// Check Registration in INITIAL_READING_TESTS
console.log('Verifying INITIAL_READING_TESTS registration...');
['101-reading-test-30', '101-reading-test-31', '101-reading-test-32', '101-reading-test-33'].forEach(id => {
  const found = INITIAL_READING_TESTS.find(t => t.id === id);
  assert.ok(found, `Test ${id} not found in INITIAL_READING_TESTS`);
});
console.log('  -> All 4 tests found registered in INITIAL_READING_TESTS!');

// Check Batch 8 Micro Drills
console.log('Verifying Micro-Drills for Batch 8...');
const drillIds = [
  'drill-101-batch8-tfng-30',
  'drill-101-batch8-summary-31',
  'drill-101-batch8-summary-32',
  'drill-101-batch8-table-33'
];
drillIds.forEach(id => {
  const drill = READING_MICRO_DRILLS.find(d => d.id === id);
  assert.ok(drill, `Micro-drill ${id} not found`);
  assert.ok(drill.titleEn, `Micro-drill ${id} missing titleEn`);
  assert.ok(drill.explanationEn, `Micro-drill ${id} missing explanationEn`);
});
console.log('  -> All 4 Micro-Drills verified!');

// Check Batch 8 Arena Questions
console.log('Verifying Arena Questions for Batch 8...');
const arenaIds = [
  'arena_101_read_ant_streptomyces_44',
  'arena_101_read_bittern_conservation_45',
  'arena_101_read_alex_parrot_cognition_46',
  'arena_101_read_classroom_acoustics_47'
];
const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

arenaIds.forEach(id => {
  const q = ARENA_101_READING_QUESTIONS.find(item => item.id === id);
  assert.ok(q, `Arena question ${id} not found`);
  assert.ok(q.promptEn, `Arena question ${id} missing promptEn`);
  assert.ok(q.optionsEn && q.optionsEn.length === 4, `Arena question ${id} optionsEn must have 4 items`);
  assert.ok(q.correctAnswerEn, `Arena question ${id} missing correctAnswerEn`);
  assert.ok(q.explanationEn, `Arena question ${id} missing explanationEn`);

  // Verify English mode fields have 0% Vietnamese
  assert.ok(!vietnameseRegex.test(q.promptEn), `Arena question ${id} promptEn contains Vietnamese`);
  assert.ok(!vietnameseRegex.test(q.contextEn), `Arena question ${id} contextEn contains Vietnamese`);
  assert.ok(!vietnameseRegex.test(q.correctAnswerEn), `Arena question ${id} correctAnswerEn contains Vietnamese`);
  assert.ok(!vietnameseRegex.test(q.explanationEn), `Arena question ${id} explanationEn contains Vietnamese`);
  q.optionsEn.forEach((opt, idx) => {
    assert.ok(!vietnameseRegex.test(opt), `Arena question ${id} optionsEn[${idx}] contains Vietnamese`);
  });
});
console.log('  -> All 4 Arena Questions verified with 100% pure English UI compliance!');

console.log('🎉 ALL BATCH 8 VERIFICATION CHECKS PASSED PERFECTLY!');
