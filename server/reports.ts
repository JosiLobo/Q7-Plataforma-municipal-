import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { Readable } from 'stream';
import type { Buffer as NodeBuffer } from 'buffer';
import { getLast7DaysStats, getMonthStats } from './metrics-db';

/**
 * Gerar relatório em PDF
 */
export async function generatePDFReport(
  startDate: string,
  endDate: string,
  metrics: any
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Cabeçalho
    doc.fontSize(24).font('Helvetica-Bold').text('Q7Gov — Relatório de Atendimento', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text(`Período: ${startDate} a ${endDate}`, { align: 'center' });
    doc.moveDown();

    // Resumo executivo
    doc.fontSize(14).font('Helvetica-Bold').text('Resumo Executivo');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total de Mensagens: ${metrics.totalMessages || 0}`);
    doc.text(`Total de Respostas: ${metrics.totalResponses || 0}`);
    doc.text(`Tempo Médio de Resposta: ${Math.round(metrics.avgResponseTime || 0)}s`);
    doc.text(`Taxa de Escalação: ${metrics.escalations || 0}`);
    doc.text(`Satisfação Média: ${(metrics.avgSatisfaction || 0).toFixed(2)}/5`);
    doc.moveDown();

    // Estatísticas por dia
    doc.fontSize(14).font('Helvetica-Bold').text('Estatísticas Diárias');
    doc.fontSize(10).font('Helvetica');

    if (metrics.dailyStats && Array.isArray(metrics.dailyStats)) {
      metrics.dailyStats.forEach((day: any) => {
        doc.text(
          `${day.date}: ${day.totalMessages} mensagens, ${day.totalResponses} respostas, ${Math.round(parseFloat(day.avgResponseTime?.toString() || '0'))}s tempo médio`
        );
      });
    }

    doc.moveDown();

    // Rodapé
    doc.fontSize(9).font('Helvetica').text(
      `Gerado em ${new Date().toLocaleString('pt-BR')}`,
      { align: 'center', color: '#999' }
    );

    doc.end();
  });
}

/**
 * Gerar relatório em Excel
 */
export async function generateExcelReport(
  startDate: string,
  endDate: string,
  metrics: any
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // Aba 1: Resumo
  const summarySheet = workbook.addWorksheet('Resumo');
  summarySheet.columns = [
    { header: 'Métrica', key: 'metric', width: 30 },
    { header: 'Valor', key: 'value', width: 20 },
  ];

  summarySheet.addRows([
    { metric: 'Período', value: `${startDate} a ${endDate}` },
    { metric: 'Total de Mensagens', value: metrics.totalMessages || 0 },
    { metric: 'Total de Respostas', value: metrics.totalResponses || 0 },
    { metric: 'Tempo Médio de Resposta (s)', value: Math.round(metrics.avgResponseTime || 0) },
    { metric: 'Total de Escalações', value: metrics.escalations || 0 },
    { metric: 'Satisfação Média', value: (metrics.avgSatisfaction || 0).toFixed(2) },
  ]);

  // Estilo
  summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1DC9A4' } };

  // Aba 2: Estatísticas Diárias
  const dailySheet = workbook.addWorksheet('Estatísticas Diárias');
  dailySheet.columns = [
    { header: 'Data', key: 'date', width: 15 },
    { header: 'Mensagens', key: 'totalMessages', width: 15 },
    { header: 'Respostas', key: 'totalResponses', width: 15 },
    { header: 'Tempo Médio (s)', key: 'avgResponseTime', width: 15 },
    { header: 'Escalações', key: 'escalations', width: 15 },
    { header: 'Resoluções', key: 'resolutions', width: 15 },
    { header: 'Satisfação', key: 'avgSatisfaction', width: 15 },
  ];

  if (metrics.dailyStats && Array.isArray(metrics.dailyStats)) {
    dailySheet.addRows(
      metrics.dailyStats.map((day: any) => ({
        date: day.date,
        totalMessages: day.totalMessages || 0,
        totalResponses: day.totalResponses || 0,
        avgResponseTime: Math.round(parseFloat(day.avgResponseTime?.toString() || '0')),
        escalations: day.escalations || 0,
        resolutions: day.resolutions || 0,
        avgSatisfaction: parseFloat(day.avgSatisfaction?.toString() || '0').toFixed(2),
      }))
    );
  }

  // Estilo
  dailySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  dailySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1DC9A4' } };

  // Converter para buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as Buffer;
}

/**
 * Gerar relatório completo (PDF + Excel)
 */
export async function generateCompleteReport(
  startDate: string,
  endDate: string,
  metrics: any
): Promise<{ pdf: Buffer; excel: Buffer }> {
  const [pdf, excel] = await Promise.all([
    generatePDFReport(startDate, endDate, metrics),
    generateExcelReport(startDate, endDate, metrics),
  ]);

  return { pdf, excel };
}
