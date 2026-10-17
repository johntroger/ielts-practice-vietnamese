import assert from 'assert';
import { track23PublicOpinions } from '../src/data/listening/track23PublicOpinions.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK, getQuestionsByTierAndTopic } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS } from '../src/data/arenaQuestionTranslations.js';

console.log('🧪 Testing Step 171: Track 23 Audio Integration, Micro-Drills & Arena Question Bank...');

// 1. Verify track23PublicOpinions Task Metadata
assert.ok(track23PublicOpinions, 'track23PublicOpinions exists');
assert.strictEqual(track23PublicOpinions.id, 'ielts-listening-track23-public-opinions');
assert.strictEqual(track23PublicOpinions.audioUrl, 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track23-public-policies-and-opinions.mp3');
assert.strictEqual(track23PublicOpinions.totalQuestions, 10);
assert.strictEqual(track23PublicOpinions.parts.length, 1);
assert.ok(track23PublicOpinions.titleEn, 'Has English title');
assert.ok(track23PublicOpinions.descriptionEn, 'Has English description');

// 2. Verify all 10 questions in Part 1
const part = track23PublicOpinions.parts[0];
const allQuestions = part.questionGroups.flatMap(g => g.questions);
assert.strictEqual(allQuestions.length, 10, 'Must have exactly 10 questions');

allQuestions.forEach((q, idx) => {
  assert.ok(q.id, `Question ${idx + 1} must have id`);
  assert.ok(q.questionText, `Question ${idx + 1} must have questionText`);
  assert.ok(q.answer || q.correctAnswer, `Question ${idx + 1} must have answer key`);
  assert.ok(q.explanationEn, `Question ${idx + 1} must have English explanation`);
  assert.ok(q.explanationVi, `Question ${idx + 1} must have Vietnamese explanation`);
  assert.ok(q.evidenceTimestamp >= 0, `Question ${idx + 1} must have valid timestamp`);
});

// 3. Verify Registration in INITIAL_LISTENING_TESTS
const firstTest = INITIAL_LISTENING_TESTS[0];
assert.strictEqual(firstTest.id, 'ielts-listening-track23-public-opinions', 'Track 23 is registered as first test in INITIAL_LISTENING_TESTS');

// 4. Verify Track 23 Micro-Drills in LISTENING_MICRO_DRILLS
const t23Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track23'));
assert.strictEqual(t23Drills.length, 4, 'Must have 4 Track 23 micro-drills');

t23Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track23-public-policies-and-opinions'), `Drill ${d.id} has valid Track 23 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be greater than clipStart`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

const dictationDrill = t23Drills.find(d => d.id === 'ldrill-dict-track23-dental-seniors');
assert.ok(dictationDrill, 'Must include dictation drill for Track 23');
assert.ok(dictationDrill.audioClipTipEn, 'Dictation drill must have audioClipTipEn');

// 5. Verify Arena Questions for Track 23
const t23ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.id && q.id.includes('t23'));
assert.strictEqual(t23ArenaQuestions.length, 5, 'Must have 5 Track 23 arena questions');

t23ArenaQuestions.forEach(q => {
  assert.ok(q.isR2Audio, `Arena question ${q.id} must have isR2Audio flag`);
  assert.ok(q.audioUrl.includes('track23-public-policies-and-opinions'), `Arena question ${q.id} has Track 23 audio`);
  assert.ok(q.clipStart >= 0, `Arena question ${q.id} must have clipStart`);
  assert.ok(q.clipEnd > q.clipStart, `Arena question ${q.id} must have clipEnd`);
  assert.ok(q.trackLabel.includes('Track 23'), `Arena question ${q.id} must have Track 23 trackLabel`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 3, `Arena question ${q.id} must have >= 3 options`);
  assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Arena question ${q.id} correct answer matches options`);
  assert.ok(q.explanationEn, `Arena question ${q.id} must have explanationEn`);
});

// 6. Verify Arena Translations
const t23Ids = [
  'easy_lis_bus_fare_time_t23',
  'med_lis_tax_impact_t23',
  'med_lis_air_strike_train_t23',
  'hard_lis_striker_valuation_t23',
  'easy_lis_dental_age_t23'
];
t23Ids.forEach(id => {
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation must exist for ${id}`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.contextEn, `Translation ${id} must have contextEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);
});

console.log('===============================================================');
console.log('🎉 Step 171: All 25/25 Unit Tests Passed Successfully!');
console.log('===============================================================\n');
