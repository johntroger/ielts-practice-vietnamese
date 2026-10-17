import assert from 'assert';
import { track32UrbanTrafficHotspots } from '../src/data/listening/track32UrbanTrafficHotspots.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS } from '../src/data/arenaQuestionTranslations.js';

console.log('🧪 Testing Step 183: Track 32 Audio Integration, Micro-Drills & Arena Question Bank...');

// 1. Verify track32UrbanTrafficHotspots Task Metadata
assert.ok(track32UrbanTrafficHotspots, 'track32UrbanTrafficHotspots exists');
assert.strictEqual(track32UrbanTrafficHotspots.id, 'ielts-listening-track32-urban-traffic-hotspots');
assert.strictEqual(track32UrbanTrafficHotspots.audioUrl, 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track32-urban-traffic-hotspots-mapping.mp3');
assert.strictEqual(track32UrbanTrafficHotspots.totalQuestions, 10);
assert.strictEqual(track32UrbanTrafficHotspots.parts.length, 2);
assert.ok(track32UrbanTrafficHotspots.titleEn, 'Has English title');
assert.ok(track32UrbanTrafficHotspots.descriptionEn, 'Has English description');

// 2. Verify all 10 questions across Part 1 & Part 2
const allQuestions = track32UrbanTrafficHotspots.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
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
const t32Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track32-urban-traffic-hotspots');
assert.ok(t32Test, 'Track 32 is registered in INITIAL_LISTENING_TESTS');
assert.strictEqual(INITIAL_LISTENING_TESTS[0].id, 'ielts-listening-track32-urban-traffic-hotspots', 'Track 32 is the top test in INITIAL_LISTENING_TESTS');

// 4. Verify Track 32 Micro-Drills in LISTENING_MICRO_DRILLS
const t32Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track32'));
assert.strictEqual(t32Drills.length, 4, 'Must have 4 Track 32 micro-drills');

t32Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track32-urban-traffic-hotspots-mapping'), `Drill ${d.id} has valid Track 32 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be greater than clipStart`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

const dictationDrill = t32Drills.find(d => d.id === 'ldrill-dict-track32-lorry-deliveries');
assert.ok(dictationDrill, 'Must include dictation drill for Track 32');
assert.ok(dictationDrill.targetTranscript, 'Dictation drill must have targetTranscript');
assert.ok(dictationDrill.audioClipTipEn, 'Dictation drill must have audioClipTipEn');

// 5. Verify Track 32 Arena Questions & Metadata
const t32ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.id && q.id.includes('_t32'));
assert.strictEqual(t32ArenaQuestions.length, 5, 'Must have 5 Track 32 arena questions');

t32ArenaQuestions.forEach(q => {
  assert.ok(q.isR2Audio, `Arena question ${q.id} must have isR2Audio flag`);
  assert.ok(q.audioUrl.includes('track32-urban-traffic-hotspots-mapping'), `Arena question ${q.id} has Track 32 audio`);
  assert.ok(q.clipStart >= 0, `Arena question ${q.id} must have clipStart`);
  assert.ok(q.clipEnd > q.clipStart, `Arena question ${q.id} must have clipEnd`);
  assert.ok(q.trackLabel.includes('Track 32'), `Arena question ${q.id} must have Track 32 trackLabel`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Arena question ${q.id} must have >= 2 options`);
  assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Arena question ${q.id} correct answer matches options`);
  assert.ok(q.explanationEn, `Arena question ${q.id} must have explanationEn`);
});

// 6. Verify Arena Translations
const t32Ids = [
  'easy_lis_town_hall_worst_t32',
  'med_lis_cinema_junction_t32',
  'hard_lis_bus_manoeuvre_issue_t32',
  'med_lis_central_park_lorries_t32',
  'easy_lis_lorry_restriction_solution_t32'
];
t32Ids.forEach(id => {
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation must exist for ${id}`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.contextEn, `Translation ${id} must have contextEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);
});

console.log('===============================================================');
console.log('🎉 Step 183: All 26/26 Unit Tests Passed Successfully!');
console.log('===============================================================\n');
