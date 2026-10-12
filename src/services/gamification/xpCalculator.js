/**
 * src/services/gamification/xpCalculator.js
 * 
 * Mathematical Scoring Engine for Atlas English Arena:
 * - Anti-Grinding Soft-Cap Daily Curve (100% -> 70% -> 40%)
 * - Streak Combo Multipliers
 * - Speed bonus for fast answers
 * - Absolute Mathematical Hard Cap: max 200 XP per sprint
 */

import { safeGet, safeSet } from '../../utils/storageService.js';
import { ARENA_STORAGE_KEYS, ARENA_XP_CAPS, ARENA_DIFFICULTY_CONFIG } from '../../utils/arenaStorageKeys.js';
import { getLocalDateKey } from '../../utils/dateHelper.js';

/**
 * Returns current daily sprint count, resetting if day has changed.
 */
export function getDailySprintCount() {
  const today = getLocalDateKey();
  const savedDate = safeGet(ARENA_STORAGE_KEYS.DAILY_SPRINT_DATE, '');
  if (savedDate !== today) {
    safeSet(ARENA_STORAGE_KEYS.DAILY_SPRINT_DATE, today);
    safeSet(ARENA_STORAGE_KEYS.DAILY_SPRINT_COUNT, 0);
    return 0;
  }
  return Number(safeGet(ARENA_STORAGE_KEYS.DAILY_SPRINT_COUNT, 0));
}

/**
 * Increments daily sprint count.
 */
export function incrementDailySprintCount() {
  const count = getDailySprintCount();
  const next = count + 1;
  safeSet(ARENA_STORAGE_KEYS.DAILY_SPRINT_COUNT, next);
  return next;
}

/**
 * Returns the Soft-Cap multiplier (1.0 -> 0.7 -> 0.4) based on today's sprint count.
 * - Sprints 1 to 3: 100% (1.0)
 * - Sprints 4 to 6: 70% (0.7)
 * - Sprints 7+: 40% (0.4)
 */
export function getDailySoftCapMultiplier(sprintIndex = getDailySprintCount()) {
  if (sprintIndex < 3) return 1.0;
  if (sprintIndex < 6) return 0.7;
  return 0.4;
}

/**
 * Calculates Time Bonus XP with a strict pedagogical hard cap (30% of Base XP).
 * Time Bonus = remainingSeconds * 0.5, capped at round(0.30 * baseScore).
 * Only awarded when correctAnswers >= 6.
 * 
 * @param {Object} params
 * @param {number} params.remainingSeconds - Seconds remaining on the clock
 * @param {number} params.baseScore - Base XP earned from correct answers
 * @param {number} params.correctAnswers - Number of correct answers in the sprint
 * @returns {number}
 */
export function calculateTimeBonusXp({ remainingSeconds = 0, baseScore = 0, correctAnswers = 0 } = {}) {
  if (correctAnswers < 6 || remainingSeconds <= 0 || baseScore <= 0) {
    return 0;
  }
  const rawBonus = Math.round(remainingSeconds * 0.5);
  const cap = Math.round(0.30 * baseScore);
  return Math.min(rawBonus, cap);
}

/**
 * Calculates total XP for a completed sprint.
 * @param {Object} params
 * @param {number} params.correctAnswers - Number of correct questions (0 to 10)
 * @param {number} [params.streakCount=0] - Current daily streak count
 * @param {number} [params.totalSeconds=60] - Time taken to complete the sprint
 * @param {string} [params.difficulty='medium'] - Selected difficulty level ('easy' | 'medium' | 'hard' | 'nightmare')
 * @param {number} [params.timeRemaining=0] - Time remaining in seconds (for time bonus)
 * @param {boolean} [params.isBossCleared=false] - Whether question 10 (Boss) was answered correctly
 * @returns {{ finalXp: number, rawXp: number, baseScore: number, bossBonus: number, timeBonus: number, streakBonus: number, speedBonus: number, softCapMultiplier: number, difficulty: string }}
 */
export function calculateSprintXp({
  correctAnswers = 0,
  streakCount = 0,
  totalSeconds = 60,
  difficulty = 'medium',
  timeRemaining = 0,
  isBossCleared = false
} = {}) {
  // Support up to 10 questions for Atlas Arena v8.0
  const validCorrect = Math.max(0, Math.min(10, Number(correctAnswers) || 0));
  if (validCorrect === 0) {
    return { 
      finalXp: 0, 
      rawXp: 0, 
      baseScore: 0, 
      bossBonus: 0, 
      timeBonus: 0, 
      streakBonus: 0, 
      speedBonus: 0, 
      softCapMultiplier: 1.0, 
      difficulty 
    };
  }

  const diffConfig = ARENA_DIFFICULTY_CONFIG[difficulty] || ARENA_DIFFICULTY_CONFIG.medium;
  const baseXpPerQuestion = diffConfig.baseXpPerQuestion || ARENA_XP_CAPS.BASE_QUESTION_XP;
  const maxSprintCap = diffConfig.maxSprintXp || ARENA_XP_CAPS.MAX_XP_PER_SPRINT;

  // 1. Base XP: scaled by difficulty level
  const baseScore = validCorrect * baseXpPerQuestion;

  // 2. Boss Question Bonus: Question 10 yields +0.5x Base XP if cleared
  const bossBonus = isBossCleared ? Math.round(baseXpPerQuestion * 0.5) : 0;

  // 3. Time Bonus: Capped strictly at 30% of Base XP
  const timeBonus = calculateTimeBonusXp({
    remainingSeconds: timeRemaining,
    baseScore,
    correctAnswers: validCorrect
  });

  // Legacy speed bonus support (if totalSeconds provided without explicit timeRemaining)
  let speedBonus = 0;
  if (timeBonus === 0) {
    if (totalSeconds < 60 && validCorrect >= 5) {
      speedBonus = Math.min(20, Math.round((60 - Math.max(20, totalSeconds)) / 2));
    } else if (totalSeconds < 90 && validCorrect >= 5 && ['hard', 'nightmare'].includes(diffConfig.id)) {
      speedBonus = Math.min(30, Math.round((90 - Math.max(20, totalSeconds)) / 2));
    }
  }

  // 4. Streak Multiplier Bonus (max 40 XP)
  const streakBonus = Math.min(40, Math.floor(Math.max(0, streakCount) * 2));

  // Raw Total before Soft-Cap
  const rawXp = baseScore + bossBonus + timeBonus + speedBonus + streakBonus;

  // 5. Apply Daily Soft-Cap Curve
  const multiplier = getDailySoftCapMultiplier();
  let finalXp = Math.round(rawXp * multiplier);

  // 6. Enforce Maximum Cap for selected difficulty
  finalXp = Math.max(0, Math.min(maxSprintCap, finalXp));

  return {
    finalXp,
    rawXp,
    baseScore,
    bossBonus,
    timeBonus,
    streakBonus,
    speedBonus,
    softCapMultiplier: multiplier,
    difficulty: diffConfig.id
  };
}
