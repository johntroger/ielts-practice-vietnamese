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
import { ARENA_STORAGE_KEYS, ARENA_XP_CAPS } from '../../utils/arenaStorageKeys.js';
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
 * Calculates total XP for a completed sprint.
 * @param {Object} params
 * @param {number} params.correctAnswers - Number of correct questions (0 to 7)
 * @param {number} [params.streakCount=0] - Current daily streak count
 * @param {number} [params.totalSeconds=60] - Time taken to complete the sprint
 * @returns {{ finalXp: number, rawXp: number, softCapMultiplier: number, speedBonus: number }}
 */
export function calculateSprintXp({
  correctAnswers = 0,
  streakCount = 0,
  totalSeconds = 60
} = {}) {
  const validCorrect = Math.max(0, Math.min(7, Number(correctAnswers) || 0));
  if (validCorrect === 0) {
    return { finalXp: 0, rawXp: 0, softCapMultiplier: 1.0, speedBonus: 0 };
  }

  // 1. Base XP: 20 XP per correct question (max 140)
  const baseScore = validCorrect * ARENA_XP_CAPS.BASE_QUESTION_XP;

  // 2. Speed Bonus: if finished cleanly under 60 seconds (max 20 XP)
  let speedBonus = 0;
  if (totalSeconds < 60 && validCorrect >= 5) {
    speedBonus = Math.min(20, Math.round((60 - Math.max(20, totalSeconds)) / 2));
  }

  // 3. Streak Multiplier Bonus (max 40 XP)
  const streakBonus = Math.min(40, Math.floor(Math.max(0, streakCount) * 2));

  // Raw Total before Soft-Cap
  const rawXp = baseScore + speedBonus + streakBonus;

  // 4. Apply Daily Soft-Cap Curve
  const multiplier = getDailySoftCapMultiplier();
  let finalXp = Math.round(rawXp * multiplier);

  // 5. Enforce Absolute Mathematical Cap (200 XP)
  finalXp = Math.max(0, Math.min(ARENA_XP_CAPS.MAX_XP_PER_SPRINT, finalXp));

  return {
    finalXp,
    rawXp,
    softCapMultiplier: multiplier,
    speedBonus
  };
}
