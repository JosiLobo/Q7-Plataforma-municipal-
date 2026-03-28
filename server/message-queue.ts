import Queue from 'bull';
import { triageMessage, generatePersonalizedResponse, detectUrgency } from './whatsapp-ai';
import { sendWhatsAppMessage, markMessageAsRead } from './whatsapp-api';
import { getOrCreateConversation, saveMessage, saveAiResponse, updateConversationStatus } from './whatsapp';
import { analyzeSentiment, shouldAlert } from './sentiment-analysis';
import { saveSentiment, createNegativeAlert, updateDaySentimentSummary, calculateDaySentimentSummary } from './sentiment-db';
import { emitNotification } from './websocket-server';

// Configurar Redis
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Criar filas
export const messageQueue = new Queue('whatsapp-messages', redisUrl);
export const responseQueue = new Queue('whatsapp-responses', redisUrl);
export const metricsQueue = new Queue('whatsapp-metrics', redisUrl);

/**
 * Processar mensagens recebidas
 */
messageQueue.process(async (job) => {
  try {
    const { phoneNumber, content, citizenName, messageId } = job.data;

    console.log(`[Message Queue] Processando mensagem de ${phoneNumber}: ${content}`);

    // 1. Obter ou criar conversa
    const conversation = await getOrCreateConversation(phoneNumber, citizenName);

    // 2. Salvar mensagem
    const savedMessage = await saveMessage({
      conversationId: conversation.id,
      sender: 'citizen',
      content,
      messageType: 'text',
      whatsappMessageId: messageId,
    });

    // 3. Triagem com IA
    const urgency = await detectUrgency(content);
    const triage = await triageMessage(content);

    // 3.5. Análise de Sentimento
    const sentiment = await analyzeSentiment(content);
    await saveSentiment({
      messageId: savedMessage.id,
      conversationId: conversation.id,
      sentiment: sentiment.sentiment,
      confidence: sentiment.confidence.toString(),
      score: sentiment.score.toString(),
      emotions: JSON.stringify(sentiment.emotions),
      keywords: JSON.stringify(sentiment.keywords),
      summary: sentiment.summary,
      requiresReview: sentiment.requiresReview ? 1 : 0,
    });

    // Criar alerta se sentimento negativo com alta confiança
    if (shouldAlert(sentiment)) {
      await createNegativeAlert({
        messageId: savedMessage.id,
        conversationId: conversation.id,
        sentiment: 'negative',
        confidence: sentiment.confidence.toString(),
        message: content,
        status: 'pending',
      });

      // Emitir notificação
      emitNotification(
        '⚠️ Sentimento Negativo Detectado',
        `Mensagem de ${citizenName} com sentimento negativo (confiança: ${(sentiment.confidence * 100).toFixed(0)}%)`,
        'warning'
      );
    }

    // 4. Gerar resposta
    const response = await generatePersonalizedResponse(
      citizenName || 'Cidadão',
      content,
      triage.classification
    );

    // 5. Salvar resposta de IA
    await saveAiResponse({
      messageId: savedMessage.id,
      classification: triage.classification,
      confidence: triage.confidence,
      generatedResponse: response,
      sentResponse: triage.requiresHumanReview ? null : response,
      status: triage.requiresHumanReview ? 'pending' : 'sent',
    });

    // 6. Atualizar status da conversa
    if (triage.requiresHumanReview || urgency === 'critical') {
      await updateConversationStatus(conversation.id, 'escalated');
    }

    // 7. Adicionar à fila de respostas
    if (!triage.requiresHumanReview) {
      await responseQueue.add({
        phoneNumber,
        message: response,
        conversationId: conversation.id,
        urgency,
      });
    }

    // 8. Registrar métrica
    await metricsQueue.add({
      conversationId: conversation.id,
      type: 'message_received',
      urgency,
      requiresReview: triage.requiresHumanReview,
    });

    return { success: true, conversationId: conversation.id };
  } catch (error) {
    console.error('[Message Queue] Erro:', error);
    throw error;
  }
});

/**
 * Processar envio de respostas
 */
responseQueue.process(async (job) => {
  try {
    const { phoneNumber, message, conversationId, urgency } = job.data;

    console.log(`[Response Queue] Enviando resposta para ${phoneNumber}`);

    // Enviar via WhatsApp
    const sent = await sendWhatsAppMessage(phoneNumber, message);

    if (sent) {
      console.log(`[Response Queue] Resposta enviada com sucesso para ${phoneNumber}`);
    } else {
      console.error(`[Response Queue] Falha ao enviar resposta para ${phoneNumber}`);
      throw new Error('Falha ao enviar mensagem via WhatsApp');
    }

    // Registrar métrica
    await metricsQueue.add({
      conversationId,
      type: 'response_sent',
      urgency,
    });

    return { success: true };
  } catch (error) {
    console.error('[Response Queue] Erro:', error);
    throw error;
  }
});

/**
 * Processar métricas
 */
metricsQueue.process(async (job) => {
  try {
    const { conversationId, type, urgency, requiresReview } = job.data;

    console.log(`[Metrics Queue] Registrando métrica: ${type} para conversa ${conversationId}`);

    // Aqui você pode salvar métricas em um banco de dados separado
    // ou enviar para um serviço de analytics
    const metric = {
      conversationId,
      type,
      urgency,
      requiresReview,
      timestamp: new Date(),
    };

    console.log('[Metrics Queue] Métrica registrada:', metric);

    return { success: true };
  } catch (error) {
    console.error('[Metrics Queue] Erro:', error);
    throw error;
  }
});

/**
 * Event listeners
 */
messageQueue.on('completed', (job) => {
  console.log(`[Message Queue] Job ${job.id} concluído`);
});

messageQueue.on('failed', (job, err) => {
  console.error(`[Message Queue] Job ${job.id} falhou:`, err.message);
});

responseQueue.on('completed', (job) => {
  console.log(`[Response Queue] Job ${job.id} concluído`);
});

responseQueue.on('failed', (job, err) => {
  console.error(`[Response Queue] Job ${job.id} falhou:`, err.message);
});

metricsQueue.on('completed', (job) => {
  console.log(`[Metrics Queue] Job ${job.id} concluído`);
});

metricsQueue.on('failed', (job, err) => {
  console.error(`[Metrics Queue] Job ${job.id} falhou:`, err.message);
});

/**
 * Adicionar mensagem à fila
 */
export async function queueMessage(phoneNumber: string, content: string, citizenName?: string, messageId?: string) {
  return await messageQueue.add({
    phoneNumber,
    content,
    citizenName,
    messageId,
  });
}

/**
 * Obter estatísticas das filas
 */
export async function getQueueStats() {
  const messageStats = await messageQueue.getJobCounts();
  const responseStats = await responseQueue.getJobCounts();
  const metricsStats = await metricsQueue.getJobCounts();

  return {
    messages: messageStats,
    responses: responseStats,
    metrics: metricsStats,
  };
}

/**
 * Limpar filas (use com cuidado!)
 */
export async function clearQueues() {
  await messageQueue.empty();
  await responseQueue.empty();
  await metricsQueue.empty();
}
