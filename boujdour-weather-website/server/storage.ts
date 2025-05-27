import { 
  users, 
  weatherData, 
  oceanData, 
  forecastData,
  type User, 
  type InsertUser,
  type WeatherData,
  type InsertWeatherData,
  type OceanData,
  type InsertOceanData,
  type ForecastData,
  type InsertForecastData
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getLatestWeatherData(city: string): Promise<WeatherData | undefined>;
  createWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  
  getLatestOceanData(city: string): Promise<OceanData | undefined>;
  createOceanData(data: InsertOceanData): Promise<OceanData>;
  
  getForecastData(city: string): Promise<ForecastData[]>;
  createForecastData(data: InsertForecastData): Promise<ForecastData>;
  clearOldForecastData(city: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getLatestWeatherData(city: string): Promise<WeatherData | undefined> {
    const [weather] = await db
      .select()
      .from(weatherData)
      .where(eq(weatherData.city, city))
      .orderBy(desc(weatherData.timestamp))
      .limit(1);
    return weather || undefined;
  }

  async createWeatherData(data: InsertWeatherData): Promise<WeatherData> {
    const [weather] = await db
      .insert(weatherData)
      .values(data)
      .returning();
    return weather;
  }

  async getLatestOceanData(city: string): Promise<OceanData | undefined> {
    const [ocean] = await db
      .select()
      .from(oceanData)
      .where(eq(oceanData.city, city))
      .orderBy(desc(oceanData.timestamp))
      .limit(1);
    return ocean || undefined;
  }

  async createOceanData(data: InsertOceanData): Promise<OceanData> {
    const [ocean] = await db
      .insert(oceanData)
      .values(data)
      .returning();
    return ocean;
  }

  async getForecastData(city: string): Promise<ForecastData[]> {
    const forecasts = await db
      .select()
      .from(forecastData)
      .where(eq(forecastData.city, city))
      .orderBy(desc(forecastData.timestamp), forecastData.date);
    return forecasts;
  }

  async createForecastData(data: InsertForecastData): Promise<ForecastData> {
    const [forecast] = await db
      .insert(forecastData)
      .values(data)
      .returning();
    return forecast;
  }

  async clearOldForecastData(city: string): Promise<void> {
    await db.delete(forecastData).where(eq(forecastData.city, city));
  }
}

export const storage = new DatabaseStorage();
