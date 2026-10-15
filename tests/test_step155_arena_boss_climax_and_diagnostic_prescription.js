/**
 * tests/test_step155_arena_boss_climax_and_diagnostic_prescription.js
 * 
 * Step 155 Verification Suite:
 * Atlas English Arena Phase 2:
 * 1. Cambridge Boss Climax Question (Q7/Q10) & x2 XP Boss Slayer Celebration
 * 2. 4-Axis Cambridge Competency Diagnostic Radar (Orthography, Listening Traps, Reading Logic, Academic Lexicon)
 * 3. 1-Click Cambridge Theory Prescription & Deep-Linking to TheoryHandbookModal
 * 4. Defeated State Recovery Prescription
 * 5. Bilingual Localization Integrity (vi.js & en.js)
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { 
  startSprintAction, 
  checkAnswerAction, 
  skipQuestionAction, 
  finishSprintAction,
  classifyQuestionAxis,
  computeSprintDiagnostics,
  getCambridgeTheoryPrescription,
  ARENA_SPRINT_PHASES 
} from '../src/hooks/useArenaSprintEngine.js';

import { generateArenaSprintQuestions } from '../src/adapters/sprintQuestionAdapter.js';
import { calculateSprintXp } from '../src/services/gamification/xpCalculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting Step 155 Test Suite: Arena Boss Climax, 4-Axis Diagnostics & 1-Click Prescription...');

// =========================================================================
// TEST 1: Boss Climax Tagging & Boss Slayer x2 XP Verification
// =========================================================================
console.log('▶ Test 1: Boss Climax Tagging & Boss Slayer XP Bonus...');

const sampleQuestions = generateArenaSprintQuestions({ count: 7, difficulty: 'medium', recordHistory: false });
assert.strictEqual(sampleQuestions.length, 7, 'Should generate exactly 7 questions for sprint');

const lastQuestion = sampleQuestions[sampleQuestions.length - 1];
assert.strictEqual(lastQuestion.isBossQuestion, true, 'Slot 7 question must be tagged as isBossQuestion: true');

// Verify Boss XP Bonus calculation in xpCalculator
const nonBossXp = calculateSprintXp({
  correctAnswers: 7,
  difficulty: 'medium',
  isBossCleared: false
});

const bossClearedXp = calculateSprintXp({
  correctAnswers: 7,
  difficulty: 'medium',
  isBossCleared: true
});

assert.ok(bossClearedXp.bossBonus > 0, `Boss cleared should award boss bonus, got: ${bossClearedXp.bossBonus}`);
assert.strictEqual(nonBossXp.bossBonus, 0, 'Non-boss cleared should have 0 boss bonus');
assert.ok(bossClearedXp.finalXp > nonBossXp.finalXp, 'Final XP with Boss Slayer bonus should exceed non-boss XP');
console.log(`  ✓ Boss bonus awarded: +${bossClearedXp.bossBonus} XP (Final XP: ${bossClearedXp.finalXp} vs ${nonBossXp.finalXp})`);

// =========================================================================
// TEST 2: 4-Axis Competency Classification Engine
// =========================================================================
console.log('▶ Test 2: 4-Axis Competency Classification Engine...');

const spellingItem = { type: 'spelling', prompt: 'Choose correct spelling', interactionType: 'multiple_choice' };
const textInputItem = { type: 'gap_fill', interactionType: 'text_input', prompt: 'Type word' };
const listeningTrapItem = { skillCategory: 'listening', type: 'listening_trap' };
const listeningDistractorItem = { type: 'listening-distractor' };
const readingTfngItem = { skillCategory: 'reading', type: 'tfng' };
const readingDrillItem = { type: 'reading-tfng' };
const vocabSynonymItem = { skillCategory: 'vocab', type: 'synonym' };
const collocationItem = { skillCategory: 'vocab', type: 'collocation' };

assert.strictEqual(classifyQuestionAxis(spellingItem), 'spelling', 'Spelling trap must classify to spelling');
assert.strictEqual(classifyQuestionAxis(textInputItem), 'spelling', 'Text input typing must classify to spelling');
assert.strictEqual(classifyQuestionAxis(listeningTrapItem), 'listening', 'Listening trap must classify to listening');
assert.strictEqual(classifyQuestionAxis(listeningDistractorItem), 'listening', 'Listening distractor must classify to listening');
assert.strictEqual(classifyQuestionAxis(readingTfngItem), 'reading', 'Reading TFNG must classify to reading');
assert.strictEqual(classifyQuestionAxis(readingDrillItem), 'reading', 'Reading drill must classify to reading');
assert.strictEqual(classifyQuestionAxis(vocabSynonymItem), 'lexicon', 'Vocab synonym must classify to lexicon');
assert.strictEqual(classifyQuestionAxis(collocationItem), 'lexicon', 'Collocation item must classify to lexicon');
console.log('  ✓ All 8 question archetypes correctly mapped to the 4 Cambridge competency axes');

// =========================================================================
// TEST 3: Diagnostic Tally & Weakest Skill Identification
// =========================================================================
console.log('▶ Test 3: Diagnostic Tally & Weakest Skill Identification...');

const mixedHistory = [
  { id: 'q1', type: 'spelling', isCorrect: true },
  { id: 'q2', type: 'spelling', isCorrect: false }, // Spelling: 1/2 (50%)
  { id: 'q3', skillCategory: 'listening', type: 'listening_trap', isCorrect: false },
  { id: 'q4', skillCategory: 'listening', type: 'listening_trap', isCorrect: false }, // Listening: 0/2 (0%)
  { id: 'q5', skillCategory: 'reading', type: 'tfng', isCorrect: true }, // Reading: 1/1 (100%)
  { id: 'q6', skillCategory: 'vocab', type: 'collocation', isCorrect: true },
  { id: 'q7', skillCategory: 'vocab', type: 'collocation', isCorrect: true } // Lexicon: 2/2 (100%)
];

const diagnostics = computeSprintDiagnostics(mixedHistory);
assert.strictEqual(diagnostics.axes.length, 4, 'Must compute exactly 4 axes');

const listeningAxis = diagnostics.axes.find(a => a.key === 'listening');
const spellingAxis = diagnostics.axes.find(a => a.key === 'spelling');
const readingAxis = diagnostics.axes.find(a => a.key === 'reading');
const lexiconAxis = diagnostics.axes.find(a => a.key === 'lexicon');

assert.strictEqual(listeningAxis.correct, 0);
assert.strictEqual(listeningAxis.total, 2);
assert.strictEqual(listeningAxis.rate, 0);
assert.strictEqual(listeningAxis.status, 'critical', '0% must be status: critical');

assert.strictEqual(spellingAxis.correct, 1);
assert.strictEqual(spellingAxis.total, 2);
assert.strictEqual(spellingAxis.rate, 50);
assert.strictEqual(spellingAxis.status, 'warning', '50% must be status: warning');

assert.strictEqual(readingAxis.rate, 100);
assert.strictEqual(readingAxis.status, 'mastered', '100% must be status: mastered');

assert.strictEqual(lexiconAxis.rate, 100);
assert.strictEqual(lexiconAxis.status, 'mastered', '100% must be status: mastered');

assert.strictEqual(diagnostics.weakestSkill, 'listening', 'Lowest rate axis (listening at 0%) must be flagged as weakestSkill');
console.log('  ✓ Correctly identified weakestSkill: "listening" (0% rate, critical status)');

// Test Flawless Case
const flawlessHistory = [
  { id: 'q1', type: 'spelling', isCorrect: true },
  { id: 'q2', skillCategory: 'listening', isCorrect: true },
  { id: 'q3', skillCategory: 'reading', isCorrect: true },
  { id: 'q4', skillCategory: 'vocab', isCorrect: true }
];
const flawlessDiagnostics = computeSprintDiagnostics(flawlessHistory);
assert.strictEqual(flawlessDiagnostics.weakestSkill, null, 'Flawless run should have weakestSkill = null');
console.log('  ✓ Flawless sprint correctly identified with weakestSkill = null');

// =========================================================================
// TEST 4: Cambridge Theory Prescription Generator
// =========================================================================
console.log('▶ Test 4: Cambridge Theory Prescription Generator...');

const spellingRx = getCambridgeTheoryPrescription('spelling');
assert.strictEqual(spellingRx.handbookSkill, 'grammar-vocab');
assert.strictEqual(spellingRx.searchQuery, 'Spelling');
assert.ok(spellingRx.titleVi.includes('Chính Tả'));
assert.ok(spellingRx.titleEn.includes('Spelling'));

const listeningRx = getCambridgeTheoryPrescription('listening');
assert.strictEqual(listeningRx.handbookSkill, 'listening');
assert.strictEqual(listeningRx.searchQuery, 'Distractor');
assert.ok(listeningRx.titleVi.includes('Bẫy Tự Sửa'));
assert.ok(listeningRx.titleEn.includes('Self-Correction'));

const readingRx = getCambridgeTheoryPrescription('reading');
assert.strictEqual(readingRx.handbookSkill, 'reading');
assert.strictEqual(readingRx.searchQuery, 'True');
assert.ok(readingRx.titleVi.includes('True / False / Not Given'));
assert.ok(readingRx.titleEn.includes('True / False / Not Given'));

const lexiconRx = getCambridgeTheoryPrescription('lexicon');
assert.strictEqual(lexiconRx.handbookSkill, 'grammar-vocab');
assert.strictEqual(lexiconRx.searchQuery, 'Collocation');
assert.ok(lexiconRx.titleVi.includes('Collocation'));

const perfectRx = getCambridgeTheoryPrescription(null);
assert.strictEqual(perfectRx.handbookSkill, 'grammar-vocab');
assert.ok(perfectRx.titleVi.includes('Band 8.5+'));
console.log('  ✓ Prescriptions accurately mapped to corresponding Theory Handbook chapters and search queries');

// =========================================================================
// TEST 5: Full Sprint Lifecycle with Diagnostic History & Summary
// =========================================================================
console.log('▶ Test 5: Full Sprint Lifecycle with Diagnostic History & Summary...');

const mockQuestions = [
  { id: 'mock_1', type: 'spelling', options: ['A', 'B'], correctIndex: 0, correctAnswer: 'A', interactionType: 'multiple_choice' },
  { id: 'mock_2', skillCategory: 'listening', type: 'listening_trap', options: ['A', 'B'], correctIndex: 0, correctAnswer: 'A' },
  { id: 'mock_3', skillCategory: 'reading', type: 'tfng', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctIndex: 0, correctAnswer: 'TRUE' },
  { id: 'mock_4', skillCategory: 'vocab', type: 'collocation', options: ['A', 'B'], correctIndex: 0, correctAnswer: 'A', isBossQuestion: true }
];

let state = startSprintAction(mockQuestions, 180, 'medium');
assert.strictEqual(state.questionHistory.length, 0, 'Initial questionHistory must be empty');

// Q1: Spelling - Correct
state = { ...state, selectedOption: 0 };
state = checkAnswerAction(state);
assert.strictEqual(state.questionHistory.length, 1);
assert.strictEqual(state.questionHistory[0].id, 'mock_1');
assert.strictEqual(state.questionHistory[0].isCorrect, true);

// Advance to Q2
state = { ...state, phase: ARENA_SPRINT_PHASES.ACTIVE, currentIndex: 1, selectedOption: null, isAnswerChecked: false };

// Q2: Listening - Skipped / Incorrect
state = skipQuestionAction(state);
assert.strictEqual(state.questionHistory.length, 2);
assert.strictEqual(state.questionHistory[1].id, 'mock_2');
assert.strictEqual(state.questionHistory[1].isCorrect, false);
assert.strictEqual(state.questionHistory[1].isSkipped, true);

// Advance to Q3
state = { ...state, phase: ARENA_SPRINT_PHASES.ACTIVE, currentIndex: 2, selectedOption: null, isAnswerChecked: false };

// Q3: Reading - Correct
state = { ...state, selectedOption: 0 };
state = checkAnswerAction(state);
assert.strictEqual(state.questionHistory.length, 3);
assert.strictEqual(state.questionHistory[2].isCorrect, true);

// Advance to Q4 (Boss Question)
state = { ...state, phase: ARENA_SPRINT_PHASES.ACTIVE, currentIndex: 3, selectedOption: null, isAnswerChecked: false };

// Q4: Boss - Correct
state = { ...state, selectedOption: 0 };
state = checkAnswerAction(state);
assert.strictEqual(state.isBossCleared, true, 'isBossCleared must be true after clearing Boss');
assert.strictEqual(state.questionHistory.length, 4);
assert.strictEqual(state.questionHistory[3].isBossQuestion, true);

// Complete the sprint
const completedState = finishSprintAction(state);
assert.strictEqual(completedState.phase, ARENA_SPRINT_PHASES.COMPLETED);
assert.ok(completedState.summary, 'Summary object must exist');
assert.strictEqual(completedState.summary.isBossCleared, true);
assert.ok(completedState.summary.bossBonus > 0, 'Boss bonus XP must be awarded');
assert.ok(Array.isArray(completedState.summary.diagnosticSkills), 'diagnosticSkills must be an array');
assert.strictEqual(completedState.summary.diagnosticSkills.length, 4);

// Weakest skill should be listening (0% because skipped)
assert.strictEqual(completedState.summary.weakestSkill, 'listening');
assert.ok(completedState.summary.prescription, 'prescription must be generated');
assert.strictEqual(completedState.summary.prescription.skillKey, 'listening');
console.log('  ✓ Sprint successfully completed with diagnostic skills and 1-Click Cambridge prescription');

// =========================================================================
// TEST 6: Component Structure & UI Token Audit
// =========================================================================
console.log('▶ Test 6: Component Structure & UI Token Audit...');

const questionCardCode = fs.readFileSync(path.join(rootDir, 'src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');
assert.ok(questionCardCode.includes('question.isBossQuestion'), 'ArenaQuestionCard must check question.isBossQuestion');
assert.ok(questionCardCode.includes('bossClimaxBadge'), 'ArenaQuestionCard must render bossClimaxBadge');
assert.ok(questionCardCode.includes('bossSlayerTitle'), 'ArenaQuestionCard must render bossSlayerTitle');

const summaryModalCode = fs.readFileSync(path.join(rootDir, 'src/components/arena/ArenaSprintSummaryModal.jsx'), 'utf-8');
assert.ok(summaryModalCode.includes('diagnosticRadarTitle'), 'ArenaSprintSummaryModal must render diagnosticRadarTitle');
assert.ok(summaryModalCode.includes('prescriptionTitle'), 'ArenaSprintSummaryModal must render prescriptionTitle');
assert.ok(summaryModalCode.includes('handleOpenTheory'), 'ArenaSprintSummaryModal must include handleOpenTheory');
assert.ok(summaryModalCode.includes('openModal'), 'ArenaSprintSummaryModal must support openModal');

const arenaModalCode = fs.readFileSync(path.join(rootDir, 'src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
assert.ok(arenaModalCode.includes('defeatedPrescription'), 'AtlasEnglishArenaModal must compute defeatedPrescription');
assert.ok(arenaModalCode.includes('handleOpenTheoryPrescription'), 'AtlasEnglishArenaModal must have handleOpenTheoryPrescription');
assert.ok(arenaModalCode.includes('onOpenTheory={handleOpenTheoryPrescription}'), 'AtlasEnglishArenaModal must pass onOpenTheory to summary modal');

// =========================================================================
// TEST 7: Bilingual Translations (vi.js & en.js)
// =========================================================================
console.log('▶ Test 7: Bilingual Translations (vi.js & en.js)...');

const viContent = fs.readFileSync(path.join(rootDir, 'src/i18n/locales/vi.js'), 'utf-8');
const enContent = fs.readFileSync(path.join(rootDir, 'src/i18n/locales/en.js'), 'utf-8');

const requiredKeys = [
  'bossClimaxBadge',
  'bossSlayerTitle',
  'diagnosticRadarTitle',
  'diagnosticSubtitle',
  'skillOrthography',
  'skillDistractors',
  'skillLogic',
  'skillLexicon',
  'prescriptionTitle',
  'prescriptionSubtitle',
  'reviewInHandbook'
];

requiredKeys.forEach(k => {
  assert.ok(viContent.includes(`${k}:`), `vi.js must define arena.${k}`);
  assert.ok(enContent.includes(`${k}:`), `en.js must define arena.${k}`);
});
console.log('  ✓ All 11 bilingual keys verified across vi.js and en.js');

console.log('\n===============================================================');
console.log('🎉 STEP 155 VERIFICATION COMPLETE: ALL TESTS PASSED (100%)!');
console.log('===============================================================\n');
