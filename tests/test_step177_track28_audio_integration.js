import assert from 'assert';
import { track28MarsProjectReview } from '../src/data/listening/track28MarsProjectReview.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS } from '../src/data/arenaQuestionTranslations.js';

console.log('🧪 Testing Step 177: Track 28 Audio Integration, Micro-Drills & Arena Question Bank...');

// 1. Verify track28MarsProjectReview Task Metadata
assert.ok(track28MarsProjectReview, 'track28MarsProjectReview exists');
assert.strictEqual(track28MarsProjectReview.id, 'ielts-listening-track28-mars-project-review');
assert.strictEqual(track28MarsProjectReview.audioUrl, 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track28-mars-simulation-project-review.mp3');
assert.strictEqual(track28MarsProjectReview.totalQuestions, 10);
assert.strictEqual(track28MarsProjectReview.parts.length, 2);
assert.ok(track28MarsProjectReview.titleEn, 'Has English title');
assert.ok(track28MarsProjectReview.descriptionEn, 'Has English description');

// 2. Verify all 10 questions across Part 1 & Part 2
const allQuestions = track28MarsProjectReview.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
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
const t28Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track28-mars-project-review');
assert.ok(t28Test, 'Track 28 is registered in INITIAL_LISTENING_TESTS');

// 4. Verify Track 28 Micro-Drills in LISTENING_MICRO_DRILLS
const t28Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track28'));
assert.strictEqual(t28Drills.length, 4, 'Must have 4 Track 28 micro-drills');

t28Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track28-mars-simulation-project-review'), `Drill ${d.id} has valid Track 28 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be greater than clipStart`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

const dictationDrill = t28Drills.find(d => d.id === 'ldrill-dict-track28-life-support-offline');
assert.ok(dictationDrill, 'Must include dictation drill for Track 28');
assert.ok(dictationDrill.audioClipTipEn, 'Dictation drill must have audioClipTipEn');

// 5. Verify Arena Questions for Track 28
const t28ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.id && q.id.includes('t28'));
assert.strictEqual(t28ArenaQuestions.length, 5, 'Must have 5 Track 28 arena questions');

t28ArenaQuestions.forEach(q => {
  assert.ok(q.isR2Audio, `Arena question ${q.id} must have isR2Audio flag`);
  assert.ok(q.audioUrl.includes('track28-mars-simulation-project-review'), `Arena question ${q.id} has Track 28 audio`);
  assert.ok(q.clipStart >= 0, `Arena question ${q.id} must have clipStart`);
  assert.ok(q.clipEnd > q.clipStart, `Arena question ${q.id} must have clipEnd`);
  assert.ok(q.trackLabel.includes('Track 28'), `Arena question ${q.id} must have Track 28 trackLabel`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 3, `Arena question ${q.id} must have >= 3 options`);
  assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Arena question ${q.id} correct answer matches options`);
  assert.ok(q.explanationEn, `Arena question ${q.id} must have explanationEn`);
});

// 6. Verify Arena Translations
const t28Ids = [
  'easy_lis_crew_completed_count_t28',
  'med_lis_budget_saving_t28',
  'med_lis_simon_project_focus_t28',
  'hard_lis_future_trial_duration_t28',
  'easy_lis_meeting_day_t28'
];
t28Ids.forEach(id => {
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation must exist for ${id}`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.contextEn, `Translation ${id} must have contextEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);
});

console.log('===============================================================');
console.log('🎉 Step 177: All 26/26 Unit Tests Passed Successfully!');
console.log('===============================================================\n');
