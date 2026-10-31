/**
 * src/services/gamification/atlasDailyQuestService.js
 * 
 * Atlas Daily Sprints Engine (Inspired by Duolingo Daily Quests)
 * Generates 3 daily bite-sized objectives and manages Atlas Knowledge Vault rewards.
 */

import { safeGet, safeSet } from '../../utils/storageService.js';
import { getLocalDateKey } from '../../utils/dateHelper.js';
import { addStreakShield } from './atlasStreakShieldService.js';
import { activateSurge } from './atlasSurgeService.js';
import { addGold, addDiamonds } from './atlasWalletService.js';

export const DAILY_QUESTS_STORAGE_KEY = 'atlas_daily_sprints_data';

export const QUEST_TYPES = {
  COMPLETE_SPRINT: 'complete_sprint',
  AUDIO_BLITZ_ACCURACY: 'audio_blitz_accuracy',
  DEAL_BOSS_DAMAGE: 'deal_boss_damage',
  PERFECT_COMBO: 'perfect_combo'
};

/**
 * Standard Quest Definitions Pool
 */
const QUEST_DEFINITIONS = [
  {
    id: 'sprint_completion',
    type: QUEST_TYPES.COMPLETE_SPRINT,
    target: 1,
    titleVi: 'Khai Chiến Đấu Trường',
    titleEn: 'Arena Combat Starter',
    descVi: 'Hoàn thành 1 trận Đấu Trường 180s',
    descEn: 'Complete 1 round of 180s Arena Sprint',
    rewardXp: 30,
    icon: '⚔️'
  },
  {
    id: 'audio_accuracy',
    type: QUEST_TYPES.AUDIO_BLITZ_ACCURACY,
    target: 5,
    titleVi: 'Thính Giác Phản Xạ',
    titleEn: 'Cambridge Audio Reflex',
    descVi: 'Trả lời đúng 5 câu trong Lôi Đài Nghe',
    descEn: 'Score 5 correct answers in Audio Blitz',
    rewardXp: 50,
    icon: '🎧'
  },
  {
    id: 'boss_damage',
    type: QUEST_TYPES.DEAL_BOSS_DAMAGE,
    target: 300,
    titleVi: 'Tập Kích Boss Thế Giới',
    titleEn: 'World Boss Raid Strike',
    descVi: 'Gây ít nhất 300 sát thương lên Boss hôm nay',
    descEn: 'Deal at least 300 damage to today\'s World Boss',
    rewardXp: 60,
    icon: '🔥'
  }
];

/**
 * Gets or initializes today's 3 Daily Sprints
 * @param {string} [overrideDate] 
 * @returns {{ date: string, quests: Array, isVaultClaimed: boolean }}
 */
export function getDailySprintsData(overrideDate = null) {
  const today = overrideDate || getLocalDateKey();
  const stored = safeGet(DAILY_QUESTS_STORAGE_KEY, null);

  if (stored && stored.date === today && Array.isArray(stored.quests)) {
    return stored;
  }

  // Initialize fresh quests for today
  const freshData = {
    date: today,
    isVaultClaimed: false,
    vaultReward: null,
    quests: QUEST_DEFINITIONS.map(q => ({
      ...q,
      current: 0,
      isCompleted: false
    }))
  };

  safeSet(DAILY_QUESTS_STORAGE_KEY, freshData);
  return freshData;
}

/**
 * Updates progress for a specific quest type
 * @param {string} questType - One of QUEST_TYPES
 * @param {number} delta - Amount to increment
 * @returns {{ data: Object, newlyCompleted: Array }}
 */
export function recordDailyQuestProgress(questType, delta = 1) {
  const data = getDailySprintsData();
  const newlyCompleted = [];

  data.quests.forEach(quest => {
    if (quest.type === questType && !quest.isCompleted) {
      quest.current = Math.min(quest.target, (quest.current || 0) + delta);
      if (quest.current >= quest.target) {
        quest.isCompleted = true;
        newlyCompleted.push(quest);
      }
    }
  });

  safeSet(DAILY_QUESTS_STORAGE_KEY, data);
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      window.dispatchEvent(new CustomEvent('atlas_daily_sprints_updated', { detail: data }));
    } catch (e) {}
  }
  return { data, newlyCompleted };
}

/**
 * Evaluates whether all 3 Daily Sprints are completed
 * @param {Object} [data] 
 * @returns {boolean}
 */
export function isDailySprintsAllCompleted(data = null) {
  const sprints = data || getDailySprintsData();
  return sprints.quests.every(q => q.isCompleted);
}

/**
 * Claims the Atlas Knowledge Vault reward when all 3 daily quests are done
 * @returns {{ success: boolean, reward: Object|null, message: string }}
 */
export function claimAtlasKnowledgeVault() {
  const data = getDailySprintsData();

  if (!isDailySprintsAllCompleted(data)) {
    return { success: false, reward: null, message: 'quests_incomplete' };
  }

  if (data.isVaultClaimed) {
    return { success: false, reward: data.vaultReward, message: 'already_claimed' };
  }

  // Generate variable reward
  // Guaranteed: +120 Bonus XP + 15 min 2x XP Sprint Surge
  // 50% chance: +1 Atlas Streak Shield (if < 2)
  const isShieldAwarded = Math.random() < 0.5;
  let shieldsAdded = 0;
  if (isShieldAwarded) {
    shieldsAdded = addStreakShield(1);
  }

  // Activate 15-minute 2x XP Surge
  activateSurge(15);

  // Award Currency: +100 Scholastic Gold + 10 Atlas Diamonds
  addGold(100, 'Claimed Atlas Knowledge Vault', false);
  addDiamonds(10, 'Daily Quests Complete Vault');

  const reward = {
    bonusXp: 120,
    bonusGold: 100,
    bonusDiamonds: 10,
    hasShield: isShieldAwarded,
    shieldsRemaining: shieldsAdded,
    hasSurge: true,
    surgeDurationMinutes: 15,
    perkUnlocked: 'chronos_freeze'
  };

  data.isVaultClaimed = true;
  data.vaultReward = reward;
  safeSet(DAILY_QUESTS_STORAGE_KEY, data);

  return { success: true, reward, message: 'claimed_success' };
}
