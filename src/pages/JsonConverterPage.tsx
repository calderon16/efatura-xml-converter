import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { ProcessingState } from '../components/ProcessingState';
import { JsonPreview } from '../components/JsonPreview';
import { RelatedTools } from '../components/RelatedTools';
import { processAllXmlFiles } from '../utils/xmlParser';
import type { ParsedResult } from '../types/ubl';
import { AlertCircle, Code2, GitFork, Terminal } from 'lucide-react';

interface JsonConverterPageProps {
  onNavigate: (tool: 'excel' | 'json') => void;
}

export const JsonConverterPage: React.FC<JsonConverterPageProps> = ({ onNavigate }) => {
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
      {/* Developer Hero Badge */}
      {!parsedResult && !isProcessing && (
        <div className="text-center max-w-3xl my-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-blue-400 font-mono text-xs mb-3 border border-slate-800">
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer Tool / UBL-TR JSON Parser</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            e-Fatura (UBL-TR) XML → <span className="gradient-text">JSON Dönüştürücü</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Yazılımcılar, entegratörler ve Zapier / Make / n8n otomasyonları için UBL-TR XML faturalarını anında yapısal (Nested) veya düz (Flat Array) JSON formatına dönüştürün.
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

      {/* Dynamic Views: Upload -> Processing -> JSON Preview */}
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
        <JsonPreview
          parsedResult={parsedResult}
          onReset={handleReset}
        />
      )}

      {/* Developer Integration / API Open-Source Note */}
      <div className="w-full max-w-4xl my-8 p-5 rounded-2xl bg-slate-900 text-slate-300 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 font-mono">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-0.5">
              API & Script Entegrasyon Notu
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Bu aracı kendi script'lerinizde otomatikleştirmek isterseniz, aynı parser mantığını{' '}
              <a
                href="#github-placeholder"
                onClick={(e) => e.preventDefault()}
                className="text-blue-400 underline hover:text-blue-300 font-mono"
              >
                [GitHub Repository Placeholder]
              </a>{' '}
              üzerinden açık kaynak olarak inceleyebilirsiniz.
            </p>
          </div>
        </div>

        {/* 
          TODO: Open source GitHub repo URL placeholder for future developer trust building 
          Example: https://github.com/your-org/ubl-tr-xml-parser
        */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-mono text-[11px] shrink-0 border border-slate-700">
          <GitFork className="w-3.5 h-3.5 text-blue-400" />
          <span>v1.0.0 Open-Parser</span>
        </div>
      </div>

      {/* Cross-linking Related Tools Block */}
      <RelatedTools currentTool="json" onNavigate={onNavigate} />
    </div>
  );
};
