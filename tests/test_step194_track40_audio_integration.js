/**
 * Test Step 194: IELTS Listening & Speaking Track 40 Complex Sentences & Connectors Audio Integration
 */
import assert from 'assert';
import { track40ComplexSentencesConnectors } from '../src/data/listening/track40ComplexSentencesConnectors.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_BASE_QUESTION_BANK, ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS, getLocalizedArenaQuestion } from '../src/data/arenaQuestionTranslations.js';

console.log('--- Running Step 194: Track 40 Audio & Complex Connectors Integration Test ---');

// 1. Verify Track 40 Dataset Integrity
assert.ok(track40ComplexSentencesConnectors, 'Track 40 dataset must exist');
assert.strictEqual(track40ComplexSentencesConnectors.id, 'ielts-listening-track40-complex-sentences-connectors');
assert.strictEqual(track40ComplexSentencesConnectors.totalQuestions, 10);
assert.strictEqual(track40ComplexSentencesConnectors.audioDuration, 49);
assert.strictEqual(track40ComplexSentencesConnectors.parts.length, 2, 'Must have 2 parts');

// Part 1: Sentence Completion
const p1 = track40ComplexSentencesConnectors.parts[0];
assert.strictEqual(p1.partNumber, 1);
assert.ok(p1.questionGroups && p1.questionGroups.length === 1);
const g1 = p1.questionGroups[0];
assert.strictEqual(g1.id, 'qg-t40-p1');
assert.ok(g1.type === 'sentence_completion' || g1.type === 'note_completion');
const p1Questions = g1.questions;
assert.strictEqual(p1Questions.length, 5, 'Part 1 must have 5 questions (1-5)');
assert.deepStrictEqual(p1Questions.map(q => q.order), [1, 2, 3, 4, 5]);
p1Questions.forEach((q, idx) => {
  assert.strictEqual(q.order, idx + 1);
  assert.strictEqual(q.number, idx + 1);
  assert.ok(q.questionTextEn, `Q${idx + 1} must have questionTextEn`);
  assert.ok(q.answer || q.correctAnswer, `Q${idx + 1} must have answer`);
  assert.ok(q.prefixTextEn !== undefined, `Q${idx + 1} must have prefixTextEn`);
});

// Part 2: Multiple Choice
const p2 = track40ComplexSentencesConnectors.parts[1];
assert.strictEqual(p2.partNumber, 2);
assert.ok(p2.questionGroups && p2.questionGroups.length === 1);
const g2 = p2.questionGroups[0];
assert.strictEqual(g2.id, 'qg-t40-p2');
assert.strictEqual(g2.type, 'multiple_choice');
const p2Questions = g2.questions;
assert.strictEqual(p2Questions.length, 5, 'Part 2 must have 5 questions (6-10)');
assert.deepStrictEqual(p2Questions.map(q => q.order), [6, 7, 8, 9, 10]);
p2Questions.forEach((q, idx) => {
  const qNum = idx + 6;
  assert.strictEqual(q.order, qNum);
  assert.strictEqual(q.number, qNum);
  assert.strictEqual(q.type, 'multiple_choice');
  assert.ok(Array.isArray(q.options) && q.options.length >= 4, `Q${qNum} must have >= 4 options`);
  assert.ok(q.correctAnswer, `Q${qNum} must have correctAnswer`);
});

// 2. Verify Registration in INITIAL_LISTENING_TESTS
const t40Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track40-complex-sentences-connectors');
assert.ok(t40Test, 'Track 40 must be registered in INITIAL_LISTENING_TESTS');
assert.ok(INITIAL_LISTENING_TESTS.slice(0, 5).some(t => t.id === 'ielts-listening-track40-complex-sentences-connectors'), 'Track 40 must be among top tests');

// 3. Verify Track 40 Micro-Drills
const t40Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track40'));
assert.strictEqual(t40Drills.length, 4, 'Must have 4 Track 40 micro-drills');
t40Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track40-complex-sentences-connectors'), `Drill ${d.id} has valid audio URL`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} clipStart must be >= 0`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be > clipStart`);
});

// 4. Verify Arena Question Bank Integration
const expectedArenaIds = [
  'easy_lis_sentential_which_t40',
  'med_lis_causal_since_t40',
  'easy_lis_reason_because_t40',
  'med_lis_time_once_t40',
  'hard_lis_dropped_camera_t40'
];

expectedArenaIds.forEach(id => {
  const baseQ = ARENA_BASE_QUESTION_BANK.find(q => q.id === id);
  assert.ok(baseQ, `Arena base question ${id} must exist`);
  assert.ok(baseQ.promptEn, `${id} must have promptEn`);
  assert.ok(baseQ.contextEn, `${id} must have contextEn`);

  const enrichedQ = ARENA_QUESTION_BANK.find(q => q.id === id);
  assert.ok(enrichedQ, `Enriched question ${id} must exist`);
  assert.strictEqual(enrichedQ.isR2Audio, true, `${id} must have isR2Audio=true`);
  assert.ok(enrichedQ.audioUrl.includes('track40-complex-sentences-connectors'), `${id} audioUrl matches Track 40`);
  assert.ok(enrichedQ.clipStart >= 0, `${id} must have clipStart >= 0`);
  assert.ok(enrichedQ.clipEnd > enrichedQ.clipStart, `${id} must have clipEnd > clipStart`);

  // Translation check
  const trans = ARENA_QUESTION_TRANSLATIONS[id];
  assert.ok(trans, `Translation for ${id} must exist`);
  assert.ok(trans.promptEn, `Translation ${id} must have promptEn`);
  assert.ok(trans.explanationEn, `Translation ${id} must have explanationEn`);

  // English UI Localization check (Zero Vietnamese leak)
  const localizedEn = getLocalizedArenaQuestion(enrichedQ, true);
  assert.strictEqual(localizedEn.prompt, enrichedQ.promptEn, `${id} localized English prompt matches`);
});

// 5. Verify Test Display Info & Track 40 Badge Formatter
import { getListeningTestDisplayInfo } from '../src/utils/testLocalizationHelper.js';
const t40DisplayEn = getListeningTestDisplayInfo(track40ComplexSentencesConnectors, true);
assert.strictEqual(t40DisplayEn.trackBadge, 'Track 40', 'Must produce Track 40 badge');
assert.strictEqual(t40DisplayEn.shortTitle, 'Complex Sentences & Discourse Connectors', 'Must produce concise English short title');
assert.ok(!/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(t40DisplayEn.shortTitle), 'Zero Vietnamese in English short title');

const t40DisplayVi = getListeningTestDisplayInfo(track40ComplexSentencesConnectors, false);
assert.strictEqual(t40DisplayVi.trackBadge, 'Track 40', 'Must produce Track 40 badge in Vietnamese mode');
assert.strictEqual(t40DisplayVi.shortTitle, 'Câu phức & Liên từ lập luận', 'Must produce Vietnamese short title');

console.log('✅ Step 194: Track 40 Complete Audio & Connectors Integration Verified Successfully!');
