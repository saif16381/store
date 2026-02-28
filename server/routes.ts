import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import createMemoryStore from "memorystore";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

const MemoryStore = createMemoryStore(session);

// Extend express session data
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup session middleware
  app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'keyboard cat'
  }));

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const data = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(data.email);
      
      // In a real app, use password hashing!
      if (!user || user.password !== data.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      req.session.userId = user.id;
      res.status(200).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const data = api.auth.register.input.parse(req.body);
      
      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const user = await storage.createUser({
        email: data.email,
        password: data.password, // In a real app, hash this!
        displayName: data.displayName,
        role: "buyer"
      });
      
      req.session.userId = user.id;
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.status(200).json(user);
  });

  app.post(api.auth.forgotPassword.path, async (req, res) => {
    try {
      const data = api.auth.forgotPassword.input.parse(req.body);
      // Simulate sending email
      res.status(200).json({ message: "If an account exists, a reset email was sent." });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  return httpServer;
}
