/**
 * src/services/gamification/offlineRivals.js
 * 
 * Generates Deterministic Seeded Offline Rivals for Atlas English Arena.
 * Guarantees immutable rivals, constant avatars, streaks, and plausible baseline XP throughout the entire week.
 */

import { hashString, createMulberry32, seededInt } from '../../utils/seededRandom.js';
import { getLeagueTier } from './leagueEngine.js';

const RIVAL_NAMES = [
  'Alex Cambridge', 'Elena V.', 'Marcus IELTS 8.5', 'Sophia Chen', 'David Oxford',
  'Linh Nguyen', 'Minh Tri', 'Chloe Bennett', 'Liam Gallagher', 'Aria Montgomery',
  'Ethan Wright', 'Lucas Silva', 'Yuki Tanaka', 'Hanna Schmidt', 'Oliver Queen',
  'Emma Watson', 'Daniel Craig', 'Khai Hoang', 'Phuong Anh', 'Tuan Kiet'
];

/**
 * Generates an array of deterministic rivals for a given week key.
 * @param {string} weekKey - e.g. '2026-W41'
 * @param {number} [count=15]
 * @returns {Array<Object>}
 */
export function generateWeeklyRivals(weekKey = '2026-W41', count = 15) {
  const seed = hashString(weekKey);
  const rng = createMulberry32(seed);

  const rivals = [];
  const maxRivals = Math.min(count, RIVAL_NAMES.length);

  for (let i = 0; i < maxRivals; i++) {
    const name = RIVAL_NAMES[i];
    // Plausible weekly XP distribution (ranked from high to moderate)
    const baseVariance = seededInt(rng, 10, 80);
    const weeklyXp = Math.max(40, Math.round((maxRivals - i) * 110 + baseVariance));
    const streak = seededInt(rng, 2, 28);
    const totalXp = weeklyXp * seededInt(rng, 2, 5);

    rivals.push({
      user_id: `rival_${hashString(name + weekKey)}`,
      display_name: name,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      weekly_xp: weeklyXp,
      total_xp: totalXp,
      streak_count: streak,
      league_tier: getLeagueTier(weeklyXp),
      isRival: true
    });
  }

  // Sort descending by weekly_xp
  return rivals.sort((a, b) => b.weekly_xp - a.weekly_xp);
}
