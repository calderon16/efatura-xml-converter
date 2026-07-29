// UBL-TR Invoice TypeScript Interfaces

export interface TaxSubtotalItem {
  taxName: string; // KDV, ÖTV, etc.
  taxableAmount: number;
  taxAmount: number;
  percent: number;
}

export interface InvoiceLineItem {
  id: string; // Kalem No
  name: string; // Ürün/Hizmet Adı
  quantity: number; // Miktar
  unitCode: string; // Birim (KGM, C62/ADET, LTR, etc.)
  unitPrice: number; // Birim Fiyat
  lineExtensionAmount: number; // Satır Tutarı
  taxPercent: number; // Ana KDV Oranı (%)
  taxAmount: number; // Toplam Vergi Tutarı
  taxableAmount: number; // Vergiye Tabi Tutar
  taxDetails: string; // Consolidated string: e.g. "KDV %20: 300.00 TL | ÖTV %10: 150.00 TL"
  taxSubtotals: TaxSubtotalItem[];
  hasMismatch: boolean; // Miktar * Fiyat != LineExtensionAmount?
  mismatchReason?: string; // Tutarsızlık açıklaması
}

export interface MissingField {
  invoiceId: string;
  lineId?: string;
  field: string;
  description: string;
}

export interface InvoiceSummary {
  fileName: string;
  invoiceId: string; // Fatura No
  issueDate: string; // Fatura Tarihi
  profileId: string; // Fatura Tipi (TICARIFATURA, EARSIVFATURA, etc.)
  supplierName: string; // Satıcı Ünvanı
  supplierVkn: string; // Satıcı VKN/TCKN Numarası
  supplierVknType: string; // "VKN" veya "TCKN"
  customerName: string; // Alıcı Ünvanı
  customerVkn: string; // Alıcı VKN/TCKN Numarası
  customerVknType: string; // "VKN" veya "TCKN"
  lineExtensionAmount: number; // Mal/Hizmet Toplam Tutarı
  taxExclusiveAmount: number; // Toplam Matrah
  taxInclusiveAmount: number; // Vergiler Dahil Toplam
  payableAmount: number; // Ödenecek Genel Toplam
  lineItems: InvoiceLineItem[];
  missingFields: MissingField[];
  hasWarnings: boolean;
  isUnsupportedPDF?: boolean;
}

export interface ParsedResult {
  invoices: InvoiceSummary[];
  allLineItems: (InvoiceLineItem & {
    invoiceId: string;
    supplierName: string;
    supplierVkn: string;
    supplierVknType: string;
    customerName: string;
    customerVkn: string;
    customerVknType: string;
    issueDate: string;
  })[];
  allMissingFields: MissingField[];
  unsupportedFiles: string[];
}
