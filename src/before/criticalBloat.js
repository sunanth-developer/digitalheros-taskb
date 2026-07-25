/**
 * BEFORE-ONLY critical-path bloat.
 *
 * Loaded as a static side-effect import from Before.jsx so this work runs
 * during module evaluation — BEFORE React paints. That is what actually
 * tanks Lighthouse (unlike useEffect hooks, which run too late to hurt FCP/LCP).
 *
 * Effects on Lighthouse:
 *  - Long main-thread task  → Total Blocking Time / TTI
 *  - Sync render-blocking font CSS (no font-display:swap) → FCP / LCP
 *  - Extra blocking stylesheets competing for bandwidth → Speed Index
 */

const BLOCKING_FONTS = [
  // Many families × many weights, NO display=swap → FOIT + huge CSS
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Lora:wght@400;500;600;700&family=Montserrat:wght@100;200;300;400;500;600;700;800;900',
  'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Raleway:wght@100;200;300;400;500;600;700;800;900&family=Nunito:wght@200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900',
];

function injectBlockingStylesheets() {
  if (typeof document === 'undefined') return;

  BLOCKING_FONTS.forEach((href, i) => {
    if (document.querySelector(`link[data-before-font="${i}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.beforeFont = String(i);
    // Insert at the top of <head> so it competes with first paint.
    document.head.insertBefore(link, document.head.firstChild);
  });

  // Extra render-blocking CSS with unused rules (parse cost + network).
  if (!document.querySelector('link[data-before-bloat-css]')) {
    const style = document.createElement('style');
    style.dataset.beforeBloatCss = 'true';
    // Generate a large stylesheet so the main thread spends time parsing CSS.
    let css = '';
    for (let i = 0; i < 800; i += 1) {
      css += `.bloat-unused-${i}{margin:${i % 40}px;padding:${i % 20}px;color:#${(i * 17)
        .toString(16)
        .padStart(6, '0')
        .slice(0, 6)};font-size:${12 + (i % 10)}px;letter-spacing:${i % 5}px;}`;
    }
    style.textContent = css;
    document.head.appendChild(style);
  }
}

function blockMainThread(ms) {
  // Synchronous busy-wait — classic long task that Lighthouse measures as TBT.
  const end = performance.now() + ms;
  let x = 0;
  while (performance.now() < end) {
    x += Math.sqrt(x + 1) * Math.sin(x);
  }
  // Prevent the loop from being DCE'd in production builds.
  if (typeof window !== 'undefined') {
    window.__beforeBloatNonce = x;
  }
}

injectBlockingStylesheets();
// ~1.8s of main-thread work on a mid-tier mobile CPU (Lighthouse throttles further).
blockMainThread(1800);

export function runSecondaryLongTasks() {
  // Called after mount to create additional long tasks during page load.
  blockMainThread(900);
  // Layout-thrashing reads/writes → Forced reflow insight.
  if (typeof document === 'undefined') return;
  for (let i = 0; i < 200; i += 1) {
    const el = document.documentElement;
    void el.offsetHeight;
    el.style.setProperty('--bloat-shift', `${i % 7}px`);
  }
}
