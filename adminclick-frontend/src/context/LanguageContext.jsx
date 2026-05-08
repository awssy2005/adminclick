import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize from localStorage or default to 'fr'
  const [lang, setLang] = useState(localStorage.getItem('app_lang') || 'fr');

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    // Set document direction for RTL support if needed
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (ar, fr) => (lang === 'ar' ? ar : fr);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
