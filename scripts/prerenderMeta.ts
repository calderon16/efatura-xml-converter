import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEO_PAGES } from '../src/data/seoPages';
import { GUIDES } from '../src/data/guides';
import type { LocalizedString } from '../src/types/i18nContent';

type Lang = 'en' | 'tr';

const BASE_URL = 'https://efatura-xml-converter.calderon-hs91.workers.dev';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '..', 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('❌ dist/index.html not found! Run vite build first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf-8');

interface FaqItem {
  question: LocalizedString;
  answer: LocalizedString;
}

interface RouteMeta {
  routePath: string; // '' for root, no leading slash, no trailing slash
  title: LocalizedString;
  metaDescription: LocalizedString;
  faqItems?: FaqItem[];
}

// The 5 fully-static routes. Title/description text for these is authored directly (not derived
// from src/data/*) the same way it always has been — only now with both languages instead of one.
const routesToPrerender: RouteMeta[] = [
  {
    routePath: '',
    title: {
      en: 'SchemaFlow — Convert Any XML File to Excel, CSV or PDF',
      tr: "SchemaFlow — Herhangi Bir XML Dosyasını Excel, CSV veya PDF'e Dönüştürün",
    },
    metaDescription: {
      // Aligned to index.html's actual <meta name="description"> (it previously drifted and
      // matched index.html's og:description instead — fixed as part of this pass).
      en: 'Convert any XML file to Excel, CSV, or PDF instantly in your browser — 100% client-side, nothing uploaded. Plus a purpose-built mode for Turkish e-Fatura (UBL-TR) invoices.',
      tr: "Herhangi bir XML dosyasını tarayıcınızda anında Excel, CSV veya PDF'e dönüştürün — %100 istemci taraflı, hiçbir şey sunucuya yüklenmez. Ayrıca Türkiye e-Fatura (UBL-TR) faturaları için özel bir mod içerir.",
    },
  },
  {
    routePath: 'xml-to-excel',
    title: {
      en: 'e-Fatura XML to Excel Converter — Free & Instant (UBL-TR)',
      tr: 'e-Fatura XML Excel Dönüştürücü — Ücretsiz ve Anında (UBL-TR)',
    },
    metaDescription: {
      en: 'Convert UBL-TR format e-Fatura XML files to Excel (.xlsx), 100% securely in your browser, free and instant. Serverless & KVKK compliant.',
      tr: 'UBL-TR formatındaki e-Fatura XML dosyalarınızı tarayıcınızda %100 güvenli şekilde, ücretsiz ve anında Excel (.xlsx) formatına dönüştürün. Sunucusuz ve KVKK uyumlu.',
    },
  },
  {
    routePath: 'e-fatura-xml-dogrulama',
    title: {
      en: 'e-Fatura XML Validator — Free UBL-TR Compliance Checker',
      tr: 'e-Fatura XML Doğrulayıcı — Ücretsiz UBL-TR Uygunluk Kontrolü',
    },
    metaDescription: {
      en: 'Instantly validate your e-Fatura and e-Arşiv UBL-TR XML files for schema compliance, required fields, and Quantity × Unit Price amount accuracy, for free.',
      tr: 'e-Fatura ve e-Arşiv UBL-TR XML dosyalarınızı şema uygunluğu, zorunlu alanlar ve Miktar × Birim Fiyat tutarlılığı açısından ücretsiz olarak anında doğrulayın.',
    },
  },
  {
    routePath: 'rehberler',
    title: {
      en: 'e-Fatura Guides and How-Tos — Regulations, UBL-TR & Conversion',
      tr: 'e-Fatura Rehberleri ve Kılavuzlar — Mevzuat, UBL-TR & Dönüştürme',
    },
    metaDescription: {
      en: 'Up-to-date guide articles and practical how-tos on e-Fatura, e-Arşiv, UBL-TR schema structure, and 2026 GİB regulations.',
      tr: 'e-Fatura, e-Arşiv, UBL-TR şema yapısı ve 2026 GİB mevzuatı hakkında güncel rehber makaleleri ve pratik kılavuzlar.',
    },
  },
  {
    routePath: 'gizlilik-politikasi',
    title: {
      en: 'Privacy Policy — SchemaFlow',
      tr: 'Gizlilik Politikası — SchemaFlow',
    },
    metaDescription: {
      en: 'SchemaFlow privacy policy. 100% local in-browser processing, zero server logging, and full KVKK / GDPR compliance commitment.',
      tr: 'SchemaFlow gizlilik politikası. %100 tarayıcı içi yerel işleme, sıfır sunucu kaydı ve tam KVKK / GDPR uyum taahhüdü.',
    },
  },
  {
    routePath: 'image-converter',
    title: {
      en: 'SchemaFlow — Free Image Converter (PNG, JPG, WebP)',
      tr: 'SchemaFlow — Ücretsiz Görsel Dönüştürücü (PNG, JPG, WebP)',
    },
    metaDescription: {
      en: 'Convert images between PNG, JPG, and WebP instantly in your browser — 100% client-side, nothing uploaded.',
      tr: 'Görsellerinizi PNG, JPG ve WebP arasında anında tarayıcınızda dönüştürün — %100 istemci taraflı, hiçbir şey yüklenmez.',
    },
  },
  {
    routePath: 'document-converter',
    title: {
      en: 'SchemaFlow — Free Document Converter (Excel, PDF, Word)',
      tr: 'SchemaFlow — Ücretsiz Belge Dönüştürücü (Excel, PDF, Word)',
    },
    metaDescription: {
      en: 'Convert between Excel, PDF, and Word instantly in your browser — 100% client-side, nothing uploaded.',
      tr: 'Excel, PDF ve Word arasında anında tarayıcınızda dönüştürün — %100 istemci taraflı, hiçbir şey yüklenmez.',
    },
  },
  // 9 SEO Landing Pages
  ...SEO_PAGES.map((page) => ({
    routePath: page.slug,
    title: page.title,
    metaDescription: page.metaDescription,
    faqItems: page.faqItems,
  })),
  // 5 Guide Articles
  ...GUIDES.map((guide) => ({
    routePath: `rehberler/${guide.slug}`,
    title: guide.title,
    metaDescription: guide.metaDescription,
    faqItems: guide.faqItems,
  })),
];

function routeUrl(routePath: string, lang: Lang): string {
  const prefix = lang === 'tr' ? `${BASE_URL}/tr` : BASE_URL;
  return routePath === '' ? `${prefix}/` : `${prefix}/${routePath}/`;
}

function buildFaqJsonLd(faqItems: FaqItem[], lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question[lang],
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer[lang],
      },
    })),
  };
}

function replaceOrInsert(html: string, pattern: RegExp, replacement: string): string {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `  ${replacement}\n</head>`);
}

function injectMetaTags(html: string, meta: RouteMeta, lang: Lang): string {
  let result = html;

  const title = meta.title[lang];
  const description = meta.metaDescription[lang];
  const canonicalUrl = routeUrl(meta.routePath, lang);
  const enUrl = routeUrl(meta.routePath, 'en');
  const trUrl = routeUrl(meta.routePath, 'tr');

  // <html lang="...">
  result = result.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);

  // <title>
  result = result.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);

  // <meta name="description">
  result = replaceOrInsert(
    result,
    /<meta name="description" content=".*?"\s*\/?>/i,
    `<meta name="description" content="${description}" />`
  );

  // Canonical <link>
  result = replaceOrInsert(
    result,
    /<link rel="canonical" href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Open Graph tags — check-and-replace (previously always appended, which duplicated the tags
  // already hardcoded in index.html on every single generated route; fixed here).
  result = replaceOrInsert(
    result,
    /<meta property="og:title" content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${title}" />`
  );
  result = replaceOrInsert(
    result,
    /<meta property="og:description" content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${description}" />`
  );
  result = replaceOrInsert(
    result,
    /<meta property="og:url" content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );

  // hreflang alternates — every generated file lists both languages plus x-default (→ English),
  // including itself, per hreflang cluster requirements.
  const hreflangLinks = `
  <link rel="alternate" hreflang="en" href="${enUrl}" />
  <link rel="alternate" hreflang="tr" href="${trUrl}" />
  <link rel="alternate" hreflang="x-default" href="${enUrl}" />`;
  result = result.replace('</head>', `${hreflangLinks}\n</head>`);

  // FAQPage JSON-LD, if present. Escape "<" so a "</script>" sequence in any FAQ text can't break
  // out of the script tag — JSON.stringify doesn't escape it by default.
  if (meta.faqItems) {
    const json = JSON.stringify(buildFaqJsonLd(meta.faqItems, lang)).replace(/</g, '\\u003c');
    const scriptLd = `\n  <script type="application/ld+json">${json}</script>`;
    result = result.replace('</head>', `${scriptLd}\n</head>`);
  }

  return result;
}

let enCount = 0;
let trCount = 0;

for (const meta of routesToPrerender) {
  for (const lang of ['en', 'tr'] as const) {
    const prerenderedHtml = injectMetaTags(templateHtml, meta, lang);

    const targetSubDir =
      lang === 'tr'
        ? path.join(distDir, 'tr', meta.routePath)
        : path.join(distDir, meta.routePath);
    fs.mkdirSync(targetSubDir, { recursive: true });

    const targetIndexPath = path.join(targetSubDir, 'index.html');
    fs.writeFileSync(targetIndexPath, prerenderedHtml, 'utf-8');

    if (lang === 'en') enCount++;
    else trCount++;
  }
}

// Build-time safety net: wrangler.toml's SPA fallback means a route missing its TR mirror would
// silently serve the English root shell at that Turkish URL instead of failing loudly. A future
// added SEO page/guide that isn't mirrored should break the build, not degrade SEO silently.
if (enCount !== trCount) {
  console.error(`❌ EN/TR route count mismatch: ${enCount} EN routes vs ${trCount} TR routes generated.`);
  process.exit(1);
}

console.log(`✅ Post-Build Meta Prerendering completed: ${enCount} routes × 2 languages = ${enCount + trCount} static HTML files generated in dist/!`);
