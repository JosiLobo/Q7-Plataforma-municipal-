import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { generatePDFReport, generateExcelReport, generateCompleteReport } from "./reports";
import { getLast7DaysStats, getMonthStats, calculateDayStats } from "./metrics-db";

export const reportsRouter = router({
  /**
   * Gerar relatório em PDF
   */
  generatePDF: publicProcedure
    .input(z.object({ startDate: z.string(), endDate: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const last7Days = await getLast7DaysStats();
        
        const metrics = {
          totalMessages: last7Days.reduce((sum, day) => sum + (day.totalMessages || 0), 0),
          totalResponses: last7Days.reduce((sum, day) => sum + (day.totalResponses || 0), 0),
          avgResponseTime: last7Days.length > 0
            ? last7Days.reduce((sum, day) => sum + parseFloat(day.avgResponseTime?.toString() || '0'), 0) / last7Days.length
            : 0,
          escalations: last7Days.reduce((sum, day) => sum + (day.escalations || 0), 0),
          avgSatisfaction: last7Days.length > 0
            ? last7Days.reduce((sum, day) => sum + parseFloat(day.avgSatisfaction?.toString() || '0'), 0) / last7Days.length
            : 0,
          dailyStats: last7Days,
        };

        const pdf = await generatePDFReport(input.startDate, input.endDate, metrics);
        
        return {
          success: true,
          data: pdf.toString('base64'),
          filename: `relatorio-${input.startDate}-${input.endDate}.pdf`,
        };
      } catch (error) {
        console.error("[Reports] Erro ao gerar PDF:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        };
      }
    }),

  /**
   * Gerar relatório em Excel
   */
  generateExcel: publicProcedure
    .input(z.object({ startDate: z.string(), endDate: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const last7Days = await getLast7DaysStats();
        
        const metrics = {
          totalMessages: last7Days.reduce((sum, day) => sum + (day.totalMessages || 0), 0),
          totalResponses: last7Days.reduce((sum, day) => sum + (day.totalResponses || 0), 0),
          avgResponseTime: last7Days.length > 0
            ? last7Days.reduce((sum, day) => sum + parseFloat(day.avgResponseTime?.toString() || '0'), 0) / last7Days.length
            : 0,
          escalations: last7Days.reduce((sum, day) => sum + (day.escalations || 0), 0),
          avgSatisfaction: last7Days.length > 0
            ? last7Days.reduce((sum, day) => sum + parseFloat(day.avgSatisfaction?.toString() || '0'), 0) / last7Days.length
            : 0,
          dailyStats: last7Days,
        };

        const excel = await generateExcelReport(input.startDate, input.endDate, metrics);
        
        return {
          success: true,
          data: excel.toString('base64'),
          filename: `relatorio-${input.startDate}-${input.endDate}.xlsx`,
        };
      } catch (error) {
        console.error("[Reports] Erro ao gerar Excel:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        };
      }
    }),

  /**
   * Gerar relatório completo (PDF + Excel)
   */
  generateComplete: publicProcedure
    .input(z.object({ startDate: z.string(), endDate: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const last7Days = await getLast7DaysStats();
        
        const metrics = {
          totalMessages: last7Days.reduce((sum, day) => sum + (day.totalMessages || 0), 0),
          totalResponses: last7Days.reduce((sum, day) => sum + (day.totalResponses || 0), 0),
          avgResponseTime: last7Days.length > 0
            ? last7Days.reduce((sum, day) => sum + parseFloat(day.avgResponseTime?.toString() || '0'), 0) / last7Days.length
            : 0,
          escalations: last7Days.reduce((sum, day) => sum + (day.escalations || 0), 0),
          avgSatisfaction: last7Days.length > 0
            ? last7Days.reduce((sum, day) => sum + parseFloat(day.avgSatisfaction?.toString() || '0'), 0) / last7Days.length
            : 0,
          dailyStats: last7Days,
        };

        const { pdf, excel } = await generateCompleteReport(input.startDate, input.endDate, metrics);
        
        return {
          success: true,
          pdf: pdf.toString('base64'),
          excel: excel.toString('base64'),
          pdfFilename: `relatorio-${input.startDate}-${input.endDate}.pdf`,
          excelFilename: `relatorio-${input.startDate}-${input.endDate}.xlsx`,
        };
      } catch (error) {
        console.error("[Reports] Erro ao gerar relatório completo:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        };
      }
    }),
});
