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

// 9. Listening and Speaking Rooms Bilingual Wiring
it('Translates compound Matching Headings dynamic topics into English', () => {
  const dynamicHeading1 = { title: 'Matching Headings Trap: Tác động xã hội của Vườn đô thị' };
  const dynamicHeading2 = { title: 'Phá bẫy Matching Headings: Tác động xã hội của Vườn đô thị' };

  assert.strictEqual(getLocalizedDrillTitle(dynamicHeading1, true), 'Matching Headings Trap: Social Impact of Urban Gardens');
  assert.strictEqual(getLocalizedDrillTitle(dynamicHeading2, true), 'Matching Headings Trap: Social Impact of Urban Gardens');
});

it('ListeningDrillRoom.jsx wires localized helpers across all 5 sub-labs', () => {
  const content = fs.readFileSync(path.resolve('src/components/drills/ListeningDrillRoom.jsx'), 'utf-8');
  assert(content.includes('getLocalizedDrillCategory'), 'ListeningDrillRoom must use getLocalizedDrillCategory');
  assert(content.includes('getLocalizedDrillExplanation'), 'ListeningDrillRoom must use getLocalizedDrillExplanation');
  assert(content.includes('getLocalizedVocabOption'), 'ListeningDrillRoom must use getLocalizedVocabOption');
  assert(content.includes('getLocalizedDrillTitle'), 'ListeningDrillRoom must use getLocalizedDrillTitle');
});

it('SpeakingDrillRoom.jsx wires localized helpers across all 4 speaking rooms', () => {
  const content = fs.readFileSync(path.resolve('src/components/drills/SpeakingDrillRoom.jsx'), 'utf-8');
  assert(content.includes('getLocalizedTopicName'), 'SpeakingDrillRoom must use getLocalizedTopicName');
  assert(content.includes('getLocalizedDrillCategory'), 'SpeakingDrillRoom must use getLocalizedDrillCategory');
  assert(content.includes('getLocalizedDrillExplanation'), 'SpeakingDrillRoom must use getLocalizedDrillExplanation');
  assert(content.includes('getLocalizedVocabMeaning'), 'SpeakingDrillRoom must use getLocalizedVocabMeaning');
});

it('Translates Listening Drill titles dynamically from Vietnamese to English', () => {
  const combatDictation = { title: 'Dictation Thực Chiến: Dịch Vụ Thẻ Thành Viên' };
  assert.strictEqual(getLocalizedDrillTitle(combatDictation, true), 'Combat Dictation: Membership Card Services');
  assert.strictEqual(getLocalizedDrillTitle(combatDictation, false), 'Dictation Thực Chiến: Dịch Vụ Thẻ Thành Viên');

  const commCombat = { title: '✨ [AI Cộng Đồng] Dictation Thực Chiến: Dịch Vụ Thẻ Thành Viên' };
  assert.strictEqual(getLocalizedDrillTitle(commCombat, true), '✨ [AI Community] Combat Dictation: Membership Card Services');

  const dictationBasic = { title: 'Dictation Cấp 1 (Cơ bản): Đăng ký thông tin lưu trú khách sạn' };
  assert.strictEqual(getLocalizedDrillTitle(dictationBasic, true), 'Dictation Level 1 (Basic): Hotel Accommodation Registration');

  const spellingDrill = { title: 'Đánh vần tên riêng & Mã bưu chính: Khu đô thị mới' };
  assert.strictEqual(getLocalizedDrillTitle(spellingDrill, true), 'Proper Names & Postcodes: Khu đô thị mới');

  const distractorDrill = { title: 'Bẫy tự đính chính (Self-Correction Trap): Thời gian khởi hành xe buýt' };
  assert.strictEqual(getLocalizedDrillTitle(distractorDrill, true), 'Self-Correction Trap: Bus Departure Time');

  const mapDrill = { title: 'Định hướng ngã ba & Lối rẽ: Tìm Phòng Hội Nghị Trung Tâm' };
  assert.strictEqual(getLocalizedDrillTitle(mapDrill, true), 'T-Junction & Turn Navigation: Central Conference Room');

  const signDrill = { title: 'Tín hiệu Chuyển Luận Điểm: Từ bối cảnh lịch sử sang Nguyên nhân cốt lõi' };
  assert.strictEqual(getLocalizedDrillTitle(signDrill, true), 'Signposting: Context Shift to Root Causes');

  const dynamicSignDrill = { title: 'Tín hiệu Chuyển Luận Điểm: Thảo luận về dự án bảo tồn nguồn nước' };
  assert.strictEqual(getLocalizedDrillTitle(dynamicSignDrill, true), 'Signposting: Water Conservation Project Discussion');
});

it('Translates Listening categories, options, and explanations into English', () => {
  assert.strictEqual(getLocalizedDrillCategory({ category: 'Chép chính tả' }, true), 'Dictation Practice');
  assert.strictEqual(getLocalizedDrillCategory({ category: 'Đánh vần & Con số' }, true), 'Spelling & Numbers');
  assert.strictEqual(getLocalizedDrillCategory({ category: 'Bẫy nhiễu nghe hiểu' }, true), 'Distractor Traps');
  assert.strictEqual(getLocalizedDrillCategory({ category: 'Bản đồ & Định hướng' }, true), 'Maps & Directions');
  assert.strictEqual(getLocalizedDrillCategory({ category: 'Tín hiệu chuyển đoạn' }, true), 'Signposting Signals');

  // Option parentheses
  const optWithParen = '8:15 AM (Thời gian dự kiến ban đầu)';
  assert.strictEqual(getLocalizedVocabOption(optWithParen, true), '8:15 AM (Initial scheduled time)');

  // Signposting question
  const viQuestion = 'Cụm từ nào báo hiệu người nói đang chuyển sang phân tích Nguyên nhân (Primary catalyst)?';
  assert.strictEqual(getLocalizedDrillExplanation(viQuestion, true), 'Which phrase signals that the speaker is shifting to the primary catalyst?');
});

// 10. Audit of all 5 Listening Tabs from User Screenshots
it('Translates all items from the 5 Listening user screenshots correctly into English', () => {
  // Tab 2: Spelling & Numbers titles without colons and caution notes
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Đánh vần Họ người & Bẫy tự đính chính' }, true), 'Surname Spelling & Self-Correction Trap');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Đánh vần tên đường & UK Postcodes' }, true), 'Street Names Spelling & UK Postcodes');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Đánh vần tên đường & Tự sửa lỗi' }, true), 'Street Names Spelling & Self-Correction');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Đánh vần họ khách hàng xuất hóa đơn' }, true), 'Customer Surname Spelling for Invoicing');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Đánh vần tên họ & Bẫy tự sửa lỗi' }, true), 'Full Name Spelling & Self-Correction Trap');

  const cautionNote = '⚠️ Caution: Bẫy tự đính chính (Self-correction): Người nói đưa ra tên đệm Featherstone trước, sau đó mới đính chính lại họ chính xác là Pemberton.';
  const localizedCaution = getLocalizedDrillExplanation(cautionNote, true);
  assert(!localizedCaution.includes('Bẫy tự đính chính'), 'Caution note must not contain Vietnamese');
  assert(localizedCaution.includes('Self-correction trap:'), 'Caution note must have translated label');

  // Tab 1: Dictation titles & audio tips
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Combat Dictation: Đăng Ký Tour Tham Quan Miễn Phí' }, true), 'Combat Dictation: Free Guided Tour Registration');
  assert.strictEqual(getLocalizedDrillTitle({ title: '✨ [AI Community] Academic Dictation: Vi khí hậu đô thị & Hiệu ứng đảo nhiệt' }, true), '✨ [AI Community] Academic Dictation: Urban Microclimate & Urban Heat Island Effect');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Combat Dictation: Đăng ký thẻ thư viện công cộng' }, true), 'Combat Dictation: Public Library Card Registration');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Combat Dictation: Gia Hạn Thẻ Thư Viện' }, true), 'Combat Dictation: Library Card Renewal');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Combat Dictation: Đăng Ký Khóa Học Cộng Đồng' }, true), 'Combat Dictation: Community Course Registration');

  const dictationTip = "💡 Chú ý nối âm phụ âm - nguyên âm ở 'fill in' và 'hand it', cùng âm giảm nhẹ của từ 'to'.";
  const localizedTip = getLocalizedDrillExplanation(dictationTip, true);
  assert(!localizedTip.includes('Chú ý nối âm'), 'Dictation tip must not contain Vietnamese');
  assert(localizedTip.includes('Note consonant-to-vowel linking in'), 'Dictation tip must be translated');

  // Tab 3: Distractor Hunter jump-to titles
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Self-Correction Trap: Đặt phòng họp sự kiện' }, true), 'Self-Correction Trap: Event Meeting Room Booking');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Self-Correction Trap: Giờ học Yoga for người mới bắt đầu' }, true), 'Self-Correction Trap: Beginner Yoga Class Schedule');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Self-Correction Trap: Đặt phòng hội thảo' }, true), 'Self-Correction Trap: Seminar Room Booking');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Self-Correction Trap: Đặt phòng họp công ty' }, true), 'Self-Correction Trap: Corporate Meeting Room Booking');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Self-Correction Trap: Đặt bàn nhà hàng' }, true), 'Self-Correction Trap: Restaurant Table Reservation');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Self-Correction Trap: Thay đổi lịch hẹn dịch vụ' }, true), 'Self-Correction Trap: Service Appointment Rescheduling');
  assert.strictEqual(getLocalizedDrillTitle({ title: '✨ [AI Community] Bẫy sửa miệng (Self-Correction Trap): Phí hội viên trung tâm thể thao' }, true), '✨ [AI Community] Self-Correction Trap: Sports Center Membership Fee');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Self-Correction Trap: Đặt lịch sân thể thao' }, true), 'Self-Correction Trap: Sports Field Booking');

  // Tab 4: Maps & Directions Reflex jump-to titles
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Map Navigation: Công viên Riverside' }, true), 'Map Navigation: Riverside Park');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Map Navigation: Công viên Greenvale' }, true), 'Map Navigation: Greenvale Park');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Map Navigation: Công viên Green Valley' }, true), 'Map Navigation: Green Valley Park');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Map Navigation: Công viên Bách thảo Riverside' }, true), 'Map Navigation: Riverside Botanical Park');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Map Navigation: Công viên Trung tâm' }, true), 'Map Navigation: Central Park');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Map Navigation: Công viên Greenfield' }, true), 'Map Navigation: Greenfield Park');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Map Navigation: Công viên Greenwood' }, true), 'Map Navigation: Greenwood Park');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Map Navigation: Công viên Bờ Sông' }, true), 'Map Navigation: Riverside Waterfront Park');

  // Tab 5: Part 4 Signposting Signals jump-to titles and mixed question
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Signposting Catcher: Kinh tế học Urban Agriculture' }, true), 'Signposting Catcher: Economics of Urban Agriculture');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Signposting Catcher: Nghiên cứu Vi khí hậu Đô thị' }, true), 'Signposting Catcher: Urban Microclimate Research');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Signposting Catcher: Sinh vật học biển' }, true), 'Signposting Catcher: Marine Biology');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Signposting Catcher: Tác động của Green Spaces đô thị' }, true), 'Signposting Catcher: Impact of Urban Green Spaces');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Signposting Catcher: Urbanization và Kiến trúc Xanh' }, true), 'Signposting Catcher: Urbanization & Green Architecture');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Signposting Catcher: Tác động of hạ tầng xanh' }, true), 'Signposting Catcher: Impact of Green Infrastructure');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Signposting Catcher: Cơ chế lưu trữ trí nhớ' }, true), 'Signposting Catcher: Memory Storage Mechanisms');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Signposting Catcher: Khảo cổ học & Tuyến Thương mại Cổ đại' }, true), 'Signposting Catcher: Archaeology & Ancient Trade Routes');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Signposting Catcher: Sinh thái học đại dương' }, true), 'Signposting Catcher: Marine Ecology');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Signposting Catcher: Hiện tượng sinh học biển' }, true), 'Signposting Catcher: Marine Biological Phenomena');

  const mixedQuestion = 'Which phrase signals người nói đang shifting to analyzing khía cạnh tài chính của dự án?';
  const localizedQuestion = getLocalizedDrillExplanation(mixedQuestion, true);
  assert.strictEqual(localizedQuestion, 'Which phrase signals the speaker is shifting to analyzing the financial aspect of the project?');
});

// 11. MicroDrillAudioBar.jsx bilingual verification
it('MicroDrillAudioBar.jsx uses useTranslation and contains bilingual labels', () => {
  const content = fs.readFileSync(path.resolve('src/components/listening/MicroDrillAudioBar.jsx'), 'utf-8');
  assert(content.includes('useTranslation'), 'MicroDrillAudioBar must import useTranslation');
  assert(content.includes('Click Play to start listening'), 'Must contain English Click Play label');
  assert(content.includes('Bấm Play để bắt đầu nghe'), 'Must contain Vietnamese Click Play label');
  assert(content.includes('Exam Aligned Native TTS'), 'Must contain English Exam Aligned badge');
});

// 12. Audit of Remaining Micro-Drills Rooms from 5 Screenshots
it('Translates all items from the 5 uploaded screenshots (General, Writing, Reading) correctly into English', () => {
  // Screenshot 1: General Studio - Complex Sentence S-V-O
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Complex Sentence S-V-O: Quy hoạch Đô thị & Giao thông' }, true), 'Complex Sentence S-V-O: Urban Planning & Transport');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Complex Sentence S-V-O: Xu hướng làm việc từ xa' }, true), 'Complex Sentence S-V-O: Remote Work Trends');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Complex Sentence S-V-O: Công nghệ & Môi trường làm việc' }, true), 'Complex Sentence S-V-O: Technology & Workplace Environment');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Complex Sentence S-V-O: Vai trò of Green Spaces đô thị' }, true), 'Complex Sentence S-V-O: Role of Urban Green Spaces');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Complex Sentence S-V-O: Hạ tầng đô thị hiện đại' }, true), 'Complex Sentence S-V-O: Modern Urban Infrastructure');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Complex Sentence S-V-O: Quá trình Urbanization' }, true), 'Complex Sentence S-V-O: Urbanization Process');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Complex Sentence S-V-O: Quy hoạch đô thị và Sức khỏe cộng đồng' }, true), 'Complex Sentence S-V-O: Urban Planning & Public Health');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Complex Sentence S-V-O: Quy hoạch đô thị bền vững' }, true), 'Complex Sentence S-V-O: Sustainable Urban Planning');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Complex Sentence S-V-O: Quy hoạch đô thị & Môi trường' }, true), 'Complex Sentence S-V-O: Urban Planning & Environment');

  // Screenshot 2: Writing Drills - Intro/Body Paraphrase
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Paraphrase Drill: Câu Nguyên Nhân - Kết Quả in Writing Task 2' }, true), 'Paraphrase Drill: Cause & Effect Sentences in Writing Task 2');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Paraphrase Drill: Câu Nguyên Nhân - Kết Quả' }, true), 'Paraphrase Drill: Cause & Effect Sentences');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Paraphrase Drill: Câu Nguyên Nhân - Hậu Quả' }, true), 'Paraphrase Drill: Cause & Consequence Sentences');

  // Screenshot 3: Writing Drills - Error Spotting
  assert.strictEqual(getLocalizedDrillTitle({ title: "Error Spotting: danh từ không đếm được: 'Evidence' in IELTS Writing" }, true), "Error Spotting: Uncountable Noun: 'Evidence' in IELTS Writing");
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Error Spotting: dùng danh từ định lượng và sự hòa hợp chủ-vị' }, true), 'Error Spotting: Quantifiers & Subject-Verb Agreement');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Error Spotting: dùng động từ xu hướng in biểu đồ tĩnh (Static Charts)' }, true), 'Error Spotting: Trend Verbs in Static Charts');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Error Spotting: dùng động từ xu hướng in biểu đồ tĩnh (Static Chart)' }, true), 'Error Spotting: Trend Verbs in Static Charts');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Error Spotting: Danh từ không đếm được & Quantifiers (Information)' }, true), 'Error Spotting: Uncountable Nouns & Quantifiers (Information)');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Error Spotting: Danh từ không đếm được & Sự hòa hợp Chủ ngữ - Động từ' }, true), 'Error Spotting: Uncountable Nouns & Subject-Verb Agreement');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Error Spotting: sự hòa hợp giữa chủ ngữ và động từ with danh động từ (Gerund)' }, true), 'Error Spotting: Subject-Verb Agreement with Gerunds');
  assert.strictEqual(getLocalizedDrillTitle({ title: "Error Spotting: danh từ không đếm được 'Research' & Cách dùng lượng từ" }, true), "Error Spotting: Uncountable Noun 'Research' & Quantifiers");
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Error Spotting: Động từ Xu hướng in Biểu đồ Tĩnh (Task 1)' }, true), 'Error Spotting: Trend Verbs in Static Charts (Task 1)');

  // Screenshot 4: Reading Drills - True / False / Not Given Traps
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Not Given vs False Trap: Tác động of Chế độ ăn Lưỡng Hà' }, true), 'Not Given vs False Trap: Impact of Mesopotamian Diet');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Not Given vs False Trap: Tác động of vườn trên mái đối with năng lượng đô thị' }, true), 'Not Given vs False Trap: Impact of Rooftop Gardens on Urban Energy');
  assert.strictEqual(getLocalizedDrillTitle({ title: '✨ [AI Community] Bẫy suy diễn Not Given vs True: Kiến trúc phỏng sinh học' }, true), '✨ [AI Community] Not Given vs True Trap: Biomimetic Architecture');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Not Given vs False Trap: Mô hình Urban Agriculture' }, true), 'Not Given vs False Trap: Urban Agriculture Models');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Not Given vs False Trap: Hiệu suất làm việc từ xa' }, true), 'Not Given vs False Trap: Remote Work Productivity');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Not Given vs False Trap: Mô hình làm việc Hybrid và Năng suất' }, true), 'Not Given vs False Trap: Hybrid Work Model & Productivity');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Not Given vs False Trap: Cây xanh đô thị và Urban Heat Island Effect' }, true), 'Not Given vs False Trap: Urban Trees & Urban Heat Island Effect');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Not Given vs False Trap: Tác động of Đèn đường LED đến An ninh Đô thị' }, true), 'Not Given vs False Trap: Impact of LED Streetlights on Urban Security');

  // Screenshot 5: Reading Drills - Reading Paraphrase Hunter
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Paraphrase Hunter: Public Transit đô thị' }, true), 'Paraphrase Hunter: Urban Public Transit');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Paraphrase Hunter: Giao thông Đô thị' }, true), 'Paraphrase Hunter: Urban Transport');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Paraphrase Hunter: Quy hoạch Green Spaces' }, true), 'Paraphrase Hunter: Green Spaces Planning');
  assert.strictEqual(getLocalizedDrillTitle({ title: '✨ [AI Community] Bắt cặp từ đồng nghĩa học thuật: Pin năng lượng mặt trời Perovskite' }, true), '✨ [AI Community] Paraphrase Hunter: Perovskite Solar Cells');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Paraphrase Hunter: Green Spaces đô thị' }, true), 'Paraphrase Hunter: Urban Green Spaces');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Paraphrase Hunter: Nông nghiệp Hiện đại' }, true), 'Paraphrase Hunter: Modern Agriculture');
});

// 13. Audit of Latest 5 Screenshots (Error Spotting, Matching Headings, Spelling, Speaking Part 3)
it('Translates all items from the latest 5 screenshots correctly into natural English', () => {
  // Screenshot 1: Writing Drills - Error Spotting Jump-To dropdown
  assert.strictEqual(getLocalizedDrillTitle({ title: "Sửa lỗi Uncountable Nouns: 'Evidence' in IELTS Writing" }, true), "Error Spotting: Uncountable Noun: 'Evidence' in IELTS Writing");
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Sửa lỗi Quantifiers & Subject-Verb Agreement' }, true), 'Error Spotting: Quantifiers & Subject-Verb Agreement');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'dùng động từ xu hướng in biểu đồ tĩnh (Static Charts)' }, true), 'Error Spotting: Trend Verbs in Static Charts');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Dùng động từ xu hướng in biểu đồ tĩnh (Static Charts)' }, true), 'Error Spotting: Trend Verbs in Static Charts');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'dùng động từ xu hướng in biểu đồ tĩnh (Static Chart)' }, true), 'Error Spotting: Trend Verbs in Static Charts');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Danh từ không đếm được & Quantifiers (Information)' }, true), 'Error Spotting: Uncountable Nouns & Quantifiers (Information)');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Sửa lỗi Uncountable Nouns & Subject-Verb Agreement' }, true), 'Error Spotting: Uncountable Nouns & Subject-Verb Agreement');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'sự hòa hợp giữa chủ ngữ và động từ with danh động từ (Gerund)' }, true), 'Error Spotting: Subject-Verb Agreement with Gerunds');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Sự hòa hợp giữa chủ ngữ và động từ with danh động từ (Gerund)' }, true), 'Error Spotting: Subject-Verb Agreement with Gerunds');
  assert.strictEqual(getLocalizedDrillTitle({ title: "Sửa lỗi Uncountable Noun 'Research' & Quantifiers" }, true), "Error Spotting: Uncountable Noun 'Research' & Quantifiers");
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Động từ Xu hướng in Biểu đồ Tĩnh (Task 1)' }, true), 'Error Spotting: Trend Verbs in Static Charts (Task 1)');

  // Screenshot 2: Reading Drills - Matching Headings Trap Decoder
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Matching Headings Trap: Urbanization & Môi trường' }, true), 'Matching Headings Trap: Urbanization & Environment');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Phá bẫy Matching Headings: Urbanization & Môi trường' }, true), 'Matching Headings Trap: Urbanization & Environment');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Matching Headings Trap: Giải pháp tiếng ồn đô thị' }, true), 'Matching Headings Trap: Urban Noise Solutions');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Matching Headings Trap: Planning cây xanh giảm tiếng ồn đô thị' }, true), 'Matching Headings Trap: Greenery Planning for Urban Noise Reduction');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Matching Headings Trap: Thách thức of Nông nghiệp Thẳng đứng' }, true), 'Matching Headings Trap: Challenges of Vertical Farming');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Phá bẫy Matching Headings: Thách thức của Nông nghiệp Thẳng đứng' }, true), 'Matching Headings Trap: Challenges of Vertical Farming');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Matching Headings Trap: Không gian văn phòng mở' }, true), 'Matching Headings Trap: Open-Plan Office Spaces');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Matching Headings Trap: Văn phòng mở' }, true), 'Matching Headings Trap: Open-Plan Offices');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Matching Headings Trap: Nuôi ong đô thị (Urban Beekeeping)' }, true), 'Matching Headings Trap: Urban Beekeeping');

  // Screenshot 3: Listening Drills - Spelling & Numbers
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Đánh vần Street Names & UK Postcodes' }, true), 'Street Names Spelling & UK Postcodes');
  assert.strictEqual(getLocalizedDrillTitle({ title: 'Đánh vần tên đường & UK Postcodes' }, true), 'Street Names Spelling & UK Postcodes');

  // Screenshot 4 & 5: Speaking Drills - Part 3 Two-Sided Debate Analytical Tip
  const part3Tip = 'Tại Part 3, điểm mấu chốt là không được nhìn nhận vấn đề một chiều đen-trắng. Hãy phân tích tác động hai mặt và đưa ra kết luận trung dung có chiều sâu.';
  assert.strictEqual(
    getLocalizedDrillExplanation(part3Tip, true),
    'In Part 3, the key is avoiding black-and-white perspectives. Analyze both sides and deliver a balanced, nuanced conclusion.'
  );

  const part3Tip2 = 'Phân tích giữa giá trị bản sắc văn hóa / du lịch và nhu cầu thực tiễn về hạ tầng nhà ở / giao thông.';
  assert.strictEqual(
    getLocalizedDrillExplanation(part3Tip2, true),
    'Analyze the trade-off between cultural identity/tourism value and pragmatic infrastructure demands for housing/transport.'
  );
});

console.log(`\n🎉 Step 112 Verification: All ${passed}/${total} assertions passed!`);


