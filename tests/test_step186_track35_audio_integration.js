import assert from 'node:assert';
import { track35TransportBenefitsRecommendations } from '../src/data/listening/track35TransportBenefitsRecommendations.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_BASE_QUESTION_BANK, ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS, getLocalizedArenaQuestion } from '../src/data/arenaQuestionTranslations.js';

console.log('--- TEST STEP 186: Track 35 Audio Integration, Micro-Drills & Arena Question Bank ---');

// 1. Verify Track 35 Test Dataset Metadata
assert.ok(track35TransportBenefitsRecommendations, 'track35TransportBenefitsRecommendations exists');
assert.strictEqual(track35TransportBenefitsRecommendations.id, 'ielts-listening-track35-transport-benefits-recommendations');
assert.strictEqual(track35TransportBenefitsRecommendations.audioDuration, 223);
assert.ok(track35TransportBenefitsRecommendations.audioUrl.includes('track35-transport-benefits-recommendations.mp3'));
assert.strictEqual(track35TransportBenefitsRecommendations.totalQuestions, 10);
assert.strictEqual(track35TransportBenefitsRecommendations.parts.length, 2);
assert.ok(track35TransportBenefitsRecommendations.titleEn, 'Has English title');
assert.ok(track35TransportBenefitsRecommendations.descriptionEn, 'Has English description');

// Verify Question-level completeness and English UI consistency
const allQuestions = track35TransportBenefitsRecommendations.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
assert.strictEqual(allQuestions.length, 10, 'Must have exactly 10 questions across both parts');

allQuestions.forEach((q, idx) => {
  assert.ok(q.id, `Question ${idx + 1} must have an id`);
  assert.ok(q.questionText, `Question ${idx + 1} must have questionText`);
  assert.ok(q.questionTextEn, `Question ${idx + 1} must have questionTextEn`);
  assert.ok(q.answer || q.correctAnswer, `Question ${idx + 1} must have answer key`);
  assert.ok(q.explanationEn, `Question ${idx + 1} must have English explanation`);
  assert.ok(q.audioTimestamp >= 0 && q.audioTimestamp <= 223, `Question ${idx + 1} timestamp must be <= 223s`);
});

// 2. Verify Registration in INITIAL_LISTENING_TESTS
const t35Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track35-transport-benefits-recommendations');
assert.ok(t35Test, 'Track 35 must be registered in INITIAL_LISTENING_TESTS');
assert.strictEqual(INITIAL_LISTENING_TESTS[0].id, 'ielts-listening-track35-transport-benefits-recommendations', 'Track 35 must be prepended at index 0');

// 3. Verify Track 35 Micro-Drills
const t35Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track35'));
assert.strictEqual(t35Drills.length, 4, 'Must have 4 Track 35 micro-drills');

t35Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track35-transport-benefits-recommendations'), `Drill ${d.id} has valid Track 35 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart && d.clipEnd <= 223, `Drill ${d.id} clipEnd must be <= 223s`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

// 4. Verify Arena Question Bank Integration
const t35ArenaKeys = [
  'med_lis_transit_mode_winner_t35',
  'hard_lis_visitor_retail_rationale_t35',
  'easy_lis_exercise_health_winner_t35',
  'med_lis_pollution_park_ride_t35',
  'hard_lis_safety_cyclist_blindspot_t35'
];

t35ArenaKeys.forEach(k => {
  const baseQ = ARENA_BASE_QUESTION_BANK.find(q => q.id === k);
  assert.ok(baseQ, `Arena Base question bank must contain ${k}`);
  assert.ok(baseQ.promptEn, `${k} must have promptEn`);
  assert.ok(baseQ.explanationEn, `${k} must have explanationEn`);
  assert.ok(baseQ.optionsEn && baseQ.optionsEn.length === 4, `${k} must have 4 optionsEn`);

  const hydratedQ = ARENA_QUESTION_BANK.find(q => q.id === k);
  assert.ok(hydratedQ, `Hydrated Arena Question bank must contain ${k}`);
  assert.strictEqual(hydratedQ.isR2Audio, true, `${k} must have isR2Audio flag`);
  assert.ok(hydratedQ.audioUrl.includes('track35-transport-benefits-recommendations'), `${k} must have Track 35 audioUrl`);
  assert.ok(hydratedQ.clipStart >= 0 && hydratedQ.clipEnd <= 223, `${k} audio clip must be within 0 - 223s`);

  // Verify translation mapping
  assert.ok(ARENA_QUESTION_TRANSLATIONS[k], `${k} must be in ARENA_QUESTION_TRANSLATIONS`);
  const localizedEn = getLocalizedArenaQuestion(hydratedQ, true);
  assert.strictEqual(localizedEn.prompt, hydratedQ.promptEn, `${k} localized English prompt matches`);
});

console.log('✅ STEP 186 VERIFIED: Track 35 complete test dataset, 4 micro-drills, 5 Arena questions, R2 audio metadata & full bilingual localization passed!');
