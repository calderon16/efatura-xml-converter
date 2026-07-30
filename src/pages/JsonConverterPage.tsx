import React, { useState, useEffect } from 'react';
import { FileUpload } from '../components/FileUpload';
import { ProcessingState } from '../components/ProcessingState';
import { JsonPreview } from '../components/JsonPreview';
import { RelatedTools } from '../components/RelatedTools';
import { PopularSearches } from '../components/PopularSearches';
import { processAllXmlFiles } from '../utils/xmlParser';
import type { ParsedResult } from '../types/ubl';
import { Code2, AlertCircle } from 'lucide-react';

interface JsonConverterPageProps {
  onNavigate: (tool: 'excel' | 'json') => void;
  onNavigateSlug?: (slug: string) => void;
}

export const JsonConverterPage: React.FC<JsonConverterPageProps> = ({
  onNavigate,
  onNavigateSlug,
}) => {
  const [rawFiles, setRawFiles] = useState<{ name: string; content: string }[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'e-Fatura XML JSON Dönüştürücü — UBL-TR Parser & API Entegrasyon';
  }, []);

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
      setErrorMessage(err.message || 'XML dosyaları dönüştürülürken bir hata oluştu.');
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
      {/* Hero Badge for Developers */}
      {!parsedResult && !isProcessing && (
        <div className="text-center max-w-3xl my-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900 text-slate-200 font-semibold text-xs mb-3 border border-slate-800 shadow-xs">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>Geliştiriciler & Otomasyon Ekipleri İçin UBL-TR Parser</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            e-Fatura XML Dosyalarınızı <br className="hidden sm:inline" />
            <span className="gradient-text">JSON Formatına Dönüştürün</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            ERP entegrasyonu yapan yazılımcılar ve Zapier/Make/n8n otomasyonları için UBL-TR verisini
            anında Yapısal (Nested) veya Düz (Flat Array) JSON nesnelerine çevirin.
          </p>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="w-full max-w-3xl my-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">İşlem Başarısız:</strong>
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

      {/* Processing State */}
      {isProcessing && rawFiles && (
        <ProcessingState
          fileCount={rawFiles.length}
          onComplete={handleProcessingComplete}
        />
      )}

      {/* JSON Preview & Format Toggle Section */}
      {!isProcessing && parsedResult && (
        <JsonPreview
          parsedResult={parsedResult}
          onReset={handleReset}
        />
      )}

      {/* Internal Link Network */}
      <PopularSearches onNavigateSlug={onNavigateSlug} />

      {/* Cross-linking Related Tools Block */}
      <RelatedTools currentTool="json" onNavigate={onNavigate} onNavigateSlug={onNavigateSlug} />
    </div>
  );
};
