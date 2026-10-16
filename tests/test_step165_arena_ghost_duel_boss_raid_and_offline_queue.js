/**
 * tests/test_step165_arena_ghost_duel_boss_raid_and_offline_queue.js
 * 
 * Verifies Phase 3 Enhancements for Atlas English Arena:
 * 1. Ghost Duel 1-on-1 Async Rival Engine (checkpoints, live telemetry, victory resolution +15 XP).
 * 2. Daily Cambridge World Boss Raid Engine (7 daily rotating archetypes, 50k HP pool, damage formula, +20 XP raid milestone).
 * 3. Resilient Offline Queue & Network Recovery Engine (FIFO queue, localStorage persistence, auto-flush).
 * 4. UI Components & Modal integration (ArenaGhostDuelBar, ArenaWorldBossCard, Summary Modal, Step 125 signature preservation).
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  createGhostDuel,
  getActiveGhostDuel,
  clearActiveGhostDuel,
  evaluateGhostDuelProgress,
  resolveGhostDuelResult,
  GHOST_DUEL_BONUS_XP
} from '../src/services/gamification/ghostDuelService.js';

import {
  DAILY_WORLD_BOSSES,
  WORLD_BOSS_MAX_HP,
  WORLD_BOSS_RAID_BONUS_XP,
  WORLD_BOSS_QUALIFYING_DAMAGE,
  getDailyWorldBoss,
  dealWorldBossDamage,
  resetWorldBossForTesting
} from '../src/services/gamification/worldBossRaidService.js';

import {
  enqueueOfflinePayload,
  getOfflineQueue,
  clearOfflineQueue,
  flushOfflineQueue
} from '../src/services/gamification/offlineQueueService.js';

import {
  startSprintAction,
  finishSprintAction
} from '../src/hooks/useArenaSprintEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function it(desc, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

async function itAsync(desc, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('Testing Step 165: Arena Ghost Duel, World Boss Raid, and Resilient Offline Queue ...');

// --- 1. Ghost Duel Engine ---
it('1. createGhostDuel generates deterministic checkpoints and persists active session', () => {
  clearActiveGhostDuel();
  const rival = {
    display_name: 'Minh Anh 8.0',
    avatar_url: 'https://example.com/avatar.png',
    weekly_xp: 1200
  };

  const duel = createGhostDuel(rival);
  assert.ok(duel, 'Duel object must be generated');
  assert.strictEqual(duel.rivalName, 'Minh Anh 8.0');
  assert.strictEqual(duel.rivalAvatar, 'https://example.com/avatar.png');
  assert.strictEqual(duel.totalQuestions, 7);
  assert.strictEqual(duel.checkpoints.length, 7);
  assert.ok(duel.targetScore >= 5 && duel.targetScore <= 6, 'Target score should be 5 or 6');
  assert.ok(duel.totalGhostTime > 0, 'Total ghost time must be positive');

  // Verify retrieval from storage
  const active = getActiveGhostDuel();
  assert.ok(active, 'Active ghost duel must be retrievable from storage');
  assert.strictEqual(active.id, duel.id);
});

it('2. evaluateGhostDuelProgress calculates accurate pacing telemetry based on elapsed seconds', () => {
  const mockDuel = {
    totalQuestions: 7,
    targetScore: 5,
    checkpoints: [
      { questionIndex: 0, timestampSeconds: 15, isCorrect: true },
      { questionIndex: 1, timestampSeconds: 30, isCorrect: true },
      { questionIndex: 2, timestampSeconds: 45, isCorrect: false },
      { questionIndex: 3, timestampSeconds: 60, isCorrect: true },
      { questionIndex: 4, timestampSeconds: 75, isCorrect: true },
      { questionIndex: 5, timestampSeconds: 90, isCorrect: true },
      { questionIndex: 6, timestampSeconds: 105, isCorrect: false }
    ]
  };

  // At 0s, ghost has answered 0 questions
  const progress0 = evaluateGhostDuelProgress(mockDuel, 0);
  assert.strictEqual(progress0.ghostScore, 0);
  assert.strictEqual(progress0.ghostProgressPercent, 0);
  assert.strictEqual(progress0.isGhostFinished, false);

  // At 35s, ghost passed checkpoint 0 (15s) and 1 (30s), score = 2
  const progress35 = evaluateGhostDuelProgress(mockDuel, 35);
  assert.strictEqual(progress35.ghostScore, 2);
  assert.strictEqual(progress35.ghostQuestionIndex, 2);
  assert.strictEqual(progress35.ghostProgressPercent, 29); // 2/7 ~ 29%

  // At 120s, ghost finished all checkpoints
  const progress120 = evaluateGhostDuelProgress(mockDuel, 120);
  assert.strictEqual(progress120.ghostScore, 5);
  assert.strictEqual(progress120.isGhostFinished, true);
  assert.strictEqual(progress120.ghostProgressPercent, 100);
});

it('3. resolveGhostDuelResult determines victory, awards +15 XP, and clears active duel', () => {
  const mockDuel = {
    rivalName: 'Kenji Sato',
    rivalAvatar: 'https://example.com/kenji.png',
    totalQuestions: 7,
    targetScore: 5,
    totalGhostTime: 90
  };

  // Case A: User has higher score (6 vs 5) -> Victory
  const victoryResult = resolveGhostDuelResult({
    userScore: 6,
    totalQuestions: 7,
    userTimeSpent: 100,
    duel: mockDuel
  });
  assert.ok(victoryResult.isVictory, 'Higher score must be a victory');
  assert.strictEqual(victoryResult.bonusXp, GHOST_DUEL_BONUS_XP);
  assert.strictEqual(victoryResult.rivalName, 'Kenji Sato');

  // Case B: User has equal score (5 vs 5) but faster time (80s vs 90s) -> Victory
  const tiebreakWin = resolveGhostDuelResult({
    userScore: 5,
    totalQuestions: 7,
    userTimeSpent: 80,
    duel: mockDuel
  });
  assert.ok(tiebreakWin.isVictory, 'Equal score with faster time must be a victory');
  assert.strictEqual(tiebreakWin.bonusXp, GHOST_DUEL_BONUS_XP);

  // Case C: User has lower score (4 vs 5) -> Defeat
  const defeatResult = resolveGhostDuelResult({
    userScore: 4,
    totalQuestions: 7,
    userTimeSpent: 60,
    duel: mockDuel
  });
  assert.strictEqual(defeatResult.isVictory, false, 'Lower score must be defeat');
  assert.strictEqual(defeatResult.bonusXp, 0);

  // Storage should be cleared
  assert.strictEqual(getActiveGhostDuel(), null, 'Active ghost duel must be cleared after resolution');
});

// --- 2. World Boss Raid Engine ---
it('4. DAILY_WORLD_BOSSES defines 7 rotating archetypes covering all days of week', () => {
  assert.strictEqual(DAILY_WORLD_BOSSES.length, 7);
  for (let d = 0; d < 7; d++) {
    const boss = DAILY_WORLD_BOSSES.find(b => b.dayIndex === d);
    assert.ok(boss, `Boss for day index ${d} must exist`);
    assert.ok(boss.nameVi, 'Vietnamese name required');
    assert.ok(boss.nameEn, 'English name required');
    assert.ok(boss.weakness, 'Boss weakness required');
    assert.ok(boss.icon, 'Boss icon required');
  }
});

it('5. getDailyWorldBoss initializes today\'s boss with 50,000 HP and tracks damage', () => {
  resetWorldBossForTesting();
  const boss = getDailyWorldBoss();
  assert.ok(boss, 'Daily world boss must be initialized');
  assert.strictEqual(boss.currentHp, WORLD_BOSS_MAX_HP);
  assert.strictEqual(boss.maxHp, WORLD_BOSS_MAX_HP);
  assert.strictEqual(boss.playerDamageDealt, 0);
  assert.strictEqual(boss.playerRaidClaimed, false);
});

it('6. dealWorldBossDamage calculates score/combo damage and awards +20 XP milestone at 400 dmg', () => {
  resetWorldBossForTesting();
  // Deal 3 correct answers, combo 2 -> (3 * 120) + (2 * 30) = 420 dmg >= 400 qualifying threshold
  const result = dealWorldBossDamage({
    score: 3,
    combo: 2,
    isBossCleared: false
  });

  assert.strictEqual(result.damageDealt, 420);
  assert.strictEqual(result.totalPlayerDamage, 420);
  assert.strictEqual(result.bonusXp, WORLD_BOSS_RAID_BONUS_XP, 'Milestone reward of +20 XP must be awarded');
  assert.strictEqual(result.currentHp, WORLD_BOSS_MAX_HP - 420);

  // Subsequent sprint in same day shouldn't re-award milestone bonus
  const secondResult = dealWorldBossDamage({
    score: 2,
    combo: 1,
    isBossCleared: true // (2 * 120) + (1 * 30) + 250 = 520
  });
  assert.strictEqual(secondResult.damageDealt, 520);
  assert.strictEqual(secondResult.totalPlayerDamage, 940);
  assert.strictEqual(secondResult.bonusXp, 0, 'Bonus XP must not be double claimed in the same day');
});

// --- 3. Offline Queue Service ---
await itAsync('7. offlineQueueService handles enqueue, persistence, and FIFO flush', async () => {
  clearOfflineQueue();
  assert.strictEqual(getOfflineQueue().length, 0);

  // Enqueue 2 payloads
  enqueueOfflinePayload('SPRINT_SUBMISSION', { score: 7, finalXp: 180 });
  enqueueOfflinePayload('BOSS_DAMAGE', { damage: 500, bossId: 'cambridge_overlord' });

  const queue = getOfflineQueue();
  assert.strictEqual(queue.length, 2);
  assert.strictEqual(queue[0].type, 'SPRINT_SUBMISSION');
  assert.strictEqual(queue[1].type, 'BOSS_DAMAGE');

  // Test flush with mock dispatcher
  const syncedItems = [];
  const flushResult = await flushOfflineQueue(null, async (item) => {
    syncedItems.push(item);
  });

  assert.strictEqual(flushResult.successCount, 2);
  assert.strictEqual(flushResult.remainingCount, 0);
  assert.strictEqual(syncedItems.length, 2);
  assert.strictEqual(getOfflineQueue().length, 0, 'Queue must be empty after successful flush');
});

// --- 4. useArenaSprintEngine Integration ---
it('8. useArenaSprintEngine startSprintAction and finishSprintAction seamlessly incorporate Ghost Duel and Boss Raid', () => {
  resetWorldBossForTesting();
  clearActiveGhostDuel();

  // Create a duel
  const duel = createGhostDuel({ display_name: 'Elena Rostova 8.5' });
  const mockQuestions = [
    { id: 'q1', correctIndex: 0, options: ['A', 'B'], correctAnswer: 'A' },
    { id: 'q2', correctIndex: 0, options: ['A', 'B'], correctAnswer: 'A' }
  ];

  const state = startSprintAction(mockQuestions, 180, 'medium');
  assert.ok(state.activeGhostDuel, 'startSprintAction must capture active ghost duel');

  // Finish sprint with score 2
  const finishedState = finishSprintAction({
    ...state,
    score: 2,
    maxCombo: 2,
    timeRemaining: 120, // 60s spent
    isBossCleared: true,
    questions: mockQuestions
  });

  assert.ok(finishedState.summary, 'Summary must exist');
  assert.ok(finishedState.summary.worldBossDamage, 'Summary must record world boss damage');
  assert.ok(finishedState.summary.worldBossDamage.damageDealt > 0, 'Boss damage must be positive');
  assert.ok(finishedState.summary.ghostDuelResult, 'Summary must record ghost duel result');
});

// --- 5. UI Codebase Signatures and test_step125 Preservation ---
it('9. AtlasEnglishArenaModal preserves test_step125 regex signatures and mounts components', () => {
  const modalPath = path.join(rootDir, 'src/components/arena/AtlasEnglishArenaModal.jsx');
  const code = fs.readFileSync(modalPath, 'utf-8');

  // Must import ArenaWorldBossCard and ArenaGhostDuelBar
  assert.ok(code.includes('ArenaWorldBossCard'), 'AtlasEnglishArenaModal must import and mount ArenaWorldBossCard');
  assert.ok(code.includes('ArenaGhostDuelBar'), 'AtlasEnglishArenaModal must import and mount ArenaGhostDuelBar');
  assert.ok(code.includes('initOfflineQueueAutoSync'), 'Must initialize offline queue sync');

  // Preserved test_step125 regex checks:
  const startBtnMatch = code.match(/onClick=\{\(\)\s*=>\s*\{[\s\S]*?sprint\.startSprint\(null,\s*selectedDifficulty\);/);
  assert(startBtnMatch, 'Start Sprint button handler must be found');
  assert(!startBtnMatch[0].includes('playChime()'), 'Start Sprint button handler must NOT call playChime()');

  const revengeBtnMatch = code.match(/onClick=\{\(\)\s*=>\s*\{[\s\S]*?sprint\.startSprint\(revengeQuestions,\s*selectedDifficulty\);/);
  assert(revengeBtnMatch, 'Revenge Sprint button handler must be found');
  assert(!revengeBtnMatch[0].includes('playChime()'), 'Revenge Sprint button handler must NOT call playChime()');

  const challengeMatch = code.match(/onChallengeSprint=\{\(\)\s*=>\s*\{[\s\S]*?sprint\.startSprint\(\);/);
  assert(challengeMatch, 'Challenge Sprint handler must be found');
  assert(!challengeMatch[0].includes('playChime()'), 'Challenge Sprint handler must NOT call playChime()');
});

it('10. ArenaSprintSummaryModal renders Ghost Duel victory/defeat and World Boss contribution cards', () => {
  const summaryPath = path.join(rootDir, 'src/components/arena/ArenaSprintSummaryModal.jsx');
  const code = fs.readFileSync(summaryPath, 'utf-8');

  assert.ok(code.includes('summary.ghostDuelResult'), 'ArenaSprintSummaryModal must render ghost duel outcome card');
  assert.ok(code.includes('summary.worldBossDamage'), 'ArenaSprintSummaryModal must render world boss raid card');
  assert.ok(code.includes('summary.ghostDuelResult?.bonusXp'), 'Must render duel bonus XP row in decomposition grid');
  assert.ok(code.includes('summary.worldBossDamage?.bonusXp'), 'Must render boss raid bonus XP row in decomposition grid');
});

it('11. ArenaWorldBossCard is interactive, opens ArenaWorldBossModal and supports 1-click sprint launch', () => {
  const cardPath = path.join(rootDir, 'src/components/arena/ArenaWorldBossCard.jsx');
  const cardCode = fs.readFileSync(cardPath, 'utf-8');
  assert.ok(cardCode.includes('ArenaWorldBossModal'), 'ArenaWorldBossCard must import and render ArenaWorldBossModal');
  assert.ok(cardCode.includes('onClick={() => setIsModalOpen(true)}'), 'Card must open modal on click');
  assert.ok(cardCode.includes('cursor-pointer'), 'Card must have cursor-pointer');

  const modalPath = path.join(rootDir, 'src/components/arena/ArenaWorldBossModal.jsx');
  const modalCode = fs.readFileSync(modalPath, 'utf-8');
  assert.ok(modalCode.includes('DAILY_WORLD_BOSSES'), 'Modal must reference 7 rotating world bosses');
  assert.ok(modalCode.includes('onStartSprint'), 'Modal must support onStartSprint callback');
});

console.log(`\nAll ${passedTests}/${totalTests} Step 165 checks passed successfully!`);
