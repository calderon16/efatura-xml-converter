import React, { useState, useEffect } from 'react';
import { FileUpload } from '../components/FileUpload';
import { processAllXmlFiles } from '../utils/xmlParser';
import type { ParsedResult } from '../types/ubl';
import { SoftwareAppJsonLd } from '../components/SoftwareAppJsonLd';
import { RelatedTools } from '../components/RelatedTools';
import { PopularSearches } from '../components/PopularSearches';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  RotateCcw,
  FileSpreadsheet,
  Code2,
} from 'lucide-react';

interface ValidatorPageProps {
  onNavigate: (tool: 'excel' | 'json') => void;
  onNavigateSlug?: (slug: string) => void;
}

export const ValidatorPage: React.FC<ValidatorPageProps> = ({ onNavigate, onNavigateSlug }) => {
  const [parsedResult, setParsedResult] = useState<ParsedResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'e-Fatura XML Doğrulama — Ücretsiz UBL-TR Kontrol Aracı';
  }, []);

  const handleFilesSelected = (files: { name: string; content: string }[]) => {
    setErrorMessage(null);
    try {
      const result = processAllXmlFiles(files);
      setParsedResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'XML doğrulama esnasında bir hata oluştu.');
    }
  };

  const handleReset = () => {
    setParsedResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <SoftwareAppJsonLd
        name="e-Fatura XML Doğrulayıcı"
        description="e-Fatura ve e-Arşiv UBL-TR XML dosyalarınızı şema, zorunlu alanlar ve tutar hesaplama yönünden ücretsiz doğrulayın."
        url="https://efatura-xml-converter.calderon-hs91.workers.dev/e-fatura-xml-dogrulama"
      />

      {/* Hero Badge */}
      {!parsedResult && (
        <div className="text-center max-w-3xl my-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs mb-3 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>%100 İstemci Tarafında Şema & Tutar Denetimi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            e-Fatura XML <span className="text-emerald-600">Doğrulayıcı (Validator)</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            UBL-TR 2.1 şeması, zorunlu etiket varlıkları, TCKN/VKN formatı ve Miktar × Fiyat tutarlılığını anında denetleyin.
          </p>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="w-full max-w-3xl my-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-sm">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">Doğrulama Başarısız:</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Upload Zone when no result */}
      {!parsedResult && (
        <FileUpload
          onFilesSelected={handleFilesSelected}
          onError={(msg) => setErrorMessage(msg)}
        />
      )}

      {/* Validation Checklist Results View */}
      {parsedResult && (
        <div className="w-full max-w-4xl my-6 flex flex-col gap-6">
          
          {/* Header Action Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Doğrulama Tamamlandı
                </span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">
                {parsedResult.invoices.length} Adet Fatura Denetlendi
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Aşağıdaki denetim maddelerinden dosya geçerliliğini ve tutarlılığını inceleyebilirsiniz.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleReset}
                type="button"
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yeni Yükleme</span>
              </button>

              <button
                onClick={() => onNavigate('excel')}
                type="button"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel'e Dönüştür</span>
              </button>
            </div>
          </div>

          {/* Interactive Checklist Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Rule 1: XML Well-Formed */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">
                  1. XML Syntax ve Well-Formed Yapısı
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  XML dosyaları DOMParser tarafından hatasız okundu. Kapatılmamış etiket veya syntax hatası tespit edilmedi.
                </p>
              </div>
            </div>

            {/* Rule 2: UBL-TR Namespace */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">
                  2. UBL-TR 2.1 Resmi Namespace Tanımları
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  GİB UBL-TR Invoice, CommonBasicComponents (cbc) ve CommonAggregateComponents (cac) namespace URI tanımları tam uyumlu.
                </p>
              </div>
            </div>

            {/* Rule 3: Mandatory Fields */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-4">
              {parsedResult.allMissingFields.length === 0 ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">
                  3. Zorunlu Başlık & Taraf Alanları
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {parsedResult.allMissingFields.length === 0
                    ? 'Fatura No, Tarih, Satıcı/Alıcı Ünvanı ve VKN/TCKN bilgileri tam ve eksiksiz.'
                    : `${parsedResult.allMissingFields.length} adet eksik alan tespit edildi.`}
                </p>
              </div>
            </div>

            {/* Rule 4: Calculation Audit */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-4">
              {parsedResult.allLineItems.filter((i) => i.hasMismatch).length === 0 ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">
                  4. Miktar × Fiyat Satır Tutarı Denetimi
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {parsedResult.allLineItems.filter((i) => i.hasMismatch).length === 0
                    ? 'Tüm faturalardaki Miktar × Birim Fiyat tutarları Satır Tutarları ile tam tutarlı.'
                    : `${parsedResult.allLineItems.filter((i) => i.hasMismatch).length} adet kalemde tutarsız hesaplama tespit edildi.`}
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Conversion CTA Banner */}
          <div className="p-6 bg-blue-50/80 rounded-2xl border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                Doğrulama Tamamlandı! Şimdi İhtiyacınıza Göre Dönüştürün
              </h4>
              <p className="text-xs text-slate-600">
                Doğruladığınız dosyaları doğrudan Excel tablosuna veya entegrasyonlar için JSON nesnesine aktarabilirsiniz.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('excel')}
                type="button"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => onNavigate('json')}
                type="button"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Code2 className="w-4 h-4" />
                <span>JSON (.json)</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Internal Link Network */}
      <PopularSearches onNavigateSlug={onNavigateSlug} />

      {/* Related Tools Cross-links */}
      <RelatedTools currentTool="excel" onNavigate={onNavigate} />
    </div>
  );
};
