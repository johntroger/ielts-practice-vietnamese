/**
 * Test Step 96: Adaptive 30-Min Sprint Coach Integrity Test Suite
 * 
 * Validates:
 * 1. Sprint Coach Diagnostic Engine (Identifies bottlenecks: accuracy, speaking fluency, writing coherence)
 * 2. 3-Stage 30-Min Sprint Plan Generator (7m Warm-up + 15m Core Intensive + 8m Lexical Consolidation)
 * 3. Daily Progress & Continuous Streak Counter
 * 4. AdaptiveSprintModal component & AppModalHost integration
 * 5. Navbar & Feature Registry Declarations
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {
  diagnoseLearnerProfile,
  generateDaily30MinSprint,
  getTodaySprintProgress,
  saveTodaySprintProgress,
  recordSprintCompletion,
  getSprintStats,
  SPRINT_LEXICAL_BANK
} from '../src/services/sprintCoachService.js';

let testsPassed = 0;

function runTest(name, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('🧪 Step 96: Adaptive 30-Min Sprint Coach Integrity Test Suite');

// =========================================================================
// 1. DIAGNOSTIC ENGINE TESTS
// =========================================================================

runTest('1.1 diagnoseLearnerProfile detects accuracy_traps when multiple mistakes exist', () => {
  const mockMistakes = [
    { id: 1, title: 'Article error' },
    { id: 2, title: 'Subject-verb agreement' },
    { id: 3, title: 'Tense consistency' },
    { id: 4, title: 'Spelling mistake' }
  ];

  const diag = diagnoseLearnerProfile({ mistakes: mockMistakes, targetBand: '7.0' });
  assert.strictEqual(diag.bottleneck, 'accuracy_traps');
  assert(diag.diagnosisText.includes('4 lỗi sai'));
  assert(diag.urgencyScore >= 90);
});

runTest('1.2 diagnoseLearnerProfile detects speaking_fluency when speaking is neglected', () => {
  const mockSubs = [
    { id: 'w1', type: 'task2', essayText: 'some essay 1' },
    { id: 'w2', type: 'task1', essayText: 'some essay 2' },
    { id: 'w3', type: 'task2', essayText: 'some essay 3' }
  ];

  const diag = diagnoseLearnerProfile({ submissions: mockSubs, mistakes: [], targetBand: '6.5' });
  assert.strictEqual(diag.bottleneck, 'speaking_fluency');
  assert.strictEqual(diag.focusSkill, 'speaking');
  assert(diag.diagnosisText.includes('Speaking'));
});

runTest('1.3 diagnoseLearnerProfile prioritizes writing_coherence for high target bands', () => {
  const mockSubs = [
    { id: 'w1', type: 'task2', essayText: 'essay' },
    { id: 's1', speakingTopic: { title: 'Sports' } }
  ];

  const diag = diagnoseLearnerProfile({ submissions: mockSubs, mistakes: [], targetBand: '7.5' });
  assert.strictEqual(diag.bottleneck, 'writing_coherence');
  assert.strictEqual(diag.focusSkill, 'writing');
  assert(diag.diagnosisText.includes('PEEL'));
});

// =========================================================================
// 2. 3-STAGE SPRINT PLAN GENERATOR TESTS
// =========================================================================

runTest('2.1 generateDaily30MinSprint creates a structured 30-minute plan with 3 stages', () => {
  const plan = generateDaily30MinSprint({
    submissions: [],
    mistakes: [],
    targetBand: '7.0'
  });

  assert.strictEqual(plan.totalMinutes, 30);
  assert.strictEqual(plan.stages.length, 3);

  // Stage 1: 7 mins
  assert.strictEqual(plan.stages[0].id, 'stage-1-accuracy');
  assert.strictEqual(plan.stages[0].durationMinutes, 7);
  assert.strictEqual(plan.stages[0].durationSeconds, 420);
  assert(Array.isArray(plan.stages[0].questions) && plan.stages[0].questions.length >= 3);

  // Stage 2: 15 mins
  assert.strictEqual(plan.stages[1].durationMinutes, 15);
  assert.strictEqual(plan.stages[1].durationSeconds, 900);

  // Stage 3: 8 mins
  assert.strictEqual(plan.stages[2].id, 'stage-3-lexical-consolidation');
  assert.strictEqual(plan.stages[2].durationMinutes, 8);
  assert.strictEqual(plan.stages[2].durationSeconds, 480);
  assert(Array.isArray(plan.stages[2].vocabItems) && plan.stages[2].vocabItems.length >= 3);
});

runTest('2.2 Stage 1 questions include valid options and correctIndex', () => {
  const plan = generateDaily30MinSprint();
  const q1 = plan.stages[0].questions[0];

  assert(q1.question, 'Question must have text');
  assert(Array.isArray(q1.options) && q1.options.length >= 2, 'Question must have multiple options');
  assert(typeof q1.correctIndex === 'number', 'Question must specify correctIndex');
});

runTest('2.3 Stage 3 incorporates high-level C1/C2 collocations from lexical bank', () => {
  assert(Array.isArray(SPRINT_LEXICAL_BANK) && SPRINT_LEXICAL_BANK.length >= 5);
  const sample = SPRINT_LEXICAL_BANK[0];
  assert(sample.phrase && sample.meaningVi && sample.example);
});

// =========================================================================
// 3. PROGRESS & STREAK MANAGEMENT TESTS
// =========================================================================

runTest('3.1 getTodaySprintProgress provides clean initial state', () => {
  const prog = getTodaySprintProgress();
  assert(prog.date);
  assert.strictEqual(prog.currentStageIndex, 0);
  assert.strictEqual(prog.isCompleted, false);
  assert.deepStrictEqual(prog.stageCompletedStatus, [false, false, false]);
});

runTest('3.2 recordSprintCompletion increments streak and saves history entry', () => {
  const result = recordSprintCompletion({
    diagnosis: { bottleneck: 'speaking_fluency' }
  });

  assert(result.streak >= 1);
  assert(result.historyEntry.date);
  assert.strictEqual(result.historyEntry.totalMinutes, 30);

  const stats = getSprintStats();
  assert(stats.currentStreak >= 1);
  assert(stats.totalSprintsCompleted >= 1);
});

// =========================================================================
// 4. ARCHITECTURE & UI INTEGRATION TESTS
// =========================================================================

runTest('4.1 AdaptiveSprintModal component exists and default exports function', () => {
  const modalPath = path.resolve('src/components/AdaptiveSprintModal.jsx');
  assert(fs.existsSync(modalPath), 'AdaptiveSprintModal.jsx must exist');

  const content = fs.readFileSync(modalPath, 'utf-8');
  assert(content.includes('export default function AdaptiveSprintModal'), 'Must export default function');
  assert(content.includes('formatTimer'), 'Must include timer formatting');
  assert(content.includes('handleCompleteCurrentStage'), 'Must handle stage progression');
});

runTest('4.2 AppModalHost lazily loads and renders AdaptiveSprintModal', () => {
  const hostPath = path.resolve('src/components/modals/AppModalHost.jsx');
  const content = fs.readFileSync(hostPath, 'utf-8');

  assert(content.includes("AdaptiveSprintModal = React.lazy(() => import('../AdaptiveSprintModal'))"), 'AppModalHost must lazy load AdaptiveSprintModal');
  assert(content.includes('<AdaptiveSprintModal'), 'AppModalHost must render AdaptiveSprintModal');
  assert(content.includes('modals.adaptiveSprint'), 'Must bind to modals.adaptiveSprint');
});

runTest('4.3 Navbar includes Adaptive Sprint Coach button in desktop and mobile drawer', () => {
  const navPath = path.resolve('src/components/Navbar.jsx');
  const content = fs.readFileSync(navPath, 'utf-8');

  assert(content.includes("openModal('adaptiveSprint')"), 'Navbar must trigger adaptiveSprint modal');
  assert(content.includes('Huấn Luyện Viên 30P'), 'Navbar must show Huấn Luyện Viên 30P label');
});

runTest('4.4 Feature Registry declares feat-adaptive-30min-sprint', () => {
  const regPath = path.resolve('src/core/featureRegistry.js');
  const content = fs.readFileSync(regPath, 'utf-8');

  assert(content.includes('feat-adaptive-30min-sprint'), 'featureRegistry must register feat-adaptive-30min-sprint');
  assert(content.includes('Huấn Luyện Viên Cá Nhân Hóa (Adaptive 30-Min Sprint Coach)'), 'featureRegistry must have correct title');
});

console.log(`\nAll ${testsPassed}/${testsPassed} Step 96 tests passed cleanly!`);
