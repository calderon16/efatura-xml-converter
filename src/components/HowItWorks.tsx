import React from 'react';
import { Upload, Cpu, FileSpreadsheet } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          Nasıl Çalışır?
        </h2>
        <p className="text-sm text-slate-500 font-medium mt-1">
          3 Kolay Adımda e-Fatura XML Dosyalarınızı Excel'e Dönüştürün
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Step 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs relative flex flex-col items-center text-center group hover:border-blue-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-1">Adım 1</span>
          <h3 className="text-base font-bold text-slate-800 mb-2">XML Dosyalarını Yükleyin</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Bilgisayarınızdaki tekli veya toplu UBL-TR formatlı e-Fatura veya e-Arşiv XML dosyalarınızı sürükleyip bırakın.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs relative flex flex-col items-center text-center group hover:border-blue-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-1">Adım 2</span>
          <h3 className="text-base font-bold text-slate-800 mb-2">Otomatik Parse & Auditing</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tarayıcınız fatura başlığı, taraf bilgileri ve tüm kalemleri ayrıştırır. Tutar-miktar tutarsızlıkları otomatik sarı ile işaretlenir.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs relative flex flex-col items-center text-center group hover:border-blue-300 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase mb-1">Adım 3</span>
          <h3 className="text-base font-bold text-slate-800 mb-2">Excel (.xlsx) İndirin</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            "Fatura Detayı", "Özet" ve "Eksik Alanlar" sekmelerini içeren, biçimlendirilmiş profesyonel Excel dosyanızı anında indirin.
          </p>
        </div>

      </div>
    </section>
  );
};
