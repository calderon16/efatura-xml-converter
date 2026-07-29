import React, { useEffect, useState } from 'react';
import type { SeoPageConfig } from '../data/seoPages';
import { JsonLdFaq } from '../components/JsonLdFaq';
import { ExcelConverterPage } from './ExcelConverterPage';
import { JsonConverterPage } from './JsonConverterPage';
import { PopularSearches } from '../components/PopularSearches';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

interface SeoLandingPageProps {
  pageConfig: SeoPageConfig;
  onNavigateTool: (tool: 'excel' | 'json') => void;
  onNavigateSlug: (slug: string) => void;
}

export const SeoLandingPage: React.FC<SeoLandingPageProps> = ({
  pageConfig,
  onNavigateTool,
  onNavigateSlug,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Synchronous document head management for SEO title, description, and canonical link
  useEffect(() => {
    document.title = pageConfig.title;

    // Update meta description
    let metaDescEl = document.querySelector('meta[name="description"]');
    if (!metaDescEl) {
      metaDescEl = document.createElement('meta');
      metaDescEl.setAttribute('name', 'description');
      document.head.appendChild(metaDescEl);
    }
    metaDescEl.setAttribute('content', pageConfig.metaDescription);

    // Update canonical link with trailing slash
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
    canonicalEl.setAttribute('href', `${currentOrigin}/${pageConfig.slug}/`);
  }, [pageConfig]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Schema.org FAQPage Structured Data */}
      <JsonLdFaq faqItems={pageConfig.faqItems} />

      {/* SEO Landing Page Custom Hero & Intro */}
      <div className="text-center max-w-4xl my-4 px-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs mb-3 border border-blue-200/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Özel Rehber & Ücretsiz Dönüştürücü</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          {pageConfig.h1}
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-left sm:text-center">
          {pageConfig.introText}
        </p>
      </div>

      {/* Embedded Tool Component (Excel or JSON Converter) */}
      <div className="w-full">
        {pageConfig.targetTool === 'excel' ? (
          <ExcelConverterPage onNavigate={onNavigateTool} />
        ) : (
          <JsonConverterPage onNavigate={onNavigateTool} />
        )}
      </div>

      {/* FAQ Accordion Section for SEO and Users */}
      <section className="w-full max-w-4xl mx-auto my-10 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg md:text-xl font-bold text-slate-900">
              Sıkça Sorulan Sorular (SSS)
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {pageConfig.faqItems.map((faq, idx) => {
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
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Searches Internal Links */}
      <PopularSearches
        currentSlug={pageConfig.slug}
        onNavigateSlug={onNavigateSlug}
      />
    </div>
  );
};
