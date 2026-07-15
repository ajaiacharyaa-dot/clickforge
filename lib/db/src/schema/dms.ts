import { pgTable, serial, text, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const dmsTable = pgTable("dms", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  recipients: json("recipients").$type<string[]>().notNull().default([]),
  platform: text("platform").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled | sent | failed | draft
  createdAt: timestamp("created_at").notNull().defaultNow(),
  sentAt: timestamp("sent_at"),
});

export const insertDmSchema = createInsertSchema(dmsTable).omit({ id: true, createdAt: true });
export type InsertDm = z.infer<typeof insertDmSchema>;
export type Dm = typeof dmsTable.$inferSelect;
