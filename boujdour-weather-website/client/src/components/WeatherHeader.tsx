import { Sun } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

export function WeatherHeader() {
  const { t } = useTranslation();

  return (
    <header className="glass-morphism shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Sun className="text-2xl text-yellow-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {t('cityName')}
              </h1>
              <p className="text-blue-100 text-sm">
                {t('subtitle')}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
