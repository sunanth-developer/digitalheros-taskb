import { memo } from 'react';
import Navbar from './Navbar.jsx';
import CTAButton from './CTAButton.jsx';
import styles from './Hero.module.css';

/*
 * Presentational Hero section shared by BOTH the Before and After pages, so the
 * two versions are visually identical. The ONLY thing that differs between them
 * is the `background` node the page passes in:
 *
 *   - Before: a single giant, eager <img> (unoptimized).
 *   - After:  a preloaded, responsive WebP <picture> marked high priority.
 *
 * Passing the background as a prop (dependency injection) keeps this component
 * reusable while letting each page control its own image-loading strategy.
 */
function Hero({
  background,
  eyebrow = 'Luxury Living, Redefined',
  title,
  subtitle,
  primaryCta = { label: 'Explore Projects', href: '#projects' },
  secondaryCta = { label: 'Book a Site Visit', href: '#visit' },
}) {
  return (
    <header className={styles.hero} id="top">
      {/* Background layer (the LCP image). Provided by the parent page. */}
      <div className={styles.bg}>{background}</div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={`container ${styles.top}`}>
        <Navbar />
      </div>

      <div className={`container ${styles.content}`}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.actions}>
          <CTAButton href={primaryCta.href}>{primaryCta.label}</CTAButton>
          <CTAButton href={secondaryCta.href} variant="ghost">
            {secondaryCta.label}
          </CTAButton>
        </div>
      </div>
    </header>
  );
}

export default memo(Hero);
