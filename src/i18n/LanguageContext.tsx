import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { en } from './en';
import { tr } from './tr';

export type Lang = 'en' | 'tr';

const DICTS: Record<Lang, Record<string, string>> = { en, tr };
const STORAGE_KEY = 'schemaflow_lang';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof en, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'tr' || stored === 'en' ? stored : 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const t = useCallback(
    (key: keyof typeof en, vars?: Record<string, string | number>) => {
      const dict = DICTS[lang];
      let str = dict[key as string] ?? en[key as string] ?? String(key);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return ctx;
}
