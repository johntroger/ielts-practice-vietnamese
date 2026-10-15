/**
 * src/utils/arenaStorageKeys.js
 * 
 * Centralized Storage Keys & Schema Constants for Atlas English Arena.
 * Integrated with storageService.js to guarantee zero duplication & memory safety.
 */

export const ARENA_STORAGE_KEYS = {
  // Versioned Cache to prevent schema drift crashes
  CACHE_V1: 'ielts_arena_cache_v1_questions',
  // Guest pending XP waiting for user account registration
  GUEST_PENDING_XP: 'ielts_arena_guest_pending_xp',
  // 5-day question cooldown timestamp tracker
  COOLDOWN_LOG: 'ielts_arena_cooldown_log',
  // Daily shields & retry session state
  SHIELD_STATE: 'ielts_arena_shield_state',
  // Daily Soft-Cap XP sprint counter
  DAILY_SPRINT_COUNT: 'ielts_arena_daily_sprint_count',
  DAILY_SPRINT_DATE: 'ielts_arena_daily_sprint_date',
  // Last chosen difficulty preference
  LAST_DIFFICULTY: 'ielts_arena_last_difficulty',
  // Weekly league rollover evaluation tracker
  LAST_EVALUATED_WEEK: 'ielts_arena_last_evaluated_week'
};

export const ARENA_LEAGUE_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond'
};

export const ARENA_XP_CAPS = {
  MAX_XP_PER_SPRINT: 200,
  BASE_QUESTION_XP: 20,
  SPEED_BONUS_MAX: 5,
  COMBO_BONUS_STEP: 5
};

export const ARENA_DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  NIGHTMARE: 'nightmare'
};

export const ARENA_DIFFICULTY_CONFIG = {
  easy: {
    id: 'easy',
    name: 'Dễ (Band 4.0 - 5.0)',
    nameEn: 'Easy (Band 4.0 - 5.0)',
    targetBand: 'Band 4.0 - 5.0',
    baseXpPerQuestion: 12,
    maxSprintXp: 150,
    color: 'emerald',
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  },
  medium: {
    id: 'medium',
    name: 'Trung Bình (Band 5.5 - 6.5)',
    nameEn: 'Medium (Band 5.5 - 6.5)',
    targetBand: 'Band 5.5 - 6.5',
    baseXpPerQuestion: 20,
    maxSprintXp: 200,
    color: 'blue',
    badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  hard: {
    id: 'hard',
    name: 'Khó (Band 7.0 - 8.0)',
    nameEn: 'Hard (Band 7.0 - 8.0)',
    targetBand: 'Band 7.0 - 8.0',
    baseXpPerQuestion: 32,
    maxSprintXp: 350,
    color: 'purple',
    badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  },
  nightmare: {
    id: 'nightmare',
    name: 'Siêu Khó (Band 8.5 - 9.0)',
    nameEn: 'Master (Band 8.5 - 9.0)',
    targetBand: 'Band 8.5 - 9.0',
    baseXpPerQuestion: 50,
    maxSprintXp: 500,
    color: 'rose',
    badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  }
};

export const ARENA_IELTS_TOPICS = [
  { id: 'environment', icon: '🌿', nameVi: 'Môi Trường & Khí Hậu', nameEn: 'Environment & Climate' },
  { id: 'technology', icon: '💻', nameVi: 'Công Nghệ & AI', nameEn: 'Technology & AI' },
  { id: 'education', icon: '🎓', nameVi: 'Giáo Dục & Học Tập', nameEn: 'Education & Learning' },
  { id: 'health', icon: '🏥', nameVi: 'Y Tế & Sức Khỏe', nameEn: 'Health & Medicine' },
  { id: 'urbanization', icon: '🏙️', nameVi: 'Đô Thị & Hạ Tầng', nameEn: 'Urbanization & Society' },
  { id: 'economy', icon: '💼', nameVi: 'Kinh Tế & Thương Mại', nameEn: 'Economy & Trade' },
  { id: 'culture', icon: '🎨', nameVi: 'Nghệ Thuật & Di Sản', nameEn: 'Culture & Arts' },
  { id: 'science', icon: '🚀', nameVi: 'Khoa Học & Vũ Trụ', nameEn: 'Science & Space' }
];
