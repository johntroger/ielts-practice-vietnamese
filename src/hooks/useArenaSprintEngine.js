/**
 * src/hooks/useArenaSprintEngine.js
 * 
 * Production State Machine & Hook for Atlas English Arena.
 * Features:
 * - 5 Phases: IDLE -> ACTIVE -> REVIEWING_ANSWER -> DEFEATED -> COMPLETED
 * - Real-time 90s countdown timer
 * - Instant combo counter and accuracy tracking
 * - 5-Shield management with 1-time emergency retry
 * - 100% testable pure state reducer + React hook
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { generateArenaSprintQuestions } from '../adapters/sprintQuestionAdapter.js';
import { 
  createSprintShieldState, 
  deductShield, 
  useSprintRetry 
} from '../services/gamification/shieldManager.js';
import { 
  calculateSprintXp, 
  incrementDailySprintCount 
} from '../services/gamification/xpCalculator.js';
import { getUnifiedStreakCount } from '../services/gamification/leagueEngine.js';
import { recordGuestPendingXp } from '../services/gamification/guestMigrationService.js';
import { submitSprintXp } from '../services/supabaseLeaderboard.js';
import { emit } from '../services/gamification/eventBus.js';

export const ARENA_SPRINT_PHASES = {
  IDLE: 'IDLE',
  ACTIVE: 'ACTIVE',
  REVIEWING_ANSWER: 'REVIEWING_ANSWER',
  DEFEATED: 'DEFEATED',
  COMPLETED: 'COMPLETED'
};

export const INITIAL_SPRINT_TIMER_SECONDS = 180;

export const INITIAL_SPRINT_STATE = {
  phase: ARENA_SPRINT_PHASES.IDLE,
  questions: [],
  currentIndex: 0,
  selectedOption: null,
  isAnswerChecked: false,
  isCorrect: null,
  score: 0,
  combo: 0,
  maxCombo: 0,
  shieldState: createSprintShieldState(),
  timeRemaining: INITIAL_SPRINT_TIMER_SECONDS,
  summary: null
};

/**
 * Pure state transition functions for unit testing and deterministic execution.
 */
export function startSprintAction(questions = [], duration = INITIAL_SPRINT_TIMER_SECONDS, difficulty = 'medium') {
  return {
    ...INITIAL_SPRINT_STATE,
    phase: ARENA_SPRINT_PHASES.ACTIVE,
    questions,
    timeRemaining: duration,
    duration,
    difficulty,
    shieldState: createSprintShieldState()
  };
}

export function selectOptionAction(state, optionIndex) {
  if (state.phase !== ARENA_SPRINT_PHASES.ACTIVE || state.isAnswerChecked) {
    return state;
  }
  return {
    ...state,
    selectedOption: optionIndex
  };
}

export function checkAnswerAction(state) {
  if (state.phase !== ARENA_SPRINT_PHASES.ACTIVE || state.selectedOption === null || state.isAnswerChecked) {
    return state;
  }

  const currentQ = state.questions[state.currentIndex];
  if (!currentQ) return state;

  const isCorrect = state.selectedOption === currentQ.correctIndex;
  let nextScore = state.score;
  let nextCombo = state.combo;
  let nextMaxCombo = state.maxCombo;
  let nextShieldState = state.shieldState;
  let nextPhase = ARENA_SPRINT_PHASES.REVIEWING_ANSWER;

  if (isCorrect) {
    nextScore += 1;
    nextCombo += 1;
    if (nextCombo > nextMaxCombo) {
      nextMaxCombo = nextCombo;
    }
  } else {
    nextCombo = 0;
    const { state: updatedShields, isDefeated } = deductShield(state.shieldState, currentQ);
    nextShieldState = updatedShields;
    if (isDefeated) {
      nextPhase = ARENA_SPRINT_PHASES.DEFEATED;
    }
  }

  return {
    ...state,
    phase: nextPhase,
    isAnswerChecked: true,
    isCorrect,
    score: nextScore,
    combo: nextCombo,
    maxCombo: nextMaxCombo,
    shieldState: nextShieldState
  };
}

export function nextQuestionAction(state) {
  if (state.phase !== ARENA_SPRINT_PHASES.REVIEWING_ANSWER) {
    return state;
  }

  if (state.currentIndex < state.questions.length - 1) {
    return {
      ...state,
      phase: ARENA_SPRINT_PHASES.ACTIVE,
      currentIndex: state.currentIndex + 1,
      selectedOption: null,
      isAnswerChecked: false,
      isCorrect: null
    };
  }

  // Climax reached: Complete the sprint
  return finishSprintAction(state);
}

export function retrySprintAction(state) {
  if (state.phase !== ARENA_SPRINT_PHASES.DEFEATED) {
    return state;
  }

  const { state: restoredShields, success } = useSprintRetry(state.shieldState);
  if (!success) {
    return state;
  }

  return {
    ...state,
    phase: ARENA_SPRINT_PHASES.ACTIVE,
    shieldState: restoredShields,
    selectedOption: null,
    isAnswerChecked: false,
    isCorrect: null
  };
}

export function finishSprintAction(state, user = null) {
  const totalSeconds = (state.duration || INITIAL_SPRINT_TIMER_SECONDS) - Math.max(0, state.timeRemaining);
  const streak = getUnifiedStreakCount();
  const xpResult = calculateSprintXp({
    correctAnswers: state.score,
    streakCount: streak,
    totalSeconds,
    difficulty: state.difficulty || 'medium'
  });

  incrementDailySprintCount();

  if (user && user.id) {
    submitSprintXp({
      userId: user.id,
      deltaXp: xpResult.finalXp,
      streakCount: streak + 1,
      displayName: user.user_metadata?.display_name || user.user_metadata?.full_name
    });
  } else {
    recordGuestPendingXp(xpResult.finalXp);
  }

  const summary = {
    ...xpResult,
    difficulty: state.difficulty || 'medium',
    score: state.score,
    totalQuestions: state.questions.length,
    accuracy: state.questions.length > 0 ? Math.round((state.score / state.questions.length) * 100) : 0,
    timeSpent: totalSeconds,
    maxCombo: state.maxCombo
  };

  return {
    ...state,
    phase: ARENA_SPRINT_PHASES.COMPLETED,
    summary
  };
}

/**
 * React Hook for Atlas English Arena.
 */
export function useArenaSprintEngine({ user = null, onSprintEnd = null } = {}) {
  const [state, setState] = useState(INITIAL_SPRINT_STATE);
  const timerRef = useRef(null);

  const startSprint = useCallback((customQuestions = null, selectedDifficulty = 'medium') => {
    const qList = customQuestions || generateArenaSprintQuestions({ count: 7, difficulty: selectedDifficulty });
    const next = startSprintAction(qList, INITIAL_SPRINT_TIMER_SECONDS, selectedDifficulty);
    setState(next);
    emit('arena:sprint_started', { totalQuestions: qList.length, difficulty: selectedDifficulty });
  }, []);

  const selectOption = useCallback((idx) => {
    setState(prev => selectOptionAction(prev, idx));
  }, []);

  const checkAnswer = useCallback(() => {
    setState(prev => {
      const next = checkAnswerAction(prev);
      emit('arena:answer_submitted', { isCorrect: next.isCorrect, combo: next.combo });
      if (next.phase === ARENA_SPRINT_PHASES.DEFEATED) {
        emit('arena:sprint_defeated', { mistakes: next.shieldState.mistakesRecorded });
      }
      return next;
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      const next = nextQuestionAction(prev);
      if (next.phase === ARENA_SPRINT_PHASES.COMPLETED) {
        emit('arena:sprint_completed', next.summary);
        onSprintEnd?.(next.summary);
      }
      return next;
    });
  }, [onSprintEnd]);

  const retrySprint = useCallback(() => {
    setState(prev => retrySprintAction(prev));
  }, []);

  const resetSprint = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setState(INITIAL_SPRINT_STATE);
  }, []);

  // Timer Tick
  useEffect(() => {
    if (state.phase === ARENA_SPRINT_PHASES.ACTIVE || state.phase === ARENA_SPRINT_PHASES.REVIEWING_ANSWER) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 1) {
            clearInterval(timerRef.current);
            const finished = finishSprintAction(prev, user);
            emit('arena:sprint_completed', finished.summary);
            onSprintEnd?.(finished.summary);
            return finished;
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.phase, user, onSprintEnd]);

  return {
    ...state,
    startSprint,
    selectOption,
    checkAnswer,
    nextQuestion,
    retrySprint,
    resetSprint
  };
}
