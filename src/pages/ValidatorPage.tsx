import React, { useState, useEffect } from 'react';
import { FileUpload } from '../components/FileUpload';
import { processAllXmlFiles } from '../utils/xmlParser';
import type { ParsedResult } from '../types/ubl';
import { SoftwareAppJsonLd } from '../components/SoftwareAppJsonLd';
import { RelatedTools } from '../components/RelatedTools';
import { PopularSearches } from '../components/PopularSearches';
import { useTranslation } from '../i18n/LanguageContext';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  RotateCcw,
  FileSpreadsheet,
} from 'lucide-react';

interface ValidatorPageProps {
  onNavigateSlug?: (slug: string) => void;
}

export const ValidatorPage: React.FC<ValidatorPageProps> = ({ onNavigateSlug }) => {
  const { t, lang } = useTranslation();
  const [parsedResult, setParsedResult] = useState<ParsedResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = t('validator.metaTitle');
  }, [lang, t]);

  const handleFilesSelected = (files: { name: string; content: string }[]) => {
    setErrorMessage(null);
    try {
      const result = processAllXmlFiles(files);
      setParsedResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || t('invoice.errorGeneric'));
    }
  };

  const handleReset = () => {
    setParsedResult(null);
    setErrorMessage(null);
  };

  const missingCount = parsedResult?.allMissingFields.length ?? 0;
  const mismatchCount = parsedResult?.allLineItems.filter((i) => i.hasMismatch).length ?? 0;

  return (
    <div className="w-full flex flex-col items-center">
      <SoftwareAppJsonLd
        name={t('validator.title')}
        description={t('validator.metaDescription')}
        url="https://schemaflowapp.com/e-fatura-xml-dogrulama"
      />

      {/* Hero Badge */}
      {!parsedResult && (
        <div className="text-center max-w-3xl my-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs mb-3 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('validator.badge')}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('validator.title')}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            {t('validator.subtitle')}
          </p>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="w-full max-w-3xl my-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-sm">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">{t('validator.failedTitle')}</strong>
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
                  {t('validator.completed')}
                </span>
              </div>
              <h2 className="font-heading text-xl font-extrabold tracking-tight">
                {t('validator.invoicesChecked', { count: parsedResult.invoices.length })}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {t('validator.checklistHint')}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleReset}
                type="button"
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('preview.newUpload')}</span>
              </button>

              <button
                onClick={() => onNavigateSlug?.('')}
                type="button"
                className="px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{t('validator.convertToExcel')}</span>
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
                <h3 className="font-bold text-slate-800 text-sm mb-1">{t('validator.rule1Title')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t('validator.rule1DescOk')}</p>
              </div>
            </div>

            {/* Rule 2: UBL-TR Namespace */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{t('validator.rule2Title')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{t('validator.rule2DescOk')}</p>
              </div>
            </div>

            {/* Rule 3: Mandatory Fields */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-4">
              {missingCount === 0 ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{t('validator.rule3Title')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {missingCount === 0 ? t('validator.rule3DescOk') : t('validator.rule3DescFail', { count: missingCount })}
                </p>
              </div>
            </div>

            {/* Rule 4: Calculation Audit */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-4">
              {mismatchCount === 0 ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{t('validator.rule4Title')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {mismatchCount === 0 ? t('validator.rule4DescOk') : t('validator.rule4DescFail', { count: mismatchCount })}
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Conversion CTA Banner */}
          <div className="p-6 bg-blue-50/80 rounded-2xl border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                {t('preview.completedTitle')}
              </h4>
              <p className="text-xs text-slate-600">
                {t('preview.completedSubtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigateSlug?.('')}
                type="button"
                className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{t('validator.convertToExcel')}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Internal Link Network */}
      <PopularSearches onNavigateSlug={onNavigateSlug} />

      {/* Related Tools Cross-links */}
      <RelatedTools onNavigateSlug={onNavigateSlug} />
    </div>
  );
};
