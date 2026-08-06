import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEO_PAGES } from '../src/data/seoPages';
import { GUIDES } from '../src/data/guides';

// 9 SEO Landing Pages Slugs
const SEO_SLUGS = [
  'e-fatura-xml-excel-donusturucu',
  'e-fatura-excele-nasil-aktarilir',
  'ubl-tr-xml-okuyucu',
  'e-fatura-toplu-donusturme',
  'e-arsiv-fatura-excel',
  'fatura-xml-veri-cekme',
  'muhasebe-e-fatura-excel-aktarim',
  'ubl-invoice-to-excel',
  'e-fatura-kdv-detay-raporu',
];

// 6 Guide Articles Slugs (100% Pure ASCII)
const GUIDE_SLUGS = [
  'ubl-tr-nedir-e-fatura-xml-standardi-aciklamasi',
  'e-fatura-ile-e-arsiv-fatura-arasindaki-fark-nedir',
  'e-fatura-zorunlulugu-kimleri-kapsiyor-2026-guncel-sinirlar',
  'muhasebede-kullanilan-dosya-formatlari-xml-csv-json-farklari',
  'e-fatura-xml-dosyasi-nasil-okunur-step-by-step',
  'png-jpg-webp-farki-hangi-format-ne-zaman-kullanilmali',
];

const BASE_URL = 'https://schemaflowapp.com';
const currentDate = new Date().toISOString().slice(0, 10);

// Path relative to the site root, no leading slash, trailing slash included ('' means the root).
// Every route here gets mirrored at both the unprefixed (English) URL and the /tr/ (Turkish) URL —
// see docs/DECISIONS.md's hreflang ADR for why: client-side language toggles are invisible to
// crawlers, so Turkish content needs its own indexable URL.
interface RouteEntry {
  path: string;
  priority: string;
  changefreq: string;
}

const routes: RouteEntry[] = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: 'xml-to-excel/', priority: '0.9', changefreq: 'weekly' },
  { path: 'e-fatura-xml-dogrulama/', priority: '0.9', changefreq: 'weekly' },
  { path: 'rehberler/', priority: '0.9', changefreq: 'weekly' },
  { path: 'gizlilik-politikasi/', priority: '0.9', changefreq: 'weekly' },
  { path: 'image-converter/', priority: '0.9', changefreq: 'weekly' },
  { path: 'document-converter/', priority: '0.9', changefreq: 'weekly' },
  ...SEO_SLUGS.map((slug) => ({ path: `${slug}/`, priority: '0.8', changefreq: 'weekly' })),
  ...GUIDE_SLUGS.map((slug) => ({ path: `rehberler/${slug}/`, priority: '0.7', changefreq: 'weekly' })),
];

const enUrl = (p: string) => (p === '' ? `${BASE_URL}/` : `${BASE_URL}/${p}`);
const trUrl = (p: string) => (p === '' ? `${BASE_URL}/tr/` : `${BASE_URL}/tr/${p}`);

function urlBlock(loc: string, route: RouteEntry, enHref: string, trHref: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enHref}" />
    <xhtml:link rel="alternate" hreflang="tr" href="${trHref}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enHref}" />
  </url>`;
}

const urlBlocks = routes.flatMap((route) => {
  const en = enUrl(route.path);
  const tr = trUrl(route.path);
  return [urlBlock(en, route, en, tr), urlBlock(tr, route, en, tr)];
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks.join('\n')}
</urlset>
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

fs.writeFileSync(outputPath, sitemapXml, 'utf-8');
console.log(`✅ Sitemap successfully generated at public/sitemap.xml with ${urlBlocks.length} URLs (${routes.length} routes × EN+TR) and hreflang alternates!`);
