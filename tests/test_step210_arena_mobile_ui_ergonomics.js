/**
 * tests/test_step210_arena_mobile_ui_ergonomics.js
 *
 * Comprehensive verification suite for Atlas Arena Mobile UI Ergonomics Audit:
 * 1. index.html includes viewport-fit=cover for iOS safe-area-inset support.
 * 2. HeadingInfoTip provides mobile-safe bottom-sheet popover & mouse-only hover guard.
 * 3. AtlasEnglishArenaModal uses thumb-ergonomic 4-tab Bottom Navigation Bar (< lg)
 *    without dead/stacked top mobile tabs, and renders Atli comfort on DEFEATED screen.
 * 4. ArenaHeaderBar uses compact mobile shield pill (< sm) and hides redundant progress bar / fullscreen.
 * 5. ArenaQuestionCard uses sticky thumb action dock at bottom on mobile, single-row scrollable badges,
 *    48px+ answer touch targets, and disables duplicate inline actions on ArenaTextInputCard.
 * 6. All 6 Arena modals support max-h-[92dvh] + overflow-y-auto for narrow/short phone viewports.
 * 7. AtlasTreasuryModal shows labels on all 4 mobile tabs; ArenaDifficultySelector avoids broken truncation;
 *    AtlasDailySprintCard displays quest descriptions on mobile; ArenaRelativeLeaderboard expands mobile height.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

const read = (relPath) => fs.readFileSync(path.resolve(relPath), 'utf-8');

console.log('\n📱 Running Step 210: Atlas Arena Mobile UI Ergonomics Tests...\n');

it('1. index.html enables viewport-fit=cover for safe-area insets', () => {
  const html = read('index.html');
  assert.ok(html.includes('viewport-fit=cover'), 'index.html must include viewport-fit=cover');
});

it('2. HeadingInfoTip prevents mobile edge clipping and touch double-tap conflicts', () => {
  const code = read('src/components/common/HeadingInfoTip.jsx');
  assert.ok(code.includes("e.pointerType === 'mouse'"), 'Must guard hover with pointerType === mouse');
  assert.ok(code.includes('sm:hidden fixed inset-0'), 'Must render safe centered sheet on mobile');
  assert.ok(code.includes('max-w-[calc(100vw-2rem)]'), 'Desktop popover must clamp width to viewport');
});

it('3. AtlasEnglishArenaModal replaces stacked mobile tabs with 4-tab Bottom Navigation Bar', () => {
  const code = read('src/components/arena/AtlasEnglishArenaModal.jsx');
  assert.ok(code.includes('aria-label={isEn ? \'Arena Navigation\' : \'Điều hướng Đấu Trường\'}'), 'Must include bottom nav');
  assert.ok(code.includes('pb-[max(0.4rem,env(safe-area-inset-bottom))]'), 'Bottom nav must respect safe-area-inset-bottom');
  assert.ok(code.includes('hidden lg:flex w-full items-center justify-center'), 'Top mode switcher must be desktop-only (hidden lg:flex)');
  assert.ok(!code.includes('Return to Battle Setup'), 'Obsolete Return to Battle Setup button should be removed');
  assert.ok(code.includes('src="/mascot/atli_comfort.jpg"'), 'DEFEATED screen must show Atli comfort mascot');
});

it('4. ArenaHeaderBar fits narrow mobile screens with compact shield counter pill', () => {
  const code = read('src/components/arena/ArenaHeaderBar.jsx');
  assert.ok(code.includes('sm:hidden flex items-center gap-1'), 'Must render compact mobile shield pill');
  assert.ok(code.includes('hidden sm:flex items-center gap-0.5'), 'Must keep 5-shield array for sm+');
  assert.ok(code.includes('hidden sm:block w-full h-1.5'), 'Must hide duplicate progress bar on mobile');
});

it('5. ArenaQuestionCard has sticky mobile action dock, scrollable badges, and no duplicate text_input actions', () => {
  const qCard = read('src/components/arena/ArenaQuestionCard.jsx');
  const tCard = read('src/components/arena/ArenaTextInputCard.jsx');
  assert.ok(qCard.includes('sticky bottom-0 z-20'), 'Action CTA bar must be sticky on mobile');
  assert.ok(qCard.includes('flex-nowrap overflow-x-auto no-scrollbar sm:flex-wrap'), 'Metadata badges must scroll cleanly in 1 row on mobile');
  assert.ok(qCard.includes('min-h-[48px]'), 'Answer buttons must meet >= 48px touch target');
  assert.ok(qCard.includes('showInlineActions={false}'), 'ArenaQuestionCard must suppress duplicate inline actions in ArenaTextInputCard');
  assert.ok(tCard.includes('showInlineActions = true'), 'ArenaTextInputCard must accept showInlineActions prop');
  assert.ok(tCard.includes('hidden sm:inline font-mono text-slate-500">Press Enter'), 'PC Press Enter hint must be hidden on mobile');
});

it('6. All 6 Arena modals are scrollable within 92dvh on short mobile viewports', () => {
  const modalFiles = [
    'src/components/arena/tower/ArenaTowerRelicPickerModal.jsx',
    'src/components/arena/PublicLearnerProfileModal.jsx',
    'src/components/arena/LevelUpCelebrationModal.jsx',
    'src/components/arena/ArenaLeaguePromotionModal.jsx',
    'src/components/arena/tower/ArenaTowerCampfireModal.jsx',
    'src/components/arena/realms/ArenaGateSummaryModal.jsx'
  ];
  for (const file of modalFiles) {
    const code = read(file);
    assert.ok(code.includes('max-h-[92dvh] overflow-y-auto'), `${file} must have max-h-[92dvh] overflow-y-auto`);
  }
});

it('7. Nested scroll traps removed in Skill Realms and Tower of Babel on mobile', () => {
  const realms = read('src/components/arena/realms/ArenaSkillRealmsHub.jsx');
  const tower = read('src/components/arena/tower/ArenaTowerMapView.jsx');
  assert.ok(realms.includes('lg:overflow-hidden') && realms.includes('lg:overflow-y-auto'), 'Skill Realms must scope inner scroll to lg+');
  assert.ok(realms.includes('grid-cols-4 gap-1.5 sm:gap-2'), 'Skill Realms 4-room switcher should stay compact on 1 row');
  assert.ok(tower.includes('lg:overflow-hidden') && tower.includes('lg:overflow-y-auto'), 'Tower map must scope inner scroll to lg+');
});

it('8. P1 mobile fixes: Treasury tabs, Difficulty labels, Daily Quest descriptions, Leaderboard height & Summary bubble', () => {
  const treasury = read('src/components/arena/AtlasTreasuryModal.jsx');
  const diff = read('src/components/arena/ArenaDifficultySelector.jsx');
  const daily = read('src/components/arena/AtlasDailySprintCard.jsx');
  const lb = read('src/components/arena/ArenaRelativeLeaderboard.jsx');
  const summary = read('src/components/arena/ArenaSprintSummaryModal.jsx');

  assert.ok(treasury.includes('flex-col sm:flex-row'), 'Treasury tabs must stack icon + label visibly on mobile');
  assert.ok(diff.includes("medium: isEn ? 'Medium' : 'T.Bình'") && diff.includes("nightmare: isEn ? 'Master' : 'Siêu Khó'"), 'Difficulty mobile labels must not truncate to Trung or Nightm.');
  assert.ok(!daily.includes('hidden sm:block'), 'Daily Sprint quest descriptions must remain visible on mobile');
  assert.ok(lb.includes('max-h-[55dvh] lg:max-h-[340px]'), 'Leaderboard must use comfortable height on mobile tab');
  assert.ok(summary.includes('max-h-[92dvh]') && summary.includes('rounded-2xl text-[11px]'), 'Sprint summary must use 92dvh and rounded-2xl voice bubble');
});

console.log(`\n🎉 All ${passed}/${total} Step 210 Mobile UI Ergonomics Tests Passed Cleanly!\n`);
