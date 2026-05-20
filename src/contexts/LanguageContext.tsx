import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Lang } from '@/lib/locales';

interface LanguageContextType {
  lang: Lang;
  toggleLanguage: () => void;
  isTransitioning: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, isTransitioning }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
