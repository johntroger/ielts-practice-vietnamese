/**
 * Step 44 Test Suite: Automated AI Content Deduplication & Sanitization Engine
 * 
 * Verifies:
 * 1. Cambridge standard boilerplate stripping for accurate semantic comparison.
 * 2. Semantic duplicate detection algorithm.
 * 3. Automatic cleaning and pruning of duplicate AI Writing tasks.
 * 4. Automatic cleaning and pruning of duplicate Speaking topics, cue cards, and Part 3 sets.
 * 5. Intra-topic question deduplication for speaking interview sets.
 * 6. Website content audit & LocalStorage auto-cleanup integration.
 */

import assert from 'assert';
import {
  stripStandardIeltsBoilerplate,
  isSemanticDuplicate,
  deduplicateWritingTasks,
  deduplicateSpeakingP1Topics,
  deduplicateSpeakingP2Cards,
  deduplicateSpeakingP3Sets,
  auditAndCleanWebsiteContent
} from '../src/services/deduplicationService.js';

let totalTests = 0;
let passedTests = 0;

function runTest(description, testFn) {
  totalTests++;
  try {
    testFn();
    passedTests++;
    console.log(`  ✓ ${description}`);
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
  }
}

console.log('\n--- Step 44: AI Content Deduplication & Auto-Clean Engine Tests ---');

// 1. Boilerplate Stripping
runTest('stripStandardIeltsBoilerplate removes Cambridge Task 1 instructions', () => {
  const raw = 'The bar chart shows energy production. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.';
  const cleaned = stripStandardIeltsBoilerplate(raw);
  assert(!cleaned.includes('summarise the information'), 'Should remove summarise instruction');
  assert(!cleaned.includes('main features'), 'Should remove main features rubric');
  assert(cleaned.includes('energy production'), 'Should retain semantic subject');
});

runTest('stripStandardIeltsBoilerplate removes Task 2 prompt questions and community tags', () => {
  const raw = '✨ [AI Cộng Đồng] Some believe remote work causes isolation. Discuss both views and give your own opinion.';
  const cleaned = stripStandardIeltsBoilerplate(raw);
  assert(!cleaned.includes('ai cộng đồng'), 'Should remove community tag');
  assert(!cleaned.includes('discuss both views'), 'Should remove discuss both views instruction');
  assert(cleaned.includes('remote work causes isolation'), 'Should keep core argument');
});

// 2. Semantic Duplicate Detection
runTest('isSemanticDuplicate returns true for identical normalized titles or prompts', () => {
  const item1 = { title: 'Artificial Intelligence & Future Jobs' };
  const item2 = { title: '  artificial intelligence & future jobs  ' };
  assert(isSemanticDuplicate(item1, item2, 0.75), 'Identical titles should match');
});

runTest('isSemanticDuplicate returns true for high lexical overlap (> 75%)', () => {
  const item1 = { prompt: 'Governments should invest heavily in public transportation systems rather than building new highways.' };
  const item2 = { prompt: 'Governments should invest heavily in public transit systems rather than building new highways.' };
  assert(isSemanticDuplicate(item1, item2, 0.75), 'Near-duplicate paraphrase should match');
});

runTest('isSemanticDuplicate returns false for different topics sharing Task 1 instructions', () => {
  const task1 = {
    title: 'Electricity Generation in Denmark',
    prompt: 'The chart below shows electricity generation in Denmark. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'
  };
  const task2 = {
    title: 'Manufacturing of Cement and Concrete',
    prompt: 'The diagram below shows the process of cement production. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'
  };
  assert(!isSemanticDuplicate(task1, task2, 0.75), 'Different subjects with identical rubrics must NOT be duplicates');
});

// 3. Writing Tasks Deduplication
runTest('deduplicateWritingTasks removes duplicate custom AI tasks while retaining official tasks', () => {
  const tasks = [
    { id: 't2-official', taskNumber: 2, isAiGenerated: false, title: 'Artificial Intelligence and Future Employment', prompt: 'Some people believe AI will replace human jobs...' },
    { id: 'ai-gen-1', taskNumber: 2, isAiGenerated: true, title: 'Artificial Intelligence and Future Employment', prompt: 'Some people believe AI will replace human jobs...' },
    { id: 't1-official', taskNumber: 1, isAiGenerated: false, title: 'Electricity Generation from Renewables', prompt: 'The line chart shows...' },
    { id: 'ai-gen-2', taskNumber: 2, isAiGenerated: true, title: 'Remote Work vs Traditional Office', prompt: 'In many countries employees work remotely...' }
  ];

  const { cleanedTasks, removedCount, removedTasks } = deduplicateWritingTasks(tasks, 0.75);
  assert.strictEqual(cleanedTasks.length, 3, 'Should remove 1 duplicate AI task');
  assert.strictEqual(removedCount, 1);
  assert.strictEqual(removedTasks[0].task.id, 'ai-gen-1');
  assert(cleanedTasks.some(t => t.id === 't2-official'), 'Official task must be retained');
});

// 4. Speaking Part 1 Topics & Question Deduplication
runTest('deduplicateSpeakingP1Topics filters duplicate topics and removes duplicate questions inside topics', () => {
  const topics = [
    {
      id: 'p1-music',
      title: 'Music & Leisure',
      questions: [
        { qId: 'q1', question: 'What kind of music do you like to listen to?' },
        { qId: 'q2', question: 'What type of music do you like to listen to?' }, // duplicate!
        { qId: 'q3', question: 'Did you learn to play an instrument when you were a child?' }
      ]
    },
    {
      id: 'p1-music-dup',
      title: 'Music and Leisure Time', // duplicate topic!
      questions: [
        { qId: 'q4', question: 'Do you enjoy music?' }
      ]
    }
  ];

  const { cleanedTopics, removedCount, removedQuestionsCount } = deduplicateSpeakingP1Topics(topics, 0.75);
  assert.strictEqual(cleanedTopics.length, 1, 'Should keep only 1 topic');
  assert.strictEqual(removedCount, 1, 'Should remove 1 duplicate topic');
  assert.strictEqual(removedQuestionsCount, 1, 'Should remove 1 duplicate question inside the topic');
  assert.strictEqual(cleanedTopics[0].questions.length, 2, 'Retained topic should have 2 unique questions');
});

// 5. Speaking Part 2 Cue Cards Deduplication
runTest('deduplicateSpeakingP2Cards removes duplicate cue cards', () => {
  const cards = [
    { id: 'p2-c1', title: 'Describe an electronic device or technology that you find useful', prompt: 'Describe an electronic device...' },
    { id: 'p2-c2-dup', title: 'Describe an electronic device or gadget you find very useful', prompt: 'Describe an electronic device...' },
    { id: 'p2-c3', title: 'Describe an inspiring teacher you had', prompt: 'Describe an inspiring teacher...' }
  ];

  const { cleanedCards, removedCount } = deduplicateSpeakingP2Cards(cards, 0.75);
  assert.strictEqual(cleanedCards.length, 2);
  assert.strictEqual(removedCount, 1);
});

// 6. Speaking Part 3 Sets Deduplication
runTest('deduplicateSpeakingP3Sets removes duplicate discussion sets', () => {
  const sets = [
    { id: 'p3-s1', topic: 'Impact of Artificial Intelligence on Modern Society', questions: [] },
    { id: 'p3-s2-dup', topic: 'The Impact of Artificial Intelligence on Contemporary Society', questions: [] },
    { id: 'p3-s3', topic: 'Environmental Conservation and Tourism', questions: [] }
  ];

  const { cleanedSets, removedCount } = deduplicateSpeakingP3Sets(sets, 0.75);
  assert.strictEqual(cleanedSets.length, 2);
  assert.strictEqual(removedCount, 1);
});

// 7. Mock LocalStorage auditAndCleanWebsiteContent
runTest('auditAndCleanWebsiteContent safely cleans mock storage with duplicate entries', () => {
  const mockStorage = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (k) => mockStorage.get(k) || null,
      setItem: (k, v) => mockStorage.set(k, v),
      removeItem: (k) => mockStorage.delete(k)
    }
  };

  // Populate mock duplicate tasks
  const testTasks = [
    { id: 'task-1', taskNumber: 2, title: 'AI and Unemployment', prompt: 'Will AI cause unemployment?' },
    { id: 'task-2', taskNumber: 2, title: 'AI and Unemployment', prompt: 'Will AI cause unemployment?' }
  ];
  mockStorage.set('ielts_all_tasks', JSON.stringify(testTasks));

  const report = auditAndCleanWebsiteContent(0.75);
  assert.strictEqual(report.writing.initialCount, 2);
  assert.strictEqual(report.writing.removedCount, 1);
  assert.strictEqual(report.writing.cleanedCount, 1);
  assert.strictEqual(report.hasDuplicates, true);

  // Verify storage was updated with only 1 task
  const saved = JSON.parse(mockStorage.get('ielts_all_tasks'));
  assert.strictEqual(saved.length, 1);

  // Clean up mock window
  delete globalThis.window;
});

console.log(`\nResults: ${passedTests}/${totalTests} tests passed.`);
if (passedTests === totalTests) {
  console.log(`All ${totalTests}/${totalTests} tests passed! Step 44 AI Content Deduplication & Auto-Clean verified successfully.\n`);
  process.exit(0);
} else {
  console.error(`FAILED: ${totalTests - passedTests} tests failed.`);
  process.exit(1);
}
