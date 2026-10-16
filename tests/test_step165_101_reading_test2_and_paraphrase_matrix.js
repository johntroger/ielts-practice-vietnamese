/**
 * Step 165 Test Suite: 101 IELTS Reading Past Papers Test 2 & Paraphrase Matrix
 */

import { pastPaper101Test2 } from '../src/data/reading/pastPaper101Test2.js';
import { INITIAL_READING_TESTS } from '../src/data/readingTasks.js';
import { scoreReadingExam } from '../src/utils/readingScorer.js';
import fs from 'fs';

console.log('🧪 Running Step 165: Test 2 & Paraphrase Matrix Verification Suite...\n');

// 1. Verify Test 2 dataset structure
console.log('Test 1: Verify pastPaper101Test2 dataset structure, passages and question count...');
if (!pastPaper101Test2 || pastPaper101Test2.id !== 'past-paper-101-reading-test-2') {
  throw new Error('pastPaper101Test2 id mismatch');
}
if (pastPaper101Test2.passages.length !== 3) {
  throw new Error(`Expected 3 passages, got ${pastPaper101Test2.passages.length}`);
}

const totalQ = pastPaper101Test2.passages.reduce((sum, p) => {
  return sum + p.questionGroups.reduce((gSum, g) => gSum + g.questions.length, 0);
}, 0);
if (totalQ !== 40) {
  throw new Error(`Expected 40 questions in pastPaper101Test2, got ${totalQ}`);
}
console.log('  ✅ Test 1 Passed: pastPaper101Test2 contains exactly 3 passages and 40 questions.');

// 2. Verify registration in INITIAL_READING_TESTS
console.log('Test 2: Verify pastPaper101Test2 is in INITIAL_READING_TESTS...');
const foundTest2 = INITIAL_READING_TESTS.find(t => t.id === 'past-paper-101-reading-test-2');
if (!foundTest2) {
  throw new Error('pastPaper101Test2 not found in INITIAL_READING_TESTS');
}
console.log('  ✅ Test 2 Passed: pastPaper101Test2 is registered in INITIAL_READING_TESTS.');

// 3. Verify acceptableAlternatives / acceptableAnswers scoring
console.log('Test 3: Verify scoring engine handles acceptableAlternatives...');
const mockQ = {
  id: 8,
  order: 8,
  type: 'short_answer',
  answer: 'bony carapace',
  acceptableAlternatives: ['the bony carapace', 'bony carapace', 'carapace']
};
const res1 = scoreReadingExam({
  userAnswers: { 8: 'the bony carapace' },
  questionsData: [mockQ]
});
if (!res1.questionsBreakdown[0].isCorrect) {
  throw new Error('Scorer failed to match acceptable alternative "the bony carapace"');
}
console.log('  ✅ Test 3 Passed: Scorer engine correctly scores acceptableAlternatives.');

// 4. Verify ReadingResultModal contains Paraphrase Matrix tab and Jump to Evidence
console.log('Test 4: Verify ReadingResultModal.jsx has paraphrase_matrix tab...');
const modalContent = fs.readFileSync('src/components/reading/ReadingResultModal.jsx', 'utf8');
if (!modalContent.includes('paraphrase_matrix') || !modalContent.includes('Jump to Evidence in Passage')) {
  throw new Error('ReadingResultModal missing paraphrase_matrix or Jump to Evidence logic');
}
console.log('  ✅ Test 4 Passed: ReadingResultModal contains Paraphrase Matrix & Jump to Evidence.');

// 5. Verify QuestionPaletteBar aligns with bandResult
console.log('Test 5: Verify QuestionPaletteBar.jsx uses bandResult.questionsBreakdown...');
const paletteContent = fs.readFileSync('src/components/reading/QuestionPaletteBar.jsx', 'utf8');
if (!paletteContent.includes('bandResult?.questionsBreakdown?.find')) {
  throw new Error('QuestionPaletteBar does not align with bandResult diagnostics');
}
console.log('  ✅ Test 5 Passed: QuestionPaletteBar is aligned with official bandResult diagnostics.');

console.log('\n🎉 Step 165: ALL VERIFICATIONS PASSED CLEANLY (100%)!');
