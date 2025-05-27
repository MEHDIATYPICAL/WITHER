import { useQuery } from '@tanstack/react-query';
import { WeatherResponse } from '@/types/weather';

async function fetchWeatherData(): Promise<WeatherResponse> {
  const response = await fetch('/api/weather/all');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export function useWeatherData() {
  return useQuery({
    queryKey: ['/api/weather/all'],
    queryFn: fetchWeatherData,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
