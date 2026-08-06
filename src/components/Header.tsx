import React from 'react';
import { FileSpreadsheet, ShieldCheck, BookOpen, FileCheck2, Languages, ImageIcon, FileText } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface HeaderProps {
  currentPath?: string;
  onNavigateSlug?: (slug: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath = '/',
  onNavigateSlug,
}) => {
  const { t, lang, setLang } = useTranslation();
  const isValidator = currentPath.includes('dogrulama');
  const isGuides = currentPath.includes('rehberler');
  const isImage = currentPath.includes('image-converter');
  const isDocument = currentPath.includes('document-converter');
  const isConvert = !isValidator && !isGuides && !isImage && !isDocument;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigateSlug?.('')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold text-blue-900 tracking-tight">
                {t('header.brandName')}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900/10 text-blue-900 border border-blue-900/20">
                {t('header.brandBadge')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {t('header.tagline')}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold gap-0.5">
          <button
            onClick={() => onNavigateSlug?.('')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              isConvert
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t('nav.convert')}</span>
          </button>

          <button
            onClick={() => onNavigateSlug?.('image-converter')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              isImage
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t('nav.images')}</span>
          </button>

          <button
            onClick={() => onNavigateSlug?.('document-converter')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              isDocument
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t('nav.documents')}</span>
          </button>

          <button
            onClick={() => onNavigateSlug?.('e-fatura-xml-dogrulama')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              isValidator
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>{t('nav.validator')}</span>
          </button>

          <button
            onClick={() => onNavigateSlug?.('rehberler')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              isGuides
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('nav.guides')}</span>
          </button>
        </div>

        {/* Language toggle + KVKK / Security Badge */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}
            type="button"
            title={lang === 'en' ? 'Türkçe' : 'English'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-bold hover:bg-slate-200 transition-colors"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{t('header.langToggle')}</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('header.secureBadge')}</span>
          </div>
        </div>

      </div>
    </header>
  );
};
