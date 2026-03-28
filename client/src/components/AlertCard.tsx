import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const alertStyles = {
  critical: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-l-red-500',
    icon: AlertCircle,
    iconColor: 'text-red-600',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-l-amber-500',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-l-blue-500',
    icon: Info,
    iconColor: 'text-blue-600',
  },
};

export default function AlertCard({ type, title, message, action }: AlertCardProps) {
  const style = alertStyles[type];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border-l-4',
        style.bg,
        style.border
      )}
    >
      <Icon size={20} className={cn('flex-shrink-0 mt-0.5', style.iconColor)} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground">{title}</p>
        <p className="text-sm text-muted mt-1">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="text-xs font-semibold text-primary hover:text-primary/80 mt-2 transition-colors"
          >
            {action.label} →
          </button>
        )}
      </div>
    </div>
  );
}
