import assert from 'assert';
import { track33TransportProposalsEvaluation } from '../src/data/listening/track33TransportProposalsEvaluation.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS } from '../src/data/arenaQuestionTranslations.js';

console.log('🧪 Testing Step 184: Track 33 Audio Integration, Micro-Drills & Arena Question Bank...');

// 1. Verify track33TransportProposalsEvaluation Task Metadata
assert.ok(track33TransportProposalsEvaluation, 'track33TransportProposalsEvaluation exists');
assert.strictEqual(track33TransportProposalsEvaluation.id, 'ielts-listening-track33-transport-proposals');
assert.strictEqual(track33TransportProposalsEvaluation.audioUrl, 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track33-transport-solutions-evaluation.mp3');
assert.strictEqual(track33TransportProposalsEvaluation.totalQuestions, 10);
assert.strictEqual(track33TransportProposalsEvaluation.parts.length, 2);
assert.ok(track33TransportProposalsEvaluation.titleEn, 'Has English title');
assert.ok(track33TransportProposalsEvaluation.descriptionEn, 'Has English description');

// 2. Verify all 10 questions across Part 1 & Part 2
const allQuestions = track33TransportProposalsEvaluation.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
assert.strictEqual(allQuestions.length, 10, 'Must have exactly 10 questions across both parts');

allQuestions.forEach((q, idx) => {
  assert.ok(q.id, `Question ${idx + 1} must have id`);
  assert.ok(q.questionText, `Question ${idx + 1} must have questionText`);
  assert.ok(q.questionTextEn, `Question ${idx + 1} must have questionTextEn`);
  assert.ok(q.answer || q.correctAnswer, `Question ${idx + 1} must have answer key`);
  assert.ok(q.explanationEn, `Question ${idx + 1} must have English explanation`);
  assert.ok(q.audioTimestamp >= 0 && q.audioTimestamp <= 165, `Question ${idx + 1} must have valid timestamp <= 165s`);
});

// 3. Verify Registration in INITIAL_LISTENING_TESTS
const t33Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track33-transport-proposals');
assert.ok(INITIAL_LISTENING_TESTS.some(t => t.id === 'ielts-listening-track33-transport-proposals'), 'Track 33 is present in INITIAL_LISTENING_TESTS');

// 4. Verify Track 33 Micro-Drills in LISTENING_MICRO_DRILLS
const t33Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track33'));
assert.strictEqual(t33Drills.length, 4, 'Must have 4 Track 33 micro-drills');

t33Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track33-transport-solutions-evaluation'), `Drill ${d.id} has valid Track 33 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart && d.clipEnd <= 165, `Drill ${d.id} clipEnd must be greater than clipStart and <= 165s`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

// Verify specific accuracy of Track 33 timestamps (fixing the 110s bug)
const parkRideDrill = t33Drills.find(d => d.id === 'ldrill-dist-track33-park-and-ride-takeup');
assert.ok(parkRideDrill, 'Must include park-and-ride takeup drill');
assert.strictEqual(parkRideDrill.clipStart, 69.5, 'clipStart must be 69.5s (01:09.5), matching Robert saying "The main problem..."');
assert.strictEqual(parkRideDrill.clipEnd, 89.0, 'clipEnd must be 89.0s (01:29.0), matching the end of Robert\'s statement');

const dictationDrill = t33Drills.find(d => d.id === 'ldrill-dict-track33-tram-expense');
assert.ok(dictationDrill, 'Must include dictation drill for Track 33');
assert.strictEqual(dictationDrill.clipStart, 146.0, 'clipStart must be 146.0s (02:26.0), matching "The initial financial requirements..."');
assert.ok(dictationDrill.targetTranscript, 'Dictation drill must have targetTranscript');
assert.ok(dictationDrill.audioClipTipEn, 'Dictation drill must have audioClipTipEn');

// 5. Verify Track 33 Arena Questions & Metadata
const t33ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.id && q.id.includes('_t33'));
assert.strictEqual(t33ArenaQuestions.length, 5, 'Must have 5 Track 33 arena questions');

t33ArenaQuestions.forEach(q => {
  assert.ok(q.isR2Audio, `Arena question ${q.id} must have isR2Audio flag`);
  assert.ok(q.audioUrl.includes('track33-transport-solutions-evaluation'), `Arena question ${q.id} has Track 33 audio`);
  assert.ok(q.clipStart >= 0, `Arena question ${q.id} must have clipStart`);
  assert.ok(q.clipEnd > q.clipStart && q.clipEnd <= 165, `Arena question ${q.id} must have clipEnd <= 165s`);
  assert.ok(q.trackLabel.includes('Track 33'), `Arena question ${q.id} must have Track 33 trackLabel`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Arena question ${q.id} must have >= 2 options`);
  assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Arena question ${q.id} correct answer matches options`);
  assert.ok(q.explanationEn, `Arena question ${q.id} must have explanationEn`);
});

// 6. Verify Arena Translations
const t33Ids = [
  'easy_lis_bus_lane_displacement_t33',
  'med_lis_park_ride_takeup_t33',
  'hard_lis_pedestrian_delivery_threat_t33',
  'med_lis_tram_network_scope_t33',
  'easy_lis_tram_council_budget_t33'
];
t33Ids.forEach(id => {
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation must exist for ${id}`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.contextEn, `Translation ${id} must have contextEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);
});

console.log('===============================================================');
console.log('🎉 Step 184: All 28/28 Unit Tests Passed Successfully!');
console.log('===============================================================\n');
