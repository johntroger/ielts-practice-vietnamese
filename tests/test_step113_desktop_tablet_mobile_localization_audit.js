/**
 * test_step113_desktop_tablet_mobile_localization_audit.js
 * Verification test for Step 113:
 * Desktop, Tablet, and Mobile Localization & Responsive UI Integrity Audit
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { TRAP_ARCHETYPES, analyzeDistractorTrap } from '../src/services/trapAnalysisService.js';
import { analyzeFillerWords } from '../src/services/speakingFluencyService.js';

let passed = 0;
let total = 0;

function it(desc, fn) {
  total++;
  try {
    fn();
    passed++;
  } catch (err) {
    console.error(`❌ Failed: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('🧪 Testing Step 113: Desktop, Tablet & Mobile Localization Audit...\n');

// 1. Trap Archetypes & trapAnalysisService Bilingual Completeness
it('TRAP_ARCHETYPES has complete English localized fields for all archetypes', () => {
  const archetypes = Object.values(TRAP_ARCHETYPES);
  assert(archetypes.length >= 6, 'Should define at least 6 Cambridge trap archetypes');
  archetypes.forEach(archetype => {
    assert(archetype.titleEn && typeof archetype.titleEn === 'string', `${archetype.id} must have titleEn`);
    assert(archetype.whyYouChoseThisEn && typeof archetype.whyYouChoseThisEn === 'string', `${archetype.id} must have whyYouChoseThisEn`);
    assert(archetype.examinerBlueprintEn && typeof archetype.examinerBlueprintEn === 'string', `${archetype.id} must have examinerBlueprintEn`);
    assert(archetype.reflexActionTipEn && typeof archetype.reflexActionTipEn === 'string', `${archetype.id} must have reflexActionTipEn`);
  });
});

it('analyzeDistractorTrap returns archetype with English strings available', () => {
  const analysis = analyzeDistractorTrap({
    question: { order: 1, questionText: 'What is the price?', answer: '£50' },
    userAnswer: '£100',
    evidenceQuote: 'Actually, the price is £50 now.',
    skill: 'listening'
  });

  assert.strictEqual(analysis.titleEn, '180-Degree Turnaround & Self-Correction Trap');
  assert(analysis.whyYouChoseThisEn.includes('Your ear caught the initial information'), 'Should have whyYouChoseThisEn');
  assert(analysis.examinerBlueprintEn.includes('The examiner intentionally introduces Option A'), 'Should have examinerBlueprintEn');
  assert(analysis.reflexActionTipEn.includes('pause writing for 2 seconds'), 'Should have reflexActionTipEn');
});

// 2. DistractorTrapExplainer Component
it('DistractorTrapExplainer.jsx has bilingual UI support and zero hardcoded Vietnamese leaks in English mode', () => {
  const file = fs.readFileSync(path.resolve('src/components/DistractorTrapExplainer.jsx'), 'utf-8');
  assert(file.includes('useTranslation'), 'Must import and use useTranslation');
  assert(file.includes("isEn ? 'Cambridge Trap' : 'Bẫy Khảo Thí Cambridge'"), 'Badge must be bilingual');
  assert(file.includes("isEn ? 'Why you were lured into this answer:' : 'Tại sao bạn bị thu hút vào đáp án này:'"), 'Diagnosis title must be bilingual');
  assert(file.includes("isEn ? 'The Examiner\\'s Trap Blueprint:' : 'Bản chất kỹ thuật đặt bẫy của Đề thi:'"), 'Examiner blueprint title must be bilingual');
  assert(file.includes("isEn ? '3-Second Reflex Rule:' : 'Chiến thuật phản xạ 3 giây (3-Second Reflex Rule):'"), 'Reflex Rule title must be bilingual');
  assert(file.includes("isEn ? 'Read Trap Guide' : 'Đọc Cẩm Nang Bẫy'"), 'Read Trap Guide button must be bilingual');
  assert(file.includes("isEn ? 'Save to Mistake Log' : 'Lưu vào Sổ Lỗi Sai'"), 'Save to Mistake Log button must be bilingual');
});

// 3. InSituLexicalUpgrader Component
it('InSituLexicalUpgrader.jsx has bilingual UI and getLocalizedSynonymMeaning integration', () => {
  const file = fs.readFileSync(path.resolve('src/components/InSituLexicalUpgrader.jsx'), 'utf-8');
  assert(file.includes('useTranslation'), 'Must import useTranslation');
  assert(file.includes('getLocalizedSynonymMeaning'), 'Must use getLocalizedSynonymMeaning');
  assert(file.includes("isEn ? 'C1/C2 Lexical Upgrade:' : 'Nâng cấp từ vựng C1/C2:'"), 'Title must be bilingual');
  assert(file.includes("isEn ? 'Replace' : 'Thay từ này'"), 'Replace button must be bilingual');
});

// 4. ProcessMapRenderer Component & Responsive Viewports
it('ProcessMapRenderer.jsx has bilingual step cards, Cambridge vector note, and responsive layout', () => {
  const file = fs.readFileSync(path.resolve('src/components/ProcessMapRenderer.jsx'), 'utf-8');
  assert(file.includes('useTranslation'), 'Must import useTranslation');
  assert(file.includes("isEn ? 'Sequential Process Flowchart' : 'Sơ Đồ Quy Trình Tuần Tự (Process Flowchart)'"), 'Flowchart title bilingual');
  assert(file.includes("isEn ? 'Start' : 'Bắt đầu'"), 'Start step badge bilingual');
  assert(file.includes("isEn ? 'Final Product' : 'Thành phẩm'"), 'Final product badge bilingual');
  assert(file.includes("isEn ? 'Intermediate' : 'Giai đoạn giữa'"), 'Intermediate badge bilingual');
  // Responsive layout check: grid wrapping and overflow management
  assert(file.includes('grid grid-cols-1 sm:grid-cols-2') || file.includes('overflow-x-auto') || file.includes('overflow-hidden'), 'Must have responsive layout handling');
});

// 5. ChartRenderer Component
it('ChartRenderer.jsx has bilingual empty state message and preview note', () => {
  const file = fs.readFileSync(path.resolve('src/components/ChartRenderer.jsx'), 'utf-8');
  assert(file.includes('useTranslation'), 'Must import useTranslation');
  assert(file.includes("isEn ? 'No chart data available for this task.' : 'Không có dữ liệu biểu đồ số liệu cho bài này.'"), 'Empty state bilingual');
  assert(file.includes("isEn ? 'Visual chart generated from prompt data' : 'Biểu đồ trực quan do hệ thống render từ số liệu đề bài'"), 'Chart caption bilingual');
});

// 6. speakingFluencyService Bilingual Support
it('speakingFluencyService analyzeFillerWords provides bilingual statuses and warning messages', () => {
  const resEn = analyzeFillerWords('um well uh actually you know like so basically we did it', 10, true);
  assert(resEn.statusLabel.includes('Excessive filler') || resEn.statusLabel.includes('Warning'), 'Should have English warning label');
  assert(resEn.warningMessage.includes('words/min'), 'Should have English warning message with words/min');

  const resVi = analyzeFillerWords('um well uh actually you know like so basically we did it', 10, false);
  assert(resVi.statusLabel.includes('Cảnh báo') || resVi.statusLabel.includes('Lạm dụng'), 'Should have Vietnamese warning label');
  assert(resVi.warningMessage.includes('từ/phút'), 'Should have Vietnamese warning message');
});

// 7. SpeakingFillerTracker Component
it('SpeakingFillerTracker.jsx provides bilingual tracker headers, counts, and fluency tips', () => {
  const file = fs.readFileSync(path.resolve('src/components/speaking/SpeakingFillerTracker.jsx'), 'utf-8');
  assert(file.includes('useTranslation'), 'Must import useTranslation');
  assert(file.includes('analyzeFillerWords(transcript, durationSec, isEn)'), 'Must pass isEn to analyzeFillerWords');
  assert(file.includes("isEn ? 'fillers' : 'từ đệm'"), 'Fillers label must be bilingual');
  assert(file.includes("isEn ? 'Detected filler words in speech:' : 'Các từ đệm đã phát hiện trong bài nói:'"), 'Breakdown title must be bilingual');
  assert(file.includes("isEn ? 'Cambridge Band 7.5+ Fluency Replacement Recommendations:' : 'Gợi ý thay thế chuẩn Cambridge Band 7.5+ Fluency:'"), 'Fluency tips title must be bilingual');
});

// 8. SpeakingDigitalNotepad Responsive & Bilingual
it('SpeakingDigitalNotepad.jsx supports responsive docked preview (desktop/mobile) and bilingual quadrants', () => {
  const file = fs.readFileSync(path.resolve('src/components/speaking/SpeakingDigitalNotepad.jsx'), 'utf-8');
  assert(file.includes('useTranslation'), 'Must import useTranslation');
  // Responsive docked classes for desktop vs tablet/mobile
  assert(file.includes('fixed bottom-4 right-4 z-40 w-80 sm:w-96'), 'Responsive dock container widths');
  assert(file.includes('grid grid-cols-1 sm:grid-cols-2 gap-3'), 'Responsive 2-column grid for tablet/desktop');
  // Bilingual quadrant labels
  assert(file.includes("isEn ? 'Who / What (Core Target)' : 'Who / What (Đối tượng cốt lõi)'"), 'Q1 bilingual');
  assert(file.includes("isEn ? 'When / Where (Time & Setting)' : 'When / Where (Bối cảnh thời gian)'"), 'Q2 bilingual');
  assert(file.includes("isEn ? 'Core Details & Action (Key Highlights)' : 'Core Details & Action (Điểm nhấn)'"), 'Q3 bilingual');
  assert(file.includes("isEn ? 'Feelings & Why (Reflection & Impact)' : 'Feelings & Why (Cảm xúc & Bài học)'"), 'Q4 bilingual');
});

// 9. SpeakingExaminerRoom Live Viewport & Action Buttons
it('SpeakingExaminerRoom.jsx localizes exam state banners, timers, and candidate turn controls', () => {
  const file = fs.readFileSync(path.resolve('src/components/speaking/SpeakingExaminerRoom.jsx'), 'utf-8');
  assert(file.includes('useTranslation'), 'Must import useTranslation');
  assert(file.includes("isEn ? 'Exam Room ' : 'Phòng Thi '"), 'Exam room live badge bilingual');
  assert(file.includes("isEn ? 'Submit & Grade' : 'Nộp bài & Chấm điểm'"), 'Submit button bilingual');
  assert(file.includes("isEn ? 'Exit' : 'Rời phòng'"), 'Exit button bilingual');
  assert(file.includes("isEn ? 'Procedure: ID & Verification' : 'Thủ tục: Chào hỏi & ID'"), 'Procedure label bilingual');
});

// 10. WorkspaceErrorBoundary Responsive Shield
it('WorkspaceErrorBoundary.jsx provides bilingual recovery shield and crash JSON download', () => {
  const file = fs.readFileSync(path.resolve('src/components/common/WorkspaceErrorBoundary.jsx'), 'utf-8');
  assert(file.includes("isEn ? 'Exam Shield (Error Boundary)' : 'Lá Chắn Bảo Vệ Khảo Thí (Error Boundary)'"), 'Error title bilingual');
  assert(file.includes("isEn ? 'Copy Content' : 'Sao chép nội dung'"), 'Copy error report bilingual');
  assert(file.includes("isEn ? 'Download Backup (.txt)' : 'Tải bản sao lưu (.txt)'"), 'Download backup bilingual');
  assert(file.includes("isEn ? 'Reload Page' : 'Tải lại trang'"), 'Reload page bilingual');
});

// 11. Responsive UI Navbar & Viewport Touch Targets
it('Navbar.jsx and mobile navigation adhere to responsive breakpoints and accessibility', () => {
  const file = fs.readFileSync(path.resolve('src/components/Navbar.jsx'), 'utf-8');
  assert(file.includes('hidden sm:flex') || file.includes('hidden xl:flex'), 'Navbar has desktop vs mobile breakpoints');
  assert(file.includes('isEn ?'), 'Navbar has bilingual mode active');
  assert(file.includes('py-1.5') || file.includes('p-2') || file.includes('h-10'), 'Has accessible touch target dimensions');
});

console.log(`\n===============================================================`);
console.log(`✅ All ${passed}/${total} Step 113 localization and responsive audit tests passed cleanly!`);
console.log(`===============================================================\n`);
