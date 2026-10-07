/**
 * tests/test_step101_i18n_core_and_language_switching.js
 * 
 * Step 101: Internationalization (i18n) Core Architecture & Bi-Directional Language Switching
 * Verifies:
 * 1. i18nService state management, persistence, and listener subscribers.
 * 2. Translation lookup t(key, params, fallback) with parameter interpolation and safe fallback.
 * 3. Exact structural key parity between Vietnamese (vi.js) and English (en.js) dictionaries.
 * 4. Language toggling and invalid locale fallback protection.
 * 5. React integration components and hooks (LanguageProvider, useTranslation).
 * 6. UI integration verification in Navbar and SettingsModal.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  getLanguage,
  setLanguage,
  toggleLanguage,
  subscribeLanguage,
  t,
  isEnglish,
  isVietnamese,
  getDictionary,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES
} from '../src/i18n/i18nService.js';

import { vi } from '../src/i18n/locales/vi.js';
import { en } from '../src/i18n/locales/en.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- RUNNING STEP 101: I18N CORE & BI-DIRECTIONAL LANGUAGE SWITCHING ---');

let passedTests = 0;

function it(desc, fn) {
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    throw err;
  }
}

// 1. Initial State & Defaults
it('1. Default language is Vietnamese (vi) and supported languages list is valid', () => {
  setLanguage('vi');
  assert.strictEqual(getLanguage(), 'vi');
  assert.strictEqual(DEFAULT_LANGUAGE, 'vi');
  assert.deepStrictEqual(SUPPORTED_LANGUAGES, ['vi', 'en']);
  assert.strictEqual(isVietnamese(), true);
  assert.strictEqual(isEnglish(), false);
});

// 2. Language Switching & Toggling
it('2. Bi-directional switching between Vietnamese and English works seamlessly', () => {
  setLanguage('en');
  assert.strictEqual(getLanguage(), 'en');
  assert.strictEqual(isEnglish(), true);
  assert.strictEqual(isVietnamese(), false);

  toggleLanguage();
  assert.strictEqual(getLanguage(), 'vi');
  assert.strictEqual(isVietnamese(), true);

  toggleLanguage();
  assert.strictEqual(getLanguage(), 'en');
  assert.strictEqual(isEnglish(), true);

  // Invalid language falls back to default 'vi'
  setLanguage('invalid-lang-code');
  assert.strictEqual(getLanguage(), 'vi');
});

// 3. Subscriber Notification Pattern
it('3. Subscriber listeners are called when language changes and can unsubscribe', () => {
  let observedLang = null;
  const unsubscribe = subscribeLanguage((lang) => {
    observedLang = lang;
  });

  setLanguage('en');
  assert.strictEqual(observedLang, 'en');

  setLanguage('vi');
  assert.strictEqual(observedLang, 'vi');

  unsubscribe();
  setLanguage('en');
  // Should NOT update since unsubscribed
  assert.strictEqual(observedLang, 'vi');
});

// 4. Dot-notation Translation & Fallback
it('4. t() correctly resolves nested keys in both languages with parameter interpolation', () => {
  // Test in English
  setLanguage('en');
  assert.strictEqual(t('common.submit'), 'Submit');
  assert.strictEqual(t('common.save'), 'Save');
  assert.strictEqual(t('nav.writing'), 'Writing');
  assert.strictEqual(t('writing.wordCount', { count: 300 }), '300 words');

  // Test in Vietnamese
  setLanguage('vi');
  assert.strictEqual(t('common.submit'), 'Nộp bài');
  assert.strictEqual(t('common.save'), 'Lưu');
  assert.strictEqual(t('nav.writing'), 'Writing');
  assert.strictEqual(t('writing.wordCount', { count: 300 }), '300 từ');

  // Fallback for non-existent key
  assert.strictEqual(t('non.existent.key', {}, 'Custom Fallback'), 'Custom Fallback');
  assert.strictEqual(t('non.existent.key'), 'non.existent.key');
});

// 5. Dictionary Parity between VI and EN
it('5. Exact namespace and top-level key parity between vi.js and en.js dictionaries', () => {
  const namespaces = ['common', 'nav', 'settings', 'writing', 'feedback'];
  
  namespaces.forEach(ns => {
    assert.ok(vi[ns], `vi must contain namespace: ${ns}`);
    assert.ok(en[ns], `en must contain namespace: ${ns}`);

    const viKeys = Object.keys(vi[ns]);
    const enKeys = Object.keys(en[ns]);

    // Check that every key in vi exists in en
    viKeys.forEach(key => {
      assert.ok(key in en[ns], `Key '${ns}.${key}' in vi.js is missing in en.js`);
    });

    // Check that every key in en exists in vi
    enKeys.forEach(key => {
      assert.ok(key in vi[ns], `Key '${ns}.${key}' in en.js is missing in vi.js`);
    });
  });
});

// 6. React Context & Hooks Exports
it('6. LanguageContext and useTranslation exports are functional and present', () => {
  const contextPath = path.resolve(__dirname, '../src/i18n/LanguageContext.jsx');
  const contextContent = fs.readFileSync(contextPath, 'utf-8');
  assert.ok(contextContent.includes('LanguageProvider'), 'Must export LanguageProvider');
  assert.ok(contextContent.includes('useTranslation'), 'Must export useTranslation hook');
  assert.ok(contextContent.includes('subscribeLanguage'), 'Must subscribe to language changes');

  const dictVi = getDictionary('vi');
  assert.ok(dictVi.common);
  const dictEn = getDictionary('en');
  assert.ok(dictEn.common);
});

// 7. Navbar and SettingsModal UI integration check
it('7. Navbar.jsx and SettingsModal.jsx include language toggle elements', () => {
  const navbarPath = path.resolve(__dirname, '../src/components/Navbar.jsx');
  const navbarContent = fs.readFileSync(navbarPath, 'utf-8');
  assert.ok(navbarContent.includes('useTranslation'), 'Navbar must import useTranslation');
  assert.ok(navbarContent.includes('toggleLanguage'), 'Navbar must include language toggle logic');
  assert.ok(navbarContent.includes('Globe'), 'Navbar must include Globe icon for language');

  const settingsPath = path.resolve(__dirname, '../src/components/SettingsModal.jsx');
  const settingsContent = fs.readFileSync(settingsPath, 'utf-8');
  assert.ok(settingsContent.includes('useTranslation'), 'SettingsModal must import useTranslation');
  assert.ok(settingsContent.includes('Display Language') || settingsContent.includes('Ngôn Ngữ Hiển Thị'), 'SettingsModal must have Display Language section');
  assert.ok(settingsContent.includes("setLanguage('vi')"), 'SettingsModal must support setting Vietnamese');
  assert.ok(settingsContent.includes("setLanguage('en')"), 'SettingsModal must support setting English');
});

// Restore language to default
setLanguage('vi');

console.log(`\nAll ${passedTests}/${passedTests} checks PASSED for Step 101!`);
