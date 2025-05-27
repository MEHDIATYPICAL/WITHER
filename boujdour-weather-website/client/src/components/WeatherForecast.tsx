import { Calendar } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { ForecastData } from '@/types/weather';
import { translations } from '@/lib/translations';

interface WeatherForecastProps {
  forecast: ForecastData[];
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

function getDayName(dateString: string, index: number, t: any): string {
  if (index === 0) return t('today');
  
  const date = new Date(dateString);
  const dayNames = [
    t('sunday'), t('monday'), t('tuesday'), t('wednesday'), 
    t('thursday'), t('friday'), t('saturday')
  ];
  return dayNames[date.getDay()].slice(0, 3);
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  const { t } = useTranslation();

  return (
    <section className="weather-card glass-morphism rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Calendar className="text-accent mr-3 rtl:mr-0 rtl:ml-3" />
        <span>{t('forecast')}</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Array.isArray(forecast) ? forecast.slice(0, 5).map((day, index) => (
          <div 
            key={day.id}
            className="bg-white/10 rounded-xl p-4 text-center text-white hover:bg-white/20 transition-all"
          >
            <div className="text-sm opacity-90 mb-2">
              {getDayName(day.date, index, t)}
            </div>
            <div className="text-3xl mb-2">
              {getWeatherIcon(day.icon)}
            </div>
            <div className="font-semibold mb-1">
              {Math.round(day.maxTemp)}°
            </div>
            <div className="text-sm opacity-75">
              {Math.round(day.minTemp)}°
            </div>
            <div className="text-xs mt-2 opacity-90 capitalize">
              {day.description}
            </div>
          </div>
        )) : (
          <div className="col-span-5 text-center text-white/70 py-8">
            No forecast data available
          </div>
        )}
      </div>
    </section>
  );
}
