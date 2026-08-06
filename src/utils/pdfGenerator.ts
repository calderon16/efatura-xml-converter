import { saveOrShareFile } from './nativeDownload';
import type { TabularData } from '../types/generic';

/**
 * Generates a simple tabular PDF report client-side. Dynamically imports jsPDF + jspdf-autotable
 * on demand (same pattern as excelGenerator.ts's exceljs import) so the ~200KB library never
 * ships in the main bundle.
 */
export async function exportToPdf(data: TabularData, title: string, fileName: string): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const autoTableModule = await import('jspdf-autotable');
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({ orientation: data.headers.length > 6 ? 'landscape' : 'portrait' });

  doc.setFontSize(14);
  doc.text(title, 14, 15);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(new Date().toLocaleString(), 14, 21);

  autoTable(doc, {
    head: [data.headers],
    body: data.rows,
    startY: 26,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [30, 58, 138] }, // navy, matches the app's primary brand color
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  const blob = doc.output('blob');
  await saveOrShareFile(blob, fileName, 'application/pdf');
}
