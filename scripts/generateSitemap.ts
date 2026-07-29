import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEO_PAGES } from '../src/data/seoPages';
import { GUIDES } from '../src/data/guides';

const BASE_URL = 'https://efatura-xml-converter.calderon-hs91.workers.dev';
const currentDate = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  '',
  '/xml-to-excel',
  '/xml-to-json',
  '/e-fatura-xml-dogrulama',
  '/rehberler',
];

const allUrls = [
  ...staticRoutes.map((route) => ({
    loc: `${BASE_URL}${route}`,
    priority: route === '' ? '1.0' : '0.9',
    changefreq: 'weekly',
  })),
  ...SEO_PAGES.map((page) => ({
    loc: `${BASE_URL}/${page.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
  })),
  ...GUIDES.map((guide) => ({
    loc: `${BASE_URL}/rehberler/${guide.slug}`,
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
console.log(`✅ Sitemap successfully generated at public/sitemap.xml with ${allUrls.length} URLs!`);
