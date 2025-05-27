import { Waves, ArrowUp, ArrowDown, Sun } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { OceanData, WeatherData } from '@/types/weather';

interface OceanWeatherProps {
  ocean: OceanData;
  weather: WeatherData;
}

export function OceanWeather({ ocean, weather }: OceanWeatherProps) {
  const { t } = useTranslation();

  return (
    <section className="weather-card glass-morphism rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Waves className="text-ocean mr-3 rtl:mr-0 rtl:ml-3" />
        <span>{t('oceanConditions')}</span>
      </h3>
      
      <div className="space-y-4">
        <div className="ocean-wave rounded-xl p-4 text-white">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm opacity-90">{t('waveHeight')}</div>
              <div className="text-2xl font-bold">{ocean.waveHeight.toFixed(1)} m</div>
            </div>
            <div>
              <div className="text-sm opacity-90">{t('waterTemp')}</div>
              <div className="text-2xl font-bold">{Math.round(ocean.waterTemperature)}°C</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <ArrowUp className="text-accent" />
              <span className="text-sm">{t('highTide')}</span>
            </div>
            <div className="font-semibold">{ocean.highTide}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <ArrowDown className="text-blue-300" />
              <span className="text-sm">{t('lowTide')}</span>
            </div>
            <div className="font-semibold">{ocean.lowTide}</div>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">{t('uvIndex')}</div>
              <div className="text-lg font-semibold">
                {weather.uvIndex} - {weather.uvIndex > 7 ? t('high') : weather.uvIndex > 3 ? t('moderate') : t('low')}
              </div>
            </div>
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
              <Sun className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
