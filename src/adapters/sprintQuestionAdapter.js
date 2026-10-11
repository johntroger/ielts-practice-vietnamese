/**
 * src/adapters/sprintQuestionAdapter.js
 * 
 * Standardized Question Normalizer & Fast-Paced Sprint Generator.
 * Consolidates Cambridge Spelling Traps, Synonyms, Reading Traps & Listening Traps
 * into an identical 7-question sprint schema for Atlas English Arena.
 */

import { IELTS_SPELLING_TRAPS, CAMBRIDGE_SYNONYM_PAIRS } from '../data/vocabGrammarSpellingData.js';
import { READING_MICRO_DRILLS } from '../data/readingMicroDrills.js';
import { LISTENING_MICRO_DRILLS } from '../data/listeningMicroDrills.js';
import { filterEligibleQuestions, recordServedQuestions } from './sprintCooldownService.js';

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

export function adaptSpellingTrap(item, rng = Math.random) {
  const rawOptions = [item.correct, ...(item.distractors || []).slice(0, 3)];
  const options = shuffleArray(rawOptions, rng);
  return {
    id: `spelling_${item.id}`,
    rawId: item.id,
    type: 'spelling',
    skillCategory: 'vocab',
    prompt: 'Select the authentic Cambridge academic spelling:',
    context: item.contextSentence || '',
    options,
    correctIndex: options.indexOf(item.correct),
    correctAnswer: item.correct,
    explanation: item.explanation || item.rule || ''
  };
}

export function adaptSynonymPair(item, allSynonyms = [], rng = Math.random) {
  const distractors = allSynonyms
    .filter(s => s.id !== item.id)
    .map(s => s.passageMatch)
    .filter(Boolean);
  const pickedDistractors = shuffleArray(distractors, rng).slice(0, 3);
  const options = shuffleArray([item.passageMatch, ...pickedDistractors], rng);
  return {
    id: `synonym_${item.id}`,
    rawId: item.id,
    type: 'synonym',
    skillCategory: 'vocab',
    prompt: `Match the Cambridge academic paraphrase for: "${item.questionStem}"`,
    context: `Category: ${item.category || 'Academic Vocabulary'}`,
    options,
    correctIndex: options.indexOf(item.passageMatch),
    correctAnswer: item.passageMatch,
    explanation: `In authentic Cambridge exams, "${item.questionStem}" paraphrases to "${item.passageMatch}".`
  };
}

export function adaptReadingDrill(item) {
  const options = ['TRUE', 'FALSE', 'NOT GIVEN'];
  const ans = (item.answer || '').toUpperCase().trim();
  const correctIndex = options.indexOf(ans) !== -1 ? options.indexOf(ans) : 0;
  return {
    id: `reading_${item.id}`,
    rawId: item.id,
    type: 'tfng',
    skillCategory: 'reading',
    prompt: 'Determine whether the statement is TRUE, FALSE, or NOT GIVEN:',
    context: `${item.passage || ''}\n\nStatement: "${item.statement || ''}"`,
    options,
    correctIndex,
    correctAnswer: options[correctIndex],
    explanation: item.explanation || item.explanationEn || ''
  };
}

export function adaptListeningDrill(item) {
  const rawOpts = (item.options || []).map(o => (typeof o === 'string' ? o : o.text));
  const correctIdx = item.options?.findIndex(o => o.id === item.correctOption) ?? 0;
  const safeIdx = correctIdx >= 0 ? correctIdx : 0;
  return {
    id: `listening_${item.id}`,
    rawId: item.id,
    type: 'listening_trap',
    skillCategory: 'listening',
    prompt: item.question || 'Listen carefully to the audio and answer:',
    context: item.audioSnippetText || item.audioText || '',
    audioText: item.audioText || item.audioSnippetText || '',
    options: rawOpts,
    correctIndex: safeIdx,
    correctAnswer: rawOpts[safeIdx] || '',
    explanation: item.explanation || item.distractorMechanism || ''
  };
}

/**
 * Generates exactly 7 balanced sprint questions, respecting rotation cooldown.
 * @param {Object} [options]
 * @param {number} [options.count=7]
 * @param {() => number} [options.rng=Math.random]
 * @param {boolean} [options.recordHistory=true]
 * @returns {Array<Object>}
 */
export function generateArenaSprintQuestions({ count = 7, rng = Math.random, recordHistory = true } = {}) {
  // 1. Convert all pools to normalized arena questions
  const spellingPool = (IELTS_SPELLING_TRAPS || []).map(item => adaptSpellingTrap(item, rng));
  const synonymPool = (CAMBRIDGE_SYNONYM_PAIRS || []).map(item => adaptSynonymPair(item, CAMBRIDGE_SYNONYM_PAIRS, rng));
  const readingPool = (READING_MICRO_DRILLS || []).filter(d => d.type === 'reading-tfng').map(adaptReadingDrill);
  const listeningPool = (LISTENING_MICRO_DRILLS || []).filter(d => d.type === 'listening-distractor').map(adaptListeningDrill);

  // 2. Filter pools through Cooldown Engine
  const eligSpelling = filterEligibleQuestions(spellingPool, 2);
  const eligSynonym = filterEligibleQuestions(synonymPool, 2);
  const eligReading = filterEligibleQuestions(readingPool, 2);
  const eligListening = filterEligibleQuestions(listeningPool, 1);

  // 3. Select balanced composition (2 spelling, 2 synonym, 2 reading, 1 listening)
  const selected = [
    ...shuffleArray(eligSpelling, rng).slice(0, 2),
    ...shuffleArray(eligSynonym, rng).slice(0, 2),
    ...shuffleArray(eligReading, rng).slice(0, 2),
    ...shuffleArray(eligListening, rng).slice(0, 1)
  ];

  // 4. Fill from combined remaining pools if any pool was short
  if (selected.length < count) {
    const existingIds = new Set(selected.map(q => q.id));
    const leftovers = [...spellingPool, ...synonymPool, ...readingPool, ...listeningPool]
      .filter(q => !existingIds.has(q.id));
    selected.push(...shuffleArray(leftovers, rng).slice(0, count - selected.length));
  }

  const finalQuestions = shuffleArray(selected.slice(0, count), rng);

  // 5. Update cooldown log with newly served questions
  if (recordHistory) {
    recordServedQuestions(finalQuestions.map(q => q.id));
  }

  return finalQuestions;
}
