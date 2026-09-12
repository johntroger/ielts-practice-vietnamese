/**
 * IELTS Listening Official Scoring Engine & 4-Layer Diagnostic System
 * Compliant with Cambridge Assessment English standards.
 */
import { calculateListeningBandScore } from '../data/listeningTasks';

/**
 * Standardize text for scoring: lowercase, strip extra whitespace and common punctuation
 */
export function normalizeAnswer(str) {
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
function levenshtein(a, b) {
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
 * Detect plural/singular discrepancy
 */
function checkPluralDiscrepancy(userNorm, targetNorm) {
  if (!userNorm || !targetNorm) return false;
  if (userNorm + 's' === targetNorm || userNorm + 'es' === targetNorm) return 'missing_s';
  if (userNorm === targetNorm + 's' || userNorm === targetNorm + 'es') return 'extra_s';
  return false;
}

/**
 * Check if the user inadvertently repeated words from the prefix/suffix prompt text (Stem Repetition Trap)
 */
function checkStemRepetition(userNorm, targetNorm, prefixText = '', suffixText = '') {
  if (!userNorm || !targetNorm) return false;
  const pNorm = normalizeAnswer(prefixText);
  const sNorm = normalizeAnswer(suffixText);
  
  if (pNorm) {
    const pWords = pNorm.split(' ');
    const lastPWord = pWords[pWords.length - 1];
    if (lastPWord && userNorm.startsWith(lastPWord + ' ')) {
      return { type: 'prefix_repeated', word: lastPWord };
    }
  }
  if (sNorm) {
    const sWords = sNorm.split(' ');
    const firstSWord = sWords[0];
    if (firstSWord && userNorm.endsWith(' ' + firstSWord)) {
      return { type: 'suffix_repeated', word: firstSWord };
    }
  }
  return false;
}

/**
 * Detailed diagnostic per question
 */

/**
 * Month mappings for flexible date normalization
 */
const MONTH_MAP = {
  jan: 'january', 'jan.': 'january', january: 'january',
  feb: 'february', 'feb.': 'february', february: 'february',
  mar: 'march', 'mar.': 'march', march: 'march',
  apr: 'april', 'apr.': 'april', april: 'april',
  may: 'may',
  jun: 'june', 'jun.': 'june', june: 'june',
  jul: 'july', 'jul.': 'july', july: 'july',
  aug: 'august', 'aug.': 'august', august: 'august',
  sep: 'september', sept: 'september', 'sept.': 'september', september: 'september',
  oct: 'october', 'oct.': 'october', october: 'october',
  nov: 'november', 'nov.': 'november', november: 'november',
  dec: 'december', 'dec.': 'december', december: 'december'
};

const NUMBER_WORDS_MAP = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5',
  six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
  eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15',
  sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20',
  thirty: '30', forty: '40', fifty: '50', sixty: '60', seventy: '70',
  eighty: '80', ninety: '90', hundred: '100', thousand: '1000'
};

/**
 * Flexible Semantic Canonicalizer
 * Standardizes currencies, dates, times, and numbers to prevent unfair penalties
 */
export function canonicalizeIELTSAnswer(str) {
  if (!str) return '';
  let s = str.toString().trim().toLowerCase();

  // 1. Remove outer non-alphanumerics except currency symbols
  s = s.replace(/^[^a-z0-9£$€]+|[^a-z0-9£$€]+$/gi, '').trim();

  // 2. Normalize Currency (£, $, €, pounds, dollars)
  // £35, 35 pounds, 35 gbp -> 35 pounds
  s = s.replace(/£\s*(\d+(?:[.,]\d+)?)/g, '$1 pounds');
  s = s.replace(/(\d+(?:[.,]\d+)?)\s*(?:gbp|pound|pounds)/g, '$1 pounds');
  s = s.replace(/\$\s*(\d+(?:[.,]\d+)?)/g, '$1 dollars');
  s = s.replace(/(\d+(?:[.,]\d+)?)\s*(?:usd|dollar|dollars)/g, '$1 dollars');
  s = s.replace(/€\s*(\d+(?:[.,]\d+)?)/g, '$1 euros');
  s = s.replace(/(\d+(?:[.,]\d+)?)\s*(?:eur|euro|euros)/g, '$1 euros');

  // 3. Normalize Date Formats: 30th May, 30 May, May 30, May 30th -> 30 may
  // Match "30th May" or "30 May"
  const datePattern1 = /^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)$/i;
  const match1 = s.match(datePattern1);
  if (match1 && MONTH_MAP[match1[2].toLowerCase()]) {
    return `${parseInt(match1[1], 10)} ${MONTH_MAP[match1[2].toLowerCase()]}`;
  }
  // Match "May 30th" or "May 30"
  const datePattern2 = /^([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?$/i;
  const match2 = s.match(datePattern2);
  if (match2 && MONTH_MAP[match2[1].toLowerCase()]) {
    return `${parseInt(match2[2], 10)} ${MONTH_MAP[match2[1].toLowerCase()]}`;
  }

  // 4. Normalize Time: 9:30 am, 9.30 a.m., 09:30 -> 9:30 am
  s = s.replace(/(\d{1,2})[.:](\d{2})\s*(?:am|a\.m\.)/gi, '$1:$2 am');
  s = s.replace(/(\d{1,2})[.:](\d{2})\s*(?:pm|p\.m\.)/gi, '$1:$2 pm');

  // 5. Replace simple number words if single word (e.g. "two" -> "2")
  if (NUMBER_WORDS_MAP[s]) {
    s = NUMBER_WORDS_MAP[s];
  }

  // Final cleanup of extra whitespace
  return s.replace(/\s+/g, ' ').trim();
}

export function diagnoseQuestionAnswer(question, rawUserAnswer) {
  const userNorm = normalizeAnswer(rawUserAnswer);
  const targetNorm = normalizeAnswer(question.answer);
  const acceptableList = (question.acceptableAnswers || [question.answer]).map(normalizeAnswer);

  // 1. Unanswered check
  if (!userNorm) {
    return {
      order: question.order,
      questionId: question.id,
      userAnswer: '',
      correctAnswer: question.answer,
      acceptableAnswers: question.acceptableAnswers || [question.answer],
      isCorrect: false,
      status: 'UNANSWERED',
      badgeLabel: 'Chưa làm',
      badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
      diagnosticMessage: 'Bạn đã bỏ trống câu hỏi này.',
      evidenceQuote: question.evidenceQuote || '',
      evidenceTimestamp: question.evidenceTimestamp,
      explanation: question.explanation || ''
    };
  }

  // 2. Exact or Acceptable Match (CORRECT)
  const userCanon = canonicalizeIELTSAnswer(rawUserAnswer);
  const targetCanon = canonicalizeIELTSAnswer(question.answer);
  const acceptableCanonList = (question.acceptableAnswers || [question.answer]).map(canonicalizeIELTSAnswer);

  if (
    userNorm === targetNorm || 
    acceptableList.includes(userNorm) ||
    (userCanon && (userCanon === targetCanon || acceptableCanonList.includes(userCanon)))
  ) {
    return {
      order: question.order,
      questionId: question.id,
      userAnswer: rawUserAnswer,
      correctAnswer: question.answer,
      acceptableAnswers: question.acceptableAnswers || [question.answer],
      isCorrect: true,
      status: 'CORRECT',
      badgeLabel: 'Đúng',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      diagnosticMessage: 'Chúc mừng! Đáp án chuẩn xác tuyệt đối (hỗ trợ quy đổi định dạng chuẩn).',
      evidenceQuote: question.evidenceQuote || '',
      evidenceTimestamp: question.evidenceTimestamp,
      explanation: question.explanation || ''
    };
  }

  // 3. Plural / Singular Error (-s / -es) check across targetNorm & acceptableList
  let pluralCheck = checkPluralDiscrepancy(userNorm, targetNorm);
  let matchedTarget = question.answer;
  if (!pluralCheck && acceptableList.length > 0) {
    for (const acc of acceptableList) {
      const p = checkPluralDiscrepancy(userNorm, acc);
      if (p) {
        pluralCheck = p;
        matchedTarget = acc;
        break;
      }
    }
  }

  if (pluralCheck) {
    const isMissing = pluralCheck === 'missing_s';
    return {
      order: question.order,
      questionId: question.id,
      userAnswer: rawUserAnswer,
      correctAnswer: question.answer,
      acceptableAnswers: question.acceptableAnswers || [question.answer],
      isCorrect: false,
      status: 'PLURAL_ERROR',
      badgeLabel: isMissing ? 'Thiếu đuôi -s' : 'Thừa đuôi -s',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      diagnosticMessage: isMissing
        ? ("⚠️ Lỗi âm đuôi: Bạn viết \"" + rawUserAnswer + "\" nhưng đáp án yêu cầu số nhiều \"" + matchedTarget + "\".")
        : ("⚠️ Lỗi âm đuôi: Bạn viết \"" + rawUserAnswer + "\" nhưng đáp án yêu cầu số ít \"" + matchedTarget + "\". "),
      evidenceQuote: question.evidenceQuote || '',
      evidenceTimestamp: question.evidenceTimestamp,
      explanation: question.explanation || ''
    };
  }

  // 4. Stem Repetition Trap Check
  const stemTrap = checkStemRepetition(userNorm, targetNorm, question.prefixText, question.suffixText);
  if (stemTrap) {
    return {
      order: question.order,
      questionId: question.id,
      userAnswer: rawUserAnswer,
      correctAnswer: question.answer,
      acceptableAnswers: question.acceptableAnswers || [question.answer],
      isCorrect: false,
      status: 'STEM_REPETITION_ERROR',
      badgeLabel: 'Bẫy lặp từ đề',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      diagnosticMessage: "⚠️ Bẫy lặp từ đề bài: Từ \"" + stemTrap.word + "\" đã có sẵn trong câu hỏi trước ô trống, không cần gõ lại.",
      evidenceQuote: question.evidenceQuote || '',
      evidenceTimestamp: question.evidenceTimestamp,
      explanation: question.explanation || ''
    };
  }

  // 5. Spelling Mistake Check (Levenshtein distance <= 2 for words >= 4 chars)
  let bestDist = levenshtein(userNorm, targetNorm);
  let bestTarget = question.answer;
  if (acceptableList.length > 0) {
    for (const acc of acceptableList) {
      const d = levenshtein(userNorm, acc);
      if (d < bestDist) {
        bestDist = d;
        bestTarget = acc;
      }
    }
  }

  if (bestDist <= 2 && bestTarget.length >= 4 && userNorm.length >= 3) {
    return {
      order: question.order,
      questionId: question.id,
      userAnswer: rawUserAnswer,
      correctAnswer: question.answer,
      acceptableAnswers: question.acceptableAnswers || [question.answer],
      isCorrect: false,
      status: 'SPELLING_ERROR',
      badgeLabel: 'Sai chính tả',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      diagnosticMessage: "⚠️ Lỗi chính tả: Bạn viết \"" + rawUserAnswer + "\" (lệch " + bestDist + " ký tự so với \"" + bestTarget + "\").",
      evidenceQuote: question.evidenceQuote || '',
      evidenceTimestamp: question.evidenceTimestamp,
      explanation: question.explanation || ''
    };
  }

  // 6. Completely Wrong / Distractor Trap
  return {
    order: question.order,
    questionId: question.id,
    userAnswer: rawUserAnswer,
    correctAnswer: question.answer,
    acceptableAnswers: question.acceptableAnswers || [question.answer],
    isCorrect: false,
    status: 'WRONG_ANSWER',
    badgeLabel: 'Sai',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    diagnosticMessage: "Đáp án đúng là \"" + question.answer + "\". Hãy chú ý các thông tin tự sửa (self-correction) của người nói.",
    evidenceQuote: question.evidenceQuote || '',
    evidenceTimestamp: question.evidenceTimestamp,
    explanation: question.explanation || ''
  };
}

/**
 * Comprehensive Score & Diagnostic Evaluation for full 40 questions
 */
export function scoreListeningExam({
  testData,
  userAnswers = {},
  timeSpentSeconds = 0
}) {
  const allParts = testData?.parts || [];
  const allQuestions = [];
  const partStats = [];
  const typeStatsMap = {};

  let correctCount = 0;
  let errorBreakdown = {
    CORRECT: 0,
    PLURAL_ERROR: 0,
    STEM_REPETITION_ERROR: 0,
    SPELLING_ERROR: 0,
    WRONG_ANSWER: 0,
    UNANSWERED: 0
  };

  allParts.forEach(part => {
    let partCorrect = 0;
    let partTotal = 0;

    part.questionGroups?.forEach(group => {
      group.questions?.forEach(q => {
        partTotal++;
        const rawAns = userAnswers[q.order] || '';
        const diag = diagnoseQuestionAnswer(q, rawAns);
        
        diag.partNumber = part.partNumber;
        diag.questionType = group.type;
        diag.questionTitle = q.questionText || ("Câu " + q.order);

        allQuestions.push(diag);

        if (diag.isCorrect) {
          correctCount++;
          partCorrect++;
        }

        if (errorBreakdown[diag.status] !== undefined) {
          errorBreakdown[diag.status]++;
        }

        // Type Stats Mapping
        const t = group.type || 'other';
        if (!typeStatsMap[t]) {
          typeStatsMap[t] = { type: t, total: 0, correct: 0 };
        }
        typeStatsMap[t].total++;
        if (diag.isCorrect) typeStatsMap[t].correct++;
      });
    });

    partStats.push({
      partNumber: part.partNumber,
      title: part.title,
      total: partTotal,
      correct: partCorrect,
      percent: partTotal > 0 ? Math.round((partCorrect / partTotal) * 100) : 0
    });
  });

  const totalQuestions = allQuestions.length || 40;
  const rawScore = totalQuestions <= 10 && totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 40)
    : correctCount;
  const band = calculateListeningBandScore(rawScore);
  const accuracyPercent = Math.round((correctCount / totalQuestions) * 100);

  const typeStats = Object.values(typeStatsMap).map(item => ({
    ...item,
    accuracy: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0
  }));

  return {
    testId: testData?.id,
    testTitle: testData?.title,
    band,
    correctCount,
    totalQuestions,
    accuracyPercent,
    timeSpentSeconds,
    errorBreakdown,
    partStats,
    typeStats,
    questionsBreakdown: allQuestions,
    submittedAt: new Date().toISOString()
  };
}
