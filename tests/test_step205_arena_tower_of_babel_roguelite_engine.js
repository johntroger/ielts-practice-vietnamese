/**
 * tests/test_step205_arena_tower_of_babel_roguelite_engine.js
 * 
 * Comprehensive Test Suite for Step 205:
 * The Cambridge Tower of Babel - Roguelite Expedition Engine
 * 
 * Verifies:
 * 1. Procedural 10-floor map generation with correct node progression.
 * 2. Expedition run initialization, default shields, gold, and timer.
 * 3. Relics catalog integrity, bilingual names, and rarity tiers.
 * 4. Relic picker random selection of 3 unique unowned artifacts.
 * 5. Turn-based Boss damage calculations with speed and warrior crest crits.
 * 6. Scholar Merchant shop consumables and prices.
 * 7. State persistence and retrieval across sessions.
 */

import assert from 'assert';
import {
  generateTowerFloorMap,
  startNewTowerRun,
  getActiveTowerRun,
  saveActiveTowerRun,
  generateThreeRandomRelics,
  calculateBossDamage,
  TOWER_NODE_TYPES,
  TOWER_RELICS_CATALOG,
  TOWER_CONSUMABLES_SHOP,
  TOWER_BOSS_ROSTER
} from '../src/services/gamification/towerOfBabelEngine.js';

console.log('🧪 Running Step 205: Tower of Babel Roguelite Engine Tests...\n');

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

// 1. Procedural Map Generation
it('1. generateTowerFloorMap creates exactly 10 floors with a climactic Floor 10 Boss', () => {
  const map = generateTowerFloorMap(1);
  assert.strictEqual(map.length, 10, 'Map must contain 10 floors');
  assert.strictEqual(map[0].floorNumber, 1);
  assert.strictEqual(map[0].type, TOWER_NODE_TYPES.BATTLE, 'Floor 1 must be a Warmup Battle');
  assert.strictEqual(map[9].floorNumber, 10);
  assert.strictEqual(map[9].type, TOWER_NODE_TYPES.BOSS, 'Floor 10 must be the Grand Boss');
  assert.ok(map[9].boss && map[9].boss.maxHp > 0, 'Floor 10 Boss must have an HP bar');
});

// 2. Node Distribution
it('2. Map contains diverse node types including Elite, Treasure, Campfire, and Shop', () => {
  const map = generateTowerFloorMap(1);
  const types = map.map(f => f.type);
  assert.ok(types.includes(TOWER_NODE_TYPES.ELITE), 'Map must include an Elite node');
  assert.ok(types.includes(TOWER_NODE_TYPES.TREASURE), 'Map must include a Treasure node');
  assert.ok(types.includes(TOWER_NODE_TYPES.CAMPFIRE), 'Map must include a Campfire node');
  assert.ok(types.includes(TOWER_NODE_TYPES.SHOP), 'Map must include a Shop node');
});

// 3. New Expedition Run Initialization
it('3. startNewTowerRun initializes starting resources (50 Gold, 5 Shields, 240s timer)', () => {
  const run = startNewTowerRun('medium');
  assert.ok(run.id && run.id.startsWith('tower-run-'));
  assert.strictEqual(run.currentFloorIndex, 0);
  assert.strictEqual(run.gold, 50, 'Starting Gold must be 50');
  assert.strictEqual(run.shields, 5, 'Starting Shields must be 5');
  assert.strictEqual(run.timeRemaining, 240, 'Starting timer must be 240 seconds');
  assert.strictEqual(run.floors.length, 10);
  assert.strictEqual(Array.isArray(run.relics), true);
});

// 4. Relics Catalog Integrity
it('4. TOWER_RELICS_CATALOG contains at least 10 relics with complete bilingual metadata and prices', () => {
  assert.ok(TOWER_RELICS_CATALOG.length >= 10, 'Must have at least 10 relics');
  TOWER_RELICS_CATALOG.forEach(relic => {
    assert.ok(relic.id && relic.id.startsWith('relic_'), `Invalid relic ID: ${relic.id}`);
    assert.ok(relic.nameVi && relic.nameEn, `Relic missing bilingual name: ${relic.id}`);
    assert.ok(relic.descVi && relic.descEn, `Relic missing bilingual desc: ${relic.id}`);
    assert.ok(['common', 'rare', 'legendary'].includes(relic.rarity), `Invalid rarity: ${relic.rarity}`);
    assert.ok(relic.price > 0, `Relic must have a positive price: ${relic.id}`);
  });
});

// 5. Relic Picker Generator
it('5. generateThreeRandomRelics returns 3 unique unowned relics', () => {
  const owned = ['relic_aegis_syntax', 'relic_chronos_hourglass'];
  const picks = generateThreeRandomRelics(owned);
  assert.strictEqual(picks.length, 3);
  picks.forEach(p => {
    assert.ok(!owned.includes(p.id), 'Picked relic must not already be owned');
  });
  const uniqueIds = new Set(picks.map(p => p.id));
  assert.strictEqual(uniqueIds.size, 3, 'All 3 picks must be distinct');
});

// 6. Boss Damage Calculation
it('6. calculateBossDamage awards speed bonus and Warrior Crest critical multiplier', () => {
  // Normal answer in 3 seconds, streak 1
  const normalDmg = calculateBossDamage({ isCorrect: true, secondsTaken: 3, combo: 1, relics: [] });
  assert.ok(normalDmg >= 100, 'Base damage must be >= 100');

  // Fast answer in 1.5 seconds (Speed bonus)
  const fastDmg = calculateBossDamage({ isCorrect: true, secondsTaken: 1.5, combo: 1, relics: [] });
  assert.ok(fastDmg > normalDmg, 'Fast answer must deal more damage');

  // With Warrior Crest (< 2.0s triggers x2 Crit)
  const critDmg = calculateBossDamage({
    isCorrect: true,
    secondsTaken: 1.5,
    combo: 1,
    relics: [{ id: 'relic_warrior_crest' }]
  });
  assert.strictEqual(critDmg, fastDmg * 2, 'Warrior Crest must double fast damage');

  // Incorrect answer deals 0 damage
  const zeroDmg = calculateBossDamage({ isCorrect: false, secondsTaken: 1, combo: 1, relics: [] });
  assert.strictEqual(zeroDmg, 0, 'Incorrect answer must deal 0 damage');
});

// 7. Shop Consumables Catalog
it('7. TOWER_CONSUMABLES_SHOP defines essential survival potions with costs', () => {
  assert.ok(TOWER_CONSUMABLES_SHOP.length >= 3);
  const healPotion = TOWER_CONSUMABLES_SHOP.find(p => p.effectType === 'heal_shield');
  assert.ok(healPotion, 'Must have a heal shield potion');
  assert.strictEqual(healPotion.effectValue, 2);
  assert.ok(healPotion.cost > 0);
});

// 8. State Persistence
it('8. saveActiveTowerRun and getActiveTowerRun accurately persist state', () => {
  const mockRun = { id: 'test-run-123', floor: 4, gold: 120 };
  saveActiveTowerRun(mockRun);
  const retrieved = getActiveTowerRun();
  assert.strictEqual(retrieved.id, 'test-run-123');
  assert.strictEqual(retrieved.gold, 120);

  saveActiveTowerRun(null);
  assert.strictEqual(getActiveTowerRun(), null);
});

console.log(`\n===============================================================`);
console.log(`🎉 All ${passedTests}/${totalTests} Step 205 tests passed cleanly!`);
console.log(`===============================================================\n`);
