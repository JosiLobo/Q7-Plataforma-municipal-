import { eq, gte, lte, sql } from "drizzle-orm";
import { messageSentiments, sentimentSummary, negativeAlerts, InsertMessageSentiment, InsertNegativeAlert } from "../drizzle/schema";
import { getDb } from "./db";
import { SentimentResult } from "./sentiment-analysis";

/**
 * Salvar análise de sentimento de uma mensagem
 */
export async function saveSentiment(data: InsertMessageSentiment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(messageSentiments).values(data);
}

/**
 * Obter sentimento de uma mensagem
 */
export async function getSentimentByMessageId(messageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(messageSentiments)
    .where(eq(messageSentiments.messageId, messageId))
    .limit(1);

  return result[0] || null;
}

/**
 * Obter sentimentos de uma conversa
 */
export async function getConversationSentiments(conversationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(messageSentiments)
    .where(eq(messageSentiments.conversationId, conversationId));
}

/**
 * Criar alerta de sentimento negativo
 */
export async function createNegativeAlert(data: InsertNegativeAlert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(negativeAlerts).values(data);
}

/**
 * Obter alertas pendentes
 */
export async function getPendingAlerts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(negativeAlerts)
    .where(eq(negativeAlerts.status, "pending"));
}

/**
 * Marcar alerta como revisado
 */
export async function markAlertAsReviewed(alertId: number, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(negativeAlerts)
    .set({ status: "reviewed", notes })
    .where(eq(negativeAlerts.id, alertId));
}

/**
 * Resolver alerta
 */
export async function resolveAlert(alertId: number, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(negativeAlerts)
    .set({ status: "resolved", notes, resolvedAt: new Date() })
    .where(eq(negativeAlerts.id, alertId));
}

/**
 * Obter ou criar resumo de sentimento do dia
 */
export async function getDaySentimentSummary(date: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(sentimentSummary)
    .where(eq(sentimentSummary.date, date))
    .limit(1);

  return existing[0] || null;
}

/**
 * Atualizar resumo de sentimento do dia
 */
export async function updateDaySentimentSummary(date: string, data: Partial<typeof sentimentSummary.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getDaySentimentSummary(date);

  if (existing) {
    await db
      .update(sentimentSummary)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sentimentSummary.date, date));
  } else {
    await db.insert(sentimentSummary).values({
      date,
      ...data,
    } as typeof sentimentSummary.$inferInsert);
  }
}

/**
 * Calcular resumo de sentimentos do dia
 */
export async function calculateDaySentimentSummary(date: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);

  // Contar mensagens por sentimento
  const sentimentCounts = await db
    .select({
      sentiment: messageSentiments.sentiment,
      count: sql<number>`COUNT(*)`,
    })
    .from(messageSentiments)
    .where(
      sql`${messageSentiments.createdAt} >= ${startDate} AND ${messageSentiments.createdAt} < ${endDate}`
    )
    .groupBy(messageSentiments.sentiment);

  const positive = sentimentCounts.find((s) => s.sentiment === "positive")?.count || 0;
  const neutral = sentimentCounts.find((s) => s.sentiment === "neutral")?.count || 0;
  const negative = sentimentCounts.find((s) => s.sentiment === "negative")?.count || 0;
  const total = positive + neutral + negative;

  // Calcular score médio
  const avgScoreResult = await db
    .select({ avg: sql<number>`AVG(${messageSentiments.score})` })
    .from(messageSentiments)
    .where(
      sql`${messageSentiments.createdAt} >= ${startDate} AND ${messageSentiments.createdAt} < ${endDate}`
    );

  const avgScore = avgScoreResult[0]?.avg || 0;

  // Calcular taxa de satisfação
  const satisfactionRate = total > 0 ? (positive / total) * 100 : 0;

  return {
    totalMessages: total,
    positiveCount: positive,
    neutralCount: neutral,
    negativeCount: negative,
    avgSentimentScore: avgScore,
    satisfactionRate,
  };
}

/**
 * Obter sentimentos dos últimos 7 dias
 */
export async function getLast7DaysSentiments() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return await db
    .select()
    .from(sentimentSummary)
    .where(gte(sentimentSummary.date, sevenDaysAgo.toISOString().split("T")[0]))
    .orderBy(sentimentSummary.date);
}

/**
 * Obter sentimentos do mês
 */
export async function getMonthSentiments(year: number, month: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEnd = new Date(year, month, 1);
  monthEnd.setDate(monthEnd.getDate() - 1);
  const monthEndStr = monthEnd.toISOString().split("T")[0];

  return await db
    .select()
    .from(sentimentSummary)
    .where(
      sql`${sentimentSummary.date} >= ${monthStart} AND ${sentimentSummary.date} <= ${monthEndStr}`
    )
    .orderBy(sentimentSummary.date);
}

/**
 * Obter distribuição de sentimentos
 */
export async function getSentimentDistribution(startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  const distribution = await db
    .select({
      sentiment: messageSentiments.sentiment,
      count: sql<number>`COUNT(*)`,
      avgConfidence: sql<number>`AVG(${messageSentiments.confidence})`,
    })
    .from(messageSentiments)
    .where(
      sql`${messageSentiments.createdAt} >= ${start} AND ${messageSentiments.createdAt} < ${end}`
    )
    .groupBy(messageSentiments.sentiment);

  return distribution;
}

/**
 * Obter mensagens que requerem revisão
 */
export async function getMessagesRequiringReview() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(messageSentiments)
    .where(eq(messageSentiments.requiresReview, 1));
}

/**
 * Obter sentimentos negativos recentes
 */
export async function getRecentNegativeSentiments(limit: number = 10) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(messageSentiments)
    .where(eq(messageSentiments.sentiment, "negative"))
    .orderBy(messageSentiments.createdAt)
    .limit(limit);
}
