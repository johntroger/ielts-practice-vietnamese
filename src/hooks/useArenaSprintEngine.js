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
  incrementDailySprintCount,
  evaluateMysteryLootDrop
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
import { recordTypingAttempt } from '../services/gamification/typingStatsService.js';
import { safeGet } from '../utils/storageService.js';
import { ARENA_STORAGE_KEYS } from '../utils/arenaStorageKeys.js';
import { getActiveGhostDuel, resolveGhostDuelResult } from '../services/gamification/ghostDuelService.js';
import { dealWorldBossDamage } from '../services/gamification/worldBossRaidService.js';
import { enqueueOfflinePayload } from '../services/gamification/offlineQueueService.js';
import { isSurgeActive, activateSurge } from '../services/gamification/atlasSurgeService.js';
import { getStreakShieldData, addStreakShield } from '../services/gamification/atlasStreakShieldService.js';

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
  isAudioSprint: false,
  equippedPerk: 'none',
  equippedPerks: [],
  usedPerks: [],
  isPerkUsed: false,
  eliminatedOptions: [],
  isBossCleared: false,
  revengeClearedCount: 0,
  revengeBonusXp: 0,
  isCurrentRevengeCleared: false,
  activeGhostDuel: null,
  questionHistory: [],
  summary: null
};

/**
 * Classifies a question or history record into one of the 4 Cambridge competency axes:
 * 1. 'spelling': Orthography & academic spelling, typing drills, spelling demons
 * 2. 'listening': Listening distractor traps, self-correction, direction shift
 * 3. 'reading': Reading logic, True/False/Not Given, inference
 * 4. 'lexicon': Academic collocations, synonyms, C1/C2 advanced lexical resource
 */
export function classifyQuestionAxis(item) {
  if (!item) return 'lexicon';
  const type = String(item.type || '').toLowerCase();
  const skill = String(item.skillCategory || '').toLowerCase();
  const interaction = String(item.interactionType || '').toLowerCase();

  if (
    type === 'spelling' ||
    type === 'listening_spelling' ||
    type === 'spelling_trap' ||
    skill === 'spelling' ||
    interaction === 'text_input'
  ) {
    return 'spelling';
  }

  if (
    skill === 'listening' ||
    type === 'listening_trap' ||
    type === 'listening-distractor' ||
    type === 'listening'
  ) {
    return 'listening';
  }

  if (
    skill === 'reading' ||
    type === 'tfng' ||
    type === 'reading-tfng' ||
    type === 'reading'
  ) {
    return 'reading';
  }

  return 'lexicon';
}

/**
 * Computes 4-axis diagnostic metrics and determines learner's primary gap / weakest skill.
 */
export function computeSprintDiagnostics(questionHistory = [], questions = []) {
  const axesMap = {
    spelling: {
      key: 'spelling',
      nameKey: 'arena.skillOrthography',
      nameVi: 'Chính Tả Học Thuật & Gõ',
      nameEn: 'Orthography & Academic Spelling',
      icon: '✍️',
      total: 0,
      correct: 0
    },
    listening: {
      key: 'listening',
      nameKey: 'arena.skillDistractors',
      nameVi: 'Bẫy Bẻ Hướng & Tự Sửa',
      nameEn: 'Listening Traps & Self-Correction',
      icon: '🎧',
      total: 0,
      correct: 0
    },
    reading: {
      key: 'reading',
      nameKey: 'arena.skillLogic',
      nameVi: 'Logic Đọc Hiểu & TFNG',
      nameEn: 'Reading Logic & TFNG',
      icon: '📖',
      total: 0,
      correct: 0
    },
    lexicon: {
      key: 'lexicon',
      nameKey: 'arena.skillLexicon',
      nameVi: 'Từ Vựng & Collocation C1/C2',
      nameEn: 'Academic Collocations & C1/C2 Lexicon',
      icon: '💎',
      total: 0,
      correct: 0
    }
  };

  const records = Array.isArray(questionHistory) && questionHistory.length > 0
    ? questionHistory
    : (Array.isArray(questions) ? questions.map(q => ({ ...q, isCorrect: true })) : []);

  records.forEach(item => {
    const axisKey = classifyQuestionAxis(item);
    if (axesMap[axisKey]) {
      axesMap[axisKey].total += 1;
      if (item.isCorrect) {
        axesMap[axisKey].correct += 1;
      }
    }
  });

  const axes = Object.values(axesMap).map(axis => {
    const rate = axis.total > 0 ? Math.round((axis.correct / axis.total) * 100) : 100;
    let status = 'neutral';
    if (axis.total > 0) {
      if (rate >= 80) status = 'mastered';
      else if (rate >= 50) status = 'warning';
      else status = 'critical';
    }
    return {
      ...axis,
      rate,
      status
    };
  });

  // Determine weakest skill among axes that have been tested (total > 0)
  const testedAxes = axes.filter(a => a.total > 0);
  const axesWithErrors = testedAxes.filter(a => a.rate < 100);

  let weakestSkill = null;
  if (axesWithErrors.length > 0) {
    // Sort by lowest rate ascending, then by most errors descending
    axesWithErrors.sort((a, b) => {
      if (a.rate !== b.rate) return a.rate - b.rate;
      const errorsA = a.total - a.correct;
      const errorsB = b.total - b.correct;
      return errorsB - errorsA;
    });
    weakestSkill = axesWithErrors[0].key;
  }

  return {
    axes,
    weakestSkill
  };
}

/**
 * Returns Cambridge Theory Prescription for the identified weakest skill.
 */
export function getCambridgeTheoryPrescription(weakestSkillKey) {
  switch (weakestSkillKey) {
    case 'spelling':
      return {
        skillKey: 'spelling',
        handbookSkill: 'grammar-vocab',
        searchQuery: 'Spelling',
        topicId: null,
        titleVi: '100 Con Quỷ Chính Tả Cambridge & Quy Tắc Gõ Chuẩn',
        titleEn: '100 Cambridge Spelling Demons & Accurate Transcription',
        chapterVi: 'Chương Từ Vựng & Chính Tả Học Thuật',
        chapterEn: 'Academic Vocabulary & Spelling Chapter',
        recommendationVi: 'Rèn luyện phản xạ phát hiện bẫy nguyên âm đôi và phụ âm kép thường gặp trong bài thi Listening/Writing.',
        recommendationEn: 'Master double consonant rules and silent vowel pitfalls in authentic Cambridge exams.'
      };
    case 'listening':
      return {
        skillKey: 'listening',
        handbookSkill: 'listening',
        searchQuery: 'Distractor',
        topicId: null,
        titleVi: 'Bẫy Tự Sửa & Paraphrase Đảo Hướng (Direction Shifting)',
        titleEn: 'Self-Correction Traps & Direction-Shifting Paraphrase',
        chapterVi: 'Chương Chiến Thuật Nghe Cambridge',
        chapterEn: 'Cambridge Listening Strategy Chapter',
        recommendationVi: 'Luyện kỹ năng bắt từ khóa chuyển hướng (Actually, In fact, But) để không bị sập bẫy thông tin đầu tiên.',
        recommendationEn: 'Identify direction-shifting markers (Actually, However) to eliminate initial distractor traps.'
      };
    case 'reading':
      return {
        skillKey: 'reading',
        handbookSkill: 'reading',
        searchQuery: 'True',
        topicId: null,
        titleVi: 'Chiến Thuật True / False / Not Given & Triệt Tiêu Suy Diễn',
        titleEn: 'True / False / Not Given & Eliminating Over-Interpretation',
        chapterVi: 'Chương Đọc Hiểu & Suy Luận Logic',
        chapterEn: 'Reading Comprehension & Logical Inference Chapter',
        recommendationVi: 'Chỉ dựa 100% vào dữ kiện trong bài đọc; tuyệt đối không dùng kiến thức nền bên ngoài để suy diễn đáp án.',
        recommendationEn: 'Base reasoning strictly on passage evidence without external assumptions.'
      };
    case 'lexicon':
      return {
        skillKey: 'lexicon',
        handbookSkill: 'grammar-vocab',
        searchQuery: 'Collocation',
        topicId: null,
        titleVi: 'Collocation Học Thuật & Nâng Cấp Lexical Resource C1/C2',
        titleEn: 'Academic Collocations & C1/C2 Lexical Resource Upgrade',
        chapterVi: 'Chương Từ Vựng & Cụm Từ Học Thuật C1/C2',
        chapterEn: 'Academic Collocations & C1/C2 Lexical Resource Chapter',
        recommendationVi: 'Mở rộng các cặp cụm từ tự nhiên theo chuẩn bài thi Cambridge để nâng Band điểm từ 6.5 lên 7.5+.',
        recommendationEn: 'Upgrade topic-specific collocations to boost Lexical Resource from Band 6.5 to 7.5+.'
      };
    default:
      return {
        skillKey: 'perfect',
        handbookSkill: 'grammar-vocab',
        searchQuery: 'C2',
        topicId: null,
        titleVi: 'Bộ Bí Kíp Tinh Hoa Cambridge Band 8.5+ Toàn Diện',
        titleEn: 'Comprehensive Cambridge Band 8.5+ Master Arsenal',
        chapterVi: 'Chương Chiến Thuật Toàn Diện C2',
        chapterEn: 'Comprehensive C2 Strategy Chapter',
        recommendationVi: 'Phong độ phản xạ hoàn hảo! Hãy sẵn sàng thử thách với cấp độ Ác Mộng (Nightmare Arena).',
        recommendationEn: 'Flawless precision! You are primed to challenge the Nightmare Arena tier.'
      };
  }
}

/**
 * Pure state transition functions for unit testing and deterministic execution.
 */
export function startSprintAction(questions = [], duration = INITIAL_SPRINT_TIMER_SECONDS, difficulty = 'medium', options = {}) {
  const isAudioSprint = Boolean(
    options.isAudioSprint ||
    (Array.isArray(questions) && questions.length > 0 && questions.every(q => q && (q.audioUrl || q.isR2Audio)))
  );
  const equippedPerks = Array.isArray(options.equippedPerks) && options.equippedPerks.length > 0
    ? options.equippedPerks
    : (options.equippedPerk && options.equippedPerk !== 'none'
        ? [options.equippedPerk]
        : [safeGet(ARENA_STORAGE_KEYS.EQUIPPED_PERK, 'none')]
      ).filter(p => p && p !== 'none');
  const equippedPerk = equippedPerks[0] || options.equippedPerk || safeGet(ARENA_STORAGE_KEYS.EQUIPPED_PERK, 'none');
  const extraShields = (equippedPerks.includes('titan_armor') || equippedPerk === 'titan_armor') ? 1 : 0;
  const activeGhostDuel = options.ghostDuel !== undefined ? options.ghostDuel : getActiveGhostDuel();

  return {
    ...INITIAL_SPRINT_STATE,
    phase: ARENA_SPRINT_PHASES.ACTIVE,
    questions,
    timeRemaining: duration,
    duration,
    difficulty,
    isAudioSprint,
    equippedPerk,
    equippedPerks,
    usedPerks: [],
    isPerkUsed: false,
    eliminatedOptions: [],
    shieldState: createSprintShieldState(extraShields),
    activeGhostDuel,
    questionHistory: []
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
    if (isTextInput) {
      recordTypingAttempt({
        word: currentQ.correctAnswer,
        isCorrect: true,
        wasNearMissRescued: Boolean(state.hasUsedNearMiss)
      });
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
    if (isTextInput) {
      recordTypingAttempt({
        word: currentQ.correctAnswer,
        isCorrect: false
      });
    }
    // Record into Mistake Vault
    recordMistake(currentQ, isTextInput ? state.userInputText : state.selectedOption);

    const { state: updatedShields, isDefeated } = deductShield(state.shieldState, currentQ);
    nextShieldState = updatedShields;
    if (isDefeated) {
      nextPhase = ARENA_SPRINT_PHASES.DEFEATED;
    }
  }

  const historyItem = {
    id: currentQ.id,
    skillCategory: currentQ.skillCategory || 'vocab',
    type: currentQ.type || 'vocab',
    interactionType: currentQ.interactionType || 'multiple_choice',
    isBossQuestion: Boolean(currentQ.isBossQuestion || state.currentIndex === state.questions.length - 1),
    isCorrect,
    isSkipped: false
  };
  const nextHistory = [...(state.questionHistory || []), historyItem];

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
    revengeBonusXp: nextRevengeBonusXp,
    questionHistory: nextHistory
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

  const expectedAnswer = currentQ.correctAnswer || (currentQ.options && currentQ.options[currentQ.correctIndex]) || '';

  if (currentQ.interactionType === 'text_input') {
    recordTypingAttempt({
      word: expectedAnswer,
      isCorrect: false,
      isSkipped: true
    });
  }

  const { state: updatedShields, isDefeated } = deductShield(state.shieldState, currentQ);
  let nextPhase = ARENA_SPRINT_PHASES.REVIEWING_ANSWER;
  if (isDefeated) {
    nextPhase = ARENA_SPRINT_PHASES.DEFEATED;
  }

  const historyItem = {
    id: currentQ.id,
    skillCategory: currentQ.skillCategory || 'vocab',
    type: currentQ.type || 'vocab',
    interactionType: currentQ.interactionType || 'multiple_choice',
    isBossQuestion: Boolean(currentQ.isBossQuestion || state.currentIndex === state.questions.length - 1),
    isCorrect: false,
    isSkipped: true
  };
  const nextHistory = [...(state.questionHistory || []), historyItem];

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
    questionHistory: nextHistory,
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
      hasUsedNearMiss: false,
      eliminatedOptions: []
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
    hasUsedNearMiss: false,
    eliminatedOptions: []
  };
}

export function activatePerkAction(state, specificPerkId = null) {
  if (state.phase !== ARENA_SPRINT_PHASES.ACTIVE || state.isAnswerChecked) {
    return state;
  }

  const equippedList = Array.isArray(state.equippedPerks) && state.equippedPerks.length > 0
    ? state.equippedPerks
    : (state.equippedPerk && state.equippedPerk !== 'none' ? [state.equippedPerk] : []);

  const usedList = Array.isArray(state.usedPerks) ? state.usedPerks : (state.isPerkUsed ? [state.equippedPerk] : []);

  let perkId = specificPerkId;
  if (!perkId) {
    perkId = equippedList.find(p => p !== 'titan_armor' && p !== 'none' && !usedList.includes(p));
  }

  if (!perkId || perkId === 'none' || perkId === 'titan_armor' || usedList.includes(perkId)) {
    return state;
  }

  const nextUsedList = [...usedList, perkId];
  const activeEquippedCount = equippedList.filter(p => p !== 'titan_armor' && p !== 'none').length;
  const isAllUsed = nextUsedList.length >= Math.max(1, activeEquippedCount);

  if (perkId === 'chronos_freeze') {
    // Add 15 seconds to remaining time
    const addedTime = 15;
    return {
      ...state,
      usedPerks: nextUsedList,
      isPerkUsed: isAllUsed,
      timeRemaining: Math.min((state.duration || INITIAL_SPRINT_TIMER_SECONDS) + 30, state.timeRemaining + addedTime)
    };
  }

  if (perkId === 'oracle_insight') {
    const currentQ = state.questions[state.currentIndex];
    if (!currentQ || currentQ.interactionType === 'text_input' || !Array.isArray(currentQ.options)) {
      return state;
    }

    // Find indices of incorrect options that haven't been eliminated yet
    const correctIdx = typeof currentQ.correctIndex === 'number' 
      ? currentQ.correctIndex 
      : currentQ.options.findIndex(opt => opt === currentQ.correctAnswer);

    const eligibleWrongIndices = currentQ.options
      .map((_, idx) => idx)
      .filter(idx => idx !== correctIdx && !(state.eliminatedOptions || []).includes(idx));

    if (eligibleWrongIndices.length === 0) {
      return state;
    }

    // Eliminate 1 false distractor trap
    const eliminatedIdx = eligibleWrongIndices[0];

    return {
      ...state,
      usedPerks: nextUsedList,
      isPerkUsed: isAllUsed,
      eliminatedOptions: [...(state.eliminatedOptions || []), eliminatedIdx]
    };
  }

  return state;
}

/**
 * Restores 1 emergency tactical shield if currently down to <= 1 shield.
 */
export function consumeAegisElixirAction(state) {
  if (state.phase !== ARENA_SPRINT_PHASES.ACTIVE || state.isAnswerChecked) {
    return state;
  }
  const currentShields = state.shieldState?.shields || 0;
  const maxShields = state.shieldState?.maxShields || 3;
  if (currentShields > 1 || currentShields >= maxShields) {
    return state;
  }
  return {
    ...state,
    shieldState: {
      ...state.shieldState,
      shields: Math.min(maxShields, currentShields + 1)
    }
  };
}

export function finishSprintAction(state, user = null) {
  const totalSeconds = (state.duration || INITIAL_SPRINT_TIMER_SECONDS) - Math.max(0, state.timeRemaining);
  const streak = getUnifiedStreakCount();
  const mysteryLoot = evaluateMysteryLootDrop({
    correctAnswers: state.score,
    totalQuestions: state.questions.length,
    isBossCleared: state.isBossCleared,
    maxCombo: state.maxCombo
  });
  const lootBonus = mysteryLoot?.bonusXp || 0;

  // Resolve Ghost Duel if active
  const activeDuel = state.activeGhostDuel || getActiveGhostDuel();
  let ghostDuelResult = null;
  if (activeDuel) {
    ghostDuelResult = resolveGhostDuelResult({
      userScore: state.score,
      totalQuestions: state.questions.length,
      userTimeSpent: totalSeconds,
      duel: activeDuel
    });
  }

  // Inflict damage to Daily World Boss Raid
  const worldBossDamage = dealWorldBossDamage({
    score: state.score,
    combo: state.maxCombo,
    isBossCleared: state.isBossCleared
  });

  const duelBonusXp = ghostDuelResult?.bonusXp || 0;
  const bossBonusXp = worldBossDamage?.bonusXp || 0;
  const activeSurge = isSurgeActive();

  const rawXpResult = calculateSprintXp({
    correctAnswers: state.score,
    streakCount: streak,
    totalSeconds,
    difficulty: state.difficulty || 'medium',
    timeRemaining: Math.max(0, state.timeRemaining),
    isBossCleared: state.isBossCleared,
    isAudioSprint: Boolean(state.isAudioSprint),
    lootBonus,
    isSurgeActive: activeSurge
  });

  // Evaluate Flawless Sprint for Atlas Sprint Surge reward (100% accuracy, >= 5 questions)
  let awardedSurge = false;
  if (state.questions.length >= 5 && state.score === state.questions.length) {
    activateSurge(15);
    awardedSurge = true;
  }

  // Evaluate Atlas Mistake Recovery: clear >= 3 mistakes in Revenge Sprint to restore 1 Streak Shield
  let recoveredShield = false;
  const isRevengeRound = (state.revengeClearedCount >= 3) || 
    (state.questions.length > 0 && Boolean(state.questions[0]?.isRevengeQuestion) && state.score >= 3);
  if (isRevengeRound) {
    const shieldData = getStreakShieldData();
    if (shieldData.shieldsRemaining < 2) {
      addStreakShield(1);
      recoveredShield = true;
    }
  }

  const finalXpWithExtras = (rawXpResult.finalXp || 0) + (state.revengeBonusXp || 0) + duelBonusXp + bossBonusXp;
  const xpResult = {
    ...rawXpResult,
    finalXp: finalXpWithExtras,
    revengeBonusXp: state.revengeBonusXp || 0,
    lootBonus,
    mysteryLoot,
    duelBonusXp,
    bossBonusXp
  };

  recordMatchCompleted();
  incrementDailySprintCount();

  if (user && user.id) {
    try {
      submitSprintXp({
        userId: user.id,
        deltaXp: xpResult.finalXp,
        streakCount: streak + 1,
        displayName: user.user_metadata?.display_name || user.user_metadata?.full_name
      }).catch(() => {
        enqueueOfflinePayload('SPRINT_SUBMISSION', {
          userId: user.id,
          deltaXp: xpResult.finalXp,
          streakCount: streak + 1
        });
      });
    } catch {
      enqueueOfflinePayload('SPRINT_SUBMISSION', {
        userId: user.id,
        deltaXp: xpResult.finalXp,
        streakCount: streak + 1
      });
    }
  } else {
    recordGuestPendingXp(xpResult.finalXp);
  }

  const diagnostics = computeSprintDiagnostics(state.questionHistory, state.questions);
  const prescription = getCambridgeTheoryPrescription(diagnostics.weakestSkill);

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
    revengeBonusXp: state.revengeBonusXp || 0,
    lootBonus,
    mysteryLoot,
    ghostDuelResult,
    worldBossDamage,
    awardedSurge,
    recoveredShield,
    diagnosticSkills: diagnostics.axes,
    weakestSkill: diagnostics.weakestSkill,
    prescription
  };

  return {
    ...state,
    phase: ARENA_SPRINT_PHASES.COMPLETED,
    summary,
    activeGhostDuel: null
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

  const startSprint = useCallback((customQuestions = null, selectedDifficulty = 'medium', options = {}) => {
    const qList = customQuestions || generateArenaSprintQuestions({ count: 7, difficulty: selectedDifficulty });
    const duration = INITIAL_SPRINT_TIMER_SECONDS;
    durationRef.current = duration;
    startTimeRef.current = Date.now();
    const next = startSprintAction(qList, duration, selectedDifficulty, options);
    setState(next);
    emit('arena:sprint_started', { totalQuestions: qList.length, difficulty: selectedDifficulty, isAudioSprint: next.isAudioSprint });
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

  const activatePerk = useCallback((perkId = null) => {
    setState(prev => {
      const next = activatePerkAction(prev, perkId);
      const prevUsedCount = (prev.usedPerks || []).length;
      const nextUsedCount = (next.usedPerks || []).length;
      if (nextUsedCount > prevUsedCount) {
        const activatedPerkId = next.usedPerks[next.usedPerks.length - 1];
        if (activatedPerkId === 'chronos_freeze' && next.timeRemaining > prev.timeRemaining) {
          if (startTimeRef.current) {
            const addedMs = (next.timeRemaining - prev.timeRemaining) * 1000;
            startTimeRef.current += addedMs;
          }
        }
        emit('arena:perk_activated', { perkId: activatedPerkId });
      }
      return next;
    });
  }, []);

  const consumeAegisElixir = useCallback(() => {
    setState(prev => consumeAegisElixirAction(prev));
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
    resetSprint,
    activatePerk,
    consumeAegisElixir
  };
}
