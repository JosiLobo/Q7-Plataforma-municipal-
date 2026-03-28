import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import NegativeSentimentAlert from '@/components/NegativeSentimentAlert';
import { trpc } from '@/lib/trpc';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Smile, Frown, Meh } from 'lucide-react';

export default function SentimentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Buscar dados de sentimento
  const { data: dashboard, isLoading } = trpc.sentiment.getDashboard.useQuery();
  const { data: alerts } = trpc.sentiment.getPendingAlerts.useQuery();

  if (isLoading) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 md:ml-64 pt-14">
          <Topbar title="Carregando..." subtitle="Aguarde..." />
          <div className="p-6 text-center">Carregando dados de sentimento...</div>
        </main>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex bg-background min-h-screen">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 md:ml-64 pt-14">
          <Topbar title="Sentimentos" subtitle="Nenhum dado disponível" />
          <div className="p-6 text-center">Nenhum dado de sentimento disponível</div>
        </main>
      </div>
    );
  }

  // Preparar dados para gráficos
  const satisfactionData = [
    { name: 'Satisfeitos', value: dashboard.today.positiveCount, color: '#22c55e' },
    { name: 'Neutros', value: dashboard.today.neutralCount, color: '#f59e0b' },
    { name: 'Insatisfeitos', value: dashboard.today.negativeCount, color: '#ef4444' },
  ];

  const trendData = dashboard.last7Days.map((d) => ({
    date: d.date,
    satisfacao: d.satisfactionRate,
    positivos: d.positiveCount,
    negativos: d.negativeCount,
  }));

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="flex-1 md:ml-64 pt-14">
        <Topbar
          title="Análise de Sentimentos"
          subtitle="Monitoramento de satisfação do cidadão"
        />

        <div className="p-6 max-w-7xl mx-auto">
          {/* KPIs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Taxa de Satisfação */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted uppercase">Taxa de Satisfação</span>
                <Smile className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {dashboard.today.satisfactionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted">
                {dashboard.today.positiveCount} mensagens positivas
              </p>
            </div>

            {/* Mensagens Positivas */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted uppercase">Positivas</span>
                <Smile className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-500 mb-2">
                {dashboard.today.positiveCount}
              </div>
              <p className="text-xs text-muted">
                {((dashboard.today.positiveCount / dashboard.today.totalMessages) * 100).toFixed(0)}% do total
              </p>
            </div>

            {/* Mensagens Neutras */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted uppercase">Neutras</span>
                <Meh className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-amber-500 mb-2">
                {dashboard.today.neutralCount}
              </div>
              <p className="text-xs text-muted">
                {((dashboard.today.neutralCount / dashboard.today.totalMessages) * 100).toFixed(0)}% do total
              </p>
            </div>

            {/* Mensagens Negativas */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted uppercase">Negativas</span>
                <Frown className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-red-500 mb-2">
                {dashboard.today.negativeCount}
              </div>
              <p className="text-xs text-muted">
                {alerts?.length || 0} alertas pendentes
              </p>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Distribuição de Sentimentos */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Distribuição — Hoje</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 text-xs">
                {satisfactionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-muted">{item.name}</span>
                    <span className="font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tendência de Satisfação */}
            <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Tendência — Últimos 7 Dias</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted)" />
                  <YAxis stroke="var(--muted)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="satisfacao"
                    stroke="#22c55e"
                    name="Taxa de Satisfação (%)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alertas de Sentimento Negativo */}
          {alerts && alerts.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-red-500" />
                <h3 className="text-sm font-bold text-foreground">Alertas de Insatisfação ({alerts.length})</h3>
              </div>
              <div className="space-y-3">
                {alerts.slice(0, 10).map((alert) => (
                  <NegativeSentimentAlert
                    key={alert.id}
                    alert={{
                      ...alert,
                      message: alert.message || 'Mensagem indisponível',
                      status: alert.status || 'pending',
                      notes: alert.notes || undefined,
                    }}
                    onResolved={() => {
                      // Recarregar dados
                      window.location.reload();
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Score Médio de Sentimento */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-bold text-foreground mb-4">Score Médio de Sentimento</h3>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                {dashboard.today.avgSentimentScore.toFixed(2)}
              </div>
              <p className="text-xs text-muted">
                Escala: -1 (muito negativo) a +1 (muito positivo)
              </p>
              <div className="mt-4 w-full bg-secondary rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    dashboard.today.avgSentimentScore > 0.3
                      ? 'bg-green-500'
                      : dashboard.today.avgSentimentScore < -0.3
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                  }`}
                  style={{
                    width: `${((dashboard.today.avgSentimentScore + 1) / 2) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
