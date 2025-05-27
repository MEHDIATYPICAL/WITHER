export interface WeatherData {
  id: number;
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  pressure: number;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
  timestamp: string;
}

export interface OceanData {
  id: number;
  city: string;
  waveHeight: number;
  waterTemperature: number;
  highTide: string;
  lowTide: string;
  timestamp: string;
}

export interface ForecastData {
  id: number;
  city: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  timestamp: string;
}

export interface WeatherResponse {
  current: WeatherData;
  ocean: OceanData;
  forecast: ForecastData[];
}

export type Language = 'en' | 'fr' | 'ar';

export interface LanguageConfig {
  code: Language;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}
