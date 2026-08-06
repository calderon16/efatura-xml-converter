import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SEO_PAGES } from './data/seoPages';
import { GUIDES } from './data/guides';
import { SoftwareAppJsonLd } from './components/SoftwareAppJsonLd';
import { HowToJsonLd } from './components/HowToJsonLd';
import { LanguageProvider, useTranslation } from './i18n/LanguageContext';
import { FileQuestion, Loader2 } from 'lucide-react';

// Code Splitting — Lazy Load Pages
const ConverterPage = lazy(() =>
  import('./pages/ConverterPage').then((m) => ({ default: m.ConverterPage }))
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
const PrivacyPolicyPage = lazy(() =>
  import('./pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage }))
);

function AppShell() {
  const { t, lang } = useTranslation();
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

  const handleNavigateSlug = (slug: string) => {
    navigatePath(slug);
  };

  // Route Matching Logic
  const normalizedPath = decodeURIComponent(pathname).replace(/^\//, '').replace(/\/$/, '');

  // 1. Check Validator Route
  const isValidatorRoute = normalizedPath === 'e-fatura-xml-dogrulama';

  // 2. Check Guides List Route
  const isGuidesListRoute = normalizedPath === 'rehberler';

  // 3. Check Privacy Policy Route
  const isPrivacyPolicyRoute = normalizedPath === 'gizlilik-politikasi';

  // 4. Check Guide Detail Route (/rehberler/:slug)
  const isGuideDetailMatch = normalizedPath.startsWith('rehberler/');
  const guideSlug = isGuideDetailMatch ? normalizedPath.replace(/^rehberler\//, '') : '';
  const matchedGuide = GUIDES.find((g) => g.slug === guideSlug);

  // 5. Check SEO Landing Page Route
  const matchedSeoPage = SEO_PAGES.find((p) => p.slug === normalizedPath);

  // 6. Converter route ('' and the legacy 'xml-to-excel' path both land on the same page)
  const isConverterRoute = normalizedPath === '' || normalizedPath === 'xml-to-excel';

  // 7. Check 404
  const is404 =
    !isConverterRoute &&
    !isValidatorRoute &&
    !isGuidesListRoute &&
    !isPrivacyPolicyRoute &&
    !matchedGuide &&
    !matchedSeoPage;

  // HowTo Steps for How-to Excel Page
  const howToExcelSteps = [
    { name: t('app.howToStep1Name'), text: t('app.howToStep1Text') },
    { name: t('app.howToStep2Name'), text: t('app.howToStep2Text') },
    { name: t('app.howToStep3Name'), text: t('app.howToStep3Text') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Schema.org SoftwareApplication for the converter */}
      {isConverterRoute && (
        <SoftwareAppJsonLd
          name={t('app.jsonLdName')}
          description={t('app.jsonLdDescription')}
          url={`https://efatura-xml-converter.calderon-hs91.workers.dev${pathname}`}
        />
      )}

      {/* Schema.org HowTo for how-to-excel page */}
      {normalizedPath === 'e-fatura-excele-nasil-aktarilir' && (
        <HowToJsonLd
          name={SEO_PAGES.find((p) => p.slug === 'e-fatura-excele-nasil-aktarilir')?.h1[lang] ?? ''}
          description={SEO_PAGES.find((p) => p.slug === 'e-fatura-excele-nasil-aktarilir')?.metaDescription[lang] ?? ''}
          steps={howToExcelSteps}
        />
      )}

      {/* App Header */}
      <Header currentPath={pathname} onNavigateSlug={handleNavigateSlug} />

      {/* Main Container with Suspense fallback loading indicator */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense
          fallback={
            <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
              <span className="text-xs font-semibold">{t('app.loading')}</span>
            </div>
          }
        >
          {isValidatorRoute ? (
            <ValidatorPage onNavigateSlug={handleNavigateSlug} />
          ) : isGuidesListRoute ? (
            <GuidesListPage onNavigateSlug={handleNavigateSlug} />
          ) : isPrivacyPolicyRoute ? (
            <PrivacyPolicyPage onNavigateSlug={handleNavigateSlug} />
          ) : matchedGuide ? (
            <GuideDetailPage guide={matchedGuide} onNavigateSlug={handleNavigateSlug} />
          ) : matchedSeoPage ? (
            <SeoLandingPage pageConfig={matchedSeoPage} onNavigateSlug={handleNavigateSlug} />
          ) : is404 ? (
            <div className="w-full max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
              <FileQuestion className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h2 className="font-heading text-xl font-bold text-slate-800 mb-1">
                {t('app.error404Title')}
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                {t('app.error404Desc')}
              </p>
              <button
                onClick={() => navigatePath('/')}
                className="px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-sm transition-all"
              >
                {t('app.backToHome')}
              </button>
            </div>
          ) : (
            <ConverterPage onNavigateSlug={handleNavigateSlug} />
          )}
        </Suspense>
      </main>

      {/* Footer */}
      <Footer onNavigateSlug={handleNavigateSlug} />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}

export default App;
