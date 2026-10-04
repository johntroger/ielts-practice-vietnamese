import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  getSmartDailyRecommendations,
  isRecommendationDismissedToday,
  dismissRecommendationForToday,
  resetRecommendationDismissal
} from '../src/services/recommendationService.js';
import { getFeatureById } from '../src/core/featureRegistry.js';

/**
 * Test Suite Step 85: Smart Daily Practice Recommendation Engine & UI Integration
 * 
 * Verifies:
 * 1. recommendationService pedagogical algorithms:
 *    - Rule A: Task 1 balance when learner excessively submits Task 2
 *    - Rule B: Task 2 weight prioritization when learner only practices Task 1
 *    - Rule C: Mistakes SRS prescription trigger when errors are logged
 *    - Rule D: AWL & Collocations expansion for high target bands (>= 7.0)
 *    - Rule E: Quick warm-up micro-drill when no essay submitted today
 *    - Safe fallback recommendation when history is empty
 * 2. Storage dismissal mechanics (dismiss for today & reset)
 * 3. SmartRecommendationBanner component integrity (expanded & compact view)
 * 4. Architectural integration in WritingWorkspace.jsx & App.jsx
 * 5. Feature Registry declarative registration & GitBook sync readiness
 */

console.log('🧭 Testing Step 85: Smart Daily Recommendation Engine & UI Integration...');

const mockTasks = [
  { id: 'cambridge-18-t1-bar', title: 'Bar Chart - Energy Production', taskNumber: 1, type: 'academic_task1', timeLimit: 20 },
  { id: 'cambridge-18-t2-opinion', title: 'Opinion - Artificial Intelligence', taskNumber: 2, type: 'academic_task2', timeLimit: 40 },
  { id: 'cambridge-17-t1-line', title: 'Line Graph - Internet Access', taskNumber: 1, type: 'academic_task1', timeLimit: 20 },
  { id: 'cambridge-17-t2-discussion', title: 'Discussion - Remote Work', taskNumber: 2, type: 'academic_task2', timeLimit: 40 }
];

// -------------------------------------------------------------
// 1. Pedagogical Algorithms Verification
// -------------------------------------------------------------
console.log('  ▶ 1. Verifying pedagogical recommendation rules...');

// Test 1.1: Rule A - Balance Task 1 when last 2 submissions are Task 2
const subTask2Heavy = [
  { id: 'sub-1', taskNumber: 2, title: 'Essay 1', date: '2026-10-02' },
  { id: 'sub-2', taskNumber: 2, title: 'Essay 2', date: '2026-10-01' }
];
const recsA = getSmartDailyRecommendations({
  submissions: subTask2Heavy,
  allTasks: mockTasks,
  currentTaskId: 'cambridge-18-t2-opinion'
});
assert.ok(recsA.length > 0, 'Should return recommendations');
const topRecA = recsA[0];
assert.strictEqual(topRecA.id, 'rec-balance-task1', 'Top recommendation must be Task 1 balance');
assert.ok(topRecA.badge.includes('Cân Bằng Kỹ Năng'), 'Badge must highlight skill balance');
assert.strictEqual(topRecA.actionType, 'select_task', 'Action must select a candidate Task 1');
assert.strictEqual(topRecA.actionPayload.taskNumber, 1, 'Candidate task must be Task 1');
console.log('    ✅ Rule A: Task 1 balance prioritization verified.');

// Test 1.2: Rule B - Balance Task 2 when last 2 submissions are Task 1
const subTask1Heavy = [
  { id: 'sub-3', taskNumber: 1, title: 'Chart 1', date: '2026-10-02' },
  { id: 'sub-4', taskNumber: 1, title: 'Chart 2', date: '2026-10-01' }
];
const recsB = getSmartDailyRecommendations({
  submissions: subTask1Heavy,
  allTasks: mockTasks,
  currentTaskId: 'cambridge-18-t1-bar'
});
const recB = recsB.find(r => r.id === 'rec-balance-task2');
assert.ok(recB, 'Should include Task 2 prioritization recommendation');
assert.strictEqual(recB.actionPayload.taskNumber, 2, 'Candidate task must be Task 2');
console.log('    ✅ Rule B: Task 2 weight prioritization verified.');

// Test 1.3: Rule C - Mistakes SRS prescription trigger
const mockMistakes = [
  { id: 'm-1', type: 'grammar', text: 'in the other hand' },
  { id: 'm-2', type: 'lexical', text: 'very good' }
];
const recsC = getSmartDailyRecommendations({
  submissions: [],
  mistakes: mockMistakes,
  allTasks: mockTasks
});
const recMistakes = recsC.find(r => r.id === 'rec-fix-mistakes');
assert.ok(recMistakes, 'Must trigger prescription recommendation when mistakes exist');
assert.strictEqual(recMistakes.actionType, 'open_modal', 'Must trigger modal opening');
assert.strictEqual(recMistakes.actionPayload, 'prescription', 'Must open prescription modal');
console.log('    ✅ Rule C: Logged mistakes prescription trigger verified.');

// Test 1.4: Rule D - AWL & Collocations for Target Band >= 7.0
const recsD = getSmartDailyRecommendations({
  submissions: [],
  targetBand: '7.5',
  allTasks: mockTasks
});
const recVocab = recsD.find(r => r.id === 'rec-expand-vocab');
assert.ok(recVocab, 'Must trigger vocab/grammar expansion for target band >= 7.0');
assert.strictEqual(recVocab.actionPayload, 'vocabGrammar');
console.log('    ✅ Rule D: Academic vocabulary expansion verified.');

// Test 1.5: Rule E - Warm-up Micro-Drill when no submissions today
const recsE = getSmartDailyRecommendations({
  submissions: [{ id: 'old-sub', date: '2025-01-01' }],
  allTasks: mockTasks
});
const recDrill = recsE.find(r => r.id === 'rec-quick-micro-drill');
assert.ok(recDrill, 'Must trigger micro-drill when no submissions completed today');
assert.strictEqual(recDrill.actionPayload, 'microDrills');
console.log('    ✅ Rule E: Daily warm-up micro-drill trigger verified.');

// Test 1.6: Safe Fallback when completely empty
const recsFallback = getSmartDailyRecommendations({});
assert.ok(recsFallback.length > 0, 'Must provide default fallback recommendation');
assert.ok(recsFallback[0].title.length > 0, 'Fallback recommendation must have valid title');
console.log('    ✅ Fallback recommendation resilience verified.');

// -------------------------------------------------------------
// 2. Storage Dismissal & Persistence Mechanics
// -------------------------------------------------------------
console.log('  ▶ 2. Verifying dismissal and reset mechanics...');
resetRecommendationDismissal();
assert.strictEqual(isRecommendationDismissedToday(), false, 'Should not be dismissed after reset');
dismissRecommendationForToday();
assert.strictEqual(isRecommendationDismissedToday(), true, 'Should be dismissed after dismiss call');
resetRecommendationDismissal();
assert.strictEqual(isRecommendationDismissedToday(), false, 'Should be reset cleanly');
console.log('    ✅ Dismissal state management verified.');

// -------------------------------------------------------------
// 3. UI Component Files Integrity
// -------------------------------------------------------------
console.log('  ▶ 3. Verifying SmartRecommendationBanner.jsx component...');
const bannerPath = path.resolve('src/components/SmartRecommendationBanner.jsx');
assert.ok(fs.existsSync(bannerPath), 'SmartRecommendationBanner.jsx must exist');
const bannerCode = fs.readFileSync(bannerPath, 'utf8');
assert.ok(bannerCode.includes('getSmartDailyRecommendations'), 'Banner must call recommendation service');
assert.ok(bannerCode.includes('handleExecuteAction'), 'Banner must handle action execution');
assert.ok(bannerCode.includes('handleNextRecommendation'), 'Banner must support cycling recommendations');
assert.ok(bannerCode.includes('handleToggleCollapse'), 'Banner must support collapsing');
assert.ok(bannerCode.includes('isFocusMode'), 'Banner must respect focus mode');
console.log('    ✅ SmartRecommendationBanner.jsx component verified.');

// -------------------------------------------------------------
// 4. Architectural Integration in WritingWorkspace.jsx & App.jsx
// -------------------------------------------------------------
console.log('  ▶ 4. Verifying integration in WritingWorkspace.jsx & App.jsx...');
const writingWorkspacePath = path.resolve('src/components/writing/WritingWorkspace.jsx');
assert.ok(fs.existsSync(writingWorkspacePath), 'WritingWorkspace.jsx must exist');
const workspaceCode = fs.readFileSync(writingWorkspacePath, 'utf8');
assert.ok(workspaceCode.includes('import SmartRecommendationBanner'), 'WritingWorkspace must import SmartRecommendationBanner');
assert.ok(workspaceCode.includes('<SmartRecommendationBanner'), 'WritingWorkspace must render SmartRecommendationBanner');
assert.ok(workspaceCode.includes('allTasks = []'), 'WritingWorkspace must accept allTasks');
assert.ok(workspaceCode.includes('submissions = []'), 'WritingWorkspace must accept submissions');

const appPath = path.resolve('src/App.jsx');
const appCode = fs.readFileSync(appPath, 'utf8');
assert.ok(appCode.includes('allTasks={allTasks}'), 'App.jsx must pass allTasks to WritingWorkspace');
assert.ok(appCode.includes('submissions={submissions}'), 'App.jsx must pass submissions to WritingWorkspace');
assert.ok(appCode.includes('onSelectTask='), 'App.jsx must pass onSelectTask to WritingWorkspace');
assert.ok(appCode.includes('onOpenModal='), 'App.jsx must pass onOpenModal to WritingWorkspace');
console.log('    ✅ WritingWorkspace and App.jsx integration verified.');

// -------------------------------------------------------------
// 5. Feature Registry Declarative Metadata
// -------------------------------------------------------------
console.log('  ▶ 5. Verifying Feature Registry entry...');
const feat = getFeatureById('feat-smart-recommendation-engine');
assert.ok(feat, 'feat-smart-recommendation-engine must be registered in featureRegistry.js');
assert.strictEqual(feat.category, 'practice_tools', 'Category must be practice_tools');
assert.ok(feat.highlights && feat.highlights.length >= 3, 'Must have detailed highlights');
console.log('    ✅ featureRegistry.js entry verified.');

console.log('🎉 Step 85 Test Suite PASSED: Smart Daily Recommendation 100% VERIFIED!\n');
