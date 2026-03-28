import { useState } from 'react';
import { Download, FileText, Sheet } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface ReportExporterProps {
  startDate?: string;
  endDate?: string;
}

export default function ReportExporter({ startDate, endDate }: ReportExporterProps) {
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const finalStartDate = startDate || sevenDaysAgo;
  const finalEndDate = endDate || today;

  const generatePDF = trpc.reports.generatePDF.useMutation();
  const generateExcel = trpc.reports.generateExcel.useMutation();
  const generateComplete = trpc.reports.generateComplete.useMutation();

  const handleDownload = async (format: 'pdf' | 'excel' | 'complete') => {
    try {
      setLoading(true);

      if (format === 'pdf') {
        const result = await generatePDF.mutateAsync({
          startDate: finalStartDate || today,
          endDate: finalEndDate || today,
        });

        if (result.success && result.data) {
          const link = document.createElement('a');
          link.href = `data:application/pdf;base64,${result.data}`;
          link.download = result.filename || 'relatorio.pdf';
          link.click();
          toast.success('Relatório PDF baixado com sucesso!');
        } else {
          toast.error(`Erro ao gerar PDF: ${result.error}`);
        }
      } else if (format === 'excel') {
        const result = await generateExcel.mutateAsync({
          startDate: finalStartDate || today,
          endDate: finalEndDate || today,
        });

        if (result.success && result.data) {
          const link = document.createElement('a');
          link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${result.data}`;
          link.download = result.filename || 'relatorio.xlsx';
          link.click();
          toast.success('Relatório Excel baixado com sucesso!');
        } else {
          toast.error(`Erro ao gerar Excel: ${result.error}`);
        }
      } else if (format === 'complete') {
        const result = await generateComplete.mutateAsync({
          startDate: finalStartDate || today,
          endDate: finalEndDate || today,
        });

        if (result.success && result.pdf && result.excel) {
          // Download PDF
          const pdfLink = document.createElement('a');
          pdfLink.href = `data:application/pdf;base64,${result.pdf}`;
          pdfLink.download = result.pdfFilename || 'relatorio.pdf';
          pdfLink.click();

          // Download Excel
          setTimeout(() => {
            const excelLink = document.createElement('a');
            excelLink.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${result.excel}`;
            excelLink.download = result.excelFilename;
            excelLink.click();
          }, 500);

          toast.success('Relatórios (PDF + Excel) baixados com sucesso!');
        } else {
          toast.error(`Erro ao gerar relatórios: ${result.error}`);
        }
      }
    } catch (error) {
      toast.error('Erro ao gerar relatório');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleDownload('pdf')}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        <FileText size={18} />
        PDF
      </button>
      <button
        onClick={() => handleDownload('excel')}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        <Sheet size={18} />
        Excel
      </button>
      <button
        onClick={() => handleDownload('complete')}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        <Download size={18} />
        {loading ? 'Gerando...' : 'Ambos'}
      </button>
    </div>
  );
}
