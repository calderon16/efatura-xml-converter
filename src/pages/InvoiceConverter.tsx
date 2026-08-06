import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { ProcessingState } from '../components/ProcessingState';
import { InvoicePreviewTable } from '../components/InvoicePreviewTable';
import { HowItWorks } from '../components/HowItWorks';
import { processAllXmlFiles } from '../utils/xmlParser';
import type { ParsedResult } from '../types/ubl';
import { useTranslation } from '../i18n/LanguageContext';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const InvoiceConverter: React.FC = () => {
  const { t } = useTranslation();
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
      setErrorMessage(err.message || t('invoice.errorGeneric'));
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
      {/* Hero Badge */}
      {!parsedResult && !isProcessing && (
        <div className="text-center max-w-3xl my-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 font-semibold text-xs mb-3 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
            <span>{t('invoice.heroBadge')}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('invoice.heroTitle')} <br className="hidden sm:inline" />
            <span className="gradient-text">{t('invoice.heroTitleAccent')}</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            {t('invoice.heroSubtitle')}
          </p>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="w-full max-w-3xl my-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">{t('invoice.errorTitle')}</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      {!parsedResult && !isProcessing && (
        <FileUpload
          onFilesSelected={handleFilesSelected}
          onError={(msg) => setErrorMessage(msg)}
        />
      )}

      {/* Processing State with realistic delay */}
      {isProcessing && rawFiles && (
        <ProcessingState
          fileCount={rawFiles.length}
          onComplete={handleProcessingComplete}
        />
      )}

      {/* Invoice Data Preview Table */}
      {!isProcessing && parsedResult && (
        <InvoicePreviewTable
          parsedResult={parsedResult}
          onReset={handleReset}
        />
      )}

      {/* 3-Step How It Works (visible on home upload state) */}
      {!parsedResult && !isProcessing && <HowItWorks />}
    </div>
  );
};
