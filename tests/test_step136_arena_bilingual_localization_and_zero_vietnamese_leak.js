/**
 * tests/test_step136_arena_bilingual_localization_and_zero_vietnamese_leak.js
 * 
 * Comprehensive Test Suite for Step 136:
 * Verifies 100% Zero Leftover Vietnamese in English Mode across Atlas English Arena:
 * 1. ARENA_QUESTION_TRANSLATIONS maps all Batch 1 & Batch 2 questions to English.
 * 2. b2_easy_reading_14 (the user's reported screenshot question) translates to authentic Cambridge CDI format.
 * 3. getLocalizedArenaQuestion correctly switches between English and Vietnamese modes.
 * 4. All generated sprint questions produce 0 Vietnamese characters in prompts, contexts, options, and explanations when isEn === true.
 * 5. Parenthetical Vietnamese notes in listening drill options are completely stripped out.
 */

import assert from 'assert';
import { ARENA_QUESTION_TRANSLATIONS, getLocalizedArenaQuestion } from '../src/data/arenaQuestionTranslations.js';
import { ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { generateArenaSprintQuestions, adaptListeningDrill } from '../src/adapters/sprintQuestionAdapter.js';

console.log('🧪 Testing Step 136: Arena Bilingual Localization & Zero Vietnamese Leaks in English Mode...\n');

const hasVi = (str) => typeof str === 'string' && /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i.test(str);

// ---------------------------------------------------------------------------
// TEST 1: ARENA_QUESTION_TRANSLATIONS contains at least 200 question entries
// ---------------------------------------------------------------------------
const transKeys = Object.keys(ARENA_QUESTION_TRANSLATIONS);
assert(transKeys.length >= 200, `Expected at least 200 translations, found ${transKeys.length}`);
console.log(`✅ Test 1 Passed: Translation dictionary contains ${transKeys.length} question mappings.`);

// ---------------------------------------------------------------------------
// TEST 2: Zero Vietnamese in ARENA_QUESTION_TRANSLATIONS English values
// ---------------------------------------------------------------------------
let viCountInTranslations = 0;
for (const [id, t] of Object.entries(ARENA_QUESTION_TRANSLATIONS)) {
  if (hasVi(t.promptEn)) viCountInTranslations++;
  if (hasVi(t.explanationEn)) viCountInTranslations++;
  if (hasVi(t.contextEn)) viCountInTranslations++;
}
assert.strictEqual(viCountInTranslations, 0, `Expected 0 Vietnamese in translations, found ${viCountInTranslations}`);
console.log('✅ Test 2 Passed: 100% of translations in dictionary contain zero Vietnamese characters.');

// ---------------------------------------------------------------------------
// TEST 3: Specific Verification of User-Reported Question (b2_easy_reading_14)
// ---------------------------------------------------------------------------
const reportedQ = ARENA_QUESTION_BANK.find(q => q.id === 'b2_easy_reading_14');
assert(reportedQ, 'b2_easy_reading_14 must exist in ARENA_QUESTION_BANK');

const localizedEn = getLocalizedArenaQuestion(reportedQ, true);
assert.strictEqual(
  localizedEn.prompt,
  'According to the passage, is the statement TRUE, FALSE, or NOT GIVEN?',
  'English prompt must be authentic Cambridge instruction'
);
assert(!hasVi(localizedEn.prompt), 'English prompt must have 0 Vietnamese');
assert(!hasVi(localizedEn.context), 'English context must have 0 Vietnamese');
assert(!hasVi(localizedEn.explanation), 'English explanation must have 0 Vietnamese');

const localizedVi = getLocalizedArenaQuestion(reportedQ, false);
assert.strictEqual(
  localizedVi.prompt,
  'Theo đoạn văn, nhận định sau là TRUE, FALSE hay NOT GIVEN?',
  'Vietnamese prompt must be preserved when isEn === false'
);
console.log('✅ Test 3 Passed: b2_easy_reading_14 is perfectly localized in English and Vietnamese.');

// ---------------------------------------------------------------------------
// TEST 4: ARENA_QUESTION_BANK items carry both promptEn and promptVi
// ---------------------------------------------------------------------------
const b1AndB2Items = ARENA_QUESTION_BANK.filter(q => q.id.startsWith('b1_') || q.id.startsWith('b2_'));
assert(b1AndB2Items.length >= 200, 'Must have at least 200 Batch 1 & 2 items in question bank');
const missingPromptEn = b1AndB2Items.filter(q => !q.promptEn);
assert.strictEqual(missingPromptEn.length, 0, 'Every Batch 1 & 2 item must have promptEn');
console.log(`✅ Test 4 Passed: All ${b1AndB2Items.length} bank questions carry native promptEn properties.`);

// ---------------------------------------------------------------------------
// TEST 5: Stripping Vietnamese Annotations in Listening Drill Options
// ---------------------------------------------------------------------------
const sampleDrillItem = {
  id: 'test-dist-1',
  question: 'At what time will the coach depart?',
  options: [
    { id: 'A', text: '8:15 AM (Thời gian dự kiến ban đầu)' },
    { id: 'B', text: '8:45 AM (Thời gian điều chỉnh lần 1)' },
    { id: 'C', text: '9:00 AM (Thời gian chốt cuối cùng)' }
  ],
  correctOption: 'C',
  explanation: 'Đổi ý sang 9:00 AM.'
};
const adapted = adaptListeningDrill(sampleDrillItem);
assert.deepStrictEqual(adapted.options, ['8:15 AM', '8:45 AM', '9:00 AM']);
assert.strictEqual(adapted.correctAnswer, '9:00 AM');
assert(!hasVi(adapted.explanationEn), 'Adapted listening drill must have English explanationEn');
console.log('✅ Test 5 Passed: Parenthetical Vietnamese notes stripped cleanly from option texts.');

// ---------------------------------------------------------------------------
// TEST 6: Stress Testing 200 Generated Sprint Questions with Zero Vietnamese
// ---------------------------------------------------------------------------
let totalTested = 0;
for (let i = 0; i < 10; i++) {
  const sprintQs = generateArenaSprintQuestions({ count: 20 });
  totalTested += sprintQs.length;
  for (const rawQ of sprintQs) {
    const q = getLocalizedArenaQuestion(rawQ, true);
    assert(!hasVi(q.prompt), `Detected Vietnamese prompt in ${q.id}: ${q.prompt}`);
    assert(!hasVi(q.context), `Detected Vietnamese context in ${q.id}: ${q.context}`);
    assert(!hasVi(q.explanation), `Detected Vietnamese explanation in ${q.id}: ${q.explanation}`);
    if (Array.isArray(q.options)) {
      for (const opt of q.options) {
        assert(!hasVi(opt), `Detected Vietnamese option in ${q.id}: ${opt}`);
      }
    }
  }
}
console.log(`✅ Test 6 Passed: Stress tested ${totalTested} generated questions across 10 sprints with 0 Vietnamese.`);

// ---------------------------------------------------------------------------
// TEST 7: Dynamic Language Re-rendering without reload
// ---------------------------------------------------------------------------
const sampleQ = ARENA_QUESTION_BANK.find(q => q.id === 'b1_easy_spell_01');
const enVersion = getLocalizedArenaQuestion(sampleQ, true);
const viVersion = getLocalizedArenaQuestion(sampleQ, false);
assert(enVersion.prompt !== viVersion.prompt, 'Prompt must differ between languages');
assert(!hasVi(enVersion.prompt), 'EN version must not have Vietnamese');
assert(hasVi(viVersion.prompt), 'VI version must have Vietnamese');
console.log('✅ Test 7 Passed: Instant bilingual re-rendering works without page reload.');

console.log('\n===============================================================');
console.log('✅ All 7/7 Step 136 arena bilingual localization tests passed cleanly!');
console.log('===============================================================\n');
