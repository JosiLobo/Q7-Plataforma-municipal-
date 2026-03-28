import { Brain, TrendingDown, Calendar, Zap } from 'lucide-react';

interface PredictiveAlert {
  id: string;
  title: string;
  description: string;
  probability: number;
  daysUntil: number;
  icon: React.ReactNode;
  action: string;
}

const PREDICTIVE_ALERTS: PredictiveAlert[] = [
  {
    id: '1',
    title: 'Pico de Demanda Previsto',
    description: 'Análise histórica indica aumento de 20% em protocolos na próxima semana (período de chuvas).',
    probability: 85,
    daysUntil: 3,
    icon: <TrendingDown size={20} className="text-amber-600" />,
    action: 'Aumentar equipe',
  },
  {
    id: '2',
    title: 'Risco de Vencimento',
    description: '4 protocolos de Obras vencem em 2 dias. Sem progresso nos últimos 5 dias.',
    probability: 92,
    daysUntil: 2,
    icon: <Calendar size={20} className="text-red-600" />,
    action: 'Atribuir equipe',
  },
  {
    id: '3',
    title: 'Gargalo em Licitação',
    description: 'Padrão detectado: cotações levam 4+ dias. Recomendação: iniciar 1 semana antes.',
    probability: 78,
    daysUntil: 7,
    icon: <Zap size={20} className="text-blue-600" />,
    action: 'Otimizar processo',
  },
];

export default function PredictiveAlerts() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={20} className="text-primary" />
        <h3 className="text-sm font-bold text-foreground">Alertas Preditivos — IA</h3>
      </div>

      <div className="space-y-3">
        {PREDICTIVE_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">{alert.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-sm text-foreground">{alert.title}</p>
                  <span className="inline-flex px-2 py-1 bg-primary/10 text-primary rounded text-xs font-bold flex-shrink-0">
                    {alert.probability}%
                  </span>
                </div>
                <p className="text-xs text-muted mb-2">{alert.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Em {alert.daysUntil} dias</span>
                  <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                    {alert.action} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-secondary rounded text-xs text-muted">
        <p>
          <strong>Como funciona:</strong> Análise de padrões históricos + machine learning para prever gargalos e oportunidades.
        </p>
      </div>
    </div>
  );
}
