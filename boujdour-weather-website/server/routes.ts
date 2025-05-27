import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWeatherDataSchema, insertOceanDataSchema, insertForecastDataSchema } from "@shared/schema";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY || "";
const BOUJDOUR_LAT = 26.1265;
const BOUJDOUR_LON = -14.4815;

async function fetchWeatherData() {
  if (!OPENWEATHER_API_KEY) {
    throw new Error("OpenWeatherMap API key not configured");
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${BOUJDOUR_LAT}&lon=${BOUJDOUR_LON}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${BOUJDOUR_LAT}&lon=${BOUJDOUR_LON}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${BOUJDOUR_LAT}&lon=${BOUJDOUR_LON}&appid=${OPENWEATHER_API_KEY}`;

  const [weatherResponse, forecastResponse, uvResponse] = await Promise.all([
    fetch(currentWeatherUrl),
    fetch(forecastUrl),
    fetch(uvUrl)
  ]);

  if (!weatherResponse.ok) {
    throw new Error(`Weather API error: ${weatherResponse.statusText}`);
  }
  if (!forecastResponse.ok) {
    throw new Error(`Forecast API error: ${forecastResponse.statusText}`);
  }
  if (!uvResponse.ok) {
    throw new Error(`UV API error: ${uvResponse.statusText}`);
  }

  const weatherData = await weatherResponse.json();
  const forecastData = await forecastResponse.json();
  const uvData = await uvResponse.json();

  return { weatherData, forecastData, uvData };
}

function generateOceanData() {
  // Simulate ocean data for Boujdour's Atlantic coast
  const now = new Date();
  const highTideTime = new Date(now);
  highTideTime.setHours(15, 30, 0, 0);
  const lowTideTime = new Date(now);
  lowTideTime.setHours(21, 45, 0, 0);

  return {
    city: "Boujdour",
    waveHeight: Math.random() * 2 + 0.5, // 0.5-2.5m
    waterTemperature: Math.random() * 5 + 17, // 17-22°C
    highTide: highTideTime.toTimeString().slice(0, 5),
    lowTide: lowTideTime.toTimeString().slice(0, 5),
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/weather/current", async (req, res) => {
    try {
      const { weatherData, uvData } = await fetchWeatherData();
      
      const weatherRecord = {
        city: "Boujdour",
        country: "Morocco",
        temperature: weatherData.main.temp,
        feelsLike: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed * 3.6, // Convert m/s to km/h
        windDirection: weatherData.wind.deg,
        visibility: weatherData.visibility / 1000, // Convert m to km
        uvIndex: uvData.value,
        pressure: weatherData.main.pressure,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        sunrise: new Date(weatherData.sys.sunrise * 1000),
        sunset: new Date(weatherData.sys.sunset * 1000),
      };

      const validated = insertWeatherDataSchema.parse(weatherRecord);
      const saved = await storage.createWeatherData(validated);
      
      res.json(saved);
    } catch (error) {
      console.error("Weather fetch error:", error);
      res.status(500).json({ 
        error: "Failed to fetch weather data",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/weather/ocean", async (req, res) => {
    try {
      const oceanRecord = generateOceanData();
      const validated = insertOceanDataSchema.parse(oceanRecord);
      const saved = await storage.createOceanData(validated);
      
      res.json(saved);
    } catch (error) {
      console.error("Ocean data error:", error);
      res.status(500).json({ 
        error: "Failed to generate ocean data",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/weather/forecast", async (req, res) => {
    try {
      const { forecastData } = await fetchWeatherData();
      
      // Clear old forecast data
      await storage.clearOldForecastData("Boujdour");
      
      // Process 5-day forecast (take one forecast per day)
      const dailyForecasts = [];
      const processedDates = new Set();
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        
        if (!processedDates.has(dateKey) && dailyForecasts.length < 5) {
          processedDates.add(dateKey);
          
          const forecastRecord = {
            city: "Boujdour",
            date: date,
            maxTemp: item.main.temp_max,
            minTemp: item.main.temp_min,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed * 3.6, // Convert m/s to km/h
          };

          const validated = insertForecastDataSchema.parse(forecastRecord);
          const saved = await storage.createForecastData(validated);
          dailyForecasts.push(saved);
        }
      }
      
      res.json(dailyForecasts);
    } catch (error) {
      console.error("Forecast fetch error:", error);
      res.status(500).json({ 
        error: "Failed to fetch forecast data",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/weather/all", async (req, res) => {
    try {
      const [currentWeatherRes, oceanRes, forecastRes] = await Promise.all([
        fetch(`${req.protocol}://${req.get('host')}/api/weather/current`),
        fetch(`${req.protocol}://${req.get('host')}/api/weather/ocean`),
        fetch(`${req.protocol}://${req.get('host')}/api/weather/forecast`)
      ]);

      const currentWeather = await currentWeatherRes.json();
      const ocean = await oceanRes.json();
      const forecast = await forecastRes.json();

      res.json({
        current: currentWeather,
        ocean: ocean,
        forecast: forecast
      });
    } catch (error) {
      console.error("All weather data fetch error:", error);
      res.status(500).json({ 
        error: "Failed to fetch complete weather data",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
