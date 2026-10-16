/**
 * tests/test_step164_arena_tactile_perks_and_visual_data_tasks.js
 * 
 * Verification suite for Phase 2:
 * 1. Tactical Perks & Boosters Service (tacticalPerksService.js).
 * 2. +1 Shield Passive (titan_armor) in shieldManager.js & useArenaSprintEngine.js.
 * 3. Active Time Freeze (+15s) (chronos_freeze) in activatePerkAction.
 * 4. Active Oracle Trap Eliminator (oracle_insight) eliminating 1 false distractor.
 * 5. Rapid Visual Data Questions (Village Map, Water Filtration, Clean Energy Chart, Quayside Blueprint).
 * 6. UI Integration in ArenaQuestionCard.jsx and AtlasEnglishArenaModal.jsx.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  ARENA_PERKS, 
  ARENA_PERK_LIST, 
  getPerkById 
} from '../src/services/gamification/tacticalPerksService.js';
import { createSprintShieldState, deductShield } from '../src/services/gamification/shieldManager.js';
import { 
  startSprintAction, 
  activatePerkAction, 
  nextQuestionAction,
  ARENA_SPRINT_PHASES 
} from '../src/hooks/useArenaSprintEngine.js';
import { ARENA_STORAGE_KEYS } from '../src/utils/arenaStorageKeys.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('\n--- Running Step 164: Arena Tactical Perks & Visual Data Decoder Tests ---');

// 1. Tactical Perks Configuration
it('1. Tactical Perks catalog defines standard perks with bilingual metadata', () => {
  assert.ok(ARENA_PERKS.NONE, 'NONE perk must exist');
  assert.ok(ARENA_PERKS.TITAN_ARMOR, 'TITAN_ARMOR must exist');
  assert.ok(ARENA_PERKS.CHRONOS_FREEZE, 'CHRONOS_FREEZE must exist');
  assert.ok(ARENA_PERKS.ORACLE_INSIGHT, 'ORACLE_INSIGHT must exist');

  assert.strictEqual(ARENA_PERK_LIST.length, 4, 'Must have 4 selectable perks');
  assert.strictEqual(getPerkById('titan_armor').nameEn, 'Titan Armor (+1 Shield)');
  assert.strictEqual(getPerkById('chronos_freeze').nameEn, 'Chronos Freeze (+15s)');
  assert.strictEqual(getPerkById('oracle_insight').nameEn, 'Oracle Trap Eliminator');
  assert.strictEqual(getPerkById('invalid_id').id, 'none', 'Must fallback to none');

  assert.strictEqual(ARENA_STORAGE_KEYS.EQUIPPED_PERK, 'ielts_arena_equipped_perk');
});

// 2. Titan Armor +1 Shield Passive
it('2. Titan Armor perk grants +1 extra shield at match start (6 shields total)', () => {
  const normalShields = createSprintShieldState(0);
  assert.strictEqual(normalShields.maxShields, 5);
  assert.strictEqual(normalShields.remainingShields, 5);

  const titanShields = createSprintShieldState(1);
  assert.strictEqual(titanShields.maxShields, 6);
  assert.strictEqual(titanShields.remainingShields, 6);

  const mockQuestions = [
    { id: 'q1', options: ['A', 'B', 'C', 'D'], correctIndex: 0 },
    { id: 'q2', options: ['A', 'B', 'C', 'D'], correctIndex: 1 }
  ];

  const stateWithoutPerk = startSprintAction(mockQuestions, 180, 'medium', { equippedPerk: 'none' });
  assert.strictEqual(stateWithoutPerk.shieldState.maxShields, 5);

  const stateWithTitan = startSprintAction(mockQuestions, 180, 'medium', { equippedPerk: 'titan_armor' });
  assert.strictEqual(stateWithTitan.shieldState.maxShields, 6);
  assert.strictEqual(stateWithTitan.shieldState.remainingShields, 6);
  assert.strictEqual(stateWithTitan.equippedPerk, 'titan_armor');
});

// 3. Chronos Freeze Active Booster (+15 seconds)
it('3. Chronos Freeze adds +15 seconds to match countdown and sets isPerkUsed', () => {
  const mockQuestions = [{ id: 'q1', options: ['A', 'B'], correctIndex: 0 }];
  const initialState = startSprintAction(mockQuestions, 180, 'medium', { equippedPerk: 'chronos_freeze' });
  initialState.timeRemaining = 80;

  // Activate booster
  const activatedState = activatePerkAction(initialState);
  assert.strictEqual(activatedState.timeRemaining, 95, 'Must add exactly +15s to timeRemaining');
  assert.strictEqual(activatedState.isPerkUsed, true, 'isPerkUsed must be true');

  // Second activation in same match must do nothing
  const secondAttempt = activatePerkAction(activatedState);
  assert.strictEqual(secondAttempt.timeRemaining, 95, 'Cannot reuse booster twice');
});

// 4. Oracle Insight Active Booster (Eliminates 1 False Distractor)
it('4. Oracle Insight eliminates 1 false distractor and resets on next question', () => {
  const mockQuestions = [
    { id: 'q1', options: ['Wrong1', 'Correct', 'Wrong2', 'Wrong3'], correctIndex: 1 },
    { id: 'q2', options: ['A', 'B', 'C', 'D'], correctIndex: 0 }
  ];
  const initialState = startSprintAction(mockQuestions, 180, 'medium', { equippedPerk: 'oracle_insight' });
  assert.deepStrictEqual(initialState.eliminatedOptions, []);

  // Activate Oracle Insight
  const withPerk = activatePerkAction(initialState);
  assert.strictEqual(withPerk.isPerkUsed, true);
  assert.strictEqual(withPerk.eliminatedOptions.length, 1);
  assert.notStrictEqual(withPerk.eliminatedOptions[0], 1, 'Eliminated option must NOT be the correct answer');

  // Next question must clear eliminatedOptions
  withPerk.phase = ARENA_SPRINT_PHASES.REVIEWING_ANSWER;
  const nextQState = nextQuestionAction(withPerk);
  assert.strictEqual(nextQState.currentIndex, 1);
  assert.deepStrictEqual(nextQState.eliminatedOptions, [], 'Must reset eliminatedOptions for next question');
});

// 5. Visual Data Decoder Micro-Tasks in Question Bank
it('5. Question Bank contains 4 authentic visual data tasks with responsive SVGs', () => {
  const mapQ = ARENA_QUESTION_BANK.find(q => q.id === 'visual_map_village_bypass_01');
  assert.ok(mapQ, 'visual_map_village_bypass_01 must exist');
  assert.strictEqual(mapQ.skillCategory, 'visual_data');
  assert.strictEqual(mapQ.media?.type, 'map');
  assert.ok(mapQ.media?.svg?.includes('Market Square'), 'SVG must include Market Square');

  const processQ = ARENA_QUESTION_BANK.find(q => q.id === 'visual_process_water_filtration_02');
  assert.ok(processQ, 'visual_process_water_filtration_02 must exist');
  assert.strictEqual(processQ.media?.type, 'diagram');
  assert.ok(processQ.media?.svg?.includes('Chlorination'), 'SVG must include Chlorination stage');

  const chartQ = ARENA_QUESTION_BANK.find(q => q.id === 'visual_chart_renewable_energy_03');
  assert.ok(chartQ, 'visual_chart_renewable_energy_03 must exist');
  assert.strictEqual(chartQ.media?.type, 'chart');
  assert.ok(chartQ.media?.svg?.includes('Solar PV'), 'SVG must include Solar PV');

  const harborQ = ARENA_QUESTION_BANK.find(q => q.id === 'visual_map_harbor_quayside_04');
  assert.ok(harborQ, 'visual_map_harbor_quayside_04 must exist');
  assert.strictEqual(harborQ.media?.type, 'map');
  assert.ok(harborQ.media?.svg?.includes('Old Customs House'), 'SVG must include Old Customs House');
});

// 6. UI Component Integration Audit
it('6. ArenaQuestionCard and AtlasEnglishArenaModal integrate Tactical Perks correctly', () => {
  const cardPath = path.resolve('src/components/arena/ArenaQuestionCard.jsx');
  const cardCode = fs.readFileSync(cardPath, 'utf-8');
  assert.ok(cardCode.includes('equippedPerk'), 'ArenaQuestionCard must accept equippedPerk');
  assert.ok(cardCode.includes('eliminatedOptions'), 'ArenaQuestionCard must handle eliminatedOptions');
  assert.ok(cardCode.includes('onActivatePerk'), 'ArenaQuestionCard must support onActivatePerk');
  assert.ok(cardCode.includes('getPerkById'), 'ArenaQuestionCard must use getPerkById');

  const modalPath = path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx');
  const modalCode = fs.readFileSync(modalPath, 'utf-8');
  assert.ok(modalCode.includes('ARENA_PERK_LIST'), 'AtlasEnglishArenaModal must use ARENA_PERK_LIST');
  assert.ok(modalCode.includes('selectedPerk'), 'AtlasEnglishArenaModal must have selectedPerk state');
  assert.ok(modalCode.includes('onActivatePerk={sprint.activatePerk}'), 'AtlasEnglishArenaModal must pass activatePerk');
});

console.log(`\nStep 164 Results: ${passedTests}/${totalTests} tests passed successfully.`);
