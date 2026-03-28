import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getPendingAlerts,
  markAlertAsReviewed,
  resolveAlert,
  getLast7DaysSentiments,
  getMonthSentiments,
  getSentimentDistribution,
  getRecentNegativeSentiments,
  getConversationSentiments,
  calculateDaySentimentSummary,
} from "./sentiment-db";

export const sentimentRouter = router({
  /**
   * Obter alertas de sentimento negativo pendentes
   */
  getPendingAlerts: protectedProcedure.query(async () => {
    const alerts = await getPendingAlerts();
    return alerts.map((alert) => ({
      ...alert,
      confidence: parseFloat(alert.confidence.toString()),
    }));
  }),

  /**
   * Marcar alerta como revisado
   */
  markAlertAsReviewed: protectedProcedure
    .input(
      z.object({
        alertId: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await markAlertAsReviewed(input.alertId, input.notes);
      return { success: true };
    }),

  /**
   * Resolver alerta
   */
  resolveAlert: protectedProcedure
    .input(
      z.object({
        alertId: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await resolveAlert(input.alertId, input.notes);
      return { success: true };
    }),

  /**
   * Obter sentimentos dos últimos 7 dias
   */
  getLast7Days: protectedProcedure.query(async () => {
    const sentiments = await getLast7DaysSentiments();
    return sentiments.map((s) => ({
      ...s,
      avgSentimentScore: parseFloat(s.avgSentimentScore?.toString() || "0"),
      satisfactionRate: parseFloat(s.satisfactionRate?.toString() || "0"),
      topEmotions: s.topEmotions ? JSON.parse(s.topEmotions) : {},
      topKeywords: s.topKeywords ? JSON.parse(s.topKeywords) : [],
    }));
  }),

  /**
   * Obter sentimentos do mês
   */
  getMonth: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        month: z.number().min(1).max(12),
      })
    )
    .query(async ({ input }) => {
      const sentiments = await getMonthSentiments(input.year, input.month);
      return sentiments.map((s) => ({
        ...s,
        avgSentimentScore: parseFloat(s.avgSentimentScore?.toString() || "0"),
        satisfactionRate: parseFloat(s.satisfactionRate?.toString() || "0"),
        topEmotions: s.topEmotions ? JSON.parse(s.topEmotions) : {},
        topKeywords: s.topKeywords ? JSON.parse(s.topKeywords) : [],
      }));
    }),

  /**
   * Obter distribuição de sentimentos
   */
  getDistribution: protectedProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ input }) => {
      const distribution = await getSentimentDistribution(input.startDate, input.endDate);
      return distribution.map((d) => ({
        ...d,
        avgConfidence: parseFloat(d.avgConfidence?.toString() || "0"),
      }));
    }),

  /**
   * Obter sentimentos negativos recentes
   */
  getRecentNegative: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const sentiments = await getRecentNegativeSentiments(input.limit);
      return sentiments.map((s) => ({
        ...s,
        confidence: parseFloat(s.confidence.toString()),
        score: parseFloat(s.score.toString()),
        emotions: s.emotions ? JSON.parse(s.emotions) : {},
        keywords: s.keywords ? JSON.parse(s.keywords) : [],
      }));
    }),

  /**
   * Obter sentimentos de uma conversa
   */
  getConversationSentiments: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const sentiments = await getConversationSentiments(input.conversationId);
      return sentiments.map((s) => ({
        ...s,
        confidence: parseFloat(s.confidence.toString()),
        score: parseFloat(s.score.toString()),
        emotions: s.emotions ? JSON.parse(s.emotions) : {},
        keywords: s.keywords ? JSON.parse(s.keywords) : [],
      }));
    }),

  /**
   * Obter resumo de sentimentos do dia
   */
  getDaySummary: protectedProcedure
    .input(
      z.object({
        date: z.string(),
      })
    )
    .query(async ({ input }) => {
      const summary = await calculateDaySentimentSummary(input.date);
      return {
        ...summary,
        avgSentimentScore: parseFloat(summary.avgSentimentScore.toString()),
        satisfactionRate: parseFloat(summary.satisfactionRate.toString()),
      };
    }),

  /**
   * Obter dashboard de sentimentos
   */
  getDashboard: protectedProcedure.query(async () => {
    const today = new Date().toISOString().split("T")[0];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [todaySummary, last7Days, pendingAlerts, recentNegative] = await Promise.all([
      calculateDaySentimentSummary(today),
      getLast7DaysSentiments(),
      getPendingAlerts(),
      getRecentNegativeSentiments(5),
    ]);

    return {
      today: {
        ...todaySummary,
        avgSentimentScore: parseFloat(todaySummary.avgSentimentScore.toString()),
        satisfactionRate: parseFloat(todaySummary.satisfactionRate.toString()),
      },
      last7Days: last7Days.map((s) => ({
        ...s,
        avgSentimentScore: parseFloat(s.avgSentimentScore?.toString() || "0"),
        satisfactionRate: parseFloat(s.satisfactionRate?.toString() || "0"),
        topEmotions: s.topEmotions ? JSON.parse(s.topEmotions) : {},
        topKeywords: s.topKeywords ? JSON.parse(s.topKeywords) : [],
      })),
      pendingAlerts: pendingAlerts.map((a) => ({
        ...a,
        confidence: parseFloat(a.confidence.toString()),
      })),
      recentNegative: recentNegative.map((s) => ({
        ...s,
        confidence: parseFloat(s.confidence.toString()),
        score: parseFloat(s.score.toString()),
        emotions: s.emotions ? JSON.parse(s.emotions) : {},
        keywords: s.keywords ? JSON.parse(s.keywords) : [],
      })),
    };
  }),
});
