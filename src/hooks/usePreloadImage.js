import { useEffect } from 'react';

/*
 * Injects a <link rel="preload" as="image"> for the responsive hero image.
 *
 * The hero photo is the Largest Contentful Paint (LCP) element. Preloading it
 * with `fetchpriority="high"` and the same `imagesrcset`/`imagesizes` the <img>
 * uses tells the browser to start downloading the correct responsive variant
 * immediately — before it has even parsed/executed the app JS. This is one of
 * the single biggest LCP wins available.
 */
export default function usePreloadImage({ imageSrcSet, imageSizes, href }) {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    if (imageSrcSet) link.setAttribute('imagesrcset', imageSrcSet);
    if (imageSizes) link.setAttribute('imagesizes', imageSizes);
    if (href) link.href = href;
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);

    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, [imageSrcSet, imageSizes, href]);
}
