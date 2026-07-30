import React, { useState, useRef } from 'react';
import { UploadCloud, FileCode, Sparkles, CheckCircle2 } from 'lucide-react';
// Vite raw import for embedded sample XML asset
import sampleInvoiceXml from '../assets/sample-invoice.xml?raw';

interface FileUploadProps {
  onFilesSelected: (files: { name: string; content: string }[]) => void;
  onError: (errorMessage: string) => void;
}

// TODO: AdMob Interstitial or Banner Ad integration for native mobile app monetization (Capacitor AdMob plugin)
export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, onError }) => {
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
      onError('Bu dosya türü şu an desteklenmiyor (PDF içine gömülü UBL-TR XML e-Arşiv senaryosu v1 sürümünde desteklenmemektedir). Lütfen doğrudan .xml uzantılı dosyaları yükleyin.');
      return;
    } else if (hasInvalid) {
      onError('Yalnızca .xml uzantılı e-Fatura dosyaları kabul edilmektedir. Lütfen doğru formatta dosya seçiniz.');
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
          reader.onerror = () => reject(new Error(`${file.name} okunamadı.`));
          reader.readAsText(file, 'UTF-8');
        })
    );

    Promise.all(readPromises)
      .then((filesData) => {
        onFilesSelected(filesData);
      })
      .catch((err) => {
        onError(err.message || 'Dosyalar okunurken bir hata oluştu.');
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

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 md:p-12 text-center flex flex-col items-center justify-center ${
          isDragging
            ? 'border-blue-500 bg-blue-50/80 scale-[1.01] shadow-lg shadow-blue-500/10'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50/60 shadow-sm'
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

        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
          e-Fatura XML Dosyalarınızı Buraya Sürükleyin veya Seçin
        </h3>
        
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          UBL-TR formatındaki tekli veya toplu <code className="px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">.xml</code> dosyalarını anında Excel tablosuna dönüştürün.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <FileCode className="w-4 h-4" />
            <span>Dosya Seç</span>
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Birden fazla dosya yüklenebilir (Toplu Dönüştürme)</span>
        </div>
      </div>

      {/* Embedded Sample Test Bar */}
      <div className="mt-4 p-4 bg-slate-100/80 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-medium">Kendi faturanızı yüklemeden test etmek ister misiniz?</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSampleAsset}
            type="button"
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Örnek Fatura ile Dene</span>
          </button>
          <button
            onClick={handleLoadInconsistentDemo}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-medium hover:bg-amber-100 transition-colors shadow-xs"
          >
            Hesap Uyarısı Testi
          </button>
        </div>
      </div>
    </div>
  );
};
