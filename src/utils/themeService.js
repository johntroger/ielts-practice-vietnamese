/**
 * themeService.js
 * 
 * Centralized theme manager for IELTS Studio.
 * Synchronizes 'light' and 'dark' modes across:
 * - HTML document class ('dark')
 * - LocalStorage persistence ('ielts_theme_mode')
 * - React subscriber hooks
 */

const THEME_STORAGE_KEY = 'ielts_theme_mode';

let listeners = new Set();
let currentMemoryTheme = 'light';

/**
 * Get current theme: 'dark' | 'light'
 */
export function getTheme() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      // Check system preference if no explicit user preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
  }
  return currentMemoryTheme;
}

/**
 * Apply theme to DOM and persist
 * @param {'dark' | 'light'} theme 
 */
export function setTheme(theme) {
  const validTheme = theme === 'dark' ? 'dark' : 'light';
  currentMemoryTheme = validTheme;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, validTheme);
    } catch {}

    const root = document.documentElement;
    if (root) {
      if (validTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }

  // Notify all listeners
  listeners.forEach(cb => {
    try { cb(validTheme); } catch (e) { console.error('Theme listener error:', e); }
  });

  return validTheme;
}

/**
 * Toggle between 'light' and 'dark'
 */
export function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  return setTheme(next);
}

/**
 * Initialize theme immediately on app load
 */
export function initTheme() {
  if (typeof window === 'undefined') return 'light';
  const theme = getTheme();
  setTheme(theme);
  return theme;
}

/**
 * Subscribe to theme changes
 * @param {Function} callback 
 * @returns {Function} unsubscribe function
 */
export function subscribeTheme(callback) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
