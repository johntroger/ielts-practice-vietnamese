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
  DAILY_SPRINT_DATE: 'ielts_arena_daily_sprint_date'
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
