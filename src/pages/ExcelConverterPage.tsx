import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { ProcessingState } from '../components/ProcessingState';
import { InvoicePreviewTable } from '../components/InvoicePreviewTable';
import { HowItWorks } from '../components/HowItWorks';
import { RelatedTools } from '../components/RelatedTools';
import { processAllXmlFiles } from '../utils/xmlParser';
import type { ParsedResult } from '../types/ubl';
import { AlertCircle } from 'lucide-react';

interface ExcelConverterPageProps {
  onNavigate: (tool: 'excel' | 'json') => void;
}

export const ExcelConverterPage: React.FC<ExcelConverterPageProps> = ({ onNavigate }) => {
  const [rawFiles, setRawFiles] = useState<{ name: string; content: string }[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilesSelected = (files: { name: string; content: string }[]) => {
    setErrorMessage(null);
    setRawFiles(files);
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    if (!rawFiles) return;

    try {
      const result = processAllXmlFiles(rawFiles);
      setParsedResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'XML dosyaları işlenirken bilinmeyen bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setRawFiles(null);
    setIsProcessing(false);
    setParsedResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Intro Hero */}
      {!parsedResult && !isProcessing && (
        <div className="text-center max-w-3xl my-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            e-Fatura (UBL-TR) XML Dosyalarınızı <br className="hidden sm:inline" />
            <span className="gradient-text">Excel'e Dönüştürün</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Tamamen ücretsiz, kayıt gerektirmeyen ve doğrudan bilgisayarınızda çalışan hızlı dönüştürücü.
            Sunucuya hiçbir veri yüklenmez, dosyalarınız %100 gizli ve güvende kalır.
          </p>
        </div>
      )}

      {/* Error Alert Message */}
      {errorMessage && (
        <div className="w-full max-w-3xl my-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-sm animate-pulse-subtle">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">İşlem Durduruldu:</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Dynamic Views: Upload -> Processing -> Preview */}
      {!isProcessing && !parsedResult && (
        <FileUpload
          onFilesSelected={handleFilesSelected}
          onError={(msg) => setErrorMessage(msg)}
        />
      )}

      {isProcessing && rawFiles && (
        <ProcessingState
          fileCount={rawFiles.length}
          onComplete={handleProcessingComplete}
        />
      )}

      {!isProcessing && parsedResult && (
        <InvoicePreviewTable
          parsedResult={parsedResult}
          onReset={handleReset}
        />
      )}

      {/* 3-Step How It Works (visible on home upload state) */}
      {!parsedResult && !isProcessing && <HowItWorks />}

      {/* Cross-linking Related Tools Block */}
      <RelatedTools currentTool="excel" onNavigate={onNavigate} />
    </div>
  );
};
