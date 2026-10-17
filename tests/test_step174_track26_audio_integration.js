import assert from 'assert';
import { track26PsychologicalCrisis } from '../src/data/listening/track26PsychologicalCrisis.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS } from '../src/data/arenaQuestionTranslations.js';

console.log('🧪 Testing Step 174: Track 26 Audio Integration, Micro-Drills & Arena Question Bank...');

// 1. Verify track26PsychologicalCrisis Task Metadata
assert.ok(track26PsychologicalCrisis, 'track26PsychologicalCrisis exists');
assert.strictEqual(track26PsychologicalCrisis.id, 'ielts-listening-track26-psychological-crisis');
assert.strictEqual(track26PsychologicalCrisis.audioUrl, 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track26-mars-crew-psychological-crisis.mp3');
assert.strictEqual(track26PsychologicalCrisis.totalQuestions, 10);
assert.strictEqual(track26PsychologicalCrisis.parts.length, 2);
assert.ok(track26PsychologicalCrisis.titleEn, 'Has English title');
assert.ok(track26PsychologicalCrisis.descriptionEn, 'Has English description');

// 2. Verify all 10 questions across Part 1 & Part 2
const allQuestions = track26PsychologicalCrisis.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
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
const t26Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track26-psychological-crisis');
assert.ok(t26Test, 'Track 26 is registered in INITIAL_LISTENING_TESTS');

// 4. Verify Track 26 Micro-Drills in LISTENING_MICRO_DRILLS
const t26Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track26'));
assert.strictEqual(t26Drills.length, 4, 'Must have 4 Track 26 micro-drills');

t26Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track26-mars-crew-psychological-crisis'), `Drill ${d.id} has valid Track 26 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be greater than clipStart`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

const dictationDrill = t26Drills.find(d => d.id === 'ldrill-dict-track26-inescapable-environment');
assert.ok(dictationDrill, 'Must include dictation drill for Track 26');
assert.ok(dictationDrill.audioClipTipEn, 'Dictation drill must have audioClipTipEn');

// 5. Verify Arena Questions for Track 26
const t26ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.id && q.id.includes('t26'));
assert.strictEqual(t26ArenaQuestions.length, 5, 'Must have 5 Track 26 arena questions');

t26ArenaQuestions.forEach(q => {
  assert.ok(q.isR2Audio, `Arena question ${q.id} must have isR2Audio flag`);
  assert.ok(q.audioUrl.includes('track26-mars-crew-psychological-crisis'), `Arena question ${q.id} has Track 26 audio`);
  assert.ok(q.clipStart >= 0, `Arena question ${q.id} must have clipStart`);
  assert.ok(q.clipEnd > q.clipStart, `Arena question ${q.id} must have clipEnd`);
  assert.ok(q.trackLabel.includes('Track 26'), `Arena question ${q.id} must have Track 26 trackLabel`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 3, `Arena question ${q.id} must have >= 3 options`);
  assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Arena question ${q.id} correct answer matches options`);
  assert.ok(q.explanationEn, `Arena question ${q.id} must have explanationEn`);
});

// 6. Verify Arena Translations
const t26Ids = [
  'easy_lis_joe_temperament_t26',
  'med_lis_victim_martin_t26',
  'med_lis_root_cause_isolation_t26',
  'hard_lis_inescapable_environment_t26',
  'easy_lis_nature_of_attack_t26'
];
t26Ids.forEach(id => {
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation must exist for ${id}`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.contextEn, `Translation ${id} must have contextEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);
});

console.log('===============================================================');
console.log('🎉 Step 174: All 26/26 Unit Tests Passed Successfully!');
console.log('===============================================================\n');
