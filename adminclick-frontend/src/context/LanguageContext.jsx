import React, { createContext, useState, useContext, useEffect } from 'react';
import frTranslations from '../locales/fr.json';
import arTranslations from '../locales/ar.json';

const LanguageContext = createContext();

const translations = {
  fr: frTranslations,
  ar: arTranslations
};

export const LanguageProvider = ({ children }) => {
  // Initialize from localStorage or default to 'fr'
  const [lang, setLang] = useState(localStorage.getItem('app_lang') || 'fr');

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    // Set document direction for RTL support if needed
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  /**
   * Universal translation function
   * Pattern 1: t('Arabe', 'Français')
   * Pattern 2: t('key_in_json', { id: 123 })
   */
  const t = (arg1, arg2) => {
    // Pattern 1: t(ar, fr) - If second argument is a string
    if (typeof arg2 === 'string') {
      return lang === 'ar' ? arg1 : arg2;
    }

    // Pattern 2: t(key, data) - Look up in JSON files
    const key = arg1;
    const data = arg2;
    
    let text = translations[lang]?.[key] || translations['fr']?.[key] || key;

    // Handle variable replacement like {id}
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
