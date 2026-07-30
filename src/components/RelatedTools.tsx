import React from 'react';
import { FileSpreadsheet, Code2, ShieldCheck, ArrowRight } from 'lucide-react';

interface RelatedToolsProps {
  currentTool: 'excel' | 'json';
  onNavigate: (tool: 'excel' | 'json') => void;
  onNavigateSlug?: (slug: string) => void;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({
  currentTool,
  onNavigate,
  onNavigateSlug,
}) => {
  const handleValidatorClick = () => {
    if (onNavigateSlug) {
      onNavigateSlug('e-fatura-xml-dogrulama/');
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/e-fatura-xml-dogrulama/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto my-8 px-4">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="text-center sm:text-left mb-6">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            İlgili e-Fatura Araçları
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            İhtiyacınıza Uygun e-Fatura Çözümünü Seçin
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Excel Tool */}
          <div
            onClick={() => onNavigate('excel')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
              currentTool === 'excel'
                ? 'bg-blue-600/20 border-blue-500 shadow-md'
                : 'bg-slate-800/60 border-slate-700 hover:border-blue-400 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors">
                e-Fatura XML → Excel
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Muhasebeciler ve finans analistleri için 3 sekmeli Excel (.xlsx) dönüştürücü.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-blue-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>{currentTool === 'excel' ? 'Mevcut Araç' : 'Araca Git'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: JSON Tool */}
          <div
            onClick={() => onNavigate('json')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
              currentTool === 'json'
                ? 'bg-blue-600/20 border-blue-500 shadow-md'
                : 'bg-slate-800/60 border-slate-700 hover:border-blue-400 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center mb-3">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                e-Fatura XML → JSON
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Geliştiriciler ve Zapier/Make otomasyonları için Nested veya Flat JSON çıktısı.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>{currentTool === 'json' ? 'Mevcut Araç' : 'Araca Git'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Validator Tool */}
          <div
            onClick={handleValidatorClick}
            className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-emerald-400 hover:bg-slate-800 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                e-Fatura XML Doğrulayıcı
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                UBL-TR 2.1 şema, zorunlu alan ve Miktar × Fiyat hesaplama denetimi.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>Doğrulayıcıyı Aç</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
