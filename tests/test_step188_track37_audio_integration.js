import assert from 'node:assert';
import { track37AshtownUrbanTransformation } from '../src/data/listening/track37AshtownUrbanTransformation.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_BASE_QUESTION_BANK, ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS, getLocalizedArenaQuestion } from '../src/data/arenaQuestionTranslations.js';

console.log('--- TEST STEP 188: Track 37 Audio Integration, Micro-Drills & Arena Question Bank ---');

// 1. Verify Track 37 Test Dataset Metadata
assert.ok(track37AshtownUrbanTransformation, 'track37AshtownUrbanTransformation exists');
assert.strictEqual(track37AshtownUrbanTransformation.id, 'ielts-listening-track37-ashtown-urban-transformation');
assert.strictEqual(track37AshtownUrbanTransformation.audioDuration, 288);
assert.ok(track37AshtownUrbanTransformation.audioUrl.includes('track37-ashtown-urban-transformation.mp3'));
assert.strictEqual(track37AshtownUrbanTransformation.totalQuestions, 10);
assert.strictEqual(track37AshtownUrbanTransformation.parts.length, 2);
assert.ok(track37AshtownUrbanTransformation.titleEn, 'Has English title');
assert.ok(track37AshtownUrbanTransformation.descriptionEn, 'Has English description');

// Verify Question-level completeness and English UI consistency
const allQuestions = track37AshtownUrbanTransformation.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
assert.strictEqual(allQuestions.length, 10, 'Must have exactly 10 questions across both parts');

allQuestions.forEach((q, idx) => {
  assert.ok(q.id, `Question ${idx + 1} must have an id`);
  assert.ok(q.questionText, `Question ${idx + 1} must have questionText`);
  assert.ok(q.questionTextEn, `Question ${idx + 1} must have questionTextEn`);
  assert.ok(q.answer || q.correctAnswer, `Question ${idx + 1} must have answer key`);
  assert.ok(q.explanationEn, `Question ${idx + 1} must have English explanation`);
  assert.ok(q.audioTimestamp >= 0 && q.audioTimestamp <= 288, `Question ${idx + 1} timestamp must be <= 288s`);
});

// 2. Verify Registration in INITIAL_LISTENING_TESTS
const t37Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track37-ashtown-urban-transformation');
assert.ok(t37Test, 'Track 37 must be registered in INITIAL_LISTENING_TESTS');
assert.ok(INITIAL_LISTENING_TESTS.slice(0, 10).some(t => t.id === 'ielts-listening-track37-ashtown-urban-transformation'), 'Track 37 must be present in top listening tests');

// 3. Verify Track 37 Micro-Drills
const t37Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track37'));
assert.strictEqual(t37Drills.length, 4, 'Must have 4 Track 37 micro-drills');

t37Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track37-ashtown-urban-transformation'), `Drill ${d.id} has valid Track 37 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart && d.clipEnd <= 288, `Drill ${d.id} clipEnd must be <= 288s`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

// 4. Verify Arena Question Bank Integration
const t37ArenaKeys = [
  'med_lis_bus_destination_fall_t37',
  'easy_lis_bypass_unbuilt_status_t37',
  'med_lis_education_job_growth_t37',
  'easy_lis_cinema_relocation_t37',
  'hard_lis_art_college_surgery_t37'
];

t37ArenaKeys.forEach(k => {
  const baseQ = ARENA_BASE_QUESTION_BANK.find(q => q.id === k);
  assert.ok(baseQ, `Arena Base question bank must contain ${k}`);
  assert.ok(baseQ.promptEn, `${k} must have promptEn`);
  assert.ok(baseQ.explanationEn, `${k} must have explanationEn`);
  assert.ok(baseQ.optionsEn && baseQ.optionsEn.length === 4, `${k} must have 4 optionsEn`);

  const hydratedQ = ARENA_QUESTION_BANK.find(q => q.id === k);
  assert.ok(hydratedQ, `Hydrated Arena Question bank must contain ${k}`);
  assert.strictEqual(hydratedQ.isR2Audio, true, `${k} must have isR2Audio flag`);
  assert.ok(hydratedQ.audioUrl.includes('track37-ashtown-urban-transformation'), `${k} must have Track 37 audioUrl`);
  assert.ok(hydratedQ.clipStart >= 0 && hydratedQ.clipEnd <= 288, `${k} audio clip must be within 0 - 288s`);

  // Verify translation mapping
  assert.ok(ARENA_QUESTION_TRANSLATIONS[k], `${k} must be in ARENA_QUESTION_TRANSLATIONS`);
  const localizedEn = getLocalizedArenaQuestion(hydratedQ, true);
  assert.strictEqual(localizedEn.prompt, hydratedQ.promptEn, `${k} localized English prompt matches`);
});

console.log('✅ STEP 188 VERIFIED: Track 37 complete test dataset, 4 micro-drills, 5 Arena questions, R2 audio metadata & full bilingual localization passed!');
