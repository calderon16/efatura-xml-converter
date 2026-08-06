import React from 'react';
import { Upload, Cpu, FileSpreadsheet } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full max-w-5xl mx-auto my-12 px-4">
      <div className="text-center mb-8">
        <h2 className="font-heading text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('howItWorks.title')}
        </h2>
        <p className="text-sm text-slate-500 font-medium mt-1">
          {t('howItWorks.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Step 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs relative flex flex-col items-center text-center group hover:border-blue-300 hover:shadow-card transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-900/10 text-blue-900 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-blue-900 tracking-wider uppercase mb-1">{t('howItWorks.step1Label')}</span>
          <h3 className="text-base font-bold text-slate-800 mb-2">{t('howItWorks.step1Title')}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('howItWorks.step1Desc')}
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs relative flex flex-col items-center text-center group hover:border-blue-300 hover:shadow-card transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-1">{t('howItWorks.step2Label')}</span>
          <h3 className="text-base font-bold text-slate-800 mb-2">{t('howItWorks.step2Title')}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('howItWorks.step2Desc')}
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs relative flex flex-col items-center text-center group hover:border-emerald-300 hover:shadow-card transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase mb-1">{t('howItWorks.step3Label')}</span>
          <h3 className="text-base font-bold text-slate-800 mb-2">{t('howItWorks.step3Title')}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('howItWorks.step3Desc')}
          </p>
        </div>

      </div>
    </section>
  );
};
