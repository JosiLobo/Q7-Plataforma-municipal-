import { invokeLLM } from "./_core/llm";

export interface SentimentResult {
  sentiment: "positive" | "neutral" | "negative";
  confidence: number; // 0 a 1
  score: number; // -1 a 1
  emotions: Record<string, number>; // { joy: 0.8, sadness: 0.1, ... }
  keywords: string[];
  summary: string;
  requiresReview: boolean;
}

/**
 * Analisar sentimento de uma mensagem usando IA
 */
export async function analyzeSentiment(message: string, language: string = "pt-BR"): Promise<SentimentResult> {
  try {
    const prompt = `Analise o sentimento da seguinte mensagem em ${language}:

"${message}"

Responda em JSON com a seguinte estrutura:
{
  "sentiment": "positive" | "neutral" | "negative",
  "confidence": número entre 0 e 1,
  "score": número entre -1 (muito negativo) e 1 (muito positivo),
  "emotions": {
    "joy": número,
    "sadness": número,
    "anger": número,
    "fear": número,
    "surprise": número,
    "disgust": número
  },
  "keywords": ["palavra1", "palavra2", ...],
  "summary": "resumo breve da análise",
  "requiresReview": boolean
}

Certifique-se de que:
- confidence é um número entre 0 e 1
- score é um número entre -1 e 1
- emotions são números entre 0 e 1 que somam até 1
- keywords são palavras-chave que indicam o sentimento
- requiresReview é true se a mensagem é ambígua ou requer atenção especial`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em análise de sentimento e emoções. Analise mensagens e retorne análises estruturadas em JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sentiment_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              sentiment: {
                type: "string",
                enum: ["positive", "neutral", "negative"],
                description: "Sentimento geral da mensagem",
              },
              confidence: {
                type: "number",
                description: "Confiança da análise (0-1)",
              },
              score: {
                type: "number",
                description: "Score de sentimento (-1 a 1)",
              },
              emotions: {
                type: "object",
                properties: {
                  joy: { type: "number" },
                  sadness: { type: "number" },
                  anger: { type: "number" },
                  fear: { type: "number" },
                  surprise: { type: "number" },
                  disgust: { type: "number" },
                },
                required: ["joy", "sadness", "anger", "fear", "surprise", "disgust"],
              },
              keywords: {
                type: "array",
                items: { type: "string" },
                description: "Palavras-chave indicadoras de sentimento",
              },
              summary: {
                type: "string",
                description: "Resumo da análise",
              },
              requiresReview: {
                type: "boolean",
                description: "Se a mensagem requer revisão manual",
              },
            },
            required: ["sentiment", "confidence", "score", "emotions", "keywords", "summary", "requiresReview"],
            additionalProperties: false,
          },
        },
      },
    });

    // Extrair o conteúdo JSON da resposta
    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("Resposta vazia da IA");
    }

    const result = JSON.parse(content) as SentimentResult;

    // Validar resultado
    if (!result.sentiment || !result.confidence || result.score === undefined) {
      throw new Error("Resposta inválida da IA");
    }

    return result;
  } catch (error) {
    console.error("[Sentiment Analysis] Erro:", error);
    // Retornar análise padrão em caso de erro
    return {
      sentiment: "neutral",
      confidence: 0.5,
      score: 0,
      emotions: {
        joy: 0.2,
        sadness: 0.2,
        anger: 0.2,
        fear: 0.2,
        surprise: 0.1,
        disgust: 0.1,
      },
      keywords: [],
      summary: "Análise indisponível",
      requiresReview: true,
    };
  }
}

/**
 * Classificar sentimento em categoria simples
 */
export function classifySentiment(score: number): "positive" | "neutral" | "negative" {
  if (score >= 0.3) return "positive";
  if (score <= -0.3) return "negative";
  return "neutral";
}

/**
 * Calcular taxa de satisfação
 */
export function calculateSatisfactionRate(sentiments: Array<{ sentiment: string }>): number {
  if (sentiments.length === 0) return 0;

  const positive = sentiments.filter((s) => s.sentiment === "positive").length;
  return (positive / sentiments.length) * 100;
}

/**
 * Detectar se mensagem requer atenção urgente
 */
export function shouldAlert(sentiment: SentimentResult): boolean {
  return (
    sentiment.sentiment === "negative" &&
    sentiment.confidence > 0.7 &&
    (sentiment.emotions.anger > 0.3 || sentiment.emotions.sadness > 0.4)
  );
}

/**
 * Gerar resumo de emoções
 */
export function getTopEmotions(emotions: Record<string, number>, topN: number = 3): Record<string, number> {
  return Object.entries(emotions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, number>);
}

/**
 * Analisar múltiplas mensagens em lote
 */
export async function analyzeSentimentBatch(
  messages: string[],
  language: string = "pt-BR"
): Promise<SentimentResult[]> {
  const results = await Promise.all(messages.map((msg) => analyzeSentiment(msg, language)));
  return results;
}
