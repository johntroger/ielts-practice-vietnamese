/**
 * Cambridge IELTS Grammatical Range & Accuracy (GRA) Sentence Analyzer
 * 
 * Classifies sentences into:
 * - Complex (Câu phức & Phức-Ghép): Subordinating conjunctions, relative clauses, conditionals, participial clauses, inversions.
 * - Compound (Câu ghép): Coordinating conjunctions (FANBOYS) joining independent clauses, semicolons.
 * - Simple (Câu đơn): Single independent clause.
 * 
 * Provides live GRA metrics, Band estimates, and Cambridge-aligned pedagogical recommendations.
 */

// Common abbreviations to avoid false sentence splits
const ABBREVIATIONS = [
  'e\\.g\\.', 'i\\.e\\.', 'etc\\.', 'vs\\.', 'approx\\.', 'dept\\.',
  'dr\\.', 'mr\\.', 'mrs\\.', 'ms\\.', 'prof\\.', 'sr\\.', 'jr\\.',
  'no\\.', 'fig\\.', 'vol\\.', 'al\\.', 'u\\.s\\.', 'u\\.k\\.'
];

// Complex Sentence Subordinating Markers (Regex patterns)
const SUBORDINATING_PATTERNS = [
  // Concession & Contrast
  /\b(although|even though|though|while|whereas|despite the fact that|in spite of the fact that|even if|much as)\b/i,
  // Cause & Reason
  /\b(because|since|as long as|inasmuch as|given that|seeing that|now that)\b/i,
  // Conditionals
  /\b(if|unless|provided that|providing that|so long as|in case|on condition that|supposing that)\b/i,
  // Time clauses
  /\b(whenever|wherever|as soon as|by the time|once|until|till)\b/i,
  // Purpose & Result
  /\b(in order that|so that|so\s+\w+\s+that|such\s+\w+\s+that)\b/i,
  // Relative clauses (which, who, whom, whose, whereby, wherein)
  /,\s*(which|who|whom|whose|whereby|wherein)\b/i,
  /\b(which|who|whom|whose|whereby|wherein)\s+(is|are|was|were|has|have|had|can|could|will|would|should|may|might|\w+s|\w+ed)\b/i,
  // Relative clause with 'that' after noun
  /\b(factor|reasons?|evidence|trend|phenomenon|measure|impact|solution|aspect|notion|belief|view|argument|finding|observation)\s+that\b/i,
  // Inversion & Advanced structures
  /\b(not only\s+.+\s+but (also)?|seldom\s+(do|does|did|can)|hardly\s+.+\s+when|no sooner\s+.+\s+than|under no circumstances|on no account)\b/i,
  /\b(were\s+(it|they|we)\s+not for|had\s+(it|they|we|he|she)\s+not|should\s+there\s+be)\b/i,
  // Participial clause / Reduced clause
  /^(having\s+\w+ed|being\s+\w+ed|compared with|given\s+the|based on|taking into (account|consideration)|considering\s+the)\b/i,
  /,\s*(thereby|thus|leading to|resulting in|contributing to)\s+\w+ing\b/i,
  // Cleft sentences
  /^it\s+(is|was)\s+.+\s+that\b/i,
  /^what\s+(is|was|matters)\s+.+\s+is\b/i
];

// Compound Sentence Coordinating Markers
const COORDINATING_PATTERNS = [
  // Semicolon connecting clauses
  /;\s*(however|therefore|furthermore|moreover|nevertheless|consequently|nonetheless|thus|in addition)?,?\s+[a-z]/i,
  // FANBOYS with comma followed by a clause subject (pronoun or noun phrase)
  /,\s*(and|but|or|nor|yet|so)\s+(it|they|this|these|that|those|we|he|she|i|the|a|an|many|some|both|such|governments?|individuals?|people)\b/i,
  // Correlative
  /\beither\s+.+\s+or\s+/i,
  /\bneither\s+.+\s+nor\s+/i
];

/**
 * Splits raw text into individual sentences, respecting abbreviations and decimal numbers.
 * @param {string} text - Raw input text
 * @returns {string[]} Array of cleaned sentence strings
 */
export function splitSentences(text) {
  if (!text || typeof text !== 'string') return [];

  let sanitized = text.trim();
  if (!sanitized) return [];

  // Protect decimals (e.g. 3.14, 15.5%)
  sanitized = sanitized.replace(/(\d+)\.(\d+)/g, '$1__DECIMAL__$2');

  // Protect common abbreviations
  ABBREVIATIONS.forEach(abbr => {
    const regex = new RegExp(`\\b${abbr}`, 'gi');
    sanitized = sanitized.replace(regex, (match) => match.replace(/\./g, '__DOT__'));
  });

  // Split on sentence boundaries: period, question mark, exclamation mark followed by space or end of string
  const rawSentences = sanitized.split(/(?<=[.?!])\s+(?=[A-Z0-9"']|$)/);

  return rawSentences
    .map(s => {
      let restored = s
        .replace(/__DECIMAL__/g, '.')
        .replace(/__DOT__/g, '.')
        .trim();
      return restored;
    })
    .filter(s => s.length > 0 && /\w/.test(s));
}

/**
 * Analyzes a single sentence to determine its syntactic classification.
 * @param {string} sentence - The sentence text
 * @returns {object} Classification details
 */
export function classifySentence(sentence) {
  if (!sentence || typeof sentence !== 'string') {
    return { type: 'simple', markers: [], explanation: 'Câu đơn giản.' };
  }

  const trimmed = sentence.trim();
  const matchedComplexMarkers = [];
  const matchedCompoundMarkers = [];

  // 1. Check Complex Patterns
  for (const pattern of SUBORDINATING_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      matchedComplexMarkers.push(match[0].toLowerCase());
    }
  }

  // 2. Check Compound Patterns
  for (const pattern of COORDINATING_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      matchedCompoundMarkers.push(match[0].toLowerCase());
    }
  }

  // Classification Decision
  if (matchedComplexMarkers.length > 0) {
    return {
      type: 'complex',
      markers: matchedComplexMarkers,
      isCompoundComplex: matchedCompoundMarkers.length > 0,
      explanation: `Câu phức chuẩn GRA chứa liên từ phụ thuộc / mệnh đề quan hệ: "${matchedComplexMarkers.slice(0, 2).join('", "')}".`
    };
  }

  if (matchedCompoundMarkers.length > 0) {
    return {
      type: 'compound',
      markers: matchedCompoundMarkers,
      isCompoundComplex: false,
      explanation: `Câu ghép liên kết hai mệnh đề độc lập bằng: "${matchedCompoundMarkers[0]}".`
    };
  }

  // Default: Simple Sentence
  return {
    type: 'simple',
    markers: [],
    isCompoundComplex: false,
    explanation: 'Câu đơn với một cụm chủ - vị độc lập.'
  };
}

/**
 * Performs full live Grammatical Range & Accuracy analysis across an entire essay.
 * @param {string} text - Essay text
 * @returns {object} Comprehensive GRA metrics and feedback
 */
export function analyzeSentenceStructures(text) {
  if (!text || !text.trim()) {
    return {
      totalSentences: 0,
      simpleCount: 0,
      compoundCount: 0,
      complexCount: 0,
      simplePercentage: 0,
      compoundPercentage: 0,
      complexPercentage: 0,
      graBandEstimate: 'N/A',
      status: 'neutral',
      feedbackMessage: 'Hãy bắt đầu viết bài để phân tích cấu trúc ngữ pháp thời gian thực.',
      sentences: []
    };
  }

  const rawSentences = splitSentences(text);
  const totalSentences = rawSentences.length;

  if (totalSentences === 0) {
    return {
      totalSentences: 0,
      simpleCount: 0,
      compoundCount: 0,
      complexCount: 0,
      simplePercentage: 0,
      compoundPercentage: 0,
      complexPercentage: 0,
      graBandEstimate: 'N/A',
      status: 'neutral',
      feedbackMessage: 'Chưa đủ câu hoàn chỉnh để phân tích ngữ pháp.',
      sentences: []
    };
  }

  let simpleCount = 0;
  let compoundCount = 0;
  let complexCount = 0;

  const sentences = rawSentences.map((sentence, idx) => {
    const classification = classifySentence(sentence);
    if (classification.type === 'complex') complexCount++;
    else if (classification.type === 'compound') compoundCount++;
    else simpleCount++;

    return {
      id: idx + 1,
      text: sentence,
      type: classification.type,
      markers: classification.markers,
      isCompoundComplex: classification.isCompoundComplex || false,
      explanation: classification.explanation,
      wordCount: sentence.trim().split(/\s+/).length
    };
  });

  const simplePercentage = Math.round((simpleCount / totalSentences) * 100);
  const compoundPercentage = Math.round((compoundCount / totalSentences) * 100);
  const complexPercentage = Math.round((complexCount / totalSentences) * 100);

  // Cambridge GRA Band & Status Determination
  let graBandEstimate = '6.0';
  let status = 'warning'; // 'optimal' | 'warning' | 'needs_improvement'
  let feedbackMessage = '';

  if (complexPercentage >= 50 && simplePercentage <= 35) {
    graBandEstimate = complexPercentage >= 65 ? '8.0+' : '7.0 - 7.5';
    status = 'optimal';
    feedbackMessage = `Xuất sắc! Tỷ lệ câu phức đạt ${complexPercentage}% (chuẩn Cambridge Band 7.0+ GRA: đa dạng cấu trúc phức hợp, ít lạm dụng câu đơn).`;
  } else if (complexPercentage >= 35 && simplePercentage <= 45) {
    graBandEstimate = '6.5';
    status = 'optimal';
    feedbackMessage = `Tốt! Bạn có sự kết hợp hài hòa giữa câu đơn (${simplePercentage}%), câu ghép (${compoundPercentage}%) và câu phức (${complexPercentage}%). Hãy nâng tỷ lệ câu phức lên > 50% để bứt phá Band 7.0+.`;
  } else if (simplePercentage > 45) {
    graBandEstimate = '5.0 - 5.5';
    status = 'needs_improvement';
    feedbackMessage = `Cảnh báo GRA: Tỷ lệ câu đơn chiếm tới ${simplePercentage}% (> 45%). Giám khảo Cambridge sẽ đánh giá phạm vi cấu trúc bị hạn chế (Limited Range). Hãy ghép câu hoặc dùng mệnh đề quan hệ (which/that/who) và liên từ nhượng bộ (Although/While) để nâng điểm!`;
  } else {
    graBandEstimate = '6.0';
    status = 'warning';
    feedbackMessage = `Đang ở mức trung bình (Band 6.0 GRA): Tỷ lệ câu phức đạt ${complexPercentage}%. Hãy bổ sung thêm câu điều kiện (If), câu đảo ngữ hoặc mệnh đề phân từ để gây ấn tượng mạnh hơn với giám khảo.`;
  }

  return {
    totalSentences,
    simpleCount,
    compoundCount,
    complexCount,
    simplePercentage,
    compoundPercentage,
    complexPercentage,
    graBandEstimate,
    status,
    feedbackMessage,
    sentences
  };
}
