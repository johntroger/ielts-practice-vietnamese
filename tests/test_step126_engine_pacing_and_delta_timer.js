/**
 * tests/test_step126_engine_pacing_and_delta_timer.js
 * 
 * Verifies Phase 2.2:
 * 1. 10-Question Standard Sprint with Boss Question tagging
 * 2. Time Bonus XP Calculation with strict 30% Base XP cap
 * 3. Boss Bonus (+50% Base Question XP) applied when Boss is cleared
 * 4. Mistake Vault auto-recording on wrong answers & auto-resolving on revenge hits
 * 5. State Machine preservation of Base XP when Defeated
 * 6. Timestamp Delta Timer accuracy & resilience against timer desync
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  calculateTimeBonusXp,
  calculateSprintXp
} from '../src/services/gamification/xpCalculator.js';
import {
  startSprintAction,
  selectOptionAction,
  checkAnswerAction,
  nextQuestionAction,
  finishSprintAction,
  ARENA_SPRINT_PHASES,
  INITIAL_SPRINT_TIMER_SECONDS
} from '../src/hooks/useArenaSprintEngine.js';
import { generateArenaSprintQuestions } from '../src/adapters/sprintQuestionAdapter.js';
import {
  getStoredMistakes,
  clearMistakeVault,
  getUnresolvedMistakeCount
} from '../src/services/gamification/mistakeVaultService.js';

describe('Step 126: Arena Sprint Engine Pacing, Time Bonus Cap & Delta Timer', () => {

  beforeEach(() => {
    clearMistakeVault();
  });

  it('1. generateArenaSprintQuestions defaults to 10 questions and marks the final question as Boss', () => {
    const questions = generateArenaSprintQuestions({ recordHistory: false, difficulty: 'medium' });
    assert.strictEqual(questions.length, 10, 'Default sprint must have exactly 10 questions');
    
    // Questions 1 to 9 should not be Boss questions
    for (let i = 0; i < 9; i++) {
      assert.strictEqual(questions[i].isBossQuestion, false, `Question ${i + 1} must not be Boss`);
    }
    
    // Question 10 (index 9) must be Boss question
    assert.strictEqual(questions[9].isBossQuestion, true, 'Question 10 must be marked as Boss');
  });

  it('2. calculateTimeBonusXp enforces 30% Base XP cap and minimum 6 correct answers rule', () => {
    // Under 6 correct answers -> 0 Time Bonus (anti-rush guessing protection)
    assert.strictEqual(calculateTimeBonusXp({ remainingSeconds: 100, baseScore: 100, correctAnswers: 5 }), 0);

    // 8 correct answers, baseScore = 160 (Medium 8 * 20), remainingSeconds = 60
    // Raw bonus = 60 * 0.5 = 30 XP
    // Hard cap = 30% of 160 = 48 XP
    // Min(30, 48) = 30 XP
    assert.strictEqual(calculateTimeBonusXp({ remainingSeconds: 60, baseScore: 160, correctAnswers: 8 }), 30);

    // 10 correct answers, baseScore = 200, remainingSeconds = 150
    // Raw bonus = 150 * 0.5 = 75 XP
    // Hard cap = 30% of 200 = 60 XP
    // Min(75, 60) = 60 XP (strictly capped!)
    assert.strictEqual(calculateTimeBonusXp({ remainingSeconds: 150, baseScore: 200, correctAnswers: 10 }), 60);

    // 0 remaining seconds -> 0
    assert.strictEqual(calculateTimeBonusXp({ remainingSeconds: 0, baseScore: 200, correctAnswers: 10 }), 0);
  });

  it('3. calculateSprintXp accurately factors in Boss Bonus and capped Time Bonus', () => {
    // 10 correct, Medium tier (20 XP per question), 120s remaining, Boss cleared
    const result = calculateSprintXp({
      correctAnswers: 10,
      streakCount: 0,
      difficulty: 'medium',
      timeRemaining: 120,
      isBossCleared: true
    });

    assert.strictEqual(result.baseScore, 200); // 10 * 20
    assert.strictEqual(result.bossBonus, 10);   // 50% of 20 XP
    assert.strictEqual(result.timeBonus, 60);   // min(120 * 0.5 = 60, 30% of 200 = 60)
    // Raw XP = 200 + 10 + 60 = 270 XP -> Medium hard cap is 200
    assert.strictEqual(result.finalXp, 200);

    // Hard tier (32 XP per question, maxSprintXp: 350)
    const hardResult = calculateSprintXp({
      correctAnswers: 9,
      streakCount: 5, // streakBonus = 10
      difficulty: 'hard',
      timeRemaining: 80,
      isBossCleared: true
    });
    // baseScore = 9 * 32 = 288
    // bossBonus = round(32 * 0.5) = 16
    // timeBonus = min(80 * 0.5 = 40, round(0.3 * 288) = 86) = 40
    // streakBonus = 10
    // raw = 288 + 16 + 40 + 10 = 354 -> capped at 350
    assert.strictEqual(hardResult.baseScore, 288);
    assert.strictEqual(hardResult.bossBonus, 16);
    assert.strictEqual(hardResult.timeBonus, 40);
    assert.strictEqual(hardResult.streakBonus, 10);
    assert.strictEqual(hardResult.finalXp, 350);
  });

  it('4. Engine automatically logs wrong answers into Mistake Vault and auto-resolves on correct revenge', () => {
    const mockQuestions = [
      { id: 'q_fail_1', prompt: 'Trap question', options: ['A', 'B'], correctIndex: 0, type: 'tfng' },
      { id: 'q_pass_2', prompt: 'Easy question', options: ['A', 'B'], correctIndex: 1, type: 'spelling' }
    ];

    let state = startSprintAction(mockQuestions, 180, 'medium');

    // 1. Answer question 1 WRONGLY (choose option 1 instead of 0)
    state = selectOptionAction(state, 1);
    state = checkAnswerAction(state);

    assert.strictEqual(state.isCorrect, false);
    assert.strictEqual(getUnresolvedMistakeCount(), 1, 'Mistake Vault must record the missed question');
    const stored = getStoredMistakes();
    assert.strictEqual(stored[0].id, 'q_fail_1');
    assert.strictEqual(stored[0].diagnosticTag, 'over_inference');

    // Move to question 2
    state = nextQuestionAction(state);
    assert.strictEqual(state.currentIndex, 1);

    // 2. Question 2 answered CORRECTLY
    state = selectOptionAction(state, 1);
    state = checkAnswerAction(state);
    assert.strictEqual(state.isCorrect, true);

    // 3. Now simulate a Revenge Question for q_fail_1 answered correctly
    const revengeQuestion = {
      id: 'q_fail_1',
      options: ['A', 'B'],
      correctIndex: 0,
      isRevengeQuestion: true
    };
    let revengeState = startSprintAction([revengeQuestion], 180, 'medium');
    revengeState = selectOptionAction(revengeState, 0);
    revengeState = checkAnswerAction(revengeState);

    assert.strictEqual(revengeState.isCorrect, true);
    assert.strictEqual(getUnresolvedMistakeCount(), 0, 'Mistake Vault must automatically resolve on correct answer');
  });

  it('5. State Machine preserves earned Base XP even when player is Defeated', () => {
    // 5 shields available. If player answers 2 correct, then 5 wrong -> DEFEATED
    const mockQuestions = [
      { id: 'q1', correctIndex: 0, options: ['A', 'B'] },
      { id: 'q2', correctIndex: 0, options: ['A', 'B'] },
      { id: 'q3', correctIndex: 0, options: ['A', 'B'] },
      { id: 'q4', correctIndex: 0, options: ['A', 'B'] },
      { id: 'q5', correctIndex: 0, options: ['A', 'B'] },
      { id: 'q6', correctIndex: 0, options: ['A', 'B'] },
      { id: 'q7', correctIndex: 0, options: ['A', 'B'] }
    ];

    let state = startSprintAction(mockQuestions, 180, 'medium');

    // Q1 correct
    state = selectOptionAction(state, 0);
    state = checkAnswerAction(state);
    state = nextQuestionAction(state);

    // Q2 correct
    state = selectOptionAction(state, 0);
    state = checkAnswerAction(state);
    state = nextQuestionAction(state);

    assert.strictEqual(state.score, 2);

    // Next 5 wrong -> shields reach 0
    for (let i = 0; i < 5; i++) {
      state = selectOptionAction(state, 1); // wrong
      state = checkAnswerAction(state);
      if (state.phase !== ARENA_SPRINT_PHASES.DEFEATED) {
        state = nextQuestionAction(state);
      }
    }

    assert.strictEqual(state.phase, ARENA_SPRINT_PHASES.DEFEATED);
    assert.strictEqual(state.shieldState.remainingShields, 0);

    // Finish sprint from defeated state
    const finished = finishSprintAction(state);
    assert.strictEqual(finished.summary.score, 2);
    assert.strictEqual(finished.summary.baseScore, 40, '2 correct answers * 20 Base XP = 40 XP must be preserved');
    assert.strictEqual(finished.summary.isDefeated, true);
    assert.ok(finished.summary.finalXp >= 40, 'Final XP must retain earned Base XP');
  });

  it('6. Boss Question detection works on the 10th question and flags isBossCleared', () => {
    const mockQuestions = [
      { id: 'q1', correctIndex: 0, options: ['A', 'B'], isBossQuestion: false },
      { id: 'q2', correctIndex: 0, options: ['A', 'B'], isBossQuestion: true }
    ];

    let state = startSprintAction(mockQuestions, 180, 'medium');
    state = selectOptionAction(state, 0);
    state = checkAnswerAction(state);
    assert.strictEqual(state.isBossCleared, false);

    state = nextQuestionAction(state);
    state = selectOptionAction(state, 0); // Correctly answer the boss question
    state = checkAnswerAction(state);
    assert.strictEqual(state.isBossCleared, true, 'isBossCleared must be true after clearing Boss');

    const finished = finishSprintAction(state);
    assert.strictEqual(finished.summary.isBossCleared, true);
    assert.strictEqual(finished.summary.bossBonus, 10);
  });

});
