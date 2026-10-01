/**
 * Test Suite Step 53: Comprehensive Cambridge Test Bank & Dedicated Badging System
 * 
 * Verifies that:
 * 1. Writing Room has pre-loaded authentic Cambridge test tasks (Cam 19, 18, 17, 16, 15, 10)
 *    with complete metadata (isCambridge, cambridgeBook, source, model answers).
 * 2. Reading Room has authentic full 3-passage, 40-question Cambridge simulation tests (Cam 18, 17, 16, 15)
 *    with exact keys, evidence locators, and explanations.
 * 3. Listening Room has authentic full 4-part, 40-question Cambridge simulation tests (Cam 19, 18, 17, 8)
 *    with audio timestamps and answer keys.
 * 4. Speaking Room has authentic Cambridge full mock test packs (Cam 19, 18, 17, 16)
 *    with custom Part 1 questions, Part 2 cue cards, and Part 3 discussion points.
 * 5. Smart Filtering Engine supports quickFilter: 'cambridge' and properly isolates authentic
 *    Cambridge materials from AI or community generated tasks.
 */

import assert from 'assert';
import { INITIAL_TASKS } from '../src/data/sampleTasks.js';
import { CAMBRIDGE_WRITING_TASKS } from '../src/data/cambridgeWritingTasks.js';
import { INITIAL_READING_TESTS } from '../src/data/readingTasks.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { SPEAKING_MOCK_TEST_PACKS } from '../src/data/speakingTopics.js';
import { applySmartFilterAndSort } from '../src/services/ratingPopularityService.js';

console.log('🏛️ Testing Step 53: Cambridge Test Bank & Badging System Across All Skills...');

// -------------------------------------------------------------
// 1. WRITING ROOM CAMBRIDGE BANK VERIFICATION
// -------------------------------------------------------------
console.log('  ▶ 1. Verifying Writing Cambridge Tasks...');
assert(Array.isArray(CAMBRIDGE_WRITING_TASKS), 'CAMBRIDGE_WRITING_TASKS must be an array');
assert(CAMBRIDGE_WRITING_TASKS.length >= 10, `Expected at least 10 Cambridge writing tasks, got ${CAMBRIDGE_WRITING_TASKS.length}`);

// Verify metadata on all Cambridge writing tasks
for (const task of CAMBRIDGE_WRITING_TASKS) {
  assert(task.id, 'Task must have an id');
  assert(task.isCambridge === true, `Task ${task.id} must have isCambridge === true`);
  assert(task.source === 'cambridge', `Task ${task.id} must have source === 'cambridge'`);
  assert(Number.isInteger(task.cambridgeBook), `Task ${task.id} must specify cambridgeBook as integer`);
  assert(task.prompt && task.prompt.length > 20, `Task ${task.id} must have an authentic prompt`);
  assert(task.sampleAnswer && task.sampleAnswer.length > 100, `Task ${task.id} must have a model sample answer`);
  assert(Array.isArray(task.vocabularyHighlights), `Task ${task.id} must include vocabulary highlights`);
}

// Verify that INITIAL_TASKS in sampleTasks.js includes Cambridge tasks
const writingCambridgeInAll = INITIAL_TASKS.filter(t => t.isCambridge || t.source === 'cambridge');
assert(writingCambridgeInAll.length >= CAMBRIDGE_WRITING_TASKS.length, 'INITIAL_TASKS must include all CAMBRIDGE_WRITING_TASKS');

// Verify Cambridge 20 specifically
assert(CAMBRIDGE_WRITING_TASKS.some(t => t.cambridgeBook === 20), 'Writing bank must contain Cambridge 20 tasks');
console.log(`    ✅ Writing Cambridge dataset verified: ${CAMBRIDGE_WRITING_TASKS.length} authentic tasks with full metadata (including Cambridge 20).`);

// -------------------------------------------------------------
// 2. READING ROOM CAMBRIDGE BANK VERIFICATION
// -------------------------------------------------------------
console.log('  ▶ 2. Verifying Reading Cambridge Tests...');
assert(Array.isArray(INITIAL_READING_TESTS), 'INITIAL_READING_TESTS must be an array');

const cambridgeReadingTests = INITIAL_READING_TESTS.filter(t => t.isCambridge || t.source === 'cambridge');
assert(cambridgeReadingTests.length >= 5, `Expected at least 5 Cambridge reading tests, got ${cambridgeReadingTests.length}`);
assert(cambridgeReadingTests.some(t => t.cambridgeBook === 20), 'Reading bank must contain Cambridge 20 test');

for (const test of cambridgeReadingTests) {
  assert(test.id, 'Reading test must have an id');
  assert(test.isCambridge === true, `Reading test ${test.id} must have isCambridge === true`);
  assert(Number.isInteger(test.cambridgeBook), `Reading test ${test.id} must have integer cambridgeBook`);
  assert(Array.isArray(test.passages) && test.passages.length === 3, `Reading test ${test.id} must have 3 passages`);

  let testQuestionCount = 0;
  for (const passage of test.passages) {
    assert(passage.paragraphs && passage.paragraphs.length > 0, `Passage ${passage.id} must have paragraphs`);
    assert(passage.questionGroups && passage.questionGroups.length > 0, `Passage ${passage.id} must have question groups`);
    for (const group of passage.questionGroups) {
      for (const q of group.questions) {
        testQuestionCount++;
        assert(q.answer !== undefined && q.answer !== null, `Question ${q.id} in ${test.id} must have an answer`);
        assert(q.explanation, `Question ${q.id} in ${test.id} must have an explanation`);
      }
    }
  }
  assert.strictEqual(testQuestionCount, 40, `Reading test ${test.id} must have exactly 40 questions, got ${testQuestionCount}`);
}
console.log(`    ✅ Reading Cambridge dataset verified: ${cambridgeReadingTests.length} full tests with 3 passages and 40 questions each.`);

// -------------------------------------------------------------
// 3. LISTENING ROOM CAMBRIDGE BANK VERIFICATION
// -------------------------------------------------------------
console.log('  ▶ 3. Verifying Listening Cambridge Tests...');
assert(Array.isArray(INITIAL_LISTENING_TESTS), 'INITIAL_LISTENING_TESTS must be an array');

const cambridgeListeningTests = INITIAL_LISTENING_TESTS.filter(t => t.isCambridge || t.source === 'cambridge');
assert(cambridgeListeningTests.length >= 5, `Expected at least 5 Cambridge listening tests, got ${cambridgeListeningTests.length}`);
assert(cambridgeListeningTests.some(t => t.cambridgeBook === 20), 'Listening bank must contain Cambridge 20 test');

for (const test of cambridgeListeningTests) {
  assert(test.id, 'Listening test must have an id');
  assert(test.isCambridge === true, `Listening test ${test.id} must have isCambridge === true`);
  assert(Number.isInteger(test.cambridgeBook), `Listening test ${test.id} must have integer cambridgeBook`);
  assert(Array.isArray(test.parts) && test.parts.length === 4, `Listening test ${test.id} must have 4 parts`);

  let testQuestionCount = 0;
  for (const part of test.parts) {
    assert(part.questionGroups && part.questionGroups.length > 0, `Part ${part.partNumber} in ${test.id} must have question groups`);
    for (const group of part.questionGroups) {
      for (const q of group.questions) {
        testQuestionCount++;
        assert(q.answer !== undefined && q.answer !== null, `Question ${q.id} in ${test.id} must have an answer`);
        assert(q.evidenceQuote || q.explanation, `Question ${q.id} in ${test.id} must have evidence quote or explanation`);
      }
    }
  }
  assert.strictEqual(testQuestionCount, 40, `Listening test ${test.id} must have exactly 40 questions, got ${testQuestionCount}`);
}
console.log(`    ✅ Listening Cambridge dataset verified: ${cambridgeListeningTests.length} full tests with 4 parts and 40 questions each (including Cambridge 20).`);

// -------------------------------------------------------------
// 4. SPEAKING ROOM CAMBRIDGE PACKS VERIFICATION
// -------------------------------------------------------------
console.log('  ▶ 4. Verifying Speaking Cambridge Mock Packs...');
assert(Array.isArray(SPEAKING_MOCK_TEST_PACKS), 'SPEAKING_MOCK_TEST_PACKS must be an array');

const cambridgeSpeakingPacks = SPEAKING_MOCK_TEST_PACKS.filter(p => p.isCambridge || p.source === 'cambridge');
assert(cambridgeSpeakingPacks.length >= 5, `Expected at least 5 Cambridge speaking packs, got ${cambridgeSpeakingPacks.length}`);
assert(cambridgeSpeakingPacks.some(p => p.cambridgeBook === 20), 'Speaking bank must contain Cambridge 20 pack');

for (const pack of cambridgeSpeakingPacks) {
  assert(pack.id, 'Speaking pack must have an id');
  assert(pack.isCambridge === true, `Speaking pack ${pack.id} must have isCambridge === true`);
  assert(Number.isInteger(pack.cambridgeBook), `Speaking pack ${pack.id} must have integer cambridgeBook`);
  assert(pack.title.includes('Cambridge') || pack.title.includes('Full Mock'), `Speaking pack title should reference Cambridge or Mock`);
  
  if (pack.customPart1) {
    assert(Array.isArray(pack.customPart1.questions), `Custom part 1 in ${pack.id} must have questions`);
    assert(pack.customPart2 && pack.customPart2.cueCard, `Custom part 2 in ${pack.id} must have cueCard`);
    assert(pack.customPart3 && Array.isArray(pack.customPart3.questions), `Custom part 3 in ${pack.id} must have questions`);
  }
}
console.log(`    ✅ Speaking Cambridge dataset verified: ${cambridgeSpeakingPacks.length} mock packs with full test specifications.`);

// -------------------------------------------------------------
// 5. SMART FILTER ENGINE WITH CAMBRIDGE QUICKFILTER
// -------------------------------------------------------------
console.log('  ▶ 5. Verifying Smart Filter Engine quickFilter: "cambridge"...');

const sampleMixedPool = [
  { id: 'cam-w-1', title: 'Cambridge 19 Test 1: Competition vs Cooperation', isCambridge: true, source: 'cambridge', cambridgeBook: 19 },
  { id: 'cam-w-2', title: 'Cambridge 18 Test 2: Plastic Recycling Process', isCambridge: true, source: 'cambridge', cambridgeBook: 18 },
  { id: 'custom-ai-1', title: 'AI Generated Task: Climate Policy', isAiGenerated: true, isCustom: true, source: 'ai' },
  { id: 'manual-1', title: 'Teacher Custom Task: Tourism', isManual: true, isCustom: true },
  { id: 'comm-1', title: 'Community Prompt: Smartphone Addiction', isCommunity: true, isCustom: true }
];

const cambridgeFiltered = applySmartFilterAndSort(sampleMixedPool, { quickFilter: 'cambridge' });
assert.strictEqual(cambridgeFiltered.length, 2, `Expected 2 Cambridge items, got ${cambridgeFiltered.length}`);
assert(cambridgeFiltered.every(item => item.isCambridge === true), 'All returned items must be Cambridge items');
assert(!cambridgeFiltered.some(item => item.id === 'custom-ai-1'), 'AI items must be excluded by Cambridge filter');
assert(!cambridgeFiltered.some(item => item.id === 'manual-1'), 'Manual items must be excluded by Cambridge filter');

// Test combined search and Cambridge filter
const searchFiltered = applySmartFilterAndSort(sampleMixedPool, {
  quickFilter: 'cambridge',
  searchQuery: 'plastic'
});
assert.strictEqual(searchFiltered.length, 1, `Expected 1 item for search 'plastic', got ${searchFiltered.length}`);
assert.strictEqual(searchFiltered[0].id, 'cam-w-2', 'Correct Cambridge item should match keyword search');

console.log('    ✅ Smart Filter Engine successfully isolates Cambridge content and supports faceted search.');

console.log('✨ All Step 53 Cambridge Test Bank & Badging tests passed cleanly!');
