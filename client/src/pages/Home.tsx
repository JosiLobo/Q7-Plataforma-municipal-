import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import StatCard from '@/components/StatCard';
import AlertCard from '@/components/AlertCard';
import CommandPalette from '@/components/CommandPalette';
import MapView from '@/components/MapView';
import ExportButton from '@/components/ExportButton';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const protocolData = [
  { name: 'Seg', protocolos: 240, concluidos: 180 },
  { name: 'Ter', protocolos: 280, concluidos: 220 },
  { name: 'Qua', protocolos: 320, concluidos: 240 },
  { name: 'Qui', protocolos: 290, concluidos: 250 },
  { name: 'Sex', protocolos: 350, concluidos: 310 },
  { name: 'Sab', protocolos: 180, concluidos: 160 },
  { name: 'Dom', protocolos: 120, concluidos: 100 },
];

const canalData = [
  { name: 'WhatsApp', value: 42, color: '#1dc9a4' },
  { name: 'App', value: 28, color: '#3b82f6' },
  { name: 'Balcão', value: 18, color: '#f59e0b' },
  { name: 'Site', value: 9, color: '#8b5cf6' },
  { name: 'E-mail', value: 3, color: '#ec4899' },
];

const alertas = [
  {
    secretaria: 'Saúde',
    tipo: 'Estoque crítico',
    prazo: 'Hoje',
    status: 'Urgente',
  },
  {
    secretaria: 'Obras',
    tipo: 'Prazo vencido',
    prazo: 'Ontem',
    status: 'Vencido',
  },
  {
    secretaria: 'Licitação',
    tipo: 'Cotação pendente',
    prazo: '2 dias',
    status: 'Atenção',
  },
  {
    secretaria: 'Ouvidoria',
    tipo: 'Sem resposta',
    prazo: '3 dias',
    status: 'Atenção',
  },
];

const protocolosRecentes = [
  { id: 'PRO-5891', secretaria: 'Saúde', canal: 'App', status: 'Em andamento' },
  { id: 'PRO-5890', secretaria: 'Obras', canal: 'WhatsApp', status: 'Pendente' },
  { id: 'PRO-5889', secretaria: 'Educação', canal: 'Balcão', status: 'Concluído' },
  { id: 'PRO-5888', secretaria: 'Tributos', canal: 'Site', status: 'Em andamento' },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="flex-1 md:ml-64 pt-14">
        <Topbar
          title="Dashboard"
          subtitle="Visão geral da plataforma municipal"
        />
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

        <div className="p-6 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Protocolos Abertos"
              value="1.284"
              icon="📋"
              delta={{ value: 18, direction: 'up', period: 'ontem' }}
            />
            <StatCard
              label="Concluídos Hoje"
              value="143"
              icon="✅"
              delta={{ value: 18, direction: 'up', period: 'ontem' }}
              accent="green"
            />
            <StatCard
              label="Tempo Médio"
              value="2.4 dias"
              icon="⏳"
              delta={{ value: 0.8, direction: 'down', period: 'mês' }}
            />
            <StatCard
              label="Alertas Críticos"
              value="12"
              icon="⚠️"
              accent="red"
              delta={{ value: 3, direction: 'up', period: 'semana' }}
            />
          </div>

          {/* Alerts Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Alertas por Secretaria</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AlertCard
                type="critical"
                title="Saúde — Estoque crítico"
                message="Amoxicilina 500mg com apenas 12 unidades (mínimo: 50). Reposição urgente."
                action={{ label: 'Ir para Saúde', onClick: () => {} }}
              />
              <AlertCard
                type="critical"
                title="Obras — Prazo vencido"
                message="Obra #OBR-889 (Poda) vencida desde 24/03. Sem equipe atribuída."
                action={{ label: 'Atribuir equipe', onClick: () => {} }}
              />
              <AlertCard
                type="warning"
                title="Licitação — Cotação pendente"
                message="Licitação #LIC-123 aguardando cotação de 2 fornecedores. Prazo: 2 dias."
                action={{ label: 'Acompanhar', onClick: () => {} }}
              />
              <AlertCard
                type="warning"
                title="Ouvidoria — Sem resposta"
                message="Manifestação #OUV-201 (Reclamação) sem resposta há 3 dias. Prazo: 26/03."
                action={{ label: 'Responder', onClick: () => {} }}
              />
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Gestão de Obras</h2>
              <ExportButton data={alertas} filename="alertas-municipais" />
            </div>
            <MapView />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Protocol Trend */}
            <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Protocolos — Esta Semana</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={protocolData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted)" />
                  <YAxis stroke="var(--muted)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="protocolos" fill="#1dc9a4" name="Recebidos" />
                  <Bar dataKey="concluidos" fill="#22c55e" name="Concluídos" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Channels */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Canais de Entrada — Hoje</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={canalData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {canalData.map((entry, index) => (
                      <Cell key={'cell-' + index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 text-xs">
                {canalData.map((canal) => (
                  <div key={canal.name} className="flex items-center justify-between">
                    <span className="text-muted">{canal.name}</span>
                    <span className="font-semibold text-foreground">{canal.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alerts Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-sm font-bold text-foreground">Alertas Críticos</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="px-6 py-3 text-left font-semibold text-muted">Secretaria</th>
                      <th className="px-6 py-3 text-left font-semibold text-muted">Tipo</th>
                      <th className="px-6 py-3 text-left font-semibold text-muted">Prazo</th>
                      <th className="px-6 py-3 text-left font-semibold text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertas.map((alerta, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-secondary transition-colors">
                        <td className="px-6 py-3 text-foreground">{alerta.secretaria}</td>
                        <td className="px-6 py-3 text-foreground">{alerta.tipo}</td>
                        <td className="px-6 py-3 text-muted">{alerta.prazo}</td>
                        <td className="px-6 py-3">
                          <span
                            className={
                              alerta.status === 'Urgente'
                                ? 'inline-flex px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : alerta.status === 'Vencido'
                                ? 'inline-flex px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : 'inline-flex px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }
                          >
                            {alerta.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Protocols */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-sm font-bold text-foreground">Protocolos Recentes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="px-6 py-3 text-left font-semibold text-muted">Protocolo</th>
                      <th className="px-6 py-3 text-left font-semibold text-muted">Secretaria</th>
                      <th className="px-6 py-3 text-left font-semibold text-muted">Canal</th>
                      <th className="px-6 py-3 text-left font-semibold text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {protocolosRecentes.map((proto, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-secondary transition-colors">
                        <td className="px-6 py-3 font-mono text-primary font-semibold">#{proto.id}</td>
                        <td className="px-6 py-3 text-foreground">{proto.secretaria}</td>
                        <td className="px-6 py-3 text-muted">{proto.canal}</td>
                        <td className="px-6 py-3">
                          <span
                            className={
                              proto.status === 'Concluído'
                                ? 'inline-flex px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : proto.status === 'Pendente'
                                ? 'inline-flex px-2 py-1 rounded text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'inline-flex px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }
                          >
                            {proto.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
