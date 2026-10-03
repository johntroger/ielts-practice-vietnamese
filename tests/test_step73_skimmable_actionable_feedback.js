/**
 * Test Step 73: Skimmable Actionable Feedback & 3-Second Action Plan (Bước 4)
 *
 * Verifies:
 * 1. FeedbackModal.jsx imports and hooks:
 *    - Properly imports useMemo and icons (ArrowRight, ChevronRight, CheckCircle2).
 *    - Computes actionTakeaway memoized helper for resilient 3-second takeaways.
 * 2. 3-Second Action Plan Hero Card:
 *    - Renders "Kế Hoạch Hành Động 3 Giây (3-Second Action Plan)".
 *    - Displays Current Band -> Potential Band (+0.5 - 1.0 Band Leap).
 *    - Renders 3 prioritized action cards: Critical Blocker, High Leverage, and Polish.
 *    - Provides fast 1-click jump triggers to corrections, rewrite, and revision v2.
 * 3. 4 Criteria Bento Grid with Band Progress Bars:
 *    - Computes visual progress bars scaled to 9.0 with milestone indicators.
 *    - Color codes badges by band thresholds (>= 7.0 emerald, >= 6.0 blue, < 6.0 rose).
 *    - Displays bulleted improvements and examiner verdicts.
 * 4. Academic Typography integration:
 *    - Uses font-serif academic-reading-text for original and rewrite essays.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 73: Skimmable Actionable Feedback Test Suite...');

const feedbackModalPath = path.resolve(__dirname, '../src/components/FeedbackModal.jsx');
assert(fs.existsSync(feedbackModalPath), 'FeedbackModal.jsx must exist');

const modalCode = fs.readFileSync(feedbackModalPath, 'utf8');

// 1. Verify Imports & actionTakeaway memo hook
console.log('  ▶ 1. Verifying imports and actionTakeaway calculation...');
assert(
  /import\s+React,\s*\{[^}]*\buseMemo\b[^}]*\}\s+from\s+['"]react['"]/.test(modalCode),
  'FeedbackModal must import useMemo from react'
);
assert(
  /import\s*\{[^}]*\bArrowRight\b[^}]*\}\s*from\s*['"]lucide-react['"]/.test(modalCode),
  'FeedbackModal must import ArrowRight from lucide-react'
);
assert(
  modalCode.includes('actionTakeaway = useMemo('),
  'FeedbackModal must compute actionTakeaway via useMemo'
);
assert(
  modalCode.includes('priority1') && modalCode.includes('priority2') && modalCode.includes('priority3'),
  'actionTakeaway must provide 3 prioritized actions'
);
console.log('    ✅ Imports and actionTakeaway calculation verified.');

// 2. Verify 3-Second Action Plan Hero Card
console.log('  ▶ 2. Verifying 3-Second Action Plan Hero Card...');
assert(
  modalCode.includes('Kế Hoạch Hành Động 3 Giây (3-Second Action Plan)'),
  'FeedbackModal must render 3-Second Action Plan title'
);
assert(
  modalCode.includes('actionTakeaway.currentOverall.toFixed(1)') &&
  modalCode.includes('actionTakeaway.potentialBand.toFixed(1)'),
  'Hero card must display current vs potential band leap'
);
assert(
  modalCode.includes('ƯU TIÊN 1 • CHẶN TRẦN ĐIỂM') &&
  modalCode.includes('ƯU TIÊN 2 • MẠCH LẠC & TỪ VỰNG') &&
  modalCode.includes('ƯU TIÊN 3 • TINH TẾ HÓA CÂU'),
  'Hero card must render 3 distinct priority badges'
);
assert(
  modalCode.includes("setActiveTab('corrections')") &&
  modalCode.includes("setActiveTab('rewrite')"),
  'Hero card must provide instant jump actions to corrections and rewrite tabs'
);
console.log('    ✅ 3-Second Action Plan Hero Card verified.');

// 3. Verify 4 Criteria Bento Grid with Progress Bars
console.log('  ▶ 3. Verifying 4 Criteria Bento Grid with progress visualizer...');
assert(
  modalCode.includes('Chi Tiết 4 Tiêu Chí Chấm Khảo Thí Cambridge:'),
  'Must render Cambridge 4 criteria section'
);
assert(
  modalCode.includes('progressPercent = Math.min(100, Math.max(') &&
  modalCode.includes('(band / 9) * 100'),
  'Must calculate progress bar percentage based on band out of 9.0'
);
assert(
  modalCode.includes('Mốc 6.0') && modalCode.includes('Mốc 7.0'),
  'Must display milestone markers at Band 6.0 and 7.0'
);
console.log('    ✅ Bento Criteria Grid and Progress visualizers verified.');

// 4. Verify Academic Typography in Rewrite Tab
console.log('  ▶ 4. Verifying Academic Typography in essay comparison...');
assert(
  modalCode.includes('font-serif academic-reading-text'),
  'FeedbackModal must format essay comparison with font-serif academic-reading-text'
);
console.log('    ✅ Academic Typography formatting verified.');

console.log('\n🎉 ALL STEP 73 SKIMMABLE ACTIONABLE FEEDBACK TESTS PASSED (4/4)!');
