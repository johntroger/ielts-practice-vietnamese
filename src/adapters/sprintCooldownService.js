/**
 * src/adapters/sprintCooldownService.js
 * 
 * 5-Day Question Rotation Cooldown Engine for Atlas English Arena.
 * - Prevents repetitive questions within a rolling 5-day window.
 * - Graceful fallback: If eligible pool is depleted, prioritizes oldest questions.
 * - Auto-prunes records older than 30 days to guarantee zero storage bloat.
 */

import { safeGet, safeSet } from '../utils/storageService.js';
import { ARENA_STORAGE_KEYS } from '../utils/arenaStorageKeys.js';

export const COOLDOWN_DURATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days
export const PRUNE_THRESHOLD_MS = 30 * 24 * 60 * 60 * 1000;  // 30 days

/**
 * Retrieves the current question cooldown log.
 * @returns {Record<string, number>}
 */
export function getCooldownLog() {
  return safeGet(ARENA_STORAGE_KEYS.COOLDOWN_LOG, {});
}

/**
 * Checks whether a question is within the active 5-day cooldown.
 * @param {string} questionId 
 * @param {number} [now=Date.now()] 
 * @param {Record<string, number>} [log=getCooldownLog()] 
 * @returns {boolean}
 */
export function isQuestionInCooldown(questionId, now = Date.now(), log = getCooldownLog()) {
  const servedAt = log[questionId];
  if (!servedAt) return false;
  return (now - servedAt) < COOLDOWN_DURATION_MS;
}

/**
 * Filters questions respecting cooldown, with graceful starvation protection.
 * @param {Array<{ id: string }>} questions 
 * @param {number} [minCount=7] 
 * @param {number} [now=Date.now()] 
 * @returns {Array<Object>}
 */
export function filterEligibleQuestions(questions = [], minCount = 7, now = Date.now()) {
  if (!Array.isArray(questions) || questions.length === 0) return [];
  const log = getCooldownLog();

  const fresh = questions.filter(q => !isQuestionInCooldown(q.id, now, log));
  if (fresh.length >= minCount) {
    return fresh;
  }

  // Graceful fallback: Sort by oldest served timestamp first
  return [...questions].sort((a, b) => {
    const timeA = log[a.id] || 0;
    const timeB = log[b.id] || 0;
    return timeA - timeB;
  });
}

/**
 * Records newly served question IDs into the cooldown log and prunes stale records.
 * @param {string[]} questionIds 
 * @param {number} [now=Date.now()] 
 */
export function recordServedQuestions(questionIds = [], now = Date.now()) {
  if (!Array.isArray(questionIds) || questionIds.length === 0) return;
  const log = getCooldownLog();

  // Mark served timestamps
  for (const id of questionIds) {
    if (id) log[id] = now;
  }

  // Prune entries older than 30 days
  const prunedLog = {};
  for (const [id, ts] of Object.entries(log)) {
    if (now - ts < PRUNE_THRESHOLD_MS) {
      prunedLog[id] = ts;
    }
  }

  safeSet(ARENA_STORAGE_KEYS.COOLDOWN_LOG, prunedLog);
}

/**
 * Clears cooldown log completely (for testing & reset purposes).
 */
export function clearCooldownLog() {
  safeSet(ARENA_STORAGE_KEYS.COOLDOWN_LOG, {});
}
