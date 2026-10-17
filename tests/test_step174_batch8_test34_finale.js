import assert from 'node:assert';
import { pastPaper101Test34 } from '../src/data/reading/pastPaper101Test34.js';
import { INITIAL_READING_TESTS } from '../src/data/readingTasks.js';
import { READING_MICRO_DRILLS } from '../src/data/readingMicroDrills.js';
import { ARENA_101_READING_QUESTIONS } from '../src/data/arenaQuestions101Reading.js';

console.log('🧪 Starting Verification Suite for Test 34 (Grand Finale)...');

// 1. Verify Test 34 structure & questions
console.log('Checking Test 34 (101-reading-test-34)...');
assert.strictEqual(pastPaper101Test34.id, '101-reading-test-34');
assert.strictEqual(pastPaper101Test34.sections.length, 3);

let totalQs = 0;
pastPaper101Test34.sections.forEach((sec, sIdx) => {
  assert.ok(sec.passage && sec.passage.length > 500, `Passage ${sIdx + 1} too short`);
  assert.ok(sec.questionGroups && sec.questionGroups.length > 0, `Section ${sIdx + 1} missing questionGroups`);
  sec.questionGroups.forEach(g => {
    assert.ok(g.questions && g.questions.length > 0, `Group ${g.id} has no questions`);
    g.questions.forEach(q => {
      totalQs++;
      assert.ok(q.id !== undefined, `Question missing id`);
      assert.ok(q.questionNumber !== undefined, `Question missing questionNumber`);
      assert.ok(q.correctAnswer, `Question ${q.questionNumber} missing correctAnswer`);
      assert.ok(q.explanationEn, `Question ${q.questionNumber} missing explanationEn`);
      assert.ok(q.evidence, `Question ${q.questionNumber} missing evidence`);
    });
  });
});
assert.strictEqual(totalQs, 40, `Test 34 must contain exactly 40 questions, found ${totalQs}`);
console.log('  -> Test 34: 40/40 questions verified successfully!');

// 2. Verify Registration in INITIAL_READING_TESTS
console.log('Verifying INITIAL_READING_TESTS registration...');
const foundTest34 = INITIAL_READING_TESTS.find(t => t.id === '101-reading-test-34');
assert.ok(foundTest34, 'Test 34 not found in INITIAL_READING_TESTS');
console.log('  -> Test 34 found registered in INITIAL_READING_TESTS!');

// 3. Verify Micro-Drill
console.log('Verifying Micro-Drill for Test 34...');
const drill = READING_MICRO_DRILLS.find(d => d.id === 'drill-101-test34-longevity');
assert.ok(drill, 'Micro-drill drill-101-test34-longevity not found');
assert.ok(drill.titleEn, 'Micro-drill missing titleEn');
assert.ok(drill.explanationEn, 'Micro-drill missing explanationEn');
console.log('  -> Micro-Drill verified!');

// 4. Verify Arena Question & English UI Compliance
console.log('Verifying Arena Question for Test 34...');
const arenaQ = ARENA_101_READING_QUESTIONS.find(q => q.id === 'arena_101_read_bristlecone_climate_48');
assert.ok(arenaQ, 'Arena question arena_101_read_bristlecone_climate_48 not found');
assert.ok(arenaQ.promptEn, 'Arena question missing promptEn');
assert.ok(arenaQ.optionsEn && arenaQ.optionsEn.length === 4, 'Arena question optionsEn must have 4 items');
assert.ok(arenaQ.correctAnswerEn, 'Arena question missing correctAnswerEn');
assert.ok(arenaQ.explanationEn, 'Arena question missing explanationEn');

const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
assert.ok(!vietnameseRegex.test(arenaQ.promptEn), 'promptEn contains Vietnamese');
assert.ok(!vietnameseRegex.test(arenaQ.contextEn), 'contextEn contains Vietnamese');
assert.ok(!vietnameseRegex.test(arenaQ.correctAnswerEn), 'correctAnswerEn contains Vietnamese');
assert.ok(!vietnameseRegex.test(arenaQ.explanationEn), 'explanationEn contains Vietnamese');
arenaQ.optionsEn.forEach((opt, idx) => {
  assert.ok(!vietnameseRegex.test(opt), `optionsEn[${idx}] contains Vietnamese`);
});
console.log('  -> Arena Question verified with 100% pure English UI compliance!');

// 5. Grand Total Verification across 101 Reading Series
const all101Tests = INITIAL_READING_TESTS.filter(t => t.id && (t.id.startsWith('101-reading-test-') || t.id.startsWith('past-paper-101-reading-test-')));
console.log(`\n🏆 GRAND TOTAL AUDIT: Found ${all101Tests.length} tests from 101 Reading Past Papers in INITIAL_READING_TESTS.`);
assert.strictEqual(all101Tests.length, 34, `Must have all 34 tests registered, found ${all101Tests.length}`);
console.log('🎉 100% OF 101 READING PAST PAPERS (ALL 34 TESTS) INTEGRATED PERFECTLY!');
