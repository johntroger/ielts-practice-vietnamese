/**
 * Answer Evaluation Service
 * Centralized, battle-tested answer comparison and scoring engine for IELTS Reading & Listening.
 * Prevents variable scoping leaks, case sensitivity issues, and acceptable answer misses.
 */

/**
 * Evaluates a user's answer against the target question key and acceptable alternatives.
 * @param {object} question - Question object containing { answer, acceptableAnswers, type }
 * @param {string|number} rawUserAnswer - Raw candidate response from UI
 * @returns {object} { isCorrect: boolean, isAnswered: boolean, normalizedUser: string, normalizedTarget: string }
 */
export function evaluateQuestionAnswer(question, rawUserAnswer) {
  if (!question) {
    return {
      isCorrect: false,
      isAnswered: false,
      normalizedUser: '',
      normalizedTarget: ''
    };
  }

  const userStr = rawUserAnswer !== null && rawUserAnswer !== undefined ? String(rawUserAnswer).trim() : '';
  const isAnswered = userStr.length > 0;
  
  if (!isAnswered) {
    return {
      isCorrect: false,
      isAnswered: false,
      normalizedUser: '',
      normalizedTarget: String(question.answer || '').trim()
    };
  }

  const targetStr = String(question.answer || '').trim();
  const userUpper = userStr.toUpperCase();
  const targetUpper = targetStr.toUpperCase();
  const userLower = userStr.toLowerCase();

  // 1. Exact match (case-insensitive)
  if (userUpper === targetUpper) {
    return {
      isCorrect: true,
      isAnswered: true,
      normalizedUser: userStr,
      normalizedTarget: targetStr
    };
  }

  // 2. Check acceptableAnswers list (case-insensitive, trimmed)
  if (Array.isArray(question.acceptableAnswers) && question.acceptableAnswers.length > 0) {
    const isMatchedAcceptable = question.acceptableAnswers.some(ans => {
      const cleanAns = String(ans || '').trim().toLowerCase();
      return cleanAns === userLower;
    });

    if (isMatchedAcceptable) {
      return {
        isCorrect: true,
        isAnswered: true,
        normalizedUser: userStr,
        normalizedTarget: targetStr
      };
    }
  }

  // 3. Fallback for Heading matching (Roman numerals vs Letters if any formatting variance)
  if (question.type === 'matching_headings' || question.type === 'matching') {
    if (userUpper.replace(/[\s\.\-]/g, '') === targetUpper.replace(/[\s\.\-]/g, '')) {
      return {
        isCorrect: true,
        isAnswered: true,
        normalizedUser: userStr,
        normalizedTarget: targetStr
      };
    }
  }

  return {
    isCorrect: false,
    isAnswered: true,
    normalizedUser: userStr,
    normalizedTarget: targetStr
  };
}
