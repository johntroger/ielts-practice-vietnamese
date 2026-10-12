/**
 * src/services/gamification/realLeaderboardService.js
 * 
 * Production Real-User Leaderboard Service for Atlas English Arena.
 * Completely eliminates dummy / bot rivals. Exclusively tracks and displays real users.
 * Integrates directly with Supabase Cloud (user_custom_tasks public sync) + local cache.
 */

import { supabase } from '../supabaseClient.js';
import { safeGet, safeSet } from '../../utils/storageService.js';
import { getLeagueTier, getUnifiedStreakCount } from './leagueEngine.js';
import { calculateLevelProgress } from './levelEngine.js';

export const REAL_LEADERBOARD_STORAGE_KEY = 'ielts_real_arena_leaderboard_v1';
export const GUEST_ARENA_STORAGE_KEY = 'ielts_guest_arena_score_v1';

export const DEFAULT_OWNER_PROFILE = {
  user_id: '1c5cafba-4a8e-48c3-93bf-7d2387ec6dc1',
  display_name: 'tranthanhtung37',
  email: 'tranthanhtung37@gmail.com',
  avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=tranthanhtung37',
  weekly_xp: 2850,
  total_xp: 9400,
  streak_count: 14,
  isOwner: true,
  role: 'Admin & Top Scholar'
};

/**
 * Checks if a given user is the system owner/admin tranthanhtung37.
 * @param {Object} user 
 * @returns {boolean}
 */
export function isUserOwner(user) {
  if (!user) return false;
  return (
    user.email === 'tranthanhtung37@gmail.com' ||
    user.id === DEFAULT_OWNER_PROFILE.user_id ||
    user.user_metadata?.name === 'tranthanhtung37' ||
    user.user_metadata?.display_name === 'tranthanhtung37' ||
    user.display_name === 'tranthanhtung37'
  );
}

/**
 * Reconciles the raw list of real users with the current active user/guest.
 * Guarantees tranthanhtung37 is present and that the active player is appropriately marked.
 * @param {Array} rawUsers 
 * @param {Object|null} currentUser 
 * @returns {{ leaderboard: Array, currentRank: number, userWeeklyXp: number, leagueTier: string }}
 */
export function reconcileRealLeaderboard(rawUsers = [], currentUser = null) {
  const usersMap = new Map();

  // 1. Always seed the verified owner profile
  usersMap.set('tranthanhtung37', { ...DEFAULT_OWNER_PROFILE });

  // 2. Merge cloud / cached records
  if (Array.isArray(rawUsers)) {
    for (const u of rawUsers) {
      if (!u || !u.display_name) continue;
      const key = u.display_name.toLowerCase();
      const existing = usersMap.get(key);

      if (existing) {
        usersMap.set(key, {
          ...existing,
          ...u,
          weekly_xp: Math.max(existing.weekly_xp || 0, Number(u.weekly_xp) || 0),
          total_xp: Math.max(existing.total_xp || 0, Number(u.total_xp) || 0),
          streak_count: Math.max(existing.streak_count || 1, Number(u.streak_count) || 1),
          isOwner: existing.isOwner || u.isOwner || (u.display_name === 'tranthanhtung37')
        });
      } else {
        usersMap.set(key, {
          user_id: u.user_id || `user_${key}`,
          display_name: u.display_name,
          email: u.email || '',
          avatar_url: u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.display_name}`,
          weekly_xp: Math.max(0, Number(u.weekly_xp) || 0),
          total_xp: Math.max(0, Number(u.total_xp) || 0),
          streak_count: Math.max(1, Number(u.streak_count) || 1),
          isOwner: u.display_name === 'tranthanhtung37' || u.email === 'tranthanhtung37@gmail.com',
          last_updated: u.last_updated || new Date().toISOString()
        });
      }
    }
  }

  // 3. Handle Active Current User
  let activeUserIdKey = null;

  if (currentUser) {
    if (isUserOwner(currentUser)) {
      const ownerEntry = usersMap.get('tranthanhtung37');
      if (ownerEntry) {
        ownerEntry.isCurrentUser = true;
        ownerEntry.user_id = currentUser.id || DEFAULT_OWNER_PROFILE.user_id;
        const currentStreak = getUnifiedStreakCount();
        if (currentStreak > 0) {
          ownerEntry.streak_count = Math.max(ownerEntry.streak_count, currentStreak);
        }
      }
      activeUserIdKey = 'tranthanhtung37';
    } else {
      const displayName = currentUser.user_metadata?.display_name ||
                          currentUser.user_metadata?.full_name ||
                          currentUser.email?.split('@')[0] ||
                          'Học Viên';
      const key = displayName.toLowerCase();
      const localKey = `ielts_leaderboard_local_${currentUser.id}`;
      const localData = safeGet(localKey, {});

      const userEntry = usersMap.get(key) || {
        user_id: currentUser.id,
        display_name: displayName,
        email: currentUser.email || '',
        avatar_url: currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName}`,
        weekly_xp: localData.weekly_xp || 0,
        total_xp: localData.total_xp || 0,
        streak_count: localData.streak_count || getUnifiedStreakCount() || 1,
        isOwner: false
      };

      userEntry.isCurrentUser = true;
      usersMap.set(key, userEntry);
      activeUserIdKey = key;
    }
  } else {
    // Guest / Anonymous session
    const guestData = safeGet(GUEST_ARENA_STORAGE_KEY, { weekly_xp: 0, total_xp: 0, streak: 1 });
    if (guestData && (guestData.weekly_xp > 0 || guestData.total_xp > 0)) {
      usersMap.set('guest_player', {
        user_id: 'guest_player',
        display_name: 'Bạn (Khách)',
        avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=GuestCandidate',
        weekly_xp: guestData.weekly_xp || 0,
        total_xp: guestData.total_xp || 0,
        streak_count: guestData.streak || 1,
        isCurrentUser: true,
        isOwner: false
      });
      activeUserIdKey = 'guest_player';
    }
  }

  // 4. Sort strictly descending by weekly_xp (with total_xp tiebreaker)
  const sortedList = Array.from(usersMap.values()).sort((a, b) => {
    if (b.weekly_xp !== a.weekly_xp) {
      return b.weekly_xp - a.weekly_xp;
    }
    return b.total_xp - a.total_xp;
  });

  // 5. Assign 1-indexed ranks, league tiers, and 100-Level Atlas progression
  const rankedLeaderboard = sortedList.map((item, idx) => {
    const levelProgress = calculateLevelProgress(item.total_xp || item.weekly_xp || 0);
    return {
      ...item,
      rank: idx + 1,
      league_tier: getLeagueTier(item.weekly_xp),
      level: levelProgress.level,
      levelProgress,
      titanTier: levelProgress.tier
    };
  });

  // 6. Find current user's entry
  const userEntry = rankedLeaderboard.find(u => u.isCurrentUser) || 
                    (activeUserIdKey ? rankedLeaderboard.find(u => u.display_name.toLowerCase() === activeUserIdKey) : null);

  const currentRank = userEntry ? userEntry.rank : 1;
  const userWeeklyXp = userEntry ? userEntry.weekly_xp : (rankedLeaderboard[0]?.weekly_xp || 0);
  const leagueTier = getLeagueTier(userWeeklyXp);

  return {
    leaderboard: rankedLeaderboard,
    currentRank,
    userWeeklyXp,
    leagueTier
  };
}

/**
 * Fetches real leaderboard data with Cloud Supabase sync & Local Storage cache.
 * @param {Object|null} currentUser 
 * @returns {Promise<{ leaderboard: Array, currentRank: number, userWeeklyXp: number, leagueTier: string }>}
 */
export async function fetchRealLeaderboard(currentUser = null) {
  // Step 1: Read local cache for immediate 0ms UI responsiveness
  let cachedUsers = safeGet(REAL_LEADERBOARD_STORAGE_KEY, [DEFAULT_OWNER_PROFILE]);

  // Step 2: Query Cloud Supabase for real learner arena entries
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('LEADERBOARD_TIMEOUT')), 3500)
    );

    const queryPromise = supabase
      .from('user_custom_tasks')
      .select('*')
      .eq('is_public', true)
      .ilike('id', 'arena-score-%');

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (!error && Array.isArray(data) && data.length > 0) {
      const cloudUsers = data.map(row => ({
        user_id: row.user_id || row.id.replace('arena-score-', ''),
        display_name: row.task_data?.display_name || row.creator_email?.split('@')[0] || 'IELTS Scholar',
        email: row.creator_email || '',
        avatar_url: row.task_data?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${row.task_data?.display_name || 'learner'}`,
        weekly_xp: Number(row.task_data?.weekly_xp) || 0,
        total_xp: Number(row.task_data?.total_xp) || 0,
        streak_count: Number(row.task_data?.streak_count) || 1,
        last_updated: row.task_data?.last_updated || row.created_at,
        isOwner: row.creator_email === 'tranthanhtung37@gmail.com' || row.task_data?.display_name === 'tranthanhtung37'
      }));

      safeSet(REAL_LEADERBOARD_STORAGE_KEY, cloudUsers);
      cachedUsers = cloudUsers;
    }
  } catch (err) {
    // Cloud sync graceful fallback to local cache
    console.warn('[Leaderboard] Cloud sync offline or slow. Using local cache:', err.message);
  }

  return reconcileRealLeaderboard(cachedUsers, currentUser);
}

/**
 * Submits and persists real sprint score to both Supabase Cloud and Local Cache.
 * @param {Object} params
 * @param {Object|null} params.currentUser
 * @param {number} params.deltaXp
 * @param {number} params.streakCount
 * @returns {Promise<{ success: boolean, updatedUser: Object }>}
 */
export async function submitRealSprintScore({
  currentUser = null,
  deltaXp = 0,
  streakCount = 1
}) {
  const validXp = Math.max(0, Math.min(200, Number(deltaXp) || 0));
  if (validXp <= 0) {
    return { success: false, reason: 'Zero XP' };
  }

  const isOwner = isUserOwner(currentUser);

  const targetName = isOwner
    ? 'tranthanhtung37'
    : (currentUser?.user_metadata?.display_name ||
       currentUser?.user_metadata?.full_name ||
       currentUser?.email?.split('@')[0] ||
       'Bạn (Khách)');

  const targetEmail = isOwner
    ? 'tranthanhtung37@gmail.com'
    : (currentUser?.email || 'learner@ielts.practice');

  const targetUserId = isOwner
    ? DEFAULT_OWNER_PROFILE.user_id
    : (currentUser?.id || 'guest_player');

  const cloudRecordId = `arena-score-${isOwner ? 'tranthanhtung37' : targetUserId}`;

  // 1. Update Cloud Supabase Record
  try {
    const { data: existingRow } = await supabase
      .from('user_custom_tasks')
      .select('*')
      .eq('id', cloudRecordId)
      .maybeSingle();

    const baseWeekly = existingRow?.task_data?.weekly_xp ?? (isOwner ? DEFAULT_OWNER_PROFILE.weekly_xp : 0);
    const baseTotal = existingRow?.task_data?.total_xp ?? (isOwner ? DEFAULT_OWNER_PROFILE.total_xp : 0);
    const baseStreak = existingRow?.task_data?.streak_count ?? (isOwner ? DEFAULT_OWNER_PROFILE.streak_count : 1);

    const updatedTaskData = {
      type: 'arena_leaderboard_entry',
      display_name: targetName,
      weekly_xp: baseWeekly + validXp,
      total_xp: baseTotal + validXp,
      streak_count: Math.max(baseStreak, streakCount),
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${targetName}`,
      last_updated: new Date().toISOString()
    };

    await supabase.from('user_custom_tasks').upsert({
      id: cloudRecordId,
      user_id: currentUser?.id || null,
      task_data: updatedTaskData,
      is_public: true,
      creator_email: targetEmail,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('[Leaderboard] Cloud score upsert notice:', err.message);
  }

  // 2. Update Local Storage Cache
  const cachedList = safeGet(REAL_LEADERBOARD_STORAGE_KEY, [DEFAULT_OWNER_PROFILE]);
  const userIdx = cachedList.findIndex(u => u.display_name.toLowerCase() === targetName.toLowerCase());

  if (userIdx !== -1) {
    cachedList[userIdx].weekly_xp = (cachedList[userIdx].weekly_xp || 0) + validXp;
    cachedList[userIdx].total_xp = (cachedList[userIdx].total_xp || 0) + validXp;
    cachedList[userIdx].streak_count = Math.max(cachedList[userIdx].streak_count || 1, streakCount);
  } else {
    cachedList.push({
      user_id: targetUserId,
      display_name: targetName,
      email: targetEmail,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${targetName}`,
      weekly_xp: validXp,
      total_xp: validXp,
      streak_count: streakCount,
      isOwner
    });
  }
  safeSet(REAL_LEADERBOARD_STORAGE_KEY, cachedList);

  // If Guest, record guest score locally
  if (!currentUser) {
    const curGuest = safeGet(GUEST_ARENA_STORAGE_KEY, { weekly_xp: 0, total_xp: 0, streak: 1 });
    safeSet(GUEST_ARENA_STORAGE_KEY, {
      weekly_xp: (curGuest.weekly_xp || 0) + validXp,
      total_xp: (curGuest.total_xp || 0) + validXp,
      streak: Math.max(curGuest.streak || 1, streakCount)
    });
  }

  return { success: true };
}
