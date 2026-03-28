import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.WHATSAPP_WEBHOOK_SECRET || 'your-webhook-secret-key';

/**
 * Gerar assinatura HMAC para validar webhooks
 */
export function generateWebhookSignature(payload: string): string {
  return crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
}

/**
 * Validar assinatura do webhook
 */
export function validateWebhookSignature(payload: string, signature: string): boolean {
  const expectedSignature = generateWebhookSignature(payload);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Middleware para validar webhooks
 */
export function webhookValidationMiddleware(req: any, res: any, next: any) {
  const signature = req.headers['x-hub-signature-256'];
  
  if (!signature) {
    console.error('[Webhook Security] Assinatura ausente');
    return res.status(401).json({ error: 'Assinatura ausente' });
  }

  // Obter o payload bruto
  let rawBody = '';
  req.on('data', (chunk: Buffer) => {
    rawBody += chunk.toString('utf8');
  });

  req.on('end', () => {
    try {
      // Extrair apenas o hash da assinatura
      const signatureHash = signature.replace('sha256=', '');
      
      if (!validateWebhookSignature(rawBody, signatureHash)) {
        console.error('[Webhook Security] Assinatura inválida');
        return res.status(401).json({ error: 'Assinatura inválida' });
      }

      // Adicionar payload ao request
      req.rawBody = rawBody;
      req.body = JSON.parse(rawBody);
      next();
    } catch (error) {
      console.error('[Webhook Security] Erro ao validar:', error);
      return res.status(400).json({ error: 'Erro ao processar webhook' });
    }
  });
}

/**
 * Gerar token de verificação para webhook
 */
export function generateVerifyToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validar token de verificação
 */
export function validateVerifyToken(token: string, expectedToken: string): boolean {
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
}
