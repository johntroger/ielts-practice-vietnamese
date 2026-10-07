import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  getLanguage,
  setLanguage,
  toggleLanguage,
  subscribeLanguage,
  t as translate,
  isEnglish,
  isVietnamese,
  getDictionary
} from './i18nService.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => getLanguage());

  useEffect(() => {
    // Sync when external change occurs
    const unsubscribe = subscribeLanguage((newLang) => {
      setLangState(newLang);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(() => {
    return {
      lang,
      language: lang,
      setLanguage: (newLang) => {
        setLanguage(newLang);
        setLangState(newLang);
      },
      toggleLanguage: () => {
        const next = toggleLanguage();
        setLangState(next);
      },
      t: (key, params, fallback) => translate(key, params, fallback),
      isEn: lang === 'en',
      isVi: lang === 'vi',
      dict: getDictionary(lang)
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Custom hook to consume i18n within components.
 * Works both with and without LanguageProvider wrapper.
 */
export function useTranslation() {
  const ctx = useContext(LanguageContext);
  const [standaloneLang, setStandaloneLang] = useState(() => getLanguage());

  useEffect(() => {
    if (ctx) return; // Managed by provider
    const unsubscribe = subscribeLanguage((newLang) => {
      setStandaloneLang(newLang);
    });
    return unsubscribe;
  }, [ctx]);

  if (ctx) {
    return ctx;
  }

  // Fallback standalone hook if not wrapped by Provider
  return {
    lang: standaloneLang,
    language: standaloneLang,
    setLanguage: (newLang) => {
      setLanguage(newLang);
      setStandaloneLang(newLang);
    },
    toggleLanguage: () => {
      const next = toggleLanguage();
      setStandaloneLang(next);
    },
    t: (key, params, fallback) => translate(key, params, fallback),
    isEn: standaloneLang === 'en',
    isVi: standaloneLang === 'vi',
    dict: getDictionary(standaloneLang)
  };
}
