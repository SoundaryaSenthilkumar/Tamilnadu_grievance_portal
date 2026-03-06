import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('tn_language');
    return stored === 'ta' ? 'ta' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('tn_language', language);
    document.documentElement.lang = language === 'ta' ? 'ta' : 'en';
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export { LanguageProvider, useLanguage };
