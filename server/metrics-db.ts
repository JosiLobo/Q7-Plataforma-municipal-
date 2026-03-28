import { eq, gte, lte, sql } from "drizzle-orm";
import { whatsappMetrics, dailyStats, InsertWhatsappMetric, InsertDailyStat } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Registrar métrica
 */
export async function recordMetric(data: InsertWhatsappMetric) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(whatsappMetrics).values(data);
}

/**
 * Obter métricas de uma conversa
 */
export async function getConversationMetrics(conversationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(whatsappMetrics)
    .where(eq(whatsappMetrics.conversationId, conversationId));
}

/**
 * Obter estatísticas do dia
 */
export async function getDayStats(date: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(dailyStats)
    .where(eq(dailyStats.date, date))
    .limit(1);

  return existing[0] || null;
}

/**
 * Atualizar ou criar estatísticas do dia
 */
export async function upsertDayStats(date: string, data: Partial<InsertDailyStat>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getDayStats(date);

  if (existing) {
    await db
      .update(dailyStats)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(dailyStats.date, date));
  } else {
    await db.insert(dailyStats).values({
      date,
      ...data,
    } as InsertDailyStat);
  }
}

/**
 * Calcular estatísticas do dia (agregação)
 */
export async function calculateDayStats(date: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);

  // Contar mensagens recebidas
  const messageCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(whatsappMetrics)
    .where(
      sql`${whatsappMetrics.metricType} = 'message_received' 
      AND ${whatsappMetrics.timestamp} >= ${startDate} 
      AND ${whatsappMetrics.timestamp} < ${endDate}`
    );

  // Contar respostas enviadas
  const responseCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(whatsappMetrics)
    .where(
      sql`${whatsappMetrics.metricType} = 'response_sent' 
      AND ${whatsappMetrics.timestamp} >= ${startDate} 
      AND ${whatsappMetrics.timestamp} < ${endDate}`
    );

  // Calcular tempo médio de resposta
  const avgResponseTime = await db
    .select({ avg: sql<number>`AVG(${whatsappMetrics.responseTime})` })
    .from(whatsappMetrics)
    .where(
      sql`${whatsappMetrics.metricType} = 'response_time' 
      AND ${whatsappMetrics.timestamp} >= ${startDate} 
      AND ${whatsappMetrics.timestamp} < ${endDate}`
    );

  // Contar escalações
  const escalationCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(whatsappMetrics)
    .where(
      sql`${whatsappMetrics.metricType} = 'escalation' 
      AND ${whatsappMetrics.timestamp} >= ${startDate} 
      AND ${whatsappMetrics.timestamp} < ${endDate}`
    );

  // Contar resoluções
  const resolutionCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(whatsappMetrics)
    .where(
      sql`${whatsappMetrics.metricType} = 'resolution' 
      AND ${whatsappMetrics.timestamp} >= ${startDate} 
      AND ${whatsappMetrics.timestamp} < ${endDate}`
    );

  // Calcular satisfação média
  const avgSatisfaction = await db
    .select({ avg: sql<number>`AVG(${whatsappMetrics.satisfaction})` })
    .from(whatsappMetrics)
    .where(
      sql`${whatsappMetrics.satisfaction} IS NOT NULL 
      AND ${whatsappMetrics.timestamp} >= ${startDate} 
      AND ${whatsappMetrics.timestamp} < ${endDate}`
    );

  return {
    totalMessages: messageCount[0]?.count || 0,
    totalResponses: responseCount[0]?.count || 0,
    avgResponseTime: avgResponseTime[0]?.avg || 0,
    escalations: escalationCount[0]?.count || 0,
    resolutions: resolutionCount[0]?.count || 0,
    avgSatisfaction: avgSatisfaction[0]?.avg || 0,
  };
}

/**
 * Obter estatísticas dos últimos 7 dias
 */
export async function getLast7DaysStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return await db
    .select()
    .from(dailyStats)
    .where(gte(dailyStats.date, sevenDaysAgo.toISOString().split('T')[0]))
    .orderBy(dailyStats.date);
}

/**
 * Obter estatísticas do mês
 */
export async function getMonthStats(year: number, month: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
  const monthEnd = new Date(year, month, 1);
  monthEnd.setDate(monthEnd.getDate() - 1);
  const monthEndStr = monthEnd.toISOString().split('T')[0];

  return await db
    .select()
    .from(dailyStats)
    .where(
      sql`${dailyStats.date} >= ${monthStart} AND ${dailyStats.date} <= ${monthEndStr}`
    )
    .orderBy(dailyStats.date);
}

/**
 * Obter métricas por urgência
 */
export async function getMetricsByUrgency(startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  const metrics = await db
    .select({
      urgency: whatsappMetrics.urgency,
      count: sql<number>`COUNT(*)`,
    })
    .from(whatsappMetrics)
    .where(
      sql`${whatsappMetrics.timestamp} >= ${start} 
      AND ${whatsappMetrics.timestamp} < ${end}`
    )
    .groupBy(whatsappMetrics.urgency);

  return metrics;
}

/**
 * Obter taxa de escalação
 */
export async function getEscalationRate(startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  const total = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(whatsappMetrics)
    .where(
      sql`${whatsappMetrics.metricType} IN ('message_received', 'response_sent') 
      AND ${whatsappMetrics.timestamp} >= ${start} 
      AND ${whatsappMetrics.timestamp} < ${end}`
    );

  const escalations = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(whatsappMetrics)
    .where(
      sql`${whatsappMetrics.metricType} = 'escalation' 
      AND ${whatsappMetrics.timestamp} >= ${start} 
      AND ${whatsappMetrics.timestamp} < ${end}`
    );

  const totalCount = total[0]?.count || 1;
  const escalationCount = escalations[0]?.count || 0;

  return (escalationCount / totalCount) * 100;
}
