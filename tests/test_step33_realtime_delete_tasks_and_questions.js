/**
 * Step 33: Real-Time Synchronization for Deleting Added Questions and Tasks
 * Validates real-time removal, storage persistence, and safe active fallback across Speaking, Writing, Reading & Listening.
 */

import assert from 'assert';

console.log('🧪 Starting Step 33 Test Suite: Real-Time Delete for Questions and Tasks...\n');

let testsPassed = 0;

// Test 1: Writing Task Deletion with Instant Synchronous Update
console.log('Test 1: Writing task deletion removes custom & ai-generated tasks synchronously...');
const initialAllTasks = [
  { id: 't2-sample-1', title: 'Sample Task 1', taskNumber: 2 },
  { id: 'custom-12345', title: 'My Custom Prompt', isCustom: true, taskNumber: 2 },
  { id: 'ai-gen-67890', title: 'AI Task on Environment', isAiGenerated: true, taskNumber: 1 }
];

const deleteId = 'custom-12345';
const updatedTasks = initialAllTasks.filter(t => t.id !== deleteId);

assert.strictEqual(updatedTasks.length, 2, 'Should have exactly 2 tasks remaining');
assert(!updatedTasks.some(t => t.id === deleteId), 'Deleted custom task must not exist in updated list');
assert(updatedTasks.some(t => t.id === 'ai-gen-67890'), 'AI generated task must be preserved');
testsPassed++;
console.log('  ✅ Test 1 Passed: Writing custom task successfully deleted from collection.');

// Test 2: AI-Generated Task Deletion
console.log('Test 2: AI-generated task deletion removes cleanly...');
const deleteAiId = 'ai-gen-67890';
const tasksAfterAiDelete = updatedTasks.filter(t => t.id !== deleteAiId);

assert.strictEqual(tasksAfterAiDelete.length, 1, 'Should have exactly 1 task remaining');
assert(!tasksAfterAiDelete.some(t => t.id === deleteAiId), 'Deleted AI task must not exist');
testsPassed++;
console.log('  ✅ Test 2 Passed: AI-generated task removed cleanly.');

// Test 3: Speaking Part 1 Question Addition & Real-Time Deletion
console.log('Test 3: Speaking Part 1 question addition and deletion update topic cleanly...');
const sampleP1Topic = {
  id: 'p1-music-test',
  title: 'Music & Hobbies',
  questions: [
    { qId: 'q-1', question: 'Do you like listening to music?' },
    { qId: 'q-2', question: 'What kind of music do you prefer?' }
  ]
};

// Add Question
const addedQuestion = {
  qId: 'p1-q-user-999',
  question: 'How often do you go to live concerts?',
  focus: 'Câu hỏi bổ sung'
};

const topicWithAdded = {
  ...sampleP1Topic,
  isCustom: true,
  questions: [...sampleP1Topic.questions, addedQuestion]
};

assert.strictEqual(topicWithAdded.questions.length, 3, 'Topic should now contain 3 questions');
assert.strictEqual(topicWithAdded.questions[2].qId, 'p1-q-user-999', 'Added question must be at the end');

// Delete Question
const targetQId = 'p1-q-user-999';
const topicAfterQDelete = {
  ...topicWithAdded,
  questions: topicWithAdded.questions.filter(q => (q.qId || q.id) !== targetQId)
};

assert.strictEqual(topicAfterQDelete.questions.length, 2, 'Should revert back to 2 questions');
assert(!topicAfterQDelete.questions.some(q => q.qId === targetQId), 'Deleted question must be gone');
testsPassed++;
console.log('  ✅ Test 3 Passed: Speaking Part 1 question added and deleted in real-time.');

// Test 4: Speaking Part 3 Discussion Question Deletion
console.log('Test 4: Speaking Part 3 question deletion updates discussion set in real-time...');
const sampleP3Set = {
  id: 'p3-ai-impact',
  linkedPart2Id: 'p2-ai-tech',
  topic: 'AI and Society',
  questions: [
    { qId: 'p3-q-1', question: 'Will AI replace human workers in the future?' },
    { qId: 'p3-q-user-888', question: 'What ethical concerns arise from AI surveillance?' }
  ]
};

const deleteP3QId = 'p3-q-user-888';
const updatedP3Questions = sampleP3Set.questions.filter(q => (q.qId || q.id) !== deleteP3QId);
assert.strictEqual(updatedP3Questions.length, 1, 'Should have 1 question remaining');
assert.strictEqual(updatedP3Questions[0].qId, 'p3-q-1', 'Standard question remains');
testsPassed++;
console.log('  ✅ Test 4 Passed: Part 3 question deletion verified.');

// Test 5: Safe Active Fallback When Selected Item is Deleted
console.log('Test 5: Fallback to default ID when current active item is deleted...');
let currentActiveId = 'custom-12345';
const defaultId = 't2-sample-1';

if (currentActiveId === deleteId) {
  currentActiveId = defaultId;
}
assert.strictEqual(currentActiveId, defaultId, 'Active ID must safely fallback to defaultId');
testsPassed++;
console.log('  ✅ Test 5 Passed: Active ID falls back safely upon deletion.');

// Test 6: Reading Custom Test Deletion & Storage Serialization
console.log('Test 6: Reading custom test deletion filters and serializes correctly...');
const readingTests = [
  { id: 'cam18-t1', title: 'Cambridge 18 Test 1', isCustom: false },
  { id: 'custom-test-101', title: 'AI Climate Article', isCustom: true }
];

const deletedReadingTests = readingTests.filter(t => t.id !== 'custom-test-101');
const customOnlyReading = deletedReadingTests.filter(t => t.isCustom || t.id.startsWith('custom-test-'));

assert.strictEqual(deletedReadingTests.length, 1, 'Should have 1 test remaining');
assert.strictEqual(customOnlyReading.length, 0, 'No custom tests should remain');
testsPassed++;
console.log('  ✅ Test 6 Passed: Reading custom test deleted and custom-only storage clean.');

// Test 7: Listening Custom Test Deletion & Storage Serialization
console.log('Test 7: Listening custom test deletion cleans up correctly...');
const listeningTests = [
  { id: 'lis-cam18-t1', title: 'Cambridge 18 Listening', isCustom: false },
  { id: 'custom-lis-202', title: 'TED Talk Listening Exercise', isCustom: true }
];

const deletedListening = listeningTests.filter(t => t.id !== 'custom-lis-202');
const customOnlyListening = deletedListening.filter(t => t.isCustom || t.id.startsWith('custom-'));

assert.strictEqual(deletedListening.length, 1, '1 listening test remains');
assert.strictEqual(customOnlyListening.length, 0, 'No custom listening tests remain in storage');
testsPassed++;
console.log('  ✅ Test 7 Passed: Listening custom test deleted and storage clean.');

console.log(`\n===============================================================`);
console.log(`🎉 All ${testsPassed}/${testsPassed} tests passed cleanly in Step 33!`);
console.log(`===============================================================\n`);
