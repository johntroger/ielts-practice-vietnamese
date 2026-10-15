/**
 * tests/test_step156_arena_league_progression_and_ghost_rivals.js
 * 
 * Step 156 Verification Suite:
 * Atlas English Arena Phase 3:
 * 1. 5-Tier League Progression & Tier Traversal (Bronze -> Silver -> Gold -> Platinum -> Diamond)
 * 2. Weekly League Transition Evaluation Engine (Sunday Midnight / New Week Rollover)
 *    - Promotion for Top 20% with +50 XP Starter Bonus
 *    - Relegation for Bottom 15% (with Bronze Protection)
 *    - Maintained in Safe Zone (Middle 65%)
 * 3. Ghost Rival & Near-Pacing Engine (Overtake Gap & Leader Advantage)
 * 4. Dynamic Zone Dividers & Status Indicators in Leaderboard
 * 5. Weekly League Promotion Celebration Modal Component & Integration
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { 
  getLeagueTier, 
  getNextLeagueTier, 
  getPreviousLeagueTier,
  evaluateWeeklyLeagueTransition,
  computeGhostRivalPacing,
  getRelativeLeaderboardSlice,
  LEAGUE_TIER_ORDER,
  LEAGUE_PROMOTION_PERCENTILE,
  LEAGUE_RELEGATION_PERCENTILE,
  WEEKLY_PROMOTION_BONUS_XP
} from '../src/services/gamification/leagueEngine.js';

import { ARENA_LEAGUE_TIERS } from '../src/utils/arenaStorageKeys.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting Step 156 Test Suite: Arena League Promotion, Relegation & Ghost Rivals...');

// =========================================================================
// TEST 1: League Tier Traversal & Boundary Safety
// =========================================================================
console.log('▶ Test 1: League Tier Traversal & Boundary Safety...');

assert.strictEqual(LEAGUE_TIER_ORDER.length, 5, 'Should define exactly 5 league tiers');
assert.strictEqual(getNextLeagueTier(ARENA_LEAGUE_TIERS.BRONZE), ARENA_LEAGUE_TIERS.SILVER);
assert.strictEqual(getNextLeagueTier(ARENA_LEAGUE_TIERS.SILVER), ARENA_LEAGUE_TIERS.GOLD);
assert.strictEqual(getNextLeagueTier(ARENA_LEAGUE_TIERS.GOLD), ARENA_LEAGUE_TIERS.PLATINUM);
assert.strictEqual(getNextLeagueTier(ARENA_LEAGUE_TIERS.PLATINUM), ARENA_LEAGUE_TIERS.DIAMOND);
assert.strictEqual(getNextLeagueTier(ARENA_LEAGUE_TIERS.DIAMOND), ARENA_LEAGUE_TIERS.DIAMOND, 'Diamond must cap at Diamond');

assert.strictEqual(getPreviousLeagueTier(ARENA_LEAGUE_TIERS.DIAMOND), ARENA_LEAGUE_TIERS.PLATINUM);
assert.strictEqual(getPreviousLeagueTier(ARENA_LEAGUE_TIERS.PLATINUM), ARENA_LEAGUE_TIERS.GOLD);
assert.strictEqual(getPreviousLeagueTier(ARENA_LEAGUE_TIERS.GOLD), ARENA_LEAGUE_TIERS.SILVER);
assert.strictEqual(getPreviousLeagueTier(ARENA_LEAGUE_TIERS.SILVER), ARENA_LEAGUE_TIERS.BRONZE);
assert.strictEqual(getPreviousLeagueTier(ARENA_LEAGUE_TIERS.BRONZE), ARENA_LEAGUE_TIERS.BRONZE, 'Bronze cannot be relegated below Bronze');
console.log('  ✓ 5-Tier bidirectional hierarchy correctly traversed with upper/lower bounds');

// =========================================================================
// TEST 2: Weekly League Transition - Promotion Evaluation (Top 20%)
// =========================================================================
console.log('▶ Test 2: Weekly League Transition - Promotion Evaluation...');

// Case 2.1: Same week - No evaluation
const sameWeekResult = evaluateWeeklyLeagueTransition({
  currentWeekKey: '2026-W42',
  lastEvaluatedWeek: '2026-W42',
  currentTier: ARENA_LEAGUE_TIERS.SILVER,
  userRank: 1,
  totalPlayers: 20,
  weeklyXp: 500
});
assert.strictEqual(sameWeekResult.isNewWeek, false);
assert.strictEqual(sameWeekResult.action, 'none');

// Case 2.2: New week - Rank 2 of 20 (Top 10% <= Top 20%) with XP -> PROMOTED!
const promoResult = evaluateWeeklyLeagueTransition({
  currentWeekKey: '2026-W42',
  lastEvaluatedWeek: '2026-W41',
  currentTier: ARENA_LEAGUE_TIERS.SILVER,
  userRank: 2,
  totalPlayers: 20,
  weeklyXp: 850
});
assert.strictEqual(promoResult.isNewWeek, true);
assert.strictEqual(promoResult.action, 'promoted');
assert.strictEqual(promoResult.previousTier, ARENA_LEAGUE_TIERS.SILVER);
assert.strictEqual(promoResult.newTier, ARENA_LEAGUE_TIERS.GOLD);
assert.strictEqual(promoResult.bonusXp, WEEKLY_PROMOTION_BONUS_XP, 'Should award +50 XP starter bonus');
console.log('  ✓ Promotion correctly awarded to Top 20% performers with +50 XP bonus');

// Case 2.3: In Top 20% but 0 XP (inactive) -> Should NOT promote
const inactiveResult = evaluateWeeklyLeagueTransition({
  currentWeekKey: '2026-W42',
  lastEvaluatedWeek: '2026-W41',
  currentTier: ARENA_LEAGUE_TIERS.SILVER,
  userRank: 1,
  totalPlayers: 10,
  weeklyXp: 0
});
assert.notStrictEqual(inactiveResult.action, 'promoted', 'Inactive user with 0 XP must not be promoted');

// =========================================================================
// TEST 3: Weekly League Transition - Relegation & Safe Zone
// =========================================================================
console.log('▶ Test 3: Weekly League Transition - Relegation & Safe Zone...');

// Case 3.1: Rank 19 of 20 (Bottom 10% in Bottom 15%) in Gold tier -> RELEGATED to Silver
const relResult = evaluateWeeklyLeagueTransition({
  currentWeekKey: '2026-W42',
  lastEvaluatedWeek: '2026-W41',
  currentTier: ARENA_LEAGUE_TIERS.GOLD,
  userRank: 19,
  totalPlayers: 20,
  weeklyXp: 40
});
assert.strictEqual(relResult.isNewWeek, true);
assert.strictEqual(relResult.action, 'relegated');
assert.strictEqual(relResult.previousTier, ARENA_LEAGUE_TIERS.GOLD);
assert.strictEqual(relResult.newTier, ARENA_LEAGUE_TIERS.SILVER);
assert.strictEqual(relResult.bonusXp, 0);

// Case 3.2: Bottom rank in Bronze tier -> Maintained at Bronze (No relegation below Bronze)
const bronzeRelResult = evaluateWeeklyLeagueTransition({
  currentWeekKey: '2026-W42',
  lastEvaluatedWeek: '2026-W41',
  currentTier: ARENA_LEAGUE_TIERS.BRONZE,
  userRank: 10,
  totalPlayers: 10,
  weeklyXp: 10
});
assert.strictEqual(bronzeRelResult.action, 'maintained');
assert.strictEqual(bronzeRelResult.newTier, ARENA_LEAGUE_TIERS.BRONZE);

// Case 3.3: Middle Rank 8 of 20 (Safe Zone: 20% - 85%) -> MAINTAINED
const safeResult = evaluateWeeklyLeagueTransition({
  currentWeekKey: '2026-W42',
  lastEvaluatedWeek: '2026-W41',
  currentTier: ARENA_LEAGUE_TIERS.GOLD,
  userRank: 8,
  totalPlayers: 20,
  weeklyXp: 300
});
assert.strictEqual(safeResult.action, 'maintained');
assert.strictEqual(safeResult.newTier, ARENA_LEAGUE_TIERS.GOLD);
console.log('  ✓ Relegation and safe zone threshold calculations verified cleanly');

// =========================================================================
// TEST 4: Ghost Rival Near-Pacing Engine
// =========================================================================
console.log('▶ Test 4: Ghost Rival Near-Pacing Engine...');

const mockRivals = [
  { user_id: 'u1', display_name: 'Scholar_Alpha', weekly_xp: 500, rank: 1 },
  { user_id: 'u2', display_name: 'Scholar_Beta', weekly_xp: 420, rank: 2 },
  { user_id: 'u_current', display_name: 'Current_User', weekly_xp: 380, rank: 3, isCurrentUser: true },
  { user_id: 'u4', display_name: 'Scholar_Delta', weekly_xp: 260, rank: 4 }
];

// User at rank #3: Ahead rival is Scholar_Beta (#2 with 420 XP)
// XP to overtake = 420 - 380 + 1 = 41 XP
const pacingUser = computeGhostRivalPacing(mockRivals, 'u_current');
assert.strictEqual(pacingUser.isLeader, false);
assert.strictEqual(pacingUser.userRank, 3);
assert.ok(pacingUser.aheadRival);
assert.strictEqual(pacingUser.aheadRival.display_name, 'Scholar_Beta');
assert.strictEqual(pacingUser.xpToOvertake, 41, 'xpToOvertake should be 41');
assert.strictEqual(pacingUser.leadXp, 120, 'Should lead rival behind by 380 - 260 = 120 XP');

// User at rank #1 (Scholar_Alpha)
const pacingLeader = computeGhostRivalPacing(mockRivals, 'u1');
assert.strictEqual(pacingLeader.isLeader, true);
assert.strictEqual(pacingLeader.aheadRival, null);
assert.ok(pacingLeader.behindRival);
assert.strictEqual(pacingLeader.behindRival.display_name, 'Scholar_Beta');
assert.strictEqual(pacingLeader.leadXp, 80, 'Leader should lead #2 by 500 - 420 = 80 XP');
console.log('  ✓ Ghost rival pacing correctly calculates overtake gap and leader margin');

// =========================================================================
// TEST 5: UI Components & Markup Audit
// =========================================================================
console.log('▶ Test 5: UI Components & Markup Audit...');

const leaderboardCode = fs.readFileSync(path.join(rootDir, 'src/components/arena/ArenaRelativeLeaderboard.jsx'), 'utf-8');
assert.ok(leaderboardCode.includes('computeGhostRivalPacing'), 'Must use computeGhostRivalPacing');
assert.ok(leaderboardCode.includes('showPromoDivider'), 'Must render Promotion Zone Divider');
assert.ok(leaderboardCode.includes('showRelDivider'), 'Must render Relegation Zone Divider');
assert.ok(leaderboardCode.includes('pacing.aheadRival'), 'Must display Ghost Rival near-pacing banner');

const promoModalCode = fs.readFileSync(path.join(rootDir, 'src/components/arena/ArenaLeaguePromotionModal.jsx'), 'utf-8');
assert.ok(promoModalCode.includes('ArenaLeaguePromotionModal'), 'Must export ArenaLeaguePromotionModal');
assert.ok(promoModalCode.includes('WEEKLY LEAGUE ROLLOVER'), 'Must display weekly rollover header');
assert.ok(promoModalCode.includes('transition.bonusXp'), 'Must display bonus XP award');

const arenaModalCode = fs.readFileSync(path.join(rootDir, 'src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
assert.ok(arenaModalCode.includes('ArenaLeaguePromotionModal'), 'Must import ArenaLeaguePromotionModal');
assert.ok(arenaModalCode.includes('evaluateWeeklyLeagueTransition'), 'Must import evaluateWeeklyLeagueTransition');
assert.ok(arenaModalCode.includes('weeklyTransition'), 'Must maintain weeklyTransition state');

// Verify getRelativeLeaderboardSlice is preserved for backward compatibility
const slice = getRelativeLeaderboardSlice(mockRivals, 'u_current');
assert.ok(Array.isArray(slice.rivalsSlice));
assert.strictEqual(slice.userRank, 3);

console.log('\n===============================================================');
console.log('🎉 STEP 156 VERIFICATION COMPLETE: ALL TESTS PASSED (100%)!');
console.log('===============================================================\n');
