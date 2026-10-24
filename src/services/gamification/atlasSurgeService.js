/**
 * src/services/gamification/atlasSurgeService.js
 * 
 * Atlas Sprint Surge Engine (Inspired by Duolingo 15-Minute Double XP Potion)
 * Awards temporary 2x XP multiplier for 15 minutes upon:
 * - Flawless Sprint completion (100% accuracy, >= 5 questions, 0 shields lost)
 * - Atlas Knowledge Vault opening (all 3 daily quests completed)
 * - Level up or high-tier achievements
 */

import { safeGet, safeSet } from '../../utils/storageService.js';

export const SURGE_STORAGE_KEY = 'atlas_sprint_surge_data';
export const DEFAULT_SURGE_MINUTES = 15;
export const SURGE_MULTIPLIER = 2.0;

/**
 * Returns current raw surge state from storage.
 * @returns {{ active: boolean, expiresAt: number, durationMinutes: number }}
 */
function readSurgeData() {
  const defaultData = {
    active: false,
    expiresAt: 0,
    durationMinutes: DEFAULT_SURGE_MINUTES
  };
  const data = safeGet(SURGE_STORAGE_KEY, defaultData);
  return data || defaultData;
}

/**
 * Checks whether Atlas Sprint Surge is currently active.
 * Automatically deactivates if current time has passed expiresAt.
 * 
 * @param {number} [currentTime=Date.now()]
 * @returns {boolean}
 */
export function isSurgeActive(currentTime = Date.now()) {
  const data = readSurgeData();
  if (!data.active || !data.expiresAt) return false;
  if (currentTime >= data.expiresAt) {
    // Expired
    clearSurge();
    return false;
  }
  return true;
}

/**
 * Returns remaining duration of active surge in seconds.
 * 
 * @param {number} [currentTime=Date.now()]
 * @returns {number} Remaining seconds (0 if inactive or expired)
 */
export function getSurgeRemainingSeconds(currentTime = Date.now()) {
  const data = readSurgeData();
  if (!data.active || !data.expiresAt) return 0;
  const remainingMs = data.expiresAt - currentTime;
  return Math.max(0, Math.floor(remainingMs / 1000));
}

/**
 * Returns current XP multiplier (2.0 if surge active, 1.0 otherwise).
 * 
 * @param {number} [currentTime=Date.now()]
 * @returns {number}
 */
export function getSurgeMultiplier(currentTime = Date.now()) {
  return isSurgeActive(currentTime) ? SURGE_MULTIPLIER : 1.0;
}

/**
 * Activates or extends the Atlas Sprint Surge for specified minutes.
 * If already active, stacks remaining time up to 60 minutes max.
 * 
 * @param {number} [durationMinutes=15]
 * @param {number} [currentTime=Date.now()]
 * @returns {{ active: boolean, expiresAt: number, remainingSeconds: number, multiplier: number }}
 */
export function activateSurge(durationMinutes = DEFAULT_SURGE_MINUTES, currentTime = Date.now()) {
  const current = readSurgeData();
  const addedMs = Math.max(1, durationMinutes) * 60 * 1000;
  const maxCapMs = 60 * 60 * 1000; // Max 60 mins limit

  let newExpiresAt;
  if (current.active && current.expiresAt > currentTime) {
    // Extend existing surge
    const totalDuration = (current.expiresAt - currentTime) + addedMs;
    newExpiresAt = currentTime + Math.min(maxCapMs, totalDuration);
  } else {
    // Fresh activation
    newExpiresAt = currentTime + addedMs;
  }

  const updatedData = {
    active: true,
    expiresAt: newExpiresAt,
    durationMinutes: Math.round((newExpiresAt - currentTime) / (60 * 1000))
  };

  safeSet(SURGE_STORAGE_KEY, updatedData);

  return {
    active: true,
    expiresAt: newExpiresAt,
    remainingSeconds: Math.floor((newExpiresAt - currentTime) / 1000),
    multiplier: SURGE_MULTIPLIER
  };
}

/**
 * Clears / deactivates surge immediately.
 */
export function clearSurge() {
  const resetData = {
    active: false,
    expiresAt: 0,
    durationMinutes: DEFAULT_SURGE_MINUTES
  };
  safeSet(SURGE_STORAGE_KEY, resetData);
  return resetData;
}

/**
 * Formats remaining surge seconds into readable MM:SS format.
 * @param {number} seconds
 * @returns {string}
 */
export function formatSurgeTimer(seconds = 0) {
  const s = Math.max(0, Number(seconds) || 0);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
