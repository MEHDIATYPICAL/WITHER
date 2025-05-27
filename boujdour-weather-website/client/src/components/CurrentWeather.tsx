import { MapPin, Eye, Droplets, Wind, Thermometer, Sun, Moon } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { WeatherData } from '@/types/weather';

interface CurrentWeatherProps {
  weather: WeatherData;
}

function getWeatherIcon(icon: string): string {
  const iconMap: Record<string, string> = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌦️', '09n': '🌦️',
    '10d': '🌧️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };
  return iconMap[icon] || '☀️';
}

function getUVLevel(
  uvIndex: number,
  t: (key: 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme') => string
): string {
  if (uvIndex < 3) return t('low');
  if (uvIndex < 6) return t('moderate');
  if (uvIndex < 8) return t('high');
  if (uvIndex < 11) return t('veryHigh');
  return t('extreme');
}

function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

export function CurrentWeather({ weather }: CurrentWeatherProps) {
  const { t } = useTranslation();
  
  const currentTime = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <section className="weather-card glass-morphism rounded-2xl p-8 text-center text-white">
      <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
        <div className="flex-1">
          <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-4">
            <MapPin className="text-accent" />
            <h2 className="text-2xl font-semibold">{t('boujdour')}</h2>
          </div>
          <div className="text-blue-100 mb-2">
            {currentTime}
          </div>
          <div className="text-blue-100 text-sm">
            {t('dailyRenewal')}
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {getWeatherIcon(weather.icon)}
            </div>
            <div className="text-5xl font-light mb-2">
              {Math.round(weather.temperature)}°C
            </div>
            <div className="text-xl capitalize">
              {weather.description}
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <Eye className="w-4 h-4 text-blue-300" />
                <span>{t('visibility')}</span>
              </div>
              <div className="text-lg font-semibold">{weather.visibility} km</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <Droplets className="w-4 h-4 text-blue-300" />
                <span>{t('humidity')}</span>
              </div>
              <div className="text-lg font-semibold">{weather.humidity}%</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <Wind className="w-4 h-4 text-blue-300" />
                <span>{t('windSpeed')}</span>
              </div>
              <div className="text-lg font-semibold">{Math.round(weather.windSpeed)} km/h</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <Thermometer className="w-4 h-4 text-blue-300" />
                <span>{t('feelsLike')}</span>
              </div>
              <div className="text-lg font-semibold">{Math.round(weather.feelsLike)}°C</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional info row */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="flex items-center space-x-2 rtl:space-x-reverse">
              <Sun className="w-4 h-4 text-yellow-400" />
              <span>{t('sunrise')}</span>
            </span>
            <span>{formatTime(weather.sunrise)}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center space-x-2 rtl:space-x-reverse">
              <Moon className="w-4 h-4 text-blue-400" />
              <span>{t('sunset')}</span>
            </span>
            <span>{formatTime(weather.sunset)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('uvIndex')}</span>
            <span>{weather.uvIndex} - {getUVLevel(weather.uvIndex, t)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
