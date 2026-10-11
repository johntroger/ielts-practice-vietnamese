/**
 * src/services/supabaseLeaderboard.js
 * 
 * Production Supabase RPC Client with Built-in Circuit Breaker & Standalone Fallback.
 * Safely calls rpc_submit_sprint_xp, falls back to safe local storage on HTTP 404/401/timeout.
 */

import { supabase } from './supabaseClient.js';
import { safeGet, safeSet } from '../utils/storageService.js';
import { ARENA_STORAGE_KEYS } from '../utils/arenaStorageKeys.js';

let isRpcAvailable = true; // Circuit Breaker flag

/**
 * Resets Circuit Breaker (for testing purposes).
 */
export function resetRpcCircuitBreaker() {
  isRpcAvailable = true;
}

/**
 * Checks current Circuit Breaker status.
 */
export function getCircuitBreakerStatus() {
  return isRpcAvailable;
}

/**
 * Submits Sprint XP to Supabase with Circuit Breaker and Local Fallback.
 * @param {Object} params
 * @param {string} params.userId
 * @param {number} params.deltaXp
 * @param {number} [params.streakCount=1]
 * @param {string} [params.displayName]
 * @param {string} [params.avatarUrl]
 * @returns {Promise<{ success: boolean, isLocalFallback: boolean, message?: string }>}
 */
export async function submitSprintXp({
  userId,
  deltaXp,
  streakCount = 1,
  displayName = null,
  avatarUrl = null
}) {
  if (!userId) {
    return { success: false, isLocalFallback: true, message: 'Missing user ID' };
  }

  const validXp = Math.max(0, Math.min(200, Number(deltaXp) || 0));

  // If Circuit Breaker is tripped, save locally immediately
  if (!isRpcAvailable) {
    saveLocalFallbackLeaderboard(userId, validXp, streakCount, displayName, avatarUrl);
    return { success: true, isLocalFallback: true };
  }

  try {
    // 3.5s Lie-Fi Timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SUPABASE_RPC_TIMEOUT')), 3500)
    );

    const rpcPromise = supabase.rpc('rpc_submit_sprint_xp', {
      p_user_id: userId,
      p_delta_xp: validXp,
      p_streak_count: streakCount,
      p_display_name: displayName,
      p_avatar_url: avatarUrl
    });

    const { error } = await Promise.race([rpcPromise, timeoutPromise]);

    if (error) {
      // If RPC is missing on Supabase (404 / 400), trip Circuit Breaker to avoid spamming console
      if (error.code === 'PGRST202' || error.message?.includes('not found') || error.status === 404) {
        console.warn('[Leaderboard] Supabase RPC not deployed yet. Tripping Circuit Breaker to Local Standalone Mode.');
        isRpcAvailable = false;
      }
      saveLocalFallbackLeaderboard(userId, validXp, streakCount, displayName, avatarUrl);
      return { success: true, isLocalFallback: true };
    }

    return { success: true, isLocalFallback: false };
  } catch (err) {
    console.warn('[Leaderboard] Network or timeout error during RPC submit. Using Local Fallback:', err.message);
    saveLocalFallbackLeaderboard(userId, validXp, streakCount, displayName, avatarUrl);
    return { success: true, isLocalFallback: true };
  }
}

/**
 * Saves leaderboard data locally when Cloud RPC is unreachable.
 */
function saveLocalFallbackLeaderboard(userId, deltaXp, streakCount, displayName, avatarUrl) {
  const localKey = `ielts_leaderboard_local_${userId}`;
  const existing = safeGet(localKey, {
    total_xp: 0,
    weekly_xp: 0,
    streak_count: 0
  });

  const updated = {
    user_id: userId,
    display_name: displayName || existing.display_name || 'IELTS Warrior',
    avatar_url: avatarUrl || existing.avatar_url || '',
    total_xp: (existing.total_xp || 0) + deltaXp,
    weekly_xp: (existing.weekly_xp || 0) + deltaXp,
    streak_count: Math.max(existing.streak_count || 0, streakCount),
    last_updated: new Date().toISOString()
  };

  safeSet(localKey, updated);
}
