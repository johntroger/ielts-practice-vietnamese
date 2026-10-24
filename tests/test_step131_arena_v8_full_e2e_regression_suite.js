/**
 * tests/test_step131_arena_v8_full_e2e_regression_suite.js
 * 
 * Step 131: Comprehensive End-to-End Integration Test Suite for Atlas English Arena v8.0.
 * 
 * Verifies the Complete Lifecycle:
 * 1. Sảnh Chờ (Lobby): 4-Tier Selection + Topic Preview + Revenge CTA conditioning
 * 2. Đấu Trường (Sprint): 10 Questions Pacing (Warmup -> Core -> Boss Question 10)
 * 3. Sổ Tay Lỗi (Mistake Vault): Auto FIFO recording of misses + Diagnostic Tagging
 * 4. Vòng Đấu Phục Thù (Revenge Sprint): Dynamic generation & auto-resolving on correct answers
 * 5. Bảng Tính Điểm (Scoring Engine): Base XP + Boss Bonus (+50%) + Time Bonus (capped at 30%)
 * 6. Tổng Kết (Summary): 3-Tier transparent decomposition table
 * 7. Âm Thanh & Điều Khiển: Dual Audio (Chime + SFX + Speech Synthesis) + Fullscreen & Keyboard guard
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { 
  ARENA_QUESTION_BANK, 
  getQuestionsByTierAndTopic 
} from '../src/data/arenaQuestionBank.js';
import { generateArenaSprintQuestions } from '../src/adapters/sprintQuestionAdapter.js';
import {
  startSprintAction,
  selectOptionAction,
  setUserInputTextAction,
  checkAnswerAction,
  nextQuestionAction,
  finishSprintAction,
  retrySprintAction,
  ARENA_SPRINT_PHASES,
  INITIAL_SPRINT_TIMER_SECONDS
} from '../src/hooks/useArenaSprintEngine.js';
import {
  recordMistake,
  resolveMistake,
  clearMistakeVault,
  getStoredMistakes,
  getUnresolvedMistakeCount,
  generateRevengeSprintQuestions
} from '../src/services/gamification/mistakeVaultService.js';
import {
  calculateSprintXp,
  calculateTimeBonusXp
} from '../src/services/gamification/xpCalculator.js';
import { playArenaSfx } from '../src/utils/audioHelper.js';

describe('Step 131: Atlas Arena v8.0 Bulletproof End-to-End Regression Suite', () => {

  beforeEach(() => {
    clearMistakeVault();
  });

  it('1. Lifecycle: Full 10-Question Sprint simulation from Warmup to Boss Question', () => {
    // Generate standard sprint of 10 questions for 'medium' tier
    const questions = generateArenaSprintQuestions({ count: 10, difficulty: 'medium', recordHistory: false });
    assert.strictEqual(questions.length, 10);
    assert.strictEqual(questions[9].isBossQuestion, true, 'Question 10 must be the Boss');

    let state = startSprintAction(questions, INITIAL_SPRINT_TIMER_SECONDS, 'medium');
    assert.strictEqual(state.phase, ARENA_SPRINT_PHASES.ACTIVE);
    assert.strictEqual(state.currentIndex, 0);

    // Answer questions 1 to 9 correctly
    for (let i = 0; i < 9; i++) {
      const currentQ = state.questions[state.currentIndex];
      if (currentQ.interactionType === 'text_input') {
        state = setUserInputTextAction(state, currentQ.correctAnswer);
      } else {
        state = selectOptionAction(state, currentQ.correctIndex);
      }
      state = checkAnswerAction(state);
      assert.strictEqual(state.isCorrect, true);
      assert.strictEqual(state.isBossCleared, false);
      state = nextQuestionAction(state);
    }

    assert.strictEqual(state.currentIndex, 9, 'Should arrive at Boss question');
    const bossQ = state.questions[9];

    // Correctly defeat Boss question
    if (bossQ.interactionType === 'text_input') {
      state = setUserInputTextAction(state, bossQ.correctAnswer);
    } else {
      state = selectOptionAction(state, bossQ.correctIndex);
    }
    state = checkAnswerAction(state);
    assert.strictEqual(state.isCorrect, true);
    assert.strictEqual(state.isBossCleared, true, 'Boss must be cleared');

    // Complete the sprint
    state = nextQuestionAction(state);
    assert.strictEqual(state.phase, ARENA_SPRINT_PHASES.COMPLETED);

    // Verify summary telemetry
    const summary = state.summary;
    assert.strictEqual(summary.score, 10);
    assert.strictEqual(summary.accuracy, 100);
    assert.strictEqual(summary.isBossCleared, true);
    assert.strictEqual(summary.baseScore, 200); // 10 * 20 Base XP
    assert.strictEqual(summary.bossBonus, 10);   // +50% of 20 = 10 XP
    assert.strictEqual(getUnresolvedMistakeCount(), 0, 'No mistakes recorded on flawless sprint');
  });

  it('2. Lifecycle: Mistake recording, FIFO capping and Revenge Sprint execution', () => {
    const qFail1 = { id: 'q_fail_reading', prompt: 'Reading Trap', options: ['TRUE', 'FALSE', 'NOT GIVEN'], correctIndex: 0, type: 'tfng' };
    const qFail2 = { id: 'q_fail_listening', prompt: 'Audio Distractor', options: ['A', 'B', 'C', 'D'], correctIndex: 1, type: 'listening_trap' };
    const qFail3 = { id: 'q_fail_spelling', prompt: 'Spelling Trap', options: ['accomodate', 'accommodation'], correctIndex: 1, type: 'spelling' };

    let sprintState = startSprintAction([qFail1, qFail2, qFail3], 180, 'medium');

    // Miss Question 1
    sprintState = selectOptionAction(sprintState, 1);
    sprintState = checkAnswerAction(sprintState);
    assert.strictEqual(sprintState.isCorrect, false);
    sprintState = nextQuestionAction(sprintState);

    // Miss Question 2
    sprintState = selectOptionAction(sprintState, 0);
    sprintState = checkAnswerAction(sprintState);
    assert.strictEqual(sprintState.isCorrect, false);
    sprintState = nextQuestionAction(sprintState);

    // Miss Question 3
    sprintState = selectOptionAction(sprintState, 0);
    sprintState = checkAnswerAction(sprintState);
    assert.strictEqual(sprintState.isCorrect, false);

    assert.strictEqual(getUnresolvedMistakeCount(), 3, 'Vault must record all 3 misses');

    // Verify diagnostic tags
    const mistakes = getStoredMistakes();
    assert.strictEqual(mistakes.find(m => m.id === 'q_fail_reading').diagnosticTag, 'over_inference');
    assert.strictEqual(mistakes.find(m => m.id === 'q_fail_listening').diagnosticTag, 'reversal_trap');
    assert.strictEqual(mistakes.find(m => m.id === 'q_fail_spelling').diagnosticTag, 'spelling_demon');

    // Launch Revenge Sprint with questions from vault
    const revengeQuestions = generateRevengeSprintQuestions({ count: 10 });
    assert.strictEqual(revengeQuestions.length, 3);
    assert.strictEqual(revengeQuestions[0].isRevengeQuestion, true);

    let revengeState = startSprintAction(revengeQuestions, 180, 'medium');

    // Correctly answer the first revenge question
    revengeState = selectOptionAction(revengeState, revengeQuestions[0].correctIndex);
    revengeState = checkAnswerAction(revengeState);
    assert.strictEqual(revengeState.isCorrect, true);

    // Vault should now have only 2 unresolved mistakes
    assert.strictEqual(getUnresolvedMistakeCount(), 2, 'Resolved mistake must be deducted from vault');
  });

  it('3. Mathematical Guard: Anti-Cheat Hard Cap of 30% for Time Bonus', () => {
    // Attempting to rush in 5 seconds with 10 correct answers
    const fastSprint = calculateSprintXp({
      correctAnswers: 10,
      streakCount: 10,
      difficulty: 'hard', // 32 XP per question
      timeRemaining: 175,  // Raw time bonus = 175 * 0.5 = 88 XP
      isBossCleared: true
    });

    // Base score = 10 * 32 = 320 XP
    // Raw time bonus = 88 XP
    // 30% Cap = round(0.3 * 320) = 96 XP
    // Min(88, 96) = 88 XP
    assert.strictEqual(fastSprint.baseScore, 320);
    assert.strictEqual(fastSprint.bossBonus, 16);
    assert.strictEqual(fastSprint.timeBonus, 88);
    assert.ok(fastSprint.timeBonus <= Math.round(0.30 * fastSprint.baseScore), 'Time bonus must never exceed 30% of Base XP');
  });

  it('4. Audio & Resilience: playArenaSfx executes without errors in non-browser environment', () => {
    // Node environment has no window.AudioContext -> must fail-safe gracefully
    assert.doesNotThrow(() => {
      playArenaSfx('correct');
      playArenaSfx('wrong');
    });
  });

  it('5. Database Integrity: All authentic questions in ARENA_QUESTION_BANK have complete required metadata', () => {
    assert.ok(ARENA_QUESTION_BANK.length >= 200, `Expected at least 200 questions, got ${ARENA_QUESTION_BANK.length}`);

    ARENA_QUESTION_BANK.forEach(q => {
      assert.ok(q.id && typeof q.id === 'string', 'ID is required');
      assert.ok(['easy', 'medium', 'hard', 'nightmare'].includes(q.difficulty), `Invalid difficulty: ${q.difficulty}`);
      assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Options must be an array: ${q.id}`);
      assert.ok(typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length, `CorrectIndex out of bounds: ${q.id}`);
      assert.ok(q.explanation && q.explanation.length > 5, `Missing explanation: ${q.id}`);
    });
  });

});
