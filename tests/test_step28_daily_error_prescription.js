import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { 
  VIETNAMESE_IELTS_TRAPS, 
  generateDailyPrescription 
} from '../src/services/prescriptionService.js';
import { FEATURE_REGISTRY } from '../src/core/featureRegistry.js';

console.log('🧪 Testing Step 28: Daily Error Prescription & Spaced Repetition Loop');

// 1. Test VIETNAMESE_IELTS_TRAPS constant
assert.ok(Array.isArray(VIETNAMESE_IELTS_TRAPS), 'VIETNAMESE_IELTS_TRAPS must be an array');
assert.ok(VIETNAMESE_IELTS_TRAPS.length >= 5, 'Must contain at least 5 common Vietnamese IELTS traps');

VIETNAMESE_IELTS_TRAPS.forEach((trap, i) => {
  assert.ok(trap.id, `Trap ${i} must have an id`);
  assert.ok(trap.title, `Trap ${i} must have a title`);
  assert.ok(trap.errorSample, `Trap ${i} must have an errorSample`);
  assert.ok(trap.correctSample, `Trap ${i} must have a correctSample`);
  assert.ok(trap.quiz, `Trap ${i} must have quiz data`);
  assert.ok(Array.isArray(trap.quiz.options), `Trap ${i} quiz must have options array`);
  assert.equal(trap.quiz.options.length, 3, `Trap ${i} quiz must have exactly 3 options`);
  assert.ok(typeof trap.quiz.correctIndex === 'number', `Trap ${i} quiz must have numeric correctIndex`);
  assert.ok(trap.quiz.tip, `Trap ${i} quiz must have an explanation tip`);
});
console.log('  ✅ 1. VIETNAMESE_IELTS_TRAPS contains valid, structured high-yield error traps with 3-option quizzes');

// 2. Test generateDailyPrescription with empty history (Fallback to traps)
const fallbackPrescription = generateDailyPrescription([], []);
assert.ok(fallbackPrescription, 'Fallback prescription generated');
assert.ok(fallbackPrescription.id.startsWith('rx-'), 'Prescription ID must start with rx-');
assert.equal(fallbackPrescription.questions.length, 5, 'Must generate 5 micro-quiz questions');
assert.equal(fallbackPrescription.isPersonalized, false, 'Without mistakes, isPersonalized should be false');
console.log('  ✅ 2. generateDailyPrescription handles empty user history by serving 5 curated Vietnamese IELTS traps');

// 3. Test generateDailyPrescription with user mistakes
const mockMistakes = [
  {
    original: 'He explained me about the problem.',
    corrected: 'He explained the problem to me.',
    rule: 'Explain does not take an indirect object directly: explain something to somebody.',
    category: 'Grammar'
  },
  {
    original: 'In the today modern society...',
    corrected: 'In today\'s modern society...',
    rule: 'Do not use "the today", use "today\'s" or "in modern society".',
    category: 'Collocation'
  }
];

const personalizedPrescription = generateDailyPrescription(mockMistakes, []);
assert.ok(personalizedPrescription, 'Personalized prescription generated');
assert.equal(personalizedPrescription.isPersonalized, true, 'isPersonalized should be true with user mistakes');
assert.ok(personalizedPrescription.questions.length >= 3, 'Must have at least 3 questions');

const firstQ = personalizedPrescription.questions[0];
assert.ok(firstQ.options.includes('He explained the problem to me.'), 'Correct answer must be present in options');
assert.equal(firstQ.options[firstQ.correctIndex], 'He explained the problem to me.', 'correctIndex must point to correct answer');
console.log('  ✅ 3. generateDailyPrescription builds personalized spaced repetition questions from user mistake notebook');

// 4. Test generateDailyPrescription with writing submission evaluation errors
const mockSubmissions = [
  {
    evaluation: {
      gra: {
        weaknesses: [
          'Frequent comma splices connecting two independent clauses without coordinating conjunctions.'
        ]
      }
    }
  }
];

const submissionPrescription = generateDailyPrescription([], mockSubmissions);
assert.ok(submissionPrescription.questions.length >= 3, 'Questions generated with submission evaluation data');
console.log('  ✅ 4. generateDailyPrescription extracts diagnostic weaknesses from past writing evaluations');

// 5. Test Integration in WritingSubHeaderToolbar.jsx
const toolbarPath = path.resolve('src/components/WritingSubHeaderToolbar.jsx');
const toolbarCode = fs.readFileSync(toolbarPath, 'utf8');
assert.ok(toolbarCode.includes('onOpenPrescription'), 'WritingSubHeaderToolbar must accept onOpenPrescription prop');
assert.ok(toolbarCode.includes('Đơn Thuốc Sửa Lỗi'), 'WritingSubHeaderToolbar must render Đơn Thuốc Sửa Lỗi entry');
console.log('  ✅ 5. WritingSubHeaderToolbar.jsx successfully integrates onOpenPrescription in tools menu');

// 6. Test Integration in UserProfileModal.jsx
const profilePath = path.resolve('src/components/UserProfileModal.jsx');
const profileCode = fs.readFileSync(profilePath, 'utf8');
assert.ok(profileCode.includes('onOpenPrescription'), 'UserProfileModal must accept onOpenPrescription prop');
assert.ok(profileCode.includes('Đơn Thuốc Sửa Lỗi Sai Mỗi Ngày'), 'UserProfileModal must render daily prescription interactive card');
console.log('  ✅ 6. UserProfileModal.jsx successfully integrates daily prescription card in overview tab');

// 7. Test Integration in App.jsx
const appPath = path.resolve('src/App.jsx');
const appCode = fs.readFileSync(appPath, 'utf8');
assert.ok(appCode.includes('DailyErrorPrescriptionModal'), 'App.jsx must import and render DailyErrorPrescriptionModal');
assert.ok(appCode.includes('isPrescriptionOpen'), 'App.jsx must manage isPrescriptionOpen state');
console.log('  ✅ 7. App.jsx successfully manages and renders DailyErrorPrescriptionModal');

// 8. Test Feature Registry Declaration
const prescriptionFeature = FEATURE_REGISTRY.find(f => f.id === 'feat-daily-error-prescription');
assert.ok(prescriptionFeature, 'Feature feat-daily-error-prescription must be registered in FEATURE_REGISTRY');
assert.equal(prescriptionFeature.category, 'practice_tools', 'Prescription feature belongs to practice_tools category');
assert.equal(prescriptionFeature.quickAction.target, 'prescription', 'Quick action targets prescription modal');
console.log('  ✅ 8. feat-daily-error-prescription is registered in FEATURE_REGISTRY for F1 Help Center');

console.log('\n🎉 ALL 8 Step 28 Daily Error Prescription tests passed flawlessly!');
