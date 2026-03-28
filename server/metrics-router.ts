import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getDayStats,
  calculateDayStats,
  getLast7DaysStats,
  getMonthStats,
  getMetricsByUrgency,
  getEscalationRate,
} from "./metrics-db";

export const metricsRouter = router({
  /**
   * Obter estatísticas de um dia específico
   */
  getDayStats: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ input }) => {
      try {
        let stats = await getDayStats(input.date);

        if (!stats) {
          // Calcular se não existir
          const calculated = await calculateDayStats(input.date);
          stats = {
            id: 0,
            date: input.date,
            totalMessages: calculated.totalMessages,
            totalResponses: calculated.totalResponses,
            avgResponseTime: calculated.avgResponseTime.toString(),
            escalations: calculated.escalations,
            resolutions: calculated.resolutions,
            avgSatisfaction: calculated.avgSatisfaction.toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }

        return stats;
      } catch (error) {
        console.error("[Metrics] Erro ao obter estatísticas do dia:", error);
        return null;
      }
    }),

  /**
   * Obter estatísticas dos últimos 7 dias
   */
  getLast7Days: publicProcedure.query(async () => {
    try {
      return await getLast7DaysStats();
    } catch (error) {
      console.error("[Metrics] Erro ao obter últimos 7 dias:", error);
      return [];
    }
  }),

  /**
   * Obter estatísticas do mês
   */
  getMonth: publicProcedure
    .input(z.object({ year: z.number(), month: z.number() }))
    .query(async ({ input }) => {
      try {
        return await getMonthStats(input.year, input.month);
      } catch (error) {
        console.error("[Metrics] Erro ao obter estatísticas do mês:", error);
        return [];
      }
    }),

  /**
   * Obter métricas por urgência
   */
  getByUrgency: publicProcedure
    .input(z.object({ startDate: z.string(), endDate: z.string() }))
    .query(async ({ input }) => {
      try {
        return await getMetricsByUrgency(input.startDate, input.endDate);
      } catch (error) {
        console.error("[Metrics] Erro ao obter métricas por urgência:", error);
        return [];
      }
    }),

  /**
   * Obter taxa de escalação
   */
  getEscalationRate: publicProcedure
    .input(z.object({ startDate: z.string(), endDate: z.string() }))
    .query(async ({ input }) => {
      try {
        const rate = await getEscalationRate(input.startDate, input.endDate);
        return { rate: Math.round(rate * 100) / 100 };
      } catch (error) {
        console.error("[Metrics] Erro ao obter taxa de escalação:", error);
        return { rate: 0 };
      }
    }),

  /**
   * Obter dashboard resumido
   */
  getDashboard: publicProcedure.query(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      const todayStats = await getDayStats(today);
      const yesterdayStats = await getDayStats(yesterday);
      const last7Days = await getLast7DaysStats();

      // Calcular totais
      const totalMessages = last7Days.reduce((sum, day) => sum + (day.totalMessages || 0), 0);
      const totalResponses = last7Days.reduce((sum, day) => sum + (day.totalResponses || 0), 0);
      const avgResponseTime = last7Days.length > 0
        ? last7Days.reduce((sum, day) => sum + parseFloat(day.avgResponseTime?.toString() || '0'), 0) / last7Days.length
        : 0;
      const totalEscalations = last7Days.reduce((sum, day) => sum + (day.escalations || 0), 0);

      return {
        today: todayStats || { totalMessages: 0, totalResponses: 0, avgResponseTime: 0 },
        yesterday: yesterdayStats || { totalMessages: 0, totalResponses: 0, avgResponseTime: 0 },
        last7Days: {
          totalMessages,
          totalResponses,
          avgResponseTime: Math.round(avgResponseTime * 100) / 100,
          totalEscalations,
          avgSatisfaction: last7Days.length > 0 
            ? Math.round((last7Days.reduce((sum, day) => sum + parseFloat(day.avgSatisfaction?.toString() || '0'), 0) / last7Days.length) * 100) / 100
            : 0,
        },
      };
    } catch (error) {
      console.error("[Metrics] Erro ao obter dashboard:", error);
      return {
        today: { totalMessages: 0, totalResponses: 0, avgResponseTime: 0 },
        yesterday: { totalMessages: 0, totalResponses: 0, avgResponseTime: 0 },
        last7Days: { totalMessages: 0, totalResponses: 0, avgResponseTime: 0, totalEscalations: 0, avgSatisfaction: 0 },
      };
    }
  }),
});
