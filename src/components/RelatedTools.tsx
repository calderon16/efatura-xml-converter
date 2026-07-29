import React from 'react';
import { FileSpreadsheet, Code2, ArrowRight } from 'lucide-react';

interface RelatedToolsProps {
  currentTool: 'excel' | 'json';
  onNavigate: (tool: 'excel' | 'json') => void;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ currentTool, onNavigate }) => {
  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4">
      <div className="border-t border-slate-200 pt-8">
        <h3 className="text-lg font-extrabold text-slate-900 mb-1">
          İlgili Dönüştürücü Araçları
        </h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          İhtiyacınıza uygun diğer çıktı formatlarını keşfedin
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Excel Converter Card */}
          <div
            onClick={() => onNavigate('excel')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-4 group ${
              currentTool === 'excel'
                ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    e-Fatura XML → Excel Dönüştürücü
                  </h4>
                  {currentTool === 'excel' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      Şu An Açık
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Muhasebeciler ve finans ekipleri için 3 sekmeli biçimlendirilmiş .xlsx çıktısı.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </div>

          {/* JSON Converter Card */}
          <div
            onClick={() => onNavigate('json')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-4 group ${
              currentTool === 'json'
                ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    e-Fatura XML → JSON Dönüştürücü
                  </h4>
                  {currentTool === 'json' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      Şu An Açık
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Yazılımcılar ve Zapier/Make otomasyon entegrasyonları için yapısal & düz JSON çıktısı.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </div>
        </div>
      </div>
    </section>
  );
};
