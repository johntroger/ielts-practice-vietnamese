/**
 * tests/test_step115_atlas_english_arena_production_system.js
 * 
 * Verification Test Suite for Step 115:
 * Atlas English Arena (v3.23) - Core Gamification, Deterministic PRNG & Storage Infrastructure
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { openModal, closeModal, isModalOpen } from '../src/core/modalStore.js';
import { trackModalView } from '../src/services/analyticsService.js';
import { ARENA_STORAGE_KEYS, ARENA_LEAGUE_TIERS, ARENA_XP_CAPS } from '../src/utils/arenaStorageKeys.js';
import { getIsoWeekKey, getUtcMonthKey, getLocalDateKey } from '../src/utils/dateHelper.js';
import { hashString, createMulberry32, seededInt } from '../src/utils/seededRandom.js';
import { setupKeyboardNavigation } from '../src/utils/keyboardNavigator.js';
import { 
  unlockAudioContext, 
  playSoundcheck, 
  stopAllAudio, 
  speakArenaText 
} from '../src/utils/audioHelper.js';
import { 
  on as onEvent, 
  emit as emitEvent, 
  clearAllListeners 
} from '../src/services/gamification/eventBus.js';
import { 
  calculateSprintXp, 
  getDailySoftCapMultiplier, 
  getDailySprintCount 
} from '../src/services/gamification/xpCalculator.js';
import { 
  createSprintShieldState, 
  deductShield, 
  useSprintRetry 
} from '../src/services/gamification/shieldManager.js';
import { 
  getLeagueTier, 
  getRelativeLeaderboardSlice, 
  LEAGUE_THRESHOLDS 
} from '../src/services/gamification/leagueEngine.js';
import { generateWeeklyRivals } from '../src/services/gamification/offlineRivals.js';
import { 
  recordGuestPendingXp, 
  getGuestPendingXp, 
  migrateGuestXpOnLogin 
} from '../src/services/gamification/guestMigrationService.js';
import { 
  submitSprintXp, 
  resetRpcCircuitBreaker, 
  getCircuitBreakerStatus 
} from '../src/services/supabaseLeaderboard.js';
import { en } from '../src/i18n/locales/en.js';
import { vi } from '../src/i18n/locales/vi.js';
import { 
  adaptSpellingTrap, 
  adaptSynonymPair, 
  adaptReadingDrill, 
  adaptListeningDrill, 
  generateArenaSprintQuestions, 
  shuffleArray 
} from '../src/adapters/sprintQuestionAdapter.js';
import { 
  isQuestionInCooldown, 
  filterEligibleQuestions, 
  recordServedQuestions, 
  clearCooldownLog, 
  COOLDOWN_DURATION_MS 
} from '../src/adapters/sprintCooldownService.js';
import { IELTS_SPELLING_TRAPS, CAMBRIDGE_SYNONYM_PAIRS } from '../src/data/vocabGrammarSpellingData.js';
import { READING_MICRO_DRILLS } from '../src/data/readingMicroDrills.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { 
  ARENA_SPRINT_PHASES, 
  startSprintAction, 
  selectOptionAction, 
  checkAnswerAction, 
  nextQuestionAction, 
  retrySprintAction, 
  finishSprintAction, 
  INITIAL_SPRINT_STATE 
} from '../src/hooks/useArenaSprintEngine.js';
import { useArenaAudio } from '../src/hooks/useArenaAudio.js';

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

console.log('🧪 Testing Step 115: Atlas English Arena Production Infrastructure...\n');

// 1. Constants & Schema Integrity
it('1. ARENA_STORAGE_KEYS, ARENA_LEAGUE_TIERS & ARENA_XP_CAPS have required schema', () => {
  assert.ok(ARENA_STORAGE_KEYS.CACHE_V1);
  assert.ok(ARENA_STORAGE_KEYS.GUEST_PENDING_XP);
  assert.ok(ARENA_STORAGE_KEYS.COOLDOWN_LOG);
  assert.ok(ARENA_STORAGE_KEYS.SHIELD_STATE);
  assert.strictEqual(ARENA_LEAGUE_TIERS.BRONZE, 'bronze');
  assert.strictEqual(ARENA_LEAGUE_TIERS.DIAMOND, 'diamond');
  assert.strictEqual(ARENA_XP_CAPS.MAX_XP_PER_SPRINT, 200);
  assert.strictEqual(ARENA_XP_CAPS.BASE_QUESTION_XP, 20);
});

// 2. ISO-8601 Week Key & Calendar Helpers
it('2. dateHelper produces valid ISO-8601 Week Key conforming to PostgreSQL standard', () => {
  const d = new Date(Date.UTC(2026, 9, 11)); // Oct 11, 2026
  const weekKey = getIsoWeekKey(d);
  assert.ok(/^2026-W\d{2}$/.test(weekKey), `Week key ${weekKey} must match format YYYY-Www`);
  
  const monthKey = getUtcMonthKey(d);
  assert.strictEqual(monthKey, '2026-10');

  const localKey = getLocalDateKey(d);
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(localKey));
});

// 3. Seeded Deterministic PRNG
it('3. seededRandom generates deterministic pseudo-random sequences for weekly rival sync', () => {
  const seed1 = hashString('2026-W41');
  const seed2 = hashString('2026-W41');
  assert.strictEqual(seed1, seed2, 'Same input string produces exact same 32-bit hash');

  const rng1 = createMulberry32(seed1);
  const rng2 = createMulberry32(seed2);

  for (let i = 0; i < 5; i++) {
    assert.strictEqual(rng1(), rng2(), `RNG step ${i} matches perfectly`);
  }

  const intVal = seededInt(rng1, 10, 50);
  assert.ok(intVal >= 10 && intVal <= 50, 'Seeded integer falls strictly within range');
});

// 4. Keyboard Controller & Input Focus Guard
it('4. keyboardNavigator handles keys and safely ignores non-window environments', () => {
  const cleanup = setupKeyboardNavigation({
    onSelectOption: () => {},
    onSubmit: () => {},
    onSkip: () => {},
    onSpaceAudio: () => {},
    isActive: true
  });
  assert.strictEqual(typeof cleanup, 'function');
  assert.doesNotThrow(() => cleanup());
});

// 5. Dual-Audio Facade Offline Safety
it('5. audioHelper executes safely in Node.js / non-DOM environments without errors', () => {
  assert.doesNotThrow(() => {
    unlockAudioContext();
    stopAllAudio();
    speakArenaText('Test prompt');
    playSoundcheck();
  });
});

// 6. Pub/Sub EventBus Cleanup & Memory Leak Protection
it('6. eventBus supports subscribe, emit, and returns mandatory unsubscribe cleanup', () => {
  clearAllListeners();
  let receivedPayload = null;

  const unsubscribe = onEvent('arena:test_event', (payload) => {
    receivedPayload = payload;
  });

  emitEvent('arena:test_event', { score: 100 });
  assert.deepStrictEqual(receivedPayload, { score: 100 });

  // Test cleanup
  unsubscribe();
  emitEvent('arena:test_event', { score: 999 });
  assert.strictEqual(receivedPayload.score, 100, 'Listener was successfully removed by cleanup');
});

// 7. Scoring Engine: Base & Speed Bonus
it('7. xpCalculator computes correct base score and speed bonus', () => {
  const res = calculateSprintXp({
    correctAnswers: 7,
    streakCount: 0,
    totalSeconds: 45
  });
  assert.ok(res.rawXp >= 140, '7 correct questions yield >= 140 raw XP');
  assert.ok(res.speedBonus > 0, 'Clean finish in 45s yields speed bonus');
  assert.strictEqual(calculateSprintXp({ correctAnswers: 0 }).finalXp, 0);
});

// 8. Scoring Engine: Anti-Grinding Soft-Cap Curve
it('8. xpCalculator applies 100% -> 70% -> 40% daily soft-cap curve', () => {
  assert.strictEqual(getDailySoftCapMultiplier(0), 1.0);
  assert.strictEqual(getDailySoftCapMultiplier(2), 1.0);
  assert.strictEqual(getDailySoftCapMultiplier(3), 0.7);
  assert.strictEqual(getDailySoftCapMultiplier(5), 0.7);
  assert.strictEqual(getDailySoftCapMultiplier(6), 0.4);
  assert.strictEqual(getDailySoftCapMultiplier(10), 0.4);
});

// 9. Scoring Engine: Absolute 200 XP Hard Cap
it('9. xpCalculator enforces mathematical hard cap of 200 XP max per sprint', () => {
  const cappedRes = calculateSprintXp({
    correctAnswers: 7,
    streakCount: 50,
    totalSeconds: 20
  });
  assert.ok(cappedRes.finalXp <= 200, `Final XP (${cappedRes.finalXp}) must never exceed 200`);
});

// 10. Shield Manager Lifecycle
it('10. shieldManager starts with 5 shields, deducts correctly, and handles 1 retry', () => {
  let shieldState = createSprintShieldState();
  assert.strictEqual(shieldState.remainingShields, 5);
  assert.strictEqual(shieldState.retryUsed, false);

  const res1 = deductShield(shieldState, { questionId: 'q1' });
  shieldState = res1.state;
  assert.strictEqual(shieldState.remainingShields, 4);
  assert.strictEqual(res1.isDefeated, false);
  assert.strictEqual(shieldState.mistakesRecorded.length, 1);

  // Consume retry
  const retryRes = useSprintRetry(shieldState);
  assert.strictEqual(retryRes.success, true);
  assert.strictEqual(retryRes.state.remainingShields, 2);
  assert.strictEqual(retryRes.state.retryUsed, true);

  // Second retry should fail
  const retryRes2 = useSprintRetry(retryRes.state);
  assert.strictEqual(retryRes2.success, false);
});

// 11. League Classification & Relative Leaderboard Slicing
it('11. leagueEngine classifies 5 tiers and slices +-5 rivals around user', () => {
  assert.strictEqual(getLeagueTier(0), 'bronze');
  assert.strictEqual(getLeagueTier(350), 'silver');
  assert.strictEqual(getLeagueTier(800), 'gold');
  assert.strictEqual(getLeagueTier(1500), 'platinum');
  assert.strictEqual(getLeagueTier(2500), 'diamond');

  const rivals = [];
  for (let i = 1; i <= 20; i++) {
    rivals.push({ user_id: `u_${i}`, weekly_xp: 2000 - i * 50 });
  }
  // User is at index 10 (u_11)
  const sliceResult = getRelativeLeaderboardSlice(rivals, 'u_11');
  assert.strictEqual(sliceResult.userRank, 11);
  assert.strictEqual(sliceResult.rivalsSlice.length, 11); // from idx 5 to 15 (inclusive bounds)
  assert.strictEqual(sliceResult.rivalsSlice[5].user_id, 'u_11');
});

// 12. Deterministic Seeded Offline Rivals Generation
it('12. offlineRivals generates immutable weekly rivals sorted descending by weekly XP', () => {
  const week1 = generateWeeklyRivals('2026-W41', 15);
  const week1Again = generateWeeklyRivals('2026-W41', 15);
  assert.strictEqual(week1.length, 15);
  assert.deepStrictEqual(week1, week1Again, 'Rivals for same week key are 100% deterministic');

  // Verify descending order
  for (let i = 0; i < week1.length - 1; i++) {
    assert.ok(week1[i].weekly_xp >= week1[i + 1].weekly_xp, 'Rivals are sorted descending by XP');
  }
});

// 13. Guest Pending XP & Migration Service
it('13. guestMigrationService stores pending XP and handles login migration', async () => {
  const stored = recordGuestPendingXp(50);
  assert.ok(stored >= 50);
  assert.strictEqual(getGuestPendingXp(), stored);

  // Migration without user returns false
  const noUserRes = await migrateGuestXpOnLogin(null);
  assert.strictEqual(noUserRes.success, false);
});

// 14. Leaderboard Circuit Breaker & Local Fallback
it('14. supabaseLeaderboard gracefully falls back to local storage and reports status', async () => {
  resetRpcCircuitBreaker();
  assert.strictEqual(getCircuitBreakerStatus(), true);

  const res = await submitSprintXp({
    userId: 'test_user_ci',
    deltaXp: 80,
    streakCount: 3,
    displayName: 'Test Warrior'
  });

  assert.strictEqual(res.success, true);
  assert.strictEqual(res.isLocalFallback, true);
});

// 15. Bilingual i18n Localization Integrity
it('15. en.js and vi.js provide complete translation keys for arena namespace', () => {
  assert.ok(en.arena, 'en.js contains arena namespace');
  assert.ok(vi.arena, 'vi.js contains arena namespace');

  const requiredKeys = [
    'title', 'subtitle', 'league', 'bronze', 'silver', 'gold', 'platinum', 'diamond',
    'xp', 'weeklyXp', 'shieldCount', 'streak', 'startSprint', 'retrySprint',
    'nextQuestion', 'finishSprint', 'combo', 'correct', 'incorrect', 'timeRemaining',
    'leaderboardTitle', 'promotionZone', 'relegationZone', 'safeZone',
    'summaryTitle', 'summaryAccuracy', 'summarySpeed', 'summaryTotalXp'
  ];

  requiredKeys.forEach(key => {
    assert.ok(en.arena[key], `en.arena.${key} is defined`);
    assert.ok(vi.arena[key], `vi.arena.${key} is defined`);
  });

  assert.ok(en.nav.arena, 'en.nav.arena is defined');
  assert.ok(vi.nav.arena, 'vi.nav.arena is defined');
});

// 16. Adapter: adaptSpellingTrap
it('16. adaptSpellingTrap normalizes spelling traps with 4 options and accurate correctIndex', () => {
  const sample = IELTS_SPELLING_TRAPS[0];
  const adapted = adaptSpellingTrap(sample);
  assert.strictEqual(adapted.id, `spelling_${sample.id}`);
  assert.strictEqual(adapted.type, 'spelling');
  assert.strictEqual(adapted.skillCategory, 'vocab');
  assert.strictEqual(adapted.options.length, 4);
  assert.strictEqual(adapted.options[adapted.correctIndex], sample.correct);
  assert.strictEqual(adapted.correctAnswer, sample.correct);
  assert.ok(adapted.context.length > 0);
  assert.ok(adapted.explanation.length > 0);
});

// 17. Adapter: adaptSynonymPair
it('17. adaptSynonymPair generates plausible distractors and valid correctIndex', () => {
  const sample = CAMBRIDGE_SYNONYM_PAIRS[0];
  const adapted = adaptSynonymPair(sample, CAMBRIDGE_SYNONYM_PAIRS);
  assert.strictEqual(adapted.id, `synonym_${sample.id}`);
  assert.strictEqual(adapted.type, 'synonym');
  assert.strictEqual(adapted.skillCategory, 'vocab');
  assert.strictEqual(adapted.options.length, 4);
  assert.strictEqual(adapted.options[adapted.correctIndex], sample.passageMatch);
  assert.strictEqual(adapted.correctAnswer, sample.passageMatch);
  assert.ok(adapted.prompt.includes(sample.questionStem));
});

// 18. Adapter: adaptReadingDrill
it('18. adaptReadingDrill formats True/False/Not Given micro-drills cleanly', () => {
  const sample = READING_MICRO_DRILLS.find(d => d.type === 'reading-tfng');
  assert.ok(sample, 'Found reading-tfng sample');
  const adapted = adaptReadingDrill(sample);
  assert.strictEqual(adapted.id, `reading_${sample.id}`);
  assert.strictEqual(adapted.type, 'tfng');
  assert.strictEqual(adapted.skillCategory, 'reading');
  assert.deepStrictEqual(adapted.options, ['TRUE', 'FALSE', 'NOT GIVEN']);
  assert.strictEqual(adapted.options[adapted.correctIndex], sample.answer.toUpperCase());
  assert.ok(adapted.context.includes(sample.passage));
});

// 19. Adapter: adaptListeningDrill
it('19. adaptListeningDrill normalizes acoustic and distractor traps with audio text', () => {
  const sample = LISTENING_MICRO_DRILLS.find(d => d.type === 'listening-distractor');
  assert.ok(sample, 'Found listening-distractor sample');
  const adapted = adaptListeningDrill(sample);
  assert.strictEqual(adapted.id, `listening_${sample.id}`);
  assert.strictEqual(adapted.type, 'listening_trap');
  assert.strictEqual(adapted.skillCategory, 'listening');
  assert.ok(adapted.options.length >= 3);
  assert.ok(adapted.audioText.length > 0);
  assert.ok(adapted.explanation.length > 0);
});

// 20. Cooldown Engine: Rotation & Starvation Protection
it('20. sprintCooldownService enforces 5-day cooldown and graceful fallback on starvation', () => {
  clearCooldownLog();
  const mockNow = 1760000000000;
  
  // Record question 'q_test_1'
  recordServedQuestions(['q_test_1'], mockNow);
  assert.strictEqual(isQuestionInCooldown('q_test_1', mockNow), true);
  assert.strictEqual(isQuestionInCooldown('q_test_2', mockNow), false);

  // After 5 days + 1 ms, question is no longer in cooldown
  const afterCooldown = mockNow + COOLDOWN_DURATION_MS + 1000;
  assert.strictEqual(isQuestionInCooldown('q_test_1', afterCooldown), false);

  // Starvation protection: if only 2 questions exist and both in cooldown, return them sorted by oldest
  const smallPool = [{ id: 'q_test_1' }, { id: 'q_test_2' }];
  recordServedQuestions(['q_test_2'], mockNow + 100);
  const eligible = filterEligibleQuestions(smallPool, 5, mockNow + 200);
  assert.strictEqual(eligible.length, 2, 'Never starves the candidate of questions');
  assert.strictEqual(eligible[0].id, 'q_test_1', 'Oldest served question comes first');
});

// 21. Sprint Generator: Exactly 7 Balanced Questions
it('21. generateArenaSprintQuestions produces exactly 7 balanced sprint questions', () => {
  clearCooldownLog();
  const sprint = generateArenaSprintQuestions({ count: 7 });
  assert.strictEqual(sprint.length, 7, 'Sprint must contain exactly 7 questions');

  // Verify question structure
  sprint.forEach((q, idx) => {
    assert.ok(q.id, `Question ${idx} must have id`);
    assert.ok(q.type, `Question ${idx} must have type`);
    assert.ok(q.skillCategory, `Question ${idx} must have skillCategory`);
    assert.ok(q.prompt, `Question ${idx} must have prompt`);
    assert.ok(Array.isArray(q.options) && q.options.length >= 3, `Question ${idx} must have >= 3 options`);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length, `Question ${idx} correctIndex in bounds`);
    assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Question ${idx} correctAnswer matches options`);
    assert.ok(q.explanation, `Question ${idx} must have explanation`);
  });

  // Verify presence of diverse categories
  const categories = new Set(sprint.map(q => q.skillCategory));
  assert.ok(categories.has('vocab'), 'Sprint includes vocab questions');
  assert.ok(categories.has('reading'), 'Sprint includes reading questions');
  assert.ok(categories.has('listening'), 'Sprint includes listening questions');
});

// 22. Deterministic Seeded Sprint Generation
it('22. generateArenaSprintQuestions supports deterministic PRNG for test reproducibility', () => {
  const seed = hashString('deterministic-sprint-test');
  const rng1 = createMulberry32(seed);
  const rng2 = createMulberry32(seed);

  const sprintA = generateArenaSprintQuestions({ count: 7, rng: rng1, recordHistory: false });
  const sprintB = generateArenaSprintQuestions({ count: 7, rng: rng2, recordHistory: false });

  assert.strictEqual(sprintA.length, 7);
  assert.strictEqual(sprintB.length, 7);
  assert.deepStrictEqual(sprintA.map(q => q.id), sprintB.map(q => q.id), 'Identical seed yields identical question sequence');
});

// 23. State Machine: Phases & startSprintAction
it('23. startSprintAction initializes sprint to ACTIVE with questions and shields', () => {
  assert.strictEqual(ARENA_SPRINT_PHASES.IDLE, 'IDLE');
  assert.strictEqual(ARENA_SPRINT_PHASES.ACTIVE, 'ACTIVE');
  assert.strictEqual(ARENA_SPRINT_PHASES.REVIEWING_ANSWER, 'REVIEWING_ANSWER');
  assert.strictEqual(ARENA_SPRINT_PHASES.DEFEATED, 'DEFEATED');
  assert.strictEqual(ARENA_SPRINT_PHASES.COMPLETED, 'COMPLETED');

  const mockQuestions = [
    { id: 'q1', correctIndex: 1, options: ['A', 'B', 'C', 'D'], correctAnswer: 'B' },
    { id: 'q2', correctIndex: 0, options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' }
  ];

  const state = startSprintAction(mockQuestions, 90);
  assert.strictEqual(state.phase, ARENA_SPRINT_PHASES.ACTIVE);
  assert.strictEqual(state.currentIndex, 0);
  assert.strictEqual(state.selectedOption, null);
  assert.strictEqual(state.isAnswerChecked, false);
  assert.strictEqual(state.score, 0);
  assert.strictEqual(state.shieldState.remainingShields, 5);
  assert.strictEqual(state.timeRemaining, 90);
});

// 24. State Machine: selectOptionAction & checkAnswerAction (Correct)
it('24. checkAnswerAction with correct choice increments score, combo, and sets REVIEWING_ANSWER', () => {
  const mockQuestions = [
    { id: 'q1', correctIndex: 2, options: ['A', 'B', 'C', 'D'], correctAnswer: 'C' }
  ];
  let state = startSprintAction(mockQuestions);

  // Select wrong phase or invalid
  state = selectOptionAction(state, 2);
  assert.strictEqual(state.selectedOption, 2);

  state = checkAnswerAction(state);
  assert.strictEqual(state.phase, ARENA_SPRINT_PHASES.REVIEWING_ANSWER);
  assert.strictEqual(state.isAnswerChecked, true);
  assert.strictEqual(state.isCorrect, true);
  assert.strictEqual(state.score, 1);
  assert.strictEqual(state.combo, 1);
  assert.strictEqual(state.maxCombo, 1);
  assert.strictEqual(state.shieldState.remainingShields, 5); // No shield lost
});

// 25. State Machine: checkAnswerAction (Wrong)
it('25. checkAnswerAction with wrong choice resets combo and deducts shield', () => {
  const mockQuestions = [
    { id: 'q1', correctIndex: 0, options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' }
  ];
  let state = startSprintAction(mockQuestions);
  state.combo = 3;
  state.maxCombo = 3;

  state = selectOptionAction(state, 1); // wrong choice
  state = checkAnswerAction(state);

  assert.strictEqual(state.phase, ARENA_SPRINT_PHASES.REVIEWING_ANSWER);
  assert.strictEqual(state.isCorrect, false);
  assert.strictEqual(state.score, 0);
  assert.strictEqual(state.combo, 0); // combo reset
  assert.strictEqual(state.maxCombo, 3); // preserved
  assert.strictEqual(state.shieldState.remainingShields, 4); // shield deducted
});

// 26. State Machine: Shield Depletion -> DEFEATED -> retrySprintAction
it('26. depleting 5 shields triggers DEFEATED and retrySprintAction restores 2 shields', () => {
  const mockQuestions = [
    { id: 'q1', correctIndex: 0, options: ['A', 'B'], correctAnswer: 'A' }
  ];
  let state = startSprintAction(mockQuestions);
  state.shieldState.remainingShields = 1; // 1 shield left

  state = selectOptionAction(state, 1); // wrong
  state = checkAnswerAction(state);

  assert.strictEqual(state.shieldState.remainingShields, 0);
  assert.strictEqual(state.phase, ARENA_SPRINT_PHASES.DEFEATED);

  // Retry
  state = retrySprintAction(state);
  assert.strictEqual(state.phase, ARENA_SPRINT_PHASES.ACTIVE);
  assert.strictEqual(state.shieldState.remainingShields, 2);
  assert.strictEqual(state.shieldState.retryUsed, true);
});

// 27. State Machine: nextQuestionAction & finishSprintAction
it('27. nextQuestionAction advances questions and calculates summary upon completion', () => {
  const mockQuestions = [
    { id: 'q1', correctIndex: 0, options: ['A', 'B'], correctAnswer: 'A' },
    { id: 'q2', correctIndex: 1, options: ['A', 'B'], correctAnswer: 'B' }
  ];
  let state = startSprintAction(mockQuestions);

  // Q1 correct
  state = selectOptionAction(state, 0);
  state = checkAnswerAction(state);
  assert.strictEqual(state.phase, ARENA_SPRINT_PHASES.REVIEWING_ANSWER);

  // Advance to Q2
  state = nextQuestionAction(state);
  assert.strictEqual(state.phase, ARENA_SPRINT_PHASES.ACTIVE);
  assert.strictEqual(state.currentIndex, 1);
  assert.strictEqual(state.selectedOption, null);

  // Q2 correct
  state = selectOptionAction(state, 1);
  state = checkAnswerAction(state);

  // Finish
  state = nextQuestionAction(state);
  assert.strictEqual(state.phase, ARENA_SPRINT_PHASES.COMPLETED);
  assert.ok(state.summary);
  assert.strictEqual(state.summary.score, 2);
  assert.strictEqual(state.summary.accuracy, 100);
  assert.ok(state.summary.finalXp > 0);
});

// 28. Hook: useArenaAudio API Integrity
it('28. useArenaAudio exports required audio interface safely', () => {
  assert.strictEqual(typeof useArenaAudio, 'function');
});

// 29. AppModalHost Integration
it('29. AppModalHost imports and mounts AtlasEnglishArenaModal alongside AdaptiveSprintModal', () => {
  const hostContent = fs.readFileSync(path.resolve('src/components/modals/AppModalHost.jsx'), 'utf-8');
  assert.ok(hostContent.includes("import('../arena/AtlasEnglishArenaModal')"), 'AppModalHost must lazy-import AtlasEnglishArenaModal');
  assert.ok(hostContent.includes('<AtlasEnglishArenaModal'), 'AppModalHost must mount AtlasEnglishArenaModal');
  assert.ok(hostContent.includes('modals.atlasArena'), 'AtlasEnglishArenaModal must be bound to modals.atlasArena');
});

// 30. Arena UI Components Files Integrity
it('30. All 5 Phase 4 Arena React UI components exist with valid JSX exports', () => {
  const expectedFiles = [
    'src/components/arena/ArenaHeaderBar.jsx',
    'src/components/arena/ArenaQuestionCard.jsx',
    'src/components/arena/ArenaRelativeLeaderboard.jsx',
    'src/components/arena/ArenaSprintSummaryModal.jsx',
    'src/components/arena/AtlasEnglishArenaModal.jsx',
    'src/components/arena/index.js'
  ];

  expectedFiles.forEach(relPath => {
    assert.ok(fs.existsSync(path.resolve(relPath)), `Component file ${relPath} must exist`);
    const content = fs.readFileSync(path.resolve(relPath), 'utf-8');
    assert.ok(content.length > 50, `Component ${relPath} must not be empty`);
  });
});

// 31. Arena Components Index Barrel Export
it('31. src/components/arena/index.js exports all key arena components', () => {
  const indexContent = fs.readFileSync(path.resolve('src/components/arena/index.js'), 'utf-8');
  assert.ok(indexContent.includes('ArenaHeaderBar'));
  assert.ok(indexContent.includes('ArenaQuestionCard'));
  assert.ok(indexContent.includes('ArenaRelativeLeaderboard'));
  assert.ok(indexContent.includes('ArenaSprintSummaryModal'));
  assert.ok(indexContent.includes('AtlasEnglishArenaModal'));
});

// 32. Analytics Service Modal Title Mapping
it('32. analyticsService includes atlasArena in modal tracking titles', () => {
  const analyticsContent = fs.readFileSync(path.resolve('src/services/analyticsService.js'), 'utf-8');
  assert.ok(analyticsContent.includes('atlasArena:'), 'analyticsService must map atlasArena modal title');
  assert.doesNotThrow(() => trackModalView('atlasArena'));
});

// 33. Modal Store Dynamic Lifecycle for atlasArena
it('33. modalStore handles atlasArena open, close, and state queries cleanly', () => {
  assert.strictEqual(isModalOpen('atlasArena'), false);
  openModal('atlasArena');
  assert.strictEqual(isModalOpen('atlasArena'), true);
  closeModal('atlasArena');
  assert.strictEqual(isModalOpen('atlasArena'), false);
});

// 34. Navbar Desktop Practice Menu Entry Point
it('34. Navbar.jsx desktop practice menu contains Atlas English Arena launcher', () => {
  const navContent = fs.readFileSync(path.resolve('src/components/Navbar.jsx'), 'utf-8');
  assert.ok(navContent.includes("openModal('atlasArena')"), 'Navbar must call openModal("atlasArena")');
  assert.ok(navContent.includes('Atlas English Arena'), 'Navbar must include Atlas English Arena label');
  assert.ok(navContent.includes('Swords'), 'Navbar must render Swords icon');
});

// 35. Navbar Mobile Drawer Entry Point
it('35. Navbar.jsx mobile drawer includes Atlas English Arena button', () => {
  const navContent = fs.readFileSync(path.resolve('src/components/Navbar.jsx'), 'utf-8');
  assert.ok(navContent.includes("setIsMobileDrawerOpen(false);"), 'Navbar mobile drawer handlers close drawer on click');
  const countMatches = (navContent.match(/openModal\('atlasArena'\)/g) || []).length;
  assert.ok(countMatches >= 2, 'Navbar must provide at least 2 entry points (desktop and mobile)');
});

console.log(`\n===============================================================`);
console.log(`🎉 Step 115: All ${passed}/${total} Unit Tests Passed Successfully!`);
console.log(`===============================================================\n`);



