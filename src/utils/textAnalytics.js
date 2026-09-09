/**
 * Text Analytics Utilities for IELTS Writing
 * Calculates word counts, paragraph distribution, Lexical Diversity (TTR),
 * repetitive words, and Typing Speed (WPM).
 */

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if',
  'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
  'yourselves'
]);

export function countWords(text) {
  if (!text) return 0;
  const matches = text.trim().match(/\b[\w'-]+\b/g);
  return matches ? matches.length : 0;
}

export function analyzeParagraphs(text, taskNumber = 2) {
  if (!text || !text.trim()) return [];

  const rawParagraphs = text.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);

  return rawParagraphs.map((para, index) => {
    const words = countWords(para);
    let label = `Đoạn ${index + 1}`;
    let recommended = '80 - 100 từ';

    if (taskNumber === 2) {
      if (index === 0) {
        label = 'Mở bài (Introduction)';
        recommended = '35 - 50 từ';
      } else if (index === rawParagraphs.length - 1 && rawParagraphs.length >= 3) {
        label = 'Kết bài (Conclusion)';
        recommended = '30 - 45 từ';
      } else {
        label = `Thân bài ${index} (Body)`;
        recommended = '85 - 110 từ';
      }
    } else {
      // Task 1
      if (index === 0) {
        label = 'Mở bài (Intro)';
        recommended = '20 - 30 từ';
      } else if (index === 1) {
        label = 'Tổng quan (Overview)';
        recommended = '35 - 50 từ';
      } else {
        label = `Thân bài ${index - 1} (Body)`;
        recommended = '55 - 75 từ';
      }
    }

    return {
      index,
      label,
      words,
      recommended,
      content: para
    };
  });
}

/**
 * Calculates Lexical Diversity (Type-Token Ratio) and finds overused words
 */
export function analyzeLexicalDiversity(text) {
  if (!text || !text.trim()) {
    return { ttr: 0, uniqueCount: 0, totalCount: 0, overusedWords: [] };
  }

  const tokens = text
    .toLowerCase()
    .match(/\b[a-zA-Z]{3,}\b/g) || [];

  const totalCount = tokens.length;
  if (totalCount === 0) {
    return { ttr: 0, uniqueCount: 0, totalCount: 0, overusedWords: [] };
  }

  const wordFrequency = {};
  tokens.forEach(token => {
    wordFrequency[token] = (wordFrequency[token] || 0) + 1;
  });

  const uniqueWords = Object.keys(wordFrequency);
  const uniqueCount = uniqueWords.length;
  const ttr = Math.round((uniqueCount / totalCount) * 100);

  // Identify repetitive non-stop words appearing >= 4 times
  const overusedWords = Object.entries(wordFrequency)
    .filter(([word, count]) => count >= 4 && !STOP_WORDS.has(word))
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }));

  return {
    ttr, // e.g. 62%
    uniqueCount,
    totalCount,
    overusedWords
  };
}

/**
 * Calculates typing speed in WPM
 */
export function calculateWpm(wordCount, secondsElapsed) {
  if (!secondsElapsed || secondsElapsed < 10 || !wordCount) return 0;
  const minutes = secondsElapsed / 60;
  return Math.round(wordCount / minutes);
}
