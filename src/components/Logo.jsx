import styles from './Logo.module.css';

/*
 * Inline SVG logo (placeholder branding — NOT the client's proprietary logo).
 * Inline SVG is used deliberately for performance:
 *   - It ships in the HTML/JS, so there is no extra network request.
 *   - It is resolution-independent (crisp on retina) and tiny in bytes.
 * This avoids a render-blocking / layout-shifting image request for the logo.
 */
export default function Logo({ compact = false }) {
  return (
    <span className={styles.logo} aria-hidden="true">
      <svg
        className={styles.mark}
        viewBox="0 0 40 40"
        width="36"
        height="36"
        role="presentation"
        focusable="false"
      >
        <rect x="1" y="1" width="38" height="38" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 28V13l8 6 8-6v15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      {!compact && (
        <span className={styles.word}>
          <strong>RAMKY</strong>
          <em>ESTATES</em>
        </span>
      )}
    </span>
  );
}
