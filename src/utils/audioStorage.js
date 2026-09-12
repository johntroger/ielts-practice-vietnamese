/**
 * audioStorage.js - Persistent local audio caching using browser IndexedDB.
 * Enables offline & reload-resilient storage for user-uploaded audio files (.mp3, .m4a, .wav).
 */

const DB_NAME = 'ielts_audio_db';
const DB_VERSION = 1;
const STORE_NAME = 'audio_blobs';

// In-memory fallback if IndexedDB is blocked (e.g. private browsing)
const memoryCache = new Map();
const objectUrlCache = new Map();

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open audio IndexedDB'));
  });
}

/**
 * Save a File or Blob into IndexedDB
 */
export async function saveAudioBlob(id, fileOrBlob, metadata = {}) {
  try {
    const db = await openDB();
    const record = {
      id,
      blob: fileOrBlob,
      mimeType: fileOrBlob.type || 'audio/mpeg',
      name: metadata.name || fileOrBlob.name || 'uploaded-audio.mp3',
      size: fileOrBlob.size,
      createdAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Falling back to memory cache for audio:', err.message);
    memoryCache.set(id, fileOrBlob);
    return { id, blob: fileOrBlob };
  }
}

/**
 * Get Audio Blob from IndexedDB
 */
export async function getAudioBlob(id) {
  if (memoryCache.has(id)) {
    return memoryCache.get(id);
  }

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        resolve(req.result ? req.result.blob : null);
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}

/**
 * Create or reuse a playable Object URL for the audio
 */
export async function getAudioPlayableUrl(id) {
  if (objectUrlCache.has(id)) {
    return objectUrlCache.get(id);
  }

  const blob = await getAudioBlob(id);
  if (!blob) return null;

  try {
    const url = URL.createObjectURL(blob);
    objectUrlCache.set(id, url);
    return url;
  } catch (e) {
    console.error('Error creating object URL:', e);
    return null;
  }
}

/**
 * Delete audio blob from storage
 */
export async function deleteAudioBlob(id) {
  if (objectUrlCache.has(id)) {
    try {
      URL.revokeObjectURL(objectUrlCache.get(id));
    } catch (e) {}
    objectUrlCache.delete(id);
  }
  memoryCache.delete(id);

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch (e) {
    return false;
  }
}
