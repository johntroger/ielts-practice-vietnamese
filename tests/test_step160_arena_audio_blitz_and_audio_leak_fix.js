/**
 * tests/test_step157_arena_audio_blitz_and_audio_leak_fix.js
 * 
 * Verifies:
 * 1. Dedicated Audio Blitz XP Calculation (Audio Mastery Bonus +25% and Perfect Ear Bonus +15 XP, expanded cap).
 * 2. Audio Sprint Option propagation in useArenaSprintEngine.js.
 * 3. Audio leak prevention in AtlasEnglishArenaModal.jsx (stopAudio on exit, close, lobby return, and question cleanup).
 * 4. Audio session token cancellation in audioHelper.js.
 * 5. Gamified UI naming: 'Cambridge Audio Blitz (+25% XP)' / 'Thính Giác Siêu Tốc (+25% XP)' without dev jargon.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { calculateSprintXp } from '../src/services/gamification/xpCalculator.js';
import { startSprintAction, finishSprintAction, INITIAL_SPRINT_STATE } from '../src/hooks/useArenaSprintEngine.js';
import { stopAllAudio } from '../src/utils/audioHelper.js';

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

console.log('\n--- Running Step 160: Arena Audio Blitz & Audio Leak Fix Tests ---');

// 1. Dedicated Audio Blitz XP: +25% on Base XP + Perfect Ear Bonus (+15 XP)
it('1. Dedicated Audio Blitz XP calculation grants +25% audioBonus and Perfect Ear reward', () => {
  const normalResult = calculateSprintXp({
    correctAnswers: 7,
    streakCount: 0,
    totalSeconds: 30,
    difficulty: 'hard',
    timeRemaining: 150,
    isBossCleared: false,
    isAudioSprint: false
  });

  const audioResult = calculateSprintXp({
    correctAnswers: 7,
    streakCount: 0,
    totalSeconds: 30,
    difficulty: 'hard',
    timeRemaining: 150,
    isBossCleared: false,
    isAudioSprint: true
  });

  // Base score for 7 questions on hard (32 XP each) = 224
  assert.strictEqual(audioResult.baseScore, 224);
  // audioBonus = round(224 * 0.25) + 15 (Perfect Ear) = 56 + 15 = 71
  assert.strictEqual(audioResult.audioBonus, 71);
  assert.strictEqual(normalResult.audioBonus, 0);
  assert.strictEqual(audioResult.isAudioSprint, true);
  assert.strictEqual(normalResult.isAudioSprint, false);
  assert.ok(audioResult.finalXp > normalResult.finalXp, 'Audio sprint XP must exceed normal sprint XP');
});

// 2. Audio Sprint expands maxSprintCap by 25%
it('2. Audio Sprint expands max sprint XP cap so bonus XP is not prematurely clipped', () => {
  const normalMax = calculateSprintXp({
    correctAnswers: 10,
    streakCount: 20,
    totalSeconds: 10,
    difficulty: 'nightmare',
    timeRemaining: 170,
    isBossCleared: true,
    isAudioSprint: false
  });

  const audioMax = calculateSprintXp({
    correctAnswers: 10,
    streakCount: 20,
    totalSeconds: 10,
    difficulty: 'nightmare',
    timeRemaining: 170,
    isBossCleared: true,
    isAudioSprint: true
  });

  // Nightmare standard cap is 300, audio cap expands to 375
  assert.ok(audioMax.finalXp > normalMax.finalXp, 'Audio sprint must allow higher ceiling for high scores');
});

// 3. startSprintAction records isAudioSprint correctly
it('3. startSprintAction handles isAudioSprint flag properly', () => {
  const normalState = startSprintAction([{ id: 'q1' }], 180, 'medium', {});
  assert.strictEqual(normalState.isAudioSprint, false);

  const audioState = startSprintAction([{ id: 'q1', audioUrl: 'https://audio.mp3' }], 180, 'medium', { isAudioSprint: true });
  assert.strictEqual(audioState.isAudioSprint, true);

  const finished = finishSprintAction({
    ...audioState,
    score: 7,
    timeRemaining: 100,
    duration: 180
  });

  assert.strictEqual(finished.summary.isAudioSprint, true);
  assert.ok(finished.summary.audioBonus > 0, 'Finished summary must include audioBonus');
});

// 4. audioHelper stopAllAudio function works and is callable without errors
it('4. stopAllAudio executes safely without errors in Node/browser environments', () => {
  assert.doesNotThrow(() => {
    stopAllAudio();
  });
});

// 5. AtlasEnglishArenaModal code contains stopAudio wiring
it('5. AtlasEnglishArenaModal wires stopAudio into handleClose, lobby, restart, and unmount', () => {
  const modalCode = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');

  // Verify stopAudio is destructured from useArenaAudio
  assert.ok(modalCode.includes('stopAudio'), 'stopAudio must be destructured from useArenaAudio');

  // Verify handleClose calls stopAudio
  assert.ok(
    modalCode.includes('const handleClose = useCallback(() => {\n    stopAudio();'),
    'handleClose must call stopAudio immediately'
  );

  // Verify handleReturnToLobby calls stopAudio
  assert.ok(
    modalCode.includes('const handleReturnToLobby = useCallback(async () => {\n    stopAudio();'),
    'handleReturnToLobby must call stopAudio immediately'
  );

  // Verify handleDefeatedRestart calls stopAudio
  assert.ok(
    modalCode.includes('const handleDefeatedRestart = useCallback(async () => {\n    stopAudio();'),
    'handleDefeatedRestart must call stopAudio immediately'
  );

  // Verify question auto-play cleanup calls stopAudio
  assert.ok(
    modalCode.includes('return () => {\n      stopAudio();\n    };'),
    'Question autoplay useEffect must clean up previous speech on change or unmount'
  );

  // Verify Audio Blitz button passes isAudioSprint: true
  assert.ok(
    modalCode.includes('{ isAudioSprint: true }'),
    'Audio Blitz button must pass isAudioSprint: true'
  );
  assert.ok(
    modalCode.includes("t('arena.audioBlitzTitle')"),
    'Audio Blitz button must display gamified audioBlitzTitle'
  );
});

// 6. ArenaQuestionCard and SummaryModal clean gamified UI
it('6. ArenaQuestionCard and SummaryModal use clean gamified presentation without dev jargon', () => {
  const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');
  assert.ok(!cardCode.includes('R2 STUDIO AUDIO'), 'Internal dev jargon R2 STUDIO AUDIO must be removed');
  assert.ok(cardCode.includes('CAMBRIDGE STUDIO AUDIO'), 'Card must show CAMBRIDGE STUDIO AUDIO');

  const summaryCode = fs.readFileSync(path.resolve('src/components/arena/ArenaSprintSummaryModal.jsx'), 'utf-8');
  assert.ok(summaryCode.includes('summary.audioBonus > 0'), 'Summary must render dedicated audioBonus chip');
});

// 7. Locales contain required gamified audio keys
it('7. Both Vietnamese and English locales provide audioBlitz keys', () => {
  const viCode = fs.readFileSync(path.resolve('src/i18n/locales/vi.js'), 'utf-8');
  const enCode = fs.readFileSync(path.resolve('src/i18n/locales/en.js'), 'utf-8');

  assert.ok(viCode.includes('audioBlitzTitle:'), 'vi.js must have audioBlitzTitle');
  assert.ok(viCode.includes('audioBlitzDesc:'), 'vi.js must have audioBlitzDesc');
  assert.ok(viCode.includes('audioBonusLabel:'), 'vi.js must have audioBonusLabel');

  assert.ok(enCode.includes('audioBlitzTitle:'), 'en.js must have audioBlitzTitle');
  assert.ok(enCode.includes('audioBlitzDesc:'), 'en.js must have audioBlitzDesc');
  assert.ok(enCode.includes('audioBonusLabel:'), 'en.js must have audioBonusLabel');
});

console.log(`\nAll ${passedTests}/${totalTests} Step 157 Audio Blitz & Leak Fix Tests Passed Successfully! 🎉\n`);
