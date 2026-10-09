/**
 * drillLocalization.js
 * Comprehensive bilingual localization utilities for IELTS Micro-Drills Studio.
 * Handles drill titles, categories, labels, and options for English and Vietnamese modes.
 */

const KNOWN_TITLE_MAP = {
  // Writing Drills
  'Giới từ miêu tả xu hướng và số liệu': 'Prepositions for Describing Trends & Data',
  'Giới từ miêu tả số liệu Task 1 (Prepositions of Data)': 'Task 1 Prepositions of Data',
  'Từ nối học thuật Task 2 (Advanced Cohesive Devices)': 'Task 2 Advanced Cohesive Devices',
  'Đọc hiểu & Kiểm tra số liệu biểu đồ Task 1 (Renewable Energy)': 'Task 1 Chart Reading & Data Verification (Renewable Energy)',
  'Luyện Paraphrase Mở Bài: Giáo dục & Nghề nghiệp': 'Introduction Paraphrase: Education & Careers',
  'Luyện Paraphrase Task 1: Câu mở bài biểu đồ đường': 'Task 1 Line Graph Introduction Paraphrase',
  'Luyện Paraphrase Mở Bài: AI & Việc làm': 'Introduction Paraphrase: AI & Employment',
  'Luyện Paraphrase Câu Thân Bài: Ô nhiễm môi trường': 'Body Paragraph Paraphrase: Environmental Pollution',
  'Luyện Paraphrase Task 1: Câu mở bài biểu đồ cột': 'Task 1 Bar Chart Introduction Paraphrase',
  'Luyện Paraphrase Câu Overview Task 1: Tăng trưởng & Dẫn đầu': 'Task 1 Overview Paraphrase: Growth & Dominance',
  'Luyện Paraphrase Câu Kết Bài Task 2: Giải pháp & Dự báo': 'Task 2 Conclusion Paraphrase: Solutions & Forecasts',
  'Sửa lỗi mạo từ & danh từ không đếm được': 'Error Spotting: Articles & Uncountable Nouns',
  'Sửa lỗi câu chắp vá (Run-on Sentence)': 'Error Spotting: Run-on Sentence & Comma Splices',
  'Sửa lỗi thì & từ vựng chỉ xu hướng sai trong đề Static': 'Error Spotting: Tense & Trend Verbs in Static Tasks',
  'Sửa lỗi hòa hợp Chủ ngữ - Vị ngữ phức tạp': 'Error Spotting: Complex Subject-Verb Agreement',
  'Collocation Học Thuật: Môi Trường & Năng Lượng': 'Academic Collocations: Environment & Energy',
  'Collocation Học Thuật: Công Nghệ & Trí Tuệ Nhân Tạo': 'Academic Collocations: Technology & Artificial Intelligence',

  // Community Drills
  'Từ nối lập luận: Trí tuệ nhân tạo & Lao động': 'Argumentative Transitions: AI & Labor',
  'Giới từ số liệu Task 1: Xu hướng đô thị hóa': 'Task 1 Data Prepositions: Urbanization Trends',
  'Phân tích số liệu biểu đồ Task 1: Năng lượng tái tạo': 'Task 1 Chart Analysis: Renewable Energy',
  'Viết lại câu mở bài Task 2: Giảm thải Carbon': 'Task 2 Introduction Paraphrase: Carbon Reduction',
  'Bẫy suy diễn Not Given vs False: AI trong chẩn đoán y khoa': 'Not Given vs False Trap: AI in Medical Diagnosis',

  // Reading Drills
  'Phân biệt bẫy Not Given vs False: Thụ phấn nhân tạo': 'Not Given vs False Trap: Artificial Pollination',
  'Phân biệt bẫy Not Given vs False: Khảo cổ học nền văn minh Maya': 'Not Given vs False Trap: Maya Civilization Archaeology',
  'Phân biệt bẫy Not Given vs True: Nhiệt độ đại dương sâu': 'Not Given vs True Trap: Deep-Sea Hydrothermal Temperatures',
  'Phân biệt bẫy Not Given vs False: Ngủ ngắn (Power Nap) & Năng suất': 'Not Given vs False Trap: Power Naps & Productivity',
  'Phân biệt bẫy Not Given vs False: Siêu cá heo & Sóng siêu âm': 'Not Given vs False Trap: Dolphin Echolocation',
  'Phân biệt bẫy Not Given vs True: Lớp băng vĩnh cửu tan chảy': 'Not Given vs True Trap: Permafrost Thawing',
  'Truy tìm Paraphrase: Trí tuệ nhân tạo & Y tế': 'Paraphrase Hunter: AI & Healthcare',
  'Truy tìm Paraphrase: Năng lượng tái tạo & Lưới điện': 'Paraphrase Hunter: Renewable Energy & Grid Integration',
  'Truy tìm Paraphrase: Quy hoạch đô thị & Thành phố 15 phút': 'Paraphrase Hunter: Urban Planning & 15-Minute Cities',
  'Truy tìm Paraphrase: Đa dạng sinh học đại dương sâu': 'Paraphrase Hunter: Deep-Sea Marine Biodiversity',
  'Phá bẫy Matching Headings: Đột phá công nghệ giao thông siêu tốc Hyperloop': 'Matching Headings Trap: Hyperloop High-Speed Transport',
  'Phá bẫy Matching Headings: Tâm lý học hành vi người tiêu dùng kỹ thuật số': 'Matching Headings Trap: Digital Consumer Behavior Psychology',
  'Phá bẫy Matching Headings: Tác động sinh thái của ngành dệt may thời trang nhanh': 'Matching Headings Trap: Ecological Impact of Fast Fashion',

  // General Core Foundation Drills
  'Đoán nghĩa từ: ephemeral': 'Context Vocab: ephemeral',
  'Đoán nghĩa từ: exacerbate': 'Context Vocab: exacerbate',
  'Đoán nghĩa từ: ubiquitous': 'Context Vocab: ubiquitous',
  'Đoán nghĩa từ: detrimental': 'Context Vocab: detrimental',
  'Giải phẫu câu phức: Biến đổi khí hậu & Đa dạng sinh học': 'Complex Sentence S-V-O: Climate Change & Biodiversity',
  'Giải phẫu câu phức: Trí tuệ nhân tạo & Thị trường lao động': 'Complex Sentence S-V-O: AI & Labor Market Disruption',
  'Giải phẫu câu phức: Đô thị hóa & Giao thông công cộng': 'Complex Sentence S-V-O: Urbanization & Transit Infrastructure'
};

const KNOWN_CATEGORY_MAP = {
  'Phòng Chung': 'General Studio',
  'Chuyên Writing': 'Writing Drills',
  'Chuyên Reading': 'Reading Drills',
  'Chuyên Listening': 'Listening Drills',
  'Chuyên Speaking': 'Speaking Drills'
};

/**
 * Returns localized drill title based on the active language mode.
 * @param {Object} drill - The drill object
 * @param {boolean} isEn - English mode flag
 * @returns {string} Localized title
 */
export function getLocalizedDrillTitle(drill, isEn = false) {
  if (!drill) return '';
  if (!isEn) return drill.title || '';

  // 1. If explicit English title provided in data
  if (drill.titleEn) return drill.titleEn;

  const rawTitle = drill.title || '';

  // Check prefix for Community / AI generated tags
  const isCommunityTagged = rawTitle.includes('[AI Cộng Đồng]');
  const isAiTagged = rawTitle.includes('[AI]');
  let cleanTitle = rawTitle
    .replace(/✨\s*\[AI Cộng Đồng\]\s*/i, '')
    .replace(/\[AI\]\s*/i, '')
    .trim();

  // 2. Direct dictionary match
  if (KNOWN_TITLE_MAP[cleanTitle]) {
    const matched = KNOWN_TITLE_MAP[cleanTitle];
    if (isCommunityTagged) return `✨ [AI Community] ${matched}`;
    if (isAiTagged) return `[AI] ${matched}`;
    return matched;
  }
  if (KNOWN_TITLE_MAP[rawTitle]) {
    return KNOWN_TITLE_MAP[rawTitle];
  }

  // 3. Pattern / Regex-based translations for dynamic drills
  if (/^Giới từ miêu tả xu hướng/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + 'Prepositions for Describing Trends & Data';
  }
  if (/^Giới từ miêu tả số liệu/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + 'Task 1 Prepositions of Data';
  }
  if (/^Từ nối học thuật/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + 'Task 2 Advanced Cohesive Devices';
  }
  if (/^Từ nối lập luận/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + cleanTitle.replace(/^Từ nối lập luận:\s*/i, 'Argumentative Transitions: ');
  }
  if (/^Phân biệt bẫy Not Given vs False:\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Not Given vs False Trap: ${RegExp.$1}`;
  }
  if (/^Phân biệt bẫy Not Given vs True:\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Not Given vs True Trap: ${RegExp.$1}`;
  }
  if (/^Bẫy suy diễn Not Given vs False:\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Not Given vs False Trap: ${RegExp.$1}`;
  }
  if (/^Truy tìm Paraphrase:\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Paraphrase Hunter: ${RegExp.$1}`;
  }
  if (/^Phá bẫy Matching Headings:\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Matching Headings Trap: ${RegExp.$1}`;
  }
  if (/^Đoán nghĩa từ:\s*(.*)/i.test(cleanTitle)) {
    return `Context Vocab: ${RegExp.$1}`;
  }
  if (/^Giải phẫu câu phức:\s*(.*)/i.test(cleanTitle)) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + `Complex Sentence S-V-O: ${RegExp.$1}`;
  }
  if (/^Sửa lỗi\s*(.*)/i.test(cleanTitle)) {
    return `Error Spotting: ${RegExp.$1}`;
  }
  if (/^Luyện Paraphrase\s*(.*)/i.test(cleanTitle)) {
    return `Paraphrase Drill: ${RegExp.$1}`;
  }
  if (/^Collocation Học Thuật:\s*(.*)/i.test(cleanTitle)) {
    return `Academic Collocations: ${RegExp.$1}`;
  }

  // 4. If title contains English in parentheses e.g. "Giới từ... (Prepositions of Data)"
  const parenMatch = cleanTitle.match(/\(([^)]+)\)$/);
  if (parenMatch && /[a-zA-Z\s]{4,}/.test(parenMatch[1])) {
    return (isCommunityTagged ? '✨ [AI Community] ' : '') + parenMatch[1].trim();
  }

  return rawTitle;
}

/**
 * Returns localized drill category.
 * @param {Object} drill - The drill object
 * @param {boolean} isEn - English mode flag
 * @returns {string} Localized category
 */
export function getLocalizedDrillCategory(drill, isEn = false) {
  if (!drill) return '';
  if (!isEn) return drill.category || '';
  if (drill.categoryEn) return drill.categoryEn;
  const raw = drill.category || '';
  return KNOWN_CATEGORY_MAP[raw] || raw;
}

/**
 * Returns localized drill context (e.g. Task 1 charts and given data numbers).
 * @param {Object|string} drillOrContext - Drill object or raw context string
 * @param {boolean} isEn - English mode flag
 * @returns {string} Localized data summary
 */
export function getLocalizedDrillContext(drillOrContext, isEn = false) {
  if (!drillOrContext) return '';
  const raw = typeof drillOrContext === 'object' 
    ? (isEn && drillOrContext.contextEn ? drillOrContext.contextEn : drillOrContext.context) 
    : drillOrContext;

  if (!raw || !isEn) return raw || '';

  let text = String(raw);

  const phraseReplacements = [
    [/Dữ liệu phát điện sạch\s*(\d*):?/gi, 'Clean electricity generation data $1:'],
    [/Dữ liệu năm\s*(\d+)\s*(và|với)\s*(\d+)\s*về tỷ lệ các nguồn năng lượng tiêu thụ tại (quốc gia|nước)\s*([A-Za-z0-9]+):?/gi, 'Data for $1 and $3 on the proportion of energy consumed in Country $5:'],
    [/Dữ liệu năm\s*(\d+)\s*(và|với)\s*(\d+)\s*về tỷ lệ các nguồn năng lượng tại (quốc gia|nước)\s*([A-Za-z0-9]+):?/gi, 'Data for $1 and $3 on energy source shares in Country $5:'],
    [/Dữ liệu năm\s*(\d+)\s*(và|với)\s*(\d+):?/gi, 'Data for $1 and $3:'],
    [/Dữ liệu năm\s*(\d+):?/gi, 'Data for $1:'],
    [/Dựa trên biểu đồ:\s*/gi, 'Based on the chart: '],
    [/Dựa trên biểu đồ\s*/gi, 'Based on the chart: '],
    [/về tỷ lệ các nguồn năng lượng tiêu thụ tại/gi, 'on the proportion of energy consumed in'],
    [/về tỷ lệ các nguồn năng lượng tại/gi, 'on energy source shares in'],
    [/về tỷ lệ tiêu thụ năng lượng tại/gi, 'on energy consumption shares in'],
    [/về tỷ lệ các nguồn năng lượng/gi, 'on energy source shares'],
    [/về tỷ lệ/gi, 'on the proportion of'],
    [/tiêu thụ tại/gi, 'consumed in'],
    [/quốc gia\s*([A-Za-z0-9]+)/gi, 'Country $1'],
    [/quốc gia/gi, 'Country'],
    [/nước\s*([A-Za-z0-9]+)/gi, 'Country $1'],
    [/nước/gi, 'Country'],
    [/Than đá/gi, 'Coal'],
    [/Than/gi, 'Coal'],
    [/Năng lượng tái tạo/gi, 'Renewable energy'],
    [/Khí đốt/gi, 'Natural gas'],
    [/Khí tự nhiên/gi, 'Natural gas'],
    [/Hạt nhân/gi, 'Nuclear'],
    [/Năng lượng hạt nhân/gi, 'Nuclear energy'],
    [/Dầu mỏ/gi, 'Oil'],
    [/Thủy điện/gi, 'Hydroelectric power'],
    [/Điện mặt trời/gi, 'Solar energy'],
    [/Điện gió/gi, 'Wind energy'],
    [/Tây Ban Nha/gi, 'Spain'],
    [/Đan Mạch/gi, 'Denmark'],
    [/Đức/gi, 'Germany'],
    [/Anh/gi, 'UK'],
    [/Vương quốc Anh/gi, 'UK'],
    [/Úc/gi, 'Australia'],
    [/Nhật Bản/gi, 'Japan'],
    [/Nhật/gi, 'Japan'],
    [/Hoa Kỳ|Mỹ/gi, 'US'],
    [/Pháp/gi, 'France'],
    [/\bvà\b/gi, 'and'],
    [/\bvới\b/gi, 'with']
  ];

  for (const [pattern, repl] of phraseReplacements) {
    text = text.replace(pattern, repl);
  }

  return text.trim();
}

/**
 * Returns localized explanation for drills, questions, blanks, or errors.
 * @param {Object|string} itemOrExplanation - Item object with explanation or raw string
 * @param {boolean} isEn - English mode flag
 * @returns {string} Localized explanation
 */
export function getLocalizedDrillExplanation(itemOrExplanation, isEn = false) {
  if (!itemOrExplanation) return '';
  const raw = typeof itemOrExplanation === 'object'
    ? (isEn && itemOrExplanation.explanationEn ? itemOrExplanation.explanationEn : itemOrExplanation.explanation)
    : itemOrExplanation;

  if (!raw || !isEn) return raw || '';

  let text = String(raw);

  const explanationReplacements = [
    [/^Đúng\s*\((True|TRUE)\)\.?\s*/i, 'Correct (TRUE). '],
    [/^Sai\s*\((False|FALSE)\)\.?\s*/i, 'Incorrect (FALSE). '],
    [/^Đúng\.?\s*/i, 'Correct. '],
    [/^Sai\.?\s*/i, 'Incorrect. '],
    [/Năm (\d+)/gi, 'In $1'],
    [/dẫn đầu với/gi, 'led with'],
    [/cao hơn/gi, 'higher than'],
    [/thấp hơn/gi, 'lower than'],
    [/đạt đỉnh tại/gi, 'peaked at'],
    [/đạt/gi, 'reached'],
    [/trong khi/gi, 'while'],
    [/còn/gi, 'while'],
    [/có sự chênh lệch nhỏ/gi, 'there was a slight difference of'],
    [/có mức tăng trưởng theo tỷ lệ ngoạn mục nhất/gi, 'had the most remarkable growth rate'],
    [/từ (\d+)% tăng gần (\d+) lần lên (\d+)%/gi, 'increasing nearly $2-fold from $1% to $3%'],
    [/Tây Ban Nha/gi, 'Spain'],
    [/Đan Mạch/gi, 'Denmark'],
    [/Đức/gi, 'Germany'],
    [/Anh/gi, 'UK'],
    [/Vương quốc Anh/gi, 'UK'],
    [/Úc/gi, 'Australia'],
    [/Nhật Bản/gi, 'Japan'],
    [/Nhật/gi, 'Japan'],
    [/'stood at \+ \[số liệu\]':\s*đứng tại mốc bao nhiêu\./gi, "'stood at + [data point]': indicates a specific data level."],
    [/'grew by \+ \[khoảng chênh lệch\]':\s*tăng thêm một khoảng bao nhiêu\./gi, "'grew by + [difference]': indicates the amount of increase."],
    [/'peaked at \+ \[số liệu đỉnh\]':\s*đạt đỉnh tại mức nào\./gi, "'peaked at + [peak figure]': indicates reaching a peak."],
    [/'accounted for \+ \[tỷ lệ\/phần trăm\]':\s*chiếm bao nhiêu phần trăm\./gi, "'accounted for + [percentage]': represents or comprises a proportion."],
    [/Manh mối tương phản/gi, 'Contrast clue'],
    [/Manh mối định nghĩa/gi, 'Definition clue'],
    [/Manh mối nhân quả/gi, 'Cause & effect clue'],
    [/Manh mối ví dụ/gi, 'Example clue'],
    [/cho thấy từ\s*"?([A-Za-z]+)"?\s*có nghĩa là/gi, 'shows that "$1" means'],
    [/cho thấy/gi, 'shows that'],
    [/đối lập với/gi, 'contrasts with'],
    [/kết hợp với/gi, 'combined with'],
    [/chi tiết/gi, 'detail'],
    [/do đó/gi, 'therefore'],
    [/suy ra/gi, 'inferring that'],
    [/có nghĩa là/gi, 'means'],
    [/ngắn ngủi, phù du, thoáng qua/gi, 'short-lived, transient, ephemeral'],
    [/làm lu mờ, gây bối rối, đánh hỏa mù/gi, 'to obscure, confuse, obfuscate'],
    [/làm cải thiện, làm cho tốt lên/gi, 'to improve, make better, ameliorate'],
    [/làm trầm trọng thêm, tồi tệ đi/gi, 'to exacerbate, worsen'],
    [/làm trầm trọng thêm/gi, 'to exacerbate, worsen']
  ];

  for (const [pattern, repl] of explanationReplacements) {
    text = text.replace(pattern, repl);
  }

  return text.trim();
}

/**
 * Returns localized hint for paraphrase exercises.
 * @param {string} hint - Raw hint string
 * @param {boolean} isEn - English mode flag
 * @returns {string} Localized hint
 */
export function getLocalizedHint(hint, isEn = false) {
  if (!hint || !isEn) return hint || '';
  let text = String(hint);
  if (/^Thay\s+"([^"]+)"\s+bằng\s+"([^"]+)"\s+hoặc\s+"([^"]+)"/i.test(text)) {
    return `Replace "${RegExp.$1}" with "${RegExp.$2}" or "${RegExp.$3}"`;
  }
  if (/^Thay\s+"([^"]+)"\s+bằng\s+"([^"]+)"/i.test(text)) {
    return `Replace "${RegExp.$1}" with "${RegExp.$2}"`;
  }
  if (/^Dùng danh từ hóa:\s*(.*)/i.test(text)) {
    return `Use nominalization: ${RegExp.$1}`;
  }
  if (/^Dùng từ vựng C1:\s*(.*)/i.test(text)) {
    return `Use C1 vocabulary: ${RegExp.$1}`;
  }
  if (/^Dùng:\s*(.*)/i.test(text)) {
    return `Use: ${RegExp.$1}`;
  }
  return text;
}

const KNOWN_OPTION_TRANSLATIONS = {
  'làm cải thiện, làm cho tốt lên': 'To improve, make better',
  'làm cải thiện, làm cho tốt hơn': 'To improve, make better',
  'làm trầm trọng thêm, tồi tệ đi': 'To worsen, exacerbate',
  'làm trầm trọng thêm, tối tệ đi': 'To worsen, exacerbate',
  'làm trầm trọng thêm': 'To worsen, exacerbate',
  'duy trì trạng thái không thay đổi': 'To maintain an unchanged state',
  'phân tích và giám sát chặt chẽ': 'To closely analyze and monitor',
  'làm suy giảm, suy yếu': 'To weaken, diminish',
  'làm tăng lên, thúc đẩy': 'To increase, stimulate',
  'ngăn chặn, kìm hãm': 'To prevent, hinder',
  'thay thế hoàn toàn': 'To completely replace',
  'tạo điều kiện thuận lợi': 'To facilitate, foster',
  'gây hại, nguy hiểm': 'To harm, endanger',
  'bảo vệ, gìn giữ': 'To protect, preserve'
};

/**
 * Returns localized text for Context Vocab option pills.
 * @param {Object|string} optionOrText - Option object or raw text
 * @param {boolean} isEn - English mode flag
 * @returns {string}
 */
export function getLocalizedVocabOption(optionOrText, isEn = false) {
  if (!optionOrText) return '';
  const rawText = typeof optionOrText === 'object'
    ? (isEn && optionOrText.textEn ? optionOrText.textEn : optionOrText.text)
    : optionOrText;
    
  if (!rawText || !isEn) return rawText || '';

  const clean = String(rawText).trim();
  const lower = clean.toLowerCase();

  if (KNOWN_OPTION_TRANSLATIONS[lower]) {
    return KNOWN_OPTION_TRANSLATIONS[lower];
  }

  // Regex rule matching
  if (/làm cải thiện|cải thiện|làm cho tốt/i.test(clean)) {
    return 'To improve, make better';
  }
  if (/trầm trọng|tồi tệ đi|tối tệ đi/i.test(clean)) {
    return 'To worsen, exacerbate';
  }
  if (/duy trì|không thay đổi|giữ nguyên/i.test(clean)) {
    return 'To maintain an unchanged state';
  }
  if (/phân tích|giám sát|theo dõi/i.test(clean)) {
    return 'To closely analyze and monitor';
  }
  if (/ngăn chặn|kìm hãm|cản trở/i.test(clean)) {
    return 'To prevent, hinder, impede';
  }
  if (/thúc đẩy|tăng trưởng|phát triển/i.test(clean)) {
    return 'To promote, stimulate growth';
  }
  if (/suy giảm|suy yếu|giảm bớt/i.test(clean)) {
    return 'To diminish, decline, weaken';
  }
  if (/thay thế|hoán đổi/i.test(clean)) {
    return 'To replace, substitute';
  }

  return clean;
}


