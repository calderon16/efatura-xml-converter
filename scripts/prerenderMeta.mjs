import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEO_PAGES } from '../src/data/seoPages.ts';
import { GUIDES } from '../src/data/guides.ts';

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

const routesToPrerender = [
  {
    routePath: '',
    title: 'e-Fatura XML Excel Dönüştürücü — Ücretsiz, Sunucusuz, Anında (UBL-TR)',
    metaDescription: 'Türkiye e-Fatura standardı UBL-TR XML dosyalarınızı tarayıcınızda %100 güvenli, sunucusuz ve anında Excel (.xlsx) formatına dönüştürün. Ücretsiz ve toplu dönüştürme desteği.',
    canonicalUrl: `${BASE_URL}/`,
  },
  {
    routePath: 'xml-to-excel',
    title: 'e-Fatura XML → Excel Dönüştürücü — Ücretsiz & Anında (UBL-TR)',
    metaDescription: 'UBL-TR formatındaki e-Fatura XML dosyalarınızı tarayıcı içinde %100 güvenli, ücretsiz ve anında Excel (.xlsx) tablosuna dönüştürün. Sunucusuz & KVKK Uyumlu.',
    canonicalUrl: `${BASE_URL}/xml-to-excel`,
  },
  {
    routePath: 'xml-to-json',
    title: 'e-Fatura XML → JSON Dönüştürücü — UBL-TR Parser & API Entegrasyon',
    metaDescription: 'Yazılımcılar ve otomasyon geliştiricileri için UBL-TR XML faturalarını Yapısal (Nested) veya Düz (Flat Array) JSON formatına çevirin.',
    canonicalUrl: `${BASE_URL}/xml-to-json`,
  },
  {
    routePath: 'e-fatura-xml-dogrulama',
    title: 'e-Fatura XML Doğrulama — Ücretsiz UBL-TR Kontrol Aracı',
    metaDescription: 'e-Fatura ve e-Arşiv UBL-TR XML dosyalarınızı şema, zorunlu alanlar ve Miktar × Birim Fiyat tutar hesaplaması yönünden ücretsiz doğrulayın.',
    canonicalUrl: `${BASE_URL}/e-fatura-xml-dogrulama`,
  },
  {
    routePath: 'rehberler',
    title: 'e-Fatura Rehberleri ve Kılavuzlar — Mevzuat, UBL-TR & Dönüştürme',
    metaDescription: 'e-Fatura, e-Arşiv, UBL-TR şema yapısı ve 2026 GİB mevzuatı hakkında güncel rehber makaleleri ve pratik kılavuzlar.',
    canonicalUrl: `${BASE_URL}/rehberler`,
  },
  // 10 SEO Landing Pages
  ...SEO_PAGES.map((page) => ({
    routePath: page.slug,
    title: page.title,
    metaDescription: page.metaDescription,
    canonicalUrl: `${BASE_URL}/${page.slug}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  })),
  // 5 Guide Articles
  ...GUIDES.map((guide) => ({
    routePath: `rehberler/${guide.slug}`,
    title: guide.title,
    metaDescription: guide.metaDescription,
    canonicalUrl: `${BASE_URL}/rehberler/${guide.slug}`,
    jsonLd: guide.faqItems
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : undefined,
  })),
];

function injectMetaTags(html, meta) {
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

  // Also handle ASCII / URL-decoded variant if contains non-ASCII characters
  const decodedPath = decodeURIComponent(meta.routePath);
  if (decodedPath !== meta.routePath) {
    const decodedSubDir = path.join(distDir, decodedPath);
    fs.mkdirSync(decodedSubDir, { recursive: true });
    fs.writeFileSync(path.join(decodedSubDir, 'index.html'), prerenderedHtml, 'utf-8');
  }

  // Also create normalized ASCII version (e.g. guncel-sinirlar for güncel-sinirlar)
  const asciiPath = meta.routePath
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c');

  if (asciiPath !== meta.routePath) {
    const asciiSubDir = path.join(distDir, asciiPath);
    fs.mkdirSync(asciiSubDir, { recursive: true });
    fs.writeFileSync(path.join(asciiSubDir, 'index.html'), prerenderedHtml, 'utf-8');
  }

  generatedCount++;
}

console.log(`✅ Post-Build Meta Prerendering completed: ${generatedCount} static HTML routes generated in dist/!`);
