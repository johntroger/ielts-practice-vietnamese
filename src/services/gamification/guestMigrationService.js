/**
 * src/services/gamification/guestMigrationService.js
 * 
 * Manages Guest XP accumulation and frictionless migration to authenticated account.
 * Preserves 100% of candidate's hard-earned XP upon registration/sign-in.
 */

import { safeGet, safeSet, safeRemove } from '../../utils/storageService.js';
import { ARENA_STORAGE_KEYS } from '../../utils/arenaStorageKeys.js';
import { submitSprintXp } from '../supabaseLeaderboard.js';

/**
 * Adds XP to guest pending store when not logged in.
 * @param {number} deltaXp 
 */
export function recordGuestPendingXp(deltaXp) {
  const current = Number(safeGet(ARENA_STORAGE_KEYS.GUEST_PENDING_XP, 0));
  const updated = Math.min(1000, current + Math.max(0, deltaXp));
  safeSet(ARENA_STORAGE_KEYS.GUEST_PENDING_XP, updated);
  return updated;
}

/**
 * Returns currently pending guest XP.
 */
export function getGuestPendingXp() {
  return Number(safeGet(ARENA_STORAGE_KEYS.GUEST_PENDING_XP, 0));
}

/**
 * Migrates guest pending XP into user's cloud account.
 * @param {Object} user - Authenticated user object from Supabase Auth
 * @returns {Promise<{ migratedXp: number, success: boolean }>}
 */
export async function migrateGuestXpOnLogin(user) {
  if (!user || !user.id) {
    return { migratedXp: 0, success: false };
  }

  const pendingXp = getGuestPendingXp();
  if (pendingXp <= 0) {
    return { migratedXp: 0, success: true };
  }

  try {
    const res = await submitSprintXp({
      userId: user.id,
      deltaXp: pendingXp,
      streakCount: 1,
      displayName: user.user_metadata?.display_name || user.user_metadata?.full_name,
      avatarUrl: user.user_metadata?.avatar_url
    });

    if (res.success) {
      safeRemove(ARENA_STORAGE_KEYS.GUEST_PENDING_XP);
      return { migratedXp: pendingXp, success: true };
    }
    return { migratedXp: pendingXp, success: false };
  } catch (err) {
    console.error('[GuestMigration] Failed to migrate guest XP:', err);
    return { migratedXp: pendingXp, success: false };
  }
}
