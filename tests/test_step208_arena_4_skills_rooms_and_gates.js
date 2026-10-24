/**
 * tests/test_step208_arena_4_skills_rooms_and_gates.js
 * 
 * Comprehensive Test Suite for Step 208:
 * Atlas English Arena - 4 Skill Realms (4 Rooms) & Gate Progression System
 * 
 * Verifies:
 * 1. 4 Distinct Realms (Listening, Reading, Writing, Speaking) with authentic IELTS mapping.
 * 2. 16 Curated Gates with CEFR difficulty and Base XP pedagogical scaling.
 * 3. Sequential Gate Unlocking (Gate 1 -> Gate 2 upon achieving >= 1 Star).
 * 4. Star Mastery Calculation (1-Star 60%, 2-Star 80%, 3-Star 100%).
 * 5. XP Calculation with Speed Bonus, Accuracy, and Sprint Surge multiplier.
 * 6. Question Bank Coverage: Every single Gate retrieves at least 5 valid questions.
 * 7. UI Integration in AtlasEnglishArenaModal, ArenaSkillRealmsHub, and i18n locales.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {
  SKILL_REALMS,
  SKILL_REALM_IDS,
  createInitialSkillRealmsProgress,
  isGateUnlocked,
  getGateStars,
  getRealmStats,
  getAllRealmsOverallStats,
  calculateGateXp,
  evaluateGateResult,
  getQuestionsForGate
} from '../src/services/gamification/skillRealmsEngine.js';

console.log('🧪 Running Step 208: 4 Skill Realms & Gate Progression Tests...\n');

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

// 1. Structure of 4 Realms
it('1. SKILL_REALMS defines exactly 4 distinct IELTS realms with guardians and metadata', () => {
  assert.strictEqual(SKILL_REALMS.length, 4, 'Must have exactly 4 realms');
  const realmIds = SKILL_REALMS.map(r => r.id);
  assert.ok(realmIds.includes('listening'), 'Must include listening');
  assert.ok(realmIds.includes('reading'), 'Must include reading');
  assert.ok(realmIds.includes('writing'), 'Must include writing');
  assert.ok(realmIds.includes('speaking'), 'Must include speaking');

  SKILL_REALMS.forEach(realm => {
    assert.ok(realm.nameVi && realm.nameEn, `Realm ${realm.id} must have bilingual name`);
    assert.ok(realm.icon, `Realm ${realm.id} must have an icon`);
    assert.ok(realm.guardian && realm.guardian.nameEn, `Realm ${realm.id} must have a Guardian`);
    assert.ok(Array.isArray(realm.gates) && realm.gates.length >= 3, `Realm ${realm.id} must have at least 3 gates`);
  });
});

// 2. 16 Curated Gates Count
it('2. 16 Gates map accurately across Listening (4), Reading (3), Writing (5), Speaking (4)', () => {
  const listening = SKILL_REALMS.find(r => r.id === 'listening');
  const reading = SKILL_REALMS.find(r => r.id === 'reading');
  const writing = SKILL_REALMS.find(r => r.id === 'writing');
  const speaking = SKILL_REALMS.find(r => r.id === 'speaking');

  assert.strictEqual(listening.gates.length, 4, 'Listening must have 4 gates (Part 1 - 4)');
  assert.strictEqual(reading.gates.length, 3, 'Reading must have 3 gates (Passage 1 - 3)');
  assert.strictEqual(writing.gates.length, 5, 'Writing must have 5 gates (Task 1 Process/Maps/Trends, Task 2 Coherence/Lexis)');
  assert.strictEqual(speaking.gates.length, 4, 'Speaking must have 4 gates (Part 1 - 3 & Pronunciation)');

  const totalGates = listening.gates.length + reading.gates.length + writing.gates.length + speaking.gates.length;
  assert.strictEqual(totalGates, 16, 'Total gates must be 16');
});

// 3. Base XP Pedagogical Scaling
it('3. Base XP scales proportionally with IELTS difficulty (Easy: 15-20 XP -> Nightmare: 50-55 XP)', () => {
  const listening = SKILL_REALMS.find(r => r.id === 'listening');
  const writing = SKILL_REALMS.find(r => r.id === 'writing');

  const lisPart1 = listening.gates.find(g => g.gateNumber === 1);
  const lisPart4 = listening.gates.find(g => g.gateNumber === 4);
  const wriLexis = writing.gates.find(g => g.gateNumber === 5);

  assert.strictEqual(lisPart1.baseXp, 15, 'Listening Part 1 Base XP must be 15');
  assert.strictEqual(lisPart4.baseXp, 50, 'Listening Part 4 Base XP must be 50');
  assert.strictEqual(wriLexis.baseXp, 55, 'Writing Task 2 C1/C2 Lexis Base XP must be 55');
  assert.ok(lisPart4.baseXp > lisPart1.baseXp, 'Advanced gates must award higher Base XP');
});

// 4. Sequential Gate Unlocking
it('4. Sequential Gate Unlocking requires >= 1 Star on previous gate', () => {
  const progress = createInitialSkillRealmsProgress();

  // Initially: Gate 1 is unlocked, Gate 2 is locked
  assert.strictEqual(isGateUnlocked(progress, 'listening', 'gate_lis_1'), true, 'Gate 1 must be unlocked by default');
  assert.strictEqual(isGateUnlocked(progress, 'listening', 'gate_lis_2'), false, 'Gate 2 must be locked initially');

  // Award 1 star to Gate 1
  progress.gates['gate_lis_1'].stars = 1;
  assert.strictEqual(isGateUnlocked(progress, 'listening', 'gate_lis_2'), true, 'Gate 2 must unlock after 1 star on Gate 1');
  assert.strictEqual(isGateUnlocked(progress, 'listening', 'gate_lis_3'), false, 'Gate 3 must still be locked');

  // Award 2 stars to Gate 2
  progress.gates['gate_lis_2'].stars = 2;
  assert.strictEqual(isGateUnlocked(progress, 'listening', 'gate_lis_3'), true, 'Gate 3 must unlock after passing Gate 2');
});

// 5. Star Rating Evaluation
it('5. evaluateGateResult computes correct star awards (3 Stars 100%, 2 Stars 80%, 1 Star 60%)', () => {
  // Test 5/5 correct -> 3 Stars
  const res3 = evaluateGateResult({
    realmId: 'listening',
    gateId: 'gate_lis_1',
    score: 5,
    totalQuestions: 5,
    timeRemainingSeconds: 25
  });
  assert.strictEqual(res3.starsAwarded, 3, '5/5 must award 3 stars');
  assert.strictEqual(res3.isPassed, true);
  assert.ok(res3.finalXp > 0);

  // Test 4/5 correct -> 2 Stars
  const res2 = evaluateGateResult({
    realmId: 'listening',
    gateId: 'gate_lis_1',
    score: 4,
    totalQuestions: 5,
    timeRemainingSeconds: 15
  });
  assert.strictEqual(res2.starsAwarded, 2, '4/5 must award 2 stars');
  assert.strictEqual(res2.isPassed, true);

  // Test 3/5 correct -> 1 Star
  const res1 = evaluateGateResult({
    realmId: 'listening',
    gateId: 'gate_lis_1',
    score: 3,
    totalQuestions: 5,
    timeRemainingSeconds: 10
  });
  assert.strictEqual(res1.starsAwarded, 1, '3/5 must award 1 star');
  assert.strictEqual(res1.isPassed, true);

  // Test 2/5 correct -> 0 Stars
  const res0 = evaluateGateResult({
    realmId: 'listening',
    gateId: 'gate_lis_1',
    score: 2,
    totalQuestions: 5,
    timeRemainingSeconds: 5
  });
  assert.strictEqual(res0.starsAwarded, 0, '2/5 must award 0 stars');
  assert.strictEqual(res0.isPassed, false);

  // Test Guardian trial evaluation
  const resGuardian = evaluateGateResult({
    realmId: 'listening',
    gateId: 'guardian_listening',
    score: 5,
    totalQuestions: 5,
    timeRemainingSeconds: 22
  });
  assert.strictEqual(resGuardian.isGuardianTrial, true, 'Must identify guardian trial');
  assert.strictEqual(resGuardian.isGuardianDefeated, true, 'Must mark guardian as defeated on passing');
  assert.strictEqual(resGuardian.starsAwarded, 3);
  assert.ok(resGuardian.finalXp > 50, 'Guardian awards major XP');
});

// 6. XP Multipliers & Surge
it('6. calculateGateXp incorporates speed bonus and Sprint Surge x2 multiplier', () => {
  // Normal XP with slow time
  const normalXp = calculateGateXp({
    baseXp: 20,
    score: 3,
    totalQuestions: 5,
    timeRemainingSeconds: 5,
    isSurgeActive: false
  });

  // Fast XP (time >= 20s)
  const fastXp = calculateGateXp({
    baseXp: 20,
    score: 3,
    totalQuestions: 5,
    timeRemainingSeconds: 25,
    isSurgeActive: false
  });
  assert.ok(fastXp > normalXp, 'Fast completion must grant higher XP');

  // Surge XP
  const surgeXp = calculateGateXp({
    baseXp: 20,
    score: 3,
    totalQuestions: 5,
    timeRemainingSeconds: 5,
    isSurgeActive: true
  });
  assert.strictEqual(surgeXp, normalXp * 2, 'Surge must double final XP');
});

// 7. Question Bank Coverage for All 16 Gates
it('7. getQuestionsForGate supplies 5 questions for every single one of the 16 gates', () => {
  SKILL_REALMS.forEach(realm => {
    realm.gates.forEach(gate => {
      const questions = getQuestionsForGate(realm.id, gate.id, 5);
      assert.strictEqual(questions.length, 5, `Gate ${gate.id} must return 5 questions (got ${questions.length})`);
      questions.forEach(q => {
        assert.ok(q.id, `Question in ${gate.id} must have an id`);
        assert.ok(q.prompt || q.promptEn, `Question in ${gate.id} must have a prompt`);
        assert.ok(Array.isArray(q.options) || q.interactionType === 'text_input', `Question in ${gate.id} must have options or text input`);
      });
    });
  });
});

// 8. UI Integration & i18n
it('8. AtlasEnglishArenaModal, ArenaSkillRealmsHub, and i18n locales integrate 4 Skill Realms cleanly', () => {
  const modalCode = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
  assert.ok(modalCode.includes('ArenaSkillRealmsHub'), 'Must import and mount ArenaSkillRealmsHub');
  assert.ok(modalCode.includes('ArenaGateSummaryModal'), 'Must import and mount ArenaGateSummaryModal');
  assert.ok(modalCode.includes('handleEnterGate'), 'Must handle gate entry');
  assert.ok(modalCode.includes('arena.modeRealms'), 'Must include modeRealms in game switcher');

  const enCode = fs.readFileSync(path.resolve('src/i18n/locales/en.js'), 'utf-8');
  assert.ok(enCode.includes('modeRealms'), 'en.js must include modeRealms');

  const viCode = fs.readFileSync(path.resolve('src/i18n/locales/vi.js'), 'utf-8');
  assert.ok(viCode.includes('modeRealms'), 'vi.js must include modeRealms');
});

console.log(`\n===============================================================`);
console.log(`🎉 All ${passedTests}/${totalTests} Step 208 checks passed cleanly (100%)!`);
console.log(`===============================================================\n`);
