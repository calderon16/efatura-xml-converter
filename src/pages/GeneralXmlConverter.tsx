import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { ProcessingState } from '../components/ProcessingState';
import { GenericPreviewTable } from '../components/GenericPreviewTable';
import { flattenXmlFiles } from '../utils/genericXmlFlattener';
import type { TabularData } from '../types/generic';
import { useTranslation } from '../i18n/LanguageContext';
import { Sparkles, AlertCircle } from 'lucide-react';

export const GeneralXmlConverter: React.FC = () => {
  const { t } = useTranslation();
  const [rawFiles, setRawFiles] = useState<{ name: string; content: string }[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tableResult, setTableResult] = useState<TabularData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilesSelected = (files: { name: string; content: string }[]) => {
    setErrorMessage(null);
    setRawFiles(files);
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    if (!rawFiles) return;

    const result = flattenXmlFiles(rawFiles);
    if (result.headers.length === 0) {
      setErrorMessage(
        result.unsupportedFiles.length === rawFiles.length
          ? t('general.errorParseFailed')
          : t('general.errorNoRecords')
      );
      setIsProcessing(false);
      return;
    }

    setTableResult(result);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setRawFiles(null);
    setIsProcessing(false);
    setTableResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Badge */}
      {!tableResult && !isProcessing && (
        <div className="text-center max-w-3xl my-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 font-semibold text-xs mb-3 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            <span>{t('general.heroBadge')}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('general.heroTitle')} <br className="hidden sm:inline" />
            <span className="gradient-text">{t('general.heroTitleAccent')}</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            {t('general.heroSubtitle')}
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
      {!tableResult && !isProcessing && (
        <FileUpload
          variant="general"
          onFilesSelected={handleFilesSelected}
          onError={(msg) => setErrorMessage(msg)}
        />
      )}

      {/* Processing State */}
      {isProcessing && rawFiles && (
        <ProcessingState
          fileCount={rawFiles.length}
          onComplete={handleProcessingComplete}
        />
      )}

      {/* Flattened Table Preview */}
      {!isProcessing && tableResult && (
        <GenericPreviewTable data={tableResult} onReset={handleReset} />
      )}
    </div>
  );
};
