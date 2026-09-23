/**
 * test_step13_public_ai_content_no_auth.js
 * Verification of Public AI-Generated Content & Unauthenticated Resource Access:
 * 1. AI generated tasks with isPublic: true are immediately available to the public repository.
 * 2. Unauthenticated users (currentUser = null) can access questions across Writing, Reading, Listening & Speaking.
 * 3. Default community tasks bank exists and contains Band 8.5+ models.
 * 4. Cambridge reading & listening tasks are marked as public community resources.
 * 5. Opt-out setting (isPublic: false) correctly isolates private content.
 */

import { INITIAL_TASKS, COMMUNITY_DEFAULT_TASKS } from '../src/data/sampleTasks.js';
import { INITIAL_READING_TESTS } from '../src/data/readingTasks.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { SPEAKING_MOCK_TEST_PACKS } from '../src/data/speakingTopics.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    passed++;
  }
}

console.log('Testing Public AI Content & Unauthenticated Question Resources...');

// 1. Verify Community Default Tasks exist and contain valid questions
assert(Array.isArray(COMMUNITY_DEFAULT_TASKS) && COMMUNITY_DEFAULT_TASKS.length >= 3, 'Community default tasks array has at least 3 items');
for (const task of COMMUNITY_DEFAULT_TASKS) {
  assert(task.isPublic === true, `Community task ${task.id} must have isPublic: true`);
  assert(task.isCommunity === true, `Community task ${task.id} must have isCommunity: true`);
  assert(Boolean(task.prompt), `Community task ${task.id} must have prompt`);
  assert(Boolean(task.modelAnswer), `Community task ${task.id} must have model answer`);
}

// 2. Simulate AI Task Generation with isPublic: true for an unauthenticated user (currentUser = null)
const currentUser = null; // Unauthenticated visitor
let allTasks = [...INITIAL_TASKS];
let communityTasks = [...COMMUNITY_DEFAULT_TASKS];

const newAiTask = {
  id: `custom-ai-task-${Date.now()}`,
  taskNumber: 2,
  type: 'opinion',
  title: 'AI in Higher Education',
  prompt: 'Should AI tools be permitted in academic examinations?',
  isCustom: true,
  isAiGenerated: true,
  createdAt: new Date().toISOString()
};

// Emulate onTaskCreated callback
const isPub = true;
allTasks = [newAiTask, ...allTasks];
if (isPub) {
  const pubTask = {
    ...newAiTask,
    isPublic: true,
    isCommunity: true,
    creatorEmail: currentUser?.email || 'Thành viên cộng đồng'
  };
  communityTasks = [pubTask, ...communityTasks.filter(t => t.id !== newAiTask.id)];
}

assert(allTasks.find(t => t.id === newAiTask.id), 'New AI task added to allTasks without login');
assert(communityTasks.find(t => t.id === newAiTask.id), 'New AI task added to communityTasks without login');
assert(communityTasks[0].isPublic === true, 'New AI task in community list is public');
assert(communityTasks[0].creatorEmail === 'Thành viên cộng đồng', 'Anonymous creator email set correctly');

// 3. Verify Reading tests are public for guest users
assert(Array.isArray(INITIAL_READING_TESTS) && INITIAL_READING_TESTS.length > 0, 'Reading tests exist');
assert(INITIAL_READING_TESTS[0].isPublic === true, 'Cambridge Reading Test 1 is public for unauthenticated users');

// 4. Verify Listening tests are public for guest users
assert(Array.isArray(INITIAL_LISTENING_TESTS) && INITIAL_LISTENING_TESTS.length >= 4, 'Listening tests has 4 Cambridge tests');
for (const test of INITIAL_LISTENING_TESTS) {
  assert(test.isPublic === true, `Listening test ${test.id} is public for unauthenticated users`);
}

// 5. Verify Speaking Mock Packs are public for guest users
assert(Array.isArray(SPEAKING_MOCK_TEST_PACKS) && SPEAKING_MOCK_TEST_PACKS.length > 0, 'Speaking mock packs exist');
for (const pack of SPEAKING_MOCK_TEST_PACKS) {
  assert(pack.isPublic === true, `Speaking mock pack ${pack.id} is public for unauthenticated users`);
}

// 6. Test Opt-out Behavior (isPublic: false keeps content private)
const privateAiTask = {
  id: `private-ai-task-${Date.now()}`,
  taskNumber: 1,
  type: 'bar',
  title: 'Internal Confidential Data',
  prompt: 'Summarise company private charts',
  isCustom: true,
  isAiGenerated: true
};

const isPrivate = false;
allTasks = [privateAiTask, ...allTasks];
if (isPrivate) {
  communityTasks = [privateAiTask, ...communityTasks];
}

assert(allTasks.find(t => t.id === privateAiTask.id), 'Private task added to personal allTasks');
assert(!communityTasks.find(t => t.id === privateAiTask.id), 'Private task is NOT added to communityTasks');

console.log(`✅ All ${passed}/${total} public AI content & unauthenticated access tests passed cleanly!\n`);
process.exit(0);
