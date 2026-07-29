import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ExcelConverterPage } from './pages/ExcelConverterPage';
import { JsonConverterPage } from './pages/JsonConverterPage';
import { SeoLandingPage } from './pages/SeoLandingPage';
import { SEO_PAGES } from './data/seoPages';
import { FileQuestion } from 'lucide-react';

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
    setPathname(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTool = (tool: 'excel' | 'json') => {
    const path = tool === 'json' ? '/xml-to-json' : '/xml-to-excel';
    navigatePath(path);
  };

  const handleNavigateSlug = (slug: string) => {
    navigatePath(`/${slug}`);
  };

  // Determine current route target
  const currentSlug = pathname.replace(/^\//, '');
  const matchedSeoPage = SEO_PAGES.find((p) => p.slug === currentSlug);

  const isJsonTool = pathname.includes('json') || matchedSeoPage?.targetTool === 'json';
  const currentToolType: 'excel' | 'json' = isJsonTool ? 'json' : 'excel';

  // Fallback 404 check
  const is404 =
    pathname !== '/' &&
    pathname !== '/xml-to-excel' &&
    pathname !== '/xml-to-json' &&
    !matchedSeoPage;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* App Header with tool switcher */}
      <Header currentTool={currentToolType} onNavigate={handleNavigateTool} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {matchedSeoPage ? (
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
              Aradığınız SEO rehberi veya sayfa adresi mevcut değil.
            </p>
            <button
              onClick={() => navigatePath('/')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        ) : currentToolType === 'json' ? (
          <JsonConverterPage onNavigate={handleNavigateTool} />
        ) : (
          <ExcelConverterPage onNavigate={handleNavigateTool} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
