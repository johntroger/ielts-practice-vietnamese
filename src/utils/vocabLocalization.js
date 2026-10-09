/**
 * vocabLocalization.js
 * Comprehensive bilingual localization utilities for IELTS Vocabulary Notebook & SM-2 Flashcards.
 */

export const KNOWN_SEED_VOCAB_EN = {
  'catalyze novel industries': 'spur / stimulate emerging industries into existence',
  'pivotal element': 'crucial / essential component',
  'mitigate adverse effects': 'reduce / lessen harmful impacts',
  'upward trajectory': 'steady rising trend',
  'precipitous drop': 'sharp / dramatic decrease',
  'vital role': 'vital / essential role',
  'paramount importance': 'utmost / highest importance',
  'indispensable asset': 'essential / indispensable asset',
  'alleviate financial burdens': 'ease economic difficulties',
  'tackle unemployment': 'decisively address unemployment',
  'conducive to': 'favorable / advantageous for',
  'detrimental consequence': 'harmful / adverse outcome',
  'pernicious influence': 'subtly destructive influence',
  // Reading Paraphrase Hunter pairs
  'sự sụt giảm mạnh': 'a sharp decline / dramatic plunge',
  'chi phí sản xuất': 'manufacturing / production expenses',
  'tấm pin năng lượng mặt trời': 'photovoltaic panels / solar modules',
  'thúc đẩy, đẩy nhanh tốc độ': 'to accelerate / precipitate',
  'sự áp dụng, tiếp nhận': 'adoption / uptake',
  'năng lượng sạch/bền vững': 'clean / sustainable electricity',
  'mất ngủ kéo dài/mãn tính': 'chronic insomnia / prolonged sleeplessness',
  'gây tác động tiêu cực nặng nề': 'to severely damage / exert a detrimental impact on',
  'sự củng cố, ổn định': 'consolidation / stabilization',
  'kỷ niệm/ký ức theo sự kiện bản thân': 'episodic / autobiographical memories',
  'học sinh lứa tuổi thiếu niên': 'adolescent students / teenage learners',
  'mực nước biển dâng cao/xâm lấn': 'rising sea levels / encroaching waters',
  'đe dọa, đặt vào vòng nguy hiểm': 'to threaten / jeopardize',
  'sự nguyên vẹn và khả năng vận hành': 'operational integrity',
  'hạ tầng giao thông trọng yếu': 'essential transit networks / critical infrastructure',
  'các thành phố ven biển': 'coastal metropolises / littoral cities'
};

/**
 * Returns localized meaning for vocabulary item.
 * @param {Object|string} item - Vocabulary object with phrase, meaningVi, meaningEn or raw meaning string
 * @param {boolean} isEn - Language mode
 * @returns {string}
 */
export function getLocalizedVocabMeaning(item, isEn = false) {
  if (!item) return '';
  const rawMeaning = typeof item === 'object' ? (item.meaningVi || item.meaning || '') : String(item);
  if (!isEn) return rawMeaning;
  if (typeof item === 'object' && item.meaningEn) return item.meaningEn;
  
  const rawKey = rawMeaning.trim().toLowerCase();
  if (KNOWN_SEED_VOCAB_EN[rawKey]) {
    return KNOWN_SEED_VOCAB_EN[rawKey];
  }
  const phraseKey = (typeof item === 'object' && item.phrase ? item.phrase : '').trim().toLowerCase();
  if (KNOWN_SEED_VOCAB_EN[phraseKey]) {
    return KNOWN_SEED_VOCAB_EN[phraseKey];
  }
  return typeof item === 'object' ? (item.meaningEn || item.meaning || item.meaningVi || '') : rawMeaning;
}

/**
 * Returns localized topic name.
 * @param {string|Object} topic - Topic ID or topic object
 * @param {boolean} isEn - Language mode
 * @returns {string}
 */
export function getLocalizedTopicName(topic, isEn = false) {
  if (!topic) return isEn ? 'All Topics' : 'Tất cả chủ đề';
  if (topic === 'all') return isEn ? 'All Topics' : 'Tất cả chủ đề';
  if (typeof topic === 'object') {
    return isEn ? (topic.name || topic.id) : (topic.vi || topic.name || topic.id);
  }
  return topic;
}
