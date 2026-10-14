/**
 * test_step130_bulletproof_mastery_and_7slot_flow.js
 * Verification test for Step 130:
 * 3-Tier Mastery (2-Hit Rule), Ebbinghaus 14-Day Decay, Safe Shuffling & 7-Slot Blueprint Flow
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {
  getMasteryState,
  saveMasteryState,
  recordQuestionResult,
  getQuestionMasteryStatus,
  getQuestionMeta,
  getEligibleRevengeQuestions,
  recordMatchCompleted,
  resetMasteryState,
  EBBINGHAUS_DECAY_MS,
  REVENGE_XP_BONUS
} from '../src/services/gamification/arenaMasteryService.js';
import {
  shuffleQuestionOptions,
  generateArenaSprintQuestions
} from '../src/adapters/sprintQuestionAdapter.js';
import {
  INITIAL_SPRINT_STATE,
  startSprintAction,
  checkAnswerAction,
  finishSprintAction
} from '../src/hooks/useArenaSprintEngine.js';

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

console.log('🧪 Testing Step 130: Bulletproof Mastery, Ebbinghaus 14-Day Decay & 7-Slot Blueprint...\n');

// 1. Mastery Lifecycle & 2-Hit Rule
it('arenaMasteryService enforces 2-Hit Mastery Rule (Correct twice consecutively -> mastered)', () => {
  resetMasteryState();
  const qId = 'test_q_101';

  // Attempt 1: Correct -> 'familiar'
  const res1 = recordQuestionResult({ questionId: qId, isCorrect: true, matchIndex: 1 });
  assert.strictEqual(res1.status, 'familiar', 'First correct answer should transition to familiar');
  assert.strictEqual(getQuestionMasteryStatus(qId), 'familiar');

  // Attempt 2: Correct again -> 'mastered'
  const res2 = recordQuestionResult({ questionId: qId, isCorrect: true, matchIndex: 2 });
  assert.strictEqual(res2.status, 'mastered', 'Second consecutive correct answer should transition to mastered');
  assert.strictEqual(getQuestionMasteryStatus(qId), 'mastered');
});

it('arenaMasteryService resets consecutive count and marks mistake on wrong answer', () => {
  resetMasteryState();
  const qId = 'test_q_102';

  // 1 correct -> familiar
  recordQuestionResult({ questionId: qId, isCorrect: true, matchIndex: 1 });
  // 1 wrong -> mistake, consecutive reset to 0
  const resWrong = recordQuestionResult({ questionId: qId, isCorrect: false, matchIndex: 2 });
  assert.strictEqual(resWrong.status, 'mistake');
  assert.strictEqual(getQuestionMasteryStatus(qId), 'mistake');
  const meta = getQuestionMeta(qId);
  assert.strictEqual(meta.consecutiveCorrect, 0);
  assert.strictEqual(meta.wrongCount, 1);
});

// 2. Ebbinghaus Spaced Decay (14 Days)
it('Mastered question decays into refresh_review after 14 days without practice', () => {
  resetMasteryState();
  const qId = 'test_q_103';
  const now = Date.now();

  // Answer correctly twice to achieve Mastered status
  recordQuestionResult({ questionId: qId, isCorrect: true, matchIndex: 1, now });
  recordQuestionResult({ questionId: qId, isCorrect: true, matchIndex: 2, now });
  assert.strictEqual(getQuestionMasteryStatus(qId, now), 'mastered');

  // After 10 days (under 14 days threshold) -> still mastered
  const after10Days = now + (10 * 24 * 60 * 60 * 1000);
  assert.strictEqual(getQuestionMasteryStatus(qId, after10Days), 'mastered');

  // After 15 days (> 14 days Ebbinghaus threshold) -> auto-decays to refresh_review
  const after15Days = now + (15 * 24 * 60 * 60 * 1000);
  assert.strictEqual(getQuestionMasteryStatus(qId, after15Days), 'refresh_review',
    'Question should dynamically decay into refresh_review after 14 days');
});

// 3. Mistake Cooling-Off & Max 1 Revenge Question
it('Enforces exponential backoff: mistake must rest at least 1 match before revenge eligibility', () => {
  resetMasteryState();
  const qId = 'test_q_104';

  // Missed in Match 1
  recordQuestionResult({ questionId: qId, isCorrect: false, matchIndex: 1 });

  // In Match 2 (immediately next match): NOT eligible yet (must rest 1 match)
  const candidate = [{ id: qId, prompt: 'Sample' }];
  const eligibleMatch2 = getEligibleRevengeQuestions(candidate, 2);
  assert.strictEqual(eligibleMatch2.length, 0, 'Must not be eligible in immediately consecutive match');

  // In Match 3 (has rested through Match 2): NOW ELIGIBLE!
  const eligibleMatch3 = getEligibleRevengeQuestions(candidate, 3);
  assert.strictEqual(eligibleMatch3.length, 1, 'Should become eligible after resting 1 match');
});

it('Revenge question clearance awards +5 XP bonus only once (anti-exploit guard)', () => {
  resetMasteryState();
  const qId = 'test_q_105';

  // Missed in match 1
  recordQuestionResult({ questionId: qId, isCorrect: false, matchIndex: 1 });

  // Cleared in match 3 (Revenge success) -> gets +5 XP bonus
  const clearRes1 = recordQuestionResult({ questionId: qId, isCorrect: true, matchIndex: 3 });
  assert.strictEqual(clearRes1.isRevengeCleared, true);
  assert.strictEqual(clearRes1.bonusXp, REVENGE_XP_BONUS);

  // If asked again in match 4 and answered correctly -> NO double-claiming revenge bonus
  const clearRes2 = recordQuestionResult({ questionId: qId, isCorrect: true, matchIndex: 4 });
  assert.strictEqual(clearRes2.bonusXp, 0, 'Revenge XP bonus cannot be claimed twice on same cleared mistake');
});

// 4. Safe Distractor Shuffling (Preserving Cambridge CDI True/False/Not Given)
it('Safe Distractor Shuffling preserves True/False/Not Given standard order and does not shuffle them', () => {
  const tfngQuestion = {
    id: 'tfng_1',
    type: 'tfng',
    options: ['TRUE', 'FALSE', 'NOT GIVEN'],
    correctIndex: 0,
    correctAnswer: 'TRUE'
  };

  // Run 20 iterations with pseudo-RNG
  for (let i = 0; i < 20; i++) {
    const shuffled = shuffleQuestionOptions(tfngQuestion, () => Math.random());
    assert.deepStrictEqual(shuffled.options, ['TRUE', 'FALSE', 'NOT GIVEN'], 'TFNG options must never be shuffled');
    assert.strictEqual(shuffled.correctIndex, 0);
  }
});

it('Safe Distractor Shuffling preserves sequential numeric values', () => {
  const numQuestion = {
    id: 'num_1',
    type: 'multiple_choice',
    options: ['£10', '£20', '£50', '£100'],
    correctIndex: 2,
    correctAnswer: '£50'
  };

  const shuffled = shuffleQuestionOptions(numQuestion, () => 0.5);
  assert.deepStrictEqual(shuffled.options, ['£10', '£20', '£50', '£100'], 'Sequential numbers must not be shuffled');
});

it('Safe Distractor Shuffling randomizes general multiple-choice options while keeping correctIndex pointer accurate', () => {
  const vocabQuestion = {
    id: 'vocab_1',
    type: 'spelling',
    options: ['Accommodation', 'Acommodation', 'Accomodation', 'Acomodation'],
    correctIndex: 0,
    correctAnswer: 'Accommodation'
  };

  const deterministicRng = () => 0.99; // Will swap positions
  const shuffled = shuffleQuestionOptions(vocabQuestion, deterministicRng);
  assert.strictEqual(shuffled.options[shuffled.correctIndex], 'Accommodation', 'correctIndex must point to correct answer after shuffle');
});

// 5. 7-Slot Blueprint (The 7-Slot Flow)
it('generateArenaSprintQuestions produces exactly 7 questions by default and includes at most 1 revenge question', () => {
  resetMasteryState();
  const questions = generateArenaSprintQuestions({ count: 7, difficulty: 'medium' });
  assert.strictEqual(questions.length, 7, 'Should produce exactly 7 sprint questions');

  // Verify Slot 7 is Boss Question
  const lastQ = questions[questions.length - 1];
  assert.strictEqual(lastQ.isBossQuestion, true, 'Question 7 must be designated as Boss Question');

  // Count revenge questions
  const revengeCount = questions.filter(q => q.isRevengeQuestion).length;
  assert(revengeCount <= 1, 'There must be at most 1 revenge question per match');
});

// 6. Sprint Engine Integration (useArenaSprintEngine)
it('useArenaSprintEngine tracks revengeClearedCount and includes revengeBonusXp in summary', () => {
  const sampleQuestions = [
    { id: 'q1', correctIndex: 0, options: ['A', 'B'], isRevengeQuestion: true },
    { id: 'q2', correctIndex: 1, options: ['A', 'B'], isBossQuestion: true }
  ];

  let state = startSprintAction(sampleQuestions, 180, 'medium');
  assert.strictEqual(state.revengeClearedCount, 0);
  assert.strictEqual(state.revengeBonusXp, 0);

  // Answer Q1 correctly (Revenge question)
  state = { ...state, selectedOption: 0 };
  state = checkAnswerAction(state);
  assert.strictEqual(state.isCorrect, true);
  assert.strictEqual(state.revengeClearedCount, 1);
  assert.strictEqual(state.revengeBonusXp, 5);

  // Complete sprint
  const finishState = finishSprintAction(state);
  assert.strictEqual(finishState.summary.revengeBonusXp, 5);
  assert.strictEqual(finishState.summary.revengeClearedCount, 1);
});

// 7. Visual Components Inspection
it('ArenaQuestionCard.jsx renders Revenge badge and revenge cleared celebration', () => {
  const cardSource = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');
  assert(cardSource.includes("question.isRevengeQuestion"), 'Must check question.isRevengeQuestion');
  assert(cardSource.includes("REVENGE (+5 XP)") || cardSource.includes("CÂU PHỤC THÙ (+5 XP)"), 'Must render revenge badge');
  assert(cardSource.includes("Revenge Cleared! (+5 XP)") || cardSource.includes("Phục Thù Thành Công! (+5 XP)"), 'Must render revenge cleared callout');
});

it('AtlasEnglishArenaModal.jsx pre-fetches audio assets when sprint starts', () => {
  const modalSource = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
  assert(modalSource.includes("audio.preload = 'auto'"), 'Must pre-fetch audio assets to eliminate in-match latency');
});

console.log(`\n===============================================================`);
console.log(`✅ All ${passed}/${total} Step 130 bulletproof mastery & 7-slot flow tests passed cleanly!`);
console.log(`===============================================================\n`);
