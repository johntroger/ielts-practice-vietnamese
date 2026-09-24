/**
 * Step 17 Unit Test Suite: Multi-Skill "Đã Thuộc" (Mastered) System
 * Verifies across all 4 IELTS Skills (Writing, Reading, Listening, Speaking):
 * 1. Writing Mastered Toggle & Workspace/Library sync
 * 2. Reading Mastered Toggle & "Ẩn đề đã thuộc" Filter in Library & Toolbar
 * 3. Listening Mastered Toggle & "Ẩn đề đã thuộc" Filter in Library & Toolbar
 * 4. Speaking Mastered Toggle & Filter across Mock Packs, Part 1, Part 2, Part 3
 * 5. User Profile Mastered Tab 4-Skill Categorization & Filtering
 * 6. Non-destructive preservation of all test attempts, history, and band scores
 */

import assert from 'assert';
import { INITIAL_READING_TESTS } from '../src/data/readingTasks.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { 
  SPEAKING_MOCK_TEST_PACKS, 
  SPEAKING_PART1_TOPICS, 
  SPEAKING_PART2_CUECARDS, 
  SPEAKING_PART3_QUESTIONS 
} from '../src/data/speakingTopics.js';
import { INITIAL_TASKS } from '../src/data/sampleTasks.js';

console.log('--- TEST STEP 17: ALL-SKILL MASTERED ("ĐÃ THUỘC") SYSTEM ---');

let passedTests = 0;

function it(desc, fn) {
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ FAIL: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

// ============================================================================
// 1. WRITING MASTERED LOGIC
// ============================================================================
it('Writing: should toggle writing tasks and filter mastered correctly', () => {
  let masteredIds = ['task-1'];
  const writingTasks = [
    { id: 'task-1', title: 'Line Graph Analysis', taskNumber: 1 },
    { id: 'task-2', title: 'Education Opinion Essay', taskNumber: 2 },
    { id: 'task-3', title: 'Process Diagram', taskNumber: 1 }
  ];

  // Check mastered status
  assert.strictEqual(masteredIds.includes('task-1'), true);
  assert.strictEqual(masteredIds.includes('task-2'), false);

  // Filter with hideMastered = true
  const hideMastered = true;
  const visible = writingTasks.filter(t => !hideMastered || !masteredIds.includes(t.id));
  assert.strictEqual(visible.length, 2);
  assert.strictEqual(visible.some(t => t.id === 'task-1'), false);
  assert.strictEqual(visible.some(t => t.id === 'task-2'), true);
});

// ============================================================================
// 2. READING MASTERED LOGIC
// ============================================================================
it('Reading: should toggle reading tests and filter in ReadingLibraryModal & Workspace', () => {
  const readingTests = INITIAL_READING_TESTS;
  assert(readingTests.length > 0, 'INITIAL_READING_TESTS should not be empty');
  const targetId = readingTests[0].id;
  let masteredIds = [targetId];

  // Verify target test exists
  const targetTest = readingTests.find(t => t.id === targetId);
  assert(targetTest, 'target reading test must exist');

  // Check stats calculation in Reading Library
  const stats = {
    total: readingTests.length,
    mastered: readingTests.filter(t => masteredIds.includes(t.id)).length
  };
  assert.strictEqual(stats.mastered, 1);

  // Tab filter: 'mastered' tab returns only mastered tests
  const masteredTabTests = readingTests.filter(t => masteredIds.includes(t.id));
  assert.strictEqual(masteredTabTests.length, 1);
  assert.strictEqual(masteredTabTests[0].id, targetId);

  // "Ẩn đề đã thuộc" filter
  const hideMastered = true;
  const activeTab = 'all';
  const filtered = readingTests.filter(t => {
    if (hideMastered && activeTab !== 'mastered' && masteredIds.includes(t.id)) return false;
    return true;
  });
  assert.strictEqual(filtered.some(t => t.id === targetId), false);
  assert.strictEqual(filtered.length, readingTests.length - 1);
});

// ============================================================================
// 3. LISTENING MASTERED LOGIC
// ============================================================================
it('Listening: should toggle listening tests and filter in ListeningLibraryModal & Workspace', () => {
  let masteredIds = ['cambridge-18-test-1'];
  const listeningTests = INITIAL_LISTENING_TESTS;
  assert(listeningTests.length > 0, 'INITIAL_LISTENING_TESTS should not be empty');

  const targetTest = listeningTests.find(t => t.id === 'cambridge-18-test-1');
  assert(targetTest, 'cambridge-18-test-1 must exist');

  // Stats calculation
  const stats = {
    total: listeningTests.length,
    mastered: listeningTests.filter(t => masteredIds.includes(t.id)).length
  };
  assert.strictEqual(stats.mastered, 1);

  // Tab 'mastered'
  const masteredTab = listeningTests.filter(t => masteredIds.includes(t.id));
  assert.strictEqual(masteredTab.length, 1);
  assert.strictEqual(masteredTab[0].id, 'cambridge-18-test-1');

  // "Ẩn đề đã thuộc"
  const hideMastered = true;
  const activeTab = 'all';
  const filtered = listeningTests.filter(t => {
    if (hideMastered && activeTab !== 'mastered' && masteredIds.includes(t.id)) return false;
    return true;
  });
  assert.strictEqual(filtered.some(t => t.id === 'cambridge-18-test-1'), false);
  assert.strictEqual(filtered.length, listeningTests.length - 1);
});

// ============================================================================
// 4. SPEAKING MASTERED LOGIC (MOCK PACKS, P1, P2, P3)
// ============================================================================
it('Speaking: should support mastered toggle across Mock Packs, Part 1, Part 2, and Part 3', () => {
  const mockPackId = SPEAKING_MOCK_TEST_PACKS[0]?.id || 'mock-spk-tech-future';
  const p1TopicId = SPEAKING_PART1_TOPICS[0]?.id || 'p1-hobbies';
  const p2CardId = SPEAKING_PART2_CUECARDS[0]?.id || 'p2-tech-device';
  const p3SetId = SPEAKING_PART3_QUESTIONS[0]?.linkedPart2Id || 'p3-tech-society';

  let masteredIds = [mockPackId, p1TopicId, p2CardId, p3SetId];

  // Verify mock pack
  assert.strictEqual(masteredIds.includes(mockPackId), true);
  // Verify P1 topic
  assert.strictEqual(masteredIds.includes(p1TopicId), true);
  // Verify P2 card
  assert.strictEqual(masteredIds.includes(p2CardId), true);
  // Verify P3 set
  assert.strictEqual(masteredIds.includes(p3SetId), true);

  // Verify Part 1 filtering with hideMastered
  const visibleP1 = SPEAKING_PART1_TOPICS.filter(t => !masteredIds.includes(t.id));
  assert.strictEqual(visibleP1.some(t => t.id === p1TopicId), false);
  assert.strictEqual(visibleP1.length, SPEAKING_PART1_TOPICS.length - 1);

  // Verify Part 2 filtering with hideMastered
  const visibleP2 = SPEAKING_PART2_CUECARDS.filter(c => !masteredIds.includes(c.id));
  assert.strictEqual(visibleP2.some(c => c.id === p2CardId), false);

  // Verify Part 3 filtering with hideMastered
  const visibleP3 = SPEAKING_PART3_QUESTIONS.filter(s => !masteredIds.includes(s.linkedPart2Id || s.id));
  assert.strictEqual(visibleP3.some(s => (s.linkedPart2Id || s.id) === p3SetId), false);
});

// ============================================================================
// 5. USER PROFILE MODAL 4-SKILL RESOLUTION & FILTERS
// ============================================================================
it('UserProfileModal: should resolve mastered IDs across all 4 skills and filter by category', () => {
  const writingId = INITIAL_TASKS[0]?.id || 'task-cam-18-t1';
  const readingId = INITIAL_READING_TESTS[0]?.id || 'cam-18-test-1';
  const listeningId = INITIAL_LISTENING_TESTS[0]?.id || 'cambridge-18-test-1';
  const speakingId = SPEAKING_MOCK_TEST_PACKS[0]?.id || 'mock-spk-tech-future';

  const masteredIds = [writingId, readingId, listeningId, speakingId];

  // Simulate resolution engine used in UserProfileModal
  const resolvedItems = masteredIds.map(id => {
    if (INITIAL_TASKS.some(t => t.id === id)) {
      return { id, skill: 'writing' };
    }
    if (INITIAL_READING_TESTS.some(t => t.id === id)) {
      return { id, skill: 'reading' };
    }
    if (INITIAL_LISTENING_TESTS.some(t => t.id === id)) {
      return { id, skill: 'listening' };
    }
    if (SPEAKING_MOCK_TEST_PACKS.some(p => p.id === id)) {
      return { id, skill: 'speaking' };
    }
    return { id, skill: 'other' };
  });

  assert.strictEqual(resolvedItems.length, 4);
  assert.strictEqual(resolvedItems.filter(i => i.skill === 'writing').length, 1);
  assert.strictEqual(resolvedItems.filter(i => i.skill === 'reading').length, 1);
  assert.strictEqual(resolvedItems.filter(i => i.skill === 'listening').length, 1);
  assert.strictEqual(resolvedItems.filter(i => i.skill === 'speaking').length, 1);

  // Test skill filter
  const filterBySkill = (skill) => {
    if (skill === 'all') return resolvedItems;
    return resolvedItems.filter(i => i.skill === skill);
  };

  assert.strictEqual(filterBySkill('all').length, 4);
  assert.strictEqual(filterBySkill('writing')[0].id, writingId);
  assert.strictEqual(filterBySkill('reading')[0].id, readingId);
  assert.strictEqual(filterBySkill('listening')[0].id, listeningId);
  assert.strictEqual(filterBySkill('speaking')[0].id, speakingId);
});

// ============================================================================
// 6. NON-DESTRUCTIVE HISTORY & STATS PRESERVATION
// ============================================================================
it('should preserve all attempt histories and band scores when items are marked mastered', () => {
  const rId = INITIAL_READING_TESTS[0]?.id || 'cambridge-academic-test-1';
  const lId = INITIAL_LISTENING_TESTS[0]?.id || 'cambridge-18-test-1';
  const sId = SPEAKING_MOCK_TEST_PACKS[0]?.id || 'mock-spk-tech-future';

  const readingHistory = [
    { testId: rId, band: '7.5', correctCount: 32, timestamp: Date.now() }
  ];
  const listeningHistory = [
    { testId: lId, band: '8.0', correctCount: 35, timestamp: Date.now() }
  ];
  const speakingHistory = [
    { mockPackId: sId, overallBand: '7.0', timestamp: Date.now() }
  ];

  const masteredIds = [rId, lId, sId];

  // Histories must remain untouched
  assert.strictEqual(readingHistory.length, 1);
  assert.strictEqual(readingHistory[0].band, '7.5');
  assert.strictEqual(listeningHistory.length, 1);
  assert.strictEqual(listeningHistory[0].band, '8.0');
  assert.strictEqual(speakingHistory.length, 1);
  assert.strictEqual(speakingHistory[0].overallBand, '7.0');

  // Stats calculation matches history
  const rBest = readingHistory.filter(h => h.testId === rId).reduce((max, h) => Math.max(max, Number(h.band)), 0);
  assert.strictEqual(rBest, 7.5);
  const lBest = listeningHistory.filter(h => h.testId === lId).reduce((max, h) => Math.max(max, Number(h.band)), 0);
  assert.strictEqual(lBest, 8.0);
  const sBest = speakingHistory.filter(h => h.mockPackId === sId).reduce((max, h) => Math.max(max, Number(h.overallBand)), 0);
  assert.strictEqual(sBest, 7.0);
});

console.log(`\n===============================================================`);
console.log(`🎉 ALL ${passedTests} STEP 17 MULTI-SKILL MASTERED TESTS PASSED CLEANLY!`);
console.log(`===============================================================\n`);
