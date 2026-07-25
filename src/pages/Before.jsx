/*
 * BEFORE — the deliberately unoptimized version.
 *
 * Anti-patterns that actually move Lighthouse needles (critical path, not
 * cosmetic comments):
 *   1. Static import of criticalBloat.js → ~1.8s sync main-thread work + blocking fonts
 *   2. Enormous JPEG hero (upscaled ~4800px) with no srcSet / preload / dimensions
 *   3. Extra full-size images competing for bandwidth (hidden, eager)
 *   4. UnoptimizedGallery with 6 oversized eager JPEGs (no lazy load, no srcSet)
 *   5. Late-injected promo banner → Cumulative Layout Shift
 *   6. Secondary long tasks + forced reflows after mount → TBT
 */

// Side-effect import: runs when this chunk evaluates (only on /before).
import { runSecondaryLongTasks } from '../before/criticalBloat.js';
import { useEffect, useState } from 'react';

import Hero from '../components/Hero.jsx';
import VersionBadge from '../components/VersionBadge.jsx';
import Footer from '../components/Footer.jsx';
import UnoptimizedGallery from '../components/UnoptimizedGallery.jsx';

import heroBefore from '../assets/hero-before.jpg';
import interiorBefore from '../assets/interior-before.jpg';
import interior2Before from '../assets/interior2-before.jpg';

export default function Before() {
  const [showShiftBanner, setShowShiftBanner] = useState(false);

  useEffect(() => {
    runSecondaryLongTasks();
    const t = window.setTimeout(() => setShowShiftBanner(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const background = (
    <>
      <img src={heroBefore} alt="Modern luxury residential building exterior" />
      <img
        src={heroBefore}
        alt=""
        aria-hidden="true"
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />
      <img
        src={interiorBefore}
        alt=""
        aria-hidden="true"
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />
      <img
        src={interior2Before}
        alt=""
        aria-hidden="true"
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />
    </>
  );

  return (
    <>
      {showShiftBanner && (
        <div
          style={{
            background: '#c9a15a',
            color: '#0e1620',
            textAlign: 'center',
            padding: '18px 12px',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
        >
          Limited-time offer — Book a site visit this week
        </div>
      )}
      <Hero
        background={background}
        title="Homes that reverberate with warmth & luxury"
        subtitle="Three decades of crafting world-class residential, commercial and integrated townships across South India."
      />
      <UnoptimizedGallery />
      <Footer />
      <VersionBadge variant="before" />
    </>
  );
}
