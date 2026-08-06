import React from 'react';
import { FileCheck2, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export type ConverterMode = 'invoice' | 'general';

interface ModeToggleProps {
  mode: ConverterMode;
  onChange: (mode: ConverterMode) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
      <button
        onClick={() => onChange('invoice')}
        type="button"
        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
          mode === 'invoice'
            ? 'bg-blue-900 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <FileCheck2 className="w-3.5 h-3.5" />
        <span>{t('modeToggle.invoice')}</span>
      </button>
      <button
        onClick={() => onChange('general')}
        type="button"
        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
          mode === 'general'
            ? 'bg-blue-900 text-white shadow-md'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{t('modeToggle.general')}</span>
      </button>
    </div>
  );
};
