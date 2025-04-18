import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProtectedAppSchema, 
  insertPanicSettingsSchema, 
  type InsertProtectedApp, 
  type InsertPanicSettings
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Protected Apps API endpoints
  app.get("/api/protected-apps", async (req, res) => {
    try {
      const userId = 1; // Default user for demo purposes
      const apps = await storage.getProtectedApps(userId);
      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve protected apps" });
    }
  });

  app.post("/api/protected-apps", async (req, res) => {
    try {
      const userId = 1; // Default user for demo purposes
      const appData = insertProtectedAppSchema.parse(req.body);
      const newApp = await storage.createProtectedApp(appData, userId);
      res.status(201).json(newApp);
    } catch (error) {
      res.status(400).json({ message: "Invalid app data" });
    }
  });

  app.put("/api/protected-apps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const appData = insertProtectedAppSchema.parse(req.body);
      const updatedApp = await storage.updateProtectedApp(id, appData);
      if (!updatedApp) {
        return res.status(404).json({ message: "App not found" });
      }
      res.json(updatedApp);
    } catch (error) {
      res.status(400).json({ message: "Invalid app data" });
    }
  });

  app.delete("/api/protected-apps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProtectedApp(id);
      if (!success) {
        return res.status(404).json({ message: "App not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete app" });
    }
  });

  // Panic Settings API endpoints
  app.get("/api/panic-settings", async (req, res) => {
    try {
      const userId = 1; // Default user for demo purposes
      const settings = await storage.getPanicSettings(userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve panic settings" });
    }
  });

  app.post("/api/panic-settings", async (req, res) => {
    try {
      const userId = 1; // Default user for demo purposes
      const settingsData = insertPanicSettingsSchema.parse(req.body);
      const settings = await storage.createPanicSettings(settingsData, userId);
      res.status(201).json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  app.put("/api/panic-settings", async (req, res) => {
    try {
      const userId = 1; // Default user for demo purposes
      const settingsData = insertPanicSettingsSchema.partial().parse(req.body);
      const settings = await storage.updatePanicSettings(userId, settingsData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
