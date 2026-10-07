/**
 * tests/test_step103_i18n_ai_evaluation_localization.js
 * 
 * Step 103: Phase 3 Bilingual AI Evaluation & Feedback Engine Localization
 * Verifies:
 * 1. Dictionary parity for new feedback subsections (tabs, actions, zpd, speaking) in vi.js and en.js.
 * 2. Resolution of feedback keys in both English and Vietnamese environments.
 * 3. evaluateEssay in writingAiService.js supports language param, language-specific error messages and prompt directives.
 * 4. evaluateSpeakingMockExam & evaluateSpeakingMicroDrill in speakingAiService.js support language param and prompt directives.
 * 5. App.jsx passes active language into evaluateEssay calls.
 * 6. SpeakingWorkspace.jsx passes active language into evaluateSpeakingMockExam calls.
 * 7. FeedbackModal.jsx integrates useTranslation, localized tabs, radar labels, action buttons, and ZPD goals.
 * 8. SpeakingResultModal.jsx integrates useTranslation, localized headers, rank badges, and tabs.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  setLanguage,
  getLanguage,
  t,
  isEnglish,
  isVietnamese
} from '../src/i18n/i18nService.js';

import { vi } from '../src/i18n/locales/vi.js';
import { en } from '../src/i18n/locales/en.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- RUNNING STEP 103: BILINGUAL AI EVALUATION & FEEDBACK LOCALIZATION ---');

let passedTests = 0;

function it(desc, fn) {
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    throw err;
  }
}

// 1. Dictionary Parity for Feedback Subsections
it('1. Feedback sub-objects (tabs, actions, zpd, speaking) maintain exact parity in vi.js and en.js', () => {
  const sections = ['tabs', 'actions', 'zpd', 'speaking'];
  
  sections.forEach(sec => {
    assert.ok(vi.feedback[sec], `vi.feedback missing section '${sec}'`);
    assert.ok(en.feedback[sec], `en.feedback missing section '${sec}'`);
    
    const viKeys = Object.keys(vi.feedback[sec]);
    const enKeys = Object.keys(en.feedback[sec]);
    
    viKeys.forEach(k => {
      assert.ok(k in en.feedback[sec], `Missing key '${sec}.${k}' in en.feedback`);
    });
    
    enKeys.forEach(k => {
      assert.ok(k in vi.feedback[sec], `Missing key '${sec}.${k}' in vi.feedback`);
    });
  });
});

// 2. Feedback Key Resolution
it('2. Feedback keys resolve accurately according to active language state', () => {
  // English mode
  setLanguage('en');
  assert.strictEqual(t('feedback.tabs.criteria'), '4 Criteria & Roadmap');
  assert.strictEqual(t('feedback.tabs.rewrites'), 'Band 8.5+ Upgrades');
  assert.strictEqual(t('feedback.actions.rewriteV2'), 'Rewrite v2');
  assert.strictEqual(t('feedback.zpd.title'), 'Pedagogical Focus (ZPD):');
  assert.strictEqual(t('feedback.speaking.reportTitle'), 'IELTS Speaking Evaluation Report');
  assert.strictEqual(t('feedback.speaking.reEvalAi'), 'Re-grade with AI');

  // Vietnamese mode
  setLanguage('vi');
  assert.strictEqual(t('feedback.tabs.criteria'), '4 Tiêu Chí & Lộ Trình');
  assert.strictEqual(t('feedback.tabs.rewrites'), 'Bản Nâng Cấp Band 8.5+');
  assert.strictEqual(t('feedback.actions.rewriteV2'), 'Viết Lại v2');
  assert.strictEqual(t('feedback.zpd.title'), 'Mục tiêu sư phạm (ZPD):');
  assert.strictEqual(t('feedback.speaking.reportTitle'), 'Báo Cáo Đánh Giá IELTS Speaking');
  assert.strictEqual(t('feedback.speaking.reEvalAi'), 'Chấm Lại Bằng AI');
});

// 3. Writing AI Service Localization
it('3. writingAiService.js evaluateEssay incorporates language parameter & English prompt directive', () => {
  const writingServicePath = path.resolve(__dirname, '../src/services/ai/writingAiService.js');
  const content = fs.readFileSync(writingServicePath, 'utf-8');

  assert.ok(content.includes("language = 'vi'"), 'evaluateEssay must accept default language = "vi"');
  assert.ok(content.includes('CRITICAL LANGUAGE DIRECTIVE'), 'evaluateEssay prompt must contain English language directive');
  assert.ok(content.includes("Please configure your AI API Key in Settings."), 'Bilingual API Key error message present');
  assert.ok(content.includes("Essay response is too short to evaluate"), 'Bilingual short essay error message present');
});

// 4. Speaking AI Service Localization
it('4. speakingAiService.js evaluateSpeakingMockExam & micro-drill incorporate language parameter & directives', () => {
  const speakingServicePath = path.resolve(__dirname, '../src/services/ai/speakingAiService.js');
  const content = fs.readFileSync(speakingServicePath, 'utf-8');

  assert.ok(content.includes("evaluateSpeakingMicroDrill({"), 'evaluateSpeakingMicroDrill exists');
  assert.ok(content.includes("evaluateSpeakingMockExam({"), 'evaluateSpeakingMockExam exists');
  assert.ok(content.includes("CRITICAL LANGUAGE RULE"), 'evaluateSpeakingMockExam prompt must contain English language directive');
  assert.ok(content.includes("LANGUAGE DIRECTIVE: Output all feedbacks, commentary and recommended actions strictly in ENGLISH"), 'MicroDrill prompt must contain English language directive');
});

// 5. App.jsx Integration
it('5. App.jsx extracts language from useTranslation and forwards to evaluateEssay', () => {
  const appPath = path.resolve(__dirname, '../src/App.jsx');
  const content = fs.readFileSync(appPath, 'utf-8');

  assert.ok(content.includes("const { t, language } = useTranslation();"), 'App.jsx must extract language from useTranslation');
  assert.ok(/evaluateEssay\(\{[\s\S]*?language[\s\S]*?\}\)/.test(content), 'App.jsx must pass language into evaluateEssay');
});

// 6. SpeakingWorkspace.jsx Integration
it('6. SpeakingWorkspace.jsx extracts language and passes to evaluateSpeakingMockExam', () => {
  const workspacePath = path.resolve(__dirname, '../src/components/speaking/SpeakingWorkspace.jsx');
  const content = fs.readFileSync(workspacePath, 'utf-8');

  assert.ok(content.includes("const { t, isEn, language } = useTranslation();"), 'SpeakingWorkspace must extract language');
  assert.ok(content.includes("language") && content.includes("evaluateSpeakingMockExam({"), 'SpeakingWorkspace must forward language to evaluateSpeakingMockExam');
});

// 7. FeedbackModal.jsx UI Localization
it('7. FeedbackModal.jsx integrates useTranslation, localized tabs, buttons, radar chart and ZPD goals', () => {
  const modalPath = path.resolve(__dirname, '../src/components/FeedbackModal.jsx');
  const content = fs.readFileSync(modalPath, 'utf-8');

  assert.ok(content.includes("useTranslation"), 'FeedbackModal must import useTranslation');
  assert.ok(content.includes("t('feedback.tabs.criteria'"), 'FeedbackModal must localize criteria tab');
  assert.ok(content.includes("t('feedback.tabs.paragraphs'"), 'FeedbackModal must localize paragraphs tab');
  assert.ok(content.includes("t('feedback.tabs.corrections'"), 'FeedbackModal must localize corrections tab');
  assert.ok(content.includes("t('feedback.tabs.rewrites'"), 'FeedbackModal must localize rewrites tab');
  assert.ok(content.includes("t('feedback.tabs.vocab'"), 'FeedbackModal must localize vocab tab');
  assert.ok(content.includes("t('feedback.zpd.title'"), 'FeedbackModal must localize ZPD title');
  assert.ok(content.includes("isEn ? 'Your Band Score' : 'Band Score của bạn'"), 'FeedbackModal radar chart must localize series label');
});

// 8. SpeakingResultModal.jsx UI Localization
it('8. SpeakingResultModal.jsx integrates useTranslation, localized headers, rank badges, and tabs', () => {
  const modalPath = path.resolve(__dirname, '../src/components/speaking/SpeakingResultModal.jsx');
  const content = fs.readFileSync(modalPath, 'utf-8');

  assert.ok(content.includes("useTranslation"), 'SpeakingResultModal must import useTranslation');
  assert.ok(content.includes("t('feedback.speaking.reportTitle'"), 'SpeakingResultModal must localize report title');
  assert.ok(content.includes("t('feedback.speaking.overviewTab'"), 'SpeakingResultModal must localize overview tab');
  assert.ok(content.includes("t('feedback.speaking.transcriptTab'"), 'SpeakingResultModal must localize transcript tab');
  assert.ok(content.includes("Fully operational command"), 'SpeakingResultModal must provide English rank description for Expert User');
});

console.log(`\n--- ALL ${passedTests} STEP 103 TESTS PASSED SUCCESFULLY ---\n`);
