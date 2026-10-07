/**
 * src/i18n/i18nService.js
 * 
 * Lightweight, zero-dependency internationalization service for IELTS Studio.
 * Synchronizes 'vi' (Vietnamese) and 'en' (English) across:
 * - HTML document lang attribute ('vi' | 'en')
 * - LocalStorage persistence ('ielts_language_preference')
 * - React subscriber hooks with instant re-render
 * - Dot-notation nested key lookup and variable interpolation
 */

import { vi } from './locales/vi.js';
import { en } from './locales/en.js';

export const LANGUAGE_STORAGE_KEY = 'ielts_language_preference';
export const SUPPORTED_LANGUAGES = ['vi', 'en'];
export const DEFAULT_LANGUAGE = 'vi';

const dictionaries = {
  vi,
  en
};

let currentLanguage = DEFAULT_LANGUAGE;
const listeners = new Set();

/**
 * Retrieve current active language: 'vi' | 'en'
 */
export function getLanguage() {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
        return saved;
      }
    } catch {
      // Fallback if storage access is restricted
    }
  }
  return currentLanguage;
}

/**
 * Switch and persist active language
 * @param {'vi' | 'en'} lang 
 */
export function setLanguage(lang) {
  const targetLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
  currentLanguage = targetLang;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, targetLang);
    } catch {
      // Non-blocking
    }

    if (document.documentElement) {
      document.documentElement.lang = targetLang;
    }
  }

  // Notify all reactive subscribers
  listeners.forEach((listener) => {
    try {
      listener(targetLang);
    } catch (e) {
      console.error('Error in language subscriber:', e);
    }
  });

  return targetLang;
}

/**
 * Toggle between 'vi' and 'en'
 */
export function toggleLanguage() {
  const next = getLanguage() === 'vi' ? 'en' : 'vi';
  return setLanguage(next);
}

/**
 * Subscribe to language changes
 * @param {(lang: string) => void} listener 
 * @returns {() => void} unsubscribe function
 */
export function subscribeLanguage(listener) {
  if (typeof listener !== 'function') return () => {};
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Deep key lookup in dictionary object (dot-notation)
 */
function resolvePath(obj, path) {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Translate a key into the active language with variable interpolation.
 * @param {string} key - Dot-separated translation key, e.g. 'nav.writing'
 * @param {Record<string, any>} [params] - Variables to interpolate, e.g. { count: 150 }
 * @param {string} [fallback] - Optional fallback string if key is not found
 * @returns {string} Translated text
 */
export function t(key, params = {}, fallback = '') {
  const activeLang = getLanguage();
  const dict = dictionaries[activeLang] || dictionaries[DEFAULT_LANGUAGE];
  
  // 1. Look up in active dictionary
  let text = resolvePath(dict, key);

  // 2. Fallback to default (Vietnamese) if not found in active dictionary
  if (text === undefined && activeLang !== DEFAULT_LANGUAGE) {
    text = resolvePath(dictionaries[DEFAULT_LANGUAGE], key);
  }

  // 3. Fallback to user-supplied fallback or the key itself
  if (text === undefined) {
    text = fallback || key;
  }

  // 4. Interpolate parameters: {name} -> params.name
  if (typeof text === 'string' && params && typeof params === 'object') {
    return text.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return paramKey in params ? String(params[paramKey]) : match;
    });
  }

  return text;
}

/**
 * Helper to check if English is currently active
 */
export function isEnglish() {
  return getLanguage() === 'en';
}

/**
 * Helper to check if Vietnamese is currently active
 */
export function isVietnamese() {
  return getLanguage() === 'vi';
}

/**
 * Retrieve the full dictionary for a specific language
 */
export function getDictionary(lang) {
  return dictionaries[lang] || dictionaries[DEFAULT_LANGUAGE];
}
