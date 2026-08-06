import type { TabularData } from '../types/generic';

// Extracts text content from a PDF entirely client-side via pdfjs-dist (the same engine behind
// Firefox's built-in PDF viewer). Both the library and its worker script are dynamically imported
// so the ~1MB+ payload never ships in the main bundle, matching this project's established
// heavy-lib convention (see excelGenerator.ts/pdfGenerator.ts).
//
// Only works for PDFs with a real text layer — scanned/image-only PDFs return empty strings per
// page (OCR would be needed for those, explicitly out of scope for this pass).
export async function extractPdfPages(file: File): Promise<string[]> {
  const pdfjsLib = await import('pdfjs-dist');
  // Vite's `?url` suffix resolves this to a hashed asset URL at build time instead of bundling the
  // worker's contents inline — pdf.js requires its worker to run as a separate script.
  const workerUrlModule = await import('pdfjs-dist/build/pdf.worker.mjs?url');
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrlModule.default;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim();
    pages.push(text);
  }

  return pages;
}

// Adapts extracted PDF text into the schema-agnostic TabularData shape (one row per page) so it
// can feed the same GenericPreviewTable/export pipeline used everywhere else in the app. This is
// extraction-based, not table reconstruction — good for turning a text-heavy PDF into a usable
// spreadsheet, not a substitute for a PDF that already contains a real table.
export function pdfPagesToTabularData(pages: string[], fileName: string): TabularData {
  const hasAnyText = pages.some((p) => p.trim().length > 0);
  if (!hasAnyText) {
    // No text layer at all — most likely a scanned/image-only PDF, which needs OCR (out of scope).
    return { headers: [], rows: [], unsupportedFiles: [fileName] };
  }

  return {
    headers: ['Page', 'Text'],
    rows: pages.map((text, i) => [i + 1, text]),
    unsupportedFiles: [],
  };
}
