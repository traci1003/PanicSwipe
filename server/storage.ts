import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { protectedApps, panicSettings, type ProtectedApp, type PanicSettings, type InsertProtectedApp, type InsertPanicSettings } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Protected Apps methods
  getProtectedApps(userId: number): Promise<ProtectedApp[]>;
  getProtectedApp(id: number): Promise<ProtectedApp | undefined>;
  createProtectedApp(app: InsertProtectedApp, userId: number): Promise<ProtectedApp>;
  updateProtectedApp(id: number, app: Partial<InsertProtectedApp>): Promise<ProtectedApp | undefined>;
  deleteProtectedApp(id: number): Promise<boolean>;
  
  // Panic Settings methods
  getPanicSettings(userId: number): Promise<PanicSettings | undefined>;
  createPanicSettings(settings: InsertPanicSettings, userId: number): Promise<PanicSettings>;
  updatePanicSettings(userId: number, settings: Partial<InsertPanicSettings>): Promise<PanicSettings | undefined>;
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
  
  // Protected Apps methods
  async getProtectedApps(userId: number): Promise<ProtectedApp[]> {
    return db
      .select()
      .from(protectedApps)
      .where(eq(protectedApps.userId, userId));
  }
  
  async getProtectedApp(id: number): Promise<ProtectedApp | undefined> {
    const [app] = await db
      .select()
      .from(protectedApps)
      .where(eq(protectedApps.id, id));
    return app || undefined;
  }
  
  async createProtectedApp(app: InsertProtectedApp, userId: number): Promise<ProtectedApp> {
    const [createdApp] = await db
      .insert(protectedApps)
      .values({ ...app, userId })
      .returning();
    return createdApp;
  }
  
  async updateProtectedApp(id: number, app: Partial<InsertProtectedApp>): Promise<ProtectedApp | undefined> {
    const [updatedApp] = await db
      .update(protectedApps)
      .set(app)
      .where(eq(protectedApps.id, id))
      .returning();
    return updatedApp || undefined;
  }
  
  async deleteProtectedApp(id: number): Promise<boolean> {
    const result = await db
      .delete(protectedApps)
      .where(eq(protectedApps.id, id));
    return true; // In PostgreSQL with Drizzle, deletion without error means success
  }
  
  // Panic Settings methods
  async getPanicSettings(userId: number): Promise<PanicSettings | undefined> {
    const [settings] = await db
      .select()
      .from(panicSettings)
      .where(eq(panicSettings.userId, userId));
    return settings || undefined;
  }
  
  async createPanicSettings(settings: InsertPanicSettings, userId: number): Promise<PanicSettings> {
    const [createdSettings] = await db
      .insert(panicSettings)
      .values({ ...settings, userId })
      .returning();
    return createdSettings;
  }
  
  async updatePanicSettings(userId: number, settings: Partial<InsertPanicSettings>): Promise<PanicSettings | undefined> {
    const [updatedSettings] = await db
      .update(panicSettings)
      .set(settings)
      .where(eq(panicSettings.userId, userId))
      .returning();
    return updatedSettings || undefined;
  }
}

export const storage = new DatabaseStorage();
