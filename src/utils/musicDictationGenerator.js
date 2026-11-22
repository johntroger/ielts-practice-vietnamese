/**
 * src/utils/musicDictationGenerator.js
 *
 * Pure-function Engine for Music & Lyrics Dictation Studio (/music-listening):
 * - Supports 4 Core Modes:
 *   1. 'full': Full Song Dictation (100% of vocal lines are sentence blanks)
 *   2. 'sentence': Sentence Blank Dictation (Selected lines are full-sentence blanks; anchor lines provide karaoke sync)
 *   3. 'word': Word Gap-Fill / Cloze Lyrics (Inline word blanks inside lyrics lines)
 *   4. 'mixed': Hybrid Mixed Mode (Combines anchor lines, word gap-fill lines, and full-sentence blank lines with Anti-Drift rules)
 * - Supports 3 Difficulty Levels: 'easy' (~20-25%), 'medium' (~40-50%), 'hard' (~65-75%)
 * - Handles Sung Slang & Lyric Contraction Equivalence (wanna <-> want to, gonna <-> going to, walkin' <-> walking, 'cause <-> because)
 * - Exempts non-lexical filler vocals (oh, ooh, yeah, la, na, mmm, whoa) from penalizing learners
 * - Integrates deterministic PRNG (seededRandom.js), word-level LCS diffing (dictationDiff.js), and Levenshtein near-miss feedback
 */

import { hashString, createMulberry32 } from './seededRandom.js';
import { normalizeWord, computeDictationDiff } from './dictationDiff.js';
import { parseTranscriptStringToKaraoke, formatSecondsToTimestamp } from './transcriptParser.js';

export const MUSIC_PRACTICE_MODES = [
  {
    id: 'full',
    labelEn: 'Full Song Dictation',
    labelVi: 'Chép Nguyên Bài',
    shortEn: 'Full Song',
    shortVi: 'Nguyên Bài',
    descEn: 'Hide all lyrics and transcribe every line from start to finish.',
    descVi: 'Ẩn toàn bộ lời bài hát và chép lại trọn vẹn từng câu từ đầu đến cuối.'
  },
  {
    id: 'sentence',
    labelEn: 'Sentence Blank Dictation',
    labelVi: 'Trống Nguyên Câu',
    shortEn: 'Sentence Blanks',
    shortVi: 'Trống Câu',
    descEn: 'Follow karaoke anchor lines and transcribe entire missing sentences.',
    descVi: 'Theo dõi các câu dẫn mạch Karaoke và nghe chép lại nguyên vẹn các câu để trống.'
  },
  {
    id: 'word',
    labelEn: 'Word Gap-Fill (Cloze)',
    labelVi: 'Trống Từ Để Điền',
    shortEn: 'Word Blanks',
    shortVi: 'Trống Từ',
    descEn: 'Listen to the melody and fill in missing keywords and linked words inline.',
    descVi: 'Nghe theo giai điệu và điền nhanh các từ khóa / từ nối âm còn thiếu vào chỗ trống.'
  },
  {
    id: 'mixed',
    labelEn: 'Hybrid Sentence & Word Blanks',
    labelVi: 'Kết Hợp Trống Câu & Từ',
    shortEn: 'Mixed',
    shortVi: 'Kết Hợp',
    descEn: 'Dynamic combination of karaoke anchors, inline word blanks, and full-sentence dictation.',
    descVi: 'Kết hợp thông minh giữa câu dẫn nhịp, câu đục lỗ từ vựng và câu để trống nguyên câu.'
  }
];

export const MUSIC_DIFFICULTY_LEVELS = [
  {
    id: 'easy',
    labelEn: 'Easy (25%)',
    labelVi: 'Dễ (25%)',
    ratio: 0.25,
    wordsPerLine: 1,
    xpMultiplier: 1.0
  },
  {
    id: 'medium',
    labelEn: 'Medium (45%)',
    labelVi: 'Vừa (45%)',
    ratio: 0.45,
    wordsPerLine: 2,
    xpMultiplier: 1.35
  },
  {
    id: 'hard',
    labelEn: 'Hard (70%)',
    labelVi: 'Khó (70%)',
    ratio: 0.70,
    wordsPerLine: 3,
    xpMultiplier: 1.75
  }
];

// Non-lexical vocalizations that should never be blanked out or penalized
const FILLER_VOCAL_SET = new Set([
  'oh', 'ooh', 'yeah', 'yah', 'ah', 'ahh', 'uh', 'uhh', 'mmm', 'mm',
  'la', 'na', 'da', 'ba', 'whoa', 'woah', 'hey', 'yo', 'ha', 'hah', 'shh'
]);

// Common function/stop words to avoid blanking in Easy mode when content words exist
const STOP_WORD_SET = new Set([
  'a', 'an', 'the', 'to', 'in', 'on', 'at', 'of', 'by', 'as', 'is', 'am',
  'are', 'was', 'were', 'be', 'do', 'so', 'or', 'if', 'it', 'me', 'my', 'we', 'us', 'he'
]);

// Canonical equivalence groups for sung English contractions & informal spellings
const LYRIC_CANONICAL_EQUIVALENTS = {
  cause: 'because',
  cos: 'because',
  cuz: 'because',
  til: 'until',
  till: 'until',
  em: 'them',
  ya: 'you',
  ye: 'you',
  thru: 'through',
  tho: 'though',
  nothin: 'nothing',
  somethin: 'something',
  everythin: 'everything',
  anythin: 'anything',
  runnin: 'running',
  walkin: 'walking',
  talkin: 'talking',
  lookin: 'looking',
  waitin: 'waiting',
  fallin: 'falling',
  tryin: 'trying',
  crying: 'crying',
  cryin: 'crying',
  dyin: 'dying',
  lyin: 'lying',
  flyin: 'flying',
  goin: 'going',
  doin: 'doing',
  sayin: 'saying',
  playin: 'playing',
  stayin: 'staying',
  lovin: 'loving',
  livin: 'living',
  givin: 'giving',
  movin: 'moving',
  comin: 'coming',
  dancin: 'dancing',
  singin: 'singing',
  dreamin: 'dreaming',
  feelin: 'feeling',
  thinkin: 'thinking',
  workin: 'working',
  2: 'two',
  4: 'for',
  u: 'you'
};

// Multi-word expansion equivalents for sentence-level comparison
const MULTI_WORD_EXPANSIONS = [
  [/\bwanna\b/gi, 'want to'],
  [/\bgonna\b/gi, 'going to'],
  [/\bgotta\b/gi, 'got to'],
  [/\blemme\b/gi, 'let me'],
  [/\bgimme\b/gi, 'give me'],
  [/\bkinda\b/gi, 'kind of'],
  [/\bsorta\b/gi, 'sort of'],
  [/\boutta\b/gi, 'out of'],
  [/\bi'm\b/gi, 'i am'],
  [/\bim\b/gi, 'i am'],
  [/\byou're\b/gi, 'you are'],
  [/\byoure\b/gi, 'you are'],
  [/\bwe're\b/gi, 'we are'],
  [/\bthey're\b/gi, 'they are'],
  [/\bit's\b/gi, 'it is'],
  [/\bthat's\b/gi, 'that is'],
  [/\bthere's\b/gi, 'there is'],
  [/\bwhat's\b/gi, 'what is'],
  [/\bhe's\b/gi, 'he is'],
  [/\bshe's\b/gi, 'she is'],
  [/\bdon't\b/gi, 'do not'],
  [/\bdont\b/gi, 'do not'],
  [/\bdoesn't\b/gi, 'does not'],
  [/\bdidn't\b/gi, 'did not'],
  [/\bcan't\b/gi, 'cannot'],
  [/\bcant\b/gi, 'cannot'],
  [/\bwon't\b/gi, 'will not'],
  [/\bwont\b/gi, 'will not'],
  [/\bi'll\b/gi, 'i will'],
  [/\byou'll\b/gi, 'you will'],
  [/\bi've\b/gi, 'i have'],
  [/\bi'd\b/gi, 'i would']
];

/**
 * Checks if a token is a non-lexical vocal filler ("oh", "yeah", "ooh", "la")
 */
export function isFillerVocal(token) {
  const norm = normalizeWord(token);
  if (!norm) return true;
  return FILLER_VOCAL_SET.has(norm);
}

/**
 * Canonicalizes a single lyric word token so informal sung variants match standard spelling.
 */
export function canonicalizeLyricToken(word) {
  const norm = normalizeWord(word);
  if (!norm) return '';
  if (LYRIC_CANONICAL_EQUIVALENTS[norm]) {
    return LYRIC_CANONICAL_EQUIVALENTS[norm];
  }
  return norm;
}

/**
 * Computes Levenshtein edit distance between two normalized strings.
 */
export function computeEditDistance(a = '', b = '') {
  const s1 = String(a);
  const s2 = String(b);
  const m = s1.length;
  const n = s2.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

/**
 * Evaluates a single word blank input against the target lyric token.
 * Returns status: 'empty' | 'correct' | 'near' | 'wrong'
 */
export function evaluateWordBlankAttempt(targetToken = '', userInput = '') {
  const rawUser = String(userInput || '').trim();
  if (!rawUser) {
    return { status: 'empty', isCorrect: false, isNearMiss: false, messageEn: '', messageVi: '' };
  }

  const targetNorm = normalizeWord(targetToken);
  const userNorm = normalizeWord(rawUser);

  if (!targetNorm) {
    return { status: 'correct', isCorrect: true, isNearMiss: false, messageEn: '', messageVi: '' };
  }

  // 1. Direct normalized match or canonical sung variant match (e.g., walkin' === walking, 'cause === because)
  if (
    targetNorm === userNorm ||
    canonicalizeLyricToken(targetToken) === canonicalizeLyricToken(rawUser)
  ) {
    return {
      status: 'correct',
      isCorrect: true,
      isNearMiss: false,
      messageEn: 'Exact match!',
      messageVi: 'Chính xác!'
    };
  }

  // 2. Check multi-word contraction typed in single box (e.g. target "I'm", user typed "I am" or vice versa)
  let expandedTarget = targetToken.toLowerCase();
  let expandedUser = rawUser.toLowerCase();
  for (const [regex, replacement] of MULTI_WORD_EXPANSIONS) {
    expandedTarget = expandedTarget.replace(regex, replacement);
    expandedUser = expandedUser.replace(regex, replacement);
  }
  if (normalizeWord(expandedTarget.replace(/\s+/g, '')) === normalizeWord(expandedUser.replace(/\s+/g, ''))) {
    return {
      status: 'correct',
      isCorrect: true,
      isNearMiss: false,
      messageEn: 'Exact match!',
      messageVi: 'Chính xác!'
    };
  }

  // 3. Check plural / past tense ending or 1-character typo (Near-Miss yellow warning)
  const dist = computeEditDistance(targetNorm, userNorm);
  const isPluralOrPastDiff =
    userNorm + 's' === targetNorm ||
    userNorm + 'es' === targetNorm ||
    userNorm + 'd' === targetNorm ||
    userNorm + 'ed' === targetNorm ||
    targetNorm + 's' === userNorm ||
    targetNorm + 'ed' === userNorm;

  if (isPluralOrPastDiff) {
    return {
      status: 'near',
      isCorrect: false,
      isNearMiss: true,
      messageEn: 'Almost! Check final -s / -ed ending.',
      messageVi: 'Gần đúng! Kiểm tra lại âm đuôi -s hoặc -ed.'
    };
  }

  if (targetNorm.length >= 4 && dist === 1) {
    return {
      status: 'near',
      isCorrect: false,
      isNearMiss: true,
      messageEn: 'Almost! 1 letter off — check your spelling.',
      messageVi: 'Gần đúng! Sai lệch 1 chữ cái — hãy kiểm tra lại chính tả.'
    };
  }

  return {
    status: 'wrong',
    isCorrect: false,
    isNearMiss: false,
    messageEn: 'Not quite right. Press Tab to replay this line.',
    messageVi: 'Chưa khớp. Bấm phím Tab để nghe lại câu này.'
  };
}

/**
 * Evaluates a full-sentence dictation attempt with sung contraction equivalence & filler vocal forgiveness.
 */
export function evaluateSentenceBlankAttempt(targetSentence = '', userSentence = '') {
  const rawUser = String(userSentence || '').trim();
  const targetTokens = String(targetSentence || '').trim().split(/\s+/).filter(Boolean);

  if (targetTokens.length === 0) {
    return {
      targetDiff: [],
      userDiff: [],
      correctCount: 0,
      totalCount: 0,
      accuracy: 100,
      isExactMatch: true,
      isPassed: true
    };
  }

  if (!rawUser) {
    return {
      targetDiff: targetTokens.map(t => ({
        text: t,
        type: isFillerVocal(t) ? 'correct' : 'missed',
        isFiller: isFillerVocal(t)
      })),
      userDiff: [],
      correctCount: 0,
      totalCount: targetTokens.length,
      accuracy: 0,
      isExactMatch: false,
      isPassed: false
    };
  }

  // First run standard LCS diff
  const baseDiff = computeDictationDiff(targetSentence, rawUser);

  // Enhance targetDiff with canonical lyric equivalence & filler vocal forgiveness
  const userTokensNorm = rawUser
    .split(/\s+/)
    .filter(Boolean)
    .map(t => canonicalizeLyricToken(t));
  const userSetCanonical = new Set(userTokensNorm);

  // Also check expanded forms (e.g. user wrote "want to" for "wanna" or "I am" for "I'm")
  let expandedUserStr = rawUser.toLowerCase();
  for (const [regex, replacement] of MULTI_WORD_EXPANSIONS) {
    expandedUserStr = expandedUserStr.replace(regex, replacement);
  }
  const expandedUserNormSet = new Set(
    expandedUserStr.split(/\s+/).filter(Boolean).map(t => canonicalizeLyricToken(t))
  );

  let forgivenCorrectCount = 0;
  const enhancedTargetDiff = baseDiff.targetDiff.map((tokenObj) => {
    if (tokenObj.type === 'correct') {
      forgivenCorrectCount++;
      return tokenObj;
    }

    // Forgive filler vocals ("oh", "yeah", "ooh") automatically
    if (isFillerVocal(tokenObj.text)) {
      forgivenCorrectCount++;
      return { ...tokenObj, type: 'correct', isFiller: true };
    }

    // Check canonical equivalence (e.g., target "walkin'", user typed "walking")
    const canonTarget = canonicalizeLyricToken(tokenObj.text);
    if (canonTarget && (userSetCanonical.has(canonTarget) || expandedUserNormSet.has(canonTarget))) {
      forgivenCorrectCount++;
      return { ...tokenObj, type: 'correct' };
    }

    // Check if target is a contraction like "I'm" and user typed "I am"
    let expTok = tokenObj.text.toLowerCase();
    for (const [regex, replacement] of MULTI_WORD_EXPANSIONS) {
      expTok = expTok.replace(regex, replacement);
    }
    const expParts = expTok.split(/\s+/).filter(Boolean).map(t => canonicalizeLyricToken(t));
    if (expParts.length > 1 && expParts.every(p => expandedUserNormSet.has(p))) {
      forgivenCorrectCount++;
      return { ...tokenObj, type: 'correct' };
    }

    return tokenObj;
  });

  const totalCount = targetTokens.length;
  const accuracy = Math.min(100, Math.round((forgivenCorrectCount / totalCount) * 100));
  const isExactMatch = forgivenCorrectCount === totalCount;
  const isPassed = accuracy >= 85 || isExactMatch;

  return {
    ...baseDiff,
    targetDiff: enhancedTargetDiff,
    correctCount: forgivenCorrectCount,
    totalCount,
    accuracy,
    isExactMatch,
    isPassed
  };
}

/**
 * Selects which word token indices in a lyric line should be turned into inline blanks.
 */
function selectWordBlanksForLine(line, difficulty = 'medium', rng, seed = 1) {
  const tokens = String(line.text || '').trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const isShuffledRound = Number(seed) > 1;
  const targetBlankCount = Math.max(
    1,
    Math.min(
      Math.max(1, tokens.length - 1),
      difficulty === 'hard'
        ? Math.ceil(tokens.length * 0.5)
        : difficulty === 'medium'
        ? Math.min(3, Math.max(1, Math.round(tokens.length * 0.32)))
        : 1
    )
  );

  const curatedKeySet = new Set(
    (Array.isArray(line.keyWords) ? line.keyWords : []).map(w => normalizeWord(w)).filter(Boolean)
  );

  // Score each token candidate
  // Round 1 (seed === 1): prioritize curated keywords; Shuffle rounds (seed > 1): rotate across ALL words
  const candidates = [];
  tokens.forEach((tok, idx) => {
    const norm = normalizeWord(tok);
    if (!norm || norm.length < 2 || isFillerVocal(tok)) return;

    let priority = 1;
    if (isShuffledRound) {
      priority = !STOP_WORD_SET.has(norm) ? 2.5 : (difficulty === 'hard' ? 2.0 : 0.8);
    } else if (curatedKeySet.has(norm)) {
      priority = 10; // Highest priority for curated pedagogical keywords on initial pass
    } else if (!STOP_WORD_SET.has(norm) && norm.length >= 4) {
      priority = 6; // Content words
    } else if (!STOP_WORD_SET.has(norm)) {
      priority = 3;
    } else if (difficulty === 'hard') {
      priority = 2; // In hard mode, allow function words too
    } else {
      priority = 0.5;
    }

    candidates.push({
      idx,
      tok,
      norm,
      score: priority + rng() * (isShuffledRound ? 10 : 2.5)
    });
  });

  if (candidates.length === 0) return [];

  candidates.sort((a, b) => b.score - a.score);
  const chosenIndices = [];

  for (const cand of candidates) {
    if (chosenIndices.length >= targetBlankCount) break;
    // In easy/medium mode, avoid adjacent word blanks if possible for readability
    if (
      difficulty !== 'hard' &&
      chosenIndices.some(existingIdx => Math.abs(existingIdx - cand.idx) === 1) &&
      candidates.length > targetBlankCount + 1
    ) {
      continue;
    }
    chosenIndices.push(cand.idx);
  }

  // Fallback if adjacency filter skipped too many
  for (const cand of candidates) {
    if (chosenIndices.length >= targetBlankCount) break;
    if (!chosenIndices.includes(cand.idx)) {
      chosenIndices.push(cand.idx);
    }
  }

  chosenIndices.sort((a, b) => a - b);
  return chosenIndices;
}

/**
 * Builds the complete interactive dictation blueprint for a song across all 4 modes:
 * - mode: 'full' | 'sentence' | 'word' | 'mixed'
 * - difficulty: 'easy' | 'medium' | 'hard'
 * - seed: number/string for deterministic or shuffled blank positions
 */
export function buildMusicDictationBlueprint({
  track,
  mode = 'word',
  difficulty = 'medium',
  seed = 1
}) {
  const lines = Array.isArray(track?.lines) ? track.lines : [];
  const seedStr = `${track?.id || 'song'}::${mode}::${difficulty}::${seed}`;
  const rng = createMulberry32(hashString(seedStr));
  const diffObj = MUSIC_DIFFICULTY_LEVELS.find(d => d.id === difficulty) || MUSIC_DIFFICULTY_LEVELS[1];

  const totalLines = lines.length;
  const lineBlueprints = [];

  // Pre-calculate effective anti-bleed end time for each line (-0.12s before next line start)
  const normalizedLines = lines.map((line, idx) => {
    const nextLine = lines[idx + 1];
    const rawStart = Number(line.start) || 0;
    const rawEnd = Number(line.end) || (nextLine ? Number(nextLine.start) : rawStart + 5);
    const effectiveEnd = nextLine
      ? Math.max(rawStart + 1.2, Math.min(rawEnd, Number(nextLine.start) - 0.12))
      : Math.max(rawStart + 1.5, rawEnd);

    return {
      ...line,
      id: line.id || `line-${idx + 1}`,
      index: idx,
      start: rawStart,
      end: rawEnd,
      effectiveEnd,
      timestampLabel: formatSecondsToTimestamp(rawStart)
    };
  });

  // Determine line types based on Mode
  if (mode === 'full') {
    // MODE 1: Full Song Dictation — Every vocal line is a full-sentence blank
    normalizedLines.forEach((line) => {
      const tokens = String(line.text || '').trim().split(/\s+/).filter(Boolean);
      lineBlueprints.push({
        ...line,
        lineType: 'sentence_blank',
        wordCount: tokens.length,
        tokens: tokens.map((t, tIdx) => ({
          tokenIndex: tIdx,
          text: t,
          isBlank: false
        })),
        blankWordIndices: []
      });
    });
  } else if (mode === 'sentence') {
    // MODE 2: Sentence Blank Dictation — Anchor lines + Full Sentence Blanks
    // Anti-Drift Rule: Line 0 is always an anchor line so the learner catches the vocal entry
    let consecutiveSentenceBlanks = 0;
    const maxConsecutive = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1;

    normalizedLines.forEach((line, idx) => {
      const tokens = String(line.text || '').trim().split(/\s+/).filter(Boolean);
      let isSentenceBlank = false;

      if (idx > 0 && tokens.length >= 3) {
        const curatedBoost = line.isKeySentence ? 0.25 : 0;
        const roll = rng();
        if (consecutiveSentenceBlanks >= maxConsecutive) {
          isSentenceBlank = false;
        } else if (roll < diffObj.ratio + curatedBoost) {
          isSentenceBlank = true;
        }
      }

      // Ensure at least 1 sentence blank if song is short
      if (idx === totalLines - 1 && lineBlueprints.every(l => l.lineType !== 'sentence_blank') && totalLines > 1) {
        isSentenceBlank = true;
      }

      if (isSentenceBlank) {
        consecutiveSentenceBlanks++;
      } else {
        consecutiveSentenceBlanks = 0;
      }

      lineBlueprints.push({
        ...line,
        lineType: isSentenceBlank ? 'sentence_blank' : 'anchor',
        wordCount: tokens.length,
        tokens: tokens.map((t, tIdx) => ({
          tokenIndex: tIdx,
          text: t,
          isBlank: false
        })),
        blankWordIndices: []
      });
    });
  } else if (mode === 'word') {
    // MODE 3: Word Gap-Fill (Cloze) — Every line has inline word blanks
    normalizedLines.forEach((line) => {
      const rawTokens = String(line.text || '').trim().split(/\s+/).filter(Boolean);
      const blankIndices = selectWordBlanksForLine(line, difficulty, rng, seed);
      const blankSet = new Set(blankIndices);

      const tokens = rawTokens.map((tok, tIdx) => {
        // Split leading/trailing punctuation for clean inline input rendering
        const match = tok.match(/^([^a-zA-Z0-9'’]*)([a-zA-Z0-9'’-]+)([^a-zA-Z0-9'’]*)$/);
        const prefix = match ? match[1] : '';
        const coreWord = match ? match[2] : tok;
        const suffix = match ? match[3] : '';

        return {
          tokenIndex: tIdx,
          text: tok,
          prefix,
          coreWord,
          suffix,
          isBlank: blankSet.has(tIdx)
        };
      });

      lineBlueprints.push({
        ...line,
        lineType: blankIndices.length > 0 ? 'word_blank' : 'anchor',
        wordCount: rawTokens.length,
        tokens,
        blankWordIndices: blankIndices
      });
    });
  } else {
    // MODE 4: Hybrid Mixed Mode — Combines Anchor Lines, Word Blanks, and Sentence Blanks
    // Anti-Drift Rule: Line 0 is either 'anchor' or 1-word 'word_blank' so learner locks onto the vocal start
    let consecutiveSentenceBlanks = 0;
    const maxConsecutiveSentence = difficulty === 'hard' ? 2 : 1;

    normalizedLines.forEach((line, idx) => {
      const rawTokens = String(line.text || '').trim().split(/\s+/).filter(Boolean);
      let lineType = 'anchor';

      if (idx === 0) {
        lineType = difficulty === 'easy' ? 'anchor' : 'word_blank';
      } else {
        const roll = rng();
        const sentenceThreshold = difficulty === 'hard' ? 0.38 : difficulty === 'medium' ? 0.28 : 0.18;
        const wordThreshold = difficulty === 'hard' ? 0.85 : difficulty === 'medium' ? 0.72 : 0.55;

        if (
          consecutiveSentenceBlanks < maxConsecutiveSentence &&
          rawTokens.length >= 3 &&
          (roll < sentenceThreshold || (line.isKeySentence && roll < sentenceThreshold + 0.2))
        ) {
          lineType = 'sentence_blank';
        } else if (roll < wordThreshold) {
          lineType = 'word_blank';
        } else {
          lineType = 'anchor';
        }
      }

      if (lineType === 'sentence_blank') {
        consecutiveSentenceBlanks++;
      } else {
        consecutiveSentenceBlanks = 0;
      }

      if (lineType === 'word_blank') {
        const blankIndices = selectWordBlanksForLine(line, difficulty, rng, seed);
        const blankSet = new Set(blankIndices);
        const tokens = rawTokens.map((tok, tIdx) => {
          const match = tok.match(/^([^a-zA-Z0-9'’]*)([a-zA-Z0-9'’-]+)([^a-zA-Z0-9'’]*)$/);
          return {
            tokenIndex: tIdx,
            text: tok,
            prefix: match ? match[1] : '',
            coreWord: match ? match[2] : tok,
            suffix: match ? match[3] : '',
            isBlank: blankSet.has(tIdx)
          };
        });

        lineBlueprints.push({
          ...line,
          lineType: blankIndices.length > 0 ? 'word_blank' : 'anchor',
          wordCount: rawTokens.length,
          tokens,
          blankWordIndices: blankIndices
        });
      } else {
        lineBlueprints.push({
          ...line,
          lineType,
          wordCount: rawTokens.length,
          tokens: rawTokens.map((t, tIdx) => ({
            tokenIndex: tIdx,
            text: t,
            isBlank: false
          })),
          blankWordIndices: []
        });
      }
    });

    // Guarantee Mixed Mode always has at least 1 sentence_blank and 1 word_blank if totalLines >= 3
    if (totalLines >= 3) {
      const hasSentence = lineBlueprints.some(l => l.lineType === 'sentence_blank');
      const hasWord = lineBlueprints.some(l => l.lineType === 'word_blank');
      if (!hasSentence) {
        const targetIdx = Math.min(2, totalLines - 1);
        lineBlueprints[targetIdx].lineType = 'sentence_blank';
        lineBlueprints[targetIdx].blankWordIndices = [];
      }
      if (!hasWord) {
        const targetIdx = 1;
        const blankIndices = selectWordBlanksForLine(normalizedLines[targetIdx], difficulty, rng, seed);
        const blankSet = new Set(blankIndices);
        lineBlueprints[targetIdx].lineType = 'word_blank';
        lineBlueprints[targetIdx].blankWordIndices = blankIndices;
        lineBlueprints[targetIdx].tokens = lineBlueprints[targetIdx].tokens.map((tok, tIdx) => {
          const match = tok.text.match(/^([^a-zA-Z0-9'’]*)([a-zA-Z0-9'’-]+)([^a-zA-Z0-9'’]*)$/);
          return {
            ...tok,
            prefix: match ? match[1] : '',
            coreWord: match ? match[2] : tok.text,
            suffix: match ? match[3] : '',
            isBlank: blankSet.has(tIdx)
          };
        });
      }
    }
  }

  // Compute summary metadata for progress bars
  let totalSentenceBlanks = 0;
  let totalWordBlanks = 0;
  lineBlueprints.forEach((l) => {
    if (l.lineType === 'sentence_blank') totalSentenceBlanks++;
    if (l.lineType === 'word_blank') totalWordBlanks += l.blankWordIndices.length;
  });

  return {
    trackId: track?.id || 'custom-song',
    mode,
    difficulty,
    seed,
    lines: lineBlueprints,
    totalLines,
    totalSentenceBlanks,
    totalWordBlanks,
    totalInteractiveTasks: totalSentenceBlanks + totalWordBlanks
  };
}

/**
 * Converts a raw .LRC or timestamped lyric string into structured song lines
 * compatible with MUSIC_LISTENING_TRACKS.
 */
export function parseLrcToMusicLines(lrcText = '', audioDuration = 210) {
  if (!lrcText || typeof lrcText !== 'string') return [];

  // Strip LRC metadata tags like [ar:...], [ti:...], [al:...], [length:...]
  const cleanedLrc = lrcText
    .split(/\r?\n/)
    .filter(line => !/^\[(ar|ti|al|au|by|offset|length|re|ve):/i.test(line.trim()))
    .join('\n');

  const parsed = parseTranscriptStringToKaraoke(cleanedLrc, audioDuration, 'Vocalist');

  // If user pasted plain lyrics without [MM:SS] timestamps, auto-distribute evenly across audioDuration
  if (parsed.length <= 1 && cleanedLrc.split(/\r?\n/).filter(l => l.trim()).length > 2) {
    const rawLines = cleanedLrc
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);
    const effectiveDur = Math.max(60, Number(audioDuration) || rawLines.length * 5);
    const step = effectiveDur / rawLines.length;

    return rawLines.map((text, idx) => ({
      id: `custom-line-${idx + 1}`,
      index: idx,
      sectionEn: idx < 4 ? 'Verse 1' : idx < 8 ? 'Chorus' : 'Verse 2',
      sectionVi: idx < 4 ? 'Lời 1 (Verse 1)' : idx < 8 ? 'Điệp khúc (Chorus)' : 'Lời 2 (Verse 2)',
      start: Number((idx * step).toFixed(2)),
      end: Number(((idx + 1) * step).toFixed(2)),
      text,
      translationVi: '',
      keyWords: [],
      isKeySentence: idx % 4 === 1
    }));
  }

  return parsed
    .filter(item => item.text && item.text.trim().length > 0 && !/^\[?(instrumental|music)\]?$/i.test(item.text.trim()))
    .map((item, idx) => ({
      id: `lrc-line-${idx + 1}`,
      index: idx,
      sectionEn: idx < 4 ? 'Verse 1' : idx < 8 ? 'Chorus' : idx < 14 ? 'Verse 2' : 'Bridge & Outro',
      sectionVi: idx < 4 ? 'Lời 1 (Verse 1)' : idx < 8 ? 'Điệp khúc (Chorus)' : idx < 14 ? 'Lời 2 (Verse 2)' : 'Đoạn chuyển & Kết',
      start: Number(Number(item.start || 0).toFixed(2)),
      end: Number(Number(item.end || (item.start + 5)).toFixed(2)),
      text: item.text.trim(),
      translationVi: '',
      keyWords: [],
      isKeySentence: idx % 3 === 1
    }));
}
