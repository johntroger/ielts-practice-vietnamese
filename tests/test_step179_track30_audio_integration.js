import assert from 'assert';
import { track30TransportConversations } from '../src/data/listening/track30TransportConversations.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS } from '../src/data/arenaQuestionTranslations.js';

console.log('🧪 Testing Step 179: Track 30 Audio Integration, Micro-Drills & Arena Question Bank...');

// 1. Verify track30TransportConversations Task Metadata
assert.ok(track30TransportConversations, 'track30TransportConversations exists');
assert.strictEqual(track30TransportConversations.id, 'ielts-listening-track30-transport-conversations');
assert.strictEqual(track30TransportConversations.audioUrl, 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track30-transport-travel-conversations.mp3');
assert.strictEqual(track30TransportConversations.totalQuestions, 10);
assert.strictEqual(track30TransportConversations.parts.length, 2);
assert.ok(track30TransportConversations.titleEn, 'Has English title');
assert.ok(track30TransportConversations.descriptionEn, 'Has English description');

// 2. Verify all 10 questions across Part 1 & Part 2
const allQuestions = track30TransportConversations.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
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
const t30Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track30-transport-conversations');
assert.ok(t30Test, 'Track 30 is registered in INITIAL_LISTENING_TESTS');
assert.ok(INITIAL_LISTENING_TESTS.some(t => t.id === 'ielts-listening-track30-transport-conversations'), 'Track 30 is present in INITIAL_LISTENING_TESTS');

// 4. Verify Track 30 Micro-Drills in LISTENING_MICRO_DRILLS
const t30Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track30'));
assert.strictEqual(t30Drills.length, 4, 'Must have 4 Track 30 micro-drills');

t30Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track30-transport-travel-conversations'), `Drill ${d.id} has valid Track 30 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be greater than clipStart`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

const dictationDrill = t30Drills.find(d => d.id === 'ldrill-dict-track30-motorway-fog-jams');
assert.ok(dictationDrill, 'Must include dictation drill for Track 30');
assert.ok(dictationDrill.targetTranscript, 'Dictation drill must have targetTranscript');
assert.ok(dictationDrill.audioClipTipEn, 'Dictation drill must have audioClipTipEn');

// 5. Verify Track 30 Arena Questions & Metadata
const t30ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.id && q.id.includes('_t30'));
assert.strictEqual(t30ArenaQuestions.length, 5, 'Must have 5 Track 30 arena questions');

t30ArenaQuestions.forEach(q => {
  assert.ok(q.isR2Audio, `Arena question ${q.id} must have isR2Audio flag`);
  assert.ok(q.audioUrl.includes('track30-transport-travel-conversations'), `Arena question ${q.id} has Track 30 audio`);
  assert.ok(q.clipStart >= 0, `Arena question ${q.id} must have clipStart`);
  assert.ok(q.clipEnd > q.clipStart, `Arena question ${q.id} must have clipEnd`);
  assert.ok(q.trackLabel.includes('Track 30'), `Arena question ${q.id} must have Track 30 trackLabel`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Arena question ${q.id} must have >= 2 options`);
  assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Arena question ${q.id} correct answer matches options`);
  assert.ok(q.explanationEn, `Arena question ${q.id} must have explanationEn`);
});

// 6. Verify Arena Translations
const t30Ids = [
  'easy_lis_bus_interval_t30',
  'med_lis_train_replacement_bus_t30',
  'med_lis_bristol_motorway_fog_t30',
  'hard_lis_car_tomorrow_reason_t30',
  'easy_lis_motorbike_gap_t30'
];
t30Ids.forEach(id => {
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation must exist for ${id}`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.contextEn, `Translation ${id} must have contextEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);
});

console.log('===============================================================');
console.log('🎉 Step 179: All 26/26 Unit Tests Passed Successfully!');
console.log('===============================================================\n');
