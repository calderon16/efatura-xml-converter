import React, { useState } from 'react';
import type { ParsedResult } from '../types/ubl';
import { getFormattedJsonString, type JsonOutputMode } from '../utils/jsonFormatter';
import { saveOrShareFile } from '../utils/nativeDownload';
import {
  Copy,
  Check,
  Download,
  Code2,
  Layers,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface JsonPreviewProps {
  parsedResult: ParsedResult;
  onReset: () => void;
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ parsedResult, onReset }) => {
  const [mode, setMode] = useState<JsonOutputMode>('nested');
  const [copied, setCopied] = useState(false);

  const jsonString = getFormattedJsonString(parsedResult, mode);
  const totalInvoices = parsedResult.invoices.length;
  const totalLines = parsedResult.allLineItems.length;
  const totalWarnings = parsedResult.allLineItems.filter((i) => i.hasMismatch).length;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    await saveOrShareFile(
      jsonString,
      `eFatura_${mode}_${timestamp}.json`,
      'application/json'
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 flex flex-col gap-6">
      
      {/* Top Banner & Main Developer Controls */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              JSON Hazır
            </span>
            {totalWarnings > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                {totalWarnings} Ulaşılabilir Ulaşım Uyarısı (_warnings)
              </span>
            )}
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            JSON Çıktısı Hazırlandı
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Aşağıdaki önizlemeden formatı seçebilir, panoya kopyalayabilir veya .json dosyası olarak indirebilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onReset}
            type="button"
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeni Yükleme</span>
          </button>

          <button
            onClick={handleCopy}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Kopyalandı ✓' : 'Panoya Kopyala'}</span>
          </button>
          
          <button
            onClick={handleDownload}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>JSON İndir (.json)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Ayrıştırılan Fatura</span>
          <span className="text-2xl font-extrabold text-slate-800">{totalInvoices}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Toplam Kalem Dizi Boyutu</span>
          <span className="text-2xl font-extrabold text-blue-600">{totalLines}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Aktif Format</span>
          <span className="text-sm font-bold text-slate-900 block truncate">
            {mode === 'nested' ? 'Ham / Yapısal (Nested)' : 'Sade / Düz (Flat Array)'}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Tutarsızlık Uyarısı</span>
          <span className={`text-2xl font-extrabold ${totalWarnings > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
            {totalWarnings}
          </span>
        </div>
      </div>

      {/* Mode Switch & JSON Syntax Highlighting Viewer */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
        
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-slate-900/90 border-b border-slate-800 gap-3">
          
          {/* Format Toggle Switch */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setMode('nested')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                mode === 'nested'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Ham / Tam Yapı (Nested JSON)</span>
            </button>
            <button
              onClick={() => setMode('flat')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                mode === 'flat'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sade / Düz Yapı (Flat Array)</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>Encoding: UTF-8</span>
            <span>•</span>
            <span>Size: {(jsonString.length / 1024).toFixed(1)} KB</span>
          </div>
        </div>

        {/* Code Editor Preview Box */}
        <div className="p-4 overflow-x-auto max-h-[550px] font-mono text-xs leading-relaxed text-slate-200 selection:bg-blue-500 selection:text-white">
          <pre className="whitespace-pre">{jsonString}</pre>
        </div>

      </div>

    </div>
  );
};
