import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Message Sentiment table
 * Armazena análise de sentimento de cada mensagem
 */
export const messageSentiments = mysqlTable("message_sentiments", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull(),
  conversationId: int("conversationId").notNull(),
  sentiment: mysqlEnum("sentiment", ["positive", "neutral", "negative"]).notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).notNull(), // 0.00 a 1.00
  score: decimal("score", { precision: 4, scale: 3 }).notNull(), // -1.00 a 1.00
  emotions: text("emotions"), // JSON: { joy: 0.8, sadness: 0.1, ... }
  keywords: text("keywords"), // JSON: ["problema", "insatisfeito", ...]
  summary: text("summary"), // Resumo da análise
  requiresReview: int("requiresReview").default(0), // Flag para revisão manual
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MessageSentiment = typeof messageSentiments.$inferSelect;
export type InsertMessageSentiment = typeof messageSentiments.$inferInsert;

/**
 * Sentiment Summary table
 * Agregação diária de sentimentos
 */
export const sentimentSummary = mysqlTable("sentiment_summary", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull().unique(), // YYYY-MM-DD
  totalMessages: int("totalMessages").default(0),
  positiveCount: int("positiveCount").default(0),
  neutralCount: int("neutralCount").default(0),
  negativeCount: int("negativeCount").default(0),
  avgSentimentScore: decimal("avgSentimentScore", { precision: 4, scale: 3 }).default("0"),
  satisfactionRate: decimal("satisfactionRate", { precision: 5, scale: 2 }).default("0"), // Percentual
  topEmotions: text("topEmotions"), // JSON: { joy: 45, sadness: 20, ... }
  topKeywords: text("topKeywords"), // JSON: ["problema", "demora", ...]
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SentimentSummary = typeof sentimentSummary.$inferSelect;
export type InsertSentimentSummary = typeof sentimentSummary.$inferInsert;

/**
 * Negative Sentiment Alerts table
 * Rastrear mensagens com sentimento negativo para ação
 */
export const negativeAlerts = mysqlTable("negative_alerts", {
  id: int("id").autoincrement().primaryKey(),
  messageId: int("messageId").notNull(),
  conversationId: int("conversationId").notNull(),
  sentiment: mysqlEnum("sentiment", ["negative"]).notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "reviewed", "resolved"]).default("pending"),
  assignedTo: int("assignedTo"), // ID do usuário responsável
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type NegativeAlert = typeof negativeAlerts.$inferSelect;
export type InsertNegativeAlert = typeof negativeAlerts.$inferInsert;
