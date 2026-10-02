/**
 * IELTS Web IndexedDB Storage Adapter
 * High-capacity, asynchronous client-side storage overcoming localStorage 5MB quota.
 * Pure Web Standards (zero dependencies) with memory fallback for Node.js test environments.
 */

const DB_NAME = 'IELTS_WEB_DB';
const DB_VERSION = 1;

import { stripEphemeralMedia, safeSet, safeGet } from './storageService.js';

export const STORES = {
  KEYVAL: 'keyval',
  DIAGNOSTIC_RECORDS: 'diagnostic_records',
  SUBMISSIONS_ARCHIVE: 'submissions_archive'
};

// In-memory fallback stores when IndexedDB is unavailable (Node.js, Private Mode)
const memoryStores = {
  [STORES.KEYVAL]: new Map(),
  [STORES.DIAGNOSTIC_RECORDS]: new Map(),
  [STORES.SUBMISSIONS_ARCHIVE]: new Map()
};

/**
 * Checks if IndexedDB is supported in the current environment.
 */
export function isIndexedDbSupported() {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  } catch (e) {
    return false;
  }
}

/**
 * Opens or initializes the IELTS IndexedDB database.
 * @returns {Promise<IDBDatabase>}
 */
export function openIeltsDb() {
  return new Promise((resolve, reject) => {
    if (!isIndexedDbSupported()) {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // General Key-Value store
        if (!db.objectStoreNames.contains(STORES.KEYVAL)) {
          db.createObjectStore(STORES.KEYVAL);
        }

        // Placement Diagnostic Test records
        if (!db.objectStoreNames.contains(STORES.DIAGNOSTIC_RECORDS)) {
          db.createObjectStore(STORES.DIAGNOSTIC_RECORDS, { keyPath: 'id' });
        }

        // Submissions archive
        if (!db.objectStoreNames.contains(STORES.SUBMISSIONS_ARCHIVE)) {
          db.createObjectStore(STORES.SUBMISSIONS_ARCHIVE, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Sets a value in the specified store.
 * Sanitizes and strips heavy user-uploaded ephemeral media before persisting.
 * @param {string} storeName - Store name from STORES
 * @param {string} key - Primary key
 * @param {*} value - Value to store
 * @returns {Promise<boolean>}
 */
export async function idbSet(storeName = STORES.KEYVAL, key, value) {
  if (!key && key !== 0) return false;

  const sanitizedValue = stripEphemeralMedia(value);

  if (!isIndexedDbSupported()) {
    if (!memoryStores[storeName]) memoryStores[storeName] = new Map();
    memoryStores[storeName].set(key, sanitizedValue);
    return true;
  }

  try {
    const db = await openIeltsDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      // If store has keyPath (e.g. 'id') and value is an object, ensure id matches
      let request;
      if (store.keyPath) {
        const itemToSave = (typeof sanitizedValue === 'object' && sanitizedValue !== null) 
          ? { ...sanitizedValue, [store.keyPath]: key }
          : { [store.keyPath]: key, value: sanitizedValue };
        request = store.put(itemToSave);
      } else {
        request = store.put(sanitizedValue, key);
      }

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`[IndexedDB] Fallback to memory store for '${key}':`, err);
    if (!memoryStores[storeName]) memoryStores[storeName] = new Map();
    memoryStores[storeName].set(key, sanitizedValue);
    return true;
  }
}

/**
 * Retrieves a value from the specified store.
 * @param {string} storeName - Store name from STORES
 * @param {string} key - Primary key
 * @param {*} [defaultValue=null] - Fallback value if not found
 * @returns {Promise<*>}
 */
export async function idbGet(storeName = STORES.KEYVAL, key, defaultValue = null) {
  if (!key && key !== 0) return defaultValue;

  if (!isIndexedDbSupported()) {
    if (memoryStores[storeName]?.has(key)) {
      return memoryStores[storeName].get(key);
    }
    return defaultValue;
  }

  try {
    const db = await openIeltsDb();
    return new Promise((resolve) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        if (result === undefined) {
          resolve(defaultValue);
        } else {
          // If stored with synthetic value wrapper
          if (store.keyPath && typeof result === 'object' && result !== null && 'value' in result && Object.keys(result).length === 2) {
            resolve(result.value);
          } else {
            resolve(result);
          }
        }
      };
      request.onerror = () => resolve(defaultValue);
    });
  } catch (err) {
    if (memoryStores[storeName]?.has(key)) {
      return memoryStores[storeName].get(key);
    }
    return defaultValue;
  }
}

/**
 * Retrieves all records from a store.
 * @param {string} storeName - Store name from STORES
 * @returns {Promise<Array>}
 */
export async function idbGetAll(storeName = STORES.KEYVAL) {
  if (!isIndexedDbSupported()) {
    if (!memoryStores[storeName]) return [];
    return Array.from(memoryStores[storeName].values());
  }

  try {
    const db = await openIeltsDb();
    return new Promise((resolve) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  } catch (err) {
    if (!memoryStores[storeName]) return [];
    return Array.from(memoryStores[storeName].values());
  }
}

/**
 * Deletes a record from the store.
 * @param {string} storeName - Store name
 * @param {string} key - Primary key
 * @returns {Promise<boolean>}
 */
export async function idbDelete(storeName = STORES.KEYVAL, key) {
  if (!key && key !== 0) return false;

  if (!isIndexedDbSupported()) {
    if (memoryStores[storeName]) {
      memoryStores[storeName].delete(key);
    }
    return true;
  }

  try {
    const db = await openIeltsDb();
    return new Promise((resolve) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (err) {
    if (memoryStores[storeName]) {
      memoryStores[storeName].delete(key);
    }
    return true;
  }
}

/**
 * Clears all records from a store.
 * @param {string} storeName - Store name
 * @returns {Promise<boolean>}
 */
export async function idbClear(storeName = STORES.KEYVAL) {
  if (!isIndexedDbSupported()) {
    if (memoryStores[storeName]) {
      memoryStores[storeName].clear();
    }
    return true;
  }

  try {
    const db = await openIeltsDb();
    return new Promise((resolve) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  } catch (err) {
    if (memoryStores[storeName]) {
      memoryStores[storeName].clear();
    }
    return true;
  }
}

/**
 * Retrieves storage quota usage and estimates if browser supports StorageManager API.
 * @returns {Promise<Object>}
 */
export async function getStorageQuotaMetrics() {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || (500 * 1024 * 1024); // default ~500MB
      const percentUsed = Math.min(100, Math.round((usage / quota) * 100));

      return {
        isSupported: true,
        usageBytes: usage,
        quotaBytes: quota,
        usageMb: (usage / (1024 * 1024)).toFixed(2),
        quotaMb: (quota / (1024 * 1024)).toFixed(0),
        percentUsed,
        storageType: 'IndexedDB & Persistent Cache'
      };
    } catch (e) {}
  }

  return {
    isSupported: false,
    usageBytes: 0,
    quotaBytes: 50 * 1024 * 1024,
    usageMb: '0.00',
    quotaMb: '50',
    percentUsed: 0,
    storageType: 'Memory / Fallback'
  };
}

/**
 * Creates a lightweight summary of a submission for LocalStorage index.
 * Strips heavy evaluation rewrites, full paragraphs, and ephemeral media,
 * reducing payload by >95% to prevent browser QuotaExceededError.
 */
export function createLightweightSubmission(sub) {
  if (!sub || typeof sub !== 'object') return sub;

  const isReadingOrListening = sub.readingTest || sub.listeningTest || sub.totalQuestions !== undefined;
  const isSpeaking = sub.speakingTopic || sub.audioBlob || sub.sttTranscript;

  const lightweight = {
    id: sub.id,
    date: sub.date,
    timestamp: sub.timestamp || sub.date,
    hasFullDetailInIdb: true
  };

  // Task basic info
  if (sub.task) {
    lightweight.task = {
      id: sub.task.id,
      title: sub.task.title,
      taskNumber: sub.task.taskNumber
    };
  }

  // Stats
  if (sub.stats) {
    lightweight.stats = {
      wordCount: sub.stats.wordCount,
      timeSpent: sub.stats.timeSpent
    };
  }

  // Evaluation summary
  if (sub.evaluation) {
    lightweight.evaluation = {
      overallBand: sub.evaluation.overallBand ?? sub.evaluation.band,
      band: sub.evaluation.overallBand ?? sub.evaluation.band,
      score: sub.evaluation.score,
      evaluationMethod: sub.evaluation.evaluationMethod,
      engineName: sub.evaluation.engineName
    };

    if (sub.evaluation.criteriaScores) {
      lightweight.evaluation.criteriaScores = {
        taskResponse: { band: sub.evaluation.criteriaScores.taskResponse?.band },
        coherence: { band: sub.evaluation.criteriaScores.coherence?.band },
        lexicalResource: { band: sub.evaluation.criteriaScores.lexicalResource?.band },
        grammaticalRange: { band: sub.evaluation.criteriaScores.grammaticalRange?.band }
      };
    }
  }

  // Truncated preview for UI card display
  if (sub.essayText) {
    lightweight.essayText = sub.essayText.slice(0, 150) + (sub.essayText.length > 150 ? '...' : '');
  }

  // Reading / Listening specific metrics
  if (isReadingOrListening) {
    lightweight.band = sub.band ?? sub.evaluation?.overallBand;
    lightweight.score = sub.score;
    lightweight.totalQuestions = sub.totalQuestions;
    lightweight.timeSpent = sub.timeSpent;
    if (sub.testTitle) lightweight.testTitle = sub.testTitle;
  }

  // Speaking specific metrics
  if (isSpeaking) {
    lightweight.band = sub.band ?? sub.overallBand;
    lightweight.speakingTopic = sub.speakingTopic ? { title: sub.speakingTopic.title } : undefined;
    lightweight.fluencyBand = sub.fluencyBand;
    lightweight.lexicalBand = sub.lexicalBand;
    lightweight.grammarBand = sub.grammarBand;
    lightweight.pronunciationBand = sub.pronunciationBand;
  }

  return lightweight;
}

/**
 * Saves full submissions to high-capacity IndexedDB while saving
 * an ultra-lightweight summary index into LocalStorage.
 * @param {string} key - Storage key e.g. 'ielts_submissions_history'
 * @param {Array} fullSubmissions - Array of full submission objects
 */
export async function saveTwoTierSubmissions(key, fullSubmissions) {
  if (!Array.isArray(fullSubmissions)) return false;

  try {
    // 1. Persist full detailed records into IndexedDB KEYVAL store
    await idbSet(STORES.KEYVAL, key, fullSubmissions);

    // 2. Index each individual item into SUBMISSIONS_ARCHIVE for direct lookup by ID
    for (const item of fullSubmissions) {
      if (item && item.id) {
        await idbSet(STORES.SUBMISSIONS_ARCHIVE, item.id, item);
      }
    }

    // 3. Create lightweight summary array for LocalStorage (< 50KB total for hundreds of essays)
    const lightweight = fullSubmissions.map(createLightweightSubmission);
    safeSet(key, lightweight);
    return true;
  } catch (err) {
    console.warn(`[TwoTierStorage] Error saving submissions for '${key}':`, err);
    safeSet(key, fullSubmissions);
    return false;
  }
}

/**
 * Loads submissions with two-tier strategy:
 * First attempts to retrieve full records from IndexedDB;
 * if empty or unavailable, falls back to LocalStorage summary.
 * @param {string} key - Storage key
 * @param {*} defaultVal - Fallback value
 * @returns {Promise<Array>}
 */
export async function loadTwoTierSubmissions(key, defaultVal = []) {
  try {
    // 1. Try to load full records from IndexedDB
    const idbData = await idbGet(STORES.KEYVAL, key, null);
    if (Array.isArray(idbData) && idbData.length > 0) {
      return idbData;
    }
  } catch (err) {
    console.warn(`[TwoTierStorage] Error reading '${key}' from IndexedDB, using LocalStorage:`, err);
  }

  // 2. Fallback to LocalStorage
  return safeGet(key, defaultVal);
}

/**
 * Deletes a submission from both IndexedDB and LocalStorage.
 * @param {string} key - Storage key
 * @param {string} subId - Submission ID
 */
export async function deleteSubmissionTwoTier(key, subId) {
  if (!subId) return false;

  try {
    // Delete from individual archive
    await idbDelete(STORES.SUBMISSIONS_ARCHIVE, subId);

    // Update KEYVAL in IndexedDB
    const existing = await idbGet(STORES.KEYVAL, key, []);
    if (Array.isArray(existing)) {
      const updated = existing.filter(item => item && item.id !== subId);
      await idbSet(STORES.KEYVAL, key, updated);

      // Update LocalStorage summary
      const lightweight = updated.map(createLightweightSubmission);
      safeSet(key, lightweight);
    }
    return true;
  } catch (err) {
    console.warn(`[TwoTierStorage] Error deleting submission '${subId}':`, err);
    return false;
  }
}

/**
 * Clears an entire submission history category from both IndexedDB and LocalStorage.
 * @param {string} key - Storage key
 */
export async function clearSubmissionsTwoTier(key) {
  try {
    await idbSet(STORES.KEYVAL, key, []);
    safeSet(key, []);
    return true;
  } catch (err) {
    console.warn(`[TwoTierStorage] Error clearing submissions for '${key}':`, err);
    safeSet(key, []);
    return false;
  }
}

/**
 * Retrieves a single full submission by ID from the archive.
 * @param {string} subId - Submission ID
 * @returns {Promise<Object|null>}
 */
export async function getSubmissionById(subId) {
  if (!subId) return null;
  try {
    return await idbGet(STORES.SUBMISSIONS_ARCHIVE, subId, null);
  } catch (e) {
    return null;
  }
}

/**
 * Migrates existing legacy LocalStorage full submissions into IndexedDB.
 * Compresses the LocalStorage entry to lightweight summaries to prevent QuotaExceededError.
 * Safe to run multiple times (idempotent).
 * @returns {Promise<number>} Number of migrated submissions
 */
export async function migrateSubmissionsToIndexedDb() {
  const historyKeys = [
    'ielts_submissions_history',
    'ielts_reading_submissions_history',
    'ielts_listening_submissions_history',
    'ielts_speaking_submissions_history'
  ];

  let totalMigrated = 0;

  for (const key of historyKeys) {
    try {
      const localData = safeGet(key, null);
      if (Array.isArray(localData) && localData.length > 0) {
        const idbData = await idbGet(STORES.KEYVAL, key, null);

        // Check if LocalStorage holds unmigrated or heavy data
        const hasHeavyFields = localData.some(item => 
          item?.evaluation?.band65Rewrite || 
          item?.evaluation?.band8Rewrite || 
          item?.evaluation?.paragraphFeedback ||
          item?.evaluation?.detailedAnalysis ||
          (item?.essayText && item.essayText.length > 200)
        );

        if (!idbData || !Array.isArray(idbData) || idbData.length < localData.length || hasHeavyFields) {
          const mergedData = (Array.isArray(idbData) && idbData.length >= localData.length) ? idbData : localData;
          
          // Save full data into IndexedDB
          await idbSet(STORES.KEYVAL, key, mergedData);
          for (const item of mergedData) {
            if (item && item.id) {
              await idbSet(STORES.SUBMISSIONS_ARCHIVE, item.id, item);
            }
          }

          // Shrink LocalStorage to lightweight summaries
          const lightweight = mergedData.map(createLightweightSubmission);
          safeSet(key, lightweight);
          totalMigrated += mergedData.length;
        }
      }
    } catch (err) {
      console.warn(`[StorageMigration] Migration skipped for key '${key}':`, err);
    }
  }

  if (totalMigrated > 0) {
    console.log(`[StorageMigration] Successfully migrated ${totalMigrated} submissions to IndexedDB and compressed LocalStorage.`);
  }

  return totalMigrated;
}
