import React, { useState, useEffect } from 'react';
import { DocumentUpload } from '../components/DocumentUpload';
import { GenericPreviewTable } from '../components/GenericPreviewTable';
import { ProcessingState } from '../components/ProcessingState';
import { readXlsxToTabularData } from '../utils/xlsxReader';
import { extractPdfPages, pdfPagesToTabularData } from '../utils/pdfReader';
import { exportPagesToDocx } from '../utils/docxWriter';
import { convertDocxToPdf } from '../utils/docxToPdf';
import type { TabularData } from '../types/generic';
import { useTranslation } from '../i18n/LanguageContext';
import { Sparkles, AlertCircle, FileType2, Loader2, RotateCcw, Download } from 'lucide-react';

// .xlsx and .pdf are read into the same schema-agnostic TabularData the XML converter uses (PDF:
// one row per page of extracted text — extraction-based, not table reconstruction; scanned/
// image-only PDFs with no text layer are explicitly unsupported). .docx doesn't fit that
// table-shaped flow — it converts directly to PDF via its own single-action panel below.
const ACCEPTED_EXTENSIONS = ['xlsx', 'pdf', 'docx'];

export const DocumentConverter: React.FC = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tableResult, setTableResult] = useState<TabularData | null>(null);
  const [pdfPages, setPdfPages] = useState<string[] | null>(null);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [docxFile, setDocxFile] = useState<File | null>(null);
  const [isConvertingDocx, setIsConvertingDocx] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = t('document.metaTitle');
  }, [t]);

  const handleFileSelected = (selected: File) => {
    setErrorMessage(null);
    const extension = selected.name.split('.').pop()?.toLowerCase();
    if (extension === 'docx') {
      setDocxFile(selected);
      return;
    }
    setFile(selected);
    setIsProcessing(true);
  };

  const handleConvertDocx = async () => {
    if (!docxFile) return;
    setIsConvertingDocx(true);
    try {
      const baseName = docxFile.name.replace(/\.[^.]+$/, '');
      await convertDocxToPdf(docxFile, `${baseName}.pdf`);
    } catch {
      setErrorMessage(t('document.errorReadFailed'));
    } finally {
      setIsConvertingDocx(false);
    }
  };

  const handleProcessingComplete = async () => {
    if (!file) return;
    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      let result: TabularData | null = null;
      let extractedPages: string[] | null = null;

      if (extension === 'xlsx') {
        result = await readXlsxToTabularData(file);
      } else if (extension === 'pdf') {
        extractedPages = await extractPdfPages(file);
        result = pdfPagesToTabularData(extractedPages, file.name);
      }

      if (!result || result.headers.length === 0) {
        const isScannedPdf = extension === 'pdf' && result?.unsupportedFiles.length === 1;
        setErrorMessage(isScannedPdf ? t('document.errorNoTextLayer') : t('document.errorReadFailed'));
        setIsProcessing(false);
        return;
      }

      setTableResult(result);
      setPdfPages(extension === 'pdf' ? extractedPages : null);
      setIsProcessing(false);
    } catch {
      setErrorMessage(t('document.errorReadFailed'));
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setIsProcessing(false);
    setTableResult(null);
    setPdfPages(null);
    setDocxFile(null);
    setErrorMessage(null);
  };

  const handleExportDocx = async () => {
    if (!file || !pdfPages) return;
    setIsExportingDocx(true);
    try {
      const baseName = file.name.replace(/\.[^.]+$/, '');
      await exportPagesToDocx(pdfPages, `${baseName}.docx`);
    } catch {
      setErrorMessage(t('document.errorReadFailed'));
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero */}
      {!tableResult && !isProcessing && !docxFile && (
        <div className="text-center max-w-3xl my-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 font-semibold text-xs mb-3 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-900" />
            <span>{t('document.heroBadge')}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('document.heroTitle')} <br className="hidden sm:inline" />
            <span className="gradient-text">{t('document.heroTitleAccent')}</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            {t('document.heroSubtitle')}
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
      {!tableResult && !isProcessing && !docxFile && (
        <DocumentUpload
          accept=".xlsx,.pdf,.docx"
          acceptedExtensions={ACCEPTED_EXTENSIONS}
          onFileSelected={handleFileSelected}
          onError={(msg) => setErrorMessage(msg)}
        />
      )}

      {/* Processing State */}
      {isProcessing && file && (
        <ProcessingState fileCount={1} onComplete={handleProcessingComplete} />
      )}

      {/* Word -> PDF: single-action panel, doesn't fit the table-shaped flow above */}
      {docxFile && (
        <div className="w-full max-w-3xl mx-auto my-6 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
              <FileType2 className="w-7 h-7 text-blue-900" />
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h3 className="font-heading text-base font-bold text-slate-800 truncate">{docxFile.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{(docxFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={handleReset}
              type="button"
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors flex items-center gap-2 shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('document.newUpload')}</span>
            </button>
          </div>

          <button
            onClick={handleConvertDocx}
            disabled={isConvertingDocx}
            type="button"
            className="w-full px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 border-t border-white/20"
          >
            {isConvertingDocx ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('image.converting')}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t('document.convertToPdf')}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Result Table + Export */}
      {!isProcessing && tableResult && (
        <>
          <GenericPreviewTable data={tableResult} onReset={handleReset} />
          {pdfPages && (
            <div className="w-full max-w-6xl mx-auto -mt-4 mb-6 flex justify-center">
              <button
                onClick={handleExportDocx}
                disabled={isExportingDocx}
                type="button"
                className="px-4 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-950 disabled:opacity-60 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 border-t border-white/20"
              >
                {isExportingDocx ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileType2 className="w-4 h-4" />
                )}
                <span>{t('document.downloadWord')}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
