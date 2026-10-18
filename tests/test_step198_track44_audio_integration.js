/**
 * Test Step 198: IELTS Listening & Academic Lecture Track 44 Business Partnerships & LLPs Integration
 */
import assert from 'assert';
import { track44PartnershipsSimpleLLP } from '../src/data/listening/track44PartnershipsSimpleLLP.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_BASE_QUESTION_BANK, ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS, getLocalizedArenaQuestion } from '../src/data/arenaQuestionTranslations.js';
import { getListeningTestDisplayInfo } from '../src/utils/testLocalizationHelper.js';

console.log('--- Running Step 198: Track 44 Audio & Partnerships Integration Test ---');

// 1. Verify Track 44 Dataset Integrity
assert.ok(track44PartnershipsSimpleLLP, 'Track 44 dataset must exist');
assert.strictEqual(track44PartnershipsSimpleLLP.id, 'ielts-listening-track44-partnerships-simple-llp');
assert.strictEqual(track44PartnershipsSimpleLLP.totalQuestions, 10);
assert.strictEqual(track44PartnershipsSimpleLLP.audioDuration, 196);
assert.ok(track44PartnershipsSimpleLLP.audioUrl.includes('track44-partnerships-simple-llp.mp3'));
assert.strictEqual(track44PartnershipsSimpleLLP.parts.length, 2, 'Must have 2 parts');

// Part 1: Note Completion
const p1 = track44PartnershipsSimpleLLP.parts[0];
assert.strictEqual(p1.partNumber, 1);
assert.ok(p1.questionGroups && p1.questionGroups.length === 1);
const g1 = p1.questionGroups[0];
assert.strictEqual(g1.id, 'qg-t44-p1');
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
const p2 = track44PartnershipsSimpleLLP.parts[1];
assert.strictEqual(p2.partNumber, 2);
assert.ok(p2.questionGroups && p2.questionGroups.length === 1);
const g2 = p2.questionGroups[0];
assert.strictEqual(g2.id, 'qg-t44-p2');
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
const t44Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track44-partnerships-simple-llp');
assert.ok(t44Test, 'Track 44 must be registered in INITIAL_LISTENING_TESTS');
assert.ok(INITIAL_LISTENING_TESTS.slice(0, 15).some(t => t.id === 'ielts-listening-track44-partnerships-simple-llp'), 'Track 44 must be among top tests');

// 3. Verify Track 44 Micro-Drills
const t44Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track44'));
assert.strictEqual(t44Drills.length, 4, 'Must have 4 Track 44 micro-drills');
t44Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track44-partnerships-simple-llp'), `Drill ${d.id} has valid audio URL`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} clipStart must be >= 0`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be > clipStart`);
});

// 4. Verify Arena Question Bank Integration
const expectedArenaIds = [
  'easy_lis_simple_partnership_continuity_t44',
  'med_lis_formal_arrangement_disagreements_t44',
  'easy_lis_llp_companies_house_registry_t44',
  'hard_lis_llp_annual_return_penalty_t44',
  'med_lis_llp_professional_sectors_t44'
];

expectedArenaIds.forEach(id => {
  const baseQ = ARENA_BASE_QUESTION_BANK.find(q => q.id === id);
  assert.ok(baseQ, `Arena base question ${id} must exist`);
  assert.ok(baseQ.promptEn, `${id} must have promptEn`);
  assert.ok(baseQ.contextEn, `${id} must have contextEn`);

  const enrichedQ = ARENA_QUESTION_BANK.find(q => q.id === id);
  assert.ok(enrichedQ, `Enriched question ${id} must exist`);
  assert.strictEqual(enrichedQ.isR2Audio, true, `${id} must have isR2Audio=true`);
  assert.ok(enrichedQ.audioUrl.includes('track44-partnerships-simple-llp'), `${id} audioUrl matches Track 44`);
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

// 5. Verify Test Display Info & Track 44 Badge Formatter
const t44DisplayEn = getListeningTestDisplayInfo(track44PartnershipsSimpleLLP, true);
assert.strictEqual(t44DisplayEn.trackBadge, 'Track 44', 'Must produce Track 44 badge');
assert.strictEqual(t44DisplayEn.shortTitle, 'Business Partnerships & LLPs in the UK', 'Must produce concise English short title');
assert.ok(!/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(t44DisplayEn.shortTitle), 'Zero Vietnamese in English short title');

const t44DisplayVi = getListeningTestDisplayInfo(track44PartnershipsSimpleLLP, false);
assert.strictEqual(t44DisplayVi.trackBadge, 'Track 44', 'Must produce Track 44 badge in Vietnamese mode');
assert.strictEqual(t44DisplayVi.shortTitle, 'Mô hình hợp danh & LLP tại Vương quốc Anh', 'Must produce Vietnamese short title');

console.log('✅ Step 198: Track 44 Complete Audio & Partnerships Integration Verified Successfully!');
