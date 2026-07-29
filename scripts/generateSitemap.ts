import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEO_PAGES } from '../src/data/seoPages';
import { GUIDES } from '../src/data/guides';

// 10 SEO Landing Pages Slugs
const SEO_SLUGS = [
  'e-fatura-xml-excel-donusturucu',
  'e-fatura-excele-nasil-aktarilir',
  'ubl-tr-xml-okuyucu',
  'e-fatura-toplu-donusturme',
  'e-arsiv-fatura-excel',
  'e-fatura-xml-json-donusturucu',
  'fatura-xml-veri-cekme',
  'muhasebe-e-fatura-excel-aktarim',
  'ubl-invoice-to-excel',
  'e-fatura-kdv-detay-raporu',
];

// 5 Guide Articles Slugs (100% Pure ASCII)
const GUIDE_SLUGS = [
  'ubl-tr-nedir-e-fatura-xml-standardi-aciklamasi',
  'e-fatura-ile-e-arsiv-fatura-arasindaki-fark-nedir',
  'e-fatura-zorunlulugu-kimleri-kapsiyor-2026-guncel-sinirlar',
  'muhasebede-kullanilan-dosya-formatlari-xml-csv-json-farklari',
  'e-fatura-xml-dosyasi-nasil-okunur-step-by-step',
];

const BASE_URL = 'https://efatura-xml-converter.calderon-hs91.workers.dev';
const currentDate = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  '/',
  '/xml-to-excel/',
  '/xml-to-json/',
  '/e-fatura-xml-dogrulama/',
  '/rehberler/',
];

const allUrls = [
  ...staticRoutes.map((route) => ({
    loc: route === '/' ? `${BASE_URL}/` : `${BASE_URL}${route}`,
    priority: route === '/' ? '1.0' : '0.9',
    changefreq: 'weekly',
  })),
  ...SEO_SLUGS.map((slug) => ({
    loc: `${BASE_URL}/${slug}/`,
    priority: '0.8',
    changefreq: 'weekly',
  })),
  ...GUIDE_SLUGS.map((slug) => ({
    loc: `${BASE_URL}/rehberler/${slug}/`,
    priority: '0.7',
    changefreq: 'weekly',
  })),
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

fs.writeFileSync(outputPath, sitemapXml, 'utf-8');
console.log(`✅ Sitemap successfully generated at public/sitemap.xml with ${allUrls.length} trailing slash URLs!`);
