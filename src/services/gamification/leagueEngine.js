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
