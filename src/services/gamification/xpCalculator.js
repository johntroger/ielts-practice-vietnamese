/**
 * src/services/gamification/xpCalculator.js
 * 
 * Mathematical Scoring Engine for Atlas English Arena:
 * - Anti-Grinding Soft-Cap Daily Curve (100% -> 70% -> 40%)
 * - Streak Combo Multipliers
 * - Speed bonus for fast answers
 * - Absolute Mathematical Hard Cap: max 200 XP per sprint
 */

import { safeGet, safeSet } from '../../utils/storageService.js';
import { ARENA_STORAGE_KEYS, ARENA_XP_CAPS, ARENA_DIFFICULTY_CONFIG } from '../../utils/arenaStorageKeys.js';
import { getLocalDateKey } from '../../utils/dateHelper.js';

/**
 * Returns current daily sprint count, resetting if day has changed.
 */
export function getDailySprintCount() {
  const today = getLocalDateKey();
  const savedDate = safeGet(ARENA_STORAGE_KEYS.DAILY_SPRINT_DATE, '');
  if (savedDate !== today) {
    safeSet(ARENA_STORAGE_KEYS.DAILY_SPRINT_DATE, today);
    safeSet(ARENA_STORAGE_KEYS.DAILY_SPRINT_COUNT, 0);
    return 0;
  }
  return Number(safeGet(ARENA_STORAGE_KEYS.DAILY_SPRINT_COUNT, 0));
}

/**
 * Increments daily sprint count.
 */
export function incrementDailySprintCount() {
  const count = getDailySprintCount();
  const next = count + 1;
  safeSet(ARENA_STORAGE_KEYS.DAILY_SPRINT_COUNT, next);
  return next;
}

/**
 * Returns the Soft-Cap multiplier (1.0 -> 0.7 -> 0.4) based on today's sprint count.
 * - Sprints 1 to 3: 100% (1.0)
 * - Sprints 4 to 6: 70% (0.7)
 * - Sprints 7+: 40% (0.4)
 */
export function getDailySoftCapMultiplier(sprintIndex = getDailySprintCount()) {
  if (sprintIndex < 3) return 1.0;
  if (sprintIndex < 6) return 0.7;
  return 0.4;
}

/**
 * Calculates Time Bonus XP with a strict pedagogical hard cap (30% of Base XP).
 * Time Bonus = remainingSeconds * 0.5, capped at round(0.30 * baseScore).
 * Only awarded when correctAnswers >= 6.
 * 
 * @param {Object} params
 * @param {number} params.remainingSeconds - Seconds remaining on the clock
 * @param {number} params.baseScore - Base XP earned from correct answers
 * @param {number} params.correctAnswers - Number of correct answers in the sprint
 * @returns {number}
 */
export function calculateTimeBonusXp({ remainingSeconds = 0, baseScore = 0, correctAnswers = 0 } = {}) {
  if (correctAnswers < 6 || remainingSeconds <= 0 || baseScore <= 0) {
    return 0;
  }
  const rawBonus = Math.round(remainingSeconds * 0.5);
  const cap = Math.round(0.30 * baseScore);
  return Math.min(rawBonus, cap);
}

export const ARENA_LOOT_TIERS = {
  SCROLL: {
    id: 'cambridge_scroll',
    nameVi: 'Cuộn Giấy Cổ Cambridge',
    nameEn: 'Ancient Cambridge Scroll',
    icon: '📜',
    bonusXp: 15,
    badgeColor: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
    descVi: 'Bí kíp ghi chép các cặp từ paraphrase bất hủ (+15 XP)',
    descEn: 'Sacred notes revealing timeless Cambridge paraphrases (+15 XP)'
  },
  CRYSTAL: {
    id: 'acoustic_crystal',
    nameVi: 'Pha Lê Thính Giác',
    nameEn: 'Acoustic Resonance Crystal',
    icon: '💎',
    bonusXp: 20,
    badgeColor: 'border-purple-500/50 bg-purple-500/10 text-purple-300',
    descVi: 'Tinh thể tăng cường khả năng miễn nhiễm bẫy âm học (+20 XP)',
    descEn: 'Resonating crystal heightening trap immunity (+20 XP)'
  },
  CROWN: {
    id: 'titan_crown',
    nameVi: 'Vương Miện Titan Học Giả',
    nameEn: 'Titan Scholar Crown',
    icon: '👑',
    bonusXp: 30,
    badgeColor: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
    descVi: 'Biểu tượng vinh danh học giả xuất sắc toàn thắng (+30 XP)',
    descEn: 'Exalted crown honoring peerless academic speed (+30 XP)'
  },
  QUILL: {
    id: 'scholar_quill',
    nameVi: 'Lông Vũ Tốc Ký',
    nameEn: 'Swift Quill of the Scribe',
    icon: '🪶',
    bonusXp: 10,
    badgeColor: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    descVi: 'Lông vũ gia tốc tốc độ gõ chính tả thần tốc (+10 XP)',
    descEn: 'Aerodynamic quill elevating typing reflex (+10 XP)'
  }
};

/**
 * Evaluates whether a sprint qualifies for a surprise Mystery Relic Loot Drop.
 * 
 * @param {Object} params
 * @param {number} params.correctAnswers
 * @param {number} params.totalQuestions
 * @param {boolean} params.isBossCleared
 * @param {number} params.maxCombo
 * @param {() => number} [params.rng=Math.random]
 * @returns {Object|null}
 */
export function evaluateMysteryLootDrop({
  correctAnswers = 0,
  totalQuestions = 7,
  isBossCleared = false,
  maxCombo = 0,
  rng = Math.random
} = {}) {
  const validCorrect = Number(correctAnswers) || 0;
  if (validCorrect < 3) return null;

  let dropChance = 0.40;
  if (validCorrect >= totalQuestions && totalQuestions > 0) {
    dropChance = 1.0; // 100% guarantee on perfect clear
  } else if (isBossCleared && maxCombo >= 4) {
    dropChance = 1.0; // 100% guarantee on boss slay with combo
  } else if (validCorrect >= 5) {
    dropChance = 0.70;
  }

  const roll = rng();
  if (roll > dropChance) return null;

  if (validCorrect >= totalQuestions && isBossCleared) {
    return ARENA_LOOT_TIERS.CROWN;
  }
  if (validCorrect >= totalQuestions || (isBossCleared && maxCombo >= 4)) {
    return ARENA_LOOT_TIERS.CRYSTAL;
  }
  if (roll < 0.35) {
    return ARENA_LOOT_TIERS.SCROLL;
  }
  return ARENA_LOOT_TIERS.QUILL;
}

/**
 * Computes transparent, decomposed XP for a completed sprint.
 * 
 * @param {Object} params
 * @param {number} [params.correctAnswers=0] - Number of correctly answered questions (max 10)
 * @param {number} [params.streakCount=0] - Current daily streak count
 * @param {number} [params.totalSeconds=60] - Time taken to complete the sprint
 * @param {string} [params.difficulty='medium'] - Selected difficulty level ('easy' | 'medium' | 'hard' | 'nightmare')
 * @param {number} [params.timeRemaining=0] - Time remaining in seconds (for time bonus)
 * @param {boolean} [params.isBossCleared=false] - Whether question 10 (Boss) was answered correctly
 * @param {boolean} [params.isAudioSprint=false] - Whether sprint is a dedicated Audio Blitz round
 * @param {number} [params.lootBonus=0] - Additional bonus XP from Mystery Relic Loot Drop
 * @returns {{ finalXp: number, rawXp: number, baseScore: number, bossBonus: number, audioBonus: number, lootBonus: number, timeBonus: number, streakBonus: number, speedBonus: number, softCapMultiplier: number, difficulty: string, isAudioSprint: boolean }}
 */
export function calculateSprintXp({
  correctAnswers = 0,
  streakCount = 0,
  totalSeconds = 60,
  difficulty = 'medium',
  timeRemaining = 0,
  isBossCleared = false,
  isAudioSprint = false,
  lootBonus = 0
} = {}) {
  // Support up to 10 questions for Atlas Arena v8.0
  const validCorrect = Math.max(0, Math.min(10, Number(correctAnswers) || 0));
  if (validCorrect === 0) {
    return { 
      finalXp: 0, 
      rawXp: 0, 
      baseScore: 0, 
      bossBonus: 0, 
      audioBonus: 0,
      lootBonus: 0,
      timeBonus: 0, 
      streakBonus: 0, 
      speedBonus: 0, 
      softCapMultiplier: 1.0, 
      difficulty,
      isAudioSprint: Boolean(isAudioSprint)
    };
  }

  const diffConfig = ARENA_DIFFICULTY_CONFIG[difficulty] || ARENA_DIFFICULTY_CONFIG.medium;
  const baseXpPerQuestion = diffConfig.baseXpPerQuestion || ARENA_XP_CAPS.BASE_QUESTION_XP;
  const standardCap = diffConfig.maxSprintXp || ARENA_XP_CAPS.MAX_XP_PER_SPRINT;
  // If isAudioSprint, expand max sprint cap to reward dedicated audio practice (+25%)
  let maxSprintCap = isAudioSprint ? Math.round(standardCap * 1.25) : standardCap;
  if (lootBonus > 0) {
    maxSprintCap += Number(lootBonus);
  }

  // 1. Base XP: scaled by difficulty level
  const baseScore = validCorrect * baseXpPerQuestion;

  // 2. Boss Question Bonus: Question 10 yields +0.5x Base XP if cleared
  const bossBonus = isBossCleared ? Math.round(baseXpPerQuestion * 0.5) : 0;

  // 3. Audio Sprint Mastery Bonus: +25% on Base XP + Perfect Ear (+15 XP if all correct)
  let audioBonus = 0;
  if (isAudioSprint) {
    audioBonus = Math.round(baseScore * 0.25);
    if (validCorrect >= 7) {
      audioBonus += 15; // Perfect Ear Bonus for flawlessly clearing 7 audio traps
    }
  }

  // 4. Time Bonus: Capped strictly at 30% of Base XP
  const timeBonus = calculateTimeBonusXp({
    remainingSeconds: timeRemaining,
    baseScore,
    correctAnswers: validCorrect
  });

  // Legacy speed bonus support (if totalSeconds provided without explicit timeRemaining)
  let speedBonus = 0;
  if (timeBonus === 0) {
    if (totalSeconds < 60 && validCorrect >= 5) {
      speedBonus = Math.min(20, Math.round((60 - Math.max(20, totalSeconds)) / 2));
    } else if (totalSeconds < 90 && validCorrect >= 5 && ['hard', 'nightmare'].includes(diffConfig.id)) {
      speedBonus = Math.min(30, Math.round((90 - Math.max(20, totalSeconds)) / 2));
    }
  }

  // 5. Streak Multiplier Bonus (max 40 XP)
  const streakBonus = Math.min(40, Math.floor(Math.max(0, streakCount) * 2));

  // Raw Total before Soft-Cap
  const validLootBonus = Math.max(0, Number(lootBonus) || 0);
  const rawXp = baseScore + bossBonus + audioBonus + timeBonus + speedBonus + streakBonus + validLootBonus;

  // 6. Apply Daily Soft-Cap Curve
  const multiplier = getDailySoftCapMultiplier();
  let finalXp = Math.round(rawXp * multiplier);

  // 7. Enforce Maximum Cap for selected difficulty
  finalXp = Math.max(0, Math.min(maxSprintCap, finalXp));

  return {
    finalXp,
    rawXp,
    baseScore,
    bossBonus,
    audioBonus,
    lootBonus: validLootBonus,
    timeBonus,
    streakBonus,
    speedBonus,
    softCapMultiplier: multiplier,
    difficulty: diffConfig.id,
    isAudioSprint: Boolean(isAudioSprint)
  };
}
