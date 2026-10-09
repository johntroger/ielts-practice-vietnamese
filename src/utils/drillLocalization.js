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
