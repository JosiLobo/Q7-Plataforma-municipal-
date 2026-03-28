import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import ExecutiveSummary from '@/components/ExecutiveSummary';
import PredictiveAlerts from '@/components/PredictiveAlerts';
import { useState } from 'react';

export default function AIInsights() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="flex-1 md:ml-64 pt-14">
        <Topbar
          title="Inteligência Artificial"
          subtitle="Resumo executivo e alertas preditivos"
        />

        <div className="p-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            <ExecutiveSummary />
            <PredictiveAlerts />
          </div>
        </div>
      </main>
    </div>
  );
}
