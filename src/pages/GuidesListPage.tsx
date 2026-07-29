import React, { useEffect } from 'react';
import { GUIDES } from '../data/guides';
import { SoftwareAppJsonLd } from '../components/SoftwareAppJsonLd';
import { RelatedTools } from '../components/RelatedTools';
import { PopularSearches } from '../components/PopularSearches';
import { BookOpen, Clock, Calendar, ArrowRight } from 'lucide-react';

interface GuidesListPageProps {
  onNavigateSlug: (slug: string) => void;
  onNavigateTool: (tool: 'excel' | 'json') => void;
}

export const GuidesListPage: React.FC<GuidesListPageProps> = ({
  onNavigateSlug,
  onNavigateTool,
}) => {
  useEffect(() => {
    document.title = 'e-Fatura Rehberleri ve Kılavuzlar — Mevzuat, UBL-TR & Dönüştürme';
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <SoftwareAppJsonLd
        name="e-Fatura Rehberleri ve Kılavuzlar"
        description="e-Fatura, e-Arşiv, UBL-TR şema yapısı ve 2026 GİB mevzuatı hakkında güncel rehber makaleleri."
        url="https://efatura-xml-converter.calderon-hs91.workers.dev/rehberler"
      />

      {/* Hero */}
      <div className="text-center max-w-3xl my-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs mb-3 border border-blue-200">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Bilgi Merkezi & Rehberler</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          e-Fatura & UBL-TR <span className="gradient-text">Rehber ve Kılavuzlar</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          Mevzuat değişiklikleri, UBL-TR şema yapısı, e-Fatura vs e-Arşiv farkları ve pratik kullanım rehberleri.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="w-full max-w-5xl my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDES.map((guide) => (
          <article
            key={guide.slug}
            onClick={() => onNavigateSlug(`rehberler/${guide.slug}`)}
            className="cursor-pointer bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  {guide.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {guide.readTime}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3">
                {guide.h1}
              </h2>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-6">
                {guide.summary}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Makaleyi Oku</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </article>
        ))}
      </div>

      {/* Internal Links & Tools */}
      <PopularSearches onNavigateSlug={onNavigateSlug} />
      <RelatedTools currentTool="excel" onNavigate={onNavigateTool} />
    </div>
  );
};
