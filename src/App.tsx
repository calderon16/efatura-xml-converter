import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SEO_PAGES } from './data/seoPages';
import { GUIDES } from './data/guides';
import { SoftwareAppJsonLd } from './components/SoftwareAppJsonLd';
import { HowToJsonLd } from './components/HowToJsonLd';
import { FileQuestion, Loader2 } from 'lucide-react';

// Code Splitting — Lazy Load Pages
const ExcelConverterPage = lazy(() =>
  import('./pages/ExcelConverterPage').then((m) => ({ default: m.ExcelConverterPage }))
);
const JsonConverterPage = lazy(() =>
  import('./pages/JsonConverterPage').then((m) => ({ default: m.JsonConverterPage }))
);
const ValidatorPage = lazy(() =>
  import('./pages/ValidatorPage').then((m) => ({ default: m.ValidatorPage }))
);
const GuidesListPage = lazy(() =>
  import('./pages/GuidesListPage').then((m) => ({ default: m.GuidesListPage }))
);
const GuideDetailPage = lazy(() =>
  import('./pages/GuideDetailPage').then((m) => ({ default: m.GuideDetailPage }))
);
const SeoLandingPage = lazy(() =>
  import('./pages/SeoLandingPage').then((m) => ({ default: m.SeoLandingPage }))
);

export function App() {
  const [pathname, setPathname] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigatePath = (path: string) => {
    const targetPath = path.startsWith('/') ? path : `/${path}`;
    setPathname(targetPath);
    window.history.pushState({}, '', targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTool = (tool: 'excel' | 'json') => {
    const path = tool === 'json' ? '/xml-to-json/' : '/xml-to-excel/';
    navigatePath(path);
  };

  const handleNavigateSlug = (slug: string) => {
    navigatePath(slug);
  };

  // Route Matching Logic
  const normalizedPath = decodeURIComponent(pathname).replace(/^\//, '').replace(/\/$/, '');
  
  // 1. Check Validator Route
  const isValidatorRoute = normalizedPath === 'e-fatura-xml-dogrulama';

  // 2. Check Guides List Route
  const isGuidesListRoute = normalizedPath === 'rehberler';

  // 3. Check Guide Detail Route (/rehberler/:slug)
  const isGuideDetailMatch = normalizedPath.startsWith('rehberler/');
  const guideSlug = isGuideDetailMatch ? normalizedPath.replace(/^rehberler\//, '') : '';
  const matchedGuide = GUIDES.find((g) => g.slug === guideSlug);

  // 4. Check SEO Landing Page Route
  const matchedSeoPage = SEO_PAGES.find((p) => p.slug === normalizedPath);

  // 5. Determine active tool type for Header
  const isJsonTool = normalizedPath.includes('json') || matchedSeoPage?.targetTool === 'json';
  const currentToolType: 'excel' | 'json' = isJsonTool ? 'json' : 'excel';

  // 6. Check 404
  const isHomeOrExcel = normalizedPath === '' || normalizedPath === 'xml-to-excel';
  const isJsonRoute = normalizedPath === 'xml-to-json';

  const is404 =
    !isHomeOrExcel &&
    !isJsonRoute &&
    !isValidatorRoute &&
    !isGuidesListRoute &&
    !matchedGuide &&
    !matchedSeoPage;

  // HowTo Steps for How-to Excel Page
  const howToExcelSteps = [
    { name: 'XML Dosyasını Hazırlayın', text: 'GİB veya entegratörden indirdiğiniz .xml fatura dosyasını masaüstünüze çıkarın.' },
    { name: 'Dönüştürücüye Sürükleyin', text: 'Dosyaları sürükle-bırak alanına bırakın veya Dosya Seç butonuyla yükleyin.' },
    { name: 'Excel İndir Butonuna Basın', text: '3 sekmeli Excel (.xlsx) dosyasını tek tıkla bilgisayarınıza indirin.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Schema.org SoftwareApplication for main converter tools */}
      {(isHomeOrExcel || isJsonRoute) && (
        <SoftwareAppJsonLd
          name={`e-Fatura UBL-TR XML → ${isJsonRoute ? 'JSON' : 'Excel'} Dönüştürücü`}
          description="UBL-TR formatındaki e-Fatura ve e-Arşiv XML dosyalarınızı tarayıcı içinde %100 güvenli, ücretsiz ve anında dönüştürün."
          url={`https://efatura-xml-converter.calderon-hs91.workers.dev${pathname}`}
        />
      )}

      {/* Schema.org HowTo for how-to-excel page */}
      {normalizedPath === 'e-fatura-excele-nasil-aktarilir' && (
        <HowToJsonLd
          name="e-Fatura XML Dosyaları Excel Tablosuna Nasıl Aktarılır?"
          description="GİB portalından indirilen e-Fatura XML dosyalarını 3 adımda Excel'e aktarın."
          steps={howToExcelSteps}
        />
      )}

      {/* App Header */}
      <Header
        currentPath={pathname}
        currentTool={currentToolType}
        onNavigate={handleNavigateTool}
        onNavigateSlug={handleNavigateSlug}
      />

      {/* Main Container with Suspense fallback loading indicator */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense
          fallback={
            <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-xs font-semibold">Sayfa yükleniyor...</span>
            </div>
          }
        >
          {isValidatorRoute ? (
            <ValidatorPage
              onNavigate={handleNavigateTool}
              onNavigateSlug={handleNavigateSlug}
            />
          ) : isGuidesListRoute ? (
            <GuidesListPage
              onNavigateSlug={handleNavigateSlug}
              onNavigateTool={handleNavigateTool}
            />
          ) : matchedGuide ? (
            <GuideDetailPage
              guide={matchedGuide}
              onNavigateTool={handleNavigateTool}
              onNavigateSlug={handleNavigateSlug}
            />
          ) : matchedSeoPage ? (
            <SeoLandingPage
              pageConfig={matchedSeoPage}
              onNavigateTool={handleNavigateTool}
              onNavigateSlug={handleNavigateSlug}
            />
          ) : is404 ? (
            <div className="w-full max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
              <FileQuestion className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                Sayfa Bulunamadı (404)
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Aradığınız sayfa veya rehber mevcut değil.
              </p>
              <button
                onClick={() => navigatePath('/')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          ) : currentToolType === 'json' ? (
            <JsonConverterPage
              onNavigate={handleNavigateTool}
              onNavigateSlug={handleNavigateSlug}
            />
          ) : (
            <ExcelConverterPage
              onNavigate={handleNavigateTool}
              onNavigateSlug={handleNavigateSlug}
            />
          )}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
