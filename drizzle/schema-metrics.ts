import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * WhatsApp Metrics table
 * Armazena métricas de atendimento para análise
 */
export const whatsappMetrics = mysqlTable("whatsapp_metrics", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  metricType: mysqlEnum("metricType", [
    "message_received",
    "response_sent",
    "response_time",
    "escalation",
    "resolution",
  ]).notNull(),
  urgency: mysqlEnum("urgency", ["low", "medium", "high", "critical"]),
  requiresReview: int("requiresReview").default(0),
  responseTime: int("responseTime"), // em segundos
  satisfaction: int("satisfaction"), // 1-5
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type WhatsappMetric = typeof whatsappMetrics.$inferSelect;
export type InsertWhatsappMetric = typeof whatsappMetrics.$inferInsert;

/**
 * Daily Stats table
 * Agregação diária de métricas
 */
export const dailyStats = mysqlTable("daily_stats", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull().unique(), // YYYY-MM-DD
  totalMessages: int("totalMessages").default(0),
  totalResponses: int("totalResponses").default(0),
  avgResponseTime: decimal("avgResponseTime", { precision: 10, scale: 2 }).default("0"),
  escalations: int("escalations").default(0),
  resolutions: int("resolutions").default(0),
  avgSatisfaction: decimal("avgSatisfaction", { precision: 3, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailyStat = typeof dailyStats.$inferSelect;
export type InsertDailyStat = typeof dailyStats.$inferInsert;
