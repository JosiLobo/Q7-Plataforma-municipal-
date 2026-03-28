import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getOrCreateConversation,
  saveMessage,
  saveAiResponse,
  getConversationHistory,
  updateConversationStatus,
  getActiveConversations,
} from "./whatsapp";
import { triageMessage, generatePersonalizedResponse, detectUrgency } from "./whatsapp-ai";

export const whatsappRouter = router({
  /**
   * Webhook para receber mensagens do WhatsApp Business API
   * POST /api/trpc/whatsapp.webhook
   */
  webhook: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        message: z.string(),
        citizenName: z.string().optional(),
        messageId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 1. Obter ou criar conversa
        const conversation = await getOrCreateConversation(input.phoneNumber, input.citizenName);

        // 2. Salvar mensagem recebida
        await saveMessage({
          conversationId: conversation.id,
          sender: "citizen",
          content: input.message,
          messageType: "text",
          whatsappMessageId: input.messageId,
        });

        // 3. Triagem com IA
        const history = await getConversationHistory(conversation.id, 10);
        const historyText = history
          .map((m) => `${m.sender === "citizen" ? "Cidadão" : "Prefeitura"}: ${m.content}`)
          .slice(-5);

        const triage = await triageMessage(input.message, historyText);

        // 4. Detectar urgência
        const urgency = await detectUrgency(input.message);

        // 5. Gerar resposta personalizada
        const response = await generatePersonalizedResponse(
          input.citizenName || "Cidadão",
          input.message,
          triage.classification,
          historyText
        );

        // 6. Salvar resposta de IA
        const aiResponse = await saveAiResponse({
          messageId: 0, // Será preenchido pelo banco
          classification: triage.classification,
          confidence: triage.confidence,
          generatedResponse: response,
          sentResponse: triage.requiresHumanReview ? null : response,
          status: triage.requiresHumanReview ? "pending" : "sent",
        });

        // 7. Atualizar conversa
        if (triage.requiresHumanReview || urgency === "critical") {
          await updateConversationStatus(conversation.id, "escalated");
        }

        return {
          success: true,
          conversationId: conversation.id,
          response: triage.requiresHumanReview ? null : response,
          requiresReview: triage.requiresHumanReview,
          urgency,
          classification: triage.classification,
          department: triage.department,
        };
      } catch (error) {
        console.error("[WhatsApp Webhook] Erro:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        };
      }
    }),

  /**
   * Listar conversas ativas
   */
  listConversations: publicProcedure.query(async () => {
    try {
      return await getActiveConversations();
    } catch (error) {
      console.error("[WhatsApp] Erro ao listar conversas:", error);
      return [];
    }
  }),

  /**
   * Obter histórico de conversa
   */
  getHistory: publicProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await getConversationHistory(input.conversationId, 100);
      } catch (error) {
        console.error("[WhatsApp] Erro ao obter histórico:", error);
        return [];
      }
    }),

  /**
   * Marcar conversa como resolvida
   */
  resolveConversation: publicProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await updateConversationStatus(input.conversationId, "resolved");
        return { success: true };
      } catch (error) {
        console.error("[WhatsApp] Erro ao resolver conversa:", error);
        return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
      }
    }),

  /**
   * Escalar conversa para agente humano
   */
  escalateConversation: publicProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await updateConversationStatus(input.conversationId, "escalated");
        return { success: true };
      } catch (error) {
        console.error("[WhatsApp] Erro ao escalar conversa:", error);
        return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
      }
    }),
});
