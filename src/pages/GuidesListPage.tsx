import React, { useEffect } from 'react';
import { GUIDES } from '../data/guides';
import { SoftwareAppJsonLd } from '../components/SoftwareAppJsonLd';
import { RelatedTools } from '../components/RelatedTools';
import { PopularSearches } from '../components/PopularSearches';
import { useTranslation } from '../i18n/LanguageContext';
import { BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';

interface GuidesListPageProps {
  onNavigateSlug: (slug: string) => void;
}

export const GuidesListPage: React.FC<GuidesListPageProps> = ({
  onNavigateSlug,
}) => {
  const { t, lang } = useTranslation();

  useEffect(() => {
    document.title =
      lang === 'tr'
        ? 'e-Fatura Rehberleri ve Kılavuzlar — Mevzuat, UBL-TR & Dönüştürme'
        : 'e-Fatura Guides and How-Tos — Regulations, UBL-TR & Conversion';
  }, [lang]);

  return (
    <div className="w-full flex flex-col items-center">
      <SoftwareAppJsonLd
        name={lang === 'tr' ? 'e-Fatura Rehberleri ve Kılavuzlar' : 'e-Fatura Guides and How-Tos'}
        description={
          lang === 'tr'
            ? 'e-Fatura, e-Arşiv, UBL-TR şema yapısı ve 2026 GİB mevzuatı hakkında güncel rehber makaleleri.'
            : "Up-to-date guide articles on e-Fatura, e-Arşiv, UBL-TR schema structure, and 2026 GİB regulations."
        }
        url="https://schemaflowapp.com/rehberler"
      />

      {/* Hero */}
      <div className="text-center max-w-3xl my-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-900 font-semibold text-xs mb-3 border border-blue-200">
          <BookOpen className="w-3.5 h-3.5 text-blue-900" />
          <span>{t('guides.badge')}</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {t('guides.heroTitle')} <span className="gradient-text">{t('guides.heroTitleAccent')}</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          {t('guides.heroSubtitle')}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="w-full max-w-5xl my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDES.map((guide) => (
          <article
            key={guide.slug}
            onClick={() => onNavigateSlug(`rehberler/${guide.slug}`)}
            className="cursor-pointer bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:border-blue-300 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-900" />
                  {guide.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {guide.readTime[lang]}
                </span>
              </div>

              <h2 className="font-heading text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug mb-3">
                {guide.h1[lang]}
              </h2>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-6">
                {guide.summary[lang]}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-blue-900 group-hover:translate-x-1 transition-transform">
              <span>{t('guides.readArticle')}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </article>
        ))}
      </div>

      {/* Internal Links & Tools */}
      <PopularSearches onNavigateSlug={onNavigateSlug} />
      <RelatedTools onNavigateSlug={onNavigateSlug} />
    </div>
  );
};
