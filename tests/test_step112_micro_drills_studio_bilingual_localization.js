/**
 * test_step112_micro_drills_studio_bilingual_localization.js
 * Verification test for Step 112: Targeted Reflex Studio (Micro-Drills) Bilingual Localization
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { getLocalizedDrillTitle, getLocalizedDrillCategory } from '../src/utils/drillLocalization.js';
import { INITIAL_MICRO_DRILLS } from '../src/data/microDrills.js';
import { COMMUNITY_DEFAULT_DRILLS } from '../src/data/communityMicroDrills.js';

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

console.log('🧪 Testing Step 112: Micro-Drills Studio Bilingual Localization...\n');

// 1. drillLocalization: Title translation
it('Translates "Giới từ miêu tả xu hướng và số liệu" correctly in English and Vietnamese modes', () => {
  const drill = { title: 'Giới từ miêu tả xu hướng và số liệu' };
  assert.strictEqual(getLocalizedDrillTitle(drill, false), 'Giới từ miêu tả xu hướng và số liệu');
  assert.strictEqual(getLocalizedDrillTitle(drill, true), 'Prepositions for Describing Trends & Data');
});

it('Handles dynamic AI / Community drill titles with prefix and patterns', () => {
  const commDrill = { title: '✨ [AI Cộng Đồng] Giới từ số liệu Task 1: Xu hướng đô thị hóa' };
  assert.strictEqual(getLocalizedDrillTitle(commDrill, false), '✨ [AI Cộng Đồng] Giới từ số liệu Task 1: Xu hướng đô thị hóa');
  assert.strictEqual(getLocalizedDrillTitle(commDrill, true), '✨ [AI Community] Task 1 Data Prepositions: Urbanization Trends');

  const patternDrill = { title: 'Phân biệt bẫy Not Given vs False: Thụ phấn nhân tạo' };
  assert.strictEqual(getLocalizedDrillTitle(patternDrill, true), 'Not Given vs False Trap: Artificial Pollination');

  const regexDrill = { title: 'Giới từ miêu tả xu hướng biến động dân số' };
  assert.strictEqual(getLocalizedDrillTitle(regexDrill, true), 'Prepositions for Describing Trends & Data');
});

it('Prioritizes explicit titleEn property when present', () => {
  const explicitDrill = { title: 'Tiêu đề tiếng Việt', titleEn: 'Explicit English Title' };
  assert.strictEqual(getLocalizedDrillTitle(explicitDrill, true), 'Explicit English Title');
  assert.strictEqual(getLocalizedDrillTitle(explicitDrill, false), 'Tiêu đề tiếng Việt');
});

// 2. WritingDrillRoom.jsx verification
it('WritingDrillRoom.jsx imports useTranslation and getLocalizedDrillTitle', () => {
  const content = fs.readFileSync(path.resolve('src/components/drills/WritingDrillRoom.jsx'), 'utf-8');
  assert(content.includes('useTranslation'), 'WritingDrillRoom must import and use useTranslation');
  assert(content.includes('getLocalizedDrillTitle'), 'WritingDrillRoom must use getLocalizedDrillTitle');
});

it('WritingDrillRoom.jsx localizes gap fill dropdown placeholder [Select word]', () => {
  const content = fs.readFileSync(path.resolve('src/components/drills/WritingDrillRoom.jsx'), 'utf-8');
  assert(content.includes("isEn ? '[Select word]' : '[Chọn từ]'"), 'Dropdown placeholder must be bilingual');
});

it('WritingDrillRoom.jsx localizes action buttons (Reset Exercise & Check Answers)', () => {
  const content = fs.readFileSync(path.resolve('src/components/drills/WritingDrillRoom.jsx'), 'utf-8');
  assert(content.includes("isEn ? 'Reset Exercise' : 'Làm lại bài này'"), 'Reset button must be bilingual');
  assert(content.includes("isEn ? 'Check Answers' : 'Kiểm Tra Đáp Án'"), 'Check Answers button must be bilingual');
});

// 3. GeneralDrillRoom.jsx and ReadingDrillRoom.jsx verification
it('GeneralDrillRoom.jsx and ReadingDrillRoom.jsx are fully localized', () => {
  const genContent = fs.readFileSync(path.resolve('src/components/drills/GeneralDrillRoom.jsx'), 'utf-8');
  assert(genContent.includes('useTranslation'), 'GeneralDrillRoom must use useTranslation');
  assert(genContent.includes('getLocalizedDrillTitle'), 'GeneralDrillRoom must use getLocalizedDrillTitle');
  assert(genContent.includes("isEn ? 'Reset Exercise' : 'Làm lại bài này'"), 'GeneralDrillRoom reset button must be bilingual');

  const readingContent = fs.readFileSync(path.resolve('src/components/drills/ReadingDrillRoom.jsx'), 'utf-8');
  assert(readingContent.includes('useTranslation'), 'ReadingDrillRoom must use useTranslation');
  assert(readingContent.includes('getLocalizedDrillTitle'), 'ReadingDrillRoom must use getLocalizedDrillTitle');
  assert(readingContent.includes("isEn ? 'Check Answer & Trap Analysis' : 'Kiểm Tra Đáp Án & Mổ Xẻ Bẫy'"), 'ReadingDrillRoom check button must be bilingual');
});

// 4. MicroDrillsModal.jsx dropdown localization
it('MicroDrillsModal.jsx uses getLocalizedDrillTitle in the jump-to dropdown options', () => {
  const modalContent = fs.readFileSync(path.resolve('src/components/MicroDrillsModal.jsx'), 'utf-8');
  assert(modalContent.includes('getLocalizedDrillTitle(d, isEn)'), 'MicroDrillsModal dropdown options must be localized');
  assert(modalContent.includes('isEn\n      });') || modalContent.includes('isEn\r\n      });') || modalContent.includes('isEn\n    });'), 'MicroDrillsModal must pass isEn to generateMicroDrill');
});

// 5. Data bank titleEn completeness
it('INITIAL_MICRO_DRILLS and COMMUNITY_DEFAULT_DRILLS contain titleEn', () => {
  assert(INITIAL_MICRO_DRILLS.length > 0, 'INITIAL_MICRO_DRILLS must not be empty');
  assert(INITIAL_MICRO_DRILLS.every(d => Boolean(d.titleEn)), 'Every initial drill must have a titleEn');

  assert(COMMUNITY_DEFAULT_DRILLS.length > 0, 'COMMUNITY_DEFAULT_DRILLS must not be empty');
  assert(COMMUNITY_DEFAULT_DRILLS.every(d => Boolean(d.titleEn)), 'Every community default drill must have a titleEn');
});

// 6. i18n locales completeness
it('Locale files en.js and vi.js have matching microDrills action keys', () => {
  const en = fs.readFileSync(path.resolve('src/i18n/locales/en.js'), 'utf-8');
  const vi = fs.readFileSync(path.resolve('src/i18n/locales/vi.js'), 'utf-8');

  assert(en.includes("resetExercise: 'Reset Exercise'"), 'en.js must have resetExercise');
  assert(vi.includes("resetExercise: 'Làm lại bài này'"), 'vi.js must have resetExercise');
  assert(en.includes("checkAnswers: 'Check Answers'"), 'en.js must have checkAnswers');
  assert(vi.includes("checkAnswers: 'Kiểm Tra Đáp Án'"), 'vi.js must have checkAnswers');
  assert(en.includes("selectWord: '[Select word]'"), 'en.js must have selectWord');
  assert(vi.includes("selectWord: '[Chọn từ]'"), 'vi.js must have selectWord');
});

console.log(`\n🎉 Step 112 Verification: All ${passed}/${total} assertions passed!`);
