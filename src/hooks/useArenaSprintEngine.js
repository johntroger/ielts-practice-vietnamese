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
import { recordMistake, resolveMistake } from '../services/gamification/mistakeVaultService.js';
import { 
  recordQuestionResult, 
  recordMatchCompleted 
} from '../services/gamification/arenaMasteryService.js';
import { 
  isAnswerAcceptable, 
  generateVisualDiff,
  isNearMissAnswer 
} from '../services/gamification/cambridgeAnswerValidator.js';

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
  userInputText: '',
  validationResult: null,
  isAnswerChecked: false,
  isCorrect: null,
  isSkipped: false,
  nearMissState: null,
  hasUsedNearMiss: false,
  score: 0,
  combo: 0,
  maxCombo: 0,
  shieldState: createSprintShieldState(),
  timeRemaining: INITIAL_SPRINT_TIMER_SECONDS,
  duration: INITIAL_SPRINT_TIMER_SECONDS,
  difficulty: 'medium',
  isBossCleared: false,
  revengeClearedCount: 0,
  revengeBonusXp: 0,
  isCurrentRevengeCleared: false,
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

export function setUserInputTextAction(state, text) {
  if (state.phase !== ARENA_SPRINT_PHASES.ACTIVE || state.isAnswerChecked) {
    return state;
  }
  return {
    ...state,
    userInputText: text
  };
}

export function checkAnswerAction(state) {
  if (state.phase !== ARENA_SPRINT_PHASES.ACTIVE || state.isAnswerChecked) {
    return state;
  }

  const currentQ = state.questions[state.currentIndex];
  if (!currentQ) return state;

  const isTextInput = currentQ.interactionType === 'text_input';
  if (!isTextInput && state.selectedOption === null) {
    return state;
  }
  if (isTextInput && !state.userInputText?.trim()) {
    return state;
  }

  let isCorrect = false;
  let validationResult = null;

  if (isTextInput) {
    const acceptable = currentQ.acceptableAnswers || [currentQ.correctAnswer];
    const isStrict = currentQ.type === 'spelling';
    isCorrect = isAnswerAcceptable(state.userInputText, acceptable, { isStrictSpelling: isStrict });
    validationResult = {
      isCorrect,
      userInput: state.userInputText,
      diff: generateVisualDiff(state.userInputText, currentQ.correctAnswer)
    };

    // Phase 2: Near-Miss Grace Window (Levenshtein distance === 1)
    if (!isCorrect && !state.hasUsedNearMiss) {
      const nearMissCheck = isNearMissAnswer(state.userInputText, acceptable);
      if (nearMissCheck.isNearMiss) {
        return {
          ...state,
          hasUsedNearMiss: true,
          nearMissState: {
            isNearMiss: true,
            minDistance: 1,
            closestTarget: nearMissCheck.closestTarget,
            diff: generateVisualDiff(state.userInputText, nearMissCheck.closestTarget)
          }
        };
      }
    }
  } else {
    isCorrect = state.selectedOption === currentQ.correctIndex;
  }
  
  // Record mastery progression (2-Hit rule, Ebbinghaus decay, mistake cooling-off)
  const masteryResult = recordQuestionResult({
    questionId: currentQ.id,
    isCorrect
  });

  let nextScore = state.score;
  let nextCombo = state.combo;
  let nextMaxCombo = state.maxCombo;
  let nextShieldState = state.shieldState;
  let nextPhase = ARENA_SPRINT_PHASES.REVIEWING_ANSWER;
  let isBossCleared = state.isBossCleared;
  let nextRevengeCount = state.revengeClearedCount || 0;
  let nextRevengeBonusXp = state.revengeBonusXp || 0;
  let isCurrentRevengeCleared = false;

  if (isCorrect) {
    nextScore += 1;
    nextCombo += 1;
    if (nextCombo > nextMaxCombo) {
      nextMaxCombo = nextCombo;
    }
    // Check if this was the Boss question (last question in sprint)
    if (currentQ.isBossQuestion || state.currentIndex === state.questions.length - 1) {
      isBossCleared = true;
    }
    // Check if revenge question was cleared or mistake resolved
    if (currentQ.isRevengeQuestion || masteryResult.isRevengeCleared) {
      resolveMistake(currentQ.id);
      isCurrentRevengeCleared = true;
      nextRevengeCount += 1;
      nextRevengeBonusXp += (masteryResult.bonusXp || 5);
    }
  } else {
    nextCombo = 0;
    // Record into Mistake Vault
    recordMistake(currentQ, isTextInput ? state.userInputText : state.selectedOption);

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
    validationResult,
    nearMissState: null,
    score: nextScore,
    combo: nextCombo,
    maxCombo: nextMaxCombo,
    shieldState: nextShieldState,
    isBossCleared,
    isCurrentRevengeCleared,
    revengeClearedCount: nextRevengeCount,
    revengeBonusXp: nextRevengeBonusXp
  };
}

export function skipQuestionAction(state) {
  if (state.phase === ARENA_SPRINT_PHASES.REVIEWING_ANSWER) {
    return nextQuestionAction(state);
  }

  if (state.phase !== ARENA_SPRINT_PHASES.ACTIVE) {
    return state;
  }

  const currentQ = state.questions[state.currentIndex];
  if (!currentQ) return state;

  // Record mastery progression for skipped question (counts as unmastered/incorrect attempt)
  recordQuestionResult({
    questionId: currentQ.id,
    isCorrect: false
  });

  // Record into Mistake Vault as SKIPPED
  recordMistake(currentQ, 'SKIPPED');

  const { state: updatedShields, isDefeated } = deductShield(state.shieldState, currentQ);
  let nextPhase = ARENA_SPRINT_PHASES.REVIEWING_ANSWER;
  if (isDefeated) {
    nextPhase = ARENA_SPRINT_PHASES.DEFEATED;
  }

  const expectedAnswer = currentQ.correctAnswer || (currentQ.options && currentQ.options[currentQ.correctIndex]) || '';

  return {
    ...state,
    phase: nextPhase,
    isAnswerChecked: true,
    isCorrect: false,
    isSkipped: true,
    nearMissState: null,
    hasUsedNearMiss: false,
    combo: 0,
    shieldState: updatedShields,
    validationResult: {
      isCorrect: false,
      isSkipped: true,
      userInput: state.userInputText || '',
      diff: generateVisualDiff(state.userInputText || '', expectedAnswer)
    }
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
      userInputText: '',
      validationResult: null,
      isAnswerChecked: false,
      isCorrect: null,
      isSkipped: false,
      nearMissState: null,
      hasUsedNearMiss: false
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
    userInputText: '',
    validationResult: null,
    isAnswerChecked: false,
    isCorrect: null,
    isSkipped: false,
    nearMissState: null,
    hasUsedNearMiss: false
  };
}

export function finishSprintAction(state, user = null) {
  const totalSeconds = (state.duration || INITIAL_SPRINT_TIMER_SECONDS) - Math.max(0, state.timeRemaining);
  const streak = getUnifiedStreakCount();
  const rawXpResult = calculateSprintXp({
    correctAnswers: state.score,
    streakCount: streak,
    totalSeconds,
    difficulty: state.difficulty || 'medium',
    timeRemaining: Math.max(0, state.timeRemaining),
    isBossCleared: state.isBossCleared
  });

  const finalXpWithRevenge = (rawXpResult.finalXp || 0) + (state.revengeBonusXp || 0);
  const xpResult = {
    ...rawXpResult,
    finalXp: finalXpWithRevenge,
    revengeBonusXp: state.revengeBonusXp || 0
  };

  recordMatchCompleted();
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
    timeRemaining: Math.max(0, state.timeRemaining),
    maxCombo: state.maxCombo,
    isBossCleared: state.isBossCleared,
    isDefeated: state.phase === ARENA_SPRINT_PHASES.DEFEATED,
    revengeClearedCount: state.revengeClearedCount || 0,
    revengeBonusXp: state.revengeBonusXp || 0
  };

  return {
    ...state,
    phase: ARENA_SPRINT_PHASES.COMPLETED,
    summary
  };
}

/**
 * React Hook for Atlas English Arena.
 * Employs a robust Timestamp Delta Timer (ticks every 250ms, computing Date.now() delta)
 * to eliminate mobile background timer drift or sleep throttling.
 */
export function useArenaSprintEngine({ user = null, onSprintEnd = null } = {}) {
  const [state, setState] = useState(INITIAL_SPRINT_STATE);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const durationRef = useRef(INITIAL_SPRINT_TIMER_SECONDS);

  const startSprint = useCallback((customQuestions = null, selectedDifficulty = 'medium') => {
    const qList = customQuestions || generateArenaSprintQuestions({ count: 7, difficulty: selectedDifficulty });
    const duration = INITIAL_SPRINT_TIMER_SECONDS;
    durationRef.current = duration;
    startTimeRef.current = Date.now();
    const next = startSprintAction(qList, duration, selectedDifficulty);
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
    let completedSummary = null;
    setState(prev => {
      const next = nextQuestionAction(prev);
      if (next.phase === ARENA_SPRINT_PHASES.COMPLETED) {
        completedSummary = next.summary;
      }
      return next;
    });
    if (completedSummary) {
      emit('arena:sprint_completed', completedSummary);
      onSprintEnd?.(completedSummary);
    }
  }, [onSprintEnd]);

  const retrySprint = useCallback(() => {
    setState(prev => retrySprintAction(prev));
  }, []);

  const resetSprint = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
    setState(INITIAL_SPRINT_STATE);
  }, []);

  // Timestamp Delta Timer (Tick interval: 250ms for smooth synchronization)
  useEffect(() => {
    if (state.phase === ARENA_SPRINT_PHASES.ACTIVE || state.phase === ARENA_SPRINT_PHASES.REVIEWING_ANSWER) {
      if (!startTimeRef.current) {
        // Resume from current remaining time if not set
        startTimeRef.current = Date.now() - (durationRef.current - state.timeRemaining) * 1000;
      }

      timerRef.current = setInterval(() => {
        if (!startTimeRef.current) return;
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = Math.max(0, durationRef.current - elapsedSeconds);

        setState(prev => {
          if (remaining <= 0) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            const finished = finishSprintAction({ ...prev, timeRemaining: 0 }, user);
            setTimeout(() => {
              emit('arena:sprint_completed', finished.summary);
              onSprintEnd?.(finished.summary);
            }, 0);
            return finished;
          }
          if (prev.timeRemaining !== remaining) {
            return { ...prev, timeRemaining: remaining };
          }
          return prev;
        });
      }, 250);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.phase, user, onSprintEnd, state.timeRemaining]);

  const skipQuestion = useCallback(() => {
    setState(prev => {
      const next = skipQuestionAction(prev);
      emit('arena:question_skipped', { questionId: prev.questions[prev.currentIndex]?.id });
      if (next.phase === ARENA_SPRINT_PHASES.DEFEATED) {
        emit('arena:sprint_defeated', { mistakes: next.shieldState.mistakesRecorded });
      }
      return next;
    });
  }, []);

  const setUserInputText = useCallback((text) => {
    setState(prev => setUserInputTextAction(prev, text));
  }, []);

  return {
    ...state,
    startSprint,
    selectOption,
    setUserInputText,
    checkAnswer,
    skipQuestion,
    nextQuestion,
    retrySprint,
    resetSprint
  };
}
