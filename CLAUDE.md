# CLAUDE.md

Project instructions for Claude Code (and other agents) working in this repository.

## What this is

**e-Fatura XML Platformu** ("projeler") — a free, 100% client-side web tool that converts
Turkish UBL-TR e-Fatura / e-Arşiv XML invoices into Excel (.xlsx) or JSON, plus a schema/consistency
validator. No backend: every byte of the invoice stays in the user's browser (this is the core
privacy/KVKK selling point — see [[docs/DECISIONS.md]]).

The app is also SEO-driven: 10 landing pages and 5 long-form guide articles live as data (not CMS
content) in `src/data/`, and a custom post-build script prerenders per-route `index.html` files with
unique `<title>`, meta description, canonical URL, OG tags and FAQPage JSON-LD, because the app itself
is a client-rendered SPA with no server framework.

The same web build is also wrapped as a native Android/iOS app via Capacitor.

Full architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). File-by-file map:
[docs/PROJECT_MAP.md](docs/PROJECT_MAP.md). Deeper domain notes: [docs/vault/00-Index.md](docs/vault/00-Index.md).

## Tech stack

- React 19 + TypeScript, Vite 6, Tailwind CSS 4 (`@tailwindcss/vite`)
- No router library — routing is hand-rolled in `src/App.tsx` via `window.history.pushState` +
  `popstate`, matched against a `normalizedPath` string. See [[docs/vault/Routing-System.md]].
- No global state library — state lives in `App` and is threaded down as props.
- `exceljs` (dynamic import) for Excel generation, `file-saver` for web downloads.
- `@capacitor/*` for native filesystem write + OS share sheet on mobile.
- Lint: `oxlint` (not ESLint). Config: `.oxlintrc.json`.
- No test suite currently exists.

## Commands

```bash
npm run dev       # vite dev server
npm run build      # tsx scripts/generateSitemap.ts && tsc -b && vite build && tsx scripts/prerenderMeta.ts
npm run preview    # preview the production build
npm run lint       # oxlint
```

`npm run build` is a 4-step pipeline — sitemap generation and meta-prerendering are NOT optional
side scripts, they are load-bearing for SEO. If you add a new SEO landing page or guide slug in
`src/data/seoPages.ts` or `src/data/guides.ts`, it must also be added to the slug lists in
`scripts/generateSitemap.ts` and will be auto-picked-up by `scripts/prerenderMeta.ts` (it maps over
`SEO_PAGES`/`GUIDES` directly — only the sitemap script has hardcoded slug arrays). See
[[docs/vault/SEO-Prerendering-Pipeline.md]].

Mobile builds run in Codemagic (`codemagic.yaml`), not locally — `npx cap sync android/ios` then
Gradle/Xcode. There's no local Android/iOS build step in `package.json`.

## Deploy targets

Two live deploy configs point at the same `dist/`: Cloudflare Workers with static assets
(`wrangler.toml`, project/Worker name `efatura-xml-converter` — the name predates the SchemaFlow
rebrand and wasn't renamed to avoid breaking the existing `.workers.dev` deployment binding; the
custom domain is bound via a `[[routes]]`/`custom_domain = true` entry in `wrangler.toml`) and Vercel
(`vercel.json`, SPA rewrite only — Vercel does not run the prerender script, so Vercel-served routes
rely on client-side rendering + the SPA JSON-LD components for SEO, not the prerendered static HTML).
Treat Cloudflare as the canonical production target, now served at the custom domain
**`https://schemaflowapp.com`**. The hardcoded `BASE_URL`/canonical-URL constant appears in more
places than it might look like — `scripts/generateSitemap.ts`, `scripts/prerenderMeta.ts`, the
JSON-LD `url` props in `App.tsx`/`ValidatorPage.tsx`/`GuidesListPage.tsx`, and the canonical-URL
fallback strings in `GuideDetailPage.tsx`/`SeoLandingPage.tsx`/`PrivacyPolicyPage.tsx`, plus
`index.html`'s `og:image`/`twitter:image` and `public/robots.txt`'s `Sitemap:` line. If you ever
change canonical domains again, grep the whole repo for the current domain string rather than trusting
any specific file list (including this one) to be exhaustive.

## Conventions

- **UI copy is Turkish.** Code (identifiers, comments) is English. Keep it that way — don't
  translate UI strings to English or vice versa.
- **Namespace-first XML parsing.** `src/utils/xmlParser.ts` always tries `getElementsByTagNameNS`
  with the official GİB UBL-TR namespace URIs first, and only falls back to a local-name-only
  search for non-standard/malformed invoices from third-party e-invoice integrators (Logo, Netsis,
  Mikro, Paraşüt, etc. all produce slightly different XML). Don't "simplify" this to a plain
  tag-name lookup — it will silently break on real-world files. See
  [[docs/vault/UBL-TR-XML-Parsing.md]].
- **`ds:Signature` blocks are always skipped** when walking the DOM (digital signature / mali
  mühür data, irrelevant to invoice content and can be large). Preserve this filter in any new
  traversal code.
- **New pages are lazy-loaded** in `App.tsx` via `lazy()` + `Suspense`. Follow the existing pattern
  for any new route rather than adding it to the main bundle.
- **VKN vs TCKN** distinction (10-digit corporate tax ID vs 11-digit individual national ID) is
  derived from the `schemeID` attribute first, length as a fallback. This distinction shows up
  across the parser, Excel export, and JSON export — keep it consistent. See
  [[docs/vault/VKN-vs-TCKN.md]].
- Money amounts are compared with a `0.02`–`0.05` TL tolerance (rounding drift), not exact equality
  — see the mismatch-detection logic in `xmlParser.ts`.
- File download/share goes through `src/utils/nativeDownload.ts` (`saveOrShareFile`), which branches
  on `Capacitor.isNativePlatform()`. Don't call `file-saver` directly from page/feature code — always
  go through this wrapper so native builds keep working.

## Working in this repo

- **Do not modify application code (`src/`, `scripts/`, config files) without being asked.**
  Documentation-only changes (this file, `docs/`, `.claude/skills/`) are always safe.
- This directory (`Xml/`) is the actual project root. Note: the enclosing git repository is rooted
  at the Windows user profile directory (`C:\Users\90532`), not here — see the note in
  [docs/DECISIONS.md](docs/DECISIONS.md#git-repository-root). Treat that as a pre-existing
  environment quirk, not something to silently "fix."
- There is no `.env` handling and no secrets in this repo — it's a fully static, client-side app.
