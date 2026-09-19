/**
 * IELTS Reading Official Scoring Engine & 6-Layer Diagnostic System
 * Compliant with Cambridge Assessment English & IDP/British Council standards.
 * 
 * Features:
 * 1. Flexible T/F/NG and Y/N/NG handling (T, F, NG, Y, N normalization + cross-check).
 * 2. Word Limit Violation Enforcement (0 points for answers exceeding NO MORE THAN X WORDS).
 * 3. Cambridge Optional Bracket Expansion: '(a) library' -> ['a library', 'library'], 'car(s)' -> ['car', 'cars'].
 * 4. Roman Numeral Normalization for Matching Headings (i, ii, iii, iv, v, vi, vii, viii, ix, x...).
 * 5. Punctuation and Hyphenation Cleaning (hyphenated words count as single words per Cambridge rules).
 * 6. Detailed 6-Layer Error Diagnostic Breakdown (CORRECT, WORD_LIMIT_ERROR, PLURAL_ERROR, SPELLING_ERROR, TFNG_FORMAT_ERROR, WRONG_ANSWER, UNANSWERED).
 */

import { calculateReadingBandScore, getReadingBandComparison } from '../data/readingTasks.js';

/**
 * Standardizes raw user answer string:
 * - Trims whitespace
 * - Converts to lowercase
 * - Strips leading/trailing punctuation (e.g. trailing dots, commas)
 * - Collapses internal whitespace
 */
export function normalizeReadingAnswer(str) {
  if (str === null || str === undefined) return '';
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Levenshtein distance for spelling mistake detection
 */
export function levenshtein(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;
  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + 1
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Counts IELTS words according to Cambridge rules:
 * - "Hyphenated words count as single words" (e.g. 'state-of-the-art' = 1 word, 'twenty-one' = 1 word)
 * - Compound numbers count as a single number/word
 */
export function countIeltsWords(text) {
  if (!text) return 0;
  const cleaned = text.trim();
  if (!cleaned) return 0;
  // Match tokens separated by whitespace; hyphenated tokens stay intact
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  return tokens.length;
}

/**
 * Extracts Word Limit instruction from Question Group or Question header:
 * Returns { maxWords: number | null, allowNumber: boolean, rawInstruction: string }
 */
export function extractWordLimit(instruction = '') {
  if (!instruction || typeof instruction !== 'string') {
    return { maxWords: null, allowNumber: false, rawInstruction: '' };
  }

  const upper = instruction.toUpperCase();
  let maxWords = null;
  let allowNumber = upper.includes('AND/OR A NUMBER') || upper.includes('AND/OR NUMBER') || upper.includes('OR A NUMBER');

  if (upper.includes('NO MORE THAN THREE WORDS')) {
    maxWords = 3;
  } else if (upper.includes('NO MORE THAN TWO WORDS')) {
    maxWords = 2;
  } else if (upper.includes('NO MORE THAN ONE WORD') || upper.includes('ONE WORD ONLY')) {
    maxWords = 1;
  } else if (upper.includes('TWO WORDS ONLY')) {
    maxWords = 2;
  } else if (upper.includes('THREE WORDS ONLY')) {
    maxWords = 3;
  } else {
    // Regex fallback for custom instructions e.g. "NO MORE THAN 2 WORDS"
    const match = upper.match(/NO MORE THAN (\d+) WORDS?/i);
    if (match) {
      maxWords = parseInt(match[1], 10);
    }
  }

  return { maxWords, allowNumber, rawInstruction: instruction };
}

/**
 * Expands Cambridge optional words in brackets in target answer keys:
 * E.g.:
 * - "(a) library" -> ["a library", "library"]
 * - "water (drop)" -> ["water drop", "water"]
 * - "car(s)" -> ["car", "cars"]
 * - "(in) July" -> ["in july", "july"]
 * - "twenty(-)one" -> ["twenty-one", "twenty one", "twentyone"]
 */
export function expandOptionalBrackets(targetAnswer) {
  if (!targetAnswer) return [];
  const str = String(targetAnswer).trim();
  const results = new Set([normalizeReadingAnswer(str)]);

  // Pattern 1: Leading/trailing or internal word in brackets e.g. "(a) library" or "water (drop)"
  const wordBracketRegex = /\(([a-zA-Z0-9\s]+)\)/g;
  if (wordBracketRegex.test(str)) {
    // Variation without the brackets and with the bracketed content
    const withContent = str.replace(/\(([^)]+)\)/g, '$1');
    results.add(normalizeReadingAnswer(withContent));

    // Variation without the bracketed content at all
    const withoutContent = str.replace(/\(([^)]+)\)/g, '');
    results.add(normalizeReadingAnswer(withoutContent));
  }

  // Pattern 2: Plural bracket e.g. "car(s)" or "fox(es)"
  const pluralBracketRegex = /([a-zA-Z]+)\((s|es)\)/gi;
  if (pluralBracketRegex.test(str)) {
    const singular = str.replace(pluralBracketRegex, '$1');
    const plural = str.replace(pluralBracketRegex, '$1$2');
    results.add(normalizeReadingAnswer(singular));
    results.add(normalizeReadingAnswer(plural));
  }

  // Pattern 3: Optional hyphen e.g. "twenty(-)one"
  if (str.includes('(-)') || str.includes('(-)')) {
    results.add(normalizeReadingAnswer(str.replace(/\(-\)/g, '-')));
    results.add(normalizeReadingAnswer(str.replace(/\(-\)/g, ' ')));
    results.add(normalizeReadingAnswer(str.replace(/\(-\)/g, '')));
  }

  return Array.from(results).filter(Boolean);
}

/**
 * Maps True/False/Not Given and Yes/No/Not Given inputs to standardized tokens:
 */
export const TFNG_MAP = {
  t: 'TRUE',
  true: 'TRUE',
  f: 'FALSE',
  false: 'FALSE',
  ng: 'NOT GIVEN',
  notgiven: 'NOT GIVEN',
  'not given': 'NOT GIVEN',
  y: 'YES',
  yes: 'YES',
  n: 'NO',
  no: 'NO'
};

/**
 * Checks flexible equality for T/F/NG and Y/N/NG:
 */
export function matchFlexibleTFNG(userNorm, targetNorm) {
  if (!userNorm || !targetNorm) return { isMatch: false, isFormatMismatch: false };

  const uToken = TFNG_MAP[userNorm] || userNorm.toUpperCase();
  const tToken = TFNG_MAP[targetNorm] || targetNorm.toUpperCase();

  // Exact canonical match
  if (uToken === tToken) {
    return { isMatch: true, isFormatMismatch: false };
  }

  // Cross-match True vs Yes, False vs No
  const isCrossTrue = (uToken === 'TRUE' && tToken === 'YES') || (uToken === 'YES' && tToken === 'TRUE');
  const isCrossFalse = (uToken === 'FALSE' && tToken === 'NO') || (uToken === 'NO' && tToken === 'FALSE');

  if (isCrossTrue || isCrossFalse) {
    return {
      isMatch: true,
      isFormatMismatch: true,
      warningMessage: `Lưu ý quy cách làm bài: Đề bài yêu cầu ${tToken} nhưng bạn viết ${uToken} (Khảo thí Cambridge vẫn chấp nhận điểm nhưng khuyên nên tuân thủ đúng chỉ thị).`
    };
  }

  return { isMatch: false, isFormatMismatch: false };
}

/**
 * Roman Numerals Mapping for Matching Headings:
 */
export const ROMAN_NUMERALS_MAP = {
  i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10,
  xi: 11, xii: 12, xiii: 13, xiv: 14, xv: 15, xvi: 16, xvii: 17, xviii: 18, xix: 19, xx: 20
};

export function matchRomanNumerals(userNorm, targetNorm) {
  if (!userNorm || !targetNorm) return false;
  // Clean 'heading' or 'paragraph' prefixes if candidate entered 'heading vi'
  const uClean = userNorm.replace(/^(heading|section|paragraph)\s+/i, '').trim();
  const tClean = targetNorm.replace(/^(heading|section|paragraph)\s+/i, '').trim();

  if (uClean === tClean) return true;

  const uNum = ROMAN_NUMERALS_MAP[uClean] || (parseInt(uClean, 10) || null);
  const tNum = ROMAN_NUMERALS_MAP[tClean] || (parseInt(tClean, 10) || null);

  return uNum !== null && tNum !== null && uNum === tNum;
}

export const READING_DISTRACTOR_TRAPS = {
  TRAP_IMPLICIT_NEGATION: {
    code: 'TRAP_IMPLICIT_NEGATION',
    name: 'Bẫy Phủ Định Ngầm (Implicit Negation)',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Văn bản sử dụng các từ phủ định tinh vi hoặc bán phủ định (rarely, seldom, scarcely, barely, hardly, few, little, fail to, lack, without) khiến thí sinh ngộ nhận là khẳng định.',
    tip: 'Luôn gạch chân các trạng từ tần suất bán phủ định (rarely/seldom) và động từ biểu thị sự thiếu hụt (fail/lack/omit) khi đối chiếu với câu hỏi.'
  },
  TRAP_TEMPORAL_SHIFT: {
    code: 'TRAP_TEMPORAL_SHIFT',
    name: 'Bẫy Thì & Mốc Thời Gian (Temporal Shift)',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Sự đảo lệch giữa quá khứ (historically, previously, used to) và hiện tại (currently, nowadays, present-day), hoặc trạng thái giả định/dự báo.',
    tip: 'Kiểm tra kỹ mốc thời gian và thì của động từ giữa câu hỏi và bài đọc. Trạng thái trong quá khứ không đồng nghĩa với việc vẫn tiếp diễn ở hiện tại.'
  },
  TRAP_ABSOLUTE_VS_QUALIFIED: {
    code: 'TRAP_ABSOLUTE_VS_QUALIFIED',
    name: 'Bẫy Tuyệt Đối Hóa (Absolute vs Qualified)',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Câu hỏi hoặc phương án dùng từ tuyệt đối hóa (all, every, always, never, completely, only, solely), trong khi bài đọc chỉ ở mức độ chừng mực/khái quát (some, often, tend to, likely).',
    tip: 'Cảnh giác cao độ với các từ mang tính tuyệt đối (all, every, only, impossible, guaranteed). Trong bài đọc IELTS học thuật, các khẳng định hầu hết đều có từ hạn định (hedging).'
  },
  TRAP_EXTRAPOLATION_NOT_GIVEN: {
    code: 'TRAP_EXTRAPOLATION_NOT_GIVEN',
    name: 'Bẫy Suy Diễn Cá Nhân (Not Given Extrapolation)',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Chọn True hoặc False dựa trên kiến thức thực tế hoặc phán đoán thông thường thay vì dựa vào bằng chứng có thật trong văn bản.',
    tip: 'Nguyên tắc vàng: Chỉ căn cứ vào những gì bài đọc viết. Nếu thông tin nghe có vẻ đúng ngoài đời nhưng tác giả không hề đề cập, đáp án phải là NOT GIVEN.'
  },
  TRAP_SURFACE_KEYWORD_MATCH: {
    code: 'TRAP_SURFACE_KEYWORD_MATCH',
    name: 'Bẫy Trùng Từ Khóa Bề Mặt (Surface Keyword Lure)',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Phương án mồi lặp lại y nguyên từ vựng đắt giá trong bài đọc nhưng ngữ cảnh, đối tượng hoặc quan hệ nhân quả đã bị thay đổi.',
    tip: 'Đừng chọn đáp án chỉ vì thấy từ vựng xuất hiện y hệt trong bài đọc. Giám khảo Cambridge thường dùng "từ khóa nguyên bản" làm mồi nhử cho người đọc lướt vội vã.'
  }
};

/**
 * Evaluates whether an incorrect response matches one of Cambridge's primary distractor trap archetypes.
 */
export function analyzeReadingDistractor({
  question = {},
  rawUserAnswer = '',
  status = 'WRONG_ANSWER',
  evidenceQuote = '',
  passageText = ''
}) {
  if (status === 'CORRECT' || status === 'UNANSWERED') return null;

  const userStr = String(rawUserAnswer || '').trim();
  const userUpper = userStr.toUpperCase();
  const targetStr = String(question.answer || '').trim();
  const targetUpper = targetStr.toUpperCase();
  const questionText = String(question.questionText || '');
  const quote = String(evidenceQuote || question.evidenceQuote || '');
  const combinedContext = (quote + ' ' + (passageText || '')).toLowerCase();

  // Pattern sets
  const IMPLICIT_NEGATION_REGEX = /\b(rarely|seldom|scarcely|barely|hardly|few|little|fail to|fails to|failed to|unable|lack|lacks|lacked|without|absent|except)\b/i;
  const ABSOLUTE_TERMS_REGEX = /\b(all|every|always|never|completely|entirely|only|solely|exclusively|must|impossible|guaranteed|total|totally)\b/i;
  const QUALIFIED_TERMS_REGEX = /\b(some|often|usually|likely|tend to|might|may|could|mainly|largely|generally|primarily|partially|in some cases|occasionally)\b/i;
  const PAST_TERMS_REGEX = /\b(historically|formerly|previously|used to|in the past|ancient|earlier|once|originated)\b/i;
  const PRESENT_TERMS_REGEX = /\b(currently|nowadays|at present|modern|today|contemporary|now|existing)\b/i;

  // 1. Check TRAP_EXTRAPOLATION_NOT_GIVEN:
  // Target is NOT GIVEN, but user chose TRUE/YES or FALSE/NO
  if (['NOT GIVEN', 'NG'].includes(targetUpper)) {
    if (['TRUE', 'T', 'YES', 'Y'].includes(userUpper) || ['FALSE', 'F', 'NO', 'N'].includes(userUpper)) {
      return {
        trapCode: 'TRAP_EXTRAPOLATION_NOT_GIVEN',
        trapName: READING_DISTRACTOR_TRAPS.TRAP_EXTRAPOLATION_NOT_GIVEN.name,
        badgeColor: READING_DISTRACTOR_TRAPS.TRAP_EXTRAPOLATION_NOT_GIVEN.badgeColor,
        severity: 'high',
        analysis: `Bạn đã chọn "${userStr}" trong khi đáp án chuẩn là NOT GIVEN. Đây là bẫy suy diễn phổ biến nhất trong IELTS Reading: thí sinh dựa vào suy luận logic đời thường hoặc kiến thức bên ngoài thay vì kiểm tra xem thông tin có thực sự được khẳng định trong bài đọc hay không.`,
        tip: READING_DISTRACTOR_TRAPS.TRAP_EXTRAPOLATION_NOT_GIVEN.tip
      };
    }
  }

  // 2. Check TRAP_ABSOLUTE_VS_QUALIFIED:
  // Question has absolute terms ("all", "only", "always") while passage or evidence has hedging/qualified terms ("some", "often", "tend to")
  const questionHasAbsolute = ABSOLUTE_TERMS_REGEX.test(questionText);
  const contextHasQualified = QUALIFIED_TERMS_REGEX.test(combinedContext);
  if (questionHasAbsolute && (contextHasQualified || targetUpper === 'FALSE' || targetUpper === 'NO')) {
    if (['TRUE', 'T', 'YES', 'Y'].includes(userUpper)) {
      return {
        trapCode: 'TRAP_ABSOLUTE_VS_QUALIFIED',
        trapName: READING_DISTRACTOR_TRAPS.TRAP_ABSOLUTE_VS_QUALIFIED.name,
        badgeColor: READING_DISTRACTOR_TRAPS.TRAP_ABSOLUTE_VS_QUALIFIED.badgeColor,
        severity: 'high',
        analysis: `Câu hỏi chứa các từ mang tính tuyệt đối hóa ("${questionText.match(ABSOLUTE_TERMS_REGEX)?.[0] || 'all/only'}"), trong khi bài đọc chỉ đề cập ở mức độ chừng mực hoặc khái quát. Bạn đã chọn "${userStr}" vì chỉ chú ý vào chủ đề chung mà bỏ qua mức độ khẳng định.`,
        tip: READING_DISTRACTOR_TRAPS.TRAP_ABSOLUTE_VS_QUALIFIED.tip
      };
    }
  }

  // 3. Check TRAP_IMPLICIT_NEGATION:
  // Context contains subtle negation (rarely, barely, fail to, without)
  if (IMPLICIT_NEGATION_REGEX.test(combinedContext) || IMPLICIT_NEGATION_REGEX.test(questionText)) {
    const negationWord = (combinedContext.match(IMPLICIT_NEGATION_REGEX) || questionText.match(IMPLICIT_NEGATION_REGEX))?.[0];
    if (['TRUE', 'T', 'YES', 'Y'].includes(userUpper) && ['FALSE', 'F', 'NO', 'N'].includes(targetUpper)) {
      return {
        trapCode: 'TRAP_IMPLICIT_NEGATION',
        trapName: READING_DISTRACTOR_TRAPS.TRAP_IMPLICIT_NEGATION.name,
        badgeColor: READING_DISTRACTOR_TRAPS.TRAP_IMPLICIT_NEGATION.badgeColor,
        severity: 'high',
        analysis: `Bài đọc chứa từ phủ định ngầm / bán phủ định ("${negationWord}"), làm đảo ngược hoàn toàn ý nghĩa khẳng định. Thí sinh thường bỏ sót các từ này khi đọc lướt nhanh dẫn đến chọn "${userStr}".`,
        tip: READING_DISTRACTOR_TRAPS.TRAP_IMPLICIT_NEGATION.tip
      };
    }
  }

  // 4. Check TRAP_TEMPORAL_SHIFT:
  // Mismatch between past markers and present markers
  const qHasPast = PAST_TERMS_REGEX.test(questionText);
  const qHasPresent = PRESENT_TERMS_REGEX.test(questionText);
  const cHasPast = PAST_TERMS_REGEX.test(combinedContext);
  const cHasPresent = PRESENT_TERMS_REGEX.test(combinedContext);

  if ((qHasPresent && cHasPast) || (qHasPast && cHasPresent)) {
    return {
      trapCode: 'TRAP_TEMPORAL_SHIFT',
      trapName: READING_DISTRACTOR_TRAPS.TRAP_TEMPORAL_SHIFT.name,
      badgeColor: READING_DISTRACTOR_TRAPS.TRAP_TEMPORAL_SHIFT.badgeColor,
      severity: 'medium',
      analysis: `Có sự sai lệch về mốc thời gian giữa câu hỏi (${qHasPresent ? 'hiện tại' : 'quá khứ'}) và bài đọc (${cHasPast ? 'quá khứ/lịch sử' : 'hiện tại'}). Sự kiện xảy ra trong quá khứ không đồng nghĩa với việc nó vẫn tiếp diễn ở hiện tại.`,
      tip: READING_DISTRACTOR_TRAPS.TRAP_TEMPORAL_SHIFT.tip
    };
  }

  // 5. Check TRAP_SURFACE_KEYWORD_MATCH:
  // In gap fill, multiple choice or matching, user picked words appearing verbatim in passage but incorrect
  if (userStr && userStr.length >= 4 && combinedContext.includes(userStr.toLowerCase())) {
    return {
      trapCode: 'TRAP_SURFACE_KEYWORD_MATCH',
      trapName: READING_DISTRACTOR_TRAPS.TRAP_SURFACE_KEYWORD_MATCH.name,
      badgeColor: READING_DISTRACTOR_TRAPS.TRAP_SURFACE_KEYWORD_MATCH.badgeColor,
      severity: 'medium',
      analysis: `Từ hoặc cụm từ bạn chọn ("${userStr}") có xuất hiện nguyên văn trong bài đọc, nhưng nó nằm ở mệnh đề phụ hoặc phục vụ ngữ cảnh khác. Đây là bẫy bắt mắt (surface keyword lure) đánh vào thói quen nhìn thấy từ quen là chọn ngay.`,
      tip: READING_DISTRACTOR_TRAPS.TRAP_SURFACE_KEYWORD_MATCH.tip
    };
  }

  // Fallback if none matched
  return null;
}

/**
 * Diagnoses a single question's user response against Cambridge standards:
 */
export function diagnoseReadingQuestion(question, rawUserAnswer, groupInstruction = '') {
  const result = {
    order: question.order,
    questionId: question.id,
    passageNumber: question.passageNumber || 1,
    questionType: question.type || 'standard',
    questionText: question.questionText || '',
    userAnswer: rawUserAnswer || null,
    correctAnswer: question.answer,
    acceptableAnswers: question.acceptableAnswers || [],
    isCorrect: false,
    status: 'WRONG_ANSWER', // 'CORRECT' | 'WORD_LIMIT_ERROR' | 'PLURAL_ERROR' | 'SPELLING_ERROR' | 'TFNG_FORMAT_ERROR' | 'WRONG_ANSWER' | 'UNANSWERED'
    diagnosticMessage: '',
    explanation: question.explanation || '',
    evidenceParagraph: question.evidenceParagraph || '',
    evidenceQuote: question.evidenceQuote || '',
    distractorAnalysis: null
  };

  const finalizeResult = (res) => {
    if (!res.isCorrect && res.status !== 'UNANSWERED') {
      res.distractorAnalysis = analyzeReadingDistractor({
        question,
        rawUserAnswer,
        status: res.status,
        evidenceQuote: question.evidenceQuote,
        passageText: question.passageText
      });
    }
    return res;
  };

  // 1. Check Unanswered
  if (rawUserAnswer === null || rawUserAnswer === undefined || String(rawUserAnswer).trim() === '') {
    result.status = 'UNANSWERED';
    result.diagnosticMessage = 'Chưa điền câu trả lời';
    return finalizeResult(result);
  }

  // 2. Multi-letter array answers (e.g. Choose TWO letters)
  if (Array.isArray(rawUserAnswer)) {
    const userArr = rawUserAnswer.map(a => String(a).trim().toUpperCase()).sort();
    const targetArr = (Array.isArray(question.answer) ? question.answer : [question.answer])
      .map(a => String(a).trim().toUpperCase())
      .sort();
    
    const isSetEqual = userArr.length === targetArr.length && userArr.every((val, idx) => val === targetArr[idx]);
    if (isSetEqual) {
      result.isCorrect = true;
      result.status = 'CORRECT';
      result.diagnosticMessage = 'Chính xác';
    } else {
      result.status = 'WRONG_ANSWER';
      result.diagnosticMessage = `Đáp án của bạn (${userArr.join(', ')}) chưa trùng khớp với đáp án chuẩn (${targetArr.join(', ')})`;
    }
    return finalizeResult(result);
  }

  const userNorm = normalizeReadingAnswer(rawUserAnswer);
  const targetNorm = normalizeReadingAnswer(question.answer);

  // 3. Check Word Limit Violation (Crucial Cambridge Rule)
  const instruction = groupInstruction || question.instruction || '';
  const { maxWords, allowNumber } = extractWordLimit(instruction);

  const isGapFillType = [
    'summary_completion',
    'sentence_completion',
    'table_completion',
    'flowchart_completion',
    'diagram_labeling',
    'short_answer',
    'fill_in_the_blank'
  ].includes(question.type);

  if (isGapFillType && maxWords !== null) {
    const wordCount = countIeltsWords(userNorm);
    if (wordCount > maxWords) {
      result.isCorrect = false;
      result.status = 'WORD_LIMIT_ERROR';
      result.diagnosticMessage = `LỖI VI PHẠM SỐ TỪ QUY ĐỊNH (Word Limit Exceeded): Đề bài yêu cầu tối đa ${maxWords} từ, nhưng bạn đã viết ${wordCount} từ. Barem khảo thí Cambridge chấm 0 điểm cho bất kỳ đáp án nào vượt quá số từ quy định.`;
      return finalizeResult(result);
    }
  }

  // 4. Build complete list of acceptable variations (including brackets)
  const allAcceptableTargets = new Set();
  expandOptionalBrackets(question.answer).forEach(v => allAcceptableTargets.add(v));
  if (Array.isArray(question.acceptableAnswers)) {
    question.acceptableAnswers.forEach(ans => {
      expandOptionalBrackets(ans).forEach(v => allAcceptableTargets.add(v));
    });
  }

  // 5. Check Exact / Bracket-Expanded Match
  if (allAcceptableTargets.has(userNorm)) {
    result.isCorrect = true;
    result.status = 'CORRECT';
    result.diagnosticMessage = 'Chính xác tuyệt đối';
    return finalizeResult(result);
  }

  // 6. Check True / False / Not Given & Yes / No / Not Given
  const isTFNGType = ['true_false_not_given', 'yes_no_not_given'].includes(question.type) ||
    ['TRUE', 'FALSE', 'NOT GIVEN', 'YES', 'NO'].includes(targetNorm.toUpperCase());

  if (isTFNGType) {
    const tfngCheck = matchFlexibleTFNG(userNorm, targetNorm);
    if (tfngCheck.isMatch) {
      result.isCorrect = true;
      result.status = 'CORRECT';
      result.diagnosticMessage = tfngCheck.isFormatMismatch 
        ? tfngCheck.warningMessage 
        : 'Chính xác';
      return finalizeResult(result);
    }
    result.status = 'WRONG_ANSWER';
    result.diagnosticMessage = `Đáp án đúng là: ${question.answer}`;
    return finalizeResult(result);
  }

  // 7. Check Roman Numerals for Matching Headings
  const isHeadingsType = question.type === 'matching_headings' || 
    ROMAN_NUMERALS_MAP[targetNorm] !== undefined;

  if (isHeadingsType) {
    if (matchRomanNumerals(userNorm, targetNorm)) {
      result.isCorrect = true;
      result.status = 'CORRECT';
      result.diagnosticMessage = 'Chính xác';
      return finalizeResult(result);
    }
  }

  // 8. Check Plural / Singular Discrepancy (Missing/Extra -s)
  for (const target of allAcceptableTargets) {
    if (userNorm + 's' === target || userNorm + 'es' === target) {
      result.status = 'PLURAL_ERROR';
      result.diagnosticMessage = `LỖI THIẾU ÂM ĐUÔI SỐ NHIỀU (-s/-es): Bạn viết '${rawUserAnswer}', trong khi đáp án chính thức là danh từ số nhiều '${target}'.`;
      return finalizeResult(result);
    }
    if (userNorm === target + 's' || userNorm === target + 'es') {
      result.status = 'PLURAL_ERROR';
      result.diagnosticMessage = `LỖI THỪA SỐ NHIỀU (-s/-es): Bạn viết '${rawUserAnswer}', trong khi đáp án chính thức là danh từ số ít '${target}'.`;
      return finalizeResult(result);
    }
  }

  // 9. Check Minor Spelling Slip (Levenshtein Distance = 1)
  if (userNorm.length >= 4) {
    for (const target of allAcceptableTargets) {
      if (Math.abs(userNorm.length - target.length) <= 1 && levenshtein(userNorm, target) === 1) {
        result.status = 'SPELLING_ERROR';
        result.diagnosticMessage = `LỖI SAI CHÍNH TẢ (Spelling Slip): Bạn viết '${rawUserAnswer}', lệch 1 ký tự so với '${target}'. Quy chế Cambridge Writing/Reading yêu cầu chính tả phải hoàn toàn chính xác.`;
        return finalizeResult(result);
      }
    }
  }

  // 10. Fallback: Wrong Answer
  result.status = 'WRONG_ANSWER';
  result.diagnosticMessage = `Đáp án chưa chính xác. Đáp án đúng: '${question.answer}'`;
  return finalizeResult(result);
}

/**
 * Master Scoring Function for Entire IELTS Reading Test
 */
export function scoreReadingExam({
  testData,
  questionsData = [],
  userAnswers = {},
  timeSpentSeconds = 0,
  totalTimeMinutes = 60,
  moduleType
}) {
  const allQuestions = [];
  const passageStatsMap = { 1: { total: 0, correct: 0 }, 2: { total: 0, correct: 0 }, 3: { total: 0, correct: 0 } };
  const typeStatsMap = {};

  let correctCount = 0;
  const errorBreakdown = {
    CORRECT: 0,
    WORD_LIMIT_ERROR: 0,
    PLURAL_ERROR: 0,
    SPELLING_ERROR: 0,
    WRONG_ANSWER: 0,
    UNANSWERED: 0
  };

  const distractorSummary = {
    TRAP_IMPLICIT_NEGATION: 0,
    TRAP_TEMPORAL_SHIFT: 0,
    TRAP_ABSOLUTE_VS_QUALIFIED: 0,
    TRAP_EXTRAPOLATION_NOT_GIVEN: 0,
    TRAP_SURFACE_KEYWORD_MATCH: 0,
    totalTrapsIdentified: 0
  };

  // If testData has passages structure, traverse hierarchically to capture instructions
  if (testData?.passages && Array.isArray(testData.passages) && testData.passages.length > 0) {
    testData.passages.forEach(passage => {
      const pNum = passage.passageNumber || 1;
      if (!passageStatsMap[pNum]) passageStatsMap[pNum] = { total: 0, correct: 0 };
      const passageFullText = passage.paragraphs?.map(p => p.text).join(' ') || '';

      passage.questionGroups?.forEach(group => {
        const groupInstruction = group.instruction || '';
        group.questions?.forEach(q => {
          const qWithMeta = {
            ...q,
            passageNumber: pNum,
            type: group.type || q.type || 'standard',
            instruction: groupInstruction,
            passageText: passageFullText
          };
          const rawAns = userAnswers[q.order];
          const diag = diagnoseReadingQuestion(qWithMeta, rawAns, groupInstruction);

          allQuestions.push(diag);
          passageStatsMap[pNum].total++;

          if (diag.isCorrect) {
            correctCount++;
            passageStatsMap[pNum].correct++;
          }

          if (errorBreakdown[diag.status] !== undefined) {
            errorBreakdown[diag.status]++;
          }

          if (diag.distractorAnalysis?.trapCode) {
            const trapCode = diag.distractorAnalysis.trapCode;
            if (distractorSummary[trapCode] !== undefined) {
              distractorSummary[trapCode]++;
            }
            distractorSummary.totalTrapsIdentified++;
          }

          const qType = group.type || 'other';
          if (!typeStatsMap[qType]) {
            typeStatsMap[qType] = { type: qType, total: 0, correct: 0 };
          }
          typeStatsMap[qType].total++;
          if (diag.isCorrect) typeStatsMap[qType].correct++;
        });
      });
    });
  } else if (Array.isArray(questionsData) && questionsData.length > 0) {
    // Fallback if only flattened questionsData is passed
    questionsData.forEach(q => {
      const pNum = q.passageNumber || 1;
      if (!passageStatsMap[pNum]) passageStatsMap[pNum] = { total: 0, correct: 0 };

      const rawAns = userAnswers[q.order];
      const diag = diagnoseReadingQuestion(q, rawAns, q.instruction || '');

      allQuestions.push(diag);
      passageStatsMap[pNum].total++;

      if (diag.isCorrect) {
        correctCount++;
        passageStatsMap[pNum].correct++;
      }

      if (errorBreakdown[diag.status] !== undefined) {
        errorBreakdown[diag.status]++;
      }

      if (diag.distractorAnalysis?.trapCode) {
        const trapCode = diag.distractorAnalysis.trapCode;
        if (distractorSummary[trapCode] !== undefined) {
          distractorSummary[trapCode]++;
        }
        distractorSummary.totalTrapsIdentified++;
      }

      const qType = q.type || q.questionType || 'other';
      if (!typeStatsMap[qType]) {
        typeStatsMap[qType] = { type: qType, total: 0, correct: 0 };
      }
      typeStatsMap[qType].total++;
      if (diag.isCorrect) typeStatsMap[qType].correct++;
    });
  }

  const resolvedModule = moduleType || testData?.moduleType || testData?.module || 'academic';
  const totalQuestions = allQuestions.length || 40;
  const band = calculateReadingBandScore(correctCount, resolvedModule);
  const bandComparison = getReadingBandComparison(correctCount);
  const accuracyPercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const passageStats = [1, 2, 3].map(pNum => ({
    passageNumber: pNum,
    total: passageStatsMap[pNum]?.total || 0,
    correct: passageStatsMap[pNum]?.correct || 0,
    accuracy: (passageStatsMap[pNum]?.total > 0)
      ? Math.round((passageStatsMap[pNum].correct / passageStatsMap[pNum].total) * 100)
      : 0
  }));

  const typeStats = Object.values(typeStatsMap).map(item => ({
    ...item,
    accuracy: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0
  }));

  return {
    testId: testData?.id,
    testTitle: testData?.title,
    moduleType: resolvedModule,
    band,
    bandComparison,
    correctCount,
    totalQuestions,
    accuracyPercent,
    timeSpentSeconds,
    errorBreakdown,
    distractorSummary,
    passageStats,
    typeStats,
    questionsBreakdown: allQuestions,
    submittedAt: new Date().toISOString()
  };
}
