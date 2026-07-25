import { useEffect } from 'react';

/*
 * Injects Google Fonts differently depending on the strategy, then cleans up on
 * unmount so navigating between /before and /after gives an honest comparison.
 *
 * mode="blocking" (Before):
 *   - Loads MANY weights of two families.
 *   - No `display=swap`, so text is invisible until fonts arrive (FOIT),
 *     delaying First Contentful Paint and hurting perceived performance.
 *   - No preconnect, so the connection to the font host is set up late.
 *
 * mode="optimized" (After):
 *   - Preconnects to the font hosts early (faster handshake).
 *   - Loads only the few weights actually used.
 *   - Uses `display=swap`, so system fonts render immediately and swap in the
 *     web font when ready — no blocked FCP.
 */
const OPTIMIZED_HREF =
  'https://fonts.googleapis.com/css2' +
  '?family=Playfair+Display:wght@600;700' +
  '&family=Inter:wght@400;500;600' +
  '&display=swap';

export default function useFonts(mode) {
  useEffect(() => {
    // Before page injects its own (much heavier) blocking fonts via criticalBloat.js
    // at module-eval time — skip the light hook path so we don't double-load.
    if (mode === 'blocking') return undefined;

    const nodes = [];

    const pre1 = document.createElement('link');
    pre1.rel = 'preconnect';
    pre1.href = 'https://fonts.googleapis.com';
    nodes.push(pre1);

    const pre2 = document.createElement('link');
    pre2.rel = 'preconnect';
    pre2.href = 'https://fonts.gstatic.com';
    pre2.crossOrigin = 'anonymous';
    nodes.push(pre2);

    const sheet = document.createElement('link');
    sheet.rel = 'stylesheet';
    sheet.href = OPTIMIZED_HREF;
    sheet.dataset.perfFont = mode;
    nodes.push(sheet);

    nodes.forEach((n) => document.head.appendChild(n));

    return () => {
      nodes.forEach((n) => n.parentNode && n.parentNode.removeChild(n));
    };
  }, [mode]);
}
