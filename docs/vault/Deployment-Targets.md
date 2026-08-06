---
tags: [system, deploy, infra]
---

# Deployment Targets

Same `dist/` build feeds three deploy surfaces.

## Cloudflare Workers (with static assets) — canonical
`wrangler.toml`: Worker name `efatura-xml-converter` (unchanged since the SchemaFlow rebrand — see
`docs/DECISIONS.md`, renaming it risks breaking the deployment binding), serves `./dist`, SPA fallback
(`not_found_handling = "single-page-application"`), trailing-slash HTML handling, plus a
`[[routes]]`/`custom_domain = true` entry binding the public custom domain. This is the domain
hardcoded everywhere as canonical: **`https://schemaflowapp.com`** (in `scripts/generateSitemap.ts`,
`scripts/prerenderMeta.ts`, JSON-LD `url` props in `App.tsx`/`ValidatorPage.tsx`/`GuidesListPage.tsx`,
canonical-URL fallbacks in `GuideDetailPage.tsx`/`SeoLandingPage.tsx`/`PrivacyPolicyPage.tsx`,
`index.html`'s `og:image`/`twitter:image`, and `public/robots.txt`'s `Sitemap:` line — grep the repo
for the current domain string if you need the exhaustive list, don't trust any single doc to have it).
Correctly serves [[SEO-Prerendering-Pipeline|prerendered per-route HTML]]. **Adding a `[[routes]]`
entry without `workers_dev = true` in `wrangler.toml` auto-disables the old
`efatura-xml-converter.calderon-hs91.workers.dev` subdomain on deploy** (confirmed via a real
`wrangler deploy` — it's not a "both keep working" situation by default, `wrangler` prints an explicit
warning about this). It was left disabled here since the SchemaFlow pivot is recent with no
established backlinks/bookmarks yet worth preserving; add `workers_dev = true` to `wrangler.toml` if
that subdomain ever needs to keep resolving alongside the custom domain.

## Vercel — secondary
`vercel.json`: single catch-all rewrite (`/(.*) → /index.html`). Does **not** serve the prerendered
per-route files — every route gets the generic root `index.html` on Vercel, so meta tags/JSON-LD are
whatever the client-side JSON-LD components (`SoftwareAppJsonLd`, `HowToJsonLd`) inject after
hydration, not the build-time prerendered versions. See
[../DECISIONS.md#adr-006-dual-static-hosting-cloudflare-canonical-vercel-secondary](../DECISIONS.md).

## Capacitor native (Android/iOS)
Not a hosted deploy target — `capacitor.config.ts` (`webDir: 'dist'`) wraps the same build in a
native WebView shell. Built in Codemagic CI (`codemagic.yaml`), not locally:
- `android-workflow`: `npm install` → `npm run build` → `npx cap sync android` → Gradle
  `assembleRelease bundleRelease`
- `ios-workflow`: `npm install` → `npm run build` → `npx cap sync ios` → `pod install` → `xcodebuild
  archive`

Both workflows run on `mac_mini_m1` instances with a 60-minute cap. The only native-specific runtime
code is `src/utils/nativeDownload.ts` (file save via `Filesystem` + OS share sheet instead of a
browser download) — see [[Client-Side-Processing]] for why the actual invoice processing itself is
identical on native and web.

## If changing the canonical domain again
There are more than three places now (this list undercounted them once already — grep the whole
repo for the current domain string rather than trusting this list):
1. `scripts/generateSitemap.ts` (`BASE_URL`)
2. `scripts/prerenderMeta.ts` (`BASE_URL`)
3. JSON-LD `url` props: `src/App.tsx`, `src/pages/ValidatorPage.tsx`, `src/pages/GuidesListPage.tsx`
4. Canonical-URL fallback strings: `src/pages/GuideDetailPage.tsx`, `src/pages/SeoLandingPage.tsx`,
   `src/pages/PrivacyPolicyPage.tsx`
5. `index.html` (`og:image`, `twitter:image`)
6. `public/robots.txt` (`Sitemap:` line)
7. `wrangler.toml` (`[[routes]]` `pattern`)

## Related
[[SEO-Prerendering-Pipeline]]
