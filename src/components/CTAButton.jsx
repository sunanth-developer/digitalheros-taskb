import { memo } from 'react';
import styles from './CTAButton.module.css';

/*
 * Reusable call-to-action button.
 *
 * Wrapped in React.memo: it renders identically given the same props, so memo
 * prevents needless re-renders when a parent re-renders for unrelated reasons.
 * That trims wasted work on the main thread → helps Total Blocking Time.
 *
 * Renders an <a> when `href` is provided (correct semantics for navigation),
 * otherwise a real <button> (correct semantics for actions) — an accessibility win.
 */
function CTAButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  ...rest
}) {
  const classes = `${styles.btn} ${styles[variant] || ''} ${className}`.trim();

  if (href) {
    return (
      <a className={classes} href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

export default memo(CTAButton);
