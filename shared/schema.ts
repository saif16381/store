import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").unique(), // For external auth providers if needed
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  photoURL: text("photo_url"),
  role: text("role").notNull().default("buyer"), // "buyer" | "seller" | "admin"
  storeId: text("store_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
export type RegisterData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
