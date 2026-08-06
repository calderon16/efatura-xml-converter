# Decision Log

Lightweight ADRs. This project had no prior decision log — the entries below (except the last one)
are **reconstructed from the current codebase**, not transcribed from a discussion, since no such
record existed before this bootstrap. Each cites the code it's inferred from. Treat them as "this is
the standing architecture and the reasoning that best explains it," not as historical fact about
what was discussed on what date. Add new entries going forward with real dates/authors when
decisions are actually made.

Status legend: `Accepted` (in effect, not disputed) · `Proposed` · `Superseded`.

---

## ADR-001: Client-side-only invoice processing
**Status:** Accepted (inferred)

Every invoice is parsed, validated, and converted entirely in the browser (`DOMParser`, in-memory
JS objects, `exceljs` run client-side). No file or field is ever sent to a server.

**Why (evidenced by):** The Header and Validator UI both surface "%100 Tarayıcı İçi (KVKK Uyumlu)" /
"%100 İstemci Tarafında" badges (`Header.tsx`, `ValidatorPage.tsx`), and every SEO page FAQ answer
about data safety says the same thing (`seoPages.ts`). Invoice XML contains tax IDs (VKN/TCKN) and
commercial data — KVKK (Turkey's GDPR-equivalent) exposure is the obvious reason to avoid a backend
entirely, and it doubles as a zero-infrastructure-cost architecture.

**Consequence:** No backend to build/secure/pay for, but also no server-side validation, no
persistence, no usage analytics on invoice content, and file size/volume is bounded by what the
user's browser can hold in memory. See [vault/Client-Side-Processing.md](vault/Client-Side-Processing.md).

---

## ADR-002: Hand-rolled routing instead of a router library
**Status:** Accepted (inferred)

`App.tsx` implements routing with a `pathname` state variable, `window.history.pushState`, and a
manual if/else chain over a normalized path string — no `react-router` or similar dependency.

**Why (evidenced by):** `package.json` has no router dependency at all; the matching logic in
`App.tsx` handles a small, fixed, enumerable set of routes (2 tools, 1 validator, 1 guides list,
N guide slugs, N SEO slugs, 1 privacy page, 404). For a route count this small and this static, a
router library is arguably unnecessary weight.

**Consequence:** Adding a new *kind* of route (not just a new slug in existing data) means editing
the if/else chain in `App.tsx` by hand, and there's no nested-route or route-guard support if the
app grows more complex. See [vault/Routing-System.md](vault/Routing-System.md).

---

## ADR-003: SEO/guide content as TypeScript data, not a CMS
**Status:** Accepted (inferred)

`src/data/seoPages.ts` and `src/data/guides.ts` are plain typed arrays committed to the repo, with
one generic renderer component each (`SeoLandingPage.tsx`, `GuideDetailPage.tsx`).

**Why (evidenced by):** No CMS SDK, no markdown loader, no content-fetching code anywhere in `src/`.
Given the low page count (10 + 5) and that this is a solo/small project, a CMS would be net-negative
overhead versus editing a TS array and getting full type safety + IDE autocomplete on the shape.

**Consequence:** Non-technical content edits require a code change and redeploy — acceptable at this
scale, would not scale to dozens of editors or frequent content churn.

---

## ADR-004: Build-time meta-tag prerendering instead of full SSR/SSG
**Status:** Accepted (inferred)

`scripts/prerenderMeta.ts` runs after `vite build` and rewrites `<title>`/meta/canonical/OG/JSON-LD
into per-route copies of the single built `index.html`, rather than adopting Next.js/Remix-style SSR
or a static-site generator.

**Why (evidenced by):** The rest of the app is a plain Vite SPA with no server runtime anywhere in
the deploy configs (`wrangler.toml` and `vercel.json` both serve static files with SPA fallback).
Full SSR would require a Node runtime at request time on both Cloudflare and Vercel; this approach
gets crawler-correct meta tags and JSON-LD per route with zero runtime dependency, at the cost of the
*rendered HTML body* still being client-side-only (crawlers get correct `<head>` but an empty
`<div id="root">` until JS runs).

**Consequence:** Search engines that execute JS (Google) get full content; social-card scrapers and
non-JS crawlers get correct title/description/OG but not the rendered page body. Adding a new SEO
slug requires no change to `prerenderMeta.ts` (it maps over the data arrays) but **does** require a
manual addition to `scripts/generateSitemap.ts`'s hardcoded slug lists — see
[vault/SEO-Prerendering-Pipeline.md](vault/SEO-Prerendering-Pipeline.md) for the asymmetry.

---

## ADR-005: One web codebase, wrapped natively via Capacitor
**Status:** Accepted (inferred)

`capacitor.config.ts` points `webDir: 'dist'` at the same Vite build used for the web deploys;
`src/utils/nativeDownload.ts` is the only place native-vs-web behavior branches
(`Capacitor.isNativePlatform()`).

**Why (evidenced by):** `android/` and `ios/` are standard `npx cap add` output directories, and
`codemagic.yaml` builds them straight from `npm run build` + `npx cap sync`. There's no separate
native UI code — this is a WebView wrapper, not a React Native app.

**Consequence:** Every web feature ships to mobile for free; the only native-specific code path is
file save/share (`Filesystem` write + OS share sheet instead of a browser download). Native ad
monetization (AdMob) was considered early on — a placeholder ad slot and a `// TODO: AdMob` comment
existed in `ProcessingState.tsx`/`FileUpload.tsx` — but was decided against and removed; the app has
no ad integration.

---

## ADR-006: Dual static hosting (Cloudflare canonical, Vercel secondary)
**Status:** Accepted (inferred)

Both `wrangler.toml` (Cloudflare) and `vercel.json` (Vercel) exist and are kept in sync with the
same `dist/` output; the canonical production domain baked into sitemap/prerender/JSON-LD code is
**`schemaflowapp.com`** (a custom domain purchased via Cloudflare Registrar and bound to the
`efatura-xml-converter` Worker via a `[[routes]]`/`custom_domain = true` entry in `wrangler.toml` —
the underlying `.workers.dev` deployment/Worker name was kept as-is; only the public-facing domain
changed). Previously served at `efatura-xml-converter.calderon-hs91.workers.dev` — that subdomain was
**auto-disabled** by `wrangler deploy` once the `[[routes]]` custom-domain entry was added (confirmed
via wrangler's own deploy-time warning; see `docs/vault/Deployment-Targets.md` for the mechanism and
how to re-enable it with `workers_dev = true` if ever needed).

**Why (evidenced by):** `wrangler.toml`'s `not_found_handling = "single-page-application"` runs the
prerendered-route logic correctly; `vercel.json`'s catch-all rewrite to `/index.html` does **not**
serve the prerendered per-route files — Vercel would need its own rewrite rules per route to get the
same SEO benefit. Since only the Cloudflare domain is hardcoded as canonical everywhere, Vercel
appears to be a staging/backup target rather than a co-equal production surface.

**Consequence:** If Vercel is ever promoted to primary, the prerendering benefit is silently lost
unless `vercel.json` gains route-specific rewrites, and every hardcoded `BASE_URL` (3 locations —
see [CLAUDE.md](../CLAUDE.md#deploy-targets)) needs updating.

---

## ADR-007: `/tr/` URL prefix + hreflang for Turkish content indexability
**Status:** Accepted

The app is bilingual (EN default, TR secondary) via `src/i18n/LanguageContext.tsx`, but originally
every page had exactly one URL regardless of language — switching language was a pure client-side
state change with no URL change. Research plus direct testing confirmed the consequence: search
engines only ever see whichever language is baked into the prerendered static HTML at a given URL
(always English), with no distinct URL and no `hreflang` relationship through which to discover the
Turkish content at all — client-side-only language toggles are effectively invisible to crawlers.
This mattered concretely here because the Turkish "e-fatura" search niche is this project's
highest-intent traffic, and it was entirely unindexable.

**Decision:** every existing unprefixed URL keeps meaning English, unchanged (zero redirects, zero
risk to anything already indexed). Every route gains a mirrored `/tr/...` counterpart meaning
Turkish — `/` ↔ `/tr/`, `/rehberler/` ↔ `/tr/rehberler/`, etc. — with no exceptions, because
`wrangler.toml`'s SPA fallback means any route missing its TR mirror would silently serve the
English root shell at that Turkish URL. `lang` is derived from the URL (a leading `/tr/` segment),
not from `localStorage` — `src/i18n/LanguageContext.tsx`'s `LanguageProvider` is a controlled
component now (`lang`/`setLang` passed down from `src/App.tsx`, which owns `pathname`), so the URL is
the single source of truth and prerendered HTML, `hreflang`, and the client always agree on which
language a given URL means. See [[SEO-Prerendering-Pipeline]] for the build-side implementation
(`scripts/generateSitemap.ts`, `scripts/prerenderMeta.ts`).

**Consequence:** internal navigation (`onNavigateSlug`, wired through one central
`handleNavigateSlug` in `App.tsx`) automatically carries the current language's prefix, so
individual page/component call sites didn't need to change. The Turkish-worded path segments that
predate this decision (`rehberler`, `gizlilik-politikasi`, etc.) were intentionally left as-is —
renaming those is a separate, much larger change and wasn't part of this pass.

---

## ADR-008: Image/Document converters stay 100% client-side; PDF↔Office is extraction-based, not
LibreOffice-quality
**Status:** Accepted

SchemaFlow expanded beyond XML into Image (PNG/JPG/WebP) and Document (Excel/PDF/Word) conversion.
A server-side backend (Cloudflare Container running Gotenberg/LibreOffice, for true layout-preserving
PDF↔Office conversion including PowerPoint) was researched and costed (~$5/mo minimum, Workers Paid
plan) but explicitly deferred by the user in favor of a free, no-infrastructure option now.

**Decision:** every new converter stays client-side, reusing the exact "nothing is uploaded"
architecture the rest of the app already has:
- **Images**: pure Canvas API (`canvas.toBlob`) — no dependency, true format conversion.
- **Excel → PDF/CSV**: `exceljs`'s read side (`Workbook.xlsx.load`, previously unused — only the
  write side was exercised before), adapted into the existing schema-agnostic `TabularData` shape
  and fed through the already-built `pdfGenerator.ts`/`csvGenerator.ts`.
- **PDF → Excel/Word**: `pdfjs-dist` extracts text (no OCR — scanned/image-only PDFs are explicitly
  unsupported, with an honest in-UI error rather than a silent empty output), written out via
  `exceljs` or the new `docx` package.
- **Word → PDF**: `mammoth` extracts HTML from `.docx`, `html2canvas` rasterizes it, `jsPDF` slices
  the result across pages.

This is **extraction-based conversion, not a rendering engine** — good for text/tabular documents,
not pixel-perfect for complex multi-column layouts, and PowerPoint (any direction) has no viable free
client-side library so it's out of scope entirely for now. All new heavy libraries
(`pdfjs-dist`, `docx`, `mammoth`, `html2canvas`) are dynamically imported (`await import(...)`),
following the exact convention `excelGenerator.ts`/`pdfGenerator.ts` already established for
`exceljs`/`jspdf` — this ADR makes that convention explicit since it's now load-bearing for four more
libraries, not just two.

**Two concrete bugs surfaced and fixed while building this:**
- `exceljs`'s browser ZIP reader hangs forever (never resolves or rejects) if given a raw
  `ArrayBuffer` — it needs a `Uint8Array`. Undocumented; found via direct testing.
- `html2canvas` cannot parse `oklch()` CSS color functions, which Tailwind CSS 4's default palette
  uses throughout — rendering into a plain `<div>` appended to the page (inheriting the app's own
  stylesheet) fails with "unsupported color function oklch" even when every inline style on that div
  uses plain hex. Fixed by rendering inside an isolated `<iframe>` with its own minimal blank
  document instead, so the app's Tailwind stylesheet is never in scope for html2canvas's computed-
  style walk. See `src/utils/docxToPdf.ts`.

**Consequence:** if higher-fidelity conversion (PowerPoint, scanned-PDF OCR, pixel-perfect complex
layouts) is needed later, the paid Cloudflare Container backend researched for this decision is the
documented next step — not a redesign from scratch.

---

## Git repository root {#git-repository-root}
**Status:** Noted, not an architectural decision — flagged here so it isn't lost.

The git repository enclosing this working directory is rooted at the Windows user profile
(`C:\Users\90532`), not at `Xml/`. `git status` from inside `Xml/` reports untracked files across
the entire user profile (`.aws`, `Documents`, `Downloads`, etc.), and the `main` branch has zero
commits. This predates this bootstrap session and was left untouched — fixing it (e.g. moving `.git`
into `Xml/`, or scoping a `.gitignore`) is a repository-management decision for the project owner to
make explicitly, not something to change silently while bootstrapping documentation.
