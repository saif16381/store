import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import createMemoryStore from "memorystore";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

function sanitizeUser(user: { password?: string; [key: string]: unknown }) {
  const { password, ...safe } = user;
  return safe;
}

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
      
      if (!user || !(await bcrypt.compare(data.password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      req.session.userId = user.id;
      res.status(200).json(sanitizeUser(user));
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

      const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
      const user = await storage.createUser({
        email: data.email,
        password: hashedPassword,
        displayName: data.displayName,
        role: "buyer"
      });
      
      req.session.userId = user.id;
      res.status(201).json(sanitizeUser(user));
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
    res.status(200).json(sanitizeUser(user));
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

  // Store Routes
  app.post(api.stores.create.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.stores.create.input.parse(req.body);
      const store = await storage.createStore({
        ...input,
        ownerId: req.session.userId,
      });
      
      // Update user role to seller and set storeId
      await storage.updateUser(req.session.userId, {
        role: "seller",
        storeId: store.id,
      });

      res.status(201).json(store);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.stores.getMine.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const store = await storage.getStoreByOwnerId(req.session.userId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.json(store);
  });

  app.get(api.stores.getBySlug.path, async (req, res) => {
    const store = await storage.getStoreBySlug(req.params.slug);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    res.json(store);
  });

  app.patch(api.stores.update.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const store = await storage.getStore(Number(req.params.id));
    if (!store || store.ownerId !== req.session.userId) {
      return res.status(404).json({ message: "Store not found or unauthorized" });
    }
    try {
      const updates = api.stores.update.input.parse(req.body);
      const updated = await storage.updateStore(store.id, updates);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Product Routes
  app.get("/api/stores/:id/products", async (req, res) => {
    const productsList = await storage.getProductsByStore(parseInt(req.params.id));
    res.json(productsList);
  });

  app.get("/api/products", async (_req, res) => {
    const productsList = await storage.getProducts();
    res.json(productsList);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(parseInt(req.params.id));
    if (!product) return res.status(404).send("Product not found");
    res.json(product);
  });

  app.post("/api/products", async (req, res) => {
    if (!req.session.userId) return res.sendStatus(401);
    const product = await storage.createProduct(req.body);
    res.status(201).json(product);
  });

  app.patch("/api/products/:id", async (req, res) => {
    if (!req.session.userId) return res.sendStatus(401);
    const product = await storage.updateProduct(parseInt(req.params.id), req.body);
    res.json(product);
  });

  app.delete("/api/products/:id", async (req, res) => {
    if (!req.session.userId) return res.sendStatus(401);
    await storage.deleteProduct(parseInt(req.params.id));
    res.sendStatus(204);
  });

  return httpServer;
}
