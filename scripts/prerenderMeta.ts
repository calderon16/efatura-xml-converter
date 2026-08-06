import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEO_PAGES } from '../src/data/seoPages';
import { GUIDES } from '../src/data/guides';

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

interface RouteMeta {
  routePath: string;
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  jsonLd?: object;
}

const routesToPrerender: RouteMeta[] = [
  {
    // Not actually applied - the injection loop below skips routePath '' and leaves index.html's
    // own <head> as the source of truth for the root route. Kept here (accurate, not stale) so
    // this array documents every route rather than mysteriously omitting one.
    routePath: '',
    title: 'SchemaFlow — Convert Any XML File to Excel, CSV or PDF',
    metaDescription: '100% client-side XML conversion — no server upload, no schema lock-in. Works with any XML, with a dedicated mode for Turkish e-Fatura (UBL-TR) invoices.',
    canonicalUrl: `${BASE_URL}/`,
  },
  {
    routePath: 'xml-to-excel',
    title: 'e-Fatura XML to Excel Converter — Free & Instant (UBL-TR)',
    metaDescription: 'Convert UBL-TR format e-Fatura XML files to Excel (.xlsx), 100% securely in your browser, free and instant. Serverless & KVKK compliant.',
    canonicalUrl: `${BASE_URL}/xml-to-excel/`,
  },
  {
    routePath: 'e-fatura-xml-dogrulama',
    title: 'e-Fatura XML Validator — Free UBL-TR Compliance Checker',
    metaDescription: 'Instantly validate your e-Fatura and e-Arşiv UBL-TR XML files for schema compliance, required fields, and Quantity × Unit Price amount accuracy, for free.',
    canonicalUrl: `${BASE_URL}/e-fatura-xml-dogrulama/`,
  },
  {
    routePath: 'rehberler',
    title: 'e-Fatura Guides and How-Tos — Regulations, UBL-TR & Conversion',
    metaDescription: 'Up-to-date guide articles and practical how-tos on e-Fatura, e-Arşiv, UBL-TR schema structure, and 2026 GİB regulations.',
    canonicalUrl: `${BASE_URL}/rehberler/`,
  },
  {
    routePath: 'gizlilik-politikasi',
    title: 'Privacy Policy — SchemaFlow',
    metaDescription: 'SchemaFlow privacy policy. 100% local in-browser processing, zero server logging, and full KVKK / GDPR compliance commitment.',
    canonicalUrl: `${BASE_URL}/gizlilik-politikasi/`,
  },
  // 9 SEO Landing Pages (English is the default/primary language, so that's what's prerendered
  // statically here; the client-side language toggle still switches the rendered page to Turkish
  // post-hydration, this only affects what a crawler sees on the very first paint)
  ...SEO_PAGES.map((page) => ({
    routePath: page.slug,
    title: page.title.en,
    metaDescription: page.metaDescription.en,
    canonicalUrl: `${BASE_URL}/${page.slug}/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question.en,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer.en,
        },
      })),
    },
  })),
  // 5 Guide Articles
  ...GUIDES.map((guide) => ({
    routePath: `rehberler/${guide.slug}`,
    title: guide.title.en,
    metaDescription: guide.metaDescription.en,
    canonicalUrl: `${BASE_URL}/rehberler/${guide.slug}/`,
    jsonLd: guide.faqItems
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question.en,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer.en,
            },
          })),
        }
      : undefined,
  })),
];

function injectMetaTags(html: string, meta: RouteMeta): string {
  let result = html;

  // Replace Title
  result = result.replace(/<title>.*?<\/title>/gi, `<title>${meta.title}</title>`);

  // Replace Meta Description
  const newMetaDesc = `<meta name="description" content="${meta.metaDescription}" />`;
  if (result.includes('<meta name="description"')) {
    result = result.replace(/<meta name="description" content=".*?"\s*\/?>/gi, newMetaDesc);
  } else {
    result = result.replace('</head>', `  ${newMetaDesc}\n</head>`);
  }

  // Inject Canonical Link
  const newCanonical = `<link rel="canonical" href="${meta.canonicalUrl}" />`;
  if (result.includes('<link rel="canonical"')) {
    result = result.replace(/<link rel="canonical" href=".*?"\s*\/?>/gi, newCanonical);
  } else {
    result = result.replace('</head>', `  ${newCanonical}\n</head>`);
  }

  // Inject Open Graph tags
  const ogTags = `
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.metaDescription}" />
  <meta property="og:url" content="${meta.canonicalUrl}" />
  `;
  result = result.replace('</head>', `${ogTags}\n</head>`);

  // Inject JSON-LD if present
  if (meta.jsonLd) {
    const scriptLd = `\n  <script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`;
    result = result.replace('</head>', `${scriptLd}\n</head>`);
  }

  return result;
}

let generatedCount = 0;

for (const meta of routesToPrerender) {
  if (meta.routePath === '') continue; // skip base index.html

  const prerenderedHtml = injectMetaTags(templateHtml, meta);

  // Target directory inside dist/
  const targetSubDir = path.join(distDir, meta.routePath);
  fs.mkdirSync(targetSubDir, { recursive: true });

  const targetIndexPath = path.join(targetSubDir, 'index.html');
  fs.writeFileSync(targetIndexPath, prerenderedHtml, 'utf-8');

  generatedCount++;
}

console.log(`✅ Post-Build Meta Prerendering completed: ${generatedCount} static HTML routes generated in dist/!`);
