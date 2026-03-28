import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MessageSquare, Clock, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import ReportExporter from '@/components/ReportExporter';

export default function MetricsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch dashboard metrics
  const { data: dashboardData } = trpc.metrics.getDashboard.useQuery();
  const { data: last7Days } = trpc.metrics.getLast7Days.useQuery();

  const kpis = [
    {
      label: 'Mensagens Hoje',
      value: dashboardData?.today?.totalMessages || 0,
      icon: MessageSquare,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      trend: dashboardData && dashboardData.yesterday?.totalMessages 
        ? Math.round(((dashboardData.today?.totalMessages || 0) / (dashboardData.yesterday?.totalMessages || 1) - 1) * 100)
        : 0,
    },
    {
      label: 'Respostas Enviadas',
      value: dashboardData?.today?.totalResponses || 0,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      trend: dashboardData && dashboardData.yesterday?.totalResponses
        ? Math.round(((dashboardData.today?.totalResponses || 0) / (dashboardData.yesterday?.totalResponses || 1) - 1) * 100)
        : 0,
    },
    {
      label: 'Tempo Médio',
      value: `${Math.round(parseFloat(dashboardData?.today?.avgResponseTime?.toString() || '0'))}s`,
      icon: Clock,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      trend: dashboardData && dashboardData.yesterday?.avgResponseTime
        ? Math.round(((parseFloat(dashboardData.today?.avgResponseTime?.toString() || '0')) / (parseFloat(dashboardData.yesterday?.avgResponseTime?.toString() || '1')) - 1) * 100)
        : 0,
    },
    {
      label: 'Escalações',
      value: dashboardData?.last7Days?.totalEscalations || 0,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      trend: 0,
    },
  ];

  // Dados para gráfico de linha (últimos 7 dias)
  const chartData = (last7Days || []).map((day: any) => ({
    date: day.date,
    mensagens: day.totalMessages || 0,
    respostas: day.totalResponses || 0,
    satisfacao: parseFloat(day.avgSatisfaction?.toString() || '0'),
  }));

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="flex-1 md:ml-64 pt-14">
        <Topbar
          title="Métricas — Dashboard"
          subtitle="Análise de atendimento WhatsApp"
        />

        <div className="p-6 max-w-7xl mx-auto">
          {/* Export Section */}
          <div className="mb-8 flex justify-end">
            <ReportExporter />
          </div>

          {/* KPIs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${kpi.color}`}>
                      <Icon size={24} />
                    </div>
                    {kpi.trend !== 0 && (
                      <span className={`text-sm font-semibold ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted mb-1">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Mensagens e Respostas */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Mensagens vs Respostas (7 dias)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
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
                  <Line type="monotone" dataKey="mensagens" stroke="#3b82f6" name="Mensagens" />
                  <Line type="monotone" dataKey="respostas" stroke="#22c55e" name="Respostas" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Satisfação */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Satisfação do Cliente (7 dias)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
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
                  <Bar dataKey="satisfacao" fill="#8b5cf6" name="Satisfação (0-5)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Total de Mensagens */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="text-blue-500" size={24} />
                <h3 className="text-sm font-bold text-foreground">Total (7 dias)</h3>
              </div>
              <p className="text-3xl font-bold text-foreground mb-2">{dashboardData?.last7Days?.totalMessages || 0}</p>
              <p className="text-sm text-muted">mensagens recebidas</p>
            </div>

            {/* Taxa de Resposta */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-green-500" size={24} />
                <h3 className="text-sm font-bold text-foreground">Taxa de Resposta</h3>
              </div>
              <p className="text-3xl font-bold text-foreground mb-2">
                {dashboardData?.last7Days?.totalMessages 
                  ? Math.round((dashboardData.last7Days.totalResponses / dashboardData.last7Days.totalMessages) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-muted">respostas automáticas</p>
            </div>

            {/* Satisfação Média */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-yellow-500" size={24} />
                <h3 className="text-sm font-bold text-foreground">Satisfação Média</h3>
              </div>
              <p className="text-3xl font-bold text-foreground mb-2">
                {dashboardData?.last7Days?.avgSatisfaction?.toFixed(1) || '0.0'}/5
              </p>
              <p className="text-sm text-muted">avaliação dos cidadãos</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
