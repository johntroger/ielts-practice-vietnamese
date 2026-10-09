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
  'pernicious influence': 'subtly destructive influence'
};

/**
 * Returns localized meaning for vocabulary item.
 * @param {Object} item - Vocabulary object with phrase, meaningVi, meaningEn
 * @param {boolean} isEn - Language mode
 * @returns {string}
 */
export function getLocalizedVocabMeaning(item, isEn = false) {
  if (!item) return '';
  if (!isEn) return item.meaningVi || item.meaning || '';
  if (item.meaningEn) return item.meaningEn;
  const phraseKey = (item.phrase || '').trim().toLowerCase();
  if (KNOWN_SEED_VOCAB_EN[phraseKey]) {
    return KNOWN_SEED_VOCAB_EN[phraseKey];
  }
  return item.meaningEn || item.meaning || item.meaningVi || '';
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
