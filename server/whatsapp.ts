import { eq } from "drizzle-orm";
import { whatsappConversations, whatsappMessages, aiResponses, InsertWhatsappMessage, InsertAiResponse } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Obter ou criar conversa com cidadão
 */
export async function getOrCreateConversation(phoneNumber: string, citizenName?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(whatsappConversations)
    .where(eq(whatsappConversations.phoneNumber, phoneNumber))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Criar nova conversa
  await db.insert(whatsappConversations).values({
    phoneNumber,
    citizenName,
    status: "active",
  });

  const created = await db
    .select()
    .from(whatsappConversations)
    .where(eq(whatsappConversations.phoneNumber, phoneNumber))
    .limit(1);

  return created[0];
}

/**
 * Salvar mensagem recebida
 */
export async function saveMessage(data: InsertWhatsappMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(whatsappMessages).values(data);

  const saved = await db
    .select()
    .from(whatsappMessages)
    .orderBy((t) => t.id)
    .limit(1);

  return saved[saved.length - 1];
}

/**
 * Salvar resposta de IA
 */
export async function saveAiResponse(data: InsertAiResponse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(aiResponses).values(data);

  const saved = await db
    .select()
    .from(aiResponses)
    .orderBy((t) => t.id)
    .limit(1);

  return saved[saved.length - 1];
}

/**
 * Obter histórico de conversa
 */
export async function getConversationHistory(conversationId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(whatsappMessages)
    .where(eq(whatsappMessages.conversationId, conversationId))
    .orderBy((t) => t.timestamp)
    .limit(limit);
}

/**
 * Atualizar status da conversa
 */
export async function updateConversationStatus(conversationId: number, status: "active" | "resolved" | "pending" | "escalated") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(whatsappConversations)
    .set({ status, updatedAt: new Date() })
    .where(eq(whatsappConversations.id, conversationId));
}

/**
 * Listar conversas ativas
 */
export async function getActiveConversations() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(whatsappConversations)
    .where(eq(whatsappConversations.status, "active"))
    .orderBy((t) => t.lastMessageAt);
}
