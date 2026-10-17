/**
 * src/adapters/sprintQuestionAdapter.js
 * 
 * Standardized Question Normalizer & Fast-Paced Sprint Generator v8.1.
 * 
 * Enhancements:
 * 1. Safe Distractor Shuffling: Preserves Cambridge CDI True/False/Not Given standard order
 *    and sequential numeric/date formats. Only shuffles general multiple choice distractors.
 * 2. 7-Slot Blueprint (The 7-Slot Flow):
 *    - Slot 1-2 (Fast Reflex): Spelling demons & academic synonyms (8-12s).
 *    - Slot 3-4 (Core Analysis): Ngữ pháp, Collocation & True/False/Not Given + Tối đa 1 Revenge Question (+5 XP).
 *    - Slot 5-6 (Tactical Reading): Reading micro-scanning & distractor traps (15-20s).
 *    - Slot 7 (The Boss Stage): Listening micro-audio or high-difficulty challenge.
 * 3. 2-Hit Mastery & Ebbinghaus 14-Day Spaced Decay Integration.
 * 4. Soft Recycling Protection: Automatically borrows least-recently-seen mastered questions if pool is running low.
 */

import { IELTS_SPELLING_TRAPS, CAMBRIDGE_SYNONYM_PAIRS } from '../data/vocabGrammarSpellingData.js';
import { READING_MICRO_DRILLS } from '../data/readingMicroDrills.js';
import { LISTENING_MICRO_DRILLS } from '../data/listeningMicroDrills.js';
import { ARENA_QUESTION_BANK, getQuestionsByTierAndTopic } from '../data/arenaQuestionBank.js';
import { ARENA_IELTS_TOPICS } from '../utils/arenaStorageKeys.js';
import { filterEligibleQuestions, recordServedQuestions } from './sprintCooldownService.js';
import { balanceQuestionsBySkill, validateArenaQuestion } from '../services/gamification/skillBalancingEngine.js';
import { 
  getQuestionMeta, 
  getQuestionMasteryStatus, 
  getEligibleRevengeQuestions, 
  getCompletedMatchCount 
} from '../services/gamification/arenaMasteryService.js';

/**
 * Shuffles an array with an optional deterministic or native RNG.
 */
export function shuffleArray(arr = [], rng = Math.random) {
  const cloned = [...arr];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

/**
 * Safe Distractor Shuffling:
 * - NEVER shuffles True / False / Not Given or Yes / No / Not Given (preserves standard Cambridge CDI layout).
 * - NEVER shuffles sequential numeric/date answers.
 * - Safely shuffles general multiple-choice options and recalculates correctIndex & correctAnswer.
 * 
 * @param {Object} question
 * @param {() => number} [rng=Math.random]
 * @returns {Object}
 */
export function shuffleQuestionOptions(question, rng = Math.random) {
  if (!question || !Array.isArray(question.options) || question.options.length <= 1) {
    return question;
  }

  // 1. Preserve Cambridge True/False/Not Given and Yes/No/Not Given standard order
  if (
    question.type === 'tfng' ||
    question.type === 'reading-tfng' ||
    question.skillCategory === 'reading' ||
    (question.options.includes('TRUE') && question.options.includes('FALSE')) ||
    (question.options.includes('YES') && question.options.includes('NO')) ||
    question.allowShuffle === false
  ) {
    return question;
  }

  // 2. Preserve sequential numeric/date values (e.g. £10, £20, £50, £100 or 1990, 2000, 2010)
  const isSequentialNumbers = question.options.every(opt => typeof opt === 'string' && /^[£$€¥]?\s*\d+/.test(opt.trim()));
  if (isSequentialNumbers) {
    return question;
  }

  const correctVal = question.correctAnswer || question.options[question.correctIndex];
  const paired = question.options.map((opt, idx) => ({
    opt,
    isCorrect: idx === question.correctIndex || opt === correctVal
  }));

  const shuffledPairs = shuffleArray(paired, rng);
  const newOptions = shuffledPairs.map(p => p.opt);
  const newCorrectIndex = shuffledPairs.findIndex(p => p.isCorrect);
  const safeIdx = newCorrectIndex >= 0 ? newCorrectIndex : 0;

  return {
    ...question,
    options: newOptions,
    correctIndex: safeIdx,
    correctAnswer: newOptions[safeIdx]
  };
}

export function adaptSpellingTrap(item, rng = Math.random) {
  const rawOptions = [item.correct, ...(item.distractors || []).slice(0, 3)];
  const options = shuffleArray(rawOptions, rng);
  const englishExp = `"${item.correct}" is the standard Cambridge academic spelling.`;

  // Select the primary high-risk misspelling trap (e.g. "Wenesday" for "Wednesday")
  const misspelledWord = (item.distractors && item.distractors[0]) || '';

  // Transform blank context sentence to explicitly highlight the misspelled word in brackets
  // e.g. "The chemistry lab workshop convenes promptly every [Wenesday] morning."
  let sentenceWithMistake = item.contextSentence || '';
  if (sentenceWithMistake.includes('____')) {
    sentenceWithMistake = sentenceWithMistake.replace(/_{2,}/g, `[${misspelledWord}]`);
  } else if (misspelledWord) {
    sentenceWithMistake = sentenceWithMistake ? `${sentenceWithMistake} [${misspelledWord}]` : `[${misspelledWord}]`;
  }

  const promptEn = misspelledWord
    ? `Identify and correct the misspelled word in brackets [${misspelledWord}] with the authentic Cambridge spelling:`
    : `Type the authentic Cambridge academic spelling:`;
  const promptVi = misspelledWord
    ? `Tìm và sửa từ viết sai chính tả trong ngoặc [${misspelledWord}] thành dạng đúng chuẩn Cambridge:`
    : `Gõ chính tả học thuật chuẩn Cambridge:`;

  const placeholderEn = misspelledWord
    ? `Type the correct spelling of "${misspelledWord}" and press Enter...`
    : `Type the missing word and press Enter...`;
  const placeholderVi = misspelledWord
    ? `Gõ chính tả đúng thay cho "${misspelledWord}" rồi nhấn Enter...`
    : `Gõ từ còn thiếu rồi nhấn Enter...`;

  return {
    id: `spelling_${item.id}`,
    rawId: item.id,
    type: 'spelling',
    interactionType: 'text_input',
    strictSpelling: true,
    acceptableAnswers: [item.correct],
    placeholder: placeholderEn,
    placeholderEn,
    placeholderVi,
    misspelledWord,
    audioText: item.correct,
    skillCategory: 'vocab',
    prompt: promptEn,
    promptEn,
    promptVi,
    context: sentenceWithMistake,
    contextEn: sentenceWithMistake,
    contextVi: sentenceWithMistake,
    options,
    correctIndex: options.indexOf(item.correct),
    correctAnswer: item.correct,
    explanation: item.explanationEn || englishExp,
    explanationEn: item.explanationEn || englishExp,
    explanationVi: item.explanation || item.rule || englishExp
  };
}

export function adaptSynonymPair(item, allSynonyms = [], rng = Math.random) {
  const distractors = allSynonyms
    .filter(s => s.id !== item.id)
    .map(s => s.passageMatch)
    .filter(Boolean);
  const pickedDistractors = shuffleArray(distractors, rng).slice(0, 3);
  const options = shuffleArray([item.passageMatch, ...pickedDistractors], rng);
  const englishExp = `In authentic Cambridge exams, "${item.questionStem}" paraphrases to "${item.passageMatch}".`;
  return {
    id: `synonym_${item.id}`,
    rawId: item.id,
    type: 'synonym',
    skillCategory: 'vocab',
    prompt: `Select the authentic Cambridge academic paraphrase for: "${item.questionStem}"`,
    promptEn: `Select the authentic Cambridge academic paraphrase for: "${item.questionStem}"`,
    promptVi: `Chọn từ đồng nghĩa/paraphrase học thuật chuẩn Cambridge cho: "${item.questionStem}"`,
    context: `Category: ${item.category || 'Academic Vocabulary'}`,
    contextEn: `Category: ${item.category || 'Academic Vocabulary'}`,
    options,
    correctIndex: options.indexOf(item.passageMatch),
    correctAnswer: item.passageMatch,
    explanation: englishExp,
    explanationEn: englishExp,
    explanationVi: `Trong đề thi Cambridge, cụm "${item.questionStem}" được paraphrase thành "${item.passageMatch}".`
  };
}

export function adaptReadingDrill(item) {
  const options = ['TRUE', 'FALSE', 'NOT GIVEN'];
  const ans = (item.answer || '').toUpperCase().trim();
  const correctIndex = options.indexOf(ans) !== -1 ? options.indexOf(ans) : 0;
  const standardExplanation = ans === 'TRUE' 
    ? 'The passage directly confirms this statement. The answer is TRUE.'
    : ans === 'FALSE'
    ? 'The statement directly contradicts the facts in the passage. The answer is FALSE.'
    : 'The passage does not provide sufficient information to verify this statement. The answer is NOT GIVEN.';

  return {
    id: `reading_${item.id}`,
    rawId: item.id,
    type: 'tfng',
    skillCategory: 'reading',
    prompt: 'According to the passage, is the statement TRUE, FALSE, or NOT GIVEN?',
    promptEn: 'According to the passage, is the statement TRUE, FALSE, or NOT GIVEN?',
    promptVi: 'Theo đoạn văn, nhận định sau là TRUE, FALSE hay NOT GIVEN?',
    context: `${item.passage || ''}\n\nStatement: "${item.statement || ''}"`,
    contextEn: `${item.passage || ''}\n\nStatement: "${item.statement || ''}"`,
    options,
    correctIndex,
    correctAnswer: options[correctIndex],
    explanation: item.explanationEn || standardExplanation,
    explanationEn: item.explanationEn || standardExplanation,
    explanationVi: item.explanation || standardExplanation
  };
}

const DRILL_LOCALIZATION = {
  'ldrill-sign-1': {
    questionEn: 'Which phrase signals that the speaker is transitioning to examine the primary catalyst?',
    explanationEn: 'The signpost "let us now turn our attention to [X]..." is a classic Part 4 lecture marker introducing the next core key point.'
  },
  'ldrill-sign-2': {
    questionEn: 'Which signposting marker signals that the empirical finding contradicted initial hypotheses?',
    explanationEn: 'The discourse marker "Contrary to previous assumptions..." explicitly introduces counter-intuitive evidence that refutes earlier predictions.'
  },
  'ldrill-dist-flat-2': {
    questionEn: 'How many bedrooms does Flat 2 currently have in reality?',
    optionsEn: ['3 bedrooms', '2 bedrooms', '1 bedroom'],
    explanationEn: 'Potential modification trap: The dining room could be converted in future, but currently Flat 2 has exactly two double bedrooms.'
  },
  'ldrill-dist-sched-1': {
    questionEn: 'At what time did the client and estate agent agree to meet?',
    explanationEn: 'Schedule negotiation: The morning slot is unavailable, so they agree that 1:00 PM is the best viewing appointment.'
  },
  'ldrill-dist-price-5372': {
    questionEn: 'What is the accurate total amount due according to the cashier?',
    explanationEn: 'Number pronunciation trap (43 vs 53): The cashier explicitly confirms the total amount is £53.72.'
  },
  'ldrill-dist-price-350k': {
    questionEn: 'What is the current official asking price of the property?',
    explanationEn: 'Misremembered price distractor: The buyer recalls £340,000, but the estate agent clarifies the asking price is £350,000.'
  },
  'ldrill-dist-dim-master-bed': {
    questionEn: 'What is the corrected length of the master bedroom in meters?',
    optionsEn: ['4.9 meters', '4.91 meters', '3.95 meters', '4.2 meters'],
    explanationEn: 'Self-correction distractor: The agent initially says 4.91m, then immediately apologizes and corrects to 4.9m.'
  },
  'ldrill-dist-motivation-school': {
    questionEn: "What is Caroline's primary motivation for completing the house purchase before summer ends?",
    optionsEn: [
      'Helping her children settle smoothly into their new school',
      'Shortening her husband\'s daily work commute',
      'Ending the uncomfortable stay with relatives',
      'Locking in a lower mortgage interest rate'
    ],
    explanationEn: 'Core priority trap: Caroline clarifies that commuting and staying with relatives are not her main worry; settling children into school is.'
  }
};

export function adaptListeningDrill(item) {
  const loc = DRILL_LOCALIZATION[item.id] || {};
  const optionsEn = (loc.optionsEn || item.options || []).map(o => {
    const text = typeof o === 'string' ? o : (o.textEn || o.text || '');
    return text.replace(/\s*\([^)]*[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ][^)]*\)/g, '').trim();
  });
  const optionsVi = (item.options || []).map(o => {
    const text = typeof o === 'string' ? o : (o.text || o.textEn || '');
    return text;
  });
  const correctIdx = item.options?.findIndex(o => o.id === item.correctOption) ?? 0;
  const safeIdx = correctIdx >= 0 ? correctIdx : 0;
  const cleanAns = optionsEn[safeIdx] || '';
  const defaultEnglishExp = loc.explanationEn || item.explanationEn || `The recording confirms "${cleanAns}" as the correct response based on speaker clarification.`;
  const enQuestion = loc.questionEn || item.questionEn || (item.question && !/[à-ỹÀ-Ỹ]/.test(item.question) ? item.question : 'Listen carefully to the audio and answer:');

  return {
    id: `listening_${item.id}`,
    rawId: item.id,
    type: 'listening_trap',
    skillCategory: 'listening',
    isR2Audio: Boolean(item.audioUrl),
    audioUrl: item.audioUrl || null,
    clipStart: item.clipStart || 0,
    clipEnd: item.clipEnd || 0,
    trackLabel: item.category || null,
    prompt: enQuestion,
    promptEn: enQuestion,
    promptVi: item.questionVi || item.question || 'Nghe đoạn băng và trả lời câu hỏi:',
    context: item.audioSnippetText || item.audioText || '',
    contextEn: item.audioSnippetText || item.audioText || '',
    audioText: item.audioText || item.audioSnippetText || '',
    options: optionsEn,
    optionsEn,
    optionsVi,
    correctIndex: safeIdx,
    correctAnswer: cleanAns,
    explanation: defaultEnglishExp,
    explanationEn: defaultEnglishExp,
    explanationVi: item.explanation || item.distractorMechanism || defaultEnglishExp
  };
}

export function adaptListeningSpellingDrill(item) {
  const acceptable = item.acceptableAnswers || [item.correctAnswer];
  const englishExp = item.explanationEn || `The recording confirms the exact spelling or code as "${item.correctAnswer}".`;
  const formStemEn = item.questionPromptEn || item.questionPrompt || '';
  const formStemVi = item.questionPromptVi || item.questionPrompt || '';

  const promptEn = formStemEn 
    ? `Listen to the audio and complete the note: "${formStemEn}"`
    : 'Listen to the audio and type the exact spelling, name or code:';
  const promptVi = formStemVi
    ? `Nghe audio và điền vào chỗ trống: "${formStemVi}"`
    : 'Nghe đoạn audio và gõ chính xác tên, từ ngữ hoặc mã số:';

  return {
    id: `listen_spell_${item.id}`,
    rawId: item.id,
    type: 'listening_spelling',
    interactionType: 'text_input',
    strictSpelling: true,
    acceptableAnswers: acceptable,
    placeholder: 'Type what you hear and press Enter...',
    placeholderEn: 'Type what you hear and press Enter...',
    placeholderVi: 'Gõ từ hoặc con số bạn nghe được rồi nhấn Enter...',
    skillCategory: 'listening',
    isR2Audio: Boolean(item.audioUrl),
    audioUrl: item.audioUrl || null,
    clipStart: item.clipStart || 0,
    clipEnd: item.clipEnd || 0,
    trackLabel: item.category || null,
    prompt: promptEn,
    promptEn,
    promptVi,
    context: formStemEn,
    contextEn: formStemEn,
    contextVi: formStemVi,
    formStem: formStemEn,
    formStemVi,
    audioText: item.audioText || item.promptAudioText || '',
    options: (() => {
      const correct = item.correctAnswer || (acceptable && acceptable[0]) || '';
      const optSet = new Set([correct]);
      if (Array.isArray(acceptable)) {
        acceptable.forEach(a => { if (a && a !== correct) optSet.add(a); });
      }
      const fallbackDistractors = [
        correct.toUpperCase(),
        correct.toLowerCase(),
        correct.charAt(0).toUpperCase() + correct.slice(1).toLowerCase(),
        correct.endsWith('e') ? correct.slice(0, -1) : correct + 'e',
        correct.endsWith('s') ? correct.slice(0, -1) : correct + 's',
        correct.replace(/c/g, 'k'),
        correct.replace(/tion/g, 'sion'),
        correct.replace(/mm/g, 'm'),
        correct.replace(/ll/g, 'l'),
        correct.replace(/tt/g, 't')
      ];
      for (const d of fallbackDistractors) {
        if (d && !optSet.has(d)) {
          optSet.add(d);
          if (optSet.size >= 4) break;
        }
      }
      let filler = 1;
      while (optSet.size < 3) {
        optSet.add(`${correct} (Variant ${filler++})`);
      }
      return Array.from(optSet);
    })(),
    correctIndex: 0,
    correctAnswer: item.correctAnswer,
    explanation: englishExp,
    explanationEn: englishExp,
    explanationVi: item.explanation || englishExp
  };
}

/**
 * Generates a dedicated 7-question Listening Audio Sprint powered by Cloudflare R2 studio tracks (Tracks 2-7).
 */
export function generateR2ListeningSprintQuestions({
  count = 7,
  rng = Math.random,
  difficulty = 'medium'
} = {}) {
  const r2BankQuestions = ARENA_QUESTION_BANK.filter(q => q.isR2Audio || q.audioUrl);
  const r2MicroDistractors = (LISTENING_MICRO_DRILLS || [])
    .filter(d => d.type === 'listening-distractor' && d.audioUrl)
    .map(adaptListeningDrill);
  const r2MicroSpelling = (LISTENING_MICRO_DRILLS || [])
    .filter(d => d.type === 'listening-spelling' && d.audioUrl)
    .map(adaptListeningSpellingDrill);

  const combinedR2Pool = [
    ...r2BankQuestions,
    ...r2MicroDistractors,
    ...r2MicroSpelling
  ];

  const unseenR2 = combinedR2Pool.filter(q => getQuestionMasteryStatus(q.id) === 'unseen');
  const restR2 = combinedR2Pool.filter(q => getQuestionMasteryStatus(q.id) !== 'unseen');

  const orderedPool = [...shuffleArray(unseenR2, rng), ...shuffleArray(restR2, rng)];
  const selected = [];
  const seenIds = new Set();

  for (const q of orderedPool) {
    if (selected.length >= count) break;
    if (!seenIds.has(q.id)) {
      seenIds.add(q.id);
      selected.push(q);
    }
  }

  return selected.map((q, idx) => {
    const normalized = {
      ...q,
      type: q.type || 'listening_trap',
      difficulty: q.difficulty || difficulty,
      topic: q.topic || 'urbanization',
      isBossQuestion: idx === selected.length - 1
    };
    return shuffleQuestionOptions(normalized, rng);
  }).filter(q => validateArenaQuestion(q).valid);
}

/**
 * Generates balanced sprint questions (default: 7 questions for 180s sprint),
 * respecting the 7-Slot Blueprint, 2-Hit Mastery, Max 1 Revenge Question,
 * Ebbinghaus Spaced Decay, and Safe Shuffling.
 * 
 * @param {Object} [options]
 * @param {number} [options.count=7]
 * @param {() => number} [options.rng=Math.random]
 * @param {boolean} [options.recordHistory=true]
 * @param {string} [options.difficulty='medium']
 * @param {string} [options.topic=null]
 * @returns {Array<Object>}
 */
export function generateArenaSprintQuestions({ 
  count = 7, 
  rng = Math.random, 
  recordHistory = true, 
  difficulty = 'medium', 
  topic = null 
} = {}) {
  const randomTopicObj = ARENA_IELTS_TOPICS[Math.floor(rng() * ARENA_IELTS_TOPICS.length)];
  const activeTopic = topic || randomTopicObj?.id || 'environment';
  const currentMatch = getCompletedMatchCount() + 1;

  // 1. Fetch targeted questions matching difficulty and topic + include all R2 audio questions so they are always eligible
  const targetedBank = getQuestionsByTierAndTopic(difficulty, topic);
  const r2ArenaQuestions = ARENA_QUESTION_BANK.filter(q => q.isR2Audio || q.audioUrl);
  const eligibleBank = filterEligibleQuestions([...r2ArenaQuestions, ...targetedBank], count * 3);

  // Micro-drill pools for backfill and multi-skill diversity
  const spellingPool = (IELTS_SPELLING_TRAPS || []).map(item => adaptSpellingTrap(item, rng));
  const synonymPool = (CAMBRIDGE_SYNONYM_PAIRS || []).map(item => adaptSynonymPair(item, CAMBRIDGE_SYNONYM_PAIRS, rng));
  const readingPool = (READING_MICRO_DRILLS || []).filter(d => d.type === 'reading-tfng').map(adaptReadingDrill);
  const listeningPool = (LISTENING_MICRO_DRILLS || []).filter(d => d.type === 'listening-distractor').map(adaptListeningDrill);
  const listeningSpellingPool = (LISTENING_MICRO_DRILLS || []).filter(d => d.type === 'listening-spelling').map(adaptListeningSpellingDrill);

  const candidatePool = [
    ...eligibleBank,
    ...spellingPool,
    ...synonymPool,
    ...readingPool,
    ...listeningPool,
    ...listeningSpellingPool
  ];

  // 2. Classify candidate questions by Mastery State
  const eligibleRevenge = getEligibleRevengeQuestions(candidatePool, currentMatch);
  
  // Fresh questions: Unseen, Familiar (1 correct), or Refresh Review (Ebbinghaus decayed after 14 days)
  const freshPool = candidatePool.filter(q => {
    const status = getQuestionMasteryStatus(q.id);
    return status === 'unseen' || status === 'familiar' || status === 'refresh_review';
  });

  // Mastered questions for Soft Recycling fallback
  const masteredPool = candidatePool.filter(q => getQuestionMasteryStatus(q.id) === 'mastered');

  const selected = [];
  const selectedIds = new Set();

  const addQuestion = (q, isRevenge = false) => {
    if (!q || selectedIds.has(q.id)) return false;
    selectedIds.add(q.id);
    selected.push({
      ...q,
      isRevengeQuestion: isRevenge
    });
    return true;
  };

  // 3. APPLY 7-SLOT BLUEPRINT (if count === 7)
  if (count === 7) {
    // SLOT 1: Guarantee 1 R2 Real-Audio Listening or Spelling question right at the start of the Sprint!
    const r2FastCandidates = freshPool.filter(q => q.isR2Audio || q.audioUrl);
    if (r2FastCandidates.length > 0) {
      const shuffledR2Fast = shuffleArray(r2FastCandidates, rng);
      addQuestion(shuffledR2Fast[0]);
    }

    // SLOT 2: Fast Reflex Type-In (Spelling Demons or Listening Spelling interactive text_input)
    const textInputCandidates = freshPool.filter(q => 
      !selectedIds.has(q.id) && q.interactionType === 'text_input'
    );
    if (textInputCandidates.length > 0) {
      const shuffledTextInput = shuffleArray(textInputCandidates, rng);
      addQuestion(shuffledTextInput[0]);
    } else {
      const fastReflexCandidates = freshPool.filter(q => 
        !selectedIds.has(q.id) && q.skillCategory === 'vocab'
      );
      const shuffledFast = shuffleArray(fastReflexCandidates, rng);
      for (let i = 0; i < shuffledFast.length && selected.length < 2; i++) {
        addQuestion(shuffledFast[i]);
      }
    }

    // SLOT 3 & 4: Core Analysis (Grammar / Collocation / TFNG) + REVENGE QUESTION SLOT (Max 1)
    if (eligibleRevenge.length > 0) {
      // Pick exactly ONE cooling-off revenge question
      const pickedRevenge = shuffleArray(eligibleRevenge, rng)[0];
      addQuestion(pickedRevenge, true);
    }

    const coreAnalysisCandidates = freshPool.filter(q => 
      !selectedIds.has(q.id) && (q.skillCategory === 'grammar' || q.skillCategory === 'reading' || q.type === 'tfng' || q.isR2Audio)
    );
    const shuffledCore = shuffleArray(coreAnalysisCandidates, rng);
    for (let i = 0; i < shuffledCore.length && selected.length < 4; i++) {
      addQuestion(shuffledCore[i]);
    }

    // SLOT 5 & 6: Tactical Reading (Micro-Scanning / Distractor Traps)
    const readingCandidates = freshPool.filter(q => 
      !selectedIds.has(q.id) && (q.skillCategory === 'reading' || q.type === 'tfng')
    );
    const shuffledReading = shuffleArray(readingCandidates, rng);
    for (let i = 0; i < shuffledReading.length && selected.length < 6; i++) {
      addQuestion(shuffledReading[i]);
    }

    // SLOT 7: The Boss Stage (Prioritize R2 Listening Audio Boss Trap)
    const r2BossCandidates = freshPool.filter(q => 
      !selectedIds.has(q.id) && (q.isR2Audio || q.audioUrl)
    );
    const bossCandidates = r2BossCandidates.length > 0
      ? r2BossCandidates
      : freshPool.filter(q => 
          !selectedIds.has(q.id) && (q.skillCategory === 'listening' || q.type === 'listening_trap' || q.difficulty === 'hard' || q.difficulty === 'nightmare')
        );
    const shuffledBoss = shuffleArray(bossCandidates, rng);
    if (shuffledBoss.length > 0) {
      addQuestion({ ...shuffledBoss[0], isBossQuestion: true });
    }
  }

  // 4. BACKFILL & SOFT RECYCLING PROTECTION (Guarantees exact requested count, 0% crashes)
  if (selected.length < count) {
    // Fill from remaining fresh candidates
    const remainingFresh = freshPool.filter(q => !selectedIds.has(q.id));
    const shuffledRemFresh = shuffleArray(remainingFresh, rng);
    for (let i = 0; i < shuffledRemFresh.length && selected.length < count; i++) {
      addQuestion(shuffledRemFresh[i]);
    }
  }

  if (selected.length < count) {
    // Soft Recycling: Borrow mastered questions sorted by least-recently-seen
    const sortedMastered = [...masteredPool].sort((a, b) => {
      const timeA = getQuestionMeta(a.id)?.lastAttemptTime || 0;
      const timeB = getQuestionMeta(b.id)?.lastAttemptTime || 0;
      return timeA - timeB;
    });
    for (let i = 0; i < sortedMastered.length && selected.length < count; i++) {
      if (!selectedIds.has(sortedMastered[i].id)) {
        addQuestion(sortedMastered[i]);
      }
    }
  }

  // Final fallback to entire candidate pool if still under count
  if (selected.length < count) {
    const fallbackAll = candidatePool.filter(q => !selectedIds.has(q.id));
    const shuffledAll = shuffleArray(fallbackAll, rng);
    for (let i = 0; i < shuffledAll.length && selected.length < count; i++) {
      addQuestion(shuffledAll[i]);
    }
  }

  // 5. NORMALIZE, SAFE SHUFFLE DISTRACTORS & VALIDATE
  const finalQuestions = selected.slice(0, count).map((q, idx) => {
    const normalized = {
      ...q,
      type: q.type || (q.skillCategory === 'reading' ? 'tfng' : q.skillCategory === 'listening' ? 'listening_trap' : 'vocab'),
      difficulty: difficulty || q.difficulty || 'medium',
      topic: topic || q.topic || activeTopic,
      isBossQuestion: q.isBossQuestion || (idx === count - 1 && count >= 5)
    };
    // Apply Safe Distractor Shuffling (preserves TFNG standard layout)
    return shuffleQuestionOptions(normalized, rng);
  }).filter(q => validateArenaQuestion(q).valid);

  // 6. UPDATE COOLDOWN LOG
  if (recordHistory) {
    recordServedQuestions(finalQuestions.map(q => q.id));
  }

  return finalQuestions;
}
