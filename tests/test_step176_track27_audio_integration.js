import assert from 'assert';
import { track27EnvironmentalEngineer } from '../src/data/listening/track27EnvironmentalEngineer.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS } from '../src/data/arenaQuestionTranslations.js';

console.log('🧪 Testing Step 176: Track 27 Audio Integration, Micro-Drills & Arena Question Bank...');

// 1. Verify track27EnvironmentalEngineer Task Metadata
assert.ok(track27EnvironmentalEngineer, 'track27EnvironmentalEngineer exists');
assert.strictEqual(track27EnvironmentalEngineer.id, 'ielts-listening-track27-environmental-engineer');
assert.strictEqual(track27EnvironmentalEngineer.audioUrl, 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track27-environmental-engineer-isolation.mp3');
assert.strictEqual(track27EnvironmentalEngineer.totalQuestions, 10);
assert.strictEqual(track27EnvironmentalEngineer.parts.length, 2);
assert.ok(track27EnvironmentalEngineer.titleEn, 'Has English title');
assert.ok(track27EnvironmentalEngineer.descriptionEn, 'Has English description');

// 2. Verify all 10 questions across Part 1 & Part 2
const allQuestions = track27EnvironmentalEngineer.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
assert.strictEqual(allQuestions.length, 10, 'Must have exactly 10 questions across both parts');

allQuestions.forEach((q, idx) => {
  assert.ok(q.id, `Question ${idx + 1} must have id`);
  assert.ok(q.questionText, `Question ${idx + 1} must have questionText`);
  assert.ok(q.questionTextEn, `Question ${idx + 1} must have questionTextEn`);
  assert.ok(q.answer || q.correctAnswer, `Question ${idx + 1} must have answer key`);
  assert.ok(q.explanationEn, `Question ${idx + 1} must have English explanation`);
  assert.ok(q.audioTimestamp >= 0, `Question ${idx + 1} must have valid timestamp`);
});

// 3. Verify Registration in INITIAL_LISTENING_TESTS
const t27Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track27-environmental-engineer');
assert.ok(t27Test, 'Track 27 is registered in INITIAL_LISTENING_TESTS');
assert.strictEqual(INITIAL_LISTENING_TESTS[0].id, 'ielts-listening-track27-environmental-engineer', 'Track 27 is the top test in INITIAL_LISTENING_TESTS');

// 4. Verify Track 27 Micro-Drills in LISTENING_MICRO_DRILLS
const t27Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track27'));
assert.strictEqual(t27Drills.length, 4, 'Must have 4 Track 27 micro-drills');

t27Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track27-environmental-engineer-isolation'), `Drill ${d.id} has valid Track 27 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be greater than clipStart`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

const dictationDrill = t27Drills.find(d => d.id === 'ldrill-dict-track27-ventilation-emergency');
assert.ok(dictationDrill, 'Must include dictation drill for Track 27');
assert.ok(dictationDrill.audioClipTipEn, 'Dictation drill must have audioClipTipEn');

// 5. Verify Arena Questions for Track 27
const t27ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.id && q.id.includes('t27'));
assert.strictEqual(t27ArenaQuestions.length, 5, 'Must have 5 Track 27 arena questions');

t27ArenaQuestions.forEach(q => {
  assert.ok(q.isR2Audio, `Arena question ${q.id} must have isR2Audio flag`);
  assert.ok(q.audioUrl.includes('track27-environmental-engineer-isolation'), `Arena question ${q.id} has Track 27 audio`);
  assert.ok(q.clipStart >= 0, `Arena question ${q.id} must have clipStart`);
  assert.ok(q.clipEnd > q.clipStart, `Arena question ${q.id} must have clipEnd`);
  assert.ok(q.trackLabel.includes('Track 27'), `Arena question ${q.id} must have Track 27 trackLabel`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 3, `Arena question ${q.id} must have >= 3 options`);
  assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Arena question ${q.id} correct answer matches options`);
  assert.ok(q.explanationEn, `Arena question ${q.id} must have explanationEn`);
});

// 6. Verify Arena Translations
const t27Ids = [
  'easy_lis_tutor_role_t27',
  'med_lis_positive_three_months_t27',
  'med_lis_joe_vital_responsibility_t27',
  'hard_lis_ventilation_crisis_t27',
  'easy_lis_media_contrast_t27'
];
t27Ids.forEach(id => {
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation must exist for ${id}`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.contextEn, `Translation ${id} must have contextEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);
});

console.log('===============================================================');
console.log('🎉 Step 176: All 26/26 Unit Tests Passed Successfully!');
console.log('===============================================================\n');
