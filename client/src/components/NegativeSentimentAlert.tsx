import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface NegativeSentimentAlertProps {
  alert: {
    id: number;
    messageId: number;
    conversationId: number;
    sentiment: string;
    confidence: number;
    message: string;
    status: string;
    notes?: string;
  };
  onResolved?: () => void;
}

export default function NegativeSentimentAlert({ alert, onResolved }: NegativeSentimentAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(alert.notes || '');

  const markAsReviewedMutation = trpc.sentiment.markAlertAsReviewed.useMutation();
  const resolveAlertMutation = trpc.sentiment.resolveAlert.useMutation();

  const handleMarkAsReviewed = async () => {
    try {
      await markAsReviewedMutation.mutateAsync({
        alertId: alert.id,
        notes,
      });
      toast.success('Alerta marcado como revisado');
      onResolved?.();
    } catch (error) {
      toast.error('Erro ao marcar alerta');
    }
  };

  const handleResolve = async () => {
    try {
      await resolveAlertMutation.mutateAsync({
        alertId: alert.id,
        notes,
      });
      toast.success('Alerta resolvido');
      onResolved?.();
    } catch (error) {
      toast.error('Erro ao resolver alerta');
    }
  };

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-red-900 dark:text-red-200">
              Sentimento Negativo Detectado
            </h4>
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              Confiança: {(alert.confidence * 100).toFixed(0)}%
            </span>
          </div>

          <p className="text-sm text-red-800 dark:text-red-300 mb-3 break-words">
            "{alert.message}"
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
              alert.status === 'pending'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                : alert.status === 'reviewed'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
            }`}>
              {alert.status === 'pending' ? '⏳ Pendente' : alert.status === 'reviewed' ? '👁️ Revisado' : '✅ Resolvido'}
            </span>
          </div>

          {isExpanded && (
            <div className="mb-3 space-y-2">
              <label className="block text-xs font-medium text-red-700 dark:text-red-300">
                Notas (opcional):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione notas sobre a ação tomada..."
                className="w-full px-3 py-2 text-sm border border-red-200 dark:border-red-800 rounded-lg bg-white dark:bg-red-950 text-red-900 dark:text-red-100 placeholder:text-red-500 dark:placeholder:text-red-400 focus:outline-none focus:border-red-400"
                rows={3}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              {isExpanded ? 'Ocultar' : 'Adicionar Notas'}
            </button>

            {alert.status === 'pending' && (
              <>
                <button
                  onClick={handleMarkAsReviewed}
                  disabled={markAsReviewedMutation.isPending}
                  className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/60 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={14} />
                  Revisar
                </button>

                <button
                  onClick={handleResolve}
                  disabled={resolveAlertMutation.isPending}
                  className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={14} />
                  Resolver
                </button>
              </>
            )}

            {alert.status === 'reviewed' && (
              <button
                onClick={handleResolve}
                disabled={resolveAlertMutation.isPending}
                className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors disabled:opacity-50"
              >
                <CheckCircle size={14} />
                Resolver
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
