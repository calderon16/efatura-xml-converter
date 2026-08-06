import { saveOrShareFile } from './nativeDownload';

// Converts an uploaded .docx to PDF entirely client-side: mammoth extracts the document's content
// as HTML (preserving basic formatting — headings, bold/italic, lists), html2canvas rasterizes
// that HTML, and jsPDF slices the resulting image across as many pages as needed. This is
// extraction-based, not a true layout-preserving renderer like LibreOffice — good for text-heavy
// documents, not pixel-perfect for complex multi-column layouts. All three libraries are
// dynamically imported so they never ship in the main bundle.
export async function convertDocxToPdf(file: File, fileName: string): Promise<void> {
  const mammothModule = await import('mammoth');
  const mammoth = mammothModule.default || mammothModule;
  const html2canvasModule = await import('html2canvas');
  const html2canvas = html2canvasModule.default;
  const { jsPDF } = await import('jspdf');

  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

  if (!html.trim()) {
    throw new Error('No content extracted from document');
  }

  // Render inside an isolated <iframe> with its own blank document — NOT appended as a plain div
  // to the page. This app's global stylesheet (Tailwind CSS 4) defines colors via oklch(), which
  // html2canvas's computed-style walker cannot parse ("unsupported color function oklch") even
  // when the container's own inline styles use plain hex — it still inherits/encounters oklch from
  // ancestor rules. A separate iframe document has no Tailwind stylesheet at all, so this can't happen.
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-99999px';
  iframe.style.top = '0';
  iframe.style.width = '800px';
  iframe.style.height = '1200px';
  iframe.style.border = 'none';
  // Defense-in-depth: mammoth's HTML output is derived from the user's own uploaded .docx and
  // shouldn't contain executable script, but this iframe never needs to run any JS of its own
  // (it exists purely for html2canvas to screenshot). "allow-same-origin" without "allow-scripts"
  // keeps parent<->iframe DOM access working (needed for doc.write()/html2canvas(doc.body)) while
  // making script execution, form submission, and popups impossible inside it.
  iframe.setAttribute('sandbox', 'allow-same-origin');
  document.body.appendChild(iframe);

  let blob: Blob;
  try {
    const doc = iframe.contentDocument;
    if (!doc) {
      throw new Error('Could not create rendering frame');
    }
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 32px; background: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.5; color: #111827; }
      h1, h2, h3, h4 { color: #111827; font-weight: 700; }
      h1 { font-size: 24px; margin: 0 0 16px; }
      h2 { font-size: 20px; margin: 20px 0 12px; }
      h3 { font-size: 16px; margin: 16px 0 8px; }
      p { margin: 0 0 12px; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 12px; }
      td, th { border: 1px solid #d1d5db; padding: 6px 8px; }
    </style></head><body>${html}</body></html>`);
    doc.close();

    const canvas = await html2canvas(doc.body, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    blob = pdf.output('blob');
  } finally {
    document.body.removeChild(iframe);
  }

  await saveOrShareFile(blob, fileName, 'application/pdf');
}
