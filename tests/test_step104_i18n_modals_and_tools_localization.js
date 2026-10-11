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
import { 
  getLocalizedVocabMeaning,
  getLocalizedGrammarItem,
  getLocalizedGrammarTitle,
  getLocalizedSpellingTrap
} from '../src/utils/vocabLocalization.js';
import { 
  FEATURE_REGISTRY, 
  getLocalizedFeature, 
  FEATURE_LOCALIZATION_EN 
} from '../src/core/featureRegistry.js';

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
  assert.ok(content.includes("isEn ? 'Share to Community' : 'Chia sẻ cộng đồng'"));
  assert.ok(content.includes("isEn ? '100 Listening Spelling Demons'"));
  assert.ok(content.includes("isEn ? 'Grammar Architecture & Scaffolding'"));
  assert.ok(content.includes("isEn ? 'Vocabulary & Golden Collocations (Active Recall)'"));
  assert.ok(content.includes("isEn ? '50 Cambridge Paraphrase Pairs (Reading)'"));
  assert.ok(content.includes("isEn ? 'Trap Category:' : 'Nhóm bẫy:'"));
  assert.ok(content.includes("isEn ? 'Jump to:' : 'Chuyển nhanh:'"));
  assert.ok(content.includes("isEn ? 'Item:' : 'Câu:'"));
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
  assert.ok(content.includes("isEn ? 'Desired Overall Band Target:' : 'Mục tiêu Overall Band mong muốn:'"));
  assert.ok(content.includes("isEn ? 'Weekly Study Pace:' : 'Thời lượng học mỗi tuần:'"));
  assert.ok(content.includes("isEn ? 'Projected Finish Date' : 'Dự Kiến Cán Đích'"));
  assert.ok(content.includes("isEn ? 'Total Study Hours Needed' : 'Giờ Luyện Tập Cần'"));
  assert.ok(content.includes("isEn ? 'Target Completion Progress' : 'Tiến Trình Cán Đích'"));
  assert.ok(content.includes("isEn ? 'Primary Priority Bottleneck' : 'Điểm Nghẽn Cần Khắc Phục Ưu Tiên Số 1'"));
  assert.ok(content.includes("isEn ? '4-Skill Gap Matrix Breakdown' : 'Phân Tích Chi Tiết 4 Kỹ Năng (Skill Gaps Breakdown)'"));
  assert.ok(content.includes("isEn ? 'Got It & Continue Practice' : 'Đã hiểu & Tiếp tục luyện thi'"));
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
  assert.ok(content.includes("isEn ? 'You have no Reading test history yet. Complete and submit a reading test to record your history!'"));
  assert.ok(content.includes("isEn ? 'You have no Listening test history yet. Complete and submit a listening test to record your history!'"));
  assert.ok(content.includes("isEn ? 'You have no Speaking test history yet. Complete and submit a speaking test to record your history!'"));
  assert.ok(content.includes("isEn ? 'You have no Writing submissions yet. Complete and submit an essay to record your history!'"));
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

// 13. TaskImageUploader.jsx & DocumentIngestModal.jsx localization
it('13. TaskImageUploader.jsx and DocumentIngestModal.jsx are fully localized', () => {
  const uploaderContent = fs.readFileSync(path.join(__dirname, '../src/components/TaskImageUploader.jsx'), 'utf-8');
  assert.ok(uploaderContent.includes('useTranslation'), 'TaskImageUploader missing useTranslation');
  assert.ok(uploaderContent.includes('Upload image file'), 'TaskImageUploader missing Upload image file');
  assert.ok(uploaderContent.includes('Tải tệp ảnh lên'), 'TaskImageUploader missing Tải tệp ảnh lên');
  assert.ok(uploaderContent.includes('or drag and drop here'), 'TaskImageUploader missing or drag and drop here');
  assert.ok(uploaderContent.includes('hoặc kéo thả vào đây'), 'TaskImageUploader missing hoặc kéo thả vào đây');
  const ingestContent = fs.readFileSync(path.join(__dirname, '../src/components/DocumentIngestModal.jsx'), 'utf-8');
  assert.ok(ingestContent.includes('useTranslation'), 'DocumentIngestModal missing useTranslation');
  assert.ok(ingestContent.includes("isEn ? 'Fast AI Document Ingestion (Smart Ingestion)'"));
});

// 14. TheoryHandbookModal.jsx & theoryLocalizationHelper.js full English edition for all 5 skills (113 topics)
it('14. TheoryHandbookModal.jsx and theoryLocalizationHelper.js provide full English articles & stages for all 5 skills', async () => {
  const { 
    getLocalizedArticle, 
    getLocalizedStage, 
    WRITING_THEORY_ARTICLES_EN,
    READING_THEORY_ARTICLES_EN,
    LISTENING_THEORY_ARTICLES_EN,
    SPEAKING_THEORY_ARTICLES_EN,
    GRAMMAR_VOCAB_THEORY_ARTICLES_EN
  } = await import('../src/data/theoryHandbook/theoryLocalizationHelper.js');
  const { WRITING_THEORY_ARTICLES } = await import('../src/data/theoryHandbook/writingTheoryData.js');
  const { READING_THEORY_ARTICLES } = await import('../src/data/theoryHandbook/readingTheoryData.js');
  const { LISTENING_THEORY_ARTICLES } = await import('../src/data/theoryHandbook/listeningTheoryData.js');
  const { SPEAKING_THEORY_ARTICLES } = await import('../src/data/theoryHandbook/speakingTheoryData.js');
  const { GRAMMAR_VOCAB_THEORY_ARTICLES } = await import('../src/data/theoryHandbook/grammarVocabTheoryData.js');

  // Verify all 113 articles have English entries across 5 skills
  assert.strictEqual(Object.keys(WRITING_THEORY_ARTICLES_EN).length, 34);
  assert.strictEqual(Object.keys(READING_THEORY_ARTICLES_EN).length, 25);
  assert.strictEqual(Object.keys(LISTENING_THEORY_ARTICLES_EN).length, 20);
  assert.strictEqual(Object.keys(SPEAKING_THEORY_ARTICLES_EN).length, 20);
  assert.strictEqual(Object.keys(GRAMMAR_VOCAB_THEORY_ARTICLES_EN).length, 14);

  const totalEn = 34 + 25 + 20 + 20 + 14;
  assert.strictEqual(totalEn, 113);

  // 1. Test Writing (foundation-band4-to-5-survival-guide)
  const writingItem = WRITING_THEORY_ARTICLES[0];
  const enWriting = getLocalizedArticle(writingItem, true);
  assert.strictEqual(enWriting.title, 'Writing Survival Guide: Climbing from Band 4.0 to Band 5.0');
  assert.ok(enWriting.content.includes('Three "Life-or-Death" Sentence Structures'));

  // 2. Test Reading (reading-overview-academic-vs-general-conversion)
  const readingItem = READING_THEORY_ARTICLES[0];
  const enReading = getLocalizedArticle(readingItem, true);
  assert.strictEqual(enReading.title, 'IELTS Reading Exam Overview: Academic vs General Training & Official Score Conversion');
  assert.ok(enReading.content.includes('Comprehensive Comparison: IELTS Reading Academic vs General Training'));

  // 3. Test Listening (foundation-listening-band4-to-5-part1-mastery)
  const listeningItem = LISTENING_THEORY_ARTICLES[0];
  const enListening = getLocalizedArticle(listeningItem, true);
  assert.strictEqual(enListening.title, 'Listening Survival: Climbing from Band 4.0 to 5.0 (Part 1 Mastery & Letter/Number Traps)');
  assert.ok(enListening.content.includes('The Four Most Confused Letter Sound Pairs'));

  // 4. Test Speaking (foundation-speaking-band4-to-5-fluency)
  const speakingItem = SPEAKING_THEORY_ARTICLES[0];
  const enSpeaking = getLocalizedArticle(speakingItem, true);
  assert.strictEqual(enSpeaking.title, 'Speaking Survival: Climbing from Band 4.0 to 5.0 (Conquering Speaking Anxiety & Part 1/2 Frameworks)');
  assert.ok(enSpeaking.content.includes('The 2-Sentence "Life-or-Death" Formula for Part 1'));

  // 5. Test Grammar & Vocab (README)
  const gvItem = GRAMMAR_VOCAB_THEORY_ARTICLES[0];
  const enGv = getLocalizedArticle(gvItem, true);
  assert.strictEqual(enGv.title, '📚 IELTS Core Grammar & Academic Vocabulary Guide');
  assert.ok(enGv.content.includes('Why Grammar and Vocabulary Matter So Much'));

  // Stage translation helper
  assert.strictEqual(getLocalizedStage('Chặng 1: Nền Tảng & Cứu Sinh (Band 4.0 – 5.0)', false), 'Chặng 1: Nền Tảng & Cứu Sinh (Band 4.0 – 5.0)');
  assert.strictEqual(getLocalizedStage('Chặng 1: Nền Tảng & Cứu Sinh (Band 4.0 – 5.0)', true), 'Stage 1: Foundation & Survival (Band 4.0 – 5.0)');

  // Modal code imports helper
  const modalContent = fs.readFileSync(path.join(__dirname, '../src/components/TheoryHandbookModal.jsx'), 'utf-8');
  assert.ok(modalContent.includes('getLocalizedArticle'));
  assert.ok(modalContent.includes('theoryLocalizationHelper'));
});

// 15. VocabGrammarSpellingModal grammar & spelling dynamic localization
it('15. VocabGrammarSpellingModal grammar & spelling dynamic localization converts Vietnamese titles and rules', () => {
  assert.strictEqual(getLocalizedGrammarTitle('Mệnh đề quan hệ (Band 6.0 - 6.5)', true), 'Defining & Non-defining Relative Clauses');
  assert.strictEqual(getLocalizedGrammarTitle('Mệnh đề nhượng bộ với While/Although (Band 6.0 - 6.5)', true), 'Complex Contrast & Concession (While/Although)');
  assert.strictEqual(getLocalizedGrammarTitle('Câu bị động học thuật', true), 'Academic Passive Voice');

  // Test custom cloud grammar item
  const customCloudGrammar = {
    id: 'ai-gr-1791691908',
    title: 'Mệnh đề quan hệ (Band 6.0 - 6.5)',
    bandTarget: 'Band 6.0 - 6.5',
    bandLevel: '6.5',
    formula: 'S + [who / which + V] + Động từ số ít',
    rationale: 'Giúp câu văn đạt chuẩn Band 6.5 tiêu chí Grammatical Range & Accuracy.',
    prompt: 'Nối 2 câu sau thành 1 câu có mệnh đề quan hệ:'
  };
  const localizedGr = getLocalizedGrammarItem(customCloudGrammar, true);
  assert.strictEqual(localizedGr.title, 'Defining & Non-defining Relative Clauses');
  assert.ok(localizedGr.formula.includes('Singular'));
  assert.ok(localizedGr.prompt.includes('Join the sentences'));
  assert.ok(localizedGr.rationale.includes('relative clauses'));

  // Test custom spelling trap
  const customSpelling = {
    id: 'ai-sp-1234',
    correct: 'environment',
    rule: 'Nhớ chữ n giữa ro và ment',
    explanation: 'Gốc tiếng Pháp environner + ment'
  };
  const localizedSp = getLocalizedSpellingTrap(customSpelling, true);
  assert.ok(localizedSp.rule.includes('Envi-ron-ment'));
  assert.ok(localizedSp.explanation.includes('environner'));
});

// 16. FeaturesGuideModal.jsx and featureLocalization.js provide complete English translations
it('16. FeaturesGuideModal.jsx and featureLocalization.js localize all 44 features and badges', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/FeaturesGuideModal.jsx'), 'utf-8');
  assert.ok(content.includes('getLocalizedFeature'), 'FeaturesGuideModal missing getLocalizedFeature');
  assert.ok(content.includes('CATEGORY_LABELS_EN'), 'FeaturesGuideModal missing CATEGORY_LABELS_EN');
  
  // Verify all 44 features have localization
  assert.strictEqual(FEATURE_REGISTRY.length, 44);
  FEATURE_REGISTRY.forEach(f => {
    const loc = getLocalizedFeature(f, true);
    assert.ok(loc.title, `Feature ${f.id} missing titleEn`);
    assert.ok(loc.shortDesc, `Feature ${f.id} missing shortDescEn`);
    assert.ok(loc.badge, `Feature ${f.id} missing badgeEn`);
    assert.ok(Array.isArray(loc.highlights) && loc.highlights.length >= 2, `Feature ${f.id} missing highlightsEn`);
    assert.ok(loc.usageGuide, `Feature ${f.id} missing usageGuideEn`);
  });

  const fSprint = FEATURE_REGISTRY.find(f => f.id === 'feat-adaptive-30min-sprint');
  const localizedSprint = getLocalizedFeature(fSprint, true);
  assert.strictEqual(localizedSprint.title, 'Adaptive 30-Min Sprint Coach');
  assert.strictEqual(localizedSprint.badge, 'New Release');
  assert.strictEqual(localizedSprint.quickAction.label, 'Launch 30-Min Sprint');

  const fPacing = FEATURE_REGISTRY.find(f => f.id === 'feat-speaking-pacing-bar');
  const localizedPacing = getLocalizedFeature(fPacing, true);
  assert.strictEqual(localizedPacing.title, 'Speaking Part 2 Pacing Bar (2-Minute Cadence Guide)');
  assert.strictEqual(localizedPacing.badge, 'New Release');
});

// 17. ContactModal.jsx provides complete English translations
it('17. ContactModal.jsx is fully localized into English', () => {
  const content = fs.readFileSync(path.join(__dirname, '../src/components/ContactModal.jsx'), 'utf-8');
  assert.ok(content.includes('useTranslation'), 'ContactModal missing useTranslation');
  assert.ok(content.includes("isEn ? 'Feedback & Contact Support' : 'Liên Hệ & Đóng Góp Ý Kiến'"));
  assert.ok(content.includes("isEn ? 'Send Message Directly on Web' : 'Gửi thư trực tiếp ngay trên Web'"));
  assert.ok(content.includes("isEn ? 'Auto-Forwarded to Gmail' : 'Tự động chuyển tiếp Gmail'"));
  assert.ok(content.includes("isEn ? 'Send to Mr. Tung Tran' : 'Gửi Đến Mr. Tung Tran'"));
  assert.ok(content.includes("isEn ? 'Open Mail App' : 'Mở app Email'"));
  assert.ok(content.includes("isEn ? 'Point of Contact & Support' : 'Người Phụ Trách & Tiếp Nhận'"));
});

// 18. Task 2 Coherence modal and toolbar badge handle empty essay and English localization
it('18. Task 2 Coherence modal and EditorPane toolbar handle empty essay and English localization', () => {
  const coherenceContent = fs.readFileSync(path.join(__dirname, '../src/components/Task2CoherenceModal.jsx'), 'utf-8');
  assert.ok(coherenceContent.includes('useTranslation'), 'Task2CoherenceModal missing useTranslation');
  assert.ok(coherenceContent.includes('metrics?.totalExamples'), 'Task2CoherenceModal must safely guard metrics?.totalExamples');
  assert.ok(coherenceContent.includes('metrics?.totalHedging'), 'Task2CoherenceModal must safely guard metrics?.totalHedging');
  assert.ok(coherenceContent.includes("isEn ? 'No essay drafted yet' : 'Chưa có bài viết'"), 'Task2CoherenceModal missing empty state banner');

  const editorContent = fs.readFileSync(path.join(__dirname, '../src/components/EditorPane.jsx'), 'utf-8');
  assert.ok(editorContent.includes('task2CoherenceCheck?.statusLabelEn'), 'EditorPane must use task2CoherenceCheck?.statusLabelEn');
  assert.ok(editorContent.includes("'No essay yet'"), 'EditorPane must show "No essay yet" in English mode when empty');
});

// 19. SlideOverToolPanel.jsx and academicThesaurus.js localization
it('19. SlideOverToolPanel.jsx and academicThesaurus.js localize synonyms and action buttons into English', () => {
  const panelContent = fs.readFileSync(path.join(__dirname, '../src/components/SlideOverToolPanel.jsx'), 'utf-8');
  assert.ok(panelContent.includes('useTranslation'), 'SlideOverToolPanel missing useTranslation');
  assert.ok(panelContent.includes('getLocalizedSynonymMeaning'), 'SlideOverToolPanel missing getLocalizedSynonymMeaning');
  assert.ok(panelContent.includes("isEn ? 'Insert into essay' : 'Chèn vào bài'"), 'SlideOverToolPanel missing localized Insert into essay button');
  assert.ok(panelContent.includes("isEn ? 'Quick suggestions:' : 'Gợi ý nhanh:'"), 'SlideOverToolPanel missing localized Quick suggestions');

  // Verify getLocalizedSynonymMeaning works for important synonyms
  const vitalMeaningEn = panelContent.includes('getLocalizedSynonymMeaning(item, isEn)');
  assert.ok(vitalMeaningEn, 'SlideOverToolPanel must call getLocalizedSynonymMeaning with isEn');
});

console.log(`\n🎉 STEP 104 PASSED: ${passedTests}/${passedTests} tests passed!`);

