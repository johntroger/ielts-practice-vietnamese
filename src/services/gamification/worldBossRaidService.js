/**
 * src/services/gamification/worldBossRaidService.js
 * 
 * Daily World Boss Raid Event Engine for Atlas English Arena.
 * A collective global cooperative challenge featuring 7 rotating Cambridge Titan Bosses:
 * - Rotates daily based on UTC day of week (0-6)
 * - Global Boss HP pool (50,000 HP)
 * - Player damage scaled by correct questions, max combo & boss clearing
 * - Raid Milestone Reward (+20 XP for dealing >= 400 damage in a day)
 */

import { safeGet, safeSet, safeRemove } from '../../utils/storageService.js';
import { ARENA_STORAGE_KEYS } from '../../utils/arenaStorageKeys.js';

export const WORLD_BOSS_MAX_HP = 50000;
export const WORLD_BOSS_RAID_BONUS_XP = 20;
export const WORLD_BOSS_QUALIFYING_DAMAGE = 400;

export const DAILY_WORLD_BOSSES = [
  {
    dayIndex: 0, // Sunday
    id: 'cambridge_overlord',
    icon: '👑',
    nameVi: 'Bá Chủ Khảo Thí Toàn Năng',
    nameEn: 'Cambridge Overlord Titan',
    descriptionVi: 'Thống soái đề thi nắm giữ mọi bí mật của các kỳ thi chuẩn hóa quốc tế.',
    descriptionEn: 'The ultimate examiner controlling every standardized test secret.',
    weakness: 'C2 Advanced Lexis & High Speed',
    theme: 'amber'
  },
  {
    dayIndex: 1, // Monday
    id: 'lexical_demon',
    icon: '👹',
    nameVi: 'Quỷ Vương Từ Vựng Học Thuật',
    nameEn: 'Lexical Demon',
    descriptionVi: 'Hấp thụ sinh lực từ những từ vựng thông tục và lỗi lặp từ cơ bản.',
    descriptionEn: 'Feeds on repetitive words and low-level conversational slang.',
    weakness: 'C1/C2 Academic Synonyms',
    theme: 'rose'
  },
  {
    dayIndex: 2, // Tuesday
    id: 'spelling_gorgon',
    icon: '🐍',
    nameVi: 'Nữ Thần Bẫy Chính Tả',
    nameEn: 'Spelling Gorgon',
    descriptionVi: 'Ánh nhìn hóa đá những ai phân vân giữa double consonants và silent letters.',
    descriptionEn: 'Petrifies anyone hesitating on double consonants and silent letters.',
    weakness: 'Perfect Orthography & Suffixes',
    theme: 'purple'
  },
  {
    dayIndex: 3, // Wednesday
    id: 'distractor_leviathan',
    icon: '🐋',
    nameVi: 'Thủy Quái Bẫy Distractor',
    nameEn: 'Distractor Leviathan',
    descriptionVi: 'Gieo rắc sự hoang mang bằng những đáp án bẫy tinh vi nghe giống hệt bài nghe.',
    descriptionEn: 'Creates confusion with deceptive trap choices that mimic the audio.',
    weakness: 'Context Paraphrasing & Keywords',
    theme: 'cyan'
  },
  {
    dayIndex: 4, // Thursday
    id: 'tfng_chimera',
    icon: '🦁',
    nameVi: 'Quái Thú True/False/Not Given',
    nameEn: 'TFNG Chimera',
    descriptionVi: 'Bẻ cong logic với những suy đoán không có thật trong đoạn văn gốc.',
    descriptionEn: 'Distorts reading logic with unverified outside assumptions.',
    weakness: 'Strict Textual Evidence',
    theme: 'emerald'
  },
  {
    dayIndex: 5, // Friday
    id: 'cohesion_hydra',
    icon: '🐉',
    nameVi: 'Mãng Xà Mạch Lạc Cohesion',
    nameEn: 'Cohesion Hydra',
    descriptionVi: 'Phân tách câu văn thành từng mảnh rời rạc thiếu từ nối logic.',
    descriptionEn: 'Shatters essays with disjointed sentences lacking logical linkers.',
    weakness: 'Discourse Markers & Flow',
    theme: 'indigo'
  },
  {
    dayIndex: 6, // Saturday
    id: 'phonetic_phoenix',
    icon: '🦅',
    nameVi: 'Phượng Hoàng Ngữ Âm & Trọng Âm',
    nameEn: 'Phonetic Phoenix',
    descriptionVi: 'Thiêu rụi sự tự tin bằng những cặp âm tối thiểu (minimal pairs) hóc búa.',
    descriptionEn: 'Burns down confidence with tricky minimal pairs and silent vowels.',
    weakness: 'Stress Patterns & Intonation',
    theme: 'orange'
  }
];

/**
 * Returns today's UTC date key format: YYYY-MM-DD
 */
export function getUtcDateKey() {
  const d = new Date();
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets the current daily World Boss archetype and player raid progress.
 * Initializes fresh HP and state if a new day has rolled over.
 * @returns {Object} Complete boss state
 */
export function getDailyWorldBoss() {
  const dateKey = getUtcDateKey();
  const dayIndex = new Date().getUTCDay();
  const archetype = DAILY_WORLD_BOSSES.find(b => b.dayIndex === dayIndex) || DAILY_WORLD_BOSSES[0];

  const storageKey = ARENA_STORAGE_KEYS.WORLD_BOSS_STATE || 'ielts_arena_world_boss_state';
  const savedState = safeGet(storageKey, null);

  if (savedState && savedState.dateKey === dateKey && savedState.bossId === archetype.id) {
    return {
      ...archetype,
      ...savedState
    };
  }

  // New day or first time initialization
  const freshState = {
    dateKey,
    bossId: archetype.id,
    currentHp: WORLD_BOSS_MAX_HP,
    maxHp: WORLD_BOSS_MAX_HP,
    playerDamageDealt: 0,
    playerRaidClaimed: false
  };

  safeSet(storageKey, freshState);

  return {
    ...archetype,
    ...freshState
  };
}

/**
 * Calculates and inflicts damage against the active World Boss after a sprint match.
 * @param {Object} params - { score, combo, isBossCleared }
 * @returns {Object} Damage summary including bonus XP if milestone reached
 */
export function dealWorldBossDamage({ score = 0, combo = 0, isBossCleared = false } = {}) {
  const activeBoss = getDailyWorldBoss();
  const damage = (Number(score || 0) * 120) + (Number(combo || 0) * 30) + (isBossCleared ? 250 : 0);

  const prevDamage = activeBoss.playerDamageDealt || 0;
  const newPlayerDamage = prevDamage + damage;
  const newHp = Math.max(0, (activeBoss.currentHp || WORLD_BOSS_MAX_HP) - damage);

  // Check if player reaches milestone this sprint
  let bonusXp = 0;
  let playerRaidClaimed = !!activeBoss.playerRaidClaimed;
  if (!playerRaidClaimed && newPlayerDamage >= WORLD_BOSS_QUALIFYING_DAMAGE) {
    bonusXp = WORLD_BOSS_RAID_BONUS_XP;
    playerRaidClaimed = true;
  }

  const updatedState = {
    dateKey: activeBoss.dateKey,
    bossId: activeBoss.bossId,
    currentHp: newHp,
    maxHp: activeBoss.maxHp || WORLD_BOSS_MAX_HP,
    playerDamageDealt: newPlayerDamage,
    playerRaidClaimed
  };

  const storageKey = ARENA_STORAGE_KEYS.WORLD_BOSS_STATE || 'ielts_arena_world_boss_state';
  safeSet(storageKey, updatedState);

  return {
    damageDealt: damage,
    currentHp: newHp,
    maxHp: updatedState.maxHp,
    hpPercentage: Math.max(0, Math.round((newHp / updatedState.maxHp) * 100)),
    bossNameVi: activeBoss.nameVi,
    bossNameEn: activeBoss.nameEn,
    bossIcon: activeBoss.icon,
    isDefeated: newHp <= 0,
    bonusXp,
    totalPlayerDamage: newPlayerDamage,
    qualifyingDamage: WORLD_BOSS_QUALIFYING_DAMAGE
  };
}

/**
 * Clears world boss state for testing.
 */
export function resetWorldBossForTesting() {
  safeRemove(ARENA_STORAGE_KEYS.WORLD_BOSS_STATE || 'ielts_arena_world_boss_state');
}
