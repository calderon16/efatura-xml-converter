import React from 'react';
import { FileSpreadsheet, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface RelatedToolsProps {
  onNavigateSlug?: (slug: string) => void;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ onNavigateSlug }) => {
  const { t } = useTranslation();

  const goToConverter = () => onNavigateSlug?.('');
  const goToValidator = () => onNavigateSlug?.('e-fatura-xml-dogrulama/');

  return (
    <section className="w-full max-w-5xl mx-auto my-8 px-4">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="text-center sm:text-left mb-6">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            {t('nav.convert')} & {t('nav.validator')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Converter (Invoice + General XML, both modes live here) */}
          <div
            onClick={goToConverter}
            className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-blue-400 hover:bg-slate-800 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors">
                {t('invoice.heroTitle')} {t('invoice.heroTitleAccent')}
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {t('general.heroSubtitle')}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-blue-400 mt-4 group-hover:translate-x-1 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('nav.convert')}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Validator */}
          <div
            onClick={goToValidator}
            className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-emerald-400 hover:bg-slate-800 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                {t('validator.title')}
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {t('validator.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
              <span>{t('nav.validator')}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
