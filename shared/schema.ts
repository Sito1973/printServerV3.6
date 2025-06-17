import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  apiKey: text("api_key").notNull().unique(),
  isAdmin: boolean("is_admin").default(false),
  location: text("location"), // Empresa
  floor: text("floor"), // Sede
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  isAdmin: true,
  location: true,
  floor: true,
});

// Printers table
export const printers = pgTable("printers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  model: text("model"),
  status: text("status").default("offline"),
  lastPrintTime: timestamp("last_print_time"),
  floor: text("floor"),
  uniqueId: text("unique_id").notNull().unique(),
  isActive: boolean("is_active").default(true),
});

export const insertPrinterSchema = createInsertSchema(printers).pick({
  name: true,
  location: true,
  model: true,
  status: true,
  floor: true,
  uniqueId: true,
  isActive: true,
});

// Print Jobs table
export const printJobs = pgTable("print_jobs", {
  id: serial("id").primaryKey(),
  documentUrl: text("document_url").notNull(),
  documentName: text("document_name").notNull(),
  printerId: integer("printer_id").references(() => printers.id),
  userId: integer("user_id").references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed, ready_for_client
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  copies: integer("copies").default(1),
  duplex: boolean("duplex").default(false),
  orientation: text("orientation").default("portrait"), // portrait, landscape
  qzTrayData: text("qz_tray_data"), // Datos preparados para QZ Tray
});

export const insertPrintJobSchema = createInsertSchema(printJobs).pick({
  documentUrl: true,
  documentName: true,
  printerId: true,
  userId: true,
  copies: true,
  duplex: true,
  orientation: true,
});

// API Key validation schema
export const apiKeyHeaderSchema = z.object({
  authorization: z.string().regex(/^Bearer\s.+$/i),
});

// Print job request schema
export const printJobRequestSchema = z.object({
  printerId: z.string(),
  documentUrl: z.string().url(),
  options: z.object({
    copies: z.number().int().positive().default(1),
    duplex: z.boolean().default(false),
    orientation: z.enum(["portrait", "landscape"]).default("portrait"),
  }).default({}),
});

// Simplified print job request schema for API (string printer ID)
export const simplePrintJobRequestSchema = z.object({
  printerId: z.string(),
  documentUrl: z.string().url(),
});

// Print job request schema for numeric printer ID
export const numericPrinterJobRequestSchema = z.object({
  printerId: z.number().int().positive(),
  documentUrl: z.string().url(),
  documentName: z.string().optional(),
  copies: z.number().int().positive().default(1),
  duplex: z.boolean().default(false),
  orientation: z.enum(["portrait", "landscape"]).default("portrait"),
  margins: z.object({
    top: z.number().positive().default(12.7),    // mm (equivalente a 0.5 pulgadas)
    right: z.number().positive().default(12.7),
    bottom: z.number().positive().default(12.7),
    left: z.number().positive().default(12.7)
  }).optional()
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPrinter = z.infer<typeof insertPrinterSchema>;
export type Printer = typeof printers.$inferSelect;

export type InsertPrintJob = z.infer<typeof insertPrintJobSchema>;
export type PrintJob = typeof printJobs.$inferSelect;

export type PrintJobRequest = z.infer<typeof printJobRequestSchema>;
export type SimplePrintJobRequest = z.infer<typeof simplePrintJobRequestSchema>;
export type NumericPrinterJobRequest = z.infer<typeof numericPrinterJobRequestSchema>;