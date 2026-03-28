import { useEffect, useRef } from 'react';

interface MapViewProps {
  title?: string;
  height?: string;
}

interface WorkItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'em-andamento' | 'pendente' | 'vencido' | 'agendado';
  icon: string;
}

const OBRAS: WorkItem[] = [
  { id: '1', name: 'Tapa-buraco Rua Central', lat: -20.3, lng: -40.3, status: 'em-andamento', icon: '🕳️' },
  { id: '2', name: 'Iluminação Vila Nova', lat: -20.32, lng: -40.32, status: 'pendente', icon: '💡' },
  { id: '3', name: 'Poda Jardim', lat: -20.28, lng: -40.28, status: 'vencido', icon: '🌿' },
  { id: '4', name: 'Limpeza Centro', lat: -20.31, lng: -40.31, status: 'agendado', icon: '🧹' },
];

export default function MapView({ title = 'Mapa de Chamados', height = 'h-96' }: MapViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw map markers
    OBRAS.forEach((obra) => {
      const x = (obra.lng + 40.5) * 100;
      const y = (20.5 - obra.lat) * 100;

      // Draw circle
      const colors = {
        'em-andamento': '#1dc9a4',
        'pendente': '#f59e0b',
        'vencido': '#ef4444',
        'agendado': '#3b82f6',
      };
      ctx.fillStyle = colors[obra.status];
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw icon
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obra.icon, x, y);
    });
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-sm font-bold text-foreground mb-4">{title}</h3>
      <canvas
        ref={canvasRef}
        className={`w-full ${height} bg-white border border-border rounded-lg`}
      />
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500" />
          <span className="text-muted">Em andamento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-muted">Pendente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-muted">Vencido</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-muted">Agendado</span>
        </div>
      </div>
    </div>
  );
}
