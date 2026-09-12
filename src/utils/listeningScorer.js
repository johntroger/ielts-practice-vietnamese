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
  if (userNorm === targetNorm || acceptableList.includes(userNorm)) {
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
      diagnosticMessage: 'Chúc mừng! Đáp án chuẩn xác tuyệt đối.',
      evidenceQuote: question.evidenceQuote || '',
      evidenceTimestamp: question.evidenceTimestamp,
      explanation: question.explanation || ''
    };
  }

  // 3. Plural / Singular Error (-s / -es)
  const pluralCheck = checkPluralDiscrepancy(userNorm, targetNorm);
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
        ? ("⚠️ Lỗi âm đuôi: Bạn viết \"" + rawUserAnswer + "\" nhưng đề bài yêu cầu số nhiều \"" + question.answer + "\".")
        : ("⚠️ Lỗi âm đuôi: Bạn viết \"" + rawUserAnswer + "\" nhưng đề bài yêu cầu số ít \"" + question.answer + "\". "),
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
  const dist = levenshtein(userNorm, targetNorm);
  if (dist <= 2 && targetNorm.length >= 4) {
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
      diagnosticMessage: "⚠️ Lỗi chính tả: Bạn viết \"" + rawUserAnswer + "\" (lệch " + dist + " ký tự so với \"" + question.answer + "\").",
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
