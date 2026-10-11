/**
 * src/services/gamification/eventBus.js
 * 
 * Central Pub/Sub Event Bus for Atlas English Arena.
 * Aligns 100% with modalStore.js & themeService.js Set-based subscriber patterns.
 * Guarantees zero memory leaks with mandatory unsubscribe returns.
 */

const subscribers = new Map();

/**
 * Subscribes to an arena event.
 * @param {string} event 
 * @param {Function} callback 
 * @returns {() => void} Unsubscribe cleanup function
 */
export function on(event, callback) {
  if (typeof callback !== 'function') return () => {};

  if (!subscribers.has(event)) {
    subscribers.set(event, new Set());
  }

  const listeners = subscribers.get(event);
  listeners.add(callback);

  // Return safe cleanup function for React useEffect
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      subscribers.delete(event);
    }
  };
}

/**
 * Emits an event with arbitrary payload.
 * @param {string} event 
 * @param {any} payload 
 */
export function emit(event, payload) {
  if (!subscribers.has(event)) return;
  const listeners = subscribers.get(event);
  listeners.forEach(cb => {
    try {
      cb(payload);
    } catch (err) {
      console.error(`[EventBus] Error in listener for '${event}':`, err);
    }
  });
}

/**
 * Clears all listeners (for testing & reset purposes).
 */
export function clearAllListeners() {
  subscribers.clear();
}
