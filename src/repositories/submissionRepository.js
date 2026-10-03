/**
 * SubmissionRepository
 * Data Access Layer for Submissions & Exam History across all 4 IELTS Skills.
 * Implements Two-Tier Storage Architecture:
 * - High-speed LocalStorage summary index for instant hydration
 * - Full IndexedDB blob storage for high-capacity evaluations & media
 */

import { safeGet } from '../utils/storageService.js';
import {
  saveTwoTierSubmissions,
  loadTwoTierSubmissions,
  deleteSubmissionTwoTier,
  clearSubmissionsTwoTier,
  migrateSubmissionsToIndexedDb
} from '../utils/indexedDbStorage.js';
import { deleteUserSubmission } from '../services/dataSyncService.js';

export const SUBMISSION_STORAGE_KEYS = {
  WRITING: 'ielts_submissions_history',
  READING: 'ielts_reading_submissions_history',
  LISTENING: 'ielts_listening_submissions_history',
  SPEAKING: 'ielts_speaking_submissions_history'
};

export class SubmissionRepository {
  /**
   * Initial fast read from LocalStorage index (sync).
   */
  static getInitialHistory(skillKey) {
    return safeGet(skillKey, []);
  }

  /**
   * Asynchronously hydrates full history from IndexedDB and migrates old records if needed.
   */
  static async hydrateAllTwoTierHistories() {
    try {
      await migrateSubmissionsToIndexedDb();
      const [fullWriting, fullReading, fullListening, fullSpeaking] = await Promise.all([
        loadTwoTierSubmissions(SUBMISSION_STORAGE_KEYS.WRITING, null),
        loadTwoTierSubmissions(SUBMISSION_STORAGE_KEYS.READING, null),
        loadTwoTierSubmissions(SUBMISSION_STORAGE_KEYS.LISTENING, null),
        loadTwoTierSubmissions(SUBMISSION_STORAGE_KEYS.SPEAKING, null)
      ]);

      return {
        writing: Array.isArray(fullWriting) && fullWriting.length > 0 ? fullWriting : null,
        reading: Array.isArray(fullReading) && fullReading.length > 0 ? fullReading : null,
        listening: Array.isArray(fullListening) && fullListening.length > 0 ? fullListening : null,
        speaking: Array.isArray(fullSpeaking) && fullSpeaking.length > 0 ? fullSpeaking : null
      };
    } catch (err) {
      console.warn('[SubmissionRepository] Two-tier hydration error:', err);
      return { writing: null, reading: null, listening: null, speaking: null };
    }
  }

  /**
   * Persists submissions using Two-Tier storage.
   */
  static saveSubmissions(skillKey, items) {
    return saveTwoTierSubmissions(skillKey, items);
  }

  /**
   * Deletes a single submission from Two-Tier storage and cloud.
   */
  static async deleteSubmission(skillKey, subId, currentItems, currentUser = null) {
    const updated = currentItems.filter(s => s.id !== subId);
    await deleteSubmissionTwoTier(skillKey, subId);

    if (currentUser?.id) {
      try {
        await deleteUserSubmission(subId);
      } catch (err) {
        console.warn('[SubmissionRepository] Cloud deletion notice:', err);
      }
    }

    return updated;
  }

  /**
   * Clears all submissions for a given skill.
   */
  static async clearSkillHistory(skillKey) {
    await clearSubmissionsTwoTier(skillKey);
    return [];
  }

  /**
   * Clears all submissions across all 4 skills.
   */
  static async clearAllHistories() {
    await Promise.all([
      clearSubmissionsTwoTier(SUBMISSION_STORAGE_KEYS.WRITING),
      clearSubmissionsTwoTier(SUBMISSION_STORAGE_KEYS.READING),
      clearSubmissionsTwoTier(SUBMISSION_STORAGE_KEYS.LISTENING),
      clearSubmissionsTwoTier(SUBMISSION_STORAGE_KEYS.SPEAKING)
    ]);
  }
}
