/**
 * Test Step 199: IELTS Listening & Academic Lecture Track 45 Limited Liability Companies Integration
 */
import assert from 'assert';
import { track45LimitedLiabilityCompanyLtd } from '../src/data/listening/track45LimitedLiabilityCompanyLtd.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_BASE_QUESTION_BANK, ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS, getLocalizedArenaQuestion } from '../src/data/arenaQuestionTranslations.js';
import { getListeningTestDisplayInfo } from '../src/utils/testLocalizationHelper.js';

console.log('--- Running Step 199: Track 45 Audio & Limited Liability Companies Integration Test ---');

// 1. Verify Track 45 Dataset Integrity
assert.ok(track45LimitedLiabilityCompanyLtd, 'Track 45 dataset must exist');
assert.strictEqual(track45LimitedLiabilityCompanyLtd.id, 'ielts-listening-track45-limited-liability-company-ltd');
assert.strictEqual(track45LimitedLiabilityCompanyLtd.totalQuestions, 10);
assert.strictEqual(track45LimitedLiabilityCompanyLtd.audioDuration, 196);
assert.ok(track45LimitedLiabilityCompanyLtd.audioUrl.includes('track45-limited-liability-company-ltd.mp3'));
assert.strictEqual(track45LimitedLiabilityCompanyLtd.parts.length, 2, 'Must have 2 parts');

// Part 1: Note Completion
const p1 = track45LimitedLiabilityCompanyLtd.parts[0];
assert.strictEqual(p1.partNumber, 1);
assert.ok(p1.questionGroups && p1.questionGroups.length === 1);
const g1 = p1.questionGroups[0];
assert.strictEqual(g1.id, 'qg-t45-p1');
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
const p2 = track45LimitedLiabilityCompanyLtd.parts[1];
assert.strictEqual(p2.partNumber, 2);
assert.ok(p2.questionGroups && p2.questionGroups.length === 1);
const g2 = p2.questionGroups[0];
assert.strictEqual(g2.id, 'qg-t45-p2');
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
const t45Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track45-limited-liability-company-ltd');
assert.ok(t45Test, 'Track 45 must be registered in INITIAL_LISTENING_TESTS');
assert.ok(INITIAL_LISTENING_TESTS.slice(0, 15).some(t => t.id === 'ielts-listening-track45-limited-liability-company-ltd'), 'Track 45 must be among top tests');

// 3. Verify Track 45 Micro-Drills
const t45Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track45'));
assert.strictEqual(t45Drills.length, 4, 'Must have 4 Track 45 micro-drills');
t45Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track45-limited-liability-company-ltd'), `Drill ${d.id} has valid audio URL`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} clipStart must be >= 0`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be > clipStart`);
});

// 4. Verify Arena Question Bank Integration
const expectedArenaIds = [
  'easy_lis_shareholder_definition_t45',
  'med_lis_separate_legal_entity_debts_t45',
  'easy_lis_registered_address_records_t45',
  'med_lis_governance_director_shareholder_t45',
  'hard_lis_corporation_vs_income_tax_t45'
];

expectedArenaIds.forEach(id => {
  const baseQ = ARENA_BASE_QUESTION_BANK.find(q => q.id === id);
  assert.ok(baseQ, `Arena base question ${id} must exist`);
  assert.ok(baseQ.promptEn, `${id} must have promptEn`);
  assert.ok(baseQ.contextEn, `${id} must have contextEn`);

  const enrichedQ = ARENA_QUESTION_BANK.find(q => q.id === id);
  assert.ok(enrichedQ, `Enriched question ${id} must exist`);
  assert.strictEqual(enrichedQ.isR2Audio, true, `${id} must have isR2Audio=true`);
  assert.ok(enrichedQ.audioUrl.includes('track45-limited-liability-company-ltd'), `${id} audioUrl matches Track 45`);
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

// 5. Verify Test Display Info & Track 45 Badge Formatter
const t45DisplayEn = getListeningTestDisplayInfo(track45LimitedLiabilityCompanyLtd, true);
assert.strictEqual(t45DisplayEn.trackBadge, 'Track 45', 'Must produce Track 45 badge');
assert.strictEqual(t45DisplayEn.shortTitle, 'Limited Liability Companies in the UK', 'Must produce concise English short title');
assert.ok(!/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(t45DisplayEn.shortTitle), 'Zero Vietnamese in English short title');

const t45DisplayVi = getListeningTestDisplayInfo(track45LimitedLiabilityCompanyLtd, false);
assert.strictEqual(t45DisplayVi.trackBadge, 'Track 45', 'Must produce Track 45 badge in Vietnamese mode');
assert.strictEqual(t45DisplayVi.shortTitle, 'Mô hình Công ty TNHH tại Vương quốc Anh', 'Must produce Vietnamese short title');

console.log('✅ Step 199: Track 45 Complete Audio & Limited Liability Companies Integration Verified Successfully!');
