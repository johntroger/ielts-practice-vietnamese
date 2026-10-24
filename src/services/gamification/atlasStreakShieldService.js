/**
 * src/services/gamification/atlasStreakShieldService.js
 * 
 * Atlas Streak Shield Engine (Inspired by Duolingo Streak Freeze)
 * Protects learner's daily streak when an inactive day occurs.
 * Max capacity: 2 shields.
 */

import { safeGet, safeSet } from '../../utils/storageService.js';
import { ARENA_STORAGE_KEYS } from '../../utils/arenaStorageKeys.js';
import { getLocalDateKey } from '../../utils/dateHelper.js';

export const MAX_STREAK_SHIELDS = 2;
export const STREAK_SHIELD_STORAGE_KEY = 'atlas_streak_shield_data';

/**
 * Returns streak shield data
 * @returns {{ shieldsRemaining: number, lastShieldUsedDate: string|null, shieldHistory: Array }}
 */
export function getStreakShieldData() {
  const defaultData = {
    shieldsRemaining: 1, // Welcome gift: 1 free shield for all learners
    lastShieldUsedDate: null,
    shieldHistory: []
  };
  const data = safeGet(STREAK_SHIELD_STORAGE_KEY, defaultData);
  return data || defaultData;
}

/**
 * Saves streak shield data
 * @param {Object} data 
 */
export function saveStreakShieldData(data) {
  safeSet(STREAK_SHIELD_STORAGE_KEY, data);
}

/**
 * Adds streak shield(s) up to MAX_STREAK_SHIELDS
 * @param {number} count 
 * @returns {number} New total count
 */
export function addStreakShield(count = 1) {
  const current = getStreakShieldData();
  const newCount = Math.min(MAX_STREAK_SHIELDS, (current.shieldsRemaining || 0) + count);
  current.shieldsRemaining = newCount;
  saveStreakShieldData(current);
  return newCount;
}

/**
 * Evaluates whether a streak shield should be consumed to save an interrupted streak.
 * Called upon application launch / arena entry.
 * 
 * @param {Object} params
 * @param {string} params.lastActiveDate - YYYY-MM-DD
 * @param {string} [params.todayDate] - Optional override for testing
 * @returns {{ wasProtected: boolean, shieldsRemaining: number, reason: string }}
 */
export function evaluateStreakProtection({ lastActiveDate, todayDate = null }) {
  const today = todayDate || getLocalDateKey();
  const shieldData = getStreakShieldData();

  if (!lastActiveDate) {
    return { wasProtected: false, shieldsRemaining: shieldData.shieldsRemaining, reason: 'first_time' };
  }

  // Calculate day difference
  const lastTime = new Date(lastActiveDate).getTime();
  const curTime = new Date(today).getTime();
  const diffDays = Math.round((curTime - lastTime) / (1000 * 60 * 60 * 24));

  // If yesterday or today, streak is alive and healthy
  if (diffDays <= 1) {
    return { wasProtected: false, shieldsRemaining: shieldData.shieldsRemaining, reason: 'streak_active' };
  }

  // If missed exactly 1 day (diffDays === 2) and user has a shield
  if (diffDays === 2 && shieldData.shieldsRemaining > 0) {
    shieldData.shieldsRemaining -= 1;
    shieldData.lastShieldUsedDate = today;
    shieldData.shieldHistory.push({
      dateUsed: today,
      forMissedDate: new Date(lastTime + 86400000).toISOString().split('T')[0]
    });
    saveStreakShieldData(shieldData);

    return {
      wasProtected: true,
      shieldsRemaining: shieldData.shieldsRemaining,
      reason: 'shield_consumed'
    };
  }

  // Missed more than 1 day or has 0 shields -> Streak lost
  return {
    wasProtected: false,
    shieldsRemaining: shieldData.shieldsRemaining,
    reason: diffDays > 2 ? 'too_many_days_missed' : 'no_shields_left'
  };
}
