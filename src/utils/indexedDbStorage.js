/**
 * IELTS Web IndexedDB Storage Adapter
 * High-capacity, asynchronous client-side storage overcoming localStorage 5MB quota.
 * Pure Web Standards (zero dependencies) with memory fallback for Node.js test environments.
 */

const DB_NAME = 'IELTS_WEB_DB';
const DB_VERSION = 1;

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
 * @param {string} storeName - Store name from STORES
 * @param {string} key - Primary key
 * @param {*} value - Value to store
 * @returns {Promise<boolean>}
 */
export async function idbSet(storeName = STORES.KEYVAL, key, value) {
  if (!key && key !== 0) return false;

  if (!isIndexedDbSupported()) {
    if (!memoryStores[storeName]) memoryStores[storeName] = new Map();
    memoryStores[storeName].set(key, value);
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
        const itemToSave = (typeof value === 'object' && value !== null) 
          ? { ...value, [store.keyPath]: key }
          : { [store.keyPath]: key, value };
        request = store.put(itemToSave);
      } else {
        request = store.put(value, key);
      }

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn(`[IndexedDB] Fallback to memory store for '${key}':`, err);
    if (!memoryStores[storeName]) memoryStores[storeName] = new Map();
    memoryStores[storeName].set(key, value);
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
