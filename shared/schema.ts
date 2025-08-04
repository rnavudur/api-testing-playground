import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const apiRequests = pgTable("api_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  method: text("method").notNull(),
  url: text("url").notNull(),
  headers: jsonb("headers").$type<Record<string, string>>().default({}),
  queryParams: jsonb("query_params").$type<Record<string, string>>().default({}),
  body: text("body"),
  response: jsonb("response").$type<any>(),
  responseHeaders: jsonb("response_headers").$type<Record<string, string>>().default({}),
  status: text("status"),
  statusCode: text("status_code"),
  responseTime: text("response_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertApiRequestSchema = createInsertSchema(apiRequests).omit({
  id: true,
  createdAt: true,
});

export type InsertApiRequest = z.infer<typeof insertApiRequestSchema>;
export type ApiRequest = typeof apiRequests.$inferSelect;

// Frontend-only types for request configuration
export const apiRequestConfigSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  url: z.string().url(),
  headers: z.record(z.string()).default({}),
  queryParams: z.record(z.string()).default({}),
  body: z.string().optional(),
});

export type ApiRequestConfig = z.infer<typeof apiRequestConfigSchema>;

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  username: varchar("username").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  password: varchar("password").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type SignupRequest = z.infer<typeof signupSchema>;
