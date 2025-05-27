import { Map, Expand } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { WeatherData } from '@/types/weather';

interface WeatherMapProps {
  weather: WeatherData;
}

function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

export function WeatherMap({ weather }: WeatherMapProps) {
  const { t } = useTranslation();

  return (
    <section className="weather-card glass-morphism rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Map className="text-accent mr-3 rtl:mr-0 rtl:ml-3" />
        <span>{t('location')}</span>
      </h3>
      
      <div className="bg-white/10 rounded-xl h-64 relative overflow-hidden">
        {/* Placeholder for map - would integrate with Leaflet or similar */}
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mx-auto mb-2"></div>
            <div className="text-lg font-semibold">Boujdour</div>
            <div className="text-sm opacity-75">26.1265°N, 14.4815°W</div>
            <div className="text-xs opacity-60 mt-2">Atlantic Coast, Morocco</div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 text-white">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Boujdour</span>
          </div>
          <div className="text-xs opacity-90">26.1265°N, 14.4815°W</div>
        </div>
        
        <button
          type="button"
          title="Expand map"
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-white/30 transition-all"
        >
          <Expand className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-4 text-white text-sm space-y-2">
        <div className="flex justify-between">
          <span>{t('sunrise')}</span>
          <span>{formatTime(weather.sunrise)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('sunset')}</span>
          <span>{formatTime(weather.sunset)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('moonPhase')}</span>
          <span>🌓 First Quarter</span>
        </div>
      </div>
    </section>
  );
}
