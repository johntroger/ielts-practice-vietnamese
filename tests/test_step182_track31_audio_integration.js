import assert from 'assert';
import { track31UrbanTransportProject } from '../src/data/listening/track31UrbanTransportProject.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS } from '../src/data/arenaQuestionTranslations.js';

console.log('🧪 Testing Step 182: Track 31 Audio Integration, Micro-Drills & Arena Question Bank...');

// 1. Verify track31UrbanTransportProject Task Metadata
assert.ok(track31UrbanTransportProject, 'track31UrbanTransportProject exists');
assert.strictEqual(track31UrbanTransportProject.id, 'ielts-listening-track31-urban-transport-project');
assert.strictEqual(track31UrbanTransportProject.audioUrl, 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track31-urban-transport-project-discussion.mp3');
assert.strictEqual(track31UrbanTransportProject.totalQuestions, 10);
assert.strictEqual(track31UrbanTransportProject.parts.length, 2);
assert.ok(track31UrbanTransportProject.titleEn, 'Has English title');
assert.ok(track31UrbanTransportProject.descriptionEn, 'Has English description');

// 2. Verify all 10 questions across Part 1 & Part 2
const allQuestions = track31UrbanTransportProject.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
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
const t31Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track31-urban-transport-project');
assert.ok(t31Test, 'Track 31 is registered in INITIAL_LISTENING_TESTS');
assert.ok(INITIAL_LISTENING_TESTS.some(t => t.id === 'ielts-listening-track31-urban-transport-project'), 'Track 31 is present in INITIAL_LISTENING_TESTS');

// 4. Verify Track 31 Micro-Drills in LISTENING_MICRO_DRILLS
const t31Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track31'));
assert.strictEqual(t31Drills.length, 4, 'Must have 4 Track 31 micro-drills');

t31Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track31-urban-transport-project-discussion'), `Drill ${d.id} has valid Track 31 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be greater than clipStart`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

const dictationDrill = t31Drills.find(d => d.id === 'ldrill-dict-track31-air-quality-asthma');
assert.ok(dictationDrill, 'Must include dictation drill for Track 31');
assert.ok(dictationDrill.targetTranscript, 'Dictation drill must have targetTranscript');
assert.ok(dictationDrill.audioClipTipEn, 'Dictation drill must have audioClipTipEn');

// 5. Verify Track 31 Arena Questions & Metadata
const t31ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.id && q.id.includes('_t31'));
assert.strictEqual(t31ArenaQuestions.length, 5, 'Must have 5 Track 31 arena questions');

t31ArenaQuestions.forEach(q => {
  assert.ok(q.isR2Audio, `Arena question ${q.id} must have isR2Audio flag`);
  assert.ok(q.audioUrl.includes('track31-urban-transport-project-discussion'), `Arena question ${q.id} has Track 31 audio`);
  assert.ok(q.clipStart >= 0, `Arena question ${q.id} must have clipStart`);
  assert.ok(q.clipEnd > q.clipStart, `Arena question ${q.id} must have clipEnd`);
  assert.ok(q.trackLabel.includes('Track 31'), `Arena question ${q.id} must have Track 31 trackLabel`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Arena question ${q.id} must have >= 2 options`);
  assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Arena question ${q.id} correct answer matches options`);
  assert.ok(q.explanationEn, `Arena question ${q.id} must have explanationEn`);
});

// 6. Verify Arena Translations
const t31Ids = [
  'easy_lis_project_subject_t31',
  'med_lis_rail_budget_trouble_t31',
  'hard_lis_accident_paradox_t31',
  'med_lis_air_quality_illness_t31',
  'easy_lis_business_tardiness_t31'
];
t31Ids.forEach(id => {
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation must exist for ${id}`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.contextEn, `Translation ${id} must have contextEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);
});

console.log('===============================================================');
console.log('🎉 Step 182: All 26/26 Unit Tests Passed Successfully!');
console.log('===============================================================\n');
