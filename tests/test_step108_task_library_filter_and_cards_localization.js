import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Test Step 108: Task Library Filter & Cards Localization Verification...');

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
  }
}

// 1. Verify SmartContentFilterBar is localized
it('SmartContentFilterBar uses useTranslation and localized labels', () => {
  const filterPath = path.resolve(__dirname, '../src/components/common/SmartContentFilterBar.jsx');
  const code = fs.readFileSync(filterPath, 'utf-8');

  assert.ok(code.includes('useTranslation'), 'SmartContentFilterBar must import useTranslation');
  assert.ok(code.includes("isEn ? 'All' : 'Tất Cả'"), 'quickChips All must be localized');
  assert.ok(code.includes("isEn ? '⭐ Highly Rated (≥4.8★)'"), 'quickChips Highly Rated must be localized');
  assert.ok(code.includes("isEn ? '🔥 Trending'"), 'quickChips Trending must be localized');
  assert.ok(code.includes("isEn ? '🎯 Unattempted'"), 'quickChips Unattempted must be localized');
  assert.ok(code.includes("isEn ? '🎓 Mastered'"), 'quickChips Mastered must be localized');
  assert.ok(code.includes("isEn ? '⭐ Highest Rated'"), 'sortOptions Highest Rated must be localized');
  assert.ok(code.includes("isEn ? 'All categories' : 'Tất cả phân loại'"), 'category select option must be localized');
  assert.ok(code.includes("Showing <strong className=\"text-slate-800 font-bold\">{filteredCount}</strong>"), 'count label must be localized');
});

// 2. Verify TaskLibraryModal cards and action buttons are localized
it('TaskLibraryModal localized + Nạp Đề, card badges and action button', () => {
  const modalPath = path.resolve(__dirname, '../src/components/TaskLibraryModal.jsx');
  const code = fs.readFileSync(modalPath, 'utf-8');

  assert.ok(code.includes("isEn ? '+ Import Prompt' : '+ Nạp Đề'"), '+ Import Prompt / + Nạp Đề button must be localized');
  assert.ok(code.includes("isEn ? 'AI Gen' : 'AI Sinh'"), 'AI Gen badge must be localized');
  assert.ok(code.includes("isEn ? 'Public' : 'Công Khai'"), 'Public badge must be localized');
  assert.ok(code.includes("isEn ? 'Trending' : 'Thịnh Hành'"), 'Trending badge must be localized');
  assert.ok(code.includes("isEn ? 'Top Pick' : 'Top Đề'"), 'Top Pick badge must be localized');
  assert.ok(code.includes("isEn ? 'Attempted' : 'Đã làm'"), 'Attempted badge must be localized');
  assert.ok(code.includes("isEn ? 'Practice' : 'Làm Bài'"), 'Practice button must be localized');
});

// 3. Verify StarRatingWidget is localized
it('StarRatingWidget supports bilingual tooltips and toast', () => {
  const widgetPath = path.resolve(__dirname, '../src/components/common/StarRatingWidget.jsx');
  const code = fs.readFileSync(widgetPath, 'utf-8');

  assert.ok(code.includes('useTranslation'), 'StarRatingWidget must import useTranslation');
  assert.ok(code.includes("isEn ? `Rate ${starVal} stars for this prompt`"), 'StarRatingWidget tooltip must be bilingual');
});

console.log(`\nResults: ${passed}/${total} assertions passed.`);
if (passed !== total) {
  process.exit(1);
}
