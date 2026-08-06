import React, { useState } from 'react';
import type { TabularData } from '../types/generic';
import { exportGenericTableToExcel } from '../utils/excelGenerator';
import { exportToCsv } from '../utils/csvGenerator';
import { exportToPdf } from '../utils/pdfGenerator';
import { useTranslation } from '../i18n/LanguageContext';
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  FileType2,
} from 'lucide-react';

interface GenericPreviewTableProps {
  data: TabularData;
  onReset: () => void;
}

type ExportKind = 'excel' | 'csv' | 'pdf' | null;

export const GenericPreviewTable: React.FC<GenericPreviewTableProps> = ({ data, onReset }) => {
  const { t } = useTranslation();
  const [exporting, setExporting] = useState<ExportKind>(null);

  const timestamp = new Date().toISOString().slice(0, 10);

  const handleExport = async (kind: Exclude<ExportKind, null>) => {
    try {
      setExporting(kind);
      if (kind === 'excel') {
        await exportGenericTableToExcel(data, `SchemaFlow_Export_${timestamp}.xlsx`);
      } else if (kind === 'csv') {
        await exportToCsv(data, `SchemaFlow_Export_${timestamp}.csv`);
      } else {
        await exportToPdf(data, 'SchemaFlow Export', `SchemaFlow_Export_${timestamp}.pdf`);
      }
    } catch {
      // Export failures surface as a disabled/idle button state rather than a thrown error -
      // matches InvoicePreviewTable's existing alert() fallback for the equivalent Excel case.
      alert('Export failed. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 flex flex-col gap-6">
      {/* Top Banner & Primary Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              {t('preview.parsedSuccessfully')}
            </span>
            {data.unsupportedFiles.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                {t('preview.filesSkipped', { count: data.unsupportedFiles.length })}
              </span>
            )}
          </div>
          <h2 className="font-heading text-xl font-extrabold text-slate-800">
            {t('preview.completedTitle')}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t('preview.completedSubtitle')}
          </p>
          {data.recordElementName && (
            <p className="text-xs text-slate-400 font-mono mt-1">
              {t('general.detectedRecord')} <span className="text-slate-600">&lt;{data.recordElementName}&gt;</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={onReset}
            type="button"
            className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('preview.newUpload')}</span>
          </button>

          <button
            onClick={() => handleExport('excel')}
            disabled={exporting !== null}
            type="button"
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 border-t border-white/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{exporting === 'excel' ? t('preview.preparing') : t('preview.downloadExcel')}</span>
          </button>

          <button
            onClick={() => handleExport('csv')}
            disabled={exporting !== null}
            type="button"
            className="px-4 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>{exporting === 'csv' ? t('preview.preparing') : t('preview.downloadCsv')}</span>
          </button>

          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting !== null}
            type="button"
            className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <FileType2 className="w-4 h-4" />
            <span>{exporting === 'pdf' ? t('preview.preparing') : t('preview.downloadPdf')}</span>
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">{t('preview.kpiRowCount')}</span>
          <span className="text-2xl font-extrabold text-blue-900">{data.rows.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">{t('preview.kpiColumns')}</span>
          <span className="text-2xl font-extrabold text-slate-800">{data.headers.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-slate-400 block mb-1">{t('general.detectedRecord')}</span>
          <span className="text-sm font-bold text-slate-900 block truncate font-mono">
            {data.recordElementName ? `<${data.recordElementName}>` : '—'}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 bg-slate-100/70 border-b border-slate-200 text-xs font-semibold text-slate-600">
          {t('preview.tabData', { count: data.rows.length })}
        </div>
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                {data.headers.map((h) => (
                  <th key={h} className="p-3 whitespace-nowrap font-mono">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 whitespace-nowrap">{cell || <span className="text-slate-300">—</span>}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
