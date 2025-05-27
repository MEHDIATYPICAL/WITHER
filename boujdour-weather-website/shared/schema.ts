import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  temperature: real("temperature").notNull(),
  feelsLike: real("feels_like").notNull(),
  humidity: integer("humidity").notNull(),
  windSpeed: real("wind_speed").notNull(),
  windDirection: integer("wind_direction").notNull(),
  visibility: real("visibility").notNull(),
  uvIndex: real("uv_index").notNull(),
  pressure: real("pressure").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  sunrise: timestamp("sunrise").notNull(),
  sunset: timestamp("sunset").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const oceanData = pgTable("ocean_data", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  waveHeight: real("wave_height").notNull(),
  waterTemperature: real("water_temperature").notNull(),
  highTide: text("high_tide").notNull(),
  lowTide: text("low_tide").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const forecastData = pgTable("forecast_data", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  date: timestamp("date").notNull(),
  maxTemp: real("max_temp").notNull(),
  minTemp: real("min_temp").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  humidity: integer("humidity").notNull(),
  windSpeed: real("wind_speed").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  timestamp: true,
});

export const insertOceanDataSchema = createInsertSchema(oceanData).omit({
  id: true,
  timestamp: true,
});

export const insertForecastDataSchema = createInsertSchema(forecastData).omit({
  id: true,
  timestamp: true,
});

export const userSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  password: z.string(),
});
