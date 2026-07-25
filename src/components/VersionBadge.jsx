import { Link } from 'react-router-dom';
import styles from './VersionBadge.module.css';

/*
 * Small fixed badge shown on the Before/After pages so you can eyeball which
 * version you're on and jump to the other for an A/B Lighthouse comparison.
 * It is lightweight and does not affect the measured hero performance.
 */
export default function VersionBadge({ variant }) {
  const isBefore = variant === 'before';
  return (
    <div className={`${styles.badge} ${isBefore ? styles.before : styles.after}`}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>
        {isBefore ? 'BEFORE — Unoptimized' : 'AFTER — Optimized'}
      </span>
      <Link className={styles.switch} to={isBefore ? '/after' : '/before'}>
        View {isBefore ? 'After' : 'Before'} →
      </Link>
    </div>
  );
}
