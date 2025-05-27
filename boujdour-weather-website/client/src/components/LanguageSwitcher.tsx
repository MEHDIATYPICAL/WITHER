import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Language } from '@/types/weather';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, switchLanguage, languageConfig, availableLanguages } = useTranslation();

  const handleLanguageChange = (lang: Language) => {
    switchLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-morphism px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse"
      >
        <span>{languageConfig.flag}</span>
        <span>{languageConfig.code.toUpperCase()}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 glass-morphism rounded-lg shadow-xl z-20">
            <div className="py-2">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full px-4 py-2 text-left rtl:text-right text-white hover:bg-white/20 flex items-center space-x-3 rtl:space-x-reverse transition-colors ${
                    currentLanguage === lang.code ? 'bg-white/10' : ''
                  } ${lang.code === 'ar' ? 'font-arabic' : ''}`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
