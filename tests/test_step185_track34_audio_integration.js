import assert from 'assert';
import { track34TransportProjectCostAnalysis } from '../src/data/listening/track34TransportProjectCostAnalysis.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS } from '../src/data/arenaQuestionTranslations.js';

console.log('🧪 Testing Step 185: Track 34 Audio Integration, Micro-Drills & Arena Question Bank...');

// 1. Verify track34TransportProjectCostAnalysis Task Metadata
assert.ok(track34TransportProjectCostAnalysis, 'track34TransportProjectCostAnalysis exists');
assert.strictEqual(track34TransportProjectCostAnalysis.id, 'ielts-listening-track34-transport-project-cost-analysis');
assert.strictEqual(track34TransportProjectCostAnalysis.audioUrl, 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track34-transport-project-cost-analysis.mp3');
assert.strictEqual(track34TransportProjectCostAnalysis.totalQuestions, 10);
assert.strictEqual(track34TransportProjectCostAnalysis.parts.length, 2);
assert.ok(track34TransportProjectCostAnalysis.titleEn, 'Has English title');
assert.ok(track34TransportProjectCostAnalysis.descriptionEn, 'Has English description');

// 2. Verify all 10 questions across Part 1 & Part 2
const allQuestions = track34TransportProjectCostAnalysis.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
assert.strictEqual(allQuestions.length, 10, 'Must have exactly 10 questions across both parts');

allQuestions.forEach((q, idx) => {
  assert.ok(q.id, `Question ${idx + 1} must have id`);
  assert.ok(q.questionText, `Question ${idx + 1} must have questionText`);
  assert.ok(q.questionTextEn, `Question ${idx + 1} must have questionTextEn`);
  assert.ok(q.answer || q.correctAnswer, `Question ${idx + 1} must have answer key`);
  assert.ok(q.explanationEn, `Question ${idx + 1} must have English explanation`);
  assert.ok(q.audioTimestamp >= 0 && q.audioTimestamp <= 148, `Question ${idx + 1} must have valid timestamp <= 148s`);
});

// 3. Verify Registration in INITIAL_LISTENING_TESTS
const t34Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track34-transport-project-cost-analysis');
assert.ok(t34Test, 'Track 34 is registered in INITIAL_LISTENING_TESTS');
assert.ok(INITIAL_LISTENING_TESTS.slice(0, 10).some(t => t.id === 'ielts-listening-track34-transport-project-cost-analysis'), 'Track 34 is near the top of INITIAL_LISTENING_TESTS');

// 4. Verify Track 34 Micro-Drills in LISTENING_MICRO_DRILLS
const t34Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track34'));
assert.strictEqual(t34Drills.length, 4, 'Must have 4 Track 34 micro-drills');

t34Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track34-transport-project-cost-analysis'), `Drill ${d.id} has valid Track 34 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart && d.clipEnd <= 148, `Drill ${d.id} clipEnd must be greater than clipStart and <= 148s`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

const dictationDrill = t34Drills.find(d => d.id === 'ldrill-dict-track34-cyclist-safety-expenditure');
assert.ok(dictationDrill, 'Must include dictation drill for Track 34');
assert.ok(dictationDrill.targetTranscript, 'Dictation drill must have targetTranscript');
assert.ok(dictationDrill.audioClipTipEn, 'Dictation drill must have audioClipTipEn');

// 5. Verify Track 34 Arena Questions & Metadata
const t34ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.id && q.id.includes('_t34'));
assert.strictEqual(t34ArenaQuestions.length, 5, 'Must have 5 Track 34 arena questions');

t34ArenaQuestions.forEach(q => {
  assert.ok(q.isR2Audio, `Arena question ${q.id} must have isR2Audio flag`);
  assert.ok(q.audioUrl.includes('track34-transport-project-cost-analysis'), `Arena question ${q.id} has Track 34 audio`);
  assert.ok(q.clipStart >= 0, `Arena question ${q.id} must have clipStart`);
  assert.ok(q.clipEnd > q.clipStart && q.clipEnd <= 148, `Arena question ${q.id} must have clipEnd <= 148s`);
  assert.ok(q.trackLabel.includes('Track 34'), `Arena question ${q.id} must have Track 34 trackLabel`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Arena question ${q.id} must have >= 2 options`);
  assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Arena question ${q.id} correct answer matches options`);
  assert.ok(q.explanationEn, `Arena question ${q.id} must have explanationEn`);
});

// 6. Verify Arena Translations
const t34Ids = [
  'easy_lis_tram_max_cost_t34',
  'med_lis_bus_lane_total_t34',
  'hard_lis_park_ride_component_t34',
  'med_lis_pedestrian_cyclist_safety_t34',
  'easy_lis_robert_math_error_t34'
];
t34Ids.forEach(id => {
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation must exist for ${id}`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.contextEn, `Translation ${id} must have contextEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);
});

console.log('===============================================================');
console.log('🎉 Step 185: All 28/28 Unit Tests Passed Successfully!');
console.log('===============================================================\n');
