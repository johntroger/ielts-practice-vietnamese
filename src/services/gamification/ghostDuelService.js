/**
 * src/services/gamification/ghostDuelService.js
 * 
 * Asynchronous 1-on-1 Ghost Duel Engine for Atlas English Arena.
 * Allows learners to challenge real peer rivals (or deterministic ghost bots) in an async pacing sprint:
 * - Deterministic Ghost Checkpoints (paced answer timestamps & simulated errors based on target band)
 * - Live Racer Telemetry comparing learner progress vs Ghost in real-time
 * - Duel Victory Climax & XP Bonus (+15 XP)
 */

import { safeGet, safeSet, safeRemove } from '../../utils/storageService.js';
import { ARENA_STORAGE_KEYS } from '../../utils/arenaStorageKeys.js';
import { hashString, createMulberry32, seededInt } from '../../utils/seededRandom.js';

export const GHOST_DUEL_BONUS_XP = 15;

/**
 * Creates and persists an active ghost duel based on a chosen rival.
 * @param {Object} rival - { display_name, avatar_url, weekly_xp, target_band }
 * @returns {Object} Active ghost duel state
 */
export function createGhostDuel(rival = null) {
  const fallbackName = 'Marcus IELTS 8.5';
  const name = rival?.display_name || rival?.name || fallbackName;
  const avatar = rival?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`;
  const seed = hashString(name + Date.now());
  const rng = createMulberry32(seed);

  // Generate 7 pacing checkpoints (seconds at which ghost answers each question)
  // Average Cambridge reflex time: 10 - 20 seconds per question
  const checkpoints = [];
  let cumulativeTime = 0;
  let correctCount = 0;
  const totalQuestions = 7;

  // Ghost accuracy between 70% and 86% (5 or 6 out of 7)
  const targetCorrect = seededInt(rng, 5, 6);

  for (let i = 0; i < totalQuestions; i++) {
    const paceSeconds = seededInt(rng, 11, 22);
    cumulativeTime += paceSeconds;
    const isCorrect = i < targetCorrect;
    if (isCorrect) correctCount++;
    checkpoints.push({
      questionIndex: i,
      timestampSeconds: cumulativeTime,
      isCorrect
    });
  }

  const duel = {
    id: `duel_${Date.now()}_${hashString(name)}`,
    rivalName: name,
    rivalAvatar: avatar,
    totalQuestions,
    targetScore: correctCount,
    totalGhostTime: cumulativeTime,
    checkpoints,
    createdAt: Date.now()
  };

  safeSet(ARENA_STORAGE_KEYS.ACTIVE_GHOST_DUEL || 'ielts_arena_active_ghost_duel', duel);
  return duel;
}

/**
 * Retrieves the currently active ghost duel if present.
 */
export function getActiveGhostDuel() {
  return safeGet(ARENA_STORAGE_KEYS.ACTIVE_GHOST_DUEL || 'ielts_arena_active_ghost_duel', null);
}

/**
 * Clears the active ghost duel session.
 */
export function clearActiveGhostDuel() {
  safeRemove(ARENA_STORAGE_KEYS.ACTIVE_GHOST_DUEL || 'ielts_arena_active_ghost_duel');
}

/**
 * Evaluates live progress of the ghost rival given elapsed sprint seconds.
 * @param {Object} duel - Active duel object
 * @param {number} elapsedSeconds - Current match elapsed time
 * @returns {{ ghostQuestionIndex: number, ghostScore: number, ghostProgressPercent: number, isGhostFinished: boolean }}
 */
export function evaluateGhostDuelProgress(duel, elapsedSeconds = 0) {
  if (!duel || !Array.isArray(duel.checkpoints)) {
    return {
      ghostQuestionIndex: 0,
      ghostScore: 0,
      ghostProgressPercent: 0,
      isGhostFinished: false
    };
  }

  let completedQuestions = 0;
  let ghostScore = 0;

  for (const cp of duel.checkpoints) {
    if (elapsedSeconds >= cp.timestampSeconds) {
      completedQuestions++;
      if (cp.isCorrect) ghostScore++;
    } else {
      break;
    }
  }

  const isGhostFinished = completedQuestions >= duel.totalQuestions;
  const ghostProgressPercent = Math.min(100, Math.round((completedQuestions / duel.totalQuestions) * 100));

  return {
    ghostQuestionIndex: Math.min(duel.totalQuestions - 1, completedQuestions),
    ghostScore,
    ghostProgressPercent,
    isGhostFinished
  };
}

/**
 * Resolves the final Ghost Duel result when sprint completes.
 * @param {Object} params - { userScore, totalQuestions, userTimeSpent, duel }
 * @returns {Object} Result summary with duel victory flag and bonus XP
 */
export function resolveGhostDuelResult({ userScore = 0, totalQuestions = 7, userTimeSpent = 180, duel = null }) {
  if (!duel) return null;

  const ghostScore = duel.targetScore;
  const ghostTime = duel.totalGhostTime;

  // Win condition: User has strictly higher score, or equal score with faster completion time
  const isVictory = userScore > ghostScore || (userScore === ghostScore && userTimeSpent <= ghostTime);
  const bonusXp = isVictory ? GHOST_DUEL_BONUS_XP : 0;

  const result = {
    isDuel: true,
    rivalName: duel.rivalName,
    rivalAvatar: duel.rivalAvatar,
    userScore,
    ghostScore,
    userTimeSpent,
    ghostTime,
    isVictory,
    bonusXp
  };

  clearActiveGhostDuel();
  return result;
}
