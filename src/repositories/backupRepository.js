/**
 * BackupRepository
 * Data Access Layer for Full Student Workspace Export, Import & Reset.
 */

import { clearSubmissionsTwoTier } from '../utils/indexedDbStorage.js';
import { SUBMISSION_STORAGE_KEYS } from './submissionRepository.js';

export class BackupRepository {
  /**
   * Generates a downloadable JSON backup of the user's entire local workspace.
   */
  static exportDataPackage(dataPayload) {
    const exportBundle = {
      ...dataPayload,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IELTS_Mastery_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Clears all local application storage and IndexedDB collections.
   */
  static async wipeAllStorage() {
    try {
      window.localStorage.clear();
    } catch (e) {
      console.warn('[BackupRepository] localStorage.clear error:', e);
    }

    await Promise.all([
      clearSubmissionsTwoTier(SUBMISSION_STORAGE_KEYS.WRITING),
      clearSubmissionsTwoTier(SUBMISSION_STORAGE_KEYS.READING),
      clearSubmissionsTwoTier(SUBMISSION_STORAGE_KEYS.LISTENING),
      clearSubmissionsTwoTier(SUBMISSION_STORAGE_KEYS.SPEAKING)
    ]);
  }
}
