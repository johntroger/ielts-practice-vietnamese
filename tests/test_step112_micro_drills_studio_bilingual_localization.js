/**
 * test_step112_micro_drills_studio_bilingual_localization.js
 * Verification test for Step 112: Targeted Reflex Studio (Micro-Drills) Bilingual Localization
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  getLocalizedDrillTitle, 
  getLocalizedDrillCategory,
  getLocalizedDrillContext,
  getLocalizedDrillExplanation,
  getLocalizedHint,
  getLocalizedVocabOption
} from '../src/utils/drillLocalization.js';
import { getLocalizedVocabMeaning } from '../src/utils/vocabLocalization.js';
import { INITIAL_MICRO_DRILLS } from '../src/data/microDrills.js';
import { COMMUNITY_DEFAULT_DRILLS } from '../src/data/communityMicroDrills.js';
import { READING_MICRO_DRILLS } from '../src/data/readingMicroDrills.js';

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
  assert(genContent.includes("import { useTranslation } from '../../i18n'"), 'GeneralDrillRoom must import useTranslation');
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

// 7. Context, Explanation, and Hint runtime translations
it('Translates Task 1 Given Data context from Vietnamese to English', () => {
  const viContext = 'Dữ liệu năm 2015 và 2023 về tỷ lệ các nguồn năng lượng tiêu thụ tại quốc gia Y: Than đá (2015: 50%, 2023: 30%), Năng lượng tái tạo (2015: 20%, 2023: 40%), Khí đốt (2015: 20%, 2023: 20%), Hạt nhân (2015: 10%, 2023: 10%).';
  const enContext = getLocalizedDrillContext(viContext, true);
  
  assert.strictEqual(enContext, 'Data for 2015 and 2023 on the proportion of energy consumed in Country Y: Coal (2015: 50%, 2023: 30%), Renewable energy (2015: 20%, 2023: 40%), Natural gas (2015: 20%, 2023: 20%), Nuclear (2015: 10%, 2023: 10%).');
  // Check no residual Vietnamese words
  assert(!/dữ liệu|quốc gia|than đá|năng lượng|khí đốt|hạt nhân/i.test(enContext), 'Must not contain Vietnamese words');
  
  // In Vietnamese mode, preserves original text
  assert.strictEqual(getLocalizedDrillContext(viContext, false), viContext);
});

it('Translates True/False explanations and hints', () => {
  const expl = 'Đúng (True). Năm 2024 Đức dẫn đầu với 52%.';
  const enExpl = getLocalizedDrillExplanation(expl, true);
  assert(enExpl.startsWith('Correct (TRUE).'), 'Explanation should start with Correct (TRUE).');
  assert(enExpl.includes('Germany led with 52%'), 'Explanation should localize Germany and led with');

  const hint = 'Thay "increase" bằng "grow exponentially"';
  const enHint = getLocalizedHint(hint, true);
  assert.strictEqual(enHint, 'Replace "increase" with "grow exponentially"');
});

it('WritingDrillRoom.jsx wires getLocalizedDrillContext, getLocalizedDrillExplanation, and getLocalizedHint', () => {
  const content = fs.readFileSync(path.resolve('src/components/drills/WritingDrillRoom.jsx'), 'utf-8');
  assert(content.includes('getLocalizedDrillContext'), 'WritingDrillRoom must use getLocalizedDrillContext');
  assert(content.includes('getLocalizedDrillExplanation'), 'WritingDrillRoom must use getLocalizedDrillExplanation');
  assert(content.includes('getLocalizedHint'), 'WritingDrillRoom must use getLocalizedHint');
});

it('practiceDrillsAiService.js enforces English generation when isEn is true', () => {
  const serviceContent = fs.readFileSync(path.resolve('src/services/ai/practiceDrillsAiService.js'), 'utf-8');
  assert(serviceContent.includes('CRITICAL LANGUAGE REQUIREMENT'), 'Service must enforce critical language requirement');
  assert(serviceContent.includes('prompt += `\\n\\n${langInstruction}`'), 'Service must append langInstruction to prompt');
});

it('Translates Context Vocab multiple-choice options from Vietnamese to English', () => {
  const optA = 'Làm cải thiện, làm cho tốt lên';
  const optB = 'Làm trầm trọng thêm, tối tệ đi';
  const optC = 'Duy trì trạng thái không thay đổi';
  const optD = 'Phân tích và giám sát chặt chẽ';

  assert.strictEqual(getLocalizedVocabOption(optA, true), 'To improve, make better');
  assert.strictEqual(getLocalizedVocabOption(optB, true), 'To worsen, exacerbate');
  assert.strictEqual(getLocalizedVocabOption(optC, true), 'To maintain an unchanged state');
  assert.strictEqual(getLocalizedVocabOption(optD, true), 'To closely analyze and monitor');

  // Check object format { text: '...' }
  assert.strictEqual(getLocalizedVocabOption({ text: optA }, true), 'To improve, make better');
  // Check Vietnamese mode preserves original
  assert.strictEqual(getLocalizedVocabOption(optA, false), optA);
});

it('GeneralDrillRoom.jsx wires getLocalizedVocabOption for vocabulary choices', () => {
  const content = fs.readFileSync(path.resolve('src/components/drills/GeneralDrillRoom.jsx'), 'utf-8');
  assert(content.includes('getLocalizedVocabOption(opt, isEn)'), 'GeneralDrillRoom must use getLocalizedVocabOption for options');
});

// 8. Reading Drills & Paraphrase Hunter Verification
it('Translates Reading Paraphrase Hunter titles without residual Vietnamese words', () => {
  const drill1 = { title: 'Truy tìm Paraphrase: Trí nhớ & Giấc ngủ sâu' };
  const drill2 = { title: 'Paraphrase Hunter: Trí nhớ & Giấc ngủ sâu' };
  const drill3 = { title: 'Truy tìm Paraphrase: Năng lượng tái tạo & Chi phí sản xuất' };

  assert.strictEqual(getLocalizedDrillTitle(drill1, true), 'Paraphrase Hunter: Memory & Deep Sleep');
  assert.strictEqual(getLocalizedDrillTitle(drill2, true), 'Paraphrase Hunter: Memory & Deep Sleep');
  assert.strictEqual(getLocalizedDrillTitle(drill3, true), 'Paraphrase Hunter: Renewable Energy & Production Costs');

  // Verify Vietnamese mode preserves original title
  assert.strictEqual(getLocalizedDrillTitle(drill1, false), 'Truy tìm Paraphrase: Trí nhớ & Giấc ngủ sâu');
});

it('All READING_MICRO_DRILLS items contain explicit titleEn and categoryEn', () => {
  assert(READING_MICRO_DRILLS.length > 0, 'READING_MICRO_DRILLS must not be empty');
  assert(READING_MICRO_DRILLS.every(d => Boolean(d.titleEn)), 'Every reading micro drill must have a titleEn');
});

it('Translates Paraphrase Hunter synonymous pair meanings into English', () => {
  const meaning1 = 'mất ngủ kéo dài/mãn tính';
  const meaning2 = 'gây tác động tiêu cực nặng nề';
  const meaning3 = 'sự sụt giảm mạnh';

  assert.strictEqual(getLocalizedVocabMeaning(meaning1, true), 'chronic insomnia / prolonged sleeplessness');
  assert.strictEqual(getLocalizedVocabMeaning(meaning2, true), 'to severely damage / exert a detrimental impact on');
  assert.strictEqual(getLocalizedVocabMeaning(meaning3, true), 'a sharp decline / dramatic plunge');
});

it('ReadingDrillRoom.jsx wires getLocalizedDrillCategory, getLocalizedDrillExplanation, and getLocalizedVocabMeaning', () => {
  const content = fs.readFileSync(path.resolve('src/components/drills/ReadingDrillRoom.jsx'), 'utf-8');
  assert(content.includes('getLocalizedDrillCategory(currentReadingPara, isEn)'), 'ReadingDrillRoom must localize ReadingPara category');
  assert(content.includes('getLocalizedDrillCategory(currentHeadings, isEn)'), 'ReadingDrillRoom must localize Headings category');
  assert(content.includes('getLocalizedVocabMeaning(pair, true)'), 'ReadingDrillRoom must localize pair meaning');
});

console.log(`\n🎉 Step 112 Verification: All ${passed}/${total} assertions passed!`);
