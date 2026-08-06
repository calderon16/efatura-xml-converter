import { saveOrShareFile } from './nativeDownload';
import type { ParsedResult } from '../types/ubl';
import type { TabularData } from '../types/generic';

/**
 * Generates an Excel (.xlsx) workbook with 3 tabs and applies visual styling,
 * frozen headers, yellow warnings for calculation mismatches, VKN/TCKN labels, and multi-tax details.
 * Uses dynamic import('exceljs') to optimize initial page load performance.
 */
export async function exportToExcel(parsedResult: ParsedResult): Promise<void> {
  // Dynamically import ExcelJS on demand
  const ExcelJSModule = await import('exceljs');
  const ExcelJS = ExcelJSModule.default || ExcelJSModule;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'e-Fatura XML Excel Dönüştürücü';
  workbook.created = new Date();

  // Header fill style (Dark Navy Blue)
  const headerFill: any = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '1E3A8A' },
  };

  const headerFont: any = {
    name: 'Segoe UI',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFF' },
  };

  const warningFill: any = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FEF08A' }, // Soft yellow accent
  };

  const borderStyle: any = {
    top: { style: 'thin', color: { argb: 'E5E7EB' } },
    bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
    left: { style: 'thin', color: { argb: 'E5E7EB' } },
    right: { style: 'thin', color: { argb: 'E5E7EB' } },
  };

  // -------------------------------------------------------------
  // TAB 1: FATURA DETAYI (Kalemler)
  // -------------------------------------------------------------
  const sheet1 = workbook.addWorksheet('Fatura Detayı', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  sheet1.columns = [
    { header: 'Fatura No', key: 'invoiceId', width: 18 },
    { header: 'Fatura Tarihi', key: 'issueDate', width: 14 },
    { header: 'Satıcı Ünvanı', key: 'supplierName', width: 26 },
    { header: 'Satıcı VKN/TCKN', key: 'supplierVknFormatted', width: 18 },
    { header: 'Alıcı Ünvanı', key: 'customerName', width: 26 },
    { header: 'Alıcı VKN/TCKN', key: 'customerVknFormatted', width: 18 },
    { header: 'Kalem No', key: 'id', width: 10 },
    { header: 'Ürün/Hizmet Adı', key: 'name', width: 35 },
    { header: 'Miktar', key: 'quantity', width: 12 },
    { header: 'Birim', key: 'unitCode', width: 10 },
    { header: 'Birim Fiyat (TL)', key: 'unitPrice', width: 15 },
    { header: 'Satır Tutarı (TL)', key: 'lineExtensionAmount', width: 16 },
    { header: 'Vergi Detayı', key: 'taxDetails', width: 32 },
    { header: 'Vergiye Tabi Tutar (TL)', key: 'taxableAmount', width: 22 },
    { header: 'Uyarılar', key: 'mismatchReason', width: 45 },
  ];

  // Style Header Row
  const row1 = sheet1.getRow(1);
  row1.height = 28;
  row1.eachCell((cell: any) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Populate Tab 1 Rows
  parsedResult.allLineItems.forEach((item) => {
    const row = sheet1.addRow({
      invoiceId: item.invoiceId,
      issueDate: item.issueDate,
      supplierName: item.supplierName,
      supplierVknFormatted: `${item.supplierVknType}: ${item.supplierVkn}`,
      customerName: item.customerName,
      customerVknFormatted: `${item.customerVknType}: ${item.customerVkn}`,
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unitCode: item.unitCode,
      unitPrice: item.unitPrice,
      lineExtensionAmount: item.lineExtensionAmount,
      taxDetails: item.taxDetails,
      taxableAmount: item.taxableAmount,
      mismatchReason: item.mismatchReason || '',
    });

    row.height = 22;

    // Apply number formats
    row.getCell('quantity').numFmt = '#,##0.00';
    row.getCell('unitPrice').numFmt = '#,##0.00';
    row.getCell('lineExtensionAmount').numFmt = '#,##0.00';
    row.getCell('taxableAmount').numFmt = '#,##0.00';

    row.eachCell((cell: any) => {
      cell.border = borderStyle;
      cell.alignment = { vertical: 'middle' };
    });

    // Mismatch warning styling
    if (item.hasMismatch) {
      row.eachCell((cell: any) => {
        cell.fill = warningFill;
        cell.font = { color: { argb: '854D0E' }, bold: true };
      });
    }
  });


  // -------------------------------------------------------------
  // TAB 2: ÖZET (Fatura Başına Tek Satır)
  // -------------------------------------------------------------
  const sheet2 = workbook.addWorksheet('Özet', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  sheet2.columns = [
    { header: 'Dosya Adı', key: 'fileName', width: 22 },
    { header: 'Fatura No', key: 'invoiceId', width: 18 },
    { header: 'Fatura Tarihi', key: 'issueDate', width: 14 },
    { header: 'Fatura Tipi', key: 'profileId', width: 16 },
    { header: 'Satıcı Ünvanı', key: 'supplierName', width: 25 },
    { header: 'Satıcı VKN/TCKN', key: 'supplierVknFormatted', width: 18 },
    { header: 'Alıcı Ünvanı', key: 'customerName', width: 25 },
    { header: 'Alıcı VKN/TCKN', key: 'customerVknFormatted', width: 18 },
    { header: 'Toplam Mal/Hizmet (TL)', key: 'lineExtensionAmount', width: 22 },
    { header: 'Matrah (TL)', key: 'taxExclusiveAmount', width: 18 },
    { header: 'Toplam KDV/Vergi (TL)', key: 'taxAmount', width: 20 },
    { header: 'Ödenecek Toplam (TL)', key: 'payableAmount', width: 22 },
    { header: 'Durum', key: 'status', width: 18 },
  ];

  const row2Header = sheet2.getRow(1);
  row2Header.height = 28;
  row2Header.eachCell((cell: any) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  let totalPayableSum = 0;
  let totalLineExtSum = 0;
  let totalTaxSum = 0;

  parsedResult.invoices.forEach((inv) => {
    const taxAmountTotal = inv.taxInclusiveAmount - inv.taxExclusiveAmount;
    totalLineExtSum += inv.lineExtensionAmount;
    totalTaxSum += taxAmountTotal > 0 ? taxAmountTotal : 0;
    totalPayableSum += inv.payableAmount;

    const row = sheet2.addRow({
      fileName: inv.fileName,
      invoiceId: inv.invoiceId,
      issueDate: inv.issueDate,
      profileId: inv.profileId,
      supplierName: inv.supplierName,
      supplierVknFormatted: `${inv.supplierVknType}: ${inv.supplierVkn}`,
      customerName: inv.customerName,
      customerVknFormatted: `${inv.customerVknType}: ${inv.customerVkn}`,
      lineExtensionAmount: inv.lineExtensionAmount,
      taxExclusiveAmount: inv.taxExclusiveAmount,
      taxAmount: taxAmountTotal > 0 ? taxAmountTotal : 0,
      payableAmount: inv.payableAmount,
      status: inv.hasWarnings ? '⚠️ Tutarsızlık Var' : '✅ Başarılı',
    });

    row.height = 22;
    row.getCell('lineExtensionAmount').numFmt = '#,##0.00';
    row.getCell('taxExclusiveAmount').numFmt = '#,##0.00';
    row.getCell('taxAmount').numFmt = '#,##0.00';
    row.getCell('payableAmount').numFmt = '#,##0.00';

    row.eachCell((cell: any) => {
      cell.border = borderStyle;
      cell.alignment = { vertical: 'middle' };
    });

    if (inv.hasWarnings) {
      row.getCell('status').fill = warningFill;
      row.getCell('status').font = { color: { argb: '854D0E' }, bold: true };
    }
  });

  // Summary Row at bottom of Tab 2
  if (parsedResult.invoices.length > 0) {
    const summaryRow = sheet2.addRow({
      fileName: 'GENEL TOPLAM',
      lineExtensionAmount: totalLineExtSum,
      taxAmount: totalTaxSum,
      payableAmount: totalPayableSum,
    });
    summaryRow.height = 24;
    summaryRow.eachCell((cell: any) => {
      cell.font = { bold: true, name: 'Segoe UI' };
      cell.border = {
        top: { style: 'double', color: { argb: '1E3A8A' } },
        bottom: { style: 'double', color: { argb: '1E3A8A' } },
      };
    });
    summaryRow.getCell('lineExtensionAmount').numFmt = '#,##0.00';
    summaryRow.getCell('taxAmount').numFmt = '#,##0.00';
    summaryRow.getCell('payableAmount').numFmt = '#,##0.00';
  }


  // -------------------------------------------------------------
  // TAB 3: EKSİK ALANLAR
  // -------------------------------------------------------------
  const sheet3 = workbook.addWorksheet('Eksik Alanlar', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  sheet3.columns = [
    { header: 'Fatura No', key: 'invoiceId', width: 20 },
    { header: 'Kalem No', key: 'lineId', width: 12 },
    { header: 'Eksik Alan Adı', key: 'field', width: 28 },
    { header: 'Açıklama', key: 'description', width: 50 },
  ];

  const row3Header = sheet3.getRow(1);
  row3Header.height = 28;
  row3Header.eachCell((cell: any) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  if (parsedResult.allMissingFields.length === 0) {
    const emptyRow = sheet3.addRow({
      invoiceId: '-',
      lineId: '-',
      field: 'Eksik Alan Bulunmadı',
      description: 'Yüklenen tüm XML dosyalarındaki zorunlu alanlar tam ve eksiksizdir.',
    });
    emptyRow.height = 22;
  } else {
    parsedResult.allMissingFields.forEach((mf) => {
      const row = sheet3.addRow({
        invoiceId: mf.invoiceId,
        lineId: mf.lineId || '-',
        field: mf.field,
        description: mf.description,
      });
      row.height = 22;
      row.eachCell((cell: any) => {
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle' };
      });
    });
  }

  // Adjust column widths based on length
  [sheet1, sheet2, sheet3].forEach((sheet) => {
    sheet.columns.forEach((col: any) => {
      let maxLen = 12;
      col.eachCell?.({ includeEmpty: false }, (cell: any) => {
        const valStr = cell.value ? cell.value.toString() : '';
        if (valStr.length > maxLen) {
          maxLen = valStr.length;
        }
      });
      col.width = Math.min(Math.max(maxLen + 4, 12), 60);
    });
  });

  // Write and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  
  const timestamp = new Date().toISOString().slice(0, 10);
  await saveOrShareFile(
    blob,
    `eFatura_Donusturulen_${timestamp}.xlsx`,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
}

/**
 * Single-sheet Excel export for General XML Mode's schema-agnostic tabular data - no invoice
 * assumptions, just headers + rows with the same navy-header/frozen-row styling as the invoice
 * workbook above.
 */
export async function exportGenericTableToExcel(data: TabularData, fileName: string): Promise<void> {
  const ExcelJSModule = await import('exceljs');
  const ExcelJS = ExcelJSModule.default || ExcelJSModule;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SchemaFlow';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Data', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  sheet.columns = data.headers.map((h) => ({ header: h, key: h, width: Math.min(Math.max(h.length + 4, 12), 40) }));

  const headerRow = sheet.getRow(1);
  headerRow.height = 26;
  headerRow.eachCell((cell: any) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } };
    cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  for (const row of data.rows) {
    const rowValues: Record<string, string | number> = {};
    data.headers.forEach((h, i) => {
      rowValues[h] = row[i];
    });
    sheet.addRow(rowValues);
  }

  sheet.columns.forEach((col: any) => {
    let maxLen = 12;
    col.eachCell?.({ includeEmpty: false }, (cell: any) => {
      const valStr = cell.value ? cell.value.toString() : '';
      if (valStr.length > maxLen) maxLen = valStr.length;
    });
    col.width = Math.min(Math.max(maxLen + 4, 12), 50);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  await saveOrShareFile(blob, fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}
