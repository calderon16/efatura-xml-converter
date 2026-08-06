import React, { useState, useRef } from 'react';
import { UploadCloud, FileCode, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
// Vite raw import for embedded sample XML asset
import sampleInvoiceXml from '../assets/sample-invoice.xml?raw';

interface FileUploadProps {
  onFilesSelected: (files: { name: string; content: string }[]) => void;
  onError: (errorMessage: string) => void;
  /** Which set of "try a sample" shortcuts to show - the two modes need different sample data. */
  variant?: 'invoice' | 'general';
}

const SAMPLE_GENERIC_XML = `<?xml version="1.0" encoding="UTF-8"?>
<ProductCatalog>
  <Product>
    <Sku>SKU-1001</Sku>
    <Name>Wireless Mouse</Name>
    <Price currency="USD">19.99</Price>
    <Stock>142</Stock>
  </Product>
  <Product>
    <Sku>SKU-1002</Sku>
    <Name>Mechanical Keyboard</Name>
    <Price currency="USD">89.50</Price>
    <Stock>37</Stock>
  </Product>
  <Product>
    <Sku>SKU-1003</Sku>
    <Name>USB-C Hub</Name>
    <Price currency="USD">34.00</Price>
    <Stock>210</Stock>
  </Product>
</ProductCatalog>`;

// TODO: AdMob Interstitial or Banner Ad integration for native mobile app monetization (Capacitor AdMob plugin)
export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, onError, variant = 'invoice' }) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (fileList: FileList | File[]) => {
    const validFiles: File[] = [];
    let hasInvalid = false;
    let hasPdf = false;

    Array.from(fileList).forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'xml') {
        validFiles.push(file);
      } else {
        hasInvalid = true;
        if (extension === 'pdf') {
          hasPdf = true;
        }
      }
    });

    if (hasPdf) {
      onError(t('fileUpload.errorPdfUnsupported'));
      return;
    } else if (hasInvalid) {
      onError(t('fileUpload.errorXmlOnly'));
      return;
    }

    if (validFiles.length === 0) return;

    // Read files as text
    const readPromises = validFiles.map(
      (file) =>
        new Promise<{ name: string; content: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              name: file.name,
              content: e.target?.result as string,
            });
          };
          reader.onerror = () => reject(new Error(`${file.name} ${t('fileUpload.errorReadFailed')}`));
          reader.readAsText(file, 'UTF-8');
        })
    );

    Promise.all(readPromises)
      .then((filesData) => {
        onFilesSelected(filesData);
      })
      .catch((err) => {
        onError(err.message || t('invoice.errorGeneric'));
      });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // 1-Click Embedded Sample Invoice Loader
  const handleLoadSampleAsset = () => {
    onFilesSelected([{ name: 'Ornek_UBL_TR_Fatura.xml', content: sampleInvoiceXml }]);
  };

  // Inconsistent Demo Loader
  const handleLoadInconsistentDemo = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:ProfileID>EARSIVFATURA</cbc:ProfileID>
  <cbc:ID>XYZ2026999999</cbc:ID>
  <cbc:IssueDate>2026-05-10</cbc:IssueDate>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyIdentification><cbc:ID schemeID="VKN">5554443322</cbc:ID></cac:PartyIdentification>
      <cac:PartyName><cbc:Name>TEKNOLOJİ VE YAZILIM A.Ş.</cbc:Name></cac:PartyName>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyIdentification><cbc:ID schemeID="TCKN">98765432109</cbc:ID></cac:PartyIdentification>
      <cac:PartyName><cbc:Name>MEHMET YILMAZ - MÜŞTERİ</cbc:Name></cac:PartyName>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="TRY">2000.00</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="TRY">2000.00</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="TRY">2400.00</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="TRY">2400.00</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  <cac:InvoiceLine>
    <cbc:ID>1</cbc:ID>
    <cbc:InvoicedQuantity unitCode="C62">10</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="TRY">2000.00</cbc:LineExtensionAmount>
    <cac:Item><cbc:Name>YAZILIM LİSANSI (TUTARSIZ KALEM)</cbc:Name></cac:Item>
    <cac:Price><cbc:PriceAmount currencyID="TRY">150.00</cbc:PriceAmount></cac:Price>
    <cac:TaxTotal>
      <cac:TaxSubtotal>
        <cbc:TaxableAmount currencyID="TRY">2000.00</cbc:TaxableAmount>
        <cbc:TaxAmount currencyID="TRY">400.00</cbc:TaxAmount>
        <cbc:Percent>20.00</cbc:Percent>
      </cac:TaxSubtotal>
    </cac:TaxTotal>
  </cac:InvoiceLine>
</Invoice>`;

    onFilesSelected([{ name: 'Örnek_Tutarsız_Fatura.xml', content: xmlContent }]);
  };

  const handleLoadGenericSample = () => {
    onFilesSelected([{ name: 'sample-product-catalog.xml', content: SAMPLE_GENERIC_XML }]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 md:p-12 text-center flex flex-col items-center justify-center group ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01] shadow-lg shadow-emerald-500/10'
            : 'border-blue-200 bg-white hover:border-emerald-400 hover:bg-slate-50/60 shadow-sm'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept=".xml"
          className="hidden"
        />

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 ${
            isDragging ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-900/10 text-blue-900 group-hover:bg-emerald-50 group-hover:text-emerald-600'
          }`}
        >
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="font-heading text-lg md:text-xl font-bold text-slate-800 mb-2">
          {t('fileUpload.title')}
        </h3>

        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          {t('fileUpload.subtitle')} (<code className="px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">.xml</code>)
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 border-t border-white/20"
          >
            <FileCode className="w-4 h-4" />
            <span>{t('fileUpload.selectButton')}</span>
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{t('fileUpload.multipleFilesNote')}</span>
        </div>
      </div>

      {/* Embedded Sample Test Bar */}
      <div className="mt-4 p-4 bg-slate-100/80 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-medium">{t('fileUpload.tryPrompt')}</span>
        </div>
        <div className="flex items-center gap-2">
          {variant === 'general' ? (
            <button
              onClick={handleLoadGenericSample}
              type="button"
              className="px-3.5 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{t('fileUpload.tryGenericSample')}</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleLoadSampleAsset}
                type="button"
                className="px-3.5 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{t('fileUpload.tryInvoiceSample')}</span>
              </button>
              <button
                onClick={handleLoadInconsistentDemo}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-medium hover:bg-amber-100 transition-colors shadow-xs"
              >
                {t('fileUpload.tryMismatchSample')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
