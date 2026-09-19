/**
 * IELTS Safe Storage Service & Quota Resilience Manager
 * Protects application against QuotaExceededError, corrupted JSON, and private-mode storage blocking.
 */

// In-memory fallback if localStorage is disabled, full, or inaccessible
const memoryStore = new Map();

/**
 * Checks if localStorage is available and writable in the current browser environment.
 */
export function isLocalStorageAvailable() {
  try {
    const testKey = '__ielts_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Calculates current localStorage usage in bytes and percentage of typical 5MB quota.
 */
export function getStorageMetrics() {
  if (!isLocalStorageAvailable()) {
    return {
      isAvailable: false,
      usedBytes: 0,
      quotaEstimatedBytes: 5 * 1024 * 1024,
      usagePercent: 0,
      keyCount: memoryStore.size,
      isUsingMemoryFallback: true
    };
  }

  let usedBytes = 0;
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        const val = window.localStorage.getItem(key) || '';
        usedBytes += (key.length + val.length) * 2; // UTF-16 approx 2 bytes per char
      }
    }
  } catch (e) {
    // ignore
  }

  const quotaEstimatedBytes = 5 * 1024 * 1024; // 5MB standard
  const usagePercent = Math.min(100, Math.round((usedBytes / quotaEstimatedBytes) * 100));

  return {
    isAvailable: true,
    usedBytes,
    quotaEstimatedBytes,
    usagePercent,
    keyCount: window.localStorage.length,
    isUsingMemoryFallback: memoryStore.size > 0
  };
}

/**
 * Cleans up temporary or volatile storage entries when storage pressure occurs.
 * Prunes oversized history collections to retain the most recent 30 items.
 */
export function pruneVolatileData() {
  const historyKeys = [
    'ielts_submissions_history',
    'ielts_reading_submissions_history',
    'ielts_listening_submissions_history',
    'ielts_speaking_submissions_history'
  ];

  historyKeys.forEach(key => {
    try {
      const raw = isLocalStorageAvailable()
        ? window.localStorage.getItem(key)
        : memoryStore.get(key);

      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 30) {
          // Keep only the 30 most recent items
          const trimmed = parsed.slice(-30);
          const serialized = JSON.stringify(trimmed);
          if (isLocalStorageAvailable()) {
            window.localStorage.setItem(key, serialized);
          } else {
            memoryStore.set(key, serialized);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  });

  // Remove temporary mock exam draft if completed
  try {
    const mockState = isLocalStorageAvailable()
      ? window.localStorage.getItem('ielts_mock_writing_in_progress')
      : memoryStore.get('ielts_mock_writing_in_progress');

    if (mockState) {
      const parsed = JSON.parse(mockState);
      // If older than 24 hours, prune it
      if (parsed?.savedAt && (Date.now() - new Date(parsed.savedAt).getTime() > 24 * 60 * 60 * 1000)) {
        safeRemove('ielts_mock_writing_in_progress');
      }
    }
  } catch (e) {}
}

/**
 * Safely retrieves an item from storage.
 * Automatically parses JSON if applicable; returns defaultValue on failure.
 */
export function safeGet(key, defaultValue = null) {
  if (!key) return defaultValue;

  let raw = null;
  if (isLocalStorageAvailable()) {
    try {
      raw = window.localStorage.getItem(key);
    } catch (e) {
      raw = memoryStore.get(key) || null;
    }
  } else {
    raw = memoryStore.get(key) || null;
  }

  if (raw === null || raw === undefined) {
    return defaultValue;
  }

  try {
    return JSON.parse(raw);
  } catch (e) {
    // If not valid JSON, return raw string
    return raw;
  }
}

/**
 * Safely saves an item to storage with automatic QuotaExceeded recovery.
 * Serializes objects to JSON automatically.
 */
export function safeSet(key, value) {
  if (!key) return false;

  const serialized = JSON.stringify(value);

  if (!isLocalStorageAvailable()) {
    memoryStore.set(key, serialized);
    return true;
  }

  try {
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (e) {
    const isQuotaError = 
      e.name === 'QuotaExceededError' ||
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      e.code === 22 ||
      e.code === 1014;

    if (isQuotaError) {
      console.warn(`[StorageService] Storage quota reached while saving '${key}'. Attempting self-healing pruning...`);
      pruneVolatileData();

      try {
        window.localStorage.setItem(key, serialized);
        return true;
      } catch (retryError) {
        console.warn(`[StorageService] Quota still exceeded after pruning. Storing '${key}' in memory fallback.`);
        memoryStore.set(key, serialized);
        return false;
      }
    } else {
      console.warn(`[StorageService] Error writing key '${key}':`, e);
      memoryStore.set(key, serialized);
      return false;
    }
  }
}

/**
 * Safely removes an item from both localStorage and memory fallback.
 */
export function safeRemove(key) {
  if (!key) return;
  memoryStore.delete(key);
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {}
  }
}

/**
 * Exports all primary IELTS learner data into a single backup JSON file string.
 */
export function exportBackupData() {
  const backup = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    data: {}
  };

  const primaryKeys = [
    'ielts_target_band',
    'ielts_all_tasks',
    'ielts_current_task_id',
    'ielts_essays_drafts',
    'ielts_outlines_drafts',
    'ielts_submissions_history',
    'ielts_reading_submissions_history',
    'ielts_listening_submissions_history',
    'ielts_speaking_submissions_history',
    'ielts_vocab_notebook',
    'ielts_mistakes_log',
    'ielts_theory_notes',
    'ielts_streak_count'
  ];

  primaryKeys.forEach(k => {
    const val = safeGet(k, null);
    if (val !== null) {
      backup.data[k] = val;
    }
  });

  return JSON.stringify(backup, null, 2);
}

/**
 * Imports learner data from a backup JSON string with validation.
 */
export function importBackupData(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || !parsed.data) {
      return { success: false, message: 'Định dạng tệp sao lưu không hợp lệ.' };
    }

    let importedCount = 0;
    Object.entries(parsed.data).forEach(([k, v]) => {
      if (k.startsWith('ielts_')) {
        safeSet(k, v);
        importedCount++;
      }
    });

    return {
      success: true,
      importedCount,
      message: `Đã khôi phục thành công ${importedCount} mục dữ liệu ôn luyện!`
    };
  } catch (e) {
    return {
      success: false,
      message: `Không thể đọc tệp sao lưu: ${e.message}`
    };
  }
}
