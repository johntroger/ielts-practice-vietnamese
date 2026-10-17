import assert from 'assert';
import { track25MarsContingency } from '../src/data/listening/track25MarsContingency.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS } from '../src/data/arenaQuestionTranslations.js';

console.log('🧪 Testing Step 173: Track 25 Audio Integration, Micro-Drills & Arena Question Bank...');

// 1. Verify track25MarsContingency Task Metadata
assert.ok(track25MarsContingency, 'track25MarsContingency exists');
assert.strictEqual(track25MarsContingency.id, 'ielts-listening-track25-mars-contingency');
assert.strictEqual(track25MarsContingency.audioUrl, 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track25-arizona-mars-contingency.mp3');
assert.strictEqual(track25MarsContingency.totalQuestions, 10);
assert.strictEqual(track25MarsContingency.parts.length, 2);
assert.ok(track25MarsContingency.titleEn, 'Has English title');
assert.ok(track25MarsContingency.descriptionEn, 'Has English description');

// 2. Verify all 10 questions across Part 1 & Part 2
const allQuestions = track25MarsContingency.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
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
const t25Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track25-mars-contingency');
assert.ok(t25Test, 'Track 25 is registered in INITIAL_LISTENING_TESTS');
assert.strictEqual(INITIAL_LISTENING_TESTS[0].id, 'ielts-listening-track25-mars-contingency', 'Track 25 is the top test in INITIAL_LISTENING_TESTS');

// 4. Verify Track 25 Micro-Drills in LISTENING_MICRO_DRILLS
const t25Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track25'));
assert.strictEqual(t25Drills.length, 4, 'Must have 4 Track 25 micro-drills');

t25Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track25-arizona-mars-contingency'), `Drill ${d.id} has valid Track 25 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be greater than clipStart`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

const dictationDrill = t25Drills.find(d => d.id === 'ldrill-dict-track25-mother-illness');
assert.ok(dictationDrill, 'Must include dictation drill for Track 25');
assert.ok(dictationDrill.audioClipTipEn, 'Dictation drill must have audioClipTipEn');

// 5. Verify Arena Questions for Track 25
const t25ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.id && q.id.includes('t25'));
assert.strictEqual(t25ArenaQuestions.length, 5, 'Must have 5 Track 25 arena questions');

t25ArenaQuestions.forEach(q => {
  assert.ok(q.isR2Audio, `Arena question ${q.id} must have isR2Audio flag`);
  assert.ok(q.audioUrl.includes('track25-arizona-mars-contingency'), `Arena question ${q.id} has Track 25 audio`);
  assert.ok(q.clipStart >= 0, `Arena question ${q.id} must have clipStart`);
  assert.ok(q.clipEnd > q.clipStart, `Arena question ${q.id} must have clipEnd`);
  assert.ok(q.trackLabel.includes('Track 25'), `Arena question ${q.id} must have Track 25 trackLabel`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 3, `Arena question ${q.id} must have >= 3 options`);
  assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Arena question ${q.id} correct answer matches options`);
  assert.ok(q.explanationEn, `Arena question ${q.id} must have explanationEn`);
});

// 6. Verify Arena Translations
const t25Ids = [
  'easy_lis_alfonso_role_t25',
  'med_lis_simulation_no_entry_rule_t25',
  'med_lis_carla_qualification_t25',
  'hard_lis_cross_training_advantage_t25',
  'easy_lis_simon_endorsement_t25'
];
t25Ids.forEach(id => {
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation must exist for ${id}`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.contextEn, `Translation ${id} must have contextEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);
});

console.log('===============================================================');
console.log('🎉 Step 173: All 26/26 Unit Tests Passed Successfully!');
console.log('===============================================================\n');
