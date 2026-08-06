import React, { useState } from 'react';
import type { ParsedResult } from '../types/ubl';
import type { TabularData } from '../types/generic';
import { exportToExcel } from '../utils/excelGenerator';
import { exportToCsv } from '../utils/csvGenerator';
import { exportToPdf } from '../utils/pdfGenerator';
import { useTranslation } from '../i18n/LanguageContext';
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Info,
  Layers,
  FileText,
  FileSpreadsheet,
  FileType2,
} from 'lucide-react';

interface InvoicePreviewTableProps {
  parsedResult: ParsedResult;
  onReset: () => void;
}

type ExportKind = 'excel' | 'csv' | 'pdf' | null;

function toTabularData(parsedResult: ParsedResult, t: (key: string) => string): TabularData {
  const headers = [
    t('table.invoiceNo'), t('table.date'), t('table.supplier'), t('table.customer'),
    t('table.lineNo'), t('table.itemName'), t('table.quantity'), t('table.unit'),
    t('table.unitPrice'), t('table.lineAmount'), t('table.taxDetail'), t('table.warningNote'),
  ];
  const rows = parsedResult.allLineItems.map((item) => [
    item.invoiceId,
    item.issueDate,
    `${item.supplierName} (${item.supplierVknType}: ${item.supplierVkn})`,
    `${item.customerName} (${item.customerVknType}: ${item.customerVkn})`,
    item.id,
    item.name,
    item.quantity,
    item.unitCode,
    item.unitPrice,
    item.lineExtensionAmount,
    item.taxDetails,
    item.hasMismatch ? item.mismatchReason || '' : '',
  ]);
  return { headers, rows, unsupportedFiles: parsedResult.unsupportedFiles };
}

export const InvoicePreviewTable: React.FC<InvoicePreviewTableProps> = ({
  parsedResult,
  onReset,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'lines' | 'summary' | 'missing'>('lines');
  const [exporting, setExporting] = useState<ExportKind>(null);

  const totalInvoices = parsedResult.invoices.length;
  const totalLines = parsedResult.allLineItems.length;
  const totalPayableSum = parsedResult.invoices.reduce((acc, inv) => acc + inv.payableAmount, 0);
  const totalWarnings = parsedResult.allLineItems.filter((i) => i.hasMismatch).length;
  const totalMissingFields = parsedResult.allMissingFields.length;
  const timestamp = new Date().toISOString().slice(0, 10);

  const handleExport = async (kind: Exclude<ExportKind, null>) => {
    try {
      setExporting(kind);
      if (kind === 'excel') {
        await exportToExcel(parsedResult);
      } else if (kind === 'csv') {
        await exportToCsv(toTabularData(parsedResult, t), `eFatura_${timestamp}.csv`);
      } else {
        await exportToPdf(toTabularData(parsedResult, t), 'e-Fatura Export', `eFatura_${timestamp}.pdf`);
      }
    } catch {
      alert('Export failed. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 flex flex-col gap-6">

      {/* Top Banner & Primary Action Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              {t('preview.parsedSuccessfully')}
            </span>
            {parsedResult.unsupportedFiles.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                {t('preview.filesSkipped', { count: parsedResult.unsupportedFiles.length })}
              </span>
            )}
          </div>
          <h2 className="font-heading text-xl font-extrabold text-slate-800">
            {t('preview.completedTitle')}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t('preview.completedSubtitle')}
          </p>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">{t('preview.kpiInvoiceCount')}</span>
          <span className="text-2xl font-extrabold text-slate-800">{totalInvoices}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">{t('preview.kpiLineCount')}</span>
          <span className="text-2xl font-extrabold text-blue-900">{totalLines}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">{t('preview.kpiTotalPayable')}</span>
          <span className="text-xl font-extrabold text-slate-900">
            {totalPayableSum.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">{t('preview.kpiWarnings')}</span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-extrabold ${totalWarnings > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              {totalWarnings}
            </span>
            {totalWarnings > 0 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                {t('preview.markedYellow')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs & Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100/70 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('lines')}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'lines'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t('preview.tabDetail', { count: totalLines })}</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'summary'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t('preview.tabSummary', { count: totalInvoices })}</span>
          </button>

          <button
            onClick={() => setActiveTab('missing')}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'missing'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>{t('preview.tabMissing', { count: totalMissingFields })}</span>
          </button>
        </div>

        {/* Tab 1: Line items */}
        {activeTab === 'lines' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="p-3">{t('table.invoiceNo')}</th>
                  <th className="p-3">{t('table.date')}</th>
                  <th className="p-3">{t('table.supplier')}</th>
                  <th className="p-3">{t('table.customer')}</th>
                  <th className="p-3">{t('table.lineNo')}</th>
                  <th className="p-3">{t('table.itemName')}</th>
                  <th className="p-3 text-right">{t('table.quantity')}</th>
                  <th className="p-3">{t('table.unit')}</th>
                  <th className="p-3 text-right">{t('table.unitPrice')}</th>
                  <th className="p-3 text-right">{t('table.lineAmount')}</th>
                  <th className="p-3">{t('table.taxDetail')}</th>
                  <th className="p-3">{t('table.warningNote')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedResult.allLineItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      item.hasMismatch
                        ? 'bg-amber-100/90 text-amber-950 font-medium hover:bg-amber-200/90'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-3 font-bold">{item.invoiceId}</td>
                    <td className="p-3 whitespace-nowrap">{item.issueDate}</td>
                    <td className="p-3 max-w-[170px]">
                      <div className="font-semibold truncate">{item.supplierName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.supplierVknType}: {item.supplierVkn}</div>
                    </td>
                    <td className="p-3 max-w-[170px]">
                      <div className="font-semibold truncate">{item.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.customerVknType}: {item.customerVkn}</div>
                    </td>
                    <td className="p-3 font-semibold">{item.id}</td>
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-right font-mono">{item.quantity.toLocaleString('tr-TR')}</td>
                    <td className="p-3">{item.unitCode}</td>
                    <td className="p-3 text-right font-mono">
                      {item.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </td>
                    <td className="p-3 text-right font-mono font-bold">
                      {item.lineExtensionAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </td>
                    <td className="p-3 whitespace-nowrap font-medium text-slate-700">
                      {item.taxDetails}
                    </td>
                    <td className="p-3">
                      {item.hasMismatch ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-amber-200 text-amber-900 font-bold border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                          <span>{item.mismatchReason}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Per-invoice summary */}
        {activeTab === 'summary' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="p-3">{t('table.fileName')}</th>
                  <th className="p-3">{t('table.invoiceNo')}</th>
                  <th className="p-3">{t('table.date')}</th>
                  <th className="p-3">{t('table.invoiceType')}</th>
                  <th className="p-3">{t('table.supplier')}</th>
                  <th className="p-3">{t('table.customer')}</th>
                  <th className="p-3 text-right">{t('table.goodsAmount')}</th>
                  <th className="p-3 text-right">{t('table.taxBase')}</th>
                  <th className="p-3 text-right">{t('table.totalPayable')}</th>
                  <th className="p-3">{t('table.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedResult.invoices.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{inv.fileName}</td>
                    <td className="p-3 font-bold text-blue-900">{inv.invoiceId}</td>
                    <td className="p-3 whitespace-nowrap">{inv.issueDate}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {inv.profileId || 'STANDARD'}
                      </span>
                    </td>
                    <td className="p-3 font-medium">
                      <div>{inv.supplierName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{inv.supplierVknType}: {inv.supplierVkn}</div>
                    </td>
                    <td className="p-3 font-medium">
                      <div>{inv.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{inv.customerVknType}: {inv.customerVkn}</div>
                    </td>
                    <td className="p-3 text-right font-mono">
                      {inv.lineExtensionAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </td>
                    <td className="p-3 text-right font-mono">
                      {inv.taxExclusiveAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {inv.payableAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </td>
                    <td className="p-3">
                      {inv.hasWarnings ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> {t('table.statusWarning')}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> {t('table.statusOk')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Missing fields */}
        {activeTab === 'missing' && (
          <div className="p-6">
            {parsedResult.allMissingFields.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-700">{t('preview.noMissingFieldsTitle')}</p>
                <p className="text-xs">{t('preview.noMissingFieldsSubtitle')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">{t('table.missingInvoiceNo')}</th>
                      <th className="p-3">{t('table.missingLineNo')}</th>
                      <th className="p-3">{t('table.missingFieldName')}</th>
                      <th className="p-3">{t('table.missingDescription')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedResult.allMissingFields.map((mf, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-900">{mf.invoiceId}</td>
                        <td className="p-3 font-mono">{mf.lineId || '-'}</td>
                        <td className="p-3 font-semibold text-rose-700">{mf.field}</td>
                        <td className="p-3 text-slate-600">{mf.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
