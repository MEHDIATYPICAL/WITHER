import { AlertCircle, RefreshCw } from 'lucide-react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useTranslation } from '@/hooks/useTranslation';
import { WeatherHeader } from '@/components/WeatherHeader';
import { CurrentWeather } from '@/components/CurrentWeather';
import { OceanWeather } from '@/components/OceanWeather';
import { WeatherMap } from '@/components/WeatherMap';
import { WeatherForecast } from '@/components/WeatherForecast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingState() {
  return (
    <div className="space-y-8">
      <Card className="glass-morphism border-none">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-64 bg-white/20" />
              <Skeleton className="h-4 w-48 bg-white/20" />
              <Skeleton className="h-4 w-56 bg-white/20" />
            </div>
            <div className="flex-1 text-center space-y-4">
              <Skeleton className="h-20 w-20 rounded-full bg-white/20 mx-auto" />
              <Skeleton className="h-12 w-32 bg-white/20 mx-auto" />
              <Skeleton className="h-6 w-40 bg-white/20 mx-auto" />
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 bg-white/20 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <Skeleton className="h-96 bg-white/20 rounded-2xl" />
        <Skeleton className="h-96 bg-white/20 rounded-2xl" />
      </div>
      
      <Skeleton className="h-64 bg-white/20 rounded-2xl" />
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  
  return (
    <Card className="glass-morphism border-none">
      <CardContent className="p-8 text-center">
        <div className="text-red-400 text-6xl mb-4">
          <AlertCircle className="mx-auto" size={64} />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {t('errorTitle')}
        </h3>
        <p className="text-blue-100 mb-6">
          {t('errorMessage')}
        </p>
        <Button
          onClick={onRetry}
          className="bg-accent hover:bg-yellow-600 text-white font-semibold"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('retry')}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { data: weatherData, isLoading, isError, refetch } = useWeatherData();
  const { t } = useTranslation();

  const lastUpdated = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600">
      <WeatherHeader />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {isLoading && <LoadingState />}
        
        {isError && <ErrorState onRetry={() => refetch()} />}
        
        {weatherData && (
          <>
            <CurrentWeather weather={weatherData.current} />
            
            <div className="grid lg:grid-cols-2 gap-8">
              <OceanWeather 
                ocean={weatherData.ocean} 
                weather={weatherData.current} 
              />
              <WeatherMap weather={weatherData.current} />
            </div>
            
            <WeatherForecast forecast={weatherData.forecast} />
          </>
        )}
      </main>

      <footer className="glass-morphism mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <p className="text-sm opacity-90">
                {t('dataSource')}
              </p>
              <p className="text-xs opacity-75">
                {t('lastUpdated')} {lastUpdated}
              </p>
            </div>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <button className="text-sm hover:text-accent transition-colors">
                {t('about')}
              </button>
              <button className="text-sm hover:text-accent transition-colors">
                {t('contact')}
              </button>
              <button className="text-sm hover:text-accent transition-colors">
                {t('privacy')}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
