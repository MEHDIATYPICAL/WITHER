import { useState, useEffect } from 'react';
import { Language } from '@/types/weather';
import { translations, languageConfigs } from '@/lib/translations';

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const switchLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    const config = languageConfigs[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = config.dir;
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && translations[savedLang]) {
      switchLanguage(savedLang);
    }
  }, []);

  const t = (key: keyof typeof translations.en): string => {
    return translations[currentLanguage][key] || translations.en[key];
  };

  return {
    currentLanguage,
    switchLanguage,
    t,
    languageConfig: languageConfigs[currentLanguage],
    availableLanguages: Object.values(languageConfigs)
  };
}
