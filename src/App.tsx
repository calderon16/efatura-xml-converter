import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SEO_PAGES } from './data/seoPages';
import { GUIDES } from './data/guides';
import { SoftwareAppJsonLd } from './components/SoftwareAppJsonLd';
import { HowToJsonLd } from './components/HowToJsonLd';
import { LanguageProvider, useTranslation, type Lang } from './i18n/LanguageContext';
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
const ImageConverter = lazy(() =>
  import('./pages/ImageConverter').then((m) => ({ default: m.ImageConverter }))
);
const DocumentConverter = lazy(() =>
  import('./pages/DocumentConverter').then((m) => ({ default: m.DocumentConverter }))
);

interface AppShellProps {
  pathname: string;
  navigatePath: (path: string) => void;
}

function AppShell({ pathname, navigatePath }: AppShellProps) {
  const { t, lang } = useTranslation();

  // Keep the <html lang> attribute in sync — never set correctly before (index.html hardcodes
  // lang="en" and nothing updated it client-side), matters for both SEO and accessibility.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const handleNavigateSlug = (slug: string) => {
    // Central injection point: every internal link in the app goes through this function, so
    // prefixing here is the only place language-aware routing needs to happen.
    navigatePath(lang === 'tr' ? `tr/${slug}` : slug);
  };

  // Route Matching Logic — strip a leading `tr/` (or bare `tr`) segment before matching so the
  // rest of this logic is identical for both languages. `pathname` itself (prefix intact) is kept
  // for anything that needs the real, self-referential URL (e.g. SoftwareAppJsonLd's `url` below).
  const decodedPath = decodeURIComponent(pathname).replace(/^\//, '').replace(/\/$/, '');
  const normalizedPath =
    decodedPath === 'tr' ? '' : decodedPath.startsWith('tr/') ? decodedPath.slice(3) : decodedPath;

  // 1. Check Validator Route
  const isValidatorRoute = normalizedPath === 'e-fatura-xml-dogrulama';

  // 2. Check Guides List Route
  const isGuidesListRoute = normalizedPath === 'rehberler';

  // 3. Check Privacy Policy Route
  const isPrivacyPolicyRoute = normalizedPath === 'gizlilik-politikasi';

  // 3b. Check Image Converter Route
  const isImageConverterRoute = normalizedPath === 'image-converter';

  // 3c. Check Document Converter Route
  const isDocumentConverterRoute = normalizedPath === 'document-converter';

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
    !isImageConverterRoute &&
    !isDocumentConverterRoute &&
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
          ) : isImageConverterRoute ? (
            <ImageConverter />
          ) : isDocumentConverterRoute ? (
            <DocumentConverter />
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
                onClick={() => handleNavigateSlug('')}
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

  // Language is derived from the URL, not localStorage — the /tr/ prefix is the single source of
  // truth so prerendered HTML, hreflang, and the client always agree on which language a URL means.
  const strippedPath = decodeURIComponent(pathname).replace(/^\//, '');
  const lang: Lang = strippedPath === 'tr' || strippedPath.startsWith('tr/') ? 'tr' : 'en';

  const setLang = (nextLang: Lang) => {
    const rest =
      strippedPath === 'tr' ? '' : strippedPath.startsWith('tr/') ? strippedPath.slice(3) : strippedPath;
    navigatePath(nextLang === 'tr' ? `/tr/${rest}` : `/${rest}`);
  };

  return (
    <LanguageProvider lang={lang} setLang={setLang}>
      <AppShell pathname={pathname} navigatePath={navigatePath} />
    </LanguageProvider>
  );
}

export default App;
