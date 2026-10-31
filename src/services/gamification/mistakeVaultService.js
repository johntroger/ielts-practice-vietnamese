/**
 * src/services/gamification/mistakeVaultService.js
 * 
 * Persistent Mistake Vault & Revenge Sprint Generator for Atlas English Arena v8.0.
 * Bulletproof & Pragmatic:
 * - Hard-capped to the most recent 50 mistakes (FIFO) to prevent storage bloat.
 * - Diagnostic tagging (Over-inference, Reversal trap, Spelling demon, Hedging absence).
 * - Generates targeted Revenge Sprints from unresolved mistakes.
 */

import { safeGet, safeSet } from '../../utils/storageService.js';

export const MISTAKE_VAULT_STORAGE_KEY = 'atlas_arena_mistake_vault_v8';
export const MAX_STORED_MISTAKES = 50;

/**
 * Diagnostic Tag Resolver for mistakes.
 * @param {Object} q - The question object
 * @returns {string} One of: 'over_inference' | 'reversal_trap' | 'spelling_demon' | 'hedging_absence' | 'general'
 */
export function getDiagnosticTag(q) {
  if (!q) return 'general';
  if (q.type === 'spelling' || q.skillCategory === 'spelling') return 'spelling_demon';
  if (q.type === 'tfng' || q.skillCategory === 'reading') return 'over_inference';
  if (q.type === 'listening_trap' || q.skillCategory === 'listening') return 'reversal_trap';
  if (q.type === 'hedging' || q.skillCategory === 'grammar') return 'hedging_absence';
  return 'general';
}

/**
 * Retrieves all stored mistakes from persistent storage.
 * @returns {Array<Object>}
 */
export function getStoredMistakes() {
  return safeGet(MISTAKE_VAULT_STORAGE_KEY, []);
}

/**
 * Returns count of unresolved mistakes.
 * @returns {number}
 */
export function getUnresolvedMistakeCount() {
  const list = getStoredMistakes();
  return list.filter(m => !m.resolved).length;
}

/**
 * Records a missed question into the vault.
 * Enforces FIFO cap of 50 mistakes.
 * 
 * @param {Object} question - The arena question object
 * @param {number|null} userSelectedOption - The index of the option chosen by user
 * @returns {Array<Object>} Updated list of mistakes
 */
export function recordMistake(question, userSelectedOption = null) {
  if (!question || !question.id) return getStoredMistakes();

  const current = getStoredMistakes();
  const existingIdx = current.findIndex(m => m.id === question.id);

  const entry = {
    id: question.id,
    question,
    userSelectedOption,
    userSelectedAnswer: question.options?.[userSelectedOption] || null,
    correctAnswer: question.correctAnswer || question.options?.[question.correctIndex],
    explanation: question.explanation || '',
    cambridgeSource: question.cambridgeSource || '',
    skillCategory: question.skillCategory || 'vocab',
    difficulty: question.difficulty || 'medium',
    topic: question.topic || 'general',
    diagnosticTag: getDiagnosticTag(question),
    mistakeCount: 1,
    resolved: false,
    lastMissedAt: Date.now()
  };

  let updated;
  if (existingIdx !== -1) {
    entry.mistakeCount = (current[existingIdx].mistakeCount || 1) + 1;
    // Move to front
    updated = [entry, ...current.filter((_, idx) => idx !== existingIdx)];
  } else {
    updated = [entry, ...current];
  }

  // Strict FIFO cap at 50
  const capped = updated.slice(0, MAX_STORED_MISTAKES);
  safeSet(MISTAKE_VAULT_STORAGE_KEY, capped);
  return capped;
}

/**
 * Marks a question as resolved after a successful revenge answer.
 * @param {string} questionId 
 * @returns {boolean} Whether an entry was marked resolved
 */
export function resolveMistake(questionId) {
  if (!questionId) return false;
  const current = getStoredMistakes();
  let found = false;

  const updated = current.map(m => {
    if (m.id === questionId) {
      found = true;
      return { ...m, resolved: true, resolvedAt: Date.now() };
    }
    return m;
  });

  if (found) {
    safeSet(MISTAKE_VAULT_STORAGE_KEY, updated);
  }
  return found;
}

/**
 * Pardons (resolves) up to `count` unresolved mistakes via Pardon Scroll.
 * @param {number} count 
 * @returns {number} Number of mistakes successfully pardoned
 */
export function pardonMistakes(count = 2) {
  const current = getStoredMistakes();
  const unresolved = current.filter(m => !m.resolved);
  if (unresolved.length === 0) return 0;

  const toPardonIds = new Set(unresolved.slice(0, count).map(m => m.id));
  const updated = current.map(m => {
    if (toPardonIds.has(m.id)) {
      return { ...m, resolved: true, resolvedAt: Date.now(), pardoned: true };
    }
    return m;
  });

  safeSet(MISTAKE_VAULT_STORAGE_KEY, updated);
  return toPardonIds.size;
}

/**
 * Removes resolved mistakes from the vault.
 * @returns {Array<Object>} Remaining unresolved mistakes
 */
export function purgeResolvedMistakes() {
  const current = getStoredMistakes();
  const unresolved = current.filter(m => !m.resolved);
  safeSet(MISTAKE_VAULT_STORAGE_KEY, unresolved);
  return unresolved;
}

/**
 * Clears the entire mistake vault.
 */
export function clearMistakeVault() {
  safeSet(MISTAKE_VAULT_STORAGE_KEY, []);
}

/**
 * Generates a targeted Revenge Sprint question set from unresolved mistakes.
 * @param {Object} [options]
 * @param {number} [options.count=10]
 * @param {Function} [options.rng=Math.random]
 * @returns {Array<Object>}
 */
export function generateRevengeSprintQuestions({ count = 10, rng = Math.random } = {}) {
  const allMistakes = getStoredMistakes().filter(m => !m.resolved);
  if (allMistakes.length === 0) return [];

  // Shuffle and pick up to count
  const shuffled = [...allMistakes].sort(() => rng() - 0.5);
  const picked = shuffled.slice(0, count).map(m => ({
    ...m.question,
    isRevengeQuestion: true,
    previousMistakeCount: m.mistakeCount,
    diagnosticTag: m.diagnosticTag
  }));

  return picked;
}
