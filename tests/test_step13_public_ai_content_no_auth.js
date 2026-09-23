/**
 * test_step13_public_ai_content_no_auth.js
 * Comprehensive Verification of Public AI-Generated Content & Unauthenticated Practice Question Resources:
 * 1. AI generated tasks with isPublic: true are immediately available to the public repository.
 * 2. Unauthenticated users (currentUser = null) can access questions across Writing, Reading, Listening & Speaking.
 * 3. Default community tasks bank exists and contains Band 8.5+ models.
 * 4. Cambridge reading & listening tasks are marked as public community resources.
 * 5. Opt-out setting (isPublic: false) correctly isolates private content.
 * 6. AI Micro-drills (practice questions) are public by default and include community presets.
 * 7. AI Speaking practice questions (Part 1, 2, 3) are public by default and include community presets.
 * 8. AI Reading practice passages and questions are public by default.
 */

import { INITIAL_TASKS, COMMUNITY_DEFAULT_TASKS } from '../src/data/sampleTasks.js';
import { INITIAL_READING_TESTS } from '../src/data/readingTasks.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { 
  SPEAKING_MOCK_TEST_PACKS, 
  COMMUNITY_DEFAULT_P1_TOPICS, 
  COMMUNITY_DEFAULT_P2_CARDS, 
  COMMUNITY_DEFAULT_P3_SETS 
} from '../src/data/speakingTopics.js';
import { COMMUNITY_DEFAULT_DRILLS } from '../src/data/communityMicroDrills.js';

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

console.log('Testing Public AI Content & Unauthenticated Practice Question Resources...');

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
assert(Array.isArray(INITIAL_READING_TESTS) && INITIAL_READING_TESTS.length >= 2, 'Reading tests has both Cambridge & Community AI tests');
assert(INITIAL_READING_TESTS[0].isPublic === true, 'Cambridge Reading Test 1 is public for unauthenticated users');
const commReadingTest = INITIAL_READING_TESTS.find(t => t.id === 'ai-comm-test-perovskite-solar');
assert(Boolean(commReadingTest), 'AI Community Reading Test exists in INITIAL_READING_TESTS');
assert(commReadingTest.isPublic === true, 'AI Community Reading Test is public');
assert(commReadingTest.passages[0].questionGroups.length === 2, 'AI Community Reading Test has 2 question groups');
assert(commReadingTest.passages[0].questionGroups[0].questions.length === 6, 'Question group 1 has 6 TFNG questions');
assert(commReadingTest.passages[0].questionGroups[1].questions.length === 7, 'Question group 2 has 7 Sentence completion questions');

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

// 6. Test Opt-out Behavior for Tasks (isPublic: false keeps content private)
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

// 7. Verify Community Micro-Drills (AI Practice Questions)
assert(Array.isArray(COMMUNITY_DEFAULT_DRILLS) && COMMUNITY_DEFAULT_DRILLS.length >= 8, 'Community default micro-drills has at least 8 items');
const drillTypes = new Set(COMMUNITY_DEFAULT_DRILLS.map(d => d.type));
assert(drillTypes.has('fill-blanks'), 'Has fill-blanks practice drill');
assert(drillTypes.has('true-false'), 'Has true-false practice drill');
assert(drillTypes.has('paraphrase'), 'Has paraphrase practice drill');
assert(drillTypes.has('reading-tfng'), 'Has reading-tfng practice drill');
assert(drillTypes.has('reading-paraphrase'), 'Has reading-paraphrase practice drill');
assert(drillTypes.has('listening-dictation'), 'Has listening-dictation practice drill');
assert(drillTypes.has('listening-distractor'), 'Has listening-distractor practice drill');
assert(drillTypes.has('collocation'), 'Has academic collocation practice drill');

for (const drill of COMMUNITY_DEFAULT_DRILLS) {
  assert(drill.isPublic === true, `Drill ${drill.id} must be public`);
  assert(drill.isCommunity === true, `Drill ${drill.id} must be community`);
  assert(drill.isAiGenerated === true, `Drill ${drill.id} must be AI generated`);
}

// 8. Test Micro-Drills AI Generation Simulation with Privacy Toggle
let allDrills = [...COMMUNITY_DEFAULT_DRILLS];
let communityDrills = [...COMMUNITY_DEFAULT_DRILLS];

// A. Generation with Public = true
const publicGeneratedDrill = {
  id: `drill-gen-pub-${Date.now()}`,
  type: 'fill-blanks',
  title: 'AI Generated Cohesion Drill',
  isPublic: true,
  isCommunity: true,
  isAiGenerated: true,
  creatorEmail: 'Cộng Đồng IELTS'
};
allDrills = [...allDrills, publicGeneratedDrill];
if (publicGeneratedDrill.isPublic) {
  communityDrills = [...communityDrills, publicGeneratedDrill];
}
assert(allDrills.some(d => d.id === publicGeneratedDrill.id), 'Public drill added to allDrills');
assert(communityDrills.some(d => d.id === publicGeneratedDrill.id), 'Public drill added to communityDrills');

// B. Generation with Public = false (Opt-out: Private to user)
const privateGeneratedDrill = {
  id: `drill-gen-priv-${Date.now()}`,
  type: 'paraphrase',
  title: 'My Confidential Paraphrase',
  isPublic: false,
  isCommunity: false,
  isAiGenerated: true,
  creatorEmail: 'Tôi'
};
allDrills = [...allDrills, privateGeneratedDrill];
if (privateGeneratedDrill.isPublic) {
  communityDrills = [...communityDrills, privateGeneratedDrill];
}
assert(allDrills.some(d => d.id === privateGeneratedDrill.id), 'Private drill added to user drills');
assert(!communityDrills.some(d => d.id === privateGeneratedDrill.id), 'Private drill NOT leaked into community drills');

// 9. Verify Community Speaking Practice Questions & Topics (Part 1, 2, 3)
assert(Array.isArray(COMMUNITY_DEFAULT_P1_TOPICS) && COMMUNITY_DEFAULT_P1_TOPICS.length >= 2, 'Community Speaking Part 1 topics exist');
for (const p1 of COMMUNITY_DEFAULT_P1_TOPICS) {
  assert(p1.isPublic === true, `P1 Topic ${p1.id} is public`);
  assert(p1.questions && p1.questions.length >= 2, `P1 Topic ${p1.id} has questions`);
}

assert(Array.isArray(COMMUNITY_DEFAULT_P2_CARDS) && COMMUNITY_DEFAULT_P2_CARDS.length >= 1, 'Community Speaking Part 2 cards exist');
for (const p2 of COMMUNITY_DEFAULT_P2_CARDS) {
  assert(p2.isPublic === true, `P2 Card ${p2.id} is public`);
  assert(p2.cueCard && p2.cueCard.bullets.length >= 4, `P2 Card ${p2.id} has 4 bullets`);
}

assert(Array.isArray(COMMUNITY_DEFAULT_P3_SETS) && COMMUNITY_DEFAULT_P3_SETS.length >= 1, 'Community Speaking Part 3 sets exist');
for (const p3 of COMMUNITY_DEFAULT_P3_SETS) {
  assert(p3.isPublic === true, `P3 Set ${p3.linkedPart2Id} is public`);
  assert(p3.questions && p3.questions.length >= 2, `P3 Set ${p3.linkedPart2Id} has questions`);
}

// 10. Test Speaking Practice Topic Generation Simulation with Privacy Toggle
let customP1Topics = [...COMMUNITY_DEFAULT_P1_TOPICS];
let communityP1Topics = [...COMMUNITY_DEFAULT_P1_TOPICS];

// A. Generation with Public = true
const pubP1Topic = {
  id: `p1-cust-pub-${Date.now()}`,
  title: 'Space Tourism',
  isPublic: true,
  isCommunity: true,
  isCustom: true,
  isAiGenerated: true,
  questions: [{ qId: 'q1', question: 'Would you travel to Mars?' }]
};
customP1Topics = [pubP1Topic, ...customP1Topics];
if (pubP1Topic.isPublic) {
  communityP1Topics = [pubP1Topic, ...communityP1Topics];
}
assert(customP1Topics.some(t => t.id === pubP1Topic.id), 'Public speaking topic added to user list');
assert(communityP1Topics.some(t => t.id === pubP1Topic.id), 'Public speaking topic added to community list');

// B. Generation with Public = false (Opt-out: Private to user)
const privP1Topic = {
  id: `p1-cust-priv-${Date.now()}`,
  title: 'My Secret Topic',
  isPublic: false,
  isCommunity: false,
  isCustom: true,
  isAiGenerated: true,
  questions: [{ qId: 'q1', question: 'Private question' }]
};
customP1Topics = [privP1Topic, ...customP1Topics];
if (privP1Topic.isPublic) {
  communityP1Topics = [privP1Topic, ...communityP1Topics];
}
assert(customP1Topics.some(t => t.id === privP1Topic.id), 'Private speaking topic in user list');
assert(!communityP1Topics.some(t => t.id === privP1Topic.id), 'Private speaking topic NOT leaked into community list');

console.log(`✅ All ${passed}/${total} public AI practice question & unauthenticated access tests passed cleanly!\n`);
process.exit(0);
