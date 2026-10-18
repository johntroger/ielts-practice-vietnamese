/**
 * Test Step 195: IELTS Listening & Speaking Track 41 Travel Experiences & Follow-up Questions Integration
 */
import assert from 'assert';
import { track41TravelExperiencesFollowUp } from '../src/data/listening/track41TravelExperiencesFollowUp.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_BASE_QUESTION_BANK, ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS, getLocalizedArenaQuestion } from '../src/data/arenaQuestionTranslations.js';
import { getListeningTestDisplayInfo } from '../src/utils/testLocalizationHelper.js';

console.log('--- Running Step 195: Track 41 Audio & Travel Follow-up Integration Test ---');

// 1. Verify Track 41 Dataset Integrity
assert.ok(track41TravelExperiencesFollowUp, 'Track 41 dataset must exist');
assert.strictEqual(track41TravelExperiencesFollowUp.id, 'ielts-listening-track41-speaking-followup-travel');
assert.strictEqual(track41TravelExperiencesFollowUp.totalQuestions, 10);
assert.strictEqual(track41TravelExperiencesFollowUp.audioDuration, 92);
assert.ok(track41TravelExperiencesFollowUp.audioUrl.includes('track41-speaking-followup-travel.mp3'));
assert.strictEqual(track41TravelExperiencesFollowUp.parts.length, 2, 'Must have 2 parts');

// Part 1: Sentence Completion
const p1 = track41TravelExperiencesFollowUp.parts[0];
assert.strictEqual(p1.partNumber, 1);
assert.ok(p1.questionGroups && p1.questionGroups.length === 1);
const g1 = p1.questionGroups[0];
assert.strictEqual(g1.id, 'qg-t41-p1');
assert.strictEqual(g1.type, 'sentence_completion');
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
const p2 = track41TravelExperiencesFollowUp.parts[1];
assert.strictEqual(p2.partNumber, 2);
assert.ok(p2.questionGroups && p2.questionGroups.length === 1);
const g2 = p2.questionGroups[0];
assert.strictEqual(g2.id, 'qg-t41-p2');
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
const t41Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track41-speaking-followup-travel');
assert.ok(t41Test, 'Track 41 must be registered in INITIAL_LISTENING_TESTS');
assert.ok(INITIAL_LISTENING_TESTS.slice(0, 5).some(t => t.id === 'ielts-listening-track41-speaking-followup-travel'), 'Track 41 must be among top tests');

// 3. Verify Track 41 Micro-Drills
const t41Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track41'));
assert.strictEqual(t41Drills.length, 4, 'Must have 4 Track 41 micro-drills');
t41Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track41-speaking-followup-travel'), `Drill ${d.id} has valid audio URL`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
  assert.ok(d.clipStart >= 0, `Drill ${d.id} clipStart must be >= 0`);
  assert.ok(d.clipEnd > d.clipStart, `Drill ${d.id} clipEnd must be > clipStart`);
});

// 4. Verify Arena Question Bank Integration
const expectedArenaIds = [
  'easy_lis_tibet_memory_t41',
  'med_lis_travel_value_t41',
  'easy_lis_paris_culture_t41',
  'med_lis_rome_opera_t41',
  'hard_lis_london_umbrella_advice_t41'
];

expectedArenaIds.forEach(id => {
  const baseQ = ARENA_BASE_QUESTION_BANK.find(q => q.id === id);
  assert.ok(baseQ, `Arena base question ${id} must exist`);
  assert.ok(baseQ.promptEn, `${id} must have promptEn`);
  assert.ok(baseQ.contextEn, `${id} must have contextEn`);

  const enrichedQ = ARENA_QUESTION_BANK.find(q => q.id === id);
  assert.ok(enrichedQ, `Enriched question ${id} must exist`);
  assert.strictEqual(enrichedQ.isR2Audio, true, `${id} must have isR2Audio=true`);
  assert.ok(enrichedQ.audioUrl.includes('track41-speaking-followup-travel'), `${id} audioUrl matches Track 41`);
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

// 5. Verify Test Display Info & Track 41 Badge Formatter
const t41DisplayEn = getListeningTestDisplayInfo(track41TravelExperiencesFollowUp, true);
assert.strictEqual(t41DisplayEn.trackBadge, 'Track 41', 'Must produce Track 41 badge');
assert.strictEqual(t41DisplayEn.shortTitle, 'Travel Experiences & Follow-up Questions', 'Must produce concise English short title');
assert.ok(!/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(t41DisplayEn.shortTitle), 'Zero Vietnamese in English short title');

const t41DisplayVi = getListeningTestDisplayInfo(track41TravelExperiencesFollowUp, false);
assert.strictEqual(t41DisplayVi.trackBadge, 'Track 41', 'Must produce Track 41 badge in Vietnamese mode');
assert.strictEqual(t41DisplayVi.shortTitle, 'Trải nghiệm du lịch & Câu hỏi mở rộng', 'Must produce Vietnamese short title');

console.log('✅ Step 195: Track 41 Complete Audio & Travel Follow-up Integration Verified Successfully!');
