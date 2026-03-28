import { Sparkles, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface ExecutiveSummaryProps {
  onClose?: () => void;
}

export default function ExecutiveSummary({ onClose }: ExecutiveSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    setIsLoading(true);
    // Simula geração de resumo com IA
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Resumo Executivo — IA</h3>
        </div>
        <button
          onClick={generateSummary}
          disabled={isLoading}
          className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all"
        >
          {isLoading ? 'Gerando...' : 'Gerar Resumo'}
        </button>
      </div>

      <div className="space-y-4 text-sm text-foreground">
        <div className="flex gap-3">
          <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Situação Geral: Estável</p>
            <p className="text-muted mt-1">
              1.284 protocolos abertos com 143 concluídos hoje (↑18% vs ontem). Tempo médio de 2.4 dias (↓0.8 dias vs mês).
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Alertas Críticos: 12</p>
            <p className="text-muted mt-1">
              Saúde (estoque crítico), Obras (prazo vencido), Licitação (cotação pendente). Requerem ação imediata.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <TrendingUp size={18} className="text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Tendência: Positiva</p>
            <p className="text-muted mt-1">
              WhatsApp lidera canais (42%). Protocolos por secretaria distribuídos. Recomendação: manter ritmo.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-secondary rounded text-xs text-muted">
        <p>
          <strong>Próximas ações:</strong> Resolver alertas de Saúde e Obras. Acompanhar cotações de Licitação. Validar resposta de Ouvidoria.
        </p>
      </div>
    </div>
  );
}
