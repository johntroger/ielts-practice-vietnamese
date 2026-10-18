/**
 * Test Step 196: IELTS Listening & Speaking Track 42 UK Business Structures Integration
 */
import assert from 'assert';
import { track42UKBusinessStructures } from '../src/data/listening/track42UKBusinessStructures.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_BASE_QUESTION_BANK, ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS, getLocalizedArenaQuestion } from '../src/data/arenaQuestionTranslations.js';
import { getListeningTestDisplayInfo } from '../src/utils/testLocalizationHelper.js';

console.log('--- Running Step 196: Track 42 Audio & UK Business Structures Integration Test ---');

// 1. Verify Track 42 Dataset Integrity
assert.ok(track42UKBusinessStructures, 'Track 42 dataset must exist');
assert.strictEqual(track42UKBusinessStructures.id, 'ielts-listening-track42-uk-business-structures');
assert.strictEqual(track42UKBusinessStructures.totalQuestions, 10);
assert.strictEqual(track42UKBusinessStructures.audioDuration, 181);
assert.ok(track42UKBusinessStructures.audioUrl.includes('track42-uk-business-structures.mp3'));
assert.strictEqual(track42UKBusinessStructures.parts.length, 2, 'Must have 2 parts');

// Part 1: Note Completion
const p1 = track42UKBusinessStructures.parts[0];
assert.strictEqual(p1.partNumber, 1);
assert.ok(p1.questionGroups && p1.questionGroups.length === 1);
const g1 = p1.questionGroups[0];
assert.strictEqual(g1.id, 'qg-t42-p1');
assert.strictEqual(g1.type, 'note_completion');
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
const p2 = track42UKBusinessStructures.parts[1];
assert.strictEqual(p2.partNumber, 2);
assert.ok(p2.questionGroups && p2.questionGroups.length === 1);
const g2 = p2.questionGroups[0];
assert.strictEqual(g2.id, 'qg-t42-p2');
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
const t42Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track42-uk-business-structures');
assert.ok(t42Test, 'Track 42 must be registered in INITIAL_LISTENING_TESTS');
assert.ok(INITIAL_LISTENING_TESTS.slice(0, 5).some(t => t.id === 'ielts-listening-track42-uk-business-structures'), 'Track 42 must be among top tests');

// 3. Verify Track 42 Micro-Drills
const t42Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track42'));
assert.strictEqual(t42Drills.length, 4, 'Must have 4 Track 42 micro-drills');
t42Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track42-uk-business-structures'), `Drill ${d.id} has valid audio URL`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} clipStart must be >= 0`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be > clipStart`);
});

// 4. Verify Arena Question Bank Integration
const expectedArenaIds = [
  'easy_lis_companies_house_t42',
  'med_lis_limited_liability_loss_t42',
  'easy_lis_sole_trader_registration_t42',
  'med_lis_bank_loan_trust_t42',
  'hard_lis_corporation_vs_income_tax_t42'
];

expectedArenaIds.forEach(id => {
  const baseQ = ARENA_BASE_QUESTION_BANK.find(q => q.id === id);
  assert.ok(baseQ, `Arena base question ${id} must exist`);
  assert.ok(baseQ.promptEn, `${id} must have promptEn`);
  assert.ok(baseQ.contextEn, `${id} must have contextEn`);

  const enrichedQ = ARENA_QUESTION_BANK.find(q => q.id === id);
  assert.ok(enrichedQ, `Enriched question ${id} must exist`);
  assert.strictEqual(enrichedQ.isR2Audio, true, `${id} must have isR2Audio=true`);
  assert.ok(enrichedQ.audioUrl.includes('track42-uk-business-structures'), `${id} audioUrl matches Track 42`);
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

// 5. Verify Test Display Info & Track 42 Badge Formatter
const t42DisplayEn = getListeningTestDisplayInfo(track42UKBusinessStructures, true);
assert.strictEqual(t42DisplayEn.trackBadge, 'Track 42', 'Must produce Track 42 badge');
assert.strictEqual(t42DisplayEn.shortTitle, 'UK Business Structures & Self-Employment', 'Must produce concise English short title');
assert.ok(!/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(t42DisplayEn.shortTitle), 'Zero Vietnamese in English short title');

const t42DisplayVi = getListeningTestDisplayInfo(track42UKBusinessStructures, false);
assert.strictEqual(t42DisplayVi.trackBadge, 'Track 42', 'Must produce Track 42 badge in Vietnamese mode');
assert.strictEqual(t42DisplayVi.shortTitle, 'Mô hình doanh nghiệp tại Vương quốc Anh', 'Must produce Vietnamese short title');

console.log('✅ Step 196: Track 42 Complete Audio & UK Business Structures Integration Verified Successfully!');
