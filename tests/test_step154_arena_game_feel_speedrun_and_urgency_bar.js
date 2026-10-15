/**
 * tests/test_step154_arena_game_feel_speedrun_and_urgency_bar.js
 * 
 * Verifies Phase 1: Game Feel, Visual Urgency & Speedrun Ergonomics in Atlas English Arena.
 * 1. ArenaHeaderBar dynamic urgency bar (Danger <= 30s, Warning 30-60s, Normal > 60s).
 * 2. Speedrun auto-advance toggle and immediate answer evaluation.
 * 3. Academic integrity preservation: wrong answers NEVER auto-advance (forces explanation review).
 * 4. Super Combo (>= 5x) milestone burst and visual indicators.
 * 5. Screen shake & damage juice on errors/skips.
 * 6. CSS animations & i18n bilingual support.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { vi } from '../src/i18n/locales/vi.js';
import { en } from '../src/i18n/locales/en.js';

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

console.log('\n--- Running Step 154: Arena Game Feel, Urgency Bar & Speedrun Tests ---');

const headerCode = fs.readFileSync(path.resolve('src/components/arena/ArenaHeaderBar.jsx'), 'utf-8');
const modalCode = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
const cssCode = fs.readFileSync(path.resolve('src/index.css'), 'utf-8');

// 1. Dynamic Urgency Bar along bottom of Header
it('1. ArenaHeaderBar renders dynamic urgency energy bar with 30s/60s color thresholds', () => {
  assert.ok(headerCode.includes('timeRemaining <= 30'), 'Must define danger threshold <= 30s');
  assert.ok(headerCode.includes('timeRemaining > 30 && timeRemaining <= 60'), 'Must define warning threshold 30-60s');
  assert.ok(headerCode.includes('bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 animate-pulse'), 'Must pulse red/rose on danger');
  assert.ok(headerCode.includes('bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300'), 'Must turn amber on warning');
  assert.ok(headerCode.includes('bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500'), 'Must render cyan/indigo on normal time');
  assert.ok(headerCode.includes('h-0.5 sm:h-1 bg-slate-800/80 relative overflow-hidden'), 'Must render micro-bar at header bottom');
});

// 2. Speedrun Mode toggle button in ArenaHeaderBar
it('2. ArenaHeaderBar renders Speedrun mode toggle button with active indicator', () => {
  assert.ok(headerCode.includes('isSpeedrunMode'), 'Header accepts isSpeedrunMode prop');
  assert.ok(headerCode.includes('onToggleSpeedrun'), 'Header accepts onToggleSpeedrun prop');
  assert.ok(headerCode.includes('t(\'arena.speedrunMode\')'), 'Binds i18n speedrun mode label');
  assert.ok(headerCode.includes('bg-amber-400 animate-pulse'), 'Renders active glowing indicator when speedrun enabled');
});

// 3. Super Combo (>= 5x) milestone styling
it('3. ArenaHeaderBar elevates combo >= 5x with Super Combo badge and particle burst', () => {
  assert.ok(headerCode.includes('combo >= 5'), 'Must check for combo >= 5 super milestone');
  assert.ok(headerCode.includes('t(\'arena.superCombo\')'), 'Must render superCombo label');
  assert.ok(headerCode.includes('animate-combo-burst'), 'Must apply animate-combo-burst');
});

// 4. AtlasEnglishArenaModal integrates Speedrun state & Auto-Advance
it('4. AtlasEnglishArenaModal implements speedrun state with localStorage persistence', () => {
  assert.ok(modalCode.includes('isSpeedrunMode, setIsSpeedrunMode'), 'Declares isSpeedrunMode state');
  assert.ok(modalCode.includes('localStorage.getItem(\'ielts_arena_speedrun_mode\')'), 'Loads speedrun preference from localStorage');
  assert.ok(modalCode.includes('localStorage.setItem(\'ielts_arena_speedrun_mode\''), 'Persists speedrun preference');
  assert.ok(modalCode.includes('handleSelectOption'), 'Declares handleSelectOption for auto-advance');
  assert.ok(modalCode.includes('autoAdvanceTimerRef'), 'Uses autoAdvanceTimerRef for safe cleanup');
});

// 5. Academic Integrity: Wrong answers NEVER auto-advance
it('5. Speedrun mode auto-advances only on correct answers and halts on mistakes', () => {
  // Verifies that auto-advance timeout is only inside isCorrect branch
  assert.ok(modalCode.includes('if (isCorrect) {\n          playSfx(\'correct\');\n          sprint.checkAnswer();\n          if (isSpeedrunMode) {\n            if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);\n            autoAdvanceTimerRef.current = setTimeout(() => {\n              sprint.nextQuestion();\n            }, 420);'), 'Auto-advances on correct option selection');
  assert.ok(modalCode.includes('playSfx(\'wrong\');\n        triggerShake();\n        sprint.checkAnswer();'), 'Halts on wrong answer without auto-advance');
});

// 6. Screen shake and damage juice on errors/skips
it('6. AtlasEnglishArenaModal triggers screen shake on wrong answers and skips', () => {
  assert.ok(modalCode.includes('isScreenShaking, setIsScreenShaking'), 'Declares isScreenShaking state');
  assert.ok(modalCode.includes('triggerShake'), 'Declares triggerShake callback');
  assert.ok(modalCode.includes('animate-arena-shake ring-2 ring-rose-500/50'), 'Applies shake animation and rose damage ring');
});

// 7. CSS Animation keyframes in index.css
it('7. index.css defines arena-shake and combo-burst keyframes', () => {
  assert.ok(cssCode.includes('@keyframes arena-shake'), 'index.css defines arena-shake');
  assert.ok(cssCode.includes('.animate-arena-shake'), 'index.css defines animate-arena-shake class');
  assert.ok(cssCode.includes('@keyframes combo-burst'), 'index.css defines combo-burst');
  assert.ok(cssCode.includes('.animate-combo-burst'), 'index.css defines animate-combo-burst class');
});

// 8. Bilingual translations in vi.js and en.js
it('8. vi.js and en.js include speedrunMode, speedrunTitle, and superCombo', () => {
  assert.strictEqual(vi.arena.speedrunMode, 'Bứt Tốc');
  assert.strictEqual(en.arena.speedrunMode, 'Speedrun');
  assert.strictEqual(vi.arena.superCombo, 'SIÊU COMBO');
  assert.strictEqual(en.arena.superCombo, 'SUPER COMBO');
  assert.ok(vi.arena.speedrunTitle, 'vi.js contains speedrunTitle');
  assert.ok(en.arena.speedrunTitle, 'en.js contains speedrunTitle');
});

console.log(`\nStep 154 Suite Passed: ${passedTests}/${totalTests} tests successful (100%).\n`);
