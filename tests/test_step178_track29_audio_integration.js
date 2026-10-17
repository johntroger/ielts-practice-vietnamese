import assert from 'assert';
import { track29IntonationAttitude } from '../src/data/listening/track29IntonationAttitude.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS } from '../src/data/arenaQuestionTranslations.js';

console.log('🧪 Testing Step 178: Track 29 Audio Integration, Micro-Drills & Arena Question Bank...');

// 1. Verify track29IntonationAttitude Task Metadata
assert.ok(track29IntonationAttitude, 'track29IntonationAttitude exists');
assert.strictEqual(track29IntonationAttitude.id, 'ielts-listening-track29-intonation-attitude');
assert.strictEqual(track29IntonationAttitude.audioUrl, 'https://pub-b33ad70ef4c7465ea266bab37e4568fe.r2.dev/ielts-listening-track29-intonation-stress-speaker-attitude.mp3');
assert.strictEqual(track29IntonationAttitude.totalQuestions, 10);
assert.strictEqual(track29IntonationAttitude.parts.length, 2);
assert.ok(track29IntonationAttitude.titleEn, 'Has English title');
assert.ok(track29IntonationAttitude.descriptionEn, 'Has English description');

// 2. Verify all 10 questions across Part 1 & Part 2
const allQuestions = track29IntonationAttitude.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions));
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
const t29Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track29-intonation-attitude');
assert.ok(t29Test, 'Track 29 is registered in INITIAL_LISTENING_TESTS');
assert.strictEqual(INITIAL_LISTENING_TESTS[0].id, 'ielts-listening-track29-intonation-attitude', 'Track 29 is the top test in INITIAL_LISTENING_TESTS');

// 4. Verify Track 29 Micro-Drills in LISTENING_MICRO_DRILLS
const t29Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track29'));
assert.strictEqual(t29Drills.length, 4, 'Must have 4 Track 29 micro-drills');

t29Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track29-intonation-stress-speaker-attitude'), `Drill ${d.id} has valid Track 29 R2 audio URL`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} must have valid clipStart`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be greater than clipStart`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

const dictationDrill = t29Drills.find(d => d.id === 'ldrill-dict-track29-mission-success');
assert.ok(dictationDrill, 'Must include dictation drill for Track 29');
assert.ok(dictationDrill.audioClipTipEn, 'Dictation drill must have audioClipTipEn');

// 5. Verify Arena Questions for Track 29
const t29ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.id && q.id.includes('t29'));
assert.strictEqual(t29ArenaQuestions.length, 5, 'Must have 5 Track 29 arena questions');

t29ArenaQuestions.forEach(q => {
  assert.ok(q.isR2Audio, `Arena question ${q.id} must have isR2Audio flag`);
  assert.ok(q.audioUrl.includes('track29-intonation-stress-speaker-attitude'), `Arena question ${q.id} has Track 29 audio`);
  assert.ok(q.clipStart >= 0, `Arena question ${q.id} must have clipStart`);
  assert.ok(q.clipEnd > q.clipStart, `Arena question ${q.id} must have clipEnd`);
  assert.ok(q.trackLabel.includes('Track 29'), `Arena question ${q.id} must have Track 29 trackLabel`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Arena question ${q.id} must have >= 2 options`);
  assert.strictEqual(q.options[q.correctIndex], q.correctAnswer, `Arena question ${q.id} correct answer matches options`);
  assert.ok(q.explanationEn, `Arena question ${q.id} must have explanationEn`);
});

// 6. Verify Arena Translations
const t29Ids = [
  'easy_lis_mission_emotion_t29',
  'med_lis_disaster_gravity_t29',
  'med_lis_anxiety_inflection_t29',
  'hard_lis_stunning_admiration_t29',
  'easy_lis_bizarre_emphasis_t29'
];
t29Ids.forEach(id => {
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation must exist for ${id}`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.contextEn, `Translation ${id} must have contextEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);
});

console.log('===============================================================');
console.log('🎉 Step 178: All 26/26 Unit Tests Passed Successfully!');
console.log('===============================================================\n');
