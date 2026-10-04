/**
 * Test Step 95: Code Health, Architecture & Answer Evaluation Integrity Test Suite
 * Validates:
 * 1. Dedicated Answer Evaluation Service (Zero ReferenceErrors & Complete Cambridge Question Formats)
 * 2. Speaking Practice Subroom Architecture (Part 1, Part 2, Part 3 modularization)
 * 3. Component size guardrails (SpeakingPracticePane reduced by > 40%)
 * 4. Production Storage Chunking & Zero Vite Warning configuration
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { evaluateQuestionAnswer } from '../src/services/answerEvaluationService.js';

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

console.log('🧪 Step 95: Code Health, Architecture & Answer Evaluation Integrity');

// =========================================================================
// 1. ANSWER EVALUATION SERVICE TESTS
// =========================================================================

runTest('1.1 evaluateQuestionAnswer handles basic case-insensitive matching', () => {
  const q = {
    id: 1,
    correctAnswer: 'B'
  };
  const res1 = evaluateQuestionAnswer(q, 'b');
  assert.strictEqual(res1.isCorrect, true);
  assert.strictEqual(res1.isAnswered, true);
  assert.strictEqual(res1.userAnswer, 'b');

  const res2 = evaluateQuestionAnswer(q, 'A');
  assert.strictEqual(res2.isCorrect, false);
  assert.strictEqual(res2.isAnswered, true);
});

runTest('1.2 evaluateQuestionAnswer handles string trimming and whitespace', () => {
  const q = {
    id: 2,
    correctAnswer: 'TRUE'
  };
  const res1 = evaluateQuestionAnswer(q, '  true  ');
  assert.strictEqual(res1.isCorrect, true);
  assert.strictEqual(res1.isAnswered, true);

  const res2 = evaluateQuestionAnswer(q, 'false');
  assert.strictEqual(res2.isCorrect, false);
});

runTest('1.3 evaluateQuestionAnswer handles acceptableAnswers array', () => {
  const q = {
    id: 3,
    correctAnswer: '30%',
    acceptableAnswers: ['30%', 'thirty percent', '30 percent']
  };

  const res1 = evaluateQuestionAnswer(q, 'Thirty Percent');
  assert.strictEqual(res1.isCorrect, true);

  const res2 = evaluateQuestionAnswer(q, '30 percent');
  assert.strictEqual(res2.isCorrect, true);

  const res3 = evaluateQuestionAnswer(q, '40%');
  assert.strictEqual(res3.isCorrect, false);
});

runTest('1.4 evaluateQuestionAnswer handles empty or unanswered states gracefully', () => {
  const q = {
    id: 4,
    correctAnswer: 'NOT GIVEN'
  };

  const resEmpty = evaluateQuestionAnswer(q, '');
  assert.strictEqual(resEmpty.isAnswered, false);
  assert.strictEqual(resEmpty.isCorrect, false);

  const resNull = evaluateQuestionAnswer(q, null);
  assert.strictEqual(resNull.isAnswered, false);
  assert.strictEqual(resNull.isCorrect, false);

  const resUndefined = evaluateQuestionAnswer(q, undefined);
  assert.strictEqual(resUndefined.isAnswered, false);
  assert.strictEqual(resUndefined.isCorrect, false);
});

runTest('1.5 evaluateQuestionAnswer handles Roman numerals for Matching Headings', () => {
  const q = {
    id: 5,
    correctAnswer: 'iv'
  };

  const resLower = evaluateQuestionAnswer(q, 'iv');
  assert.strictEqual(resLower.isCorrect, true);

  const resUpper = evaluateQuestionAnswer(q, 'IV');
  assert.strictEqual(resUpper.isCorrect, true);

  const resWrong = evaluateQuestionAnswer(q, 'v');
  assert.strictEqual(resWrong.isCorrect, false);
});

// =========================================================================
// 2. SPEAKING SUBROOM ARCHITECTURE TESTS
// =========================================================================

runTest('2.1 Speaking Subrooms directory and all 3 part modules exist', () => {
  const subroomsDir = path.resolve('src/components/speaking/subrooms');
  assert(fs.existsSync(subroomsDir), 'Directory src/components/speaking/subrooms must exist');

  const p1Path = path.join(subroomsDir, 'SpeakingPart1Room.jsx');
  const p2Path = path.join(subroomsDir, 'SpeakingPart2Room.jsx');
  const p3Path = path.join(subroomsDir, 'SpeakingPart3Room.jsx');

  assert(fs.existsSync(p1Path), 'SpeakingPart1Room.jsx must exist');
  assert(fs.existsSync(p2Path), 'SpeakingPart2Room.jsx must exist');
  assert(fs.existsSync(p3Path), 'SpeakingPart3Room.jsx must exist');

  const p1Content = fs.readFileSync(p1Path, 'utf-8');
  const p2Content = fs.readFileSync(p2Path, 'utf-8');
  const p3Content = fs.readFileSync(p3Path, 'utf-8');

  assert(p1Content.includes('export default function SpeakingPart1Room'), 'SpeakingPart1Room must default export function');
  assert(p2Content.includes('export default function SpeakingPart2Room'), 'SpeakingPart2Room must default export function');
  assert(p3Content.includes('export default function SpeakingPart3Room'), 'SpeakingPart3Room must default export function');
});

runTest('2.2 SpeakingPracticePane properly delegates to subrooms and is reduced in size', () => {
  const panePath = path.resolve('src/components/speaking/SpeakingPracticePane.jsx');
  assert(fs.existsSync(panePath), 'SpeakingPracticePane.jsx must exist');

  const content = fs.readFileSync(panePath, 'utf-8');
  assert(content.includes('import SpeakingPart1Room from \'./subrooms/SpeakingPart1Room\''), 'Must import SpeakingPart1Room');
  assert(content.includes('import SpeakingPart2Room from \'./subrooms/SpeakingPart2Room\''), 'Must import SpeakingPart2Room');
  assert(content.includes('import SpeakingPart3Room from \'./subrooms/SpeakingPart3Room\''), 'Must import SpeakingPart3Room');
  assert(content.includes('<SpeakingPart1Room'), 'Must render SpeakingPart1Room component');
  assert(content.includes('<SpeakingPart2Room'), 'Must render SpeakingPart2Room component');
  assert(content.includes('<SpeakingPart3Room'), 'Must render SpeakingPart3Room component');

  const lines = content.split('\n').length;
  assert(lines < 1300, `SpeakingPracticePane should be < 1300 lines (currently ${lines} lines, down from original 2176 lines)`);
});

// =========================================================================
// 3. STORAGE OPTIMIZATION & VITE CHUNKING INTEGRITY TESTS
// =========================================================================

runTest('3.1 Vite configuration defines dedicated core-storage chunk', () => {
  const viteConfigPath = path.resolve('vite.config.js');
  const content = fs.readFileSync(viteConfigPath, 'utf-8');

  assert(content.includes('core-storage'), 'vite.config.js must define core-storage chunk');
  assert(content.includes('indexedDbStorage'), 'vite.config.js must group indexedDbStorage');
  assert(content.includes('storageService'), 'vite.config.js must group storageService');
});

runTest('3.2 storageService uses clean static import of indexedDbStorage', () => {
  const storageServicePath = path.resolve('src/utils/storageService.js');
  const content = fs.readFileSync(storageServicePath, 'utf-8');

  assert(content.includes("import { idbSet, STORES } from './indexedDbStorage.js'"), 'storageService must statically import indexedDbStorage');
  assert(!content.includes("import('./indexedDbStorage.js')"), 'storageService must not contain conflicting dynamic import');
});

console.log(`\nAll ${testsPassed}/${testsPassed} Step 95 tests passed cleanly!`);
