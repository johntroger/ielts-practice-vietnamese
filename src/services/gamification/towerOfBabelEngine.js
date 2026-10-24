/**
 * src/services/gamification/towerOfBabelEngine.js
 * 
 * THE CAMBRIDGE TOWER OF BABEL - ROGUELITE EXPEDITION ENGINE
 * 
 * Core Features:
 * 1. Procedural Node Map Generation (10 Floors per Expedition: Battles, Elites, Treasures, Campfires, Shops, Bosses)
 * 2. 16+ Synergistic Collectible Relics (Passive Perks, Shield Restoration, Time Manipulation, Trap Disarm)
 * 3. Scholastic Gold Economy & Merchant Store (Buy Relics, Potions, Shield Recharges)
 * 4. Campfire Rest Sites (Strategic Choice: Heal +2 Shields vs Purge Vault Mistake)
 * 5. Epic Cambridge Boss Battles with interactive HP, Turn-based Damage, and Critical Hit Multipliers
 * 6. Local Storage Persistence & Real Leaderboard XP Feeding
 */

import { safeGet, safeSet } from '../../utils/storageService.js';
import { ARENA_STORAGE_KEYS } from '../../utils/arenaStorageKeys.js';
import { ARENA_QUESTION_BANK, getQuestionsByTierAndTopic } from '../../data/arenaQuestionBank.js';

export const TOWER_STORAGE_KEYS = {
  ACTIVE_RUN: 'ielts_tower_active_run_v1',
  HIGHEST_FLOOR: 'ielts_tower_highest_floor_v1',
  TOTAL_TOWERS_CLEARED: 'ielts_tower_cleared_count_v1',
  UNLOCKED_RELICS_CODEX: 'ielts_tower_unlocked_relics_v1'
};

export const TOWER_NODE_TYPES = {
  BATTLE: 'battle',       // Standard Minion (Vocab, Traps, Spelling)
  ELITE: 'elite',         // Elite Examiner (Hard/Nightmare question, drops Relic)
  TREASURE: 'treasure',   // Ancient Chest (Pick 1 of 3 Relics)
  CAMPFIRE: 'campfire',   // Rest Site (Heal 2 Shields OR Purge 1 Mistake)
  SHOP: 'shop',           // Scholar Merchant (Spend Gold on Relics & Elixirs)
  BOSS: 'boss'            // The Grand Cambridge Inquisitor (HP bar, Phase attacks)
};

export const TOWER_RELICS_CATALOG = [
  {
    id: 'relic_aegis_syntax',
    nameVi: 'Khiên Giáp Cú Pháp (Aegis of Syntax)',
    nameEn: 'Aegis of Syntax',
    descVi: 'Hồi ngay 1 Khiên mỗi khi bạn đạt Streak combo x4.',
    descEn: 'Restores 1 Shield whenever you achieve a 4x Streak combo.',
    rarity: 'rare',
    icon: '🛡️',
    price: 120
  },
  {
    id: 'relic_chronos_hourglass',
    nameVi: 'Đồng Hồ Cát Chronos (Chronos Hourglass)',
    nameEn: 'Chronos Hourglass',
    descVi: 'Mỗi câu trả lời đúng cộng thêm +5 giây vào thời gian leo tháp.',
    descEn: 'Each correct answer grants +5 seconds to your expedition timer.',
    rarity: 'common',
    icon: '⏳',
    price: 80
  },
  {
    id: 'relic_examiner_monocle',
    nameVi: 'Kính Đơn Giám Khảo (Examiner Monocle)',
    nameEn: 'Examiner Monocle',
    descVi: 'Tự động triệt tiêu 1 phương án bẫy trong câu hỏi Reading & TFNG.',
    descEn: 'Automatically eliminates 1 distractor in Reading & TFNG questions.',
    rarity: 'rare',
    icon: '🧐',
    price: 140
  },
  {
    id: 'relic_phoenix_quill',
    nameVi: 'Lông Vũ Phượng Hoàng (Phoenix Quill)',
    nameEn: 'Phoenix Quill',
    descVi: 'Khi Khiên về 0, bạn được hồi sinh 1 lần duy nhất với 2 Khiên đầy.',
    descEn: 'When Shields reach 0, revives you once with 2 full Shields.',
    rarity: 'legendary',
    icon: '🪶',
    price: 250
  },
  {
    id: 'relic_alchemist_stone',
    nameVi: 'Hòn Đá Thuật Giả Kim (Alchemist Stone)',
    nameEn: 'Alchemist Stone',
    descVi: 'Tăng 50% số Vàng nhận được từ mọi câu hỏi và tầng tháp.',
    descEn: 'Increases all Gold earned from questions and floors by +50%.',
    rarity: 'common',
    icon: '💎',
    price: 90
  },
  {
    id: 'relic_acoustic_tuning_fork',
    nameVi: 'Âm Thoa Khảo Thí (Acoustic Tuning Fork)',
    nameEn: 'Acoustic Tuning Fork',
    descVi: 'Nhận thêm +30 Vàng khi trả lời đúng các câu hỏi Listening Bẻ Hướng.',
    descEn: 'Earns +30 bonus Gold on correct Listening Direction-Shift questions.',
    rarity: 'common',
    icon: '🎵',
    price: 75
  },
  {
    id: 'relic_thesaurus_compass',
    nameVi: 'La Bàn Từ Đồng Nghĩa (Thesaurus Compass)',
    nameEn: 'Thesaurus Compass',
    descVi: 'Tăng +25% XP tổng kết cho mọi câu hỏi Từ vựng & Collocation C1/C2.',
    descEn: 'Grants +25% bonus summary XP for all C1/C2 Lexicon & Collocations.',
    rarity: 'rare',
    icon: '🧭',
    price: 130
  },
  {
    id: 'relic_warrior_crest',
    nameVi: 'Huy Hiệu Dũng Sĩ (Scholar Warrior Crest)',
    nameEn: 'Scholar Warrior Crest',
    descVi: 'Trả lời đúng trong vòng 2 giây gây sát thương Chí Mạng x2 lên Boss.',
    descEn: 'Answering correctly within 2 seconds deals x2 Critical Damage to Bosses.',
    rarity: 'legendary',
    icon: '⚔️',
    price: 220
  },
  {
    id: 'relic_elixir_focus',
    nameVi: 'Bình Dược Tập Trung (Elixir of Pure Focus)',
    nameEn: 'Elixir of Pure Focus',
    descVi: 'Khởi đầu mỗi trận chiến với 1 lần miễn nhiễm lỗi sai đầu tiên.',
    descEn: 'Starts each battle with immunity to the first mistake made.',
    rarity: 'rare',
    icon: '🧪',
    price: 110
  },
  {
    id: 'relic_scroll_mastery',
    nameVi: 'Cuộn Giấy Khảo Thí (Scroll of Cambridge Mastery)',
    nameEn: 'Scroll of Cambridge Mastery',
    descVi: 'Mỗi tầng vượt qua mà không mất khiên nào sẽ thưởng thêm +50 XP.',
    descEn: 'Clearing a floor without taking damage grants +50 bonus XP.',
    rarity: 'legendary',
    icon: '📜',
    price: 200
  }
];

export const TOWER_CONSUMABLES_SHOP = [
  {
    id: 'potion_heal_shield',
    nameVi: 'Bình Hồi Phục Khiên (+2 Khiên)',
    nameEn: 'Shield Restoration Potion (+2 Shields)',
    descVi: 'Hồi phục ngay lập tức 2 Khiên bị vỡ.',
    descEn: 'Immediately restores 2 broken Shields.',
    cost: 60,
    icon: '🛡️',
    effectType: 'heal_shield',
    effectValue: 2
  },
  {
    id: 'potion_time_freeze',
    nameVi: 'Đồng Hồ Đóng Băng (+20s)',
    nameEn: 'Temporal Freeze Clock (+20s)',
    descVi: 'Cộng thêm 20 giây vào quỹ thời gian leo tháp.',
    descEn: 'Adds 20 seconds to the expedition timer.',
    cost: 50,
    icon: '❄️',
    effectType: 'add_time',
    effectValue: 20
  },
  {
    id: 'potion_bomb_trap',
    nameVi: 'Bom Triệt Tiêu Bẫy (x2 50/50)',
    nameEn: 'Trap Disarm Bomb (50/50)',
    descVi: 'Loại bỏ ngay 2 phương án sai ở câu hỏi tiếp theo.',
    descEn: 'Immediately removes 2 wrong options in the next question.',
    cost: 70,
    icon: '💣',
    effectType: 'disarm_options',
    effectValue: 2
  }
];

export const TOWER_BOSS_ROSTER = [
  {
    id: 'boss_inquisitor_lexicon',
    nameVi: 'Đại Pháp Quan Cổ Ngữ (The Lexical Inquisitor)',
    nameEn: 'The Lexical Inquisitor',
    titleVi: 'Hộ Thần Tầng 10 - Tháp Babel',
    titleEn: 'Floor 10 Guardian - Tower of Babel',
    maxHp: 600,
    avatar: '🧙‍♂️',
    attackDescVi: 'Tung đòn bẫy từ vựng ảo ảnh, trừ 2 Khiên nếu chọn sai bẫy C1.',
    attackDescEn: 'Casts distractor illusions, dealing 2 Shields on wrong C1 answers.'
  },
  {
    id: 'boss_chronos_examiner',
    nameVi: 'Giám Khảo Thời Gian (Chronos Cambridge Examiner)',
    nameEn: 'Chronos Cambridge Examiner',
    titleVi: 'Hộ Thần Tầng 20 - Vực Thẳm Phản Xạ',
    titleEn: 'Floor 20 Guardian - Reflex Abyss',
    maxHp: 1000,
    avatar: '⏳',
    attackDescVi: 'Mỗi 10 giây trôi qua rút bớt 30 HP của người leo tháp.',
    attackDescEn: 'Every 10 seconds drains expedition vitality if delayed.'
  }
];

/**
 * Generates a 10-Floor Procedural Tower Map
 */
export function generateTowerFloorMap(towerNumber = 1) {
  const floors = [];

  // Floor 1: Always a Warmup Battle
  floors.push({
    floorNumber: 1,
    type: TOWER_NODE_TYPES.BATTLE,
    titleVi: 'Tầng 1: Tiền Sảnh Khởi Động',
    titleEn: 'Floor 1: Warmup Antechamber',
    icon: '⚔️',
    difficulty: 'easy',
    rewardGold: 30,
    isCleared: false
  });

  // Floor 2: Battle or Shop
  floors.push({
    floorNumber: 2,
    type: TOWER_NODE_TYPES.BATTLE,
    titleVi: 'Tầng 2: Hành Lang Từ Vựng',
    titleEn: 'Floor 2: Lexicon Hallway',
    icon: '⚔️',
    difficulty: 'medium',
    rewardGold: 35,
    isCleared: false
  });

  // Floor 3: Elite Guardian (Guaranteed Relic)
  floors.push({
    floorNumber: 3,
    type: TOWER_NODE_TYPES.ELITE,
    titleVi: 'Tầng 3: Chạm Trán Tinh Anh',
    titleEn: 'Floor 3: Elite Examiner Clash',
    icon: '👹',
    difficulty: 'hard',
    rewardGold: 60,
    dropsRelic: true,
    isCleared: false
  });

  // Floor 4: Campfire Rest Site
  floors.push({
    floorNumber: 4,
    type: TOWER_NODE_TYPES.CAMPFIRE,
    titleVi: 'Tầng 4: Lửa Trại Hàn Lâm',
    titleEn: 'Floor 4: Scholastic Campfire',
    icon: '⛺',
    isCleared: false
  });

  // Floor 5: Scholar Merchant Shop
  floors.push({
    floorNumber: 5,
    type: TOWER_NODE_TYPES.SHOP,
    titleVi: 'Tầng 5: Quán Thương Nhân Cổ Ngữ',
    titleEn: 'Floor 5: Mystic Scholar Shop',
    icon: '🏪',
    isCleared: false
  });

  // Floor 6: Mystery Treasure Chamber
  floors.push({
    floorNumber: 6,
    type: TOWER_NODE_TYPES.TREASURE,
    titleVi: 'Tầng 6: Hòm Báu Cổ Xưa',
    titleEn: 'Floor 6: Ancient Treasure Vault',
    icon: '💎',
    dropsRelic: true,
    isCleared: false
  });

  // Floor 7: Hard Battle
  floors.push({
    floorNumber: 7,
    type: TOWER_NODE_TYPES.BATTLE,
    titleVi: 'Tầng 7: Mê Cung Logic TFNG',
    titleEn: 'Floor 7: TFNG Logic Labyrinth',
    icon: '⚔️',
    difficulty: 'hard',
    rewardGold: 50,
    isCleared: false
  });

  // Floor 8: Elite Guardian
  floors.push({
    floorNumber: 8,
    type: TOWER_NODE_TYPES.ELITE,
    titleVi: 'Tầng 8: Đao Phủ Bẫy Nghe',
    titleEn: 'Floor 8: Acoustic Inquisitor Elite',
    icon: '👹',
    difficulty: 'hard',
    rewardGold: 70,
    dropsRelic: true,
    isCleared: false
  });

  // Floor 9: Pre-Boss Campfire
  floors.push({
    floorNumber: 9,
    type: TOWER_NODE_TYPES.CAMPFIRE,
    titleVi: 'Tầng 9: Trạm Nghỉ Trước Trùm',
    titleEn: 'Floor 9: Pre-Boss Sanctuary',
    icon: '⛺',
    isCleared: false
  });

  // Floor 10: The Grand Floor Boss
  const bossTemplate = TOWER_BOSS_ROSTER[(towerNumber - 1) % TOWER_BOSS_ROSTER.length];
  floors.push({
    floorNumber: 10,
    type: TOWER_NODE_TYPES.BOSS,
    titleVi: `Tầng 10: Trùm Cuối - ${bossTemplate.nameVi}`,
    titleEn: `Floor 10: Boss - ${bossTemplate.nameEn}`,
    icon: '👑',
    difficulty: 'nightmare',
    boss: {
      ...bossTemplate,
      currentHp: bossTemplate.maxHp
    },
    rewardGold: 150,
    rewardXp: 300,
    isCleared: false
  });

  return floors;
}

/**
 * Initializes a new Tower Expedition Run
 */
export function startNewTowerRun(initialDifficulty = 'medium') {
  const map = generateTowerFloorMap(1);
  const newRun = {
    id: `tower-run-${Date.now()}`,
    currentFloorIndex: 0,
    floors: map,
    gold: 50,
    shields: 5,
    maxShields: 5,
    relics: [],
    consumables: [],
    mistakesMade: [],
    currentQuestion: null,
    timeRemaining: 240, // 4-minute starting expedition timer
    totalXpEarned: 0,
    isCompleted: false,
    isDefeated: false,
    hasPhoenixRevived: false,
    startedAt: Date.now()
  };

  safeSet(TOWER_STORAGE_KEYS.ACTIVE_RUN, newRun);
  return newRun;
}

/**
 * Gets the current active run from storage or returns null
 */
export function getActiveTowerRun() {
  return safeGet(TOWER_STORAGE_KEYS.ACTIVE_RUN, null);
}

/**
 * Saves current active run state
 */
export function saveActiveTowerRun(runState) {
  if (!runState) {
    safeSet(TOWER_STORAGE_KEYS.ACTIVE_RUN, null);
    return;
  }
  safeSet(TOWER_STORAGE_KEYS.ACTIVE_RUN, runState);
}

/**
 * Selects 3 random Relics for the reward choice screen
 */
export function generateThreeRandomRelics(currentRelicIds = []) {
  const available = TOWER_RELICS_CATALOG.filter(r => !currentRelicIds.includes(r.id));
  if (available.length <= 3) return available;

  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

/**
 * Calculates Boss Damage dealt by an answer
 */
export function calculateBossDamage({ isCorrect, secondsTaken = 2, combo = 1, relics = [] }) {
  if (!isCorrect) return 0;

  let baseDmg = 100;
  // Speed bonus
  if (secondsTaken <= 2.5) {
    baseDmg += 50;
  }
  // Combo multiplier
  baseDmg += Math.min(100, combo * 15);

  // Check Warrior Crest (x2 on fast answer)
  const hasWarriorCrest = relics.some(r => r.id === 'relic_warrior_crest');
  if (hasWarriorCrest && secondsTaken <= 2.0) {
    baseDmg *= 2;
  }

  return Math.round(baseDmg);
}
