import React, { useState } from 'react';
import type { ParsedResult } from '../types/ubl';
import { exportToExcel } from '../utils/excelGenerator';
import {
  Download,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Info,
  Layers,
  FileText,
} from 'lucide-react';

interface InvoicePreviewTableProps {
  parsedResult: ParsedResult;
  onReset: () => void;
}

export const InvoicePreviewTable: React.FC<InvoicePreviewTableProps> = ({
  parsedResult,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'lines' | 'summary' | 'missing'>('lines');
  const [isExporting, setIsExporting] = useState(false);

  const totalInvoices = parsedResult.invoices.length;
  const totalLines = parsedResult.allLineItems.length;
  const totalPayableSum = parsedResult.invoices.reduce((acc, inv) => acc + inv.payableAmount, 0);
  const totalWarnings = parsedResult.allLineItems.filter((i) => i.hasMismatch).length;
  const totalMissingFields = parsedResult.allMissingFields.length;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportToExcel(parsedResult);
    } catch (err) {
      alert('Excel dosyası oluşturulurken bir hata meydana geldi.');
    } finally {
      setIsExporting(false);
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
              Başarıyla Ayrıştırıldı
            </span>
            {parsedResult.unsupportedFiles.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                {parsedResult.unsupportedFiles.length} Dosya Atlandı
              </span>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">
            Dönüştürme Tamamlandı
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Sonuçları aşağıdaki sekmelerden inceleyebilir, ardından Excel (.xlsx) dosyanızı indirebilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onReset}
            type="button"
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeni Yükleme</span>
          </button>
          
          <button
            onClick={handleExport}
            disabled={isExporting}
            type="button"
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Hazırlanıyor...' : 'Excel İndir (.xlsx)'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Fatura Sayısı</span>
          <span className="text-2xl font-extrabold text-slate-800">{totalInvoices}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Toplam Kalem Satırı</span>
          <span className="text-2xl font-extrabold text-blue-600">{totalLines}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Ödenecek Genel Toplam</span>
          <span className="text-xl font-extrabold text-slate-900">
            {totalPayableSum.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Hesap Uyarısı</span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-extrabold ${totalWarnings > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              {totalWarnings}
            </span>
            {totalWarnings > 0 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                Sarı İşaretlendi
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
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Fatura Detayı ({totalLines} Kalem)</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'summary'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Özet ({totalInvoices} Fatura)</span>
          </button>

          <button
            onClick={() => setActiveTab('missing')}
            className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'missing'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Eksik Alanlar ({totalMissingFields})</span>
          </button>
        </div>

        {/* Tab 1: Fatura Detayı (Kalemler) */}
        {activeTab === 'lines' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="p-3">Fatura No</th>
                  <th className="p-3">Tarih</th>
                  <th className="p-3">Satıcı Ünvanı / VKN</th>
                  <th className="p-3">Alıcı Ünvanı / VKN</th>
                  <th className="p-3">Kalem No</th>
                  <th className="p-3">Ürün / Hizmet Adı</th>
                  <th className="p-3 text-right">Miktar</th>
                  <th className="p-3">Birim</th>
                  <th className="p-3 text-right">Birim Fiyat</th>
                  <th className="p-3 text-right">Satır Tutarı</th>
                  <th className="p-3">Vergi Detayı</th>
                  <th className="p-3">Uyarı / Not</th>
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

        {/* Tab 2: Özet (Fatura Başına Tek Satır) */}
        {activeTab === 'summary' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="p-3">Dosya Adı</th>
                  <th className="p-3">Fatura No</th>
                  <th className="p-3">Tarih</th>
                  <th className="p-3">Fatura Tipi</th>
                  <th className="p-3">Satıcı Ünvanı / VKN</th>
                  <th className="p-3">Alıcı Ünvanı / VKN</th>
                  <th className="p-3 text-right">Mal/Hizmet Tutarı</th>
                  <th className="p-3 text-right">Matrah</th>
                  <th className="p-3 text-right">Genel Ödenecek</th>
                  <th className="p-3">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedResult.invoices.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{inv.fileName}</td>
                    <td className="p-3 font-bold text-blue-700">{inv.invoiceId}</td>
                    <td className="p-3 whitespace-nowrap">{inv.issueDate}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {inv.profileId || 'STANDART'}
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
                          <AlertTriangle className="w-3 h-3" /> Uyarı Var
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Tam Uyumlu
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Eksik Alanlar */}
        {activeTab === 'missing' && (
          <div className="p-6">
            {parsedResult.allMissingFields.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-700">Tüm Zorunlu Alanlar Eksiksiz</p>
                <p className="text-xs">Yüklenen hiçbir XML dosyasında eksik zorunlu alana rastlanmadı.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Fatura No</th>
                      <th className="p-3">Kalem No</th>
                      <th className="p-3">Eksik Alan</th>
                      <th className="p-3">Açıklama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedResult.allMissingFields.map((mf, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-700">{mf.invoiceId}</td>
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
