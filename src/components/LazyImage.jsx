import { memo, useEffect, useRef, useState } from 'react';
import styles from './LazyImage.module.css';

/*
 * Reusable, performance-first image component.
 *
 * Optimizations baked in and WHY they help Lighthouse:
 *
 *  - IntersectionObserver lazy loading: below-the-fold images are only fetched
 *    when they approach the viewport. This removes them from the critical path,
 *    reducing the initial network contention that hurts LCP, and cutting total
 *    bytes → better overall Performance score.
 *
 *  - Responsive <picture> with WebP + JPEG fallback and `sizes`/`srcSet`: the
 *    browser downloads the smallest adequately-sized modern-format file for the
 *    device, saving huge amounts of bytes on mobile → faster LCP.
 *
 *  - Explicit width/height (→ aspect-ratio box): reserves layout space before
 *    the image loads, eliminating Cumulative Layout Shift (CLS).
 *
 *  - Fade-in on load + native decoding="async": smooth perceived load without
 *    blocking the main thread.
 *
 *  - `priority` escape hatch: the hero (LCP element) skips lazy loading and is
 *    marked fetchpriority="high" so it starts downloading immediately.
 */
function LazyImage({
  src,
  webpSrcSet,
  jpgSrcSet,
  sizes = '100vw',
  alt,
  width,
  height,
  className = '',
  priority = false,
  rootMargin = '300px',
}) {
  // Priority images are considered "in view" from the start (no lazy delay).
  const [inView, setInView] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (priority || inView) return undefined;

    const node = wrapperRef.current;
    if (!node) return undefined;

    // Fall back to eager loading if IntersectionObserver is unavailable.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [priority, inView, rootMargin]);

  const aspectRatio =
    width && height ? `${width} / ${height}` : undefined;

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${className}`}
      style={{ aspectRatio }}
    >
      {inView && (
        <picture>
          {webpSrcSet && (
            <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
          )}
          {jpgSrcSet && (
            <source type="image/jpeg" srcSet={jpgSrcSet} sizes={sizes} />
          )}
          <img
            className={`${styles.img} ${loaded ? styles.loaded : ''}`}
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchpriority={priority ? 'high' : 'auto'}
            onLoad={() => setLoaded(true)}
          />
        </picture>
      )}
    </div>
  );
}

export default memo(LazyImage);
