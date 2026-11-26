# MaalTrack SEO Optimization Plan

**Created**: 2026-11-25  
**Status**: Planned  
**Scope**: Full pass — metadata, social tags, JSON-LD, robots/sitemap, OG image, crawlable content, and font/CWV optimization

---

## Current State (Audit Summary)

### ✅ Already in place
- `lang="en"`, viewport, icons, title, meta description
- Apple/PWA meta tags (`apple-mobile-web-app-*`)
- PWA manifest generated at build (`vite-plugin-pwa`)
- Decent semantic structure (`h1`, `main`, table headings)
- Images have explicit `width`/`height` (good for CLS)

### ❌ Missing / Weak
| Issue | Impact |
|-------|--------|
| No `canonical`, Open Graph, or Twitter Card tags | Poor link previews on WhatsApp/X/Slack; no canonical signal |
| `/robots.txt`, `/sitemap.xml`, `/og-image.png` return **404** | Crawlers get no sitemap; social shares have no image |
| No structured data (JSON-LD) | No rich result eligibility for a web app |
| Empty `<div id="root">` in served HTML | Non-JS crawlers see blank page; Google must render JS |
| Only crawlable copy is "MAALTRACK / Marriage scorekeeper" | Very thin on-page content |
| Title/description omit "Nepali card game", "free", "online" | Weak keyword targeting for actual search intent |
| Manifest description says "Track cards, points…" and categories are `productivity/utilities` | Inconsistent branding; should be `games/entertainment` |
| Fonts import **all subsets** (Cyrillic, Greek, Vietnamese) — ~330 KB of woff2 for a Latin-only UI | Hurts LCP/Core Web Vitals, which feeds ranking |

---

## Target Production URL
**https://maaltrack.vercel.app** (current live deployment)

---

## Implementation Tasks

### 1. `index.html` Metadata Overhaul
**File**: `index.html`

- **Title**: `MaalTrack — Marriage Card Game Scorekeeper`
- **Description**: `Free online scorekeeper for Marriage (Nepali card game). 2–12 players, seen/unseen/doubles rounds, auto-settled so every row totals 0. Works offline.`
- Add `canonical` → `https://maaltrack.vercel.app/`
- Add `robots` meta → `index, follow, max-image-preview:large`
- Add `application-name` → `MaalTrack`
- Add Open Graph tags:
  - `og:type` → `website`
  - `og:url` → `https://maaltrack.vercel.app/`
  - `og:title` → `MaalTrack — Marriage Card Game Scorekeeper`
  - `og:description` → (same as meta description)
  - `og:image` → `https://maaltrack.vercel.app/og-image.png`
  - `og:locale` → `en_US`
- Add Twitter Card tags:
  - `twitter:card` → `summary_large_image`
  - `twitter:title`, `twitter:description`, `twitter:image` (same as OG)

### 2. Structured Data (JSON-LD)
**File**: `index.html` (in `<head>`)

Add a `<script type="application/ld+json">` with an `@graph` containing:

- **WebApplication**
  - `@type`: `WebApplication`
  - `name`: `MaalTrack`
  - `url`: `https://maaltrack.vercel.app/`
  - `description`: (same as meta description)
  - `applicationCategory`: `GameApplication`
  - `operatingSystem`: `Any`
  - `offers`: `{ "@type": "Offer", "price": "0", "priceCurrency": "USD" }`
  - `featureList`: ["2-12 players", "Seen/Unseen/Doubles rounds", "Auto settlement", "Offline support", "PWA installable"]
  - `publisher`: `{ "@type": "Organization", "name": "MaalTrack", "url": "https://github.com/amodhakal/maaltrack" }`

- **WebSite**
  - `@type`: `WebSite`
  - `name`: `MaalTrack`
  - `url`: `https://maaltrack.vercel.app/`
  - `potentialAction`: `{ "@type": "SearchAction", "target": "https://maaltrack.vercel.app/?q={search_term_string}", "query-input": "required name=search_term_string" }` (optional, keeps WebSite entity valid)

### 3. Crawl + Social Files (Static Assets in `public/`)
**Files**: `public/robots.txt`, `public/sitemap.xml`, `public/og-image.png`

#### `robots.txt`
```
User-agent: *
Allow: /

Sitemap: https://maaltrack.vercel.app/sitemap.xml
```

#### `sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://maaltrack.vercel.app/</loc>
    <lastmod>2026-11-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```
> Note: Update `lastmod` at build time or manually on releases.

#### `og-image.png`
- Dimensions: **1200×630** (1.91:1 ratio)
- Content: Branded card with "MaalTrack", "Marriage Card Game Scorekeeper", app icon, clean background
- Generation: Python/Pillow script (available locally — no new deps)
- Save to `public/og-image.png` (committed to repo)

### 4. Crawlable Content Improvements
**Files**: `src/components/game/setup-screen.tsx`, `index.html`

#### Setup Screen (SetupScreen.tsx)
- Update visible `h1`/tagline to include **"Marriage card game scorekeeper"**
  - Current: `MaalTrack` + `Marriage scorekeeper`
  - New: `MaalTrack` + `Marriage card game scorekeeper`
- Add a small "How it works" section (2–3 sentences, visible, keyword-rich):
  > "Add 2–12 players. Each round, pick a winner and mark seen/unseen/doubles. Points auto-settle so every round totals zero. Works offline as a PWA."

#### `index.html` — `<noscript>` fallback
```html
<noscript>
  <div style="padding: 2rem; text-align: center; font-family: system-ui;">
    <h1>MaalTrack — Marriage Card Game Scorekeeper</h1>
    <p>Free online scorekeeper for the Nepali card game Marriage. Track seen/unseen/doubles rounds with auto settlement. <a href="https://github.com/amodhakal/maaltrack">View on GitHub</a>.</p>
  </div>
</noscript>
```

> **Optional (not in scope unless requested)**: Lightweight static shell inside `#root` that React replaces on mount. Tradeoff: duplicated markup + brief splash before hydration. Defer unless crawlability proves insufficient.

### 5. PWA Manifest Alignment
**File**: `vite.config.ts` → `VitePWA` manifest config

- `description`: Match meta description (`Free online scorekeeper for Marriage...`)
- `categories`: `["games", "entertainment"]` (was `["productivity", "utilities"]`)
- `short_name`: `MaalTrack` (unchanged)
- `name`: `MaalTrack — Marriage Scorekeeper` (slightly expanded)

### 6. Performance — Font Subsetting (Critical for CWV)
**Files**: `src/index.css`, `vite.config.ts` (or new font CSS file)

#### Current problem
`@import "@fontsource-variable/montserrat"` + `@import "@fontsource-variable/source-sans-3"` pulls **all subsets** (Latin + Cyrillic + Greek + Vietnamese + Cyrillic-ext + Latin-ext) → ~330 KB woff2 total.

#### Solution: Latin-only `@font-face` declarations
1. Create `src/styles/fonts.css` with explicit `@font-face` blocks for **Latin + Latin-ext only** (covers English + Nepali transliteration):
   - Montserrat Variable: `files/montserrat-latin-wght-normal.woff2` + `files/montserrat-latin-ext-wght-normal.woff2`
   - Source Sans 3 Variable: `files/source-sans-3-latin-wght-normal.woff2` + `files/source-sans-3-latin-ext-wght-normal.woff2`
2. Set `font-display: swap` (already in source)
3. Preload the 4 woff2 files in `index.html`:
   ```html
   <link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/montserrat-latin-wght-normal-xxx.woff2">
   <link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/montserrat-latin-ext-wght-normal-xxx.woff2">
   <link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/source-sans-3-latin-wght-normal-xxx.woff2">
   <link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/source-sans-3-latin-ext-wght-normal-xxx.woff2">
   ```
   > Note: Vite hashes filenames. Use `vite-plugin-pwa`/`vite` asset handling or a small plugin to inject correct hashes at build. Simpler: keep fonts in `public/fonts/` with fixed names and reference directly.

4. Remove the `@import "@fontsource-variable/..."` lines from `src/index.css`
5. Import `./styles/fonts.css` instead

**Estimated savings**: ~250 KB (Latin subsets only ≈ 70-80 KB total vs 330 KB)

### 7. Verification Checklist (Post-Implementation)

| Check | Tool/Method |
|-------|-------------|
| Built `index.html` has all meta tags, JSON-LD, canonical | `pnpm build && cat dist/index.html` |
| `robots.txt` serves at `/robots.txt` | `curl https://maaltrack.vercel.app/robots.txt` |
| `sitemap.xml` valid XML at `/sitemap.xml` | `curl https://maaltrack.vercel.app/sitemap.xml \| xmllint --format -` |
| `og-image.png` serves (200, correct dimensions) | `curl -I https://maaltrack.vercel.app/og-image.png` |
| JSON-LD validates | [Schema.org Validator](https://validator.schema.org/) or [Rich Results Test](https://search.google.com/test/rich-results) |
| Open Graph preview renders | [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), [Twitter Card Validator](https://cards-dev.twitter.com/validator) |
| Lighthouse SEO score ≥ 90 | `pnpm build && npx lighthouse http://localhost:4173 --view` (after `pnpm preview`) |
| Lighthouse Performance ≥ 90 (font savings visible) | Same as above |
| Fonts load only Latin subsets (Network tab) | DevTools → Network → Filter "font" |

---

## File Change Summary

| File | Change Type |
|------|-------------|
| `index.html` | Metadata, JSON-LD, preload links, `<noscript>` |
| `vite.config.ts` | Manifest description/categories |
| `public/robots.txt` | **New** |
| `public/sitemap.xml` | **New** |
| `public/og-image.png` | **New** (generated) |
| `src/components/game/setup-screen.tsx` | Content copy update |
| `src/index.css` | Remove font imports |
| `src/styles/fonts.css` | **New** (Latin-only @font-face) |

---

## Notes & Decisions

- **No prerendering/SSR**: App stays pure SPA (Vite + React). Crawlable content + `<noscript>` + JSON-LD is the lightweight approach.
- **OG image generation**: One-time script using Pillow (already installed). Commit the PNG to repo; no runtime generation needed.
- **Font hashing**: Simplest path — copy the 4 Latin woff2 files to `public/fonts/` with fixed names (e.g., `montserrat-latin.woff2`), reference directly in `fonts.css` and preload links. Avoids build-time hash injection complexity.
- **Sitemap `lastmod`**: Update manually on releases, or add a tiny build script later if automated.

---

## Priority Order (if phased)

1. **High impact, low effort**: Metadata, JSON-LD, robots.txt, sitemap.xml, manifest fix
2. **High impact, medium effort**: OG image, font subsetting + preload
3. **Medium impact, low effort**: Setup screen copy, `<noscript>`
4. **Optional later**: Static shell in `#root`, automated sitemap `lastmod`

---

## Related Resources

- [Google Search Central: Favicon in Search](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Google: WebApplication structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview)
- [Web.dev: Font Best Practices](https://web.dev/learn/performance/web-fonts)