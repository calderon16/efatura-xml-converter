import React, { useEffect, useState } from 'react';
import type { GuideArticle } from '../data/guides';
import { JsonLdFaq } from '../components/JsonLdFaq';
import { HowToJsonLd } from '../components/HowToJsonLd';
import { PopularSearches } from '../components/PopularSearches';
import { RelatedTools } from '../components/RelatedTools';
import { useTranslation } from '../i18n/LanguageContext';
import {
  Calendar,
  Clock,
  User,
  ChevronRight,
  FileSpreadsheet,
  HelpCircle,
  ChevronDown,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

interface GuideDetailPageProps {
  guide: GuideArticle;
  onNavigateSlug: (slug: string) => void;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({
  guide,
  onNavigateSlug,
}) => {
  const { t, lang } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    document.title = guide.title[lang];

    // Update Meta Description
    let metaDescEl = document.querySelector('meta[name="description"]');
    if (!metaDescEl) {
      metaDescEl = document.createElement('meta');
      metaDescEl.setAttribute('name', 'description');
      document.head.appendChild(metaDescEl);
    }
    metaDescEl.setAttribute('content', guide.metaDescription[lang]);

    // Update OpenGraph Title
    let ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (!ogTitleEl) {
      ogTitleEl = document.createElement('meta');
      ogTitleEl.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleEl);
    }
    ogTitleEl.setAttribute('content', guide.title[lang]);

    // Update OpenGraph Description
    let ogDescEl = document.querySelector('meta[property="og:description"]');
    if (!ogDescEl) {
      ogDescEl = document.createElement('meta');
      ogDescEl.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescEl);
    }
    ogDescEl.setAttribute('content', guide.metaDescription[lang]);

    // Update Canonical Link with trailing slash
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    const currentOrigin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://efatura-xml-converter.calderon-hs91.workers.dev';
    canonicalEl.setAttribute('href', `${currentOrigin}/rehberler/${guide.slug}/`);
  }, [guide, lang]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Convert guide steps to HowTo schema if applicable
  const howToSteps = guide.sections.map((sec) => ({
    name: sec.heading[lang],
    text: sec.paragraphs.map((p) => p[lang]).join(' '),
  }));

  return (
    <article className="w-full flex flex-col items-center">
      {/* Schema.org FAQPage & HowTo Structured Data */}
      {guide.faqItems && <JsonLdFaq faqItems={guide.faqItems} lang={lang} />}
      {guide.slug.includes('nasil-okunur') && (
        <HowToJsonLd
          name={guide.h1[lang]}
          description={guide.metaDescription[lang]}
          steps={howToSteps}
        />
      )}

      {/* Breadcrumb Navigation */}
      <nav className="w-full max-w-4xl mx-auto my-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <button
          onClick={() => onNavigateSlug('')}
          className="hover:text-blue-900 transition-colors"
        >
          {t('guide.breadcrumbHome')}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button
          onClick={() => onNavigateSlug('rehberler')}
          className="hover:text-blue-900 transition-colors"
        >
          {t('guide.breadcrumbGuides')}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-bold truncate max-w-[200px]">
          {guide.h1[lang]}
        </span>
      </nav>

      {/* Article Header & Meta */}
      <header className="w-full max-w-4xl mx-auto my-4 text-left">
        <button
          onClick={() => onNavigateSlug('rehberler')}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-950 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('guide.backToGuides')}</span>
        </button>

        <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          {guide.h1[lang]}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pb-6 border-b border-slate-200">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-blue-900" />
            {guide.author[lang]}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            {guide.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {guide.readTime[lang]}
          </span>
        </div>
      </header>

      {/* Article Content Body */}
      <div className="w-full max-w-4xl mx-auto my-6 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-2xs text-slate-800 leading-relaxed space-y-8">

        {/* Article Summary Lead Box */}
        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-blue-950 font-medium text-sm leading-relaxed">
          <strong>{t('guide.summaryLabel')}</strong> {guide.summary[lang]}
        </div>

        {/* Dynamic Sections */}
        {guide.sections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {section.heading[lang]}
            </h2>
            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {p[lang]}
              </p>
            ))}
          </section>
        ))}

        {/* Natural Call-To-Action (CTA) Box */}
        <div className="mt-10 p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-lg border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-base mb-1">
              {t('guide.ctaTitle')}
            </h3>
            <p className="text-xs text-slate-300">
              {guide.ctaText[lang]}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {guide.ctaTool === 'validator' ? (
              <button
                onClick={() => onNavigateSlug('e-fatura-xml-dogrulama')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('guide.validateXml')}</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigateSlug('')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>{t('validator.convertToExcel')}</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* FAQ Section if guide has FAQs */}
      {guide.faqItems && guide.faqItems.length > 0 && (
        <section className="w-full max-w-4xl mx-auto my-6 px-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-blue-900" />
              <h2 className="font-heading text-lg md:text-xl font-bold text-slate-900">
                {t('guide.faqHeading')}
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {guide.faqItems.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200/80 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      type="button"
                      className="w-full p-4 text-left font-bold text-sm text-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
                    >
                      <span>{faq.question[lang]}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.answer[lang]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Internal Links & Tools */}
      <PopularSearches onNavigateSlug={onNavigateSlug} />
      <RelatedTools onNavigateSlug={onNavigateSlug} />
    </article>
  );
};
