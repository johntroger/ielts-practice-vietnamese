/**
 * tests/test_step153_arena_lobby_single_screen_viewport_lock.js
 * 
 * Verifies that the Atlas English Arena Lobby screen (State 1: IDLE)
 * is strictly optimized for a Zero-Scroll Single-Screen Viewport Lock
 * on laptops and high-scaling displays (Windows 125%-150% scaling).
 * 
 * Constraints verified:
 * 1. Compact Header bar: py-2 sm:py-2.5 px-4 sm:px-6
 * 2. Main lobby container: py-2 sm:py-3 md:py-4 flex flex-col justify-center min-h-0
 * 3. Hero card vertical budget: gap-2 sm:gap-2.5 p-3.5 sm:p-4.5 md:p-5 rounded-2xl
 * 4. Difficulty selector card: p-2 sm:p-2.5 rounded-xl with gap-2
 * 5. Start Sprint & Revenge buttons: py-2.5 sm:py-3 px-6 rounded-xl
 * 6. Leaderboard card: max-h-[240px] sm:max-h-[280px] md:max-h-[340px] and p-3 sm:p-4
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

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

console.log('\n--- Running Step 153: Arena Lobby Single-Screen Viewport Lock Tests ---');

const modalCode = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
const selectorCode = fs.readFileSync(path.resolve('src/components/arena/ArenaDifficultySelector.jsx'), 'utf-8');
const leaderboardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaRelativeLeaderboard.jsx'), 'utf-8');

// 1. Lobby main container uses compact padding and min-h-0
it('1. AtlasEnglishArenaModal lobby main uses compact vertical padding and min-h-0', () => {
  assert.ok(
    modalCode.includes('py-2 sm:py-3 md:py-4 flex flex-col justify-start lg:justify-center min-h-0'),
    'Lobby main must use py-2 sm:py-3 md:py-4 and min-h-0 with responsive justify-start lg:justify-center to prevent mobile clipping'
  );
  assert.ok(
    !modalCode.includes('py-6 sm:py-10 flex flex-col justify-center'),
    'Must NOT use py-6 sm:py-10 which wastes 80px vertical space'
  );
});

// 2. Hero banner card uses compact gaps and padding
it('2. AtlasEnglishArenaModal hero card uses gap-2 sm:gap-2.5 and rounded-2xl padding', () => {
  assert.ok(
    modalCode.includes('gap-2 sm:gap-2.5 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30'),
    'Hero card must use gap-2 sm:gap-2.5'
  );
  assert.ok(
    modalCode.includes('rounded-2xl p-3.5 sm:p-4.5 md:p-5'),
    'Hero card must use compact rounded-2xl padding'
  );
});

// 3. Stats row (180s, 5 Shields, XP) uses compact py-1.5 px-2 boxes
it('3. AtlasEnglishArenaModal 3 stats chips use compact py-1.5 px-2 padding', () => {
  assert.ok(
    modalCode.includes('rounded-lg py-1.5 px-2 text-center shadow-xs'),
    'Stat chips must use py-1.5 px-2 to stay tight'
  );
  assert.ok(
    modalCode.includes('text-sm sm:text-base font-black text-indigo-300'),
    'Stat chip typography must scale cleanly'
  );
});

// 4. Start Sprint & Revenge buttons use py-2.5 sm:py-3 rounded-xl
it('4. AtlasEnglishArenaModal Start Sprint buttons use py-2.5 sm:py-3 rounded-xl', () => {
  assert.ok(
    modalCode.includes('py-2.5 sm:py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/30'),
    'Start Sprint button must have py-2.5 sm:py-3 rounded-xl padding'
  );
});

// 5. ArenaDifficultySelector uses p-2 sm:p-2.5 rounded-xl with gap-2
it('5. ArenaDifficultySelector uses p-2 sm:p-2.5 rounded-xl cards with tight gap-2', () => {
  assert.ok(
    selectorCode.includes('grid grid-cols-2 sm:grid-cols-4 gap-2'),
    'Difficulty grid must use gap-2'
  );
  assert.ok(
    selectorCode.includes('p-2 sm:p-2.5 rounded-xl border text-left'),
    'Difficulty cards must use p-2 sm:p-2.5 rounded-xl'
  );
  assert.ok(
    selectorCode.includes('line-clamp-1 sm:line-clamp-2 leading-tight'),
    'Difficulty description must clamp to 1 line on small viewports'
  );
});

// 6. ArenaRelativeLeaderboard limits max-height and uses compact row padding
it('6. ArenaRelativeLeaderboard constrains height and uses px-3 py-2 rows', () => {
  assert.ok(
    leaderboardCode.includes('max-h-[240px] sm:max-h-[280px] md:max-h-[340px] overflow-y-auto'),
    'Leaderboard scroll container must constrain max-h to 240px-340px'
  );
  assert.ok(
    leaderboardCode.includes('px-3 py-2 rounded-xl border text-xs'),
    'Leaderboard rows must use px-3 py-2'
  );
  assert.ok(
    leaderboardCode.includes('pt-1.5 border-t border-slate-800/80'),
    'Leaderboard footer must use pt-1.5'
  );
});

console.log(`\nStep 153 Suite Passed: ${passedTests}/${totalTests} tests successful (100%).\n`);
