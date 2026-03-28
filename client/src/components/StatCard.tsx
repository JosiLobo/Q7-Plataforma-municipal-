import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period?: string;
  };
  icon?: string;
  accent?: 'teal' | 'green' | 'amber' | 'red' | 'blue';
  onClick?: () => void;
}

const accentColors = {
  teal: 'border-t-accent bg-accent/5',
  green: 'border-t-green-500 bg-green-500/5',
  amber: 'border-t-amber-500 bg-amber-500/5',
  red: 'border-t-red-500 bg-red-500/5',
  blue: 'border-t-blue-500 bg-blue-500/5',
};

export default function StatCard({
  label,
  value,
  delta,
  icon,
  accent = 'teal',
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card border border-border rounded-lg p-5 transition-all duration-200 hover:shadow-md',
        accentColors[accent],
        onClick && 'cursor-pointer hover:border-accent'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase letter-spacing text-muted mb-1">
            {label}
          </p>
          <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
        </div>
        {icon && <span className="text-3xl opacity-20">{icon}</span>}
      </div>

      {/* Delta */}
      {delta && (
        <div className="flex items-center gap-1">
          {delta.direction === 'up' && (
            <>
              <TrendingUp size={14} className="text-green-600" />
              <span className="text-xs font-semibold text-green-600">+{delta.value}%</span>
            </>
          )}
          {delta.direction === 'down' && (
            <>
              <TrendingDown size={14} className="text-red-600" />
              <span className="text-xs font-semibold text-red-600">{delta.value}%</span>
            </>
          )}
          {delta.direction === 'neutral' && (
            <span className="text-xs font-semibold text-muted">→ {delta.value}%</span>
          )}
          {delta.period && (
            <span className="text-xs text-muted ml-1">vs {delta.period}</span>
          )}
        </div>
      )}
    </div>
  );
}
