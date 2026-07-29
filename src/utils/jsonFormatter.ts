import type { ParsedResult } from '../types/ubl';

export type JsonOutputMode = 'nested' | 'flat';

/**
 * Formats ParsedResult UBL data into either a structured nested JSON
 * or a flat JSON array suitable for Zapier / Make / CSV automation.
 */
export function formatToJson(parsedResult: ParsedResult, mode: JsonOutputMode): object {
  if (mode === 'flat') {
    // Mode B: Flat Array JSON (No-code / Low-code automation ready)
    return parsedResult.allLineItems.map((item) => ({
      invoiceId: item.invoiceId,
      issueDate: item.issueDate,
      supplierName: item.supplierName,
      supplierVkn: item.supplierVkn,
      supplierVknType: item.supplierVknType,
      customerName: item.customerName,
      customerVkn: item.customerVkn,
      customerVknType: item.customerVknType,
      lineId: item.id,
      itemName: item.name,
      quantity: item.quantity,
      unitCode: item.unitCode,
      unitPrice: item.unitPrice,
      lineExtensionAmount: item.lineExtensionAmount,
      taxDetails: item.taxDetails,
      taxPercent: item.taxPercent,
      taxAmount: item.taxAmount,
      taxableAmount: item.taxableAmount,
      _warnings: item.hasMismatch ? [item.mismatchReason || 'Tutarsız hesaplama'] : undefined,
    }));
  }

  // Mode A: Ham / Tam Yapı (Structured Nested JSON for developers)
  return {
    summaryStats: {
      totalInvoices: parsedResult.invoices.length,
      totalLineItems: parsedResult.allLineItems.length,
      totalPayableAmount: parsedResult.invoices.reduce((acc, inv) => acc + inv.payableAmount, 0),
      totalWarnings: parsedResult.allLineItems.filter((i) => i.hasMismatch).length,
      totalMissingFields: parsedResult.allMissingFields.length,
    },
    invoices: parsedResult.invoices.map((inv) => ({
      fileName: inv.fileName,
      invoiceId: inv.invoiceId,
      issueDate: inv.issueDate,
      profileId: inv.profileId || 'TICARIFATURA',
      supplier: {
        name: inv.supplierName,
        vknTckn: inv.supplierVkn,
        vknType: inv.supplierVknType,
      },
      customer: {
        name: inv.customerName,
        vknTckn: inv.customerVkn,
        vknType: inv.customerVknType,
      },
      monetaryTotals: {
        lineExtensionAmount: inv.lineExtensionAmount,
        taxExclusiveAmount: inv.taxExclusiveAmount,
        taxInclusiveAmount: inv.taxInclusiveAmount,
        payableAmount: inv.payableAmount,
      },
      lineItems: inv.lineItems.map((item) => ({
        lineId: item.id,
        itemName: item.name,
        quantity: item.quantity,
        unitCode: item.unitCode,
        unitPrice: item.unitPrice,
        lineExtensionAmount: item.lineExtensionAmount,
        taxDetails: item.taxDetails,
        taxSubtotals: item.taxSubtotals,
        _warnings: item.hasMismatch ? [item.mismatchReason || 'Tutarsız hesaplama'] : undefined,
      })),
      missingFields: inv.missingFields.length > 0 ? inv.missingFields : undefined,
      hasWarnings: inv.hasWarnings,
    })),
  };
}

/**
 * Returns formatted JSON string with 2-space indentation.
 */
export function getFormattedJsonString(parsedResult: ParsedResult, mode: JsonOutputMode): string {
  const jsonObj = formatToJson(parsedResult, mode);
  return JSON.stringify(jsonObj, null, 2);
}
