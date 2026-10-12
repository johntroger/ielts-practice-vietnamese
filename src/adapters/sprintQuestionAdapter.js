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
import { ARENA_QUESTION_BANK, getQuestionsByTierAndTopic } from '../data/arenaQuestionBank.js';
import { ARENA_IELTS_TOPICS } from '../utils/arenaStorageKeys.js';
import { filterEligibleQuestions, recordServedQuestions } from './sprintCooldownService.js';
import { balanceQuestionsBySkill, validateArenaQuestion } from '../services/gamification/skillBalancingEngine.js';

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
 * @param {string} [options.difficulty='medium']
 * @param {string} [options.topic=null]
 * @returns {Array<Object>}
 */
export function generateArenaSprintQuestions({ count = 7, rng = Math.random, recordHistory = true, difficulty = 'medium', topic = null } = {}) {
  const randomTopicObj = ARENA_IELTS_TOPICS[Math.floor(rng() * ARENA_IELTS_TOPICS.length)];
  const activeTopic = topic || randomTopicObj?.id || 'environment';

  // 1. Fetch questions from rich 4-tier bank matching difficulty and topic
  const targetedBank = getQuestionsByTierAndTopic(difficulty, topic);
  const eligibleBank = filterEligibleQuestions(targetedBank, count * 2);

  // Legacy micro-drill pools for backfill and skill diversity
  const spellingPool = (IELTS_SPELLING_TRAPS || []).map(item => adaptSpellingTrap(item, rng));
  const synonymPool = (CAMBRIDGE_SYNONYM_PAIRS || []).map(item => adaptSynonymPair(item, CAMBRIDGE_SYNONYM_PAIRS, rng));
  const readingPool = (READING_MICRO_DRILLS || []).filter(d => d.type === 'reading-tfng').map(adaptReadingDrill);
  const listeningPool = (LISTENING_MICRO_DRILLS || []).filter(d => d.type === 'listening-distractor').map(adaptListeningDrill);

  const candidatePool = [
    ...eligibleBank,
    ...spellingPool,
    ...synonymPool,
    ...readingPool,
    ...listeningPool
  ];

  // 2. Apply Dynamic Skill Balancing according to the Golden Pedagogical Ratio
  const balanced = balanceQuestionsBySkill(candidatePool, count, rng);

  // 3. Graceful backfill if balanced count is lower than requested
  let selected = [...balanced];
  if (selected.length < count) {
    const existingIds = new Set(selected.map(q => q.id));
    const leftovers = candidatePool.filter(q => !existingIds.has(q.id));
    selected.push(...shuffleArray(leftovers, rng).slice(0, count - selected.length));
  }

  // 4. Normalize and runtime schema validation
  const finalQuestions = selected.slice(0, count).map(q => ({
    ...q,
    type: q.type || (q.skillCategory === 'reading' ? 'tfng' : q.skillCategory === 'listening' ? 'listening_trap' : 'vocab'),
    difficulty: q.difficulty || difficulty,
    topic: q.topic || activeTopic
  })).filter(q => validateArenaQuestion(q).valid);

  // 5. Update cooldown log with newly served questions
  if (recordHistory) {
    recordServedQuestions(finalQuestions.map(q => q.id));
  }

  return finalQuestions;
}
