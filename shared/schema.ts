import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
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
