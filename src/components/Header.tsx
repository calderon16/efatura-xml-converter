import React from 'react';
import { FileSpreadsheet, Code2, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentTool: 'excel' | 'json';
  onNavigate: (tool: 'excel' | 'json') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTool, onNavigate }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            {currentTool === 'excel' ? (
              <FileSpreadsheet className="w-6 h-6" />
            ) : (
              <Code2 className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                e-Fatura <span className="text-blue-600 font-semibold">XML → {currentTool === 'excel' ? 'Excel' : 'JSON'}</span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                UBL-TR
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Türkiye Standartlarında e-Fatura & e-Arşiv Dönüştürücü Platformu
            </p>
          </div>
        </div>

        {/* Tool Switch Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => onNavigate('excel')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTool === 'excel'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => onNavigate('json')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTool === 'json'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JSON (.json)</span>
          </button>
        </div>

        {/* KVKK / Security Badge */}
        <div className="hidden lg:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>%100 Tarayıcı İçi (KVKK Uyumlu)</span>
          </div>
        </div>

      </div>
    </header>
  );
};
