/**
 * src/services/gamification/leagueEngine.js
 * 
 * 5-Tier Arena League Classification & Dynamic Relative Leaderboard Engine.
 * Tiers: Bronze -> Silver -> Gold -> Platinum -> Diamond
 * Synchronizes streak with StudyProfileRepository.
 */

import { ARENA_LEAGUE_TIERS } from '../../utils/arenaStorageKeys.js';
import { StudyProfileRepository } from '../../repositories/studyProfileRepository.js';

export const LEAGUE_THRESHOLDS = {
  [ARENA_LEAGUE_TIERS.BRONZE]: 0,
  [ARENA_LEAGUE_TIERS.SILVER]: 350,
  [ARENA_LEAGUE_TIERS.GOLD]: 800,
  [ARENA_LEAGUE_TIERS.PLATINUM]: 1500,
  [ARENA_LEAGUE_TIERS.DIAMOND]: 2500
};

/**
 * Resolves current league tier based on Weekly XP.
 * @param {number} weeklyXp 
 * @returns {string} leagueTier
 */
export function getLeagueTier(weeklyXp = 0) {
  const xp = Math.max(0, Number(weeklyXp) || 0);
  if (xp >= LEAGUE_THRESHOLDS[ARENA_LEAGUE_TIERS.DIAMOND]) return ARENA_LEAGUE_TIERS.DIAMOND;
  if (xp >= LEAGUE_THRESHOLDS[ARENA_LEAGUE_TIERS.PLATINUM]) return ARENA_LEAGUE_TIERS.PLATINUM;
  if (xp >= LEAGUE_THRESHOLDS[ARENA_LEAGUE_TIERS.GOLD]) return ARENA_LEAGUE_TIERS.GOLD;
  if (xp >= LEAGUE_THRESHOLDS[ARENA_LEAGUE_TIERS.SILVER]) return ARENA_LEAGUE_TIERS.SILVER;
  return ARENA_LEAGUE_TIERS.BRONZE;
}

/**
 * Gets synchronized streak count directly from StudyProfileRepository.
 * @returns {number}
 */
export function getUnifiedStreakCount() {
  return StudyProfileRepository.getStreakCount();
}

/**
 * Updates streak count across the unified ecosystem.
 * @param {number} nextStreak 
 */
export function updateUnifiedStreakCount(nextStreak) {
  const val = Math.max(0, Number(nextStreak) || 0);
  StudyProfileRepository.saveStreakCount(val);
  return val;
}

/**
 * Computes Dynamic Relative Rivals slice (+-5 around user)
 * @param {Array} allRivals - Sorted descending by weekly_xp
 * @param {string} currentUserId 
 * @returns {{ rivalsSlice: Array, userRank: number }}
 */
export function getRelativeLeaderboardSlice(allRivals = [], currentUserId) {
  if (!Array.isArray(allRivals) || allRivals.length === 0) {
    return { rivalsSlice: [], userRank: 1 };
  }

  const userIdx = allRivals.findIndex(r => r.user_id === currentUserId || r.isCurrentUser);
  const userRank = userIdx !== -1 ? userIdx + 1 : allRivals.length + 1;

  if (userIdx === -1) {
    // Return Top 10 if user not ranked yet
    return { rivalsSlice: allRivals.slice(0, 10), userRank };
  }

  // Slice +-5 around user
  const start = Math.max(0, userIdx - 5);
  const end = Math.min(allRivals.length, userIdx + 6);
  return {
    rivalsSlice: allRivals.slice(start, end),
    userRank
  };
}

export const LEAGUE_TIER_ORDER = [
  ARENA_LEAGUE_TIERS.BRONZE,
  ARENA_LEAGUE_TIERS.SILVER,
  ARENA_LEAGUE_TIERS.GOLD,
  ARENA_LEAGUE_TIERS.PLATINUM,
  ARENA_LEAGUE_TIERS.DIAMOND
];

export const LEAGUE_PROMOTION_PERCENTILE = 0.20; // Top 20%
export const LEAGUE_RELEGATION_PERCENTILE = 0.15; // Bottom 15%
export const WEEKLY_PROMOTION_BONUS_XP = 50;

/**
 * Returns next tier up in the league hierarchy.
 * @param {string} tier 
 * @returns {string}
 */
export function getNextLeagueTier(tier) {
  const idx = LEAGUE_TIER_ORDER.indexOf(tier);
  if (idx === -1 || idx >= LEAGUE_TIER_ORDER.length - 1) {
    return ARENA_LEAGUE_TIERS.DIAMOND;
  }
  return LEAGUE_TIER_ORDER[idx + 1];
}

/**
 * Returns previous tier down in the league hierarchy.
 * @param {string} tier 
 * @returns {string}
 */
export function getPreviousLeagueTier(tier) {
  const idx = LEAGUE_TIER_ORDER.indexOf(tier);
  if (idx <= 0) {
    return ARENA_LEAGUE_TIERS.BRONZE;
  }
  return LEAGUE_TIER_ORDER[idx - 1];
}

/**
 * Evaluates weekly league transition (Sunday midnight / new ISO week rollover).
 * Determines if user is promoted, relegated, or maintained.
 * 
 * @param {Object} params
 * @param {string} params.currentWeekKey - ISO week key (e.g. '2026-W42')
 * @param {string} params.lastEvaluatedWeek - Previously evaluated week key from storage
 * @param {string} params.currentTier - Current league tier of user
 * @param {number} params.userRank - Final rank of user in previous week (1-indexed)
 * @param {number} params.totalPlayers - Total players in the league
 * @param {number} params.weeklyXp - Weekly XP earned by user in previous week
 * @returns {{ isNewWeek: boolean, action: 'promoted'|'relegated'|'maintained'|'none', previousTier: string, newTier: string, bonusXp: number, userRank: number, totalPlayers: number }}
 */
export function evaluateWeeklyLeagueTransition({
  currentWeekKey,
  lastEvaluatedWeek = '',
  currentTier = ARENA_LEAGUE_TIERS.BRONZE,
  userRank = 1,
  totalPlayers = 10,
  weeklyXp = 0
} = {}) {
  if (!lastEvaluatedWeek || lastEvaluatedWeek === currentWeekKey) {
    return {
      isNewWeek: false,
      action: 'none',
      previousTier: currentTier,
      newTier: currentTier,
      bonusXp: 0,
      userRank,
      totalPlayers
    };
  }

  // Week has changed! Evaluate promotion or relegation based on previous week standings
  const safeTotal = Math.max(1, Number(totalPlayers) || 1);
  const promoCutoff = Math.ceil(safeTotal * LEAGUE_PROMOTION_PERCENTILE);
  const relCutoff = safeTotal - Math.ceil(safeTotal * LEAGUE_RELEGATION_PERCENTILE);

  // Promotion condition: In Top 20% and has participated (weeklyXp > 0)
  if (userRank <= promoCutoff && weeklyXp > 0) {
    const newTier = getNextLeagueTier(currentTier);
    return {
      isNewWeek: true,
      action: 'promoted',
      previousTier: currentTier,
      newTier,
      bonusXp: WEEKLY_PROMOTION_BONUS_XP,
      userRank,
      totalPlayers: safeTotal
    };
  }

  // Relegation condition: In bottom 15%, totalPlayers >= 5, and not already at lowest tier (Bronze)
  if (safeTotal >= 5 && userRank >= relCutoff && currentTier !== ARENA_LEAGUE_TIERS.BRONZE) {
    const newTier = getPreviousLeagueTier(currentTier);
    return {
      isNewWeek: true,
      action: 'relegated',
      previousTier: currentTier,
      newTier,
      bonusXp: 0,
      userRank,
      totalPlayers: safeTotal
    };
  }

  // Maintained in safe zone (middle 65%)
  return {
    isNewWeek: true,
    action: 'maintained',
    previousTier: currentTier,
    newTier: currentTier,
    bonusXp: 0,
    userRank,
    totalPlayers: safeTotal
  };
}

/**
 * Computes Ghost Rival pacing metrics:
 * Identifies the rival directly ahead of user to overtake, or lead over rival behind.
 * 
 * @param {Array} rivals - Full sorted leaderboard
 * @param {string|null} currentUserId - Active player user_id
 * @returns {{ aheadRival: Object|null, behindRival: Object|null, xpToOvertake: number, leadXp: number, isLeader: boolean, userRank: number }}
 */
export function computeGhostRivalPacing(rivals = [], currentUserId = null) {
  if (!Array.isArray(rivals) || rivals.length === 0) {
    return {
      aheadRival: null,
      behindRival: null,
      xpToOvertake: 0,
      leadXp: 0,
      isLeader: false,
      userRank: 1
    };
  }

  const userIdx = rivals.findIndex(r => r.user_id === currentUserId || r.isCurrentUser);
  if (userIdx === -1) {
    // User unranked or guest: rival ahead is the lowest ranked player or top 1
    const target = rivals[rivals.length - 1];
    return {
      aheadRival: target,
      behindRival: null,
      xpToOvertake: Math.max(1, (target.weekly_xp || 0) + 1),
      leadXp: 0,
      isLeader: false,
      userRank: rivals.length + 1
    };
  }

  const userRank = userIdx + 1;
  const userXp = rivals[userIdx].weekly_xp || 0;

  if (userIdx === 0) {
    // Current user is #1 Leader!
    const behindRival = rivals[1] || null;
    const leadXp = behindRival ? Math.max(0, userXp - (behindRival.weekly_xp || 0)) : userXp;
    return {
      aheadRival: null,
      behindRival,
      xpToOvertake: 0,
      leadXp,
      isLeader: true,
      userRank: 1
    };
  }

  // User is ranked #2 or below: rival ahead is userIdx - 1
  const aheadRival = rivals[userIdx - 1];
  const aheadXp = aheadRival.weekly_xp || 0;
  const xpToOvertake = Math.max(1, aheadXp - userXp + 1);
  const behindRival = rivals[userIdx + 1] || null;
  const leadXp = behindRival ? Math.max(0, userXp - (behindRival.weekly_xp || 0)) : 0;

  return {
    aheadRival,
    behindRival,
    xpToOvertake,
    leadXp,
    isLeader: false,
    userRank
  };
}
