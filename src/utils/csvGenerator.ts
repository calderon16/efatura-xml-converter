import { saveOrShareFile } from './nativeDownload';
import type { TabularData } from '../types/generic';

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsvString(data: TabularData): string {
  const lines = [data.headers.map(escapeCsvCell).join(',')];
  for (const row of data.rows) {
    lines.push(row.map(escapeCsvCell).join(','));
  }
  // Leading BOM so Excel opens UTF-8 (Turkish/accented characters) without mangling it.
  return '﻿' + lines.join('\r\n');
}

export async function exportToCsv(data: TabularData, fileName: string): Promise<void> {
  const csv = toCsvString(data);
  await saveOrShareFile(csv, fileName, 'text/csv;charset=utf-8');
}
