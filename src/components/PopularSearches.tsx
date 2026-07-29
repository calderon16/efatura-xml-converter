import React from 'react';
import { SEO_PAGES } from '../data/seoPages';
import { GUIDES } from '../data/guides';
import { Compass, ArrowRight, BookOpen } from 'lucide-react';

interface PopularSearchesProps {
  currentSlug?: string;
  onNavigateSlug?: (slug: string) => void;
}

export const PopularSearches: React.FC<PopularSearchesProps> = ({
  currentSlug,
  onNavigateSlug,
}) => {
  return (
    <section className="w-full max-w-5xl mx-auto my-10 px-4">
      <div className="bg-slate-100/70 p-6 md:p-8 rounded-3xl border border-slate-200/80 space-y-6">
        
        {/* SEO Landing Pages Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <h3 className="text-base md:text-lg font-extrabold text-slate-900">
              Popüler e-Fatura Rehberleri ve Aramaları
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4 font-medium">
            İhtiyacınıza uygun spesifik aktarım ve raporlama sayfalarımızdan birini seçin:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SEO_PAGES.map((page) => {
              const isActive = currentSlug === page.slug;
              return (
                <button
                  key={page.slug}
                  onClick={() => onNavigateSlug?.(page.slug)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-2 group ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                      : 'bg-white text-slate-700 border-slate-200/80 hover:border-blue-400 hover:shadow-xs'
                  }`}
                >
                  <span className="text-xs font-semibold line-clamp-1">
                    {page.h1}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Blog & Guides Articles Internal Links Section */}
        <div className="pt-4 border-t border-slate-200/80">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h4 className="text-base font-extrabold text-slate-900">
              Mevzuat ve Kullanım Kılavuzları
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {GUIDES.map((guide) => (
              <button
                key={guide.slug}
                onClick={() => onNavigateSlug?.(`rehberler/${guide.slug}`)}
                className="p-3 rounded-xl bg-white border border-slate-200/80 text-left hover:border-emerald-500 transition-all flex items-center justify-between gap-2 group"
              >
                <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-700 line-clamp-1">
                  {guide.h1}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
