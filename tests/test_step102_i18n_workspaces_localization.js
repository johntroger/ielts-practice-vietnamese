/**
 * tests/test_step102_i18n_workspaces_localization.js
 * 
 * Step 102: Phase 2 Bilingual Workspaces & UI Shell Localization
 * Verifies:
 * 1. Comprehensive dictionary parity across all workspaces namespaces (toolbar, timer, slideOver, writing, reading, listening, speaking, feedback).
 * 2. Key matching across all newly added workspace keys between vi.js and en.js.
 * 3. Localization integration in Writing Workspace (WritingSubHeaderToolbar.jsx, TimerBar.jsx, EditorPane.jsx).
 * 4. Localization integration in Reading Workspace (ReadingWorkspace.jsx, QuestionPaletteBar.jsx).
 * 5. Localization integration in Listening Workspace (ListeningWorkspace.jsx, ListeningPaletteBar.jsx).
 * 6. Localization integration in Speaking Workspace (SpeakingWorkspace.jsx).
 * 7. Localization integration in Side Assistant (SlideOverToolPanel.jsx).
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  getLanguage,
  setLanguage,
  t,
  isEnglish,
  isVietnamese
} from '../src/i18n/i18nService.js';

import { vi } from '../src/i18n/locales/vi.js';
import { en } from '../src/i18n/locales/en.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- RUNNING STEP 102: WORKSPACES & UI SHELL LOCALIZATION ---');

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

// 1. Comprehensive Dictionary Parity across all Workspace Namespaces
it('1. Comprehensive namespace and key parity between vi.js and en.js across all workspaces', () => {
  const namespaces = [
    'common',
    'nav',
    'settings',
    'toolbar',
    'timer',
    'slideOver',
    'writing',
    'reading',
    'listening',
    'speaking',
    'feedback'
  ];

  namespaces.forEach(ns => {
    assert.ok(vi[ns], `vi.js missing namespace '${ns}'`);
    assert.ok(en[ns], `en.js missing namespace '${ns}'`);

    const viKeys = Object.keys(vi[ns]);
    const enKeys = Object.keys(en[ns]);

    // Check all vi keys exist in en
    viKeys.forEach(key => {
      assert.ok(key in en[ns], `Key '${ns}.${key}' in vi.js is missing in en.js`);
    });

    // Check all en keys exist in vi
    enKeys.forEach(key => {
      assert.ok(key in vi[ns], `Key '${ns}.${key}' in en.js is missing in vi.js`);
    });
  });
});

// 2. Bilingual translations evaluation for Reading, Listening & Speaking
it('2. Workspace-specific keys resolve accurately in both English and Vietnamese', () => {
  // English checks
  setLanguage('en');
  assert.strictEqual(t('toolbar.proStudio'), 'Pro Studio');
  assert.strictEqual(t('reading.passageTab'), '📖 Reading Passage');
  assert.strictEqual(t('reading.questionsTab'), '📝 Questions');
  assert.strictEqual(t('listening.testLibrary'), 'Test Bank');
  assert.strictEqual(t('speaking.roomTitle'), 'IELTS Speaking Virtual Studio');

  // Vietnamese checks
  setLanguage('vi');
  assert.strictEqual(t('toolbar.proStudio'), 'Pro Studio');
  assert.strictEqual(t('reading.passageTab'), '📖 Bài Đọc');
  assert.strictEqual(t('reading.questionsTab'), '📝 Câu Hỏi');
  assert.strictEqual(t('listening.testLibrary'), 'Kho Đề');
  assert.strictEqual(t('speaking.roomTitle'), 'Phòng Thi Ảo IELTS Speaking');
});

// 3. Writing Components Integration Check
it('3. Writing Workspace components (WritingSubHeaderToolbar, TimerBar, EditorPane) integrate useTranslation', () => {
  const toolbarPath = path.resolve(__dirname, '../src/components/WritingSubHeaderToolbar.jsx');
  const toolbarContent = fs.readFileSync(toolbarPath, 'utf-8');
  assert.ok(toolbarContent.includes('useTranslation'), 'WritingSubHeaderToolbar must import useTranslation');
  assert.ok(toolbarContent.includes("t('toolbar.proStudio'"), 'WritingSubHeaderToolbar must use toolbar.proStudio key');

  const timerBarPath = path.resolve(__dirname, '../src/components/TimerBar.jsx');
  const timerBarContent = fs.readFileSync(timerBarPath, 'utf-8');
  assert.ok(timerBarContent.includes('useTranslation'), 'TimerBar must import useTranslation');
  assert.ok(timerBarContent.includes('isEn ?'), 'TimerBar must support English mode switching');

  const editorPath = path.resolve(__dirname, '../src/components/EditorPane.jsx');
  const editorContent = fs.readFileSync(editorPath, 'utf-8');
  assert.ok(editorContent.includes('useTranslation'), 'EditorPane must import useTranslation');
  assert.ok(editorContent.includes('isEn ?'), 'EditorPane must support bilingual text switching');
});

// 4. Reading Components Integration Check
it('4. Reading Workspace components (ReadingWorkspace, QuestionPaletteBar) integrate useTranslation', () => {
  const readingPath = path.resolve(__dirname, '../src/components/reading/ReadingWorkspace.jsx');
  const readingContent = fs.readFileSync(readingPath, 'utf-8');
  assert.ok(readingContent.includes('useTranslation'), 'ReadingWorkspace must import useTranslation');
  assert.ok(readingContent.includes("t('reading.passageTab'"), 'ReadingWorkspace must use reading.passageTab key');
  assert.ok(readingContent.includes("t('reading.questionsTab'"), 'ReadingWorkspace must use reading.questionsTab key');

  const palettePath = path.resolve(__dirname, '../src/components/reading/QuestionPaletteBar.jsx');
  const paletteContent = fs.readFileSync(palettePath, 'utf-8');
  assert.ok(paletteContent.includes('useTranslation'), 'QuestionPaletteBar must import useTranslation');
  assert.ok(paletteContent.includes("t('reading.submitTest'"), 'QuestionPaletteBar must use reading.submitTest key');
});

// 5. Listening Components Integration Check
it('5. Listening Workspace components (ListeningWorkspace, ListeningPaletteBar) integrate useTranslation', () => {
  const listeningPath = path.resolve(__dirname, '../src/components/listening/ListeningWorkspace.jsx');
  const listeningContent = fs.readFileSync(listeningPath, 'utf-8');
  assert.ok(listeningContent.includes('useTranslation'), 'ListeningWorkspace must import useTranslation');
  assert.ok(listeningContent.includes("t('listening.practiceMode'"), 'ListeningWorkspace must use listening.practiceMode key');
  assert.ok(listeningContent.includes("t('listening.testLibrary'"), 'ListeningWorkspace must use listening.testLibrary key');

  const listeningPalettePath = path.resolve(__dirname, '../src/components/listening/ListeningPaletteBar.jsx');
  const listeningPaletteContent = fs.readFileSync(listeningPalettePath, 'utf-8');
  assert.ok(listeningPaletteContent.includes('useTranslation'), 'ListeningPaletteBar must import useTranslation');
  assert.ok(listeningPaletteContent.includes("t('common.submit'"), 'ListeningPaletteBar must use common.submit key');
});

// 6. Speaking Workspace Integration Check
it('6. Speaking Workspace (SpeakingWorkspace.jsx) integrates useTranslation and mode pills', () => {
  const speakingPath = path.resolve(__dirname, '../src/components/speaking/SpeakingWorkspace.jsx');
  const speakingContent = fs.readFileSync(speakingPath, 'utf-8');
  assert.ok(speakingContent.includes('useTranslation'), 'SpeakingWorkspace must import useTranslation');
  assert.ok(speakingContent.includes("isEn ? 'Mock Exam' : 'Thi Thử'"), 'SpeakingWorkspace must localize mock exam mode pill');
  assert.ok(speakingContent.includes("isEn ? 'Practice Mode' : 'Luyện Tự Do'"), 'SpeakingWorkspace must localize practice mode pill');
});

// 7. SlideOver Tool Panel Integration Check
it('7. Slide-over Tool Panel (SlideOverToolPanel.jsx) integrates useTranslation for assistant tools', () => {
  const slideOverPath = path.resolve(__dirname, '../src/components/SlideOverToolPanel.jsx');
  const slideOverContent = fs.readFileSync(slideOverPath, 'utf-8');
  assert.ok(slideOverContent.includes('useTranslation'), 'SlideOverToolPanel must import useTranslation');
  assert.ok(slideOverContent.includes("t('slideOver.title'"), 'SlideOverToolPanel must use slideOver.title key');
  assert.ok(slideOverContent.includes("t('slideOver.vocabTab'"), 'SlideOverToolPanel must use slideOver.vocabTab key');
});

// Reset to default language
setLanguage('vi');

console.log(`\nAll ${passedTests}/${passedTests} checks PASSED for Step 102!`);
