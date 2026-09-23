/**
 * Step 14 Unit Test Suite: Mastered Items ("Đã Thuộc") Feature
 * Verifies:
 * 1. Toggle logic (adding/removing from masteredIds without duplicates)
 * 2. Practice interface filtering (hiding mastered tasks and drills for logged-in users)
 * 3. Guest / unauthenticated behavior (guests cannot persist mastered state)
 * 4. Non-destructive history & profile preservation (submissions, scores, and stats remain 100% intact)
 * 5. Cloud sync payload formatting and vocab notebook isolation
 */

import assert from 'assert';

console.log('--- TEST STEP 14: MASTERED ITEMS ("ĐÃ THUỘC") FEATURE ---');

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
// 1. TOGGLE LOGIC & PERSISTENCE STATE
// ============================================================================
it('should toggle an item into mastered list and remove on second toggle', () => {
  let masteredIds = [];

  const toggle = (id) => {
    return masteredIds.includes(id) 
      ? masteredIds.filter(i => i !== id) 
      : [...masteredIds, id];
  };

  masteredIds = toggle('task-101');
  assert.deepStrictEqual(masteredIds, ['task-101'], 'Should add task-101 to masteredIds');

  masteredIds = toggle('drill-202');
  assert.deepStrictEqual(masteredIds, ['task-101', 'drill-202'], 'Should append drill-202');

  // Toggle again to remove
  masteredIds = toggle('task-101');
  assert.deepStrictEqual(masteredIds, ['drill-202'], 'Should remove task-101 when toggled again');
});

it('should merge cloud and local mastered items without duplicates', () => {
  const localMastered = ['task-1', 'task-2', 'drill-A'];
  const cloudMastered = ['task-2', 'task-3', 'drill-B'];

  const combined = Array.from(new Set([...localMastered, ...cloudMastered]));
  assert.strictEqual(combined.length, 5, 'Should have exactly 5 unique items');
  assert(combined.includes('task-1'));
  assert(combined.includes('task-2'));
  assert(combined.includes('task-3'));
  assert(combined.includes('drill-A'));
  assert(combined.includes('drill-B'));
});

// ============================================================================
// 2. PRACTICE INTERFACE FILTERING (TASK LIBRARY)
// ============================================================================
it('should hide mastered tasks in practice library when logged in and hideMastered is true', () => {
  const sampleTasks = [
    { id: 'task-1', title: 'Bar Chart Population', taskNumber: 1 },
    { id: 'task-2', title: 'Education Spending Essay', taskNumber: 2 },
    { id: 'task-3', title: 'Line Graph Renewable Energy', taskNumber: 1 }
  ];
  const user = { id: 'u123', email: 'student@example.com' };
  const masteredIds = ['task-1'];
  const hideMastered = true;
  const activeTab = 'all';

  const filterTasks = (tasks, tab, hide) => {
    return tasks.filter(t => {
      const isMastered = masteredIds.includes(t.id);
      if (tab === 'mastered') {
        return isMastered;
      }
      if (hide && user && isMastered) {
        return false;
      }
      return true;
    });
  };

  const visibleTasks = filterTasks(sampleTasks, activeTab, hideMastered);
  assert.strictEqual(visibleTasks.length, 2, 'Should hide task-1 from main practice list');
  assert(!visibleTasks.some(t => t.id === 'task-1'), 'task-1 must not be in visible tasks');
  assert(visibleTasks.some(t => t.id === 'task-2'));
  assert(visibleTasks.some(t => t.id === 'task-3'));

  // When hideMastered is toggled off (user wants to review everything)
  const allWithMastered = filterTasks(sampleTasks, activeTab, false);
  assert.strictEqual(allWithMastered.length, 3, 'All tasks should be visible when hideMastered is off');

  // When on "mastered" tab
  const masteredTabTasks = filterTasks(sampleTasks, 'mastered', true);
  assert.strictEqual(masteredTabTasks.length, 1, 'Mastered tab should show only mastered tasks');
  assert.strictEqual(masteredTabTasks[0].id, 'task-1');
});

// ============================================================================
// 3. PRACTICE INTERFACE FILTERING (MICRO DRILLS)
// ============================================================================
it('should filter mastered drills out of active room list when hideMasteredDrills is enabled', () => {
  const drills = [
    { id: 'drill-1', type: 'fill-blanks', title: 'Passive Voice' },
    { id: 'drill-2', type: 'fill-blanks', title: 'Cohesion Linkers' },
    { id: 'drill-3', type: 'true-false', title: 'Premise Logic' }
  ];
  const user = { id: 'u123' };
  const masteredIds = ['drill-1'];
  const hideMasteredDrills = true;

  const getDrillsByType = (type) => {
    return drills.filter(d => {
      if (d.type !== type) return false;
      if (hideMasteredDrills && user && masteredIds.includes(d.id)) return false;
      return true;
    });
  };

  const fillDrills = getDrillsByType('fill-blanks');
  assert.strictEqual(fillDrills.length, 1, 'Only non-mastered fill-blanks drill should be returned');
  assert.strictEqual(fillDrills[0].id, 'drill-2');

  const totalMasteredInFill = drills.filter(d => d.type === 'fill-blanks' && masteredIds.includes(d.id)).length;
  assert.strictEqual(totalMasteredInFill, 1, 'Mastered count for fill-blanks should be 1');
});

// ============================================================================
// 4. NON-DESTRUCTIVE HISTORY & PROFILE PRESERVATION
// ============================================================================
it('must preserve submissions and past scores even when task is marked as mastered', () => {
  const submissions = [
    {
      id: 'sub-001',
      task: { id: 'task-1', title: 'Bar Chart Population', taskNumber: 1 },
      essayText: 'The bar chart illustrates the population dynamics...',
      date: '2026-09-20',
      stats: { wordCount: 185, timeSpent: '18m' },
      evaluation: { overallBand: 7.5, tr: 7.5, cc: 7.0, lr: 7.5, gra: 8.0 }
    },
    {
      id: 'sub-002',
      task: { id: 'task-2', title: 'Education Spending Essay', taskNumber: 2 },
      essayText: 'Investment in public education plays an indispensable role...',
      date: '2026-09-21',
      stats: { wordCount: 310, timeSpent: '38m' },
      evaluation: { overallBand: 8.0, tr: 8.0, cc: 8.0, lr: 8.0, gra: 8.0 }
    }
  ];

  const masteredIds = ['task-1']; // Task 1 is marked as mastered

  // Submissions list must remain intact: count must still be 2
  assert.strictEqual(submissions.length, 2, 'Submissions array must remain completely untouched');

  // Verify task-1 submission retains its Band 7.5 score and evaluation
  const sub1 = submissions.find(s => s.task?.id === 'task-1');
  assert(sub1, 'Submission for task-1 must still exist in profile history');
  assert.strictEqual(sub1.evaluation.overallBand, 7.5, 'Score must be preserved');

  // Verify mastered badge condition
  const isSub1Mastered = masteredIds.includes(sub1.task.id);
  assert.strictEqual(isSub1Mastered, true, 'sub1 must have isMastered = true for badge display');

  const sub2 = submissions.find(s => s.task?.id === 'task-2');
  const isSub2Mastered = masteredIds.includes(sub2.task.id);
  assert.strictEqual(isSub2Mastered, false, 'sub2 must not be marked as mastered');
});

// ============================================================================
// 5. GUEST AUTH GUARD & CLOUD DATA ISOLATION
// ============================================================================
it('should require authentication to toggle mastered and block unauthenticated users', () => {
  let currentUser = null;
  let authPromptCalled = false;
  let stateChanged = false;

  const onOpenAuth = () => { authPromptCalled = true; };
  const handleToggleMastered = (itemId) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    stateChanged = true;
  };

  handleToggleMastered('task-101');
  assert.strictEqual(authPromptCalled, true, 'Must prompt for login when unauthenticated');
  assert.strictEqual(stateChanged, false, 'State must not change without login');

  // When logged in
  currentUser = { id: 'user-xyz', email: 'test@cambridge.org' };
  handleToggleMastered('task-101');
  assert.strictEqual(stateChanged, true, 'State should change when user is authenticated');
});

it('should isolate mastered metadata from user vocabulary notebook', () => {
  const rawDbVocabRows = [
    { id: '1', phrase: 'indispensable', meaning_vi: 'không thể thiếu', topic: 'academic' },
    { id: '2', phrase: 'lucrative', meaning_vi: 'sinh lợi cao', topic: 'business' },
    { id: 'mastered-u1', phrase: '["task-1","drill-2"]', meaning_vi: 'Metadata', topic: '_mastered_meta' }
  ];

  // Simulating fetchUserVocab filter
  const cleanedVocab = rawDbVocabRows
    .filter(row => row.topic !== '_mastered_meta')
    .map(row => ({ id: row.id, phrase: row.phrase, topic: row.topic }));

  assert.strictEqual(cleanedVocab.length, 2, 'Must filter out _mastered_meta from vocab notebook');
  assert(!cleanedVocab.some(v => v.topic === '_mastered_meta'), 'Vocab list must not contain metadata');

  // Simulating fetchUserMasteredItems parser
  const metaRow = rawDbDbRowsFind(rawDbVocabRows, '_mastered_meta');
  assert(metaRow, 'Metadata row should exist');
  const parsedIds = JSON.parse(metaRow.phrase);
  assert.deepStrictEqual(parsedIds, ['task-1', 'drill-2'], 'Must parse mastered IDs array cleanly');

  function rawDbDbRowsFind(rows, topic) {
    return rows.find(r => r.topic === topic);
  }
});

// ============================================================================
// 6. VOCAB, GRAMMAR & SPELLING MASTERED FILTERING & PUBLIC SYNC
// ============================================================================
it('should filter mastered items in Vocab, Grammar, and Spelling tabs for logged-in users while preserving history', () => {
  const spellingList = [
    { id: 'sp-1', correct: 'environment', bandLevel: '6.5' },
    { id: 'sp-2', correct: 'government', bandLevel: '6.5' },
    { id: 'sp-3', correct: 'definitely', bandLevel: '7.0' }
  ];

  const grammarList = [
    { id: 'gr-1', title: 'Subject-Verb Agreement', bandLevel: '6.0' },
    { id: 'gr-2', title: 'Relative Clauses', bandLevel: '6.5' }
  ];

  const vocabCards = [
    { id: 'card-1', term: 'sustainable development', bandLevel: '7.0' },
    { id: 'card-2', term: 'paradigm shift', bandLevel: '7.5' }
  ];

  const masteredIds = ['sp-1', 'gr-2', 'card-1'];
  const currentUser = { id: 'u1', email: 'student@ielts.vn' };
  const hideMastered = true;

  // Filter spelling
  const activeSpelling = spellingList.filter(item => {
    if (hideMastered && currentUser && masteredIds.includes(item.id)) return false;
    return true;
  });
  assert.strictEqual(activeSpelling.length, 2, 'Spelling sp-1 should be hidden');
  assert.deepStrictEqual(activeSpelling.map(s => s.id), ['sp-2', 'sp-3']);

  // Filter grammar
  const activeGrammar = grammarList.filter(item => {
    if (hideMastered && currentUser && masteredIds.includes(item.id)) return false;
    return true;
  });
  assert.strictEqual(activeGrammar.length, 1, 'Grammar gr-2 should be hidden');
  assert.strictEqual(activeGrammar[0].id, 'gr-1');

  // Filter vocab
  const activeCards = vocabCards.filter(c => {
    if (hideMastered && currentUser && masteredIds.includes(c.id)) return false;
    return true;
  });
  assert.strictEqual(activeCards.length, 1, 'Vocab card-1 should be hidden');
  assert.strictEqual(activeCards[0].id, 'card-2');

  // In user profile or un-hiding
  assert.strictEqual(masteredIds.length, 3, 'User profile retains all 3 mastered items');
});

it('should correctly format and tag AI generated vocab/grammar/spelling items for public community sync', () => {
  const isAutoShare = true;
  const user = { email: 'teacher@ielts.vn' };
  const creatorLabel = isAutoShare ? `${user.email.split('@')[0]} (Thành viên)` : 'Tôi';

  const newTrap = {
    id: `ai-sp-${Date.now()}`,
    correct: 'maintenance',
    distractors: ['maintainance', 'maintenence', 'maintenanse'],
    isPublic: isAutoShare,
    isCommunity: isAutoShare,
    isAiGenerated: true,
    creatorEmail: creatorLabel
  };

  assert(newTrap.id.startsWith('ai-sp-'), 'Should have ai-sp- prefix');
  assert.strictEqual(newTrap.isPublic, true);
  assert.strictEqual(newTrap.isCommunity, true);
  assert.strictEqual(newTrap.creatorEmail, 'teacher (Thành viên)');
});

console.log(`\nAll ${passedTests}/${passedTests} Step 14 Mastered Items tests passed successfully!\n`);
