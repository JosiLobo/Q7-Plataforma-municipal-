import { Download, FileText, Sheet } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename?: string;
}

export default function ExportButton({ data, filename = 'relatorio' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            const stringValue = String(value || '');
            return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const exportToJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const exportToPDF = () => {
    // Simple PDF export (would need a library like jsPDF for production)
    alert('PDF export requer integração com biblioteca externa (jsPDF)');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
      >
        <Download size={16} />
        Exportar
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={exportToCSV}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors border-b border-border"
          >
            <Sheet size={16} className="text-primary" />
            Exportar como CSV
          </button>
          <button
            onClick={exportToJSON}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors border-b border-border"
          >
            <FileText size={16} className="text-blue-600" />
            Exportar como JSON
          </button>
          <button
            onClick={exportToPDF}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
          >
            <FileText size={16} className="text-red-600" />
            Exportar como PDF
          </button>
        </div>
      )}
    </div>
  );
}
