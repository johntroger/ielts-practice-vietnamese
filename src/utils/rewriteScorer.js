/**
 * Sentence Rewrite Evaluator & Re-scorer (100% Offline & Heuristic)
 * Provides instant feedback when candidates practice rewriting error sentences.
 */

function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function normalize(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '')
    .trim();
}

/**
 * Evaluates a candidate's sentence rewrite against the original error and recommended correction.
 * 
 * @param {string} userText - The candidate's rewritten sentence
 * @param {string} originalText - The original sentence with errors
 * @param {string} correctedText - The examiner's corrected recommendation
 * @returns {Object} { status, score, similarity, message, details }
 */
export function scoreUserRewrite(userText = '', originalText = '', correctedText = '') {
  const user = (userText || '').trim();
  const original = (originalText || '').trim();
  const corrected = (correctedText || '').trim();

  // 1. Empty validation
  if (!user) {
    return {
      status: 'warning',
      score: 0,
      similarity: 0,
      message: 'Vui lòng nhập câu bạn muốn viết lại.',
      color: 'amber'
    };
  }

  const userTokens = tokenize(user);
  if (userTokens.length < 4 || user.length < 15) {
    return {
      status: 'warning',
      score: 0,
      similarity: 0,
      message: 'Câu quá ngắn. Vui lòng viết trọn vẹn cả câu (ít nhất 4 từ) để hệ thống đánh giá chính xác.',
      color: 'amber'
    };
  }

  // 2. Verbatim check with original
  const normUser = normalize(user);
  const normOriginal = normalize(original);
  const normCorrected = normalize(corrected);

  if (normUser === normOriginal) {
    return {
      status: 'error',
      score: 0,
      similarity: 0,
      message: 'Bạn chưa thay đổi gì so với câu gốc bị lỗi. Hãy sửa lỗi ngữ pháp hoặc dùng từ vựng thay thế.',
      color: 'red'
    };
  }

  // 3. Perfect match with examiner recommendation
  if (normUser === normCorrected) {
    return {
      status: 'perfect',
      score: 10,
      similarity: 100,
      message: 'Xuất sắc! Bạn đã viết lại chuẩn xác 100% theo gợi ý của Giám khảo Cambridge.',
      color: 'emerald'
    };
  }

  // 4. Token Overlap & Similarity Calculation
  const corrTokens = tokenize(corrected);
  const origTokens = tokenize(original);

  const corrSet = new Set(corrTokens);
  const origSet = new Set(origTokens);
  const userSet = new Set(userTokens);

  // Identify error tokens: in original but eliminated in corrected
  const errorTokens = [...origSet].filter(t => !corrSet.has(t));
  const retainedErrorCount = errorTokens.filter(t => userSet.has(t)).length;

  // Jaccard similarity with corrected sentence
  const intersection = [...userSet].filter(t => corrSet.has(t)).length;
  const union = new Set([...userSet, ...corrSet]).size;
  const similarity = union > 0 ? Math.round((intersection / union) * 100) : 0;

  // Decision logic
  if (similarity >= 60 && retainedErrorCount === 0) {
    return {
      status: 'excellent',
      score: 9,
      similarity,
      message: 'Rất tốt! Cấu trúc câu tự nhiên, đã khắc phục hoàn toàn lỗi sai và sát với chuẩn Cambridge.',
      color: 'emerald'
    };
  }

  if (similarity >= 40 && retainedErrorCount <= 1) {
    return {
      status: 'good',
      score: 7,
      similarity,
      message: 'Khá tốt! Bạn đã cải thiện đáng kể cấu trúc câu. Hãy đối chiếu thêm với gợi ý để tối ưu văn phong học thuật.',
      color: 'blue'
    };
  }

  if (retainedErrorCount > 1) {
    return {
      status: 'needs-work',
      score: 5,
      similarity,
      message: 'Chú ý: Câu viết lại vẫn còn chứa từ/cụm từ sai trong câu gốc. Hãy tham khảo gợi ý để sửa dứt điểm.',
      color: 'amber'
    };
  }

  return {
    status: 'needs-work',
    score: 6,
    similarity,
    message: 'Cần hoàn thiện thêm: Cấu trúc câu chưa thật sự tự nhiên. Hãy đọc kỹ phần giải thích của giám khảo.',
    color: 'amber'
  };
}
