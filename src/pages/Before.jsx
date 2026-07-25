import Hero from '../components/Hero.jsx';
import VersionBadge from '../components/VersionBadge.jsx';
import Footer from '../components/Footer.jsx';
import useFonts from '../hooks/useFonts.js';
// Anti-pattern: Gallery is imported statically, so its code + all its full-size
// image imports are pulled into the initial bundle (no code splitting).
import Gallery from '../components/Gallery.jsx';

// Anti-pattern: a single ~1.1MB, 2400px-wide JPEG shipped to every device.
import heroBefore from '../assets/hero-before.jpg';

/*
 * BEFORE — the deliberately unoptimized version.
 *
 * Intentional performance anti-patterns demonstrated here:
 *   1. Large JPEG hero (2400px, ~1.1MB) served to all viewports.
 *   2. No responsive images — no srcSet / <picture>, so mobile downloads desktop pixels.
 *   3. No preload of the LCP image — it can't start until the JS renders the <img>.
 *   4. Eager loading of below-the-fold gallery images (no lazy loading).
 *   5. Render-blocking fonts: many weights of two families, no font-display: swap.
 *   6. No explicit image dimensions on the hero → Cumulative Layout Shift.
 *   7. No code splitting — everything loads immediately.
 *
 * The page still looks and functions correctly; it's just slow.
 */
export default function Before() {
  useFonts('blocking');

  const background = (
    // No width/height (causes layout shift), no loading strategy, no responsive
    // sources, high fetch priority not set. This is the LCP element done wrong.
    <img src={heroBefore} alt="Modern luxury residential building exterior" />
  );

  return (
    <>
      <Hero
        background={background}
        title="Homes that reverberate with warmth & luxury"
        subtitle="Three decades of crafting world-class residential, commercial and integrated townships across South India."
      />
      <Gallery optimized={false} />
      <Footer />
      <VersionBadge variant="before" />
    </>
  );
}
