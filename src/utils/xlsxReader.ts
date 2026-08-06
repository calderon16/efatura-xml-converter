import type { TabularData } from '../types/generic';

// exceljs cell.value can be a plain string/number/Date, or a rich object for formulas,
// hyperlinks, or rich text runs — normalize all of them down to a plain string/number for our
// schema-agnostic TabularData shape.
function cellToValue(raw: unknown): string | number {
  if (raw == null) return '';
  if (typeof raw === 'number' || typeof raw === 'string') return raw;
  if (raw instanceof Date) return raw.toISOString().slice(0, 10);
  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if ('result' in obj) return cellToValue(obj.result); // formula cell
    if ('text' in obj) return String(obj.text); // hyperlink cell
    if ('richText' in obj && Array.isArray(obj.richText)) {
      return (obj.richText as { text: string }[]).map((r) => r.text).join('');
    }
  }
  return String(raw);
}

// Reads the first worksheet of an uploaded .xlsx file into the same schema-agnostic TabularData
// shape genericXmlFlattener.ts produces for XML, so it can feed the exact same
// GenericPreviewTable/exportToPdf/exportToCsv/exportGenericTableToExcel pipeline unchanged.
export async function readXlsxToTabularData(file: File): Promise<TabularData> {
  const ExcelJSModule = await import('exceljs');
  const ExcelJS = ExcelJSModule.default || ExcelJSModule;

  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();

  try {
    // exceljs's browser ZIP reader needs a Uint8Array — passing a raw ArrayBuffer causes
    // workbook.xlsx.load() to hang forever instead of resolving or throwing (confirmed via
    // testing; not documented behavior).
    await workbook.xlsx.load(new Uint8Array(buffer) as never);
  } catch {
    return { headers: [], rows: [], unsupportedFiles: [file.name] };
  }

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    return { headers: [], rows: [], unsupportedFiles: [file.name] };
  }

  let headers: string[] = [];
  const rows: (string | number)[][] = [];

  worksheet.eachRow((row, rowNumber) => {
    // exceljs's row.values is 1-indexed (index 0 is always empty) — drop it.
    const values = (row.values as unknown[]).slice(1).map(cellToValue);
    if (rowNumber === 1) {
      headers = values.map((v) => String(v) || `Column ${values.indexOf(v) + 1}`);
    } else {
      rows.push(values);
    }
  });

  if (headers.length === 0 || rows.length === 0) {
    return { headers: [], rows: [], unsupportedFiles: [file.name] };
  }

  return { headers, rows, unsupportedFiles: [] };
}
