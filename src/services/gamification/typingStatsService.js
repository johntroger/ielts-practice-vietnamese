/**
 * src/services/gamification/typingStatsService.js
 * 
 * Persistent Lexical Typing & Spelling Demons Analytics Service for Atlas English Arena.
 * Tracks:
 * - Total words typed
 * - Accuracy percentage
 * - Near-Miss Grace rescues
 * - Skipped typing questions
 * - Top misspelled demons (frequency tracker)
 * - Typing mastery badges
 */

import { safeGet, safeSet } from '../../utils/storageService.js';

export const TYPING_STATS_STORAGE_KEY = 'ielts_arena_typing_stats_v1';

export const INITIAL_TYPING_STATS = {
  totalTyped: 0,
  correctCount: 0,
  nearMissRescued: 0,
  skippedCount: 0,
  demons: {}
};

/**
 * Retrieve current typing stats with computed accuracy rate.
 * @returns {{ totalTyped: number, correctCount: number, nearMissRescued: number, skippedCount: number, accuracyRate: number, demons: Record<string, number> }}
 */
export function getTypingStats() {
  const raw = safeGet(TYPING_STATS_STORAGE_KEY, INITIAL_TYPING_STATS);
  const totalTyped = Number(raw.totalTyped) || 0;
  const correctCount = Number(raw.correctCount) || 0;
  const nearMissRescued = Number(raw.nearMissRescued) || 0;
  const skippedCount = Number(raw.skippedCount) || 0;
  const demons = (raw.demons && typeof raw.demons === 'object') ? raw.demons : {};

  const accuracyRate = totalTyped > 0 ? Math.round((correctCount / totalTyped) * 100) : 0;

  return {
    totalTyped,
    correctCount,
    nearMissRescued,
    skippedCount,
    accuracyRate,
    demons
  };
}

/**
 * Record a typing attempt in persistent storage.
 * @param {Object} params
 * @param {string} params.word - The target word
 * @param {boolean} params.isCorrect - Whether user succeeded
 * @param {boolean} [params.wasNearMissRescued=false] - Whether this was rescued after a near-miss grace
 * @param {boolean} [params.isSkipped=false] - Whether question was skipped
 * @returns {Object} Updated stats
 */
export function recordTypingAttempt({ word, isCorrect, wasNearMissRescued = false, isSkipped = false }) {
  const current = getTypingStats();
  const next = {
    ...current,
    totalTyped: current.totalTyped + 1,
    demons: { ...current.demons }
  };

  if (isCorrect) {
    next.correctCount += 1;
    if (wasNearMissRescued) {
      next.nearMissRescued += 1;
    }
  } else {
    if (isSkipped) {
      next.skippedCount += 1;
    }
    const cleanWord = String(word || '').trim().toLowerCase();
    if (cleanWord) {
      next.demons[cleanWord] = (next.demons[cleanWord] || 0) + 1;
    }
  }

  safeSet(TYPING_STATS_STORAGE_KEY, next);
  return getTypingStats();
}

/**
 * Retrieve top spelling demons ordered by mistake frequency descending.
 * @param {number} [limit=5]
 * @returns {Array<{ word: string, count: number }>}
 */
export function getTopSpellingDemons(limit = 5) {
  const { demons } = getTypingStats();
  return Object.entries(demons)
    .map(([word, count]) => ({ word, count: Number(count) || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Calculate typing badges based on current performance stats.
 * @param {Object} [customStats] - Optional stats object (defaults to getTypingStats())
 * @returns {Array<{ id: string, nameEn: string, nameVi: string, descEn: string, descVi: string, unlocked: boolean, icon: string }>}
 */
export function getTypingBadges(customStats) {
  const stats = customStats || getTypingStats();

  return [
    {
      id: 'typing_scout',
      nameEn: 'Spelling Scout',
      nameVi: 'Thợ Săn Chính Tả',
      descEn: 'Typed 5+ words in the Arena',
      descVi: 'Đã gõ từ 5 câu trở lên trong Arena',
      unlocked: stats.totalTyped >= 5,
      icon: '⌨️'
    },
    {
      id: 'near_miss_savior',
      nameEn: 'Near-Miss Savior',
      nameVi: 'Cứu Tinh Suýt Đúng',
      descEn: 'Rescued combo during near-miss grace',
      descVi: 'Cứu combo thành công trong thời gian ân hạn',
      unlocked: stats.nearMissRescued >= 1,
      icon: '⚡'
    },
    {
      id: 'flawless_speller',
      nameEn: 'Flawless Speller',
      nameVi: 'Bậc Thầy Không Lỗi',
      descEn: '80%+ accuracy with 15+ words typed',
      descVi: 'Đạt độ chính xác 80%+ với 15+ từ đã gõ',
      unlocked: stats.totalTyped >= 15 && stats.accuracyRate >= 80,
      icon: '🏆'
    },
    {
      id: 'lexical_titan',
      nameEn: 'Lexical Titan',
      nameVi: 'Đại Kiện Tướng Từ Vựng',
      descEn: 'Typed 30+ Cambridge words',
      descVi: 'Chinh phục 30+ từ vựng Cambridge',
      unlocked: stats.totalTyped >= 30,
      icon: '🔥'
    }
  ];
}

/**
 * Reset typing stats (for testing or profile clear).
 */
export function resetTypingStats() {
  safeSet(TYPING_STATS_STORAGE_KEY, INITIAL_TYPING_STATS);
  return getTypingStats();
}
