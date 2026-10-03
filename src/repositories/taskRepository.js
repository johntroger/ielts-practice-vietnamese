/**
 * TaskRepository
 * Data Access Layer for IELTS Writing tasks (Authentic Cambridge & Community Custom Tasks).
 * Handles LocalStorage persistence, deduplication, BroadcastChannel sync, and Supabase Cloud sync.
 */

import { safeGet, safeSet } from '../utils/storageService.js';
import { INITIAL_TASKS, COMMUNITY_DEFAULT_TASKS } from '../data/sampleTasks.js';
import { deduplicateWritingTasks } from '../services/deduplicationService.js';
import { deleteUserCustomTask, fetchPublicTasks } from '../services/dataSyncService.js';

export const TASK_STORAGE_KEYS = {
  ALL_TASKS: 'ielts_all_tasks',
  CURRENT_TASK_ID: 'ielts_current_task_id',
  COMMUNITY_TASKS: 'ielts_public_community_tasks'
};

export class TaskRepository {
  /**
   * Retrieves and deduplicates all tasks from local storage merged with defaults.
   */
  static getInitialTasks() {
    const saved = safeGet(TASK_STORAGE_KEYS.ALL_TASKS, null);
    const defaults = [...INITIAL_TASKS, ...COMMUNITY_DEFAULT_TASKS];
    if (Array.isArray(saved) && saved.length > 0) {
      const savedIds = new Set(saved.map(t => t.id));
      const missingDefaults = defaults.filter(d => !savedIds.has(d.id));
      const combined = [...saved, ...missingDefaults];
      const { cleanedTasks } = deduplicateWritingTasks(combined, 0.75);
      return cleanedTasks;
    }
    const { cleanedTasks } = deduplicateWritingTasks(defaults, 0.75);
    return cleanedTasks;
  }

  /**
   * Saves all tasks to storage.
   */
  static saveAllTasks(tasks) {
    return safeSet(TASK_STORAGE_KEYS.ALL_TASKS, tasks);
  }

  /**
   * Retrieves community tasks.
   */
  static getCommunityTasks() {
    return safeGet(TASK_STORAGE_KEYS.COMMUNITY_TASKS, COMMUNITY_DEFAULT_TASKS);
  }

  /**
   * Saves community tasks.
   */
  static saveCommunityTasks(tasks) {
    return safeSet(TASK_STORAGE_KEYS.COMMUNITY_TASKS, tasks);
  }

  /**
   * Deletes a custom task from local state and triggers Supabase cloud sync if applicable.
   */
  static async deleteCustomTask(taskId, allTasks, currentUser = null) {
    const target = allTasks.find(t => t.id === taskId);
    const remainingTasks = allTasks.filter(t => t.id !== taskId);
    this.saveAllTasks(remainingTasks);

    // Sync cloud deletion for user custom tasks
    if (target?.isCustom && !target?.isSample) {
      try {
        await deleteUserCustomTask(taskId, currentUser?.id);
      } catch (err) {
        console.warn('[TaskRepository] Cloud task deletion notice:', err);
      }
    }

    return remainingTasks;
  }

  /**
   * Fetches latest public tasks from Supabase and merges into community tasks.
   */
  static async syncPublicTasks() {
    try {
      const publicTasks = await fetchPublicTasks();
      if (Array.isArray(publicTasks) && publicTasks.length > 0) {
        return publicTasks;
      }
    } catch (err) {
      console.warn('[TaskRepository] Public tasks sync notice:', err);
    }
    return null;
  }
}
