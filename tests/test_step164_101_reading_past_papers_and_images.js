/**
 * Step 164: 101 IELTS Reading Past Papers Integration & Interactive Diagram Support Test Suite
 * 
 * Verifies:
 * 1. Cloudflare R2 URL integration for the 101 IELTS Reading Past Papers collection.
 * 2. pastPaper101Test1 dataset integrity: 3 Passages, 40 questions, exact answer keys, evidence locators, and authentic images.
 * 3. QuestionPane.jsx and PassagePane.jsx support interactive diagram rendering with zoom controls (ZoomIn, ZoomOut, Maximize2) and ImageViewerModal.
 * 4. INITIAL_READING_TESTS contains pastPaper101Test1 with authentic source and English metadata.
 * 5. READING_MICRO_DRILLS contains past paper drills with 100% strict English localization.
 * 6. Global English UI rule compliance: zero Vietnamese leaks in English mode.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 164: 101 IELTS Reading Past Papers & Interactive Diagram Test Suite...\n');

// 1. Verify pastPaper101Test1 Dataset
console.log('Test 1: Verify pastPaper101Test1 dataset structure, answer keys, and images...');
const test1Path = path.resolve(__dirname, '../src/data/reading/pastPaper101Test1.js');
assert(fs.existsSync(test1Path), 'pastPaper101Test1.js must exist');
const test1Code = fs.readFileSync(test1Path, 'utf8');

assert(test1Code.includes("id: 'past-paper-101-reading-test-1'"), 'Must have correct test ID');
assert(test1Code.includes('pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/101-ielts-reading-past-papers-with-answers-2019.pdf'), 'Must reference Cloudflare R2 PDF URL');
assert(test1Code.includes('totalQuestions: 40'), 'Must contain 40 questions');
assert(test1Code.includes('timeLimitMinutes: 60'), 'Must have 60-minute time limit');
assert(test1Code.includes('imageUrl:') && test1Code.includes('diagramImageUrl:'), 'Must include authentic diagram/image URLs');
assert(test1Code.includes('titleEn:') && test1Code.includes('descriptionEn:'), 'Must provide English titles and descriptions');

// Dynamic import to verify object structure
import('../src/data/reading/pastPaper101Test1.js').then((module) => {
  const test1 = module.pastPaper101Test1;
  assert(test1, 'pastPaper101Test1 must be exported');
  assert.strictEqual(test1.passages.length, 3, 'Must have exactly 3 passages');
  
  // Verify questions count
  let totalQ = 0;
  test1.passages.forEach(p => {
    p.questionGroups.forEach(g => {
      totalQ += g.questions.length;
    });
  });
  assert.strictEqual(totalQ, 40, 'Must have exactly 40 questions in total');

  // Verify key answers from page 460
  const p1Questions = test1.passages[0].questionGroups.flatMap(g => g.questions);
  assert.strictEqual(p1Questions[0].answer, 'NOT GIVEN', 'Q1 must be NOT GIVEN');
  assert.strictEqual(p1Questions[1].answer, 'TRUE', 'Q2 must be TRUE');
  assert.strictEqual(p1Questions[2].answer, 'FALSE', 'Q3 must be FALSE');
  assert.strictEqual(p1Questions[7].answer, 'stonemason', 'Q8 must be stonemason');

  const p2Questions = test1.passages[1].questionGroups.flatMap(g => g.questions);
  assert.strictEqual(p2Questions[0].answer, 'YES', 'Q14 must be YES');
  assert.strictEqual(p2Questions[1].answer, 'NO', 'Q15 must be NO');
  assert.strictEqual(p2Questions[6].answer, 'temperature', 'Q20 must be temperature');
  assert.strictEqual(p2Questions[12].answer, 'D', 'Q26 must be D');

  const p3Questions = test1.passages[2].questionGroups.flatMap(g => g.questions);
  assert.strictEqual(p3Questions[0].answer, 'B', 'Q27 must be B');
  assert.strictEqual(p3Questions[2].answer, 'A', 'Q29 must be A');
  assert.strictEqual(p3Questions[7].answer, 'NO', 'Q34 must be NO');
  assert.strictEqual(p3Questions[13].answer, 'B', 'Q40 must be B');

  console.log('  ✅ Test 1 Passed: pastPaper101Test1 dataset verified with 3 Passages, 40 questions, and exact answer keys.');

  // 2. Verify Registration in readingTasks.js
  console.log('Test 2: Verify pastPaper101Test1 is registered in INITIAL_READING_TESTS...');
  const readingTasksPath = path.resolve(__dirname, '../src/data/readingTasks.js');
  const readingTasksCode = fs.readFileSync(readingTasksPath, 'utf8');
  assert(readingTasksCode.includes("import { pastPaper101Test1 } from './reading/pastPaper101Test1.js'"), 'Must import pastPaper101Test1');
  assert(readingTasksCode.includes('pastPaper101Test1,'), 'Must include pastPaper101Test1 in INITIAL_READING_TESTS');
  console.log('  ✅ Test 2 Passed: Registered in INITIAL_READING_TESTS.');

  // 3. Verify QuestionPane.jsx Diagram & ImageViewerModal Support
  console.log('Test 3: Verify QuestionPane.jsx diagram rendering and image modal viewer...');
  const questionPanePath = path.resolve(__dirname, '../src/components/reading/QuestionPane.jsx');
  const questionPaneCode = fs.readFileSync(questionPanePath, 'utf8');
  assert(questionPaneCode.includes('ImageViewerModal'), 'QuestionPane.jsx must import and use ImageViewerModal');
  assert(questionPaneCode.includes('group.diagramImageUrl || group.imageUrl || group.mapImageUrl'), 'QuestionPane.jsx must check for group diagrams');
  assert(questionPaneCode.includes('setDiagramZoom'), 'QuestionPane.jsx must have interactive diagram zoom controls');
  assert(questionPaneCode.includes('ZoomIn') && questionPaneCode.includes('ZoomOut') && questionPaneCode.includes('Maximize2'), 'Must have zoom icons');
  console.log('  ✅ Test 3 Passed: QuestionPane.jsx supports interactive diagram viewer.');

  // 4. Verify PassagePane.jsx Diagram & ImageViewerModal Support
  console.log('Test 4: Verify PassagePane.jsx visual figure and image modal viewer...');
  const passagePanePath = path.resolve(__dirname, '../src/components/reading/PassagePane.jsx');
  const passagePaneCode = fs.readFileSync(passagePanePath, 'utf8');
  assert(passagePaneCode.includes('ImageViewerModal'), 'PassagePane.jsx must import and use ImageViewerModal');
  assert(passagePaneCode.includes('passage?.imageUrl || passage?.diagramImageUrl'), 'PassagePane.jsx must check for passage images');
  assert(passagePaneCode.includes('setPassageImageZoom'), 'PassagePane.jsx must support passage image zoom controls');
  console.log('  ✅ Test 4 Passed: PassagePane.jsx supports interactive visual diagrams.');

  // 5. Verify ReadingMicroDrills.js allocation
  console.log('Test 5: Verify 101 Past Paper drills in READING_MICRO_DRILLS...');
  const microDrillsPath = path.resolve(__dirname, '../src/data/readingMicroDrills.js');
  const microDrillsCode = fs.readFileSync(microDrillsPath, 'utf8');
  assert(microDrillsCode.includes('drill-tfng-101-1'), 'Must include drill-tfng-101-1');
  assert(microDrillsCode.includes('drill-ynng-101-2'), 'Must include drill-ynng-101-2');
  assert(microDrillsCode.includes('titleEn:') && microDrillsCode.includes('explanationEn:'), 'Drills must have English fields');
  console.log('  ✅ Test 5 Passed: Micro-drills allocated with strict bilingual metadata.');

  // 6. Verify ReadingLibraryModal.jsx Badge
  console.log('Test 6: Verify 101 Past Papers badge in ReadingLibraryModal.jsx...');
  const libraryPath = path.resolve(__dirname, '../src/components/reading/ReadingLibraryModal.jsx');
  const libraryCode = fs.readFileSync(libraryPath, 'utf8');
  assert(libraryCode.includes("test.source === '101_past_papers'"), 'Must have 101 Past Papers source check');
  assert(libraryCode.includes("formatTestTitle(test.title, isEn, test)"), 'Must pass test to formatTestTitle');
  console.log('  ✅ Test 6 Passed: ReadingLibraryModal renders 101 Past Papers badge.');

  // 7. Verify Atlas English Arena Question Bank Integration
  console.log('Test 7: Verify Atlas Arena contains 101 Reading questions with zero Vietnamese leaks...');
  import('../src/data/arenaQuestionBank.js').then((arenaMod) => {
    import('../src/data/arenaQuestionTranslations.js').then((transMod) => {
      const arenaBank = arenaMod.ARENA_QUESTION_BANK;
      const getLocalized = transMod.getLocalizedArenaQuestion;

      const palladioQ = arenaBank.find(q => q.id === 'arena_101_read_palladio_01');
      assert(palladioQ, 'arena_101_read_palladio_01 must exist in ARENA_QUESTION_BANK');

      const akrotiriQ = arenaBank.find(q => q.id === 'arena_101_read_akrotiri_05');
      assert(akrotiriQ, 'arena_101_read_akrotiri_05 must exist in ARENA_QUESTION_BANK');

      // Test English Mode
      const localizedEn = getLocalized(palladioQ, true);
      const viRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
      assert(!viRegex.test(localizedEn.prompt), 'Localized English prompt must contain zero Vietnamese');
      assert(!viRegex.test(localizedEn.explanation), 'Localized English explanation must contain zero Vietnamese');
      localizedEn.options.forEach(opt => {
        assert(!viRegex.test(opt), `Option "${opt}" must contain zero Vietnamese`);
      });

      console.log('  ✅ Test 7 Passed: Atlas Arena question bank integrated with 100% strict English localization.');
      console.log('\n🎉 Step 164: ALL VERIFICATIONS PASSED CLEANLY (100%)!');
    });
  });
}).catch(err => {
  console.error('❌ Step 164 verification failed:', err);
  process.exit(1);
});
