/**
 * tests/test_step166_atlas_streak_shield_and_daily_sprints.js
 * 
 * Verifies Phase 1 of Atlas Gamification (Duolingo Mechanics + Atlas Terminology):
 * 1. Atlas Streak Shield (Aegis): Initialization, capacity cap (max 2), day difference calculation, consumption.
 * 2. Atlas Daily Sprints Engine: Daily generation, progress recording, completion checks, Knowledge Vault claim.
 * 3. Atlas UI Integration: AtlasDailySprintCard render checks, Header streak shield indicator.
 * 4. Harmonic Audio: Combo pitch scaling implementation in audioHelper and useArenaAudio.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  getStreakShieldData,
  saveStreakShieldData,
  addStreakShield,
  evaluateStreakProtection,
  MAX_STREAK_SHIELDS
} from '../src/services/gamification/atlasStreakShieldService.js';

import {
  getDailySprintsData,
  recordDailyQuestProgress,
  isDailySprintsAllCompleted,
  claimAtlasKnowledgeVault,
  QUEST_TYPES
} from '../src/services/gamification/atlasDailyQuestService.js';

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

console.log('Testing Step 166: Atlas Streak Shield, Daily Sprints & Harmonic Audio ...');

// --- 1. Atlas Streak Shield Engine ---
it('1. Streak Shield initializes with default 1 shield and respects MAX_STREAK_SHIELDS cap', () => {
  saveStreakShieldData(null);
  const data = getStreakShieldData();
  assert.ok(data.shieldsRemaining >= 1, 'Learner starts with at least 1 shield');

  // Add 5 shields -> should be capped at MAX_STREAK_SHIELDS (2)
  const capped = addStreakShield(5);
  assert.strictEqual(capped, MAX_STREAK_SHIELDS);
  assert.strictEqual(getStreakShieldData().shieldsRemaining, MAX_STREAK_SHIELDS);
});

it('2. evaluateStreakProtection leaves healthy streak untouched when active today or yesterday', () => {
  saveStreakShieldData({ shieldsRemaining: 2, lastShieldUsedDate: null, shieldHistory: [] });
  
  // Case A: Active today (diffDays = 0)
  const resToday = evaluateStreakProtection({ lastActiveDate: '2026-10-24', todayDate: '2026-10-24' });
  assert.strictEqual(resToday.wasProtected, false);
  assert.strictEqual(resToday.reason, 'streak_active');
  assert.strictEqual(resToday.shieldsRemaining, 2);

  // Case B: Active yesterday (diffDays = 1)
  const resYest = evaluateStreakProtection({ lastActiveDate: '2026-10-23', todayDate: '2026-10-24' });
  assert.strictEqual(resYest.wasProtected, false);
  assert.strictEqual(resYest.reason, 'streak_active');
  assert.strictEqual(resYest.shieldsRemaining, 2);
});

it('3. evaluateStreakProtection consumes 1 shield when exactly 1 day missed (diffDays = 2)', () => {
  saveStreakShieldData({ shieldsRemaining: 2, lastShieldUsedDate: null, shieldHistory: [] });
  
  // Missed Oct 23rd -> last active was Oct 22nd, today is Oct 24th
  const res = evaluateStreakProtection({ lastActiveDate: '2026-10-22', todayDate: '2026-10-24' });
  assert.strictEqual(res.wasProtected, true);
  assert.strictEqual(res.reason, 'shield_consumed');
  assert.strictEqual(res.shieldsRemaining, 1);

  const updatedData = getStreakShieldData();
  assert.strictEqual(updatedData.shieldsRemaining, 1);
  assert.strictEqual(updatedData.lastShieldUsedDate, '2026-10-24');
  assert.strictEqual(updatedData.shieldHistory.length, 1);
});

it('4. evaluateStreakProtection does not protect if user missed more than 1 day or has 0 shields', () => {
  // Case A: 0 shields
  saveStreakShieldData({ shieldsRemaining: 0, lastShieldUsedDate: null, shieldHistory: [] });
  const resZero = evaluateStreakProtection({ lastActiveDate: '2026-10-22', todayDate: '2026-10-24' });
  assert.strictEqual(resZero.wasProtected, false);
  assert.strictEqual(resZero.reason, 'no_shields_left');

  // Case B: Missed 3 days
  saveStreakShieldData({ shieldsRemaining: 2, lastShieldUsedDate: null, shieldHistory: [] });
  const resTooMany = evaluateStreakProtection({ lastActiveDate: '2026-10-20', todayDate: '2026-10-24' });
  assert.strictEqual(resTooMany.wasProtected, false);
  assert.strictEqual(resTooMany.reason, 'too_many_days_missed');
});

// --- 2. Atlas Daily Sprints Engine ---
it('5. getDailySprintsData generates 3 distinct daily objectives for today', () => {
  const data = getDailySprintsData('2026-10-24');
  assert.ok(data);
  assert.strictEqual(data.date, '2026-10-24');
  assert.strictEqual(data.quests.length, 3);
  assert.strictEqual(data.isVaultClaimed, false);
  
  const types = data.quests.map(q => q.type);
  assert.ok(types.includes(QUEST_TYPES.COMPLETE_SPRINT));
  assert.ok(types.includes(QUEST_TYPES.AUDIO_BLITZ_ACCURACY));
  assert.ok(types.includes(QUEST_TYPES.DEAL_BOSS_DAMAGE));
});

it('6. recordDailyQuestProgress updates task progress and flags completion', () => {
  getDailySprintsData('2026-10-24');
  
  // Complete sprint quest (target = 1)
  const { data: updated1, newlyCompleted } = recordDailyQuestProgress(QUEST_TYPES.COMPLETE_SPRINT, 1);
  const sprintQuest = updated1.quests.find(q => q.type === QUEST_TYPES.COMPLETE_SPRINT);
  assert.strictEqual(sprintQuest.current, 1);
  assert.strictEqual(sprintQuest.isCompleted, true);
  assert.strictEqual(newlyCompleted.length, 1);

  // Partial progress on boss damage (target = 300)
  const { data: updated2 } = recordDailyQuestProgress(QUEST_TYPES.DEAL_BOSS_DAMAGE, 150);
  const bossQuest = updated2.quests.find(q => q.type === QUEST_TYPES.DEAL_BOSS_DAMAGE);
  assert.strictEqual(bossQuest.current, 150);
  assert.strictEqual(bossQuest.isCompleted, false);
});

it('7. claimAtlasKnowledgeVault awards bonus XP and prevents double claiming', () => {
  // Complete remaining 2 quests
  recordDailyQuestProgress(QUEST_TYPES.AUDIO_BLITZ_ACCURACY, 5);
  recordDailyQuestProgress(QUEST_TYPES.DEAL_BOSS_DAMAGE, 150);

  assert.strictEqual(isDailySprintsAllCompleted(), true);

  const claimResult = claimAtlasKnowledgeVault();
  assert.strictEqual(claimResult.success, true);
  assert.ok(claimResult.reward.bonusXp >= 100);

  // Try claiming again on same day
  const secondClaim = claimAtlasKnowledgeVault();
  assert.strictEqual(secondClaim.success, false);
  assert.strictEqual(secondClaim.message, 'already_claimed');
});

// --- 3. UI Component & Invariant Checks ---
it('8. AtlasEnglishArenaModal mounts AtlasDailySprintCard and preserves step 125/153 signatures', () => {
  const modalPath = path.join(rootDir, 'src/components/arena/AtlasEnglishArenaModal.jsx');
  const code = fs.readFileSync(modalPath, 'utf-8');

  assert.ok(code.includes('AtlasDailySprintCard'), 'Must import and mount AtlasDailySprintCard');
  assert.ok(code.includes('streakShieldState?.shieldsRemaining > 0'), 'Must render streak shield counter in header');
  assert.ok(code.includes('evaluateStreakProtection'), 'Must evaluate streak protection on open');

  // Verify Step 125 & 153 signatures:
  const startBtnMatch = code.match(/onClick=\{\(\)\s*=>\s*\{[\s\S]*?sprint\.startSprint\(null,\s*selectedDifficulty\);/);
  assert(startBtnMatch, 'Start Sprint button handler must be found');
  assert(!startBtnMatch[0].includes('playChime()'), 'Start Sprint button handler must NOT call playChime()');
  assert.ok(
    code.includes('py-2 sm:py-3 md:py-4 flex flex-col justify-start lg:justify-center min-h-0') ||
    code.includes('py-2 sm:py-3 md:py-4 flex flex-col justify-center min-h-0'),
    'Must preserve step 153 viewport lock'
  );
});

it('9. audioHelper and useArenaAudio support dynamic combo pitch scaling', () => {
  const audioHelperPath = path.join(rootDir, 'src/utils/audioHelper.js');
  const code = fs.readFileSync(audioHelperPath, 'utf-8');
  assert.ok(code.includes('comboScale'), 'audioHelper must define harmonic combo scale');
  assert.ok(code.includes('comboCount'), 'playArenaSfx must take comboCount parameter');

  const useAudioPath = path.join(rootDir, 'src/hooks/useArenaAudio.js');
  const useAudioCode = fs.readFileSync(useAudioPath, 'utf-8');
  assert.ok(useAudioCode.includes('playArenaSfx(type, comboCount)'), 'useArenaAudio must forward comboCount to playArenaSfx');
});

console.log(`\nAll ${passedTests}/${totalTests} Step 166 checks passed cleanly (100%)!\n`);
