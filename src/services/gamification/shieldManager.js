/**
 * src/services/gamification/shieldManager.js
 * 
 * Manages Arena Shields (5 Shields per sprint) & 1 Retry Chance.
 * Controls mistake correction at sprint climax without breaking game economy.
 */

import { safeGet, safeSet } from '../../utils/storageService.js';
import { ARENA_STORAGE_KEYS } from '../../utils/arenaStorageKeys.js';

export const INITIAL_SHIELDS = 5;

/**
 * Initializes a new shield state for a 7-question sprint.
 * Supports extraShields from tactical perks (e.g. Titan Armor +1 Shield).
 */
export function createSprintShieldState(extraShields = 0) {
  const total = INITIAL_SHIELDS + Math.max(0, Number(extraShields) || 0);
  return {
    remainingShields: total,
    maxShields: total,
    retryUsed: false,
    mistakesRecorded: []
  };
}

/**
 * Deducts one shield on a wrong answer.
 * @param {Object} state - Current shield state
 * @param {any} questionItem - Question metadata that was answered incorrectly
 * @returns {{ state: Object, isDefeated: boolean }}
 */
export function deductShield(state, questionItem) {
  const next = { ...state };
  next.remainingShields = Math.max(0, next.remainingShields - 1);
  if (questionItem) {
    next.mistakesRecorded = [...(next.mistakesRecorded || []), questionItem];
  }
  const isDefeated = next.remainingShields <= 0;
  return { state: next, isDefeated };
}

/**
 * Consumes the 1-time Sprint Retry if available.
 * Restores 2 shields to allow completing the sprint.
 * @param {Object} state 
 * @returns {{ state: Object, success: boolean }}
 */
export function useSprintRetry(state) {
  if (state.retryUsed) {
    return { state, success: false };
  }
  const next = {
    ...state,
    remainingShields: 2,
    retryUsed: true
  };
  return { state: next, success: true };
}
