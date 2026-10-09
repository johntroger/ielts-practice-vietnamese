/**
 * tests/test_step104_i18n_modals_and_tools_localization.js
 * 
 * Step 104: Phase 4 Localization of All Modals & Study Tools
 * Verifies:
 * 1. Dictionary parity for modals namespace in vi.js and en.js across all sub-modals:
 *    - vocabGrammar, microDrills, library, handbook, diagnostic, sprint, analytics, weeklyReport, history
 * 2. Key resolution for all modal keys in both English and Vietnamese environments.
 * 3. VocabGrammarSpellingModal.jsx imports useTranslation and uses localized titles and tabs.
 * 4. MicroDrillsModal.jsx imports useTranslation and uses localized titles and rooms.
 * 5. TaskLibraryModal.jsx imports useTranslation and uses localized titles and tabs.
 * 6. TheoryHandbookModal.jsx imports useTranslation and uses localized tabs and dynamic headers.
 * 7. DiagnosticPlacementModal.jsx imports useTranslation and uses localized headers.
 * 8. AdaptiveSprintModal.jsx imports useTranslation and uses localized headers and streak text.
 * 9. GrowthAnalyticsModal.jsx imports useTranslation and uses localized headers.
 * 10. WeeklyReportModal.jsx imports useTranslation and uses localized headers.
 * 11. HistoryModal.jsx imports useTranslation and uses localized headers and action buttons.
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
import { getLocalizedVocabMeaning } from '../src/utils/vocabLocalization.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- RUNNING STEP 104: BILINGUAL MODALS & STUDY TOOLS LOCALIZATION ---');

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

// 1. Dictionary Parity for Modals
it('1. Modals sub-objects maintain exact parity between vi.js and en.js', () => {
  assert.ok(vi.modals, 'vi missing modals namespace');
  assert.ok(en.modals, 'en missing modals namespace');

  const subModals = [
    'vocabGrammar',
    'microDrills',
    'library',
    'handbook',
    'diagnostic',
    'sprint',
    'analytics',
    'weeklyReport',
    'history'
  ];

  subModals.forEach(modalKey => {
    assert.ok(vi.modals[modalKey], `vi.modals missing '${modalKey}'`);
    assert.ok(en.modals[modalKey], `en.modals missing '${modalKey}'`);

    const viKeys = Object.keys(vi.modals[modalKey]);
    const enKeys = Object.keys(en.modals[modalKey]);

    assert.strictEqual(
      viKeys.length,
      enKeys.length,
      `Key count mismatch in modals.${modalKey}: VI=${viKeys.length}, EN=${enKeys.length}`
    );

    viKeys.forEach(k => {
      assert.ok(
        enKeys.includes(k),
        `modals.${modalKey}.${k} present in vi but missing in en`
      );
    });
  });
});

// 2. Translation key resolution
it('2. t() resolves modal keys reactively in vi and en', () => {
  setLanguage('vi');
  assert.strictEqual(t('modals.vocabGrammar.title'), 'Luyện Từ Vựng, Ngữ Pháp & Chính Tả');
  assert.strictEqual(t('modals.microDrills.title'), 'Phòng Luyện Bổ Trợ (Micro-Drills)');
  assert.strictEqual(t('modals.library.title'), 'Kho Đề Thi IELTS Academic (Official Bank)');
  assert.strictEqual(t('modals.handbook.title'), 'Cẩm Nang & Chiến Thuật Khảo Thí Cambridge');
  assert.strictEqual(t('modals.diagnostic.title'), 'Kiểm Tra Định Vị 15 Phút & Lộ Trình 30 Ngày');
  assert.strictEqual(t('modals.sprint.title'), 'Huấn Luyện Viên Nước Rút 30 Phút (Adaptive Sprint Coach)');
  assert.strictEqual(t('modals.analytics.title'), 'Dự Báo Tăng Trưởng & Ngày Đạt Target Band');
  assert.strictEqual(t('modals.weeklyReport.title'), 'Báo Cáo Tiến Trình Tuần (Weekly Diagnostic Report)');
  assert.strictEqual(t('modals.history.title'), 'Lịch Sử Luyện Thi & Nhật Ký Bài Làm');

  setLanguage('en');
  assert.strictEqual(t('modals.vocabGrammar.title'), 'Vocabulary, Grammar & Spelling Studio');
  assert.strictEqual(t('modals.microDrills.title'), 'Targeted Reflex Studio (Micro-Drills)');
  assert.strictEqual(t('modals.library.title'), 'IELTS Academic Official Test Bank');
  assert.strictEqual(t('modals.handbook.title'), 'Cambridge Theory & Strategy Handbook');
  assert.strictEqual(t('modals.diagnostic.title'), '15-Min Diagnostic Placement & 30-Day Roadmap');
  assert.strictEqual(t('modals.sprint.title'), 'Adaptive 30-Min Sprint Coach');
  assert.strictEqual(t('modals.analytics.title'), 'Growth Analytics & Target Band Timeline');
  assert.strictEqual(t('modals.weeklyReport.title'), 'Weekly Diagnostic Progress Report');
  assert.strictEqual(t('modals.history.title'), 'Submission History & Study Log');

  // Reset to default vi
  setLanguage('vi');
});

// 3. VocabGrammarSpellingModal.jsx
it('3. VocabGrammarSpellingModal.jsx integrates useTranslation and localized strings', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/VocabGrammarSpellingModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'VocabGrammarSpellingModal missing useTranslation');
  assert.ok(content.includes("modals.vocabGrammar.title"));
  assert.ok(content.includes("modals.vocabGrammar.subtitle"));
  assert.ok(content.includes("modals.vocabGrammar.tabSpelling"));
  assert.ok(content.includes("modals.vocabGrammar.tabGrammar"));
});

// 4. MicroDrillsModal.jsx
it('4. MicroDrillsModal.jsx integrates useTranslation and localized room switches', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/MicroDrillsModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'MicroDrillsModal missing useTranslation');
  assert.ok(content.includes("modals.microDrills.title"));
  assert.ok(content.includes("modals.microDrills.roomGeneral"));
  assert.ok(content.includes("modals.microDrills.roomWriting"));
});

// 5. TaskLibraryModal.jsx
it('5. TaskLibraryModal.jsx integrates useTranslation and localized tabs', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/TaskLibraryModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'TaskLibraryModal missing useTranslation');
  assert.ok(content.includes("modals.library.title"));
  assert.ok(content.includes("modals.library.tabAll"));
  assert.ok(content.includes("modals.library.tabMastered"));
});

// 6. TheoryHandbookModal.jsx
it('6. TheoryHandbookModal.jsx integrates useTranslation and localized categories & headers', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/TheoryHandbookModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'TheoryHandbookModal missing useTranslation');
  assert.ok(content.includes('getHeaderMeta'), 'TheoryHandbookModal missing getHeaderMeta');
  assert.ok(content.includes("isEn ? 'Grammar & Vocab' : 'Ngữ Pháp & Từ Vựng'"));
});

// 7. DiagnosticPlacementModal.jsx
it('7. DiagnosticPlacementModal.jsx integrates useTranslation and localized headers', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/DiagnosticPlacementModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'DiagnosticPlacementModal missing useTranslation');
  assert.ok(content.includes("t('modals.diagnostic.title')"));
  assert.ok(content.includes("t('modals.diagnostic.subtitle')"));
});

// 8. AdaptiveSprintModal.jsx
it('8. AdaptiveSprintModal.jsx integrates useTranslation and localized streak display', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/AdaptiveSprintModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'AdaptiveSprintModal missing useTranslation');
  assert.ok(content.includes("t('modals.sprint.title')"));
  assert.ok(content.includes("isEn ? 'Daily Sprint' : 'Sprint Hàng Ngày'"));
});

// 9. GrowthAnalyticsModal.jsx
it('9. GrowthAnalyticsModal.jsx integrates useTranslation and localized headers', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/GrowthAnalyticsModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'GrowthAnalyticsModal missing useTranslation');
  assert.ok(content.includes("modals.analytics.title"));
  assert.ok(content.includes("modals.analytics.subtitle"));
});

// 10. WeeklyReportModal.jsx
it('10. WeeklyReportModal.jsx integrates useTranslation and localized headers', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/WeeklyReportModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'WeeklyReportModal missing useTranslation');
  assert.ok(content.includes("modals.weeklyReport.title"));
  assert.ok(content.includes("modals.weeklyReport.subtitle"));
});

// 11. HistoryModal.jsx
it('11. HistoryModal.jsx integrates useTranslation and localized action buttons', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/HistoryModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'HistoryModal missing useTranslation');
  assert.ok(content.includes("modals.history.title"));
  assert.ok(content.includes("Clear Writing"));
});

// 12. VocabNotebookModal.jsx & vocabLocalization.js
it('12. VocabNotebookModal.jsx & vocabLocalization.js are fully localized', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/VocabNotebookModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'VocabNotebookModal missing useTranslation');
  assert.ok(content.includes('getLocalizedVocabMeaning'), 'VocabNotebookModal missing getLocalizedVocabMeaning');
  assert.ok(content.includes("isEn ? 'COLLOCATION / ACADEMIC TERM' : 'COLLOCATION / THUẬT NGỮ'"));
  assert.ok(content.includes("isEn ? 'Click to flip' : 'Nhấp để lật'"));
  assert.ok(content.includes("isEn ? 'Rate your recall ability:' : 'Đánh giá mức độ ghi nhớ của bạn:'"));
  assert.ok(content.includes("isEn ? 'Again' : 'Quên'"));
  assert.ok(content.includes("isEn ? 'Hard' : 'Khó'"));
  assert.ok(content.includes("isEn ? 'Good' : 'Tốt'"));
  assert.ok(content.includes("isEn ? 'Easy' : 'Rất Dễ'"));

  // Check vocabLocalization helper
  const item = { phrase: 'catalyze novel industries', meaningVi: 'thúc đẩy các ngành mới' };
  assert.strictEqual(getLocalizedVocabMeaning(item, false), 'thúc đẩy các ngành mới');
  assert.strictEqual(getLocalizedVocabMeaning(item, true), 'spur / stimulate emerging industries into existence');
});

console.log(`\n🎉 STEP 104 PASSED: ${passedTests}/${passedTests} tests passed!`);
