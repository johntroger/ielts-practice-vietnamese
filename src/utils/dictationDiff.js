/**
 * dictationDiff.js
 * High-precision word-level alignment and diffing for IELTS Sentence Dictation drills.
 * Aligns official Cambridge transcripts with learner-submitted transcripts using LCS.
 */

/**
 * Normalizes a word token for fair comparison:
 * - Lowercases text
 * - Strips curly/straight apostrophes so "don't" and "dont" match
 * - Trims leading and trailing non-alphanumeric punctuation (periods, commas, quotes, hyphens, brackets)
 */
export function normalizeWord(word) {
  if (!word) return '';
  return String(word)
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/^[^a-z0-9]+/i, '')
    .replace(/[^a-z0-9]+$/i, '');
}

/**
 * Computes a detailed word-by-word diff between the target Cambridge sentence and the user transcript.
 * @param {string} targetSentence - The reference audio transcript
 * @param {string} userSentence - The user's typed sentence
 * @returns {object} { targetDiff, userDiff, correctCount, totalCount, accuracy, isExactMatch }
 */
export function computeDictationDiff(targetSentence = '', userSentence = '') {
  const targetTokens = String(targetSentence || '').trim().split(/\s+/).filter(Boolean);
  const userTokens = String(userSentence || '').trim().split(/\s+/).filter(Boolean);

  const n = targetTokens.length;
  const m = userTokens.length;

  if (n === 0) {
    return {
      targetDiff: [],
      userDiff: [],
      correctCount: 0,
      totalCount: 0,
      accuracy: 100,
      isExactMatch: true
    };
  }

  if (m === 0) {
    return {
      targetDiff: targetTokens.map(token => ({ text: token, type: 'missed' })),
      userDiff: [],
      correctCount: 0,
      totalCount: n,
      accuracy: 0,
      isExactMatch: false
    };
  }

  // 1. Build LCS table comparing normalized tokens
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));

  for (let i = 0; i < n; i++) {
    const tNorm = normalizeWord(targetTokens[i]);
    for (let j = 0; j < m; j++) {
      if (tNorm && tNorm === normalizeWord(userTokens[j])) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i][j + 1], dp[i + 1][j]);
      }
    }
  }

  // 2. Backtrack to find aligned matched token indices
  const matches = [];
  let i = n;
  let j = m;

  while (i > 0 && j > 0) {
    const tNorm = normalizeWord(targetTokens[i - 1]);
    const uNorm = normalizeWord(userTokens[j - 1]);
    if (tNorm && tNorm === uNorm) {
      matches.push({ tIdx: i - 1, uIdx: j - 1 });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  matches.reverse();

  // 3. Mark target diff (Correct vs Missed)
  const matchedTargetSet = new Set(matches.map(x => x.tIdx));
  const targetDiff = targetTokens.map((token, idx) => ({
    text: token,
    type: matchedTargetSet.has(idx) ? 'correct' : 'missed'
  }));

  // 4. Mark user diff (Correct, Extra/Misspelled, and Aligned Omissions)
  const matchedUserSet = new Set(matches.map(x => x.uIdx));
  const userDiff = [];
  let lastTIdx = -1;
  let matchPtr = 0;

  for (let u = 0; u < m; u++) {
    if (matchedUserSet.has(u)) {
      const match = matches[matchPtr++];
      // If there were target words skipped before this match, note them as omissions
      for (let t = lastTIdx + 1; t < match.tIdx; t++) {
        userDiff.push({ text: targetTokens[t], type: 'omission' });
      }
      userDiff.push({ text: userTokens[u], type: 'correct' });
      lastTIdx = match.tIdx;
    } else {
      userDiff.push({ text: userTokens[u], type: 'extra' });
    }
  }

  // Any trailing target words skipped after the last match
  for (let t = lastTIdx + 1; t < n; t++) {
    userDiff.push({ text: targetTokens[t], type: 'omission' });
  }

  const correctCount = matches.length;
  const accuracy = Math.round((correctCount / n) * 100);
  const isExactMatch = correctCount === n && m === n;

  return {
    targetDiff,
    userDiff,
    correctCount,
    totalCount: n,
    accuracy,
    isExactMatch
  };
}
