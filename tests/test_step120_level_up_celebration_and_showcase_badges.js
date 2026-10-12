/**
 * tests/test_step120_level_up_celebration_and_showcase_badges.js
 * 
 * Verification Test Suite for Step 120 (Phase 4):
 * Level-Up Celebration Fanfare Modal & Showcase Badges
 * Verifies:
 * 1. LevelUpCelebrationModal.jsx exists and has valid component structure
 * 2. Exact level-up trigger mathematical detection logic
 * 3. Atlas Titan tier reward and privilege announcement mapping
 * 4. Showcase Badges gallery logic (Streak Master, Sharpshooter, Master Architect)
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { calculateLevelFromXp, getLevelTierInfo } from '../src/services/gamification/levelEngine.js';

let passed = 0;
let total = 0;

function it(desc, fn) {
  total++;
  try {
    fn();
    passed++;
  } catch (err) {
    console.error(`❌ Failed: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('🧪 Running Step 120 Test Suite: Level-Up Celebration & Showcase Badges...');

// 1. Component File Existence & Exports
it('1. LevelUpCelebrationModal.jsx exists and has valid React component structure', () => {
  const filePath = path.resolve('src/components/arena/LevelUpCelebrationModal.jsx');
  assert.ok(fs.existsSync(filePath), 'LevelUpCelebrationModal.jsx must exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert.ok(content.includes('export default function LevelUpCelebrationModal'), 'Must export default component');
  assert.ok(content.includes('newLevel'), 'Must display newLevel');
  assert.ok(content.includes('onContinue'), 'Must support onContinue callback');
});

// 2. Exact Level-Up Trigger Mathematical Detection Logic
it('2. Level-up trigger accurately detects level increments based on XP delta', () => {
  // Scenario A: 0 XP to 100 XP -> Level 1 to Level 2 (Should trigger)
  const oldXpA = 0;
  const deltaA = 100;
  const oldLevelA = calculateLevelFromXp(oldXpA);
  const newLevelA = calculateLevelFromXp(oldXpA + deltaA);
  assert.strictEqual(oldLevelA, 1);
  assert.strictEqual(newLevelA, 2);
  assert.strictEqual(newLevelA > oldLevelA, true, 'Must trigger level up from Lv.1 to Lv.2');

  // Scenario B: 9100 XP to 9400 XP -> Level 20 to Level 20 (Should NOT trigger)
  const oldXpB = 9100;
  const deltaB = 300;
  const oldLevelB = calculateLevelFromXp(oldXpB);
  const newLevelB = calculateLevelFromXp(oldXpB + deltaB);
  assert.strictEqual(oldLevelB, 20);
  assert.strictEqual(newLevelB, 20);
  assert.strictEqual(newLevelB > oldLevelB, false, 'Must NOT trigger level up within same level');

  // Scenario C: 9400 XP to 10050 XP -> Level 20 to Level 21 (Should trigger)
  const oldXpC = 9400;
  const deltaC = 650;
  const oldLevelC = calculateLevelFromXp(oldXpC);
  const newLevelC = calculateLevelFromXp(oldXpC + deltaC);
  assert.strictEqual(oldLevelC, 20);
  assert.strictEqual(newLevelC, 21);
  assert.strictEqual(newLevelC > oldLevelC, true, 'Must trigger level up when surpassing 10000 XP');
});

// 3. Atlas Titan Tier Reward Announcement Mapping
it('3. getLevelTierInfo maps celebration tier metadata correctly for Level 21', () => {
  const tier = getLevelTierInfo(21);
  assert.strictEqual(tier.id, 'gladiator');
  assert.strictEqual(tier.titleEn, 'Atlas Gladiator');
  assert.ok(tier.ringColor.includes('emerald'));
});

// 4. Showcase Badges Verification in PublicLearnerProfileModal.jsx
it('4. PublicLearnerProfileModal.jsx includes the 3 Showcase Badges', () => {
  const profilePath = path.resolve('src/components/arena/PublicLearnerProfileModal.jsx');
  const profileContent = fs.readFileSync(profilePath, 'utf-8');
  assert.ok(profileContent.includes('Chuỗi Bất Bại'), 'Must include Streak Master badge');
  assert.ok(profileContent.includes('Xạ Thủ Phản Xạ'), 'Must include Sharpshooter badge');
  assert.ok(profileContent.includes('Đại Sư Kiến Tạo'), 'Must include Master Contributor badge');
});

console.log(`\n🎉 All ${passed}/${total} unit tests passed for Step 120! (100%)\n`);
