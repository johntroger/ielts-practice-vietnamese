/**
 * Test Suite: Step 10 - Computer-Delivered IELTS (CDI) Simulation & Split-Pane Ergonomics
 * Verifies split width clamping, contrast theme descriptors, timer alert thresholds, and time formatting.
 */

import assert from 'assert';
import { 
  clampSplitWidth, 
  CDI_CONTRAST_THEMES, 
  getContrastThemeStyles, 
  getCdiTimerStatus, 
  formatCdiTime 
} from '../src/utils/cdiExamSimulator.js';

console.log('--- TEST STEP 10: CDI EXAM SIMULATION & SPLIT-PANE ERGONOMICS ---');

let testsPassed = 0;

function it(desc, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    throw err;
  }
}

// ============================================================================
// 1. SPLIT-PANE WIDTH CLAMPING & PRESETS
// ============================================================================
it('clampSplitWidth should maintain valid percentages within default 25-75 bounds', () => {
  assert.strictEqual(clampSplitWidth(50), 50);
  assert.strictEqual(clampSplitWidth(35), 35);
  assert.strictEqual(clampSplitWidth(65), 65);
});

it('clampSplitWidth should clamp values below minimum (25%)', () => {
  assert.strictEqual(clampSplitWidth(10), 25);
  assert.strictEqual(clampSplitWidth(0), 25);
  assert.strictEqual(clampSplitWidth(-15), 25);
  assert.strictEqual(clampSplitWidth(24.9), 25);
});

it('clampSplitWidth should clamp values above maximum (75%)', () => {
  assert.strictEqual(clampSplitWidth(80), 75);
  assert.strictEqual(clampSplitWidth(100), 75);
  assert.strictEqual(clampSplitWidth(120), 75);
  assert.strictEqual(clampSplitWidth(75.5), 75);
});

it('clampSplitWidth should safely fallback to 50% for invalid inputs', () => {
  assert.strictEqual(clampSplitWidth(NaN), 50);
  assert.strictEqual(clampSplitWidth('abc'), 50);
  assert.strictEqual(clampSplitWidth(undefined), 50);
});

it('clampSplitWidth should respect custom min and max bounds and round decimals to 1 place', () => {
  assert.strictEqual(clampSplitWidth(20, 30, 80), 30);
  assert.strictEqual(clampSplitWidth(95, 30, 80), 80);
  assert.strictEqual(clampSplitWidth(42.567), 42.6);
});

// ============================================================================
// 2. OFFICIAL HIGH-CONTRAST ACCESSIBILITY THEMES
// ============================================================================
it('getContrastThemeStyles should return valid styles for standard theme', () => {
  const styles = getContrastThemeStyles('standard');
  assert.strictEqual(styles.themeKey, 'standard');
  assert.ok(styles.containerClass.includes('bg-slate-50'));
  assert.ok(styles.headerClass.includes('bg-white'));
  assert.ok(styles.textClass.includes('text-slate-900'));
});

it('getContrastThemeStyles should return valid styles for black-on-white high contrast theme', () => {
  const styles = getContrastThemeStyles(CDI_CONTRAST_THEMES.BLACK_ON_WHITE);
  assert.strictEqual(styles.themeKey, 'black-on-white');
  assert.ok(styles.containerClass.includes('bg-white text-black'));
  assert.ok(styles.headerClass.includes('border-black'));
});

it('getContrastThemeStyles should return valid styles for white-on-black dark mode theme', () => {
  const styles = getContrastThemeStyles(CDI_CONTRAST_THEMES.WHITE_ON_BLACK);
  assert.strictEqual(styles.themeKey, 'white-on-black');
  assert.ok(styles.containerClass.includes('bg-black text-white'));
  assert.ok(styles.headerClass.includes('bg-zinc-900'));
});

it('getContrastThemeStyles should return valid styles for yellow-on-black accessibility theme', () => {
  const styles = getContrastThemeStyles(CDI_CONTRAST_THEMES.YELLOW_ON_BLACK);
  assert.strictEqual(styles.themeKey, 'yellow-on-black');
  assert.ok(styles.containerClass.includes('bg-black text-yellow-300'));
  assert.ok(styles.borderClass.includes('border-yellow-700'));
});

it('getContrastThemeStyles should fallback cleanly to standard for unknown theme strings', () => {
  const styles = getContrastThemeStyles('neon-pink-unknown');
  assert.strictEqual(styles.themeKey, 'standard');
  assert.ok(styles.containerClass.includes('bg-slate-50'));
});

// ============================================================================
// 3. CDI OFFICIAL TIMER THRESHOLDS & EXAM NOTICES
// ============================================================================
it('getCdiTimerStatus should trigger official 10-minute warning at 600s', () => {
  const status = getCdiTimerStatus(600);
  assert.strictEqual(status.is10MinWarning, true);
  assert.strictEqual(status.is5MinWarning, false);
  assert.strictEqual(status.severity, 'warning');
  assert.ok(status.noticeText.includes('10 phút'));
});

it('getCdiTimerStatus should persist 10m status between 300s and 600s without spamming banner past window', () => {
  const statusWithinWindow = getCdiTimerStatus(596);
  assert.strictEqual(statusWithinWindow.is10MinWarning, true);
  assert.ok(statusWithinWindow.noticeText !== null);

  const statusPastBannerWindow = getCdiTimerStatus(450);
  assert.strictEqual(statusPastBannerWindow.is10MinWarning, true);
  assert.strictEqual(statusPastBannerWindow.noticeText, null);
});

it('getCdiTimerStatus should trigger official 5-minute urgent warning at 300s', () => {
  const status = getCdiTimerStatus(300);
  assert.strictEqual(status.is5MinWarning, true);
  assert.strictEqual(status.is10MinWarning, false);
  assert.strictEqual(status.severity, 'urgent');
  assert.ok(status.noticeText.includes('5 phút'));
});

it('getCdiTimerStatus should trigger critical under-1-minute alert at <= 60s', () => {
  const status60 = getCdiTimerStatus(60);
  assert.strictEqual(status60.isCritical, true);
  assert.strictEqual(status60.severity, 'critical');
  assert.ok(status60.noticeText.includes('Dưới 1 phút'));

  const status30 = getCdiTimerStatus(30);
  assert.strictEqual(status30.isCritical, true);
  assert.strictEqual(status30.severity, 'critical');
});

it('getCdiTimerStatus should identify expired exam at 0s and clamp negative seconds', () => {
  const status0 = getCdiTimerStatus(0);
  assert.strictEqual(status0.isExpired, true);
  assert.strictEqual(status0.isCritical, false);

  const statusNeg = getCdiTimerStatus(-10);
  assert.strictEqual(statusNeg.isExpired, true);
});

// ============================================================================
// 4. CDI TIME FORMATTING
// ============================================================================
it('formatCdiTime should format various durations accurately into MM:SS', () => {
  assert.strictEqual(formatCdiTime(3600), '60:00');
  assert.strictEqual(formatCdiTime(600), '10:00');
  assert.strictEqual(formatCdiTime(300), '05:00');
  assert.strictEqual(formatCdiTime(75), '01:15');
  assert.strictEqual(formatCdiTime(9), '00:09');
  assert.strictEqual(formatCdiTime(0), '00:00');
  assert.strictEqual(formatCdiTime(-5), '00:00');
});

console.log(`\n🎉 Step 10 Unit Tests Passed: ${testsPassed}/${testsPassed} tests passed cleanly.`);
