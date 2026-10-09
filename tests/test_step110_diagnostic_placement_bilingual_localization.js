/**
 * Test Suite: Step 110 - Diagnostic Placement & 30-Day Roadmap Bilingual Localization Verification
 * Ensures zero untranslated Vietnamese leaks in the Diagnostic Placement Modal, question cards,
 * options, scoring breakdown, 30-day adaptive study plan, and persistent storage footers.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { en } from '../src/i18n/locales/en.js';
import { vi } from '../src/i18n/locales/vi.js';
import { 
  DIAGNOSTIC_QUESTIONS, 
  evaluateDiagnosticTest, 
  generate30DayStudyPlan 
} from '../src/utils/diagnosticPlacementEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- TEST STEP 110: DIAGNOSTIC PLACEMENT BILINGUAL LOCALIZATION ---');

let passedTests = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    throw err;
  }
}

// 1. Translation Dictionary Parity
it('1. modals.diagnostic dictionary parity between en.js and vi.js', () => {
  const enDiag = en.modals.diagnostic;
  const viDiag = vi.modals.diagnostic;

  assert.ok(enDiag, 'en.modals.diagnostic must exist');
  assert.ok(viDiag, 'vi.modals.diagnostic must exist');

  const requiredKeys = [
    'title',
    'subtitle',
    'cambridgeBadge',
    'questionProgress',
    'answered',
    'jumpTo',
    'prevQuestion',
    'nextQuestion',
    'finishAndScore',
    'introTip',
    'submitNow',
    'resultBanner',
    'estimatedBand',
    'resultSummary',
    'correctCount',
    'weaknessesTitle',
    'roadmapTitle',
    'roadmapProgress',
    'exportPlan',
    'retake',
    'weekTab',
    'daysCompleted',
    'dayLabel',
    'reviewTitle',
    'answerLabel',
    'userAnswerLabel',
    'indexedDbFooter',
    'close',
    'retakeConfirm'
  ];

  requiredKeys.forEach(k => {
    assert.ok(enDiag[k], `Missing key in en.modals.diagnostic: ${k}`);
    assert.ok(viDiag[k], `Missing key in vi.modals.diagnostic: ${k}`);
  });
});

// 2. DIAGNOSTIC_QUESTIONS Bilingual Coverage
it('2. DIAGNOSTIC_QUESTIONS contains full English and Vietnamese prompts and options', () => {
  assert.strictEqual(DIAGNOSTIC_QUESTIONS.length, 16);

  DIAGNOSTIC_QUESTIONS.forEach(q => {
    assert.ok(q.title && q.title.length > 0, `Question ${q.id} missing title`);
    assert.ok(q.titleEn && q.titleEn.length > 0, `Question ${q.id} missing titleEn`);
    assert.ok(q.question && q.question.length > 0, `Question ${q.id} missing question`);
    assert.ok(q.questionEn && q.questionEn.length > 0, `Question ${q.id} missing questionEn`);
    assert.ok(q.explanation && q.explanation.length > 0, `Question ${q.id} missing explanation`);
    assert.ok(q.explanationEn && q.explanationEn.length > 0, `Question ${q.id} missing explanationEn`);

    q.options.forEach(opt => {
      assert.ok(opt.text && opt.text.length > 0, `Option in ${q.id} missing text`);
      assert.ok(opt.textEn && opt.textEn.length > 0, `Option in ${q.id} missing textEn`);
    });
  });
});

// 3. evaluateDiagnosticTest Bilingual Weaknesses and Detailed Review
it('3. evaluateDiagnosticTest outputs bilingual weaknesses and question details', () => {
  const result = evaluateDiagnosticTest({});
  assert.strictEqual(result.totalQuestions, 16);
  assert.strictEqual(result.weaknesses.length, 4);

  result.weaknesses.forEach(w => {
    assert.ok(w.title && w.title.length > 0, 'Weakness missing title');
    assert.ok(w.titleEn && w.titleEn.length > 0, 'Weakness missing titleEn');
    assert.ok(w.advice && w.advice.length > 0, 'Weakness missing advice');
    assert.ok(w.adviceEn && w.adviceEn.length > 0, 'Weakness missing adviceEn');
  });

  result.detailedQuestions.forEach(dq => {
    assert.ok(dq.title && dq.title.length > 0, 'Detailed question missing title');
    assert.ok(dq.titleEn && dq.titleEn.length > 0, 'Detailed question missing titleEn');
    assert.ok(dq.explanation && dq.explanation.length > 0, 'Detailed question missing explanation');
    assert.ok(dq.explanationEn && dq.explanationEn.length > 0, 'Detailed question missing explanationEn');
  });
});

// 4. generate30DayStudyPlan Full 30-Day Bilingual Coverage
it('4. generate30DayStudyPlan contains titleEn and taskDescriptionEn for all 30 days', () => {
  const plan = generate30DayStudyPlan(5.5, 7.0, []);
  assert.strictEqual(plan.length, 30);

  plan.forEach(day => {
    assert.ok(day.title && day.title.length > 0, `Day ${day.day} missing title`);
    assert.ok(day.titleEn && day.titleEn.length > 0, `Day ${day.day} missing titleEn`);
    assert.ok(day.duration && day.duration.length > 0, `Day ${day.day} missing duration`);
    assert.ok(day.durationEn && day.durationEn.length > 0, `Day ${day.day} missing durationEn`);
    assert.ok(day.taskDescription && day.taskDescription.length > 0, `Day ${day.day} missing taskDescription`);
    assert.ok(day.taskDescriptionEn && day.taskDescriptionEn.length > 0, `Day ${day.day} missing taskDescriptionEn`);
  });
});

// 5. DiagnosticPlacementModal.jsx Implementation Inspection
it('5. DiagnosticPlacementModal.jsx connects all localized labels and removes raw Vietnamese', () => {
  const modalContent = fs.readFileSync(
    path.join(__dirname, '../src/components/DiagnosticPlacementModal.jsx'),
    'utf-8'
  );

  // Checks that useTranslation & isEn are active
  assert.ok(modalContent.includes('const { t, isEn } = useTranslation();'), 'Missing useTranslation destructuring');

  // Question navigation and pills
  assert.ok(modalContent.includes("t('modals.diagnostic.questionProgress'"), 'Missing questionProgress i18n call');
  assert.ok(modalContent.includes("t('modals.diagnostic.answered'"), 'Missing answered count i18n call');
  assert.ok(modalContent.includes("t('modals.diagnostic.jumpTo'"), 'Missing jumpTo i18n call');

  // Question cards and options
  assert.ok(modalContent.includes('isEn ? (currentQ.titleEn || currentQ.title) : currentQ.title'), 'Missing bilingual question title');
  assert.ok(modalContent.includes('isEn ? (currentQ.questionEn || currentQ.question) : currentQ.question'), 'Missing bilingual question prompt');
  assert.ok(modalContent.includes('isEn ? (opt.textEn || opt.text) : opt.text'), 'Missing bilingual option text');

  // Next/Back and Submit
  assert.ok(modalContent.includes("t('modals.diagnostic.prevQuestion'"), 'Missing prevQuestion i18n call');
  assert.ok(modalContent.includes("t('modals.diagnostic.nextQuestion'"), 'Missing nextQuestion i18n call');
  assert.ok(modalContent.includes("t('modals.diagnostic.finishAndScore'"), 'Missing finishAndScore i18n call');
  assert.ok(modalContent.includes("t('modals.diagnostic.submitNow'"), 'Missing submitNow i18n call');

  // Modal Footer & Confirmation
  assert.ok(modalContent.includes("t('modals.diagnostic.indexedDbFooter'"), 'Missing indexedDbFooter i18n call');
  assert.ok(modalContent.includes("t('modals.diagnostic.close'"), 'Missing close i18n call');
  assert.ok(modalContent.includes("'modals.diagnostic.retakeConfirm'"), 'Missing retakeConfirm i18n call');

  // Must not have hardcoded raw Vietnamese in navigation
  assert.ok(!modalContent.includes('<span>Câu trước</span>'), 'Found hardcoded "Câu trước"');
  assert.ok(!modalContent.includes('<span>Câu tiếp</span>'), 'Found hardcoded "Câu tiếp"');
  assert.ok(!modalContent.includes('<span>Hoàn Thành & Chấm Điểm</span>'), 'Found hardcoded "Hoàn Thành & Chấm Điểm"');
  assert.ok(!modalContent.includes('<span>Dữ liệu lưu trữ tự động trên IndexedDB (vượt giới hạn 5MB của trình duyệt)</span>'), 'Found hardcoded IndexedDB footer');
});

console.log(`\n🎉 ALL ${passedTests}/5 TESTS PASSED CLEANLY FOR STEP 110!`);
