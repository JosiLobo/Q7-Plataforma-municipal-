import axios from 'axios';

const WHATSAPP_API_URL = 'https://graph.instagram.com/v18.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || 'YOUR_PHONE_NUMBER_ID';
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';

interface WhatsAppMessage {
  messaging_product: string;
  to: string;
  type: string;
  text?: { body: string };
  image?: { link: string };
  document?: { link: string };
}

/**
 * Enviar mensagem de texto via WhatsApp
 */
export async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  try {
    const payload: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: { body: message },
    };

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[WhatsApp API] Mensagem enviada:', response.data);
    return true;
  } catch (error) {
    console.error('[WhatsApp API] Erro ao enviar mensagem:', error);
    return false;
  }
}

/**
 * Enviar imagem via WhatsApp
 */
export async function sendWhatsAppImage(phoneNumber: string, imageUrl: string, caption?: string): Promise<boolean> {
  try {
    const payload: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'image',
      image: { link: imageUrl },
    };

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[WhatsApp API] Imagem enviada:', response.data);
    return true;
  } catch (error) {
    console.error('[WhatsApp API] Erro ao enviar imagem:', error);
    return false;
  }
}

/**
 * Enviar documento via WhatsApp
 */
export async function sendWhatsAppDocument(phoneNumber: string, documentUrl: string, filename?: string): Promise<boolean> {
  try {
    const payload: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'document',
      document: { link: documentUrl },
    };

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[WhatsApp API] Documento enviado:', response.data);
    return true;
  } catch (error) {
    console.error('[WhatsApp API] Erro ao enviar documento:', error);
    return false;
  }
}

/**
 * Marcar mensagem como lida
 */
export async function markMessageAsRead(messageId: string): Promise<boolean> {
  try {
    const payload = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    };

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[WhatsApp API] Mensagem marcada como lida:', response.data);
    return true;
  } catch (error) {
    console.error('[WhatsApp API] Erro ao marcar como lida:', error);
    return false;
  }
}

/**
 * Validar webhook do WhatsApp
 */
export function validateWebhookToken(token: string): boolean {
  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'q7gov_webhook_token';
  return token === expectedToken;
}

/**
 * Processar webhook recebido do WhatsApp
 */
export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
          image?: { mime_type: string; sha256: string; id: string };
          document?: { mime_type: string; sha256: string; id: string; filename: string };
        }>;
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

export function parseWhatsAppWebhook(payload: WhatsAppWebhookPayload) {
  const messages: any[] = [];
  const statuses: any[] = [];

  payload.entry?.forEach((entry) => {
    entry.changes?.forEach((change) => {
      if (change.value.messages) {
        change.value.messages.forEach((msg) => {
          const contact = change.value.contacts?.[0];
          messages.push({
            phoneNumber: msg.from,
            citizenName: contact?.profile.name,
            content: msg.text?.body || '[Mídia recebida]',
            messageId: msg.id,
            timestamp: new Date(parseInt(msg.timestamp) * 1000),
            type: msg.type,
          });
        });
      }

      if (change.value.statuses) {
        change.value.statuses.forEach((status) => {
          statuses.push({
            messageId: status.id,
            status: status.status,
            timestamp: new Date(parseInt(status.timestamp) * 1000),
          });
        });
      }
    });
  });

  return { messages, statuses };
}
