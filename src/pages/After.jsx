import { Suspense, lazy } from 'react';
import Hero from '../components/Hero.jsx';
import VersionBadge from '../components/VersionBadge.jsx';
import Footer from '../components/Footer.jsx';
import useFonts from '../hooks/useFonts.js';
import usePreloadImage from '../hooks/usePreloadImage.js';

// Responsive, compressed WebP hero variants (+ JPEG fallbacks for old browsers).
import heroWebp640 from '../assets/hero-640.webp';
import heroWebp1024 from '../assets/hero-1024.webp';
import heroWebp1600 from '../assets/hero-1600.webp';
import heroWebp1920 from '../assets/hero-1920.webp';
import heroJpg640 from '../assets/hero-640.jpg';
import heroJpg1024 from '../assets/hero-1024.jpg';
import heroJpg1600 from '../assets/hero-1600.jpg';
import heroJpg1920 from '../assets/hero-1920.jpg';

/*
 * Code splitting: the below-the-fold Gallery is a dynamic import, so it ships as
 * a SEPARATE chunk that loads after the critical hero. This shrinks the initial
 * JS payload → less parse/compile on the main thread → lower Total Blocking Time.
 */
const Gallery = lazy(() => import('../components/Gallery.jsx'));

const HERO_WEBP_SRCSET = `${heroWebp640} 640w, ${heroWebp1024} 1024w, ${heroWebp1600} 1600w, ${heroWebp1920} 1920w`;
const HERO_JPG_SRCSET = `${heroJpg640} 640w, ${heroJpg1024} 1024w, ${heroJpg1600} 1600w, ${heroJpg1920} 1920w`;
const HERO_SIZES = '100vw';

/*
 * AFTER — the optimized version. Visually identical to Before.
 *
 * Optimizations applied:
 *   ✓ WebP hero with JPEG fallback (modern format, far fewer bytes)
 *   ✓ Responsive images via <picture> + srcSet + sizes (right size per device)
 *   ✓ Preload + fetchpriority="high" on the LCP hero image
 *   ✓ Explicit width/height → no layout shift (CLS ≈ 0)
 *   ✓ Below-the-fold images lazy-loaded via IntersectionObserver (LazyImage)
 *   ✓ font-display: swap + preconnect + only the weights we use
 *   ✓ Code splitting via React.lazy for the non-critical Gallery
 *   ✓ React.memo across components to avoid wasted re-renders
 *   ✓ Accessibility: descriptive alt text, semantic landmarks, focus styles
 */
export default function After() {
  useFonts('optimized');

  // Start fetching the LCP image before the app even renders it.
  usePreloadImage({
    imageSrcSet: HERO_WEBP_SRCSET,
    imageSizes: HERO_SIZES,
    href: heroWebp1024,
  });

  const background = (
    <picture>
      <source type="image/webp" srcSet={HERO_WEBP_SRCSET} sizes={HERO_SIZES} />
      <source type="image/jpeg" srcSet={HERO_JPG_SRCSET} sizes={HERO_SIZES} />
      <img
        src={heroJpg1024}
        srcSet={HERO_JPG_SRCSET}
        sizes={HERO_SIZES}
        alt="Modern luxury residential building exterior at dusk"
        width={1920}
        height={1080}
        decoding="async"
        fetchpriority="high"
      />
    </picture>
  );

  return (
    <>
      <Hero
        background={background}
        title="Homes that reverberate with warmth & luxury"
        subtitle="Three decades of crafting world-class residential, commercial and integrated townships across South India."
      />
      <Suspense fallback={<div style={{ minHeight: 400 }} />}>
        <Gallery optimized />
      </Suspense>
      <Footer />
      <VersionBadge variant="after" />
    </>
  );
}
