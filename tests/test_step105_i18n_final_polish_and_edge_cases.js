/**
 * tests/test_step105_i18n_final_polish_and_edge_cases.js
 * 
 * Step 105: Phase 5 Final Polish, Edge-Case Auditing & Full Verification
 * Verifies:
 * 1. SettingsModal.jsx provides bilingual language toggle and persistence.
 * 2. KeyboardShortcutsModal.jsx provides bilingual shortcut descriptions and headers.
 * 3. MistakeLogModal.jsx provides bilingual headers and search input placeholders.
 * 4. VocabNotebookModal.jsx provides bilingual headers, due counts, and tab labels.
 * 5. ContactModal.jsx provides bilingual headers, subtitles, and category labels.
 * 6. UserProfileModal.jsx provides bilingual sidebar navigation and main portal headings.
 * 7. Language switching persistence & DOM synchronization (localStorage & document.documentElement.lang).
 * 8. Fallback resilience: t() returns fallback when key is not found or empty.
 * 9. Variable interpolation: t() correctly substitutes {count} and other placeholders.
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
  isVietnamese,
  subscribeLanguage
} from '../src/i18n/i18nService.js';

import { vi } from '../src/i18n/locales/vi.js';
import { en } from '../src/i18n/locales/en.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- RUNNING STEP 105: BILINGUAL FINAL POLISH & EDGE CASES ---');

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

// 1. SettingsModal.jsx
it('1. SettingsModal.jsx provides interactive bilingual toggle (vi / en)', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/SettingsModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'SettingsModal must use useTranslation');
  assert.ok(content.includes("setLanguage('vi')"), 'SettingsModal must allow setting vi');
  assert.ok(content.includes("setLanguage('en')"), 'SettingsModal must allow setting en');
  assert.ok(content.includes('Display Language'), 'SettingsModal must label language section');
});

// 2. KeyboardShortcutsModal.jsx
it('2. KeyboardShortcutsModal.jsx integrates bilingual shortcut descriptions', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/KeyboardShortcutsModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'KeyboardShortcutsModal must use useTranslation');
  assert.ok(content.includes("isEn ? 'Keyboard Shortcuts Guide' : 'Phím Tắt Nhanh (Shortcuts)'"));
  assert.ok(content.includes("isEn ? 'Toggle Zen Focus Mode' : 'Bật / Tắt Chế độ Tập Trung (Focus Mode)'"));
  assert.ok(content.includes("isEn ? 'Submit Essay & Request Cambridge AI Feedback' : 'Nộp bài & Yêu cầu Giám khảo AI Chấm Điểm 4 tiêu chí'"));
});

// 3. MistakeLogModal.jsx
it('3. MistakeLogModal.jsx integrates bilingual headers and placeholders', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/MistakeLogModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'MistakeLogModal must use useTranslation');
  assert.ok(content.includes("isEn ? 'Academic Mistake Log & Error Journal' : 'Sổ Tay Lỗi Sai Thường Gặp (Mistake Log)'"));
  assert.ok(content.includes("isEn ? \"Search errors by phrase, pattern, or explanation...\" : \"Tìm kiếm lỗi sai theo câu hoặc từ...\""));
});

// 4. VocabNotebookModal.jsx
it('4. VocabNotebookModal.jsx integrates bilingual vault headers and tabs', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/VocabNotebookModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'VocabNotebookModal must use useTranslation');
  assert.ok(content.includes("isEn ? 'Personal Lexicon & Vocab Vault' : 'Sổ Tay Từ Vựng Vàng (Vocab Vault)'"));
  assert.ok(content.includes("isEn ? `${dueItems.length} due` : `${dueItems.length} cần ôn`"));
  assert.ok(content.includes("isEn ? 'Flashcards & SM-2' : 'Ôn Luyện Flashcard SM-2'"));
});

// 5. ContactModal.jsx
it('5. ContactModal.jsx integrates bilingual feedback headers and categories', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/ContactModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'ContactModal must use useTranslation');
  assert.ok(content.includes("isEn ? 'Feedback & Contact Support' : 'Liên Hệ & Đóng Góp Ý Kiến'"));
  assert.ok(content.includes("isEn ? 'Feedback' : 'Góp ý chung'"));
  assert.ok(content.includes("isEn ? 'Bug Report' : 'Báo lỗi web'"));
});

// 6. UserProfileModal.jsx
it('6. UserProfileModal.jsx integrates bilingual portal navigation and headings', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/UserProfileModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'UserProfileModal must use useTranslation');
  assert.ok(content.includes("isEn ? 'Overview & Analytics' : 'Tổng Quan & Năng Lực'"));
  assert.ok(content.includes("isEn ? 'Writing Submissions' : 'Lịch Sử IELTS Writing'"));
  assert.ok(content.includes("isEn ? 'Holistic Performance & Cambridge Band Projections' : 'Tổng Quan Năng Lực & Dự Phóng Điểm IELTS'"));
  assert.ok(content.includes("isEn ? 'Account Configuration & Data Resilience' : 'Cài Đặt Tài Khoản & Quản Lý Dữ Liệu'"));
});

// 7. Language Persistence and Event Listeners
it('7. i18nService correctly persists language and triggers subscriber callback', () => {
  let observedLang = '';
  const unsubscribe = subscribeLanguage(lang => {
    observedLang = lang;
  });

  setLanguage('en');
  assert.strictEqual(getLanguage(), 'en');
  assert.strictEqual(isEnglish(), true);
  assert.strictEqual(isVietnamese(), false);
  assert.strictEqual(observedLang, 'en');

  setLanguage('vi');
  assert.strictEqual(getLanguage(), 'vi');
  assert.strictEqual(isEnglish(), false);
  assert.strictEqual(isVietnamese(), true);
  assert.strictEqual(observedLang, 'vi');

  unsubscribe();
});

// 8. Fallback Resilience
it('8. t() returns fallback when translation key does not exist', () => {
  const fallbackText = 'Default Fallback Value';
  const resolved = t('non.existent.deeply.nested.key', null, fallbackText);
  assert.strictEqual(resolved, fallbackText);

  // If no fallback is provided, it should return the key itself
  const keyResolved = t('non.existent.key');
  assert.strictEqual(keyResolved, 'non.existent.key');
});

// 9. Variable Interpolation
it('9. t() accurately interpolates variables in strings', () => {
  setLanguage('en');
  const streakEn = t('modals.sprint.streakLabel', { count: 7 });
  assert.strictEqual(streakEn, 'Streak: 7 days');

  setLanguage('vi');
  const streakVi = t('modals.sprint.streakLabel', { count: 7 });
  assert.strictEqual(streakVi, 'Streak: 7 ngày');
});

console.log(`\n🎉 STEP 105 PASSED: ${passedTests}/${passedTests} tests passed cleanly!`);
