import { WeatherData, OceanData, ForecastData } from '@/types/weather';

// Weather icon mapping for OpenWeatherMap icons
export const weatherIconMap: Record<string, string> = {
  '01d': '☀️', // clear sky day
  '01n': '🌙', // clear sky night
  '02d': '⛅', // few clouds day
  '02n': '☁️', // few clouds night
  '03d': '☁️', // scattered clouds day
  '03n': '☁️', // scattered clouds night
  '04d': '☁️', // broken clouds day
  '04n': '☁️', // broken clouds night
  '09d': '🌦️', // shower rain day
  '09n': '🌦️', // shower rain night
  '10d': '🌧️', // rain day
  '10n': '🌧️', // rain night
  '11d': '⛈️', // thunderstorm day
  '11n': '⛈️', // thunderstorm night
  '13d': '❄️', // snow day
  '13n': '❄️', // snow night
  '50d': '🌫️', // mist day
  '50n': '🌫️'  // mist night
};

// UV Index level mapping
export const uvLevels = {
  0: 'low',
  3: 'moderate', 
  6: 'high',
  8: 'veryHigh',
  11: 'extreme'
} as const;

// Wind direction mapping
export const windDirections = {
  0: 'N', 22.5: 'NNE', 45: 'NE', 67.5: 'ENE',
  90: 'E', 112.5: 'ESE', 135: 'SE', 157.5: 'SSE',
  180: 'S', 202.5: 'SSW', 225: 'SW', 247.5: 'WSW',
  270: 'W', 292.5: 'WNW', 315: 'NW', 337.5: 'NNW',
  360: 'N'
} as const;

/**
 * Get weather icon emoji from OpenWeatherMap icon code
 */
export function getWeatherIcon(iconCode: string): string {
  return weatherIconMap[iconCode] || '☀️';
}

/**
 * Get UV index level description
 */
export function getUVLevel(uvIndex: number): keyof typeof uvLevels {
  if (uvIndex < 3) return 0;
  if (uvIndex < 6) return 3;
  if (uvIndex < 8) return 6;
  if (uvIndex < 11) return 8;
  return 11;
}

/**
 * Get wind direction from degrees
 */
export function getWindDirection(degrees: number): string {
  const directions = Object.entries(windDirections);
  const closest = directions.reduce((prev, curr) => {
    const prevDiff = Math.abs(Number(prev[0]) - degrees);
    const currDiff = Math.abs(Number(curr[0]) - degrees);
    return currDiff < prevDiff ? curr : prev;
  });
  return closest[1];
}

/**
 * Format temperature with proper rounding
 */
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

/**
 * Format wind speed with units
 */
export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} km/h`;
}

/**
 * Format visibility distance
 */
export function formatVisibility(visibility: number): string {
  return `${visibility} km`;
}

/**
 * Format humidity percentage
 */
export function formatHumidity(humidity: number): string {
  return `${humidity}%`;
}

/**
 * Format time from ISO string to local time
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

/**
 * Format date for forecast display
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get day name from date string with today handling
 */
export function getDayName(dateString: string, index: number): string {
  if (index === 0) return 'Today';
  
  const date = new Date(dateString);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames[date.getDay()];
}

/**
 * Calculate feels like temperature description
 */
export function getFeelsLikeDescription(temp: number, feelsLike: number): string {
  const diff = feelsLike - temp;
  if (Math.abs(diff) <= 1) return 'Similar to actual';
  if (diff > 0) return 'Feels warmer';
  return 'Feels cooler';
}

/**
 * Get weather condition severity for alerts
 */
export function getWeatherSeverity(description: string): 'low' | 'medium' | 'high' {
  const lowSeverity = ['clear', 'sunny', 'partly cloudy', 'few clouds'];
  const highSeverity = ['thunderstorm', 'heavy rain', 'snow', 'blizzard', 'hurricane'];
  
  const lowerDesc = description.toLowerCase();
  
  if (highSeverity.some(severe => lowerDesc.includes(severe))) {
    return 'high';
  }
  
  if (lowSeverity.some(mild => lowerDesc.includes(mild))) {
    return 'low';
  }
  
  return 'medium';
}

/**
 * Calculate moon phase (simplified approximation)
 */
export function getMoonPhase(): { phase: string; emoji: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  
  // Simplified lunar calculation
  const totalDays = Math.floor((year - 2000) * 365.25 + month * 30.44 + day);
  const lunarCycle = 29.53; // days
  const phase = (totalDays % lunarCycle) / lunarCycle;
  
  if (phase < 0.125) return { phase: 'New Moon', emoji: '🌑' };
  if (phase < 0.25) return { phase: 'Waxing Crescent', emoji: '🌒' };
  if (phase < 0.375) return { phase: 'First Quarter', emoji: '🌓' };
  if (phase < 0.5) return { phase: 'Waxing Gibbous', emoji: '🌔' };
  if (phase < 0.625) return { phase: 'Full Moon', emoji: '🌕' };
  if (phase < 0.75) return { phase: 'Waning Gibbous', emoji: '🌖' };
  if (phase < 0.875) return { phase: 'Last Quarter', emoji: '🌗' };
  return { phase: 'Waning Crescent', emoji: '🌘' };
}

/**
 * Generate tide times for Boujdour (Atlantic coast simulation)
 */
export function generateTideTimes(): { highTide: string; lowTide: string } {
  const now = new Date();
  
  // Simulate Atlantic tidal patterns for Boujdour
  // High tide approximately every 12.4 hours
  const baseHour = 6; // Base time for high tide
  const tideOffset = (now.getDate() * 0.8) % 24; // Vary by day
  
  const highTideHour = (baseHour + tideOffset) % 24;
  const lowTideHour = (highTideHour + 6.2) % 24;
  
  const formatTideTime = (hour: number): string => {
    const h = Math.floor(hour);
    const m = Math.floor((hour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };
  
  return {
    highTide: formatTideTime(highTideHour),
    lowTide: formatTideTime(lowTideHour)
  };
}

/**
 * Calculate water temperature based on air temperature and season
 */
export function calculateWaterTemperature(airTemp: number): number {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Seasonal adjustment for Atlantic waters off Morocco
  const seasonalFactor = Math.sin((dayOfYear - 80) * Math.PI / 182.5) * 3;
  
  // Water temperature typically 2-5°C lower than air in this region
  const waterTemp = airTemp - 3 + seasonalFactor;
  
  // Clamp to realistic range for Atlantic coast of Morocco
  return Math.max(15, Math.min(25, waterTemp));
}

/**
 * Generate wave height based on wind speed and conditions
 */
export function calculateWaveHeight(windSpeed: number, weatherCondition: string): number {
  // Base wave height from wind (Beaufort scale approximation)
  let baseHeight = windSpeed * 0.1;
  
  // Adjust for weather conditions
  if (weatherCondition.includes('storm') || weatherCondition.includes('thunder')) {
    baseHeight *= 2;
  } else if (weatherCondition.includes('rain')) {
    baseHeight *= 1.3;
  } else if (weatherCondition.includes('clear') || weatherCondition.includes('sunny')) {
    baseHeight *= 0.8;
  }
  
  // Add some natural variation
  const variation = (Math.random() - 0.5) * 0.4;
  baseHeight += variation;
  
  // Clamp to realistic range for Atlantic coast
  return Math.max(0.3, Math.min(4.0, baseHeight));
}

/**
 * Validate weather data completeness
 */
export function validateWeatherData(data: any): boolean {
  const requiredFields = [
    'temperature', 'humidity', 'windSpeed', 'visibility',
    'description', 'icon', 'sunrise', 'sunset'
  ];
  
  return requiredFields.every(field => 
    data.hasOwnProperty(field) && 
    data[field] !== null && 
    data[field] !== undefined
  );
}

/**
 * Create a weather alert based on conditions
 */
export interface WeatherAlert {
  level: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
}

export function createWeatherAlert(weather: WeatherData): WeatherAlert | null {
  const { windSpeed, uvIndex, temperature, description } = weather;
  
  // High UV warning
  if (uvIndex > 8) {
    return {
      level: 'warning',
      title: 'High UV Index',
      message: `UV index is ${uvIndex}. Use sun protection when outdoors.`
    };
  }
  
  // High wind warning
  if (windSpeed > 50) {
    return {
      level: 'warning',
      title: 'Strong Winds',
      message: `Wind speed is ${Math.round(windSpeed)} km/h. Be cautious outdoors.`
    };
  }
  
  // Extreme temperature warning
  if (temperature > 40) {
    return {
      level: 'danger',
      title: 'Extreme Heat',
      message: `Temperature is ${Math.round(temperature)}°C. Stay hydrated and avoid prolonged sun exposure.`
    };
  }
  
  // Storm warning
  if (description.toLowerCase().includes('storm') || description.toLowerCase().includes('thunder')) {
    return {
      level: 'warning',
      title: 'Storm Alert',
      message: 'Thunderstorm conditions detected. Seek shelter indoors.'
    };
  }
  
  return null;
}

/**
 * Get color class for UV index display
 */
export function getUVIndexColor(uvIndex: number): string {
  if (uvIndex < 3) return 'text-green-400';
  if (uvIndex < 6) return 'text-yellow-400';
  if (uvIndex < 8) return 'text-orange-400';
  if (uvIndex < 11) return 'text-red-400';
  return 'text-purple-400';
}

/**
 * Calculate air quality index estimation based on weather conditions
 */
export function estimateAirQuality(weather: WeatherData): {
  index: number;
  level: string;
  color: string;
} {
  const { windSpeed, humidity, description } = weather;
  
  // Simple AQI estimation based on meteorological factors
  let baseAQI = 50; // Good baseline for coastal areas
  
  // Wind helps disperse pollutants
  if (windSpeed > 20) baseAQI -= 20;
  else if (windSpeed < 5) baseAQI += 15;
  
  // High humidity can trap pollutants
  if (humidity > 80) baseAQI += 10;
  
  // Rain helps clean the air
  if (description.includes('rain')) baseAQI -= 15;
  
  // Dust or fog can reduce air quality
  if (description.includes('dust') || description.includes('fog')) baseAQI += 25;
  
  // Clamp to valid AQI range
  const aqi = Math.max(0, Math.min(300, baseAQI));
  
  let level: string;
  let color: string;
  
  if (aqi <= 50) {
    level = 'Good';
    color = 'text-green-400';
  } else if (aqi <= 100) {
    level = 'Moderate';
    color = 'text-yellow-400';
  } else if (aqi <= 150) {
    level = 'Unhealthy for Sensitive';
    color = 'text-orange-400';
  } else if (aqi <= 200) {
    level = 'Unhealthy';
    color = 'text-red-400';
  } else {
    level = 'Very Unhealthy';
    color = 'text-purple-400';
  }
  
  return { index: aqi, level, color };
}
