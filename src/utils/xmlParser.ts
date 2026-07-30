import type { InvoiceSummary, InvoiceLineItem, MissingField, ParsedResult, TaxSubtotalItem } from '../types/ubl';

// Official GİB UBL-TR 2.1 Namespace URIs
export const UBL_NAMESPACES = {
  INVOICE: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
  CBC: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  CAC: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  DS: 'http://www.w3.org/2000/09/xmldsig#',
};

/**
 * Robustly find elements by Namespace URI & local name, with localName fallback for non-standard XMLs.
 */
function getNSElements(parent: Element | Document, nsURI: string, localName: string): Element[] {
  // Try strict getElementsByTagNameNS first
  const nsList = parent.getElementsByTagNameNS(nsURI, localName);
  if (nsList && nsList.length > 0) {
    return Array.from(nsList);
  }

  // Fallback: search all elements ignoring prefix or namespace
  const allElements = parent.getElementsByTagName('*');
  const results: Element[] = [];
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    // Ignore digital signature elements
    if (el.namespaceURI === UBL_NAMESPACES.DS || el.localName === 'Signature') {
      continue;
    }
    const elLocalName = el.localName || el.tagName.split(':').pop();
    if (elLocalName?.toLowerCase() === localName.toLowerCase()) {
      results.push(el);
    }
  }
  return results;
}

/**
 * Get direct child of a parent matching namespace URI and local name.
 */
function getNSDirectChild(parent: Element, nsURI: string, localName: string): Element | null {
  const children = parent.children;
  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    if (el.namespaceURI === UBL_NAMESPACES.DS || el.localName === 'Signature') {
      continue;
    }
    const elLocalName = el.localName || el.tagName.split(':').pop();
    if (
      (el.namespaceURI === nsURI || !el.namespaceURI) &&
      elLocalName?.toLowerCase() === localName.toLowerCase()
    ) {
      return el;
    }
  }
  return null;
}

/**
 * Get trimmed text content of a tag using namespace-aware search.
 */
function getNSTagText(parent: Element | Document | null, nsURI: string, localName: string): string {
  if (!parent) return '';
  const elements = getNSElements(parent, nsURI, localName);
  if (elements.length > 0) {
    return elements[0].textContent?.trim() || '';
  }
  return '';
}

/**
 * Extract Party information (Supplier or Customer) including VKN/TCKN schemeID distinction.
 */
function extractPartyInfo(partyContainer: Element | null): { name: string; vkn: string; vknType: string } {
  if (!partyContainer) return { name: '', vkn: '', vknType: '' };

  const party = getNSDirectChild(partyContainer, UBL_NAMESPACES.CAC, 'Party') || partyContainer;
  
  // Extract Name (PartyName/Name, Person/FirstName + LastName, or PartyLegalEntity/RegistrationName)
  let name = '';
  const partyNameEl = getNSElements(party, UBL_NAMESPACES.CAC, 'PartyName')[0];
  if (partyNameEl) {
    name = getNSTagText(partyNameEl, UBL_NAMESPACES.CBC, 'Name');
  }
  if (!name) {
    const legalEntity = getNSElements(party, UBL_NAMESPACES.CAC, 'PartyLegalEntity')[0];
    if (legalEntity) {
      name = getNSTagText(legalEntity, UBL_NAMESPACES.CBC, 'RegistrationName');
    }
  }
  if (!name) {
    const person = getNSElements(party, UBL_NAMESPACES.CAC, 'Person')[0];
    if (person) {
      const firstName = getNSTagText(person, UBL_NAMESPACES.CBC, 'FirstName');
      const familyName = getNSTagText(person, UBL_NAMESPACES.CBC, 'FamilyName');
      name = `${firstName} ${familyName}`.trim();
    }
  }

  // Extract VKN / TCKN (Inspect PartyIdentification/ID schemeID attribute)
  let vkn = '';
  let vknType = '';

  const partyIdentifications = getNSElements(party, UBL_NAMESPACES.CAC, 'PartyIdentification');
  for (const pid of partyIdentifications) {
    const idEls = getNSElements(pid, UBL_NAMESPACES.CBC, 'ID');
    if (idEls.length > 0) {
      const idEl = idEls[0];
      const val = idEl.textContent?.trim() || '';
      if (val) {
        vkn = val;
        const schemeAttr = idEl.getAttribute('schemeID')?.toUpperCase();
        if (schemeAttr === 'VKN') {
          vknType = 'VKN';
        } else if (schemeAttr === 'TCKN') {
          vknType = 'TCKN';
        } else {
          vknType = val.length === 11 ? 'TCKN' : 'VKN';
        }
        break;
      }
    }
  }

  if (!vkn) {
    const taxScheme = getNSElements(party, UBL_NAMESPACES.CAC, 'PartyTaxScheme')[0];
    if (taxScheme) {
      const companyId = getNSTagText(taxScheme, UBL_NAMESPACES.CBC, 'CompanyID');
      if (companyId) {
        vkn = companyId;
        vknType = companyId.length === 11 ? 'TCKN' : 'VKN';
      }
    }
  }

  return { name, vkn, vknType };
}

/**
 * Parse a single UBL-TR XML content string into InvoiceSummary using strict Namespace URIs.
 */
export function parseUblXml(xmlString: string, fileName: string): InvoiceSummary {
  const missingFields: MissingField[] = [];
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  // Check for XML parsing errors
  const parserError = xmlDoc.getElementsByTagName('parsererror');
  if (parserError.length > 0) {
    throw new Error(`XML ayrıştırma hatası: ${fileName} geçerli bir XML formatında değil.`);
  }

  const rootElement = xmlDoc.documentElement;
  const rootName = rootElement.localName || rootElement.tagName.split(':').pop();

  // v1 Scope: PDF embedded or non-Invoice XML unsupported check
  if (rootName?.toLowerCase() !== 'invoice') {
    return {
      fileName,
      invoiceId: 'BİLİNMİYOR',
      issueDate: '',
      profileId: '',
      supplierName: '',
      supplierVkn: '',
      supplierVknType: '',
      customerName: '',
      customerVkn: '',
      customerVknType: '',
      lineExtensionAmount: 0,
      taxExclusiveAmount: 0,
      taxInclusiveAmount: 0,
      payableAmount: 0,
      lineItems: [],
      missingFields: [],
      hasWarnings: true,
      isUnsupportedPDF: true,
    };
  }

  // Mandatory / Metadata fields
  const invoiceId = getNSTagText(rootElement, UBL_NAMESPACES.CBC, 'ID');
  if (!invoiceId) {
    missingFields.push({
      invoiceId: 'BİLİNMİYOR',
      field: 'Fatura No (ID)',
      description: 'XML içerisinde Invoice/cbc:ID etiketi bulunamadı.',
    });
  }

  const uuid = getNSTagText(rootElement, UBL_NAMESPACES.CBC, 'UUID');
  if (!uuid) {
    missingFields.push({
      invoiceId: invoiceId || 'BİLİNMİYOR',
      field: 'ETTN / Evrensel Tekil Fatura No (UUID)',
      description: 'XML içerisinde Invoice/cbc:UUID etiketi bulunamadı.',
    });
  }

  const issueDate = getNSTagText(rootElement, UBL_NAMESPACES.CBC, 'IssueDate');
  if (!issueDate) {
    missingFields.push({
      invoiceId: invoiceId || 'BİLİNMİYOR',
      field: 'Fatura Tarihi (IssueDate)',
      description: 'XML içerisinde Invoice/cbc:IssueDate etiketi bulunamadı.',
    });
  }

  const profileId = getNSTagText(rootElement, UBL_NAMESPACES.CBC, 'ProfileID');

  // Supplier info
  const supplierPartyEl = getNSElements(rootElement, UBL_NAMESPACES.CAC, 'AccountingSupplierParty')[0] || null;
  const supplier = extractPartyInfo(supplierPartyEl);
  if (!supplier.name) {
    missingFields.push({
      invoiceId: invoiceId || 'BİLİNMİYOR',
      field: 'Satıcı Ünvanı',
      description: 'AccountingSupplierParty içerisinde Satıcı Ünvanı bulunamadı.',
    });
  }
  if (!supplier.vkn) {
    missingFields.push({
      invoiceId: invoiceId || 'BİLİNMİYOR',
      field: 'Satıcı VKN/TCKN',
      description: 'AccountingSupplierParty içerisinde Satıcı VKN/TCKN bulunamadı.',
    });
  }

  // Customer info
  const customerPartyEl = getNSElements(rootElement, UBL_NAMESPACES.CAC, 'AccountingCustomerParty')[0] || null;
  const customer = extractPartyInfo(customerPartyEl);
  if (!customer.name) {
    missingFields.push({
      invoiceId: invoiceId || 'BİLİNMİYOR',
      field: 'Alıcı Ünvanı',
      description: 'AccountingCustomerParty içerisinde Alıcı Ünvanı bulunamadı.',
    });
  }
  if (!customer.vkn) {
    missingFields.push({
      invoiceId: invoiceId || 'BİLİNMİYOR',
      field: 'Alıcı VKN/TCKN',
      description: 'AccountingCustomerParty içerisinde Alıcı VKN/TCKN bulunamadı.',
    });
  }

  // Monetary Totals
  const legalMonetaryTotal = getNSElements(rootElement, UBL_NAMESPACES.CAC, 'LegalMonetaryTotal')[0] || null;
  const lineExtensionTotal = parseFloat(getNSTagText(legalMonetaryTotal, UBL_NAMESPACES.CBC, 'LineExtensionAmount')) || 0;
  const taxExclusiveAmount = parseFloat(getNSTagText(legalMonetaryTotal, UBL_NAMESPACES.CBC, 'TaxExclusiveAmount')) || 0;
  const taxInclusiveAmount = parseFloat(getNSTagText(legalMonetaryTotal, UBL_NAMESPACES.CBC, 'TaxInclusiveAmount')) || 0;
  const payableAmount = parseFloat(getNSTagText(legalMonetaryTotal, UBL_NAMESPACES.CBC, 'PayableAmount')) || taxInclusiveAmount;

  // Invoice Lines
  const lineItems: InvoiceLineItem[] = [];
  let hasWarnings = false;

  const invoiceLineElements = getNSElements(rootElement, UBL_NAMESPACES.CAC, 'InvoiceLine');
  
  invoiceLineElements.forEach((lineEl, idx) => {
    const lineId = getNSTagText(lineEl, UBL_NAMESPACES.CBC, 'ID') || `${idx + 1}`;
    
    // Item Name
    const itemEl = getNSElements(lineEl, UBL_NAMESPACES.CAC, 'Item')[0] || null;
    const itemName = getNSTagText(itemEl, UBL_NAMESPACES.CBC, 'Name') || 'Tanımsız Ürün/Hizmet';
    if (!itemName || itemName === 'Tanımsız Ürün/Hizmet') {
      missingFields.push({
        invoiceId: invoiceId || 'BİLİNMİYOR',
        lineId,
        field: 'Ürün/Hizmet Adı',
        description: `Kalem #${lineId} için Item/Name etiketi boş veya eksik.`,
      });
    }

    // Invoiced Quantity & Unit Code
    const qtyEls = getNSElements(lineEl, UBL_NAMESPACES.CBC, 'InvoicedQuantity');
    const qtyEl = qtyEls.length > 0 ? qtyEls[0] : null;
    const quantity = parseFloat(qtyEl?.textContent?.trim() || '0') || 0;
    const unitCode = qtyEl?.getAttribute('unitCode') || 'ADET';

    // Price Amount
    const priceEl = getNSElements(lineEl, UBL_NAMESPACES.CAC, 'Price')[0] || null;
    const unitPrice = parseFloat(getNSTagText(priceEl, UBL_NAMESPACES.CBC, 'PriceAmount')) || 0;

    // Line Extension Amount
    const lineExtensionAmount = parseFloat(getNSTagText(lineEl, UBL_NAMESPACES.CBC, 'LineExtensionAmount')) || 0;

    // Multiple Taxes Handling (TaxTotal -> TaxSubtotal list)
    const taxTotalEl = getNSElements(lineEl, UBL_NAMESPACES.CAC, 'TaxTotal')[0] || null;
    const taxSubtotalEls = taxTotalEl ? getNSElements(taxTotalEl, UBL_NAMESPACES.CAC, 'TaxSubtotal') : [];

    const taxSubtotals: TaxSubtotalItem[] = [];
    let primaryTaxPercent = 0;
    let totalLineTaxAmount = 0;
    let taxableAmount = lineExtensionAmount;

    if (taxSubtotalEls.length > 0) {
      taxSubtotalEls.forEach((subEl) => {
        const percent = parseFloat(getNSTagText(subEl, UBL_NAMESPACES.CBC, 'Percent')) || 0;
        const subTaxAmount = parseFloat(getNSTagText(subEl, UBL_NAMESPACES.CBC, 'TaxAmount')) || 0;
        const subTaxable = parseFloat(getNSTagText(subEl, UBL_NAMESPACES.CBC, 'TaxableAmount')) || lineExtensionAmount;

        const categoryEl = getNSElements(subEl, UBL_NAMESPACES.CAC, 'TaxCategory')[0] || null;
        const taxName = getNSTagText(categoryEl, UBL_NAMESPACES.CBC, 'Name') || 'KDV';

        if (primaryTaxPercent === 0 && percent > 0) {
          primaryTaxPercent = percent;
        }
        totalLineTaxAmount += subTaxAmount;
        taxableAmount = subTaxable;

        taxSubtotals.push({
          taxName,
          taxableAmount: subTaxable,
          taxAmount: subTaxAmount,
          percent,
        });
      });
    }

    // Consolidated tax details string (e.g. "KDV %20: 300.00 TL | ÖTV %10: 150.00 TL")
    const taxDetails = taxSubtotals.length > 0
      ? taxSubtotals.map((t) => `${t.taxName} %${t.percent}: ${t.taxAmount.toFixed(2)} TL`).join(' | ')
      : `KDV %${primaryTaxPercent}: ${totalLineTaxAmount.toFixed(2)} TL`;

    // Calculation Audit: Check quantity * price = lineExtensionAmount mismatch
    const calculatedTotal = quantity * unitPrice;
    let hasMismatch = false;
    let mismatchReason = '';

    if (quantity > 0 && unitPrice > 0 && Math.abs(calculatedTotal - lineExtensionAmount) > 0.02) {
      hasMismatch = true;
      hasWarnings = true;
      mismatchReason = `Tutarsız hesaplama (Miktar × Fiyat = ${calculatedTotal.toFixed(2)} TL, Satır Tutarı = ${lineExtensionAmount.toFixed(2)} TL)`;
    }

    lineItems.push({
      id: lineId,
      name: itemName,
      quantity,
      unitCode,
      unitPrice,
      lineExtensionAmount,
      taxPercent: primaryTaxPercent,
      taxAmount: totalLineTaxAmount,
      taxableAmount,
      taxDetails,
      taxSubtotals,
      hasMismatch,
      mismatchReason,
    });
  });

  // Top-Level Monetary Audit: Check Allowance / Charge / Prepaid presence
  const allowanceTotalAmountText = getNSTagText(legalMonetaryTotal, UBL_NAMESPACES.CBC, 'AllowanceTotalAmount');
  const chargeTotalAmountText = getNSTagText(legalMonetaryTotal, UBL_NAMESPACES.CBC, 'ChargeTotalAmount');
  const prepaidAmountText = getNSTagText(legalMonetaryTotal, UBL_NAMESPACES.CBC, 'PrepaidAmount');

  const hasSpecialMonetaryAdjustments =
    (allowanceTotalAmountText !== '' && parseFloat(allowanceTotalAmountText) > 0) ||
    (chargeTotalAmountText !== '' && parseFloat(chargeTotalAmountText) > 0) ||
    (prepaidAmountText !== '' && parseFloat(prepaidAmountText) > 0);

  // Determine top-level tax amount
  const rootTaxTotalEls = getNSElements(rootElement, UBL_NAMESPACES.CAC, 'TaxTotal');
  let topTaxAmount = 0;
  if (rootTaxTotalEls.length > 0) {
    topTaxAmount = parseFloat(getNSTagText(rootTaxTotalEls[0], UBL_NAMESPACES.CBC, 'TaxAmount')) || 0;
  }
  if (topTaxAmount === 0 && lineItems.length > 0) {
    topTaxAmount = lineItems.reduce((acc, item) => acc + item.taxAmount, 0);
  }

  if (hasSpecialMonetaryAdjustments) {
    // Discounted / Prepaid Invoice: Only check TaxExclusiveAmount + TaxAmount = TaxInclusiveAmount
    if (taxExclusiveAmount > 0 && taxInclusiveAmount > 0 && Math.abs((taxExclusiveAmount + topTaxAmount) - taxInclusiveAmount) > 0.05) {
      hasWarnings = true;
      missingFields.push({
        invoiceId: invoiceId || 'BİLİNMİYOR',
        field: 'Matrah + Vergi Toplamı Tutarsızlığı',
        description: `Vergi Hariç Tutar (${taxExclusiveAmount.toFixed(2)} TL) + Hesaplanan Vergi (${topTaxAmount.toFixed(2)} TL) != Vergiler Dahil Toplam (${taxInclusiveAmount.toFixed(2)} TL).`,
      });
    }
  } else {
    // Simple Invoice (No Allowance/Charge/Prepaid): Check LineExtensionTotal / TaxExclusive + TaxAmount = PayableAmount
    const baseAmount = taxExclusiveAmount > 0 ? taxExclusiveAmount : lineExtensionTotal;
    const expectedPayable = baseAmount + topTaxAmount;
    if (payableAmount > 0 && Math.abs(expectedPayable - payableAmount) > 0.05) {
      hasWarnings = true;
      missingFields.push({
        invoiceId: invoiceId || 'BİLİNMİYOR',
        field: 'Ödenecek Tutar Tutarsızlığı',
        description: `Hesaplanan Genel Toplam (${expectedPayable.toFixed(2)} TL) ile Faturadaki Ödenecek Tutar (${payableAmount.toFixed(2)} TL) uyuşmuyor.`,
      });
    }
  }

  return {
    fileName,
    invoiceId: invoiceId || 'TANIMSIZ',
    issueDate,
    profileId,
    supplierName: supplier.name || 'TANIMSIZ',
    supplierVkn: supplier.vkn || 'TANIMSIZ',
    supplierVknType: supplier.vknType || 'VKN',
    customerName: customer.name || 'TANIMSIZ',
    customerVkn: customer.vkn || 'TANIMSIZ',
    customerVknType: customer.vknType || 'VKN',
    lineExtensionAmount: lineExtensionTotal,
    taxExclusiveAmount,
    taxInclusiveAmount,
    payableAmount,
    lineItems,
    missingFields,
    hasWarnings,
    isUnsupportedPDF: false,
  };
}

/**
 * Parse multiple XML files and consolidate results into a ParsedResult object.
 */
export function processAllXmlFiles(filesData: { name: string; content: string }[]): ParsedResult {
  const invoices: InvoiceSummary[] = [];
  const allLineItems: ParsedResult['allLineItems'] = [];
  const allMissingFields: MissingField[] = [];
  const unsupportedFiles: string[] = [];

  for (const file of filesData) {
    try {
      const summary = parseUblXml(file.content, file.name);
      
      if (summary.isUnsupportedPDF) {
        unsupportedFiles.push(file.name);
        continue;
      }

      invoices.push(summary);
      allMissingFields.push(...summary.missingFields);

      for (const line of summary.lineItems) {
        allLineItems.push({
          ...line,
          invoiceId: summary.invoiceId,
          supplierName: summary.supplierName,
          supplierVkn: summary.supplierVkn,
          supplierVknType: summary.supplierVknType,
          customerName: summary.customerName,
          customerVkn: summary.customerVkn,
          customerVknType: summary.customerVknType,
          issueDate: summary.issueDate,
        });
      }
    } catch (err) {
      unsupportedFiles.push(file.name);
    }
  }

  return {
    invoices,
    allLineItems,
    allMissingFields,
    unsupportedFiles,
  };
}
