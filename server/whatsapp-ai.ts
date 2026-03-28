import { invokeLLM } from "./_core/llm";

interface TriageResult {
  classification: string;
  department: string;
  confidence: number;
  suggestedResponse: string;
  requiresHumanReview: boolean;
}

/**
 * Classificar mensagem e gerar resposta automática
 */
export async function triageMessage(content: string, conversationHistory: string[] = []): Promise<TriageResult> {
  const systemPrompt = `Você é um assistente de triagem de mensagens para a prefeitura municipal.
  
Sua tarefa é:
1. Classificar a mensagem em uma das seguintes categorias:
   - Saúde (agendamentos, receitas, dúvidas médicas)
   - Obras (ruas, iluminação, poda, infraestrutura)
   - Educação (matrículas, bolsas, escolas)
   - Ouvidoria (reclamações, sugestões)
   - Tributos (IPTU, ISS, taxas)
   - Assistência Social (benefícios, programas)
   - Outros

2. Gerar uma resposta automática educada e útil
3. Indicar se precisa de revisão humana

Responda em JSON com este formato:
{
  "classification": "Saúde",
  "department": "Secretaria de Saúde",
  "confidence": 95,
  "suggestedResponse": "Obrigado pelo contato! Sua solicitação foi recebida e será processada em breve.",
  "requiresHumanReview": false
}`;

  const userMessage = `Classifique e responda esta mensagem do cidadão:

${content}

${conversationHistory.length > 0 ? `Contexto anterior:\n${conversationHistory.join("\n")}` : ""}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "triage_result",
          strict: true,
          schema: {
            type: "object",
            properties: {
              classification: { type: "string", description: "Categoria da mensagem" },
              department: { type: "string", description: "Secretaria responsável" },
              confidence: { type: "number", description: "Confiança da classificação (0-100)" },
              suggestedResponse: { type: "string", description: "Resposta automática sugerida" },
              requiresHumanReview: { type: "boolean", description: "Requer revisão humana?" },
            },
            required: ["classification", "department", "confidence", "suggestedResponse", "requiresHumanReview"],
            additionalProperties: false,
          },
        },
      },
    });

    const messageContent = response.choices[0]?.message.content;
    if (!messageContent) throw new Error("Empty response from LLM");
    
    const content_text = typeof messageContent === 'string' ? messageContent : JSON.stringify(messageContent);
    const result = JSON.parse(content_text) as TriageResult;
    return result;
  } catch (error) {
    console.error("[WhatsApp AI] Triagem falhou:", error);
    // Fallback response
    return {
      classification: "Outros",
      department: "Ouvidoria",
      confidence: 0,
      suggestedResponse: "Obrigado pelo contato! Sua mensagem foi recebida e será analisada por nossa equipe.",
      requiresHumanReview: true,
    };
  }
}

/**
 * Gerar resposta personalizada para conversa
 */
export async function generatePersonalizedResponse(
  citizenName: string,
  messageContent: string,
  classification: string,
  conversationHistory: string[] = []
): Promise<string> {
  const systemPrompt = `Você é um agente de atendimento amigável e profissional da prefeitura municipal.
  
Responda de forma:
- Educada e empática
- Concisa (máximo 3 linhas)
- Útil e prática
- Em português brasileiro
- Personalizando com o nome do cidadão quando apropriado

Evite:
- Jargão técnico
- Promessas que não pode cumprir
- Informações genéricas demais`;

  const userMessage = `Cidadão: ${citizenName}
Categoria: ${classification}
Mensagem: ${messageContent}

${conversationHistory.length > 0 ? `Contexto:\n${conversationHistory.join("\n")}` : ""}

Gere uma resposta personalizada e útil.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const messageContent = response.choices[0]?.message.content;
    if (typeof messageContent === 'string') return messageContent;
    return "Obrigado pelo contato!";
  } catch (error) {
    console.error("[WhatsApp AI] Geração de resposta falhou:", error);
    return "Obrigado pelo contato! Sua mensagem foi recebida e será analisada.";
  }
}

/**
 * Detectar urgência da mensagem
 */
export async function detectUrgency(content: string): Promise<"low" | "medium" | "high" | "critical"> {
  const urgencyKeywords = {
    critical: ["emergência", "urgente", "hospital", "acidente", "morte", "grave"],
    high: ["risco", "perigo", "problema", "falha", "não funciona", "quebrado"],
    medium: ["dúvida", "informação", "protocolo", "agendamento"],
    low: ["sugestão", "elogio", "informação geral"],
  };

  const lowerContent = content.toLowerCase();

  for (const keyword of urgencyKeywords.critical) {
    if (lowerContent.includes(keyword)) return "critical";
  }

  for (const keyword of urgencyKeywords.high) {
    if (lowerContent.includes(keyword)) return "high";
  }

  for (const keyword of urgencyKeywords.medium) {
    if (lowerContent.includes(keyword)) return "medium";
  }

  return "low";
}
