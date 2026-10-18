import assert from 'node:assert';
import { track36AgreementDisagreementIntonation } from '../src/data/listening/track36AgreementDisagreementIntonation.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_BASE_QUESTION_BANK, ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS, getLocalizedArenaQuestion } from '../src/data/arenaQuestionTranslations.js';

console.log('--- TEST STEP 187: Track 36 Audio Integration, Micro-Drills & Arena Question Bank ---');

// 1. Verify Track 36 Test Dataset Metadata
assert.ok(track36AgreementDisagreementIntonation, 'track36AgreementDisagreementIntonation exists');
assert.strictEqual(track36AgreementDisagreementIntonation.id, 'ielts-listening-track36-agreement-disagreement-intonation');
assert.strictEqual(track36AgreementDisagreementIntonation.audioDuration, 47);
assert.ok(track36AgreementDisagreementIntonation.audioUrl.includes('track36-agreement-disagreement-intonation.mp3'));
assert.strictEqual(track36AgreementDisagreementIntonation.totalQuestions, 10);
assert.strictEqual(track36AgreementDisagreementIntonation.parts.length, 2);
assert.ok(track36AgreementDisagreementIntonation.titleEn, 'Has English title');
assert.ok(track36AgreementDisagreementIntonation.descriptionEn, 'Has English description');

// Verify Question-level completeness and English UI consistency
const allQuestions = track36AgreementDisagreementIntonation.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
assert.strictEqual(allQuestions.length, 10, 'Must have exactly 10 questions across both parts');

allQuestions.forEach((q, idx) => {
  assert.ok(q.id, `Question ${idx + 1} must have an id`);
  assert.ok(q.questionText, `Question ${idx + 1} must have questionText`);
  assert.ok(q.questionTextEn, `Question ${idx + 1} must have questionTextEn`);
  assert.ok(q.answer || q.correctAnswer, `Question ${idx + 1} must have answer key`);
  assert.ok(q.explanationEn, `Question ${idx + 1} must have English explanation`);
  assert.ok(q.audioTimestamp >= 0 && q.audioTimestamp <= 47, `Question ${idx + 1} timestamp must be <= 47s`);
});

// 2. Verify Registration in INITIAL_LISTENING_TESTS
const t36Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track36-agreement-disagreement-intonation');
assert.ok(t36Test, 'Track 36 must be registered in INITIAL_LISTENING_TESTS');
assert.ok(INITIAL_LISTENING_TESTS.slice(0, 5).some(t => t.id === 'ielts-listening-track36-agreement-disagreement-intonation'), 'Track 36 is near top of INITIAL_LISTENING_TESTS');

// 3. Verify Track 36 Micro-Drills
const t36Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track36'));
assert.strictEqual(t36Drills.length, 4, 'Must have 4 Track 36 micro-drills');

t36Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track36-agreement-disagreement-intonation'), `Drill ${d.id} has valid Track 36 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart && d.clipEnd <= 47, `Drill ${d.id} clipEnd must be <= 47s`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

// 4. Verify Arena Question Bank Integration
const t36ArenaKeys = [
  'easy_lis_discourse_hedge_t36',
  'med_lis_concession_reality_t36',
  'easy_lis_agenda_transition_t36',
  'hard_lis_persuasion_common_ground_t36',
  'med_lis_empirical_town_hall_t36'
];

t36ArenaKeys.forEach(k => {
  const baseQ = ARENA_BASE_QUESTION_BANK.find(q => q.id === k);
  assert.ok(baseQ, `Arena Base question bank must contain ${k}`);
  assert.ok(baseQ.promptEn, `${k} must have promptEn`);
  assert.ok(baseQ.explanationEn, `${k} must have explanationEn`);
  assert.ok(baseQ.optionsEn && baseQ.optionsEn.length === 4, `${k} must have 4 optionsEn`);

  const hydratedQ = ARENA_QUESTION_BANK.find(q => q.id === k);
  assert.ok(hydratedQ, `Hydrated Arena Question bank must contain ${k}`);
  assert.strictEqual(hydratedQ.isR2Audio, true, `${k} must have isR2Audio flag`);
  assert.ok(hydratedQ.audioUrl.includes('track36-agreement-disagreement-intonation'), `${k} must have Track 36 audioUrl`);
  assert.ok(hydratedQ.clipStart >= 0 && hydratedQ.clipEnd <= 47, `${k} audio clip must be within 0 - 47s`);

  // Verify translation mapping
  assert.ok(ARENA_QUESTION_TRANSLATIONS[k], `${k} must be in ARENA_QUESTION_TRANSLATIONS`);
  const localizedEn = getLocalizedArenaQuestion(hydratedQ, true);
  assert.strictEqual(localizedEn.prompt, hydratedQ.promptEn, `${k} localized English prompt matches`);
});

console.log('✅ STEP 187 VERIFIED: Track 36 complete test dataset, 4 micro-drills, 5 Arena questions, R2 audio metadata & full bilingual localization passed!');
