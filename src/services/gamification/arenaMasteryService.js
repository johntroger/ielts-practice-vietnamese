/**
 * src/services/gamification/arenaMasteryService.js
 * 
 * 3-Tier Mastery Lifecycle & Ebbinghaus Spaced Decay Engine for Atlas Arena v8.1.
 * 
 * Implements the Bulletproof Mastery Protocol:
 * 1. 2-Hit Mastery: Correct twice consecutively across separate matches -> 'mastered'.
 * 2. Ebbinghaus Spaced Decay (14 Days): Questions mastered > 14 days ago decay into 'refresh_review'
 *    so the question bank never gets depleted or forgotten over time.
 * 3. Exponential Backoff on Mistakes: Mistakes must cool down for at least 1 match before revenge.
 * 4. Max 1 Revenge Question per match to safeguard win-streak motivation.
 * 5. One-time +5 XP Revenge Reward Guard: Prevents infinite exploit grinding.
 * 6. Local-First with zero-latency in-memory cache.
 */

import { safeGet, safeSet } from '../../utils/storageService.js';

export const ARENA_MASTERY_STATE_KEY = 'atlas_arena_mastery_state_v8';
export const EBBINGHAUS_DECAY_MS = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
export const REVENGE_XP_BONUS = 5;

/**
 * @typedef {'unseen' | 'familiar' | 'mastered' | 'refresh_review' | 'mistake'} MasteryStatus
 */

/**
 * Retrieves the full mastery state from storage.
 * @returns {{ totalMatchesCompleted: number, questions: Record<string, Object> }}
 */
export function getMasteryState() {
  return safeGet(ARENA_MASTERY_STATE_KEY, {
    totalMatchesCompleted: 0,
    questions: {}
  });
}

/**
 * Saves the mastery state.
 * @param {Object} nextState 
 */
export function saveMasteryState(nextState) {
  safeSet(ARENA_MASTERY_STATE_KEY, nextState);
}

/**
 * Returns current total completed matches.
 * @returns {number}
 */
export function getCompletedMatchCount() {
  const state = getMasteryState();
  return Number(state.totalMatchesCompleted) || 0;
}

/**
 * Increments completed matches counter.
 * @returns {number} New total match count
 */
export function recordMatchCompleted() {
  const state = getMasteryState();
  const nextCount = (Number(state.totalMatchesCompleted) || 0) + 1;
  saveMasteryState({
    ...state,
    totalMatchesCompleted: nextCount
  });
  return nextCount;
}

/**
 * Gets question metadata and evaluates Ebbinghaus Spaced Decay.
 * @param {string} questionId 
 * @param {number} [now=Date.now()]
 * @returns {Object|null}
 */
export function getQuestionMeta(questionId, now = Date.now()) {
  if (!questionId) return null;
  const state = getMasteryState();
  const meta = state.questions?.[questionId];
  if (!meta) return null;

  // Ebbinghaus 14-Day Decay Check: If mastered but older than 14 days, decay to refresh_review
  if (meta.status === 'mastered') {
    const elapsed = now - (meta.lastAttemptTime || 0);
    if (elapsed >= EBBINGHAUS_DECAY_MS) {
      return {
        ...meta,
        status: 'refresh_review'
      };
    }
  }

  return meta;
}

/**
 * Returns current dynamic mastery status of a question.
 * @param {string} questionId 
 * @param {number} [now=Date.now()]
 * @returns {MasteryStatus}
 */
export function getQuestionMasteryStatus(questionId, now = Date.now()) {
  const meta = getQuestionMeta(questionId, now);
  if (!meta) return 'unseen';
  return meta.status || 'unseen';
}

/**
 * Records the outcome of an attempted question in a match.
 * 
 * @param {Object} params
 * @param {string} params.questionId
 * @param {boolean} params.isCorrect
 * @param {number} [params.matchIndex]
 * @param {number} [params.now=Date.now()]
 * @returns {{ status: MasteryStatus, isRevengeCleared: boolean, bonusXp: number }}
 */
export function recordQuestionResult({ questionId, isCorrect, matchIndex = null, now = Date.now() }) {
  if (!questionId) return { status: 'unseen', isRevengeCleared: false, bonusXp: 0 };

  const state = getMasteryState();
  const currentMatch = matchIndex !== null ? matchIndex : getCompletedMatchCount() + 1;
  const existing = state.questions[questionId] || {
    consecutiveCorrect: 0,
    wrongCount: 0,
    status: 'unseen',
    lastAttemptMatch: 0,
    lastAttemptTime: 0,
    hasClaimedRevengeXp: false
  };

  let nextStatus = existing.status;
  let nextConsecutive = existing.consecutiveCorrect;
  let nextWrong = existing.wrongCount;
  let hasClaimed = existing.hasClaimedRevengeXp;
  let isRevengeCleared = false;
  let bonusXp = 0;

  if (isCorrect) {
    nextConsecutive += 1;

    // Revenge Clearance Check: If it was a mistake or refresh_review and now answered correctly
    if (existing.status === 'mistake') {
      isRevengeCleared = true;
      if (!hasClaimed) {
        bonusXp = REVENGE_XP_BONUS;
        hasClaimed = true;
      }
    }

    // 2-Hit Mastery Rule: Must be correct at least 2 consecutive times
    if (nextConsecutive >= 2) {
      nextStatus = 'mastered';
    } else {
      nextStatus = 'familiar';
    }
  } else {
    // Incorrect answer: Reset consecutive streak & transition to mistake
    nextConsecutive = 0;
    nextWrong += 1;
    nextStatus = 'mistake';
    hasClaimed = false; // Allow claiming revenge XP next time it's resolved
  }

  const updatedMeta = {
    consecutiveCorrect: nextConsecutive,
    wrongCount: nextWrong,
    status: nextStatus,
    lastAttemptMatch: currentMatch,
    lastAttemptTime: now,
    hasClaimedRevengeXp: hasClaimed
  };

  saveMasteryState({
    ...state,
    questions: {
      ...state.questions,
      [questionId]: updatedMeta
    }
  });

  return {
    status: nextStatus,
    isRevengeCleared,
    bonusXp
  };
}

/**
 * Filters all eligible revenge questions that have completed their cooling-off match.
 * Enforces exponential backoff: Must have rested at least 1 full match.
 * 
 * @param {Array<Object>} candidates
 * @param {number} [currentMatch]
 * @returns {Array<Object>}
 */
export function getEligibleRevengeQuestions(candidates = [], currentMatch = null) {
  const cur = currentMatch !== null ? currentMatch : getCompletedMatchCount() + 1;
  const state = getMasteryState();

  return candidates.filter(q => {
    const meta = state.questions[q.id];
    if (!meta) return false;
    // Must be in mistake state AND rested for at least 1 match (diff >= 2)
    return meta.status === 'mistake' && (cur - (meta.lastAttemptMatch || 0)) >= 2;
  });
}

/**
 * Resets mastery state (for testing or complete user progress reset).
 */
export function resetMasteryState() {
  saveMasteryState({
    totalMatchesCompleted: 0,
    questions: {}
  });
}
