import assert from 'assert';
import { track24SpaceComparison } from '../src/data/listening/track24SpaceComparison.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS } from '../src/data/arenaQuestionTranslations.js';

console.log('🧪 Testing Step 172: Track 24 Audio Integration, Micro-Drills & Arena Question Bank...');

// 1. Verify track24SpaceComparison Task Metadata
assert.ok(track24SpaceComparison, 'track24SpaceComparison exists');
assert.strictEqual(track24SpaceComparison.id, 'ielts-listening-track24-space-comparison');
assert.strictEqual(track24SpaceComparison.audioUrl, 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track24-space-missions-comparison.mp3');
assert.strictEqual(track24SpaceComparison.totalQuestions, 10);
assert.strictEqual(track24SpaceComparison.parts.length, 2);
assert.ok(track24SpaceComparison.titleEn, 'Has English title');
assert.ok(track24SpaceComparison.descriptionEn, 'Has English description');

// 2. Verify all 10 questions across Part 1 & Part 2
const allQuestions = track24SpaceComparison.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
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
const t24Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track24-space-comparison');
assert.ok(t24Test, 'Track 24 is registered in INITIAL_LISTENING_TESTS');

// 4. Verify Track 24 Micro-Drills in LISTENING_MICRO_DRILLS
const t24Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track24'));
assert.strictEqual(t24Drills.length, 4, 'Must have 4 Track 24 micro-drills');

t24Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track24-space-missions-comparison'), `Drill ${d.id} has valid Track 24 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be greater than clipStart`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

const dictationDrill = t24Drills.find(d => d.id === 'ldrill-dict-track24-arizona-team');
assert.ok(dictationDrill, 'Must include dictation drill for Track 24');
assert.ok(dictationDrill.audioClipTipEn, 'Dictation drill must have audioClipTipEn');

// 5. Verify Arena Questions for Track 24
const t24ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.id && q.id.includes('t24'));
assert.strictEqual(t24ArenaQuestions.length, 5, 'Must have 5 Track 24 arena questions');

t24ArenaQuestions.forEach(q => {
  assert.ok(q.isR2Audio, `Arena question ${q.id} must have isR2Audio flag`);
  assert.ok(q.audioUrl.includes('track24-space-missions-comparison'), `Arena question ${q.id} has Track 24 audio`);
  assert.ok(q.clipStart >= 0, `Arena question ${q.id} must have clipStart`);
  assert.ok(q.clipEnd > q.clipStart, `Arena question ${q.id} must have clipEnd`);
  assert.ok(q.trackLabel.includes('Track 24'), `Arena question ${q.id} must have Track 24 trackLabel`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 3, `Arena question ${q.id} must have >= 3 options`);
  assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Arena question ${q.id} correct answer matches options`);
  assert.ok(q.explanationEn, `Arena question ${q.id} must have explanationEn`);
});

// 6. Verify Arena Translations
const t24Ids = [
  'easy_lis_mars_timeline_t24',
  'med_lis_moon_mission_type_t24',
  'med_lis_lunar_colony_goal_t24',
  'hard_lis_advisor_arizona_priority_t24',
  'easy_lis_pluto_novelty_t24'
];
t24Ids.forEach(id => {
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation must exist for ${id}`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.contextEn, `Translation ${id} must have contextEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);
});

console.log('===============================================================');
console.log('🎉 Step 172: All 26/26 Unit Tests Passed Successfully!');
console.log('===============================================================\n');
