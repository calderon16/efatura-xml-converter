import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// SEO Pages Slugs
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

const BASE_URL = 'https://efatura-xml-to-excel.vercel.app';
const currentDate = new Date().toISOString().slice(0, 10);

const staticRoutes = ['', '/xml-to-excel', '/xml-to-json'];

const allUrls = [
  ...staticRoutes.map((route) => ({
    loc: `${BASE_URL}${route}`,
    priority: route === '' ? '1.0' : '0.9',
    changefreq: 'weekly',
  })),
  ...SEO_SLUGS.map((slug) => ({
    loc: `${BASE_URL}/${slug}`,
    priority: '0.8',
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
console.log(`✅ Sitemap successfully generated at public/sitemap.xml with ${allUrls.length} URLs!`);
