# Ramky Estates — Hero Section Performance Demo (Before vs After)

A standalone demo that rebuilds **one section** (the homepage hero + "Our Projects"
strip) of [ramkyestates.com](https://www.ramkyestates.com) two ways:

- **`/before`** — an intentionally unoptimized build that reproduces the real
  bottlenecks found during the Lighthouse diagnosis.
- **`/after`** — a visually identical build with the recommended fixes applied.

The point is to **prove the recommendations with real numbers**: run Lighthouse
(mobile) on each route and compare.

> Branding note: this is a demonstration rebuild. It uses **placeholder branding**
> (an original inline-SVG "Ramky Estates" wordmark) and **royalty-free photos**
> from Unsplash — no proprietary assets are copied.
>
> **Submission credit:** every page shows a visible footer line —
> [Built for Digital Heroes Training Task](https://digitalheroesco.com) —
> as required for verification.

---

## Live URL (for submission)

**Live demo:** <https://sunanth-developer.github.io/digitalheros-taskb/>

Routes to verify (the footer credit is visible on all three):

- Landing: <https://sunanth-developer.github.io/digitalheros-taskb/>
- Before: <https://sunanth-developer.github.io/digitalheros-taskb/#/before>
- After: <https://sunanth-developer.github.io/digitalheros-taskb/#/after>

> The app uses `HashRouter`, so deep links contain `#/` — this lets the SPA run
> on any static host without server rewrites.

---

## Deploy

### Primary — GitHub Pages (automated via GitHub Actions)

This repo ships a workflow at `.github/workflows/deploy.yml` that builds and
deploys to GitHub Pages on every push to `main`.

One-time setup on GitHub:

1. Push the repo (see below).
2. Go to **Settings → Pages → Build and deployment → Source** and choose
   **GitHub Actions**.
3. The next push (or a manual **Actions → Deploy to GitHub Pages → Run
   workflow**) publishes the site to the Live URL above.

```bash
git add -A
git commit -m "Deploy performance demo"
git push
```

### Alternative — Netlify / Vercel

```bash
npm run build
npx netlify-cli deploy --dir=dist --prod   # or: npx vercel --prod
```

SPA config for those hosts is included (`public/_redirects`, `vercel.json`),
and the relative `base` in `vite.config.js` means the build runs anywhere.

---

## Tech stack

- **React 18** + **Vite 5**
- **JavaScript** (no TypeScript)
- **CSS Modules**
- **React Router** (routes for `/before` and `/after`)
- Modern hooks (`useState`, `useEffect`, `useRef`), `React.memo`, `React.lazy`
- **sharp** (dev-only) to generate the optimized image variants

---

## Project structure

```
performance-demo/
├── index.html
├── vite.config.js
├── scripts/
│   └── generate-images.js        # builds the Before/After image variants
├── src/
│   ├── main.jsx
│   ├── App.jsx                    # router + React.lazy for the After page
│   ├── components/
│   │   ├── Hero.jsx               # shared hero layout (reused by both pages)
│   │   ├── Navbar.jsx             # top navigation (memoized)
│   │   ├── CTAButton.jsx          # reusable button/link (memoized)
│   │   ├── LazyImage.jsx          # IntersectionObserver + responsive <picture>
│   │   ├── Gallery.jsx            # below-the-fold "Our Projects" grid
│   │   ├── Logo.jsx               # inline-SVG placeholder branding
│   │   ├── Footer.jsx             # Digital Heroes submission credit
│   │   └── VersionBadge.jsx       # floating Before/After switcher
│   ├── hooks/
│   │   ├── useFonts.js            # blocking vs optimized font loading
│   │   └── usePreloadImage.js     # preload the LCP hero image (After only)
│   ├── pages/
│   │   ├── Home.jsx               # landing page linking to both versions
│   │   ├── Before.jsx             # unoptimized
│   │   └── After.jsx              # optimized
│   ├── styles/
│   │   └── global.css
│   └── assets/                    # generated + source images
├── metrics-template.md           # fill in after running Lighthouse
└── README.md
```

---

## Getting started

```bash
npm install
npm run dev
```

Then open:

- Landing page: <http://localhost:5173/>
- Before: <http://localhost:5173/before>
- After: <http://localhost:5173/after>

> The image variants are already committed under `src/assets/`. If you ever want
> to regenerate them from the `-original.jpg` sources, run
> `npm run generate:images`.

---

## 1. Why the **Before** version is slow

Every problem below is a real, measurable Lighthouse bottleneck — reproduced on purpose:

| # | Anti-pattern (in `Before.jsx` / `Gallery.jsx`) | Metric it hurts |
|---|-------------------------------------------------|-----------------|
| 1 | **One giant hero JPEG** — 2400px wide, ~1.1 MB, shipped to every device including phones | LCP, total bytes, Performance |
| 2 | **No responsive images** — no `srcSet`/`<picture>`, so a 360px phone still downloads desktop pixels | LCP, data usage |
| 3 | **No preload of the LCP image** — the browser can't discover the hero until React renders the `<img>` | LCP |
| 4 | **No lazy loading** — below-the-fold project images load eagerly and compete with the hero for bandwidth | LCP, Speed Index |
| 5 | **Render-blocking fonts** — many weights of two families, **no `font-display: swap`** → invisible text (FOIT) until fonts arrive | FCP, LCP |
| 6 | **No explicit image dimensions** on the hero → the layout jumps when the image loads | CLS |
| 7 | **No code splitting** — the gallery and its image references are pulled into the initial bundle | TBT, TTI |

Net effect on a throttled mobile device: a slow, janky first paint, a late LCP,
and layout shift.

---

## 2. Every optimization added in the **After** version

Visually identical UI, but:

| ✓ | Optimization | Where | Why it improves Lighthouse |
|---|--------------|-------|----------------------------|
| ✓ | **WebP hero** (with JPEG fallback) | `After.jsx`, `scripts/generate-images.js` | Modern codec → far fewer bytes for the same quality → faster **LCP** |
| ✓ | **Responsive images** (`<picture>` + `srcSet` + `sizes`) | `After.jsx`, `LazyImage.jsx` | Phone downloads ~40–95 KB instead of 1.1 MB → **LCP**, data |
| ✓ | **Preload + `fetchpriority="high"`** on the hero | `usePreloadImage.js` | Browser starts the LCP download immediately, before app JS runs → **LCP** |
| ✓ | **Explicit `width`/`height`** (aspect-ratio boxes) | `After.jsx`, `LazyImage.jsx` | Reserves layout space → **CLS ≈ 0** |
| ✓ | **Lazy loading** via IntersectionObserver | `LazyImage.jsx` | Below-the-fold images load only near the viewport → **LCP**, **Speed Index** |
| ✓ | **`font-display: swap` + preconnect + fewer weights** | `useFonts.js` | Text paints instantly with system fonts, no FOIT → **FCP**, **LCP** |
| ✓ | **Code splitting** (`React.lazy` for the After page & Gallery) | `App.jsx`, `After.jsx` | Smaller initial JS → less main-thread work → **TBT**, **TTI** |
| ✓ | **`React.memo`** on Hero/Navbar/CTAButton/LazyImage | components | Prevents wasted re-renders → lower **TBT** |
| ✓ | **Compressed assets** (mozjpeg + tuned WebP) | `scripts/generate-images.js` | Fewer bytes across the board |
| ✓ | **Fade-in animation** (GPU-friendly opacity/transform) | `LazyImage.jsx` | Smooth perceived load without blocking the main thread |
| ✓ | **Accessibility** — semantic landmarks, descriptive `alt`, real `<button>`/`<a>`, focus styles, `aria-expanded` | across components | Higher **Accessibility** score |

---

## 3. Expected Lighthouse improvements (mobile, throttled)

Exact numbers depend on your machine, but the demo is built to show clear,
directional gains. Typical results:

| Metric | Before (typical) | After (typical) |
|--------|------------------|-----------------|
| Performance | ~40–60 | ~90–100 |
| First Contentful Paint | slow (FOIT from blocking fonts) | fast (swap) |
| Largest Contentful Paint | high (1.1 MB hero, no preload) | much lower (small WebP + preload) |
| Total Blocking Time | higher | lower (code split, memo) |
| Cumulative Layout Shift | noticeable (no dimensions) | ~0 (fixed dimensions) |

The single biggest win is the hero image: **~1.1 MB → ~40–95 KB** on mobile,
fetched via preload before the JS even runs.

---

## 4. How to run Lighthouse

1. `npm install`
2. `npm run dev`
3. Open **<http://localhost:5173/before>** in Chrome.
4. Open **DevTools → Lighthouse** tab.
5. Choose **Mobile**, category **Performance** (and Accessibility), **Navigation** mode.
6. Click **Analyze page load**. Save a screenshot.
7. Repeat for **<http://localhost:5173/after>**. Save a screenshot.
8. Fill the numbers into [`metrics-template.md`](./metrics-template.md).

> For the most realistic/repeatable numbers, test the production build:
> `npm run build && npm run preview`, then run Lighthouse against the preview URL
> (usually <http://localhost:4173/before> and `/after`). Use an Incognito window
> so extensions don't skew the results.
