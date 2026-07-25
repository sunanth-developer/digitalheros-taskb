import { memo, useState } from 'react';
import Logo from './Logo.jsx';
import CTAButton from './CTAButton.jsx';
import styles from './Navbar.module.css';

const DEFAULT_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Legacy', href: '#legacy' },
  { label: 'Contact', href: '#contact' },
];

/*
 * Top navigation used inside the Hero.
 *
 * React.memo: the navbar's props are static, so it should never re-render after
 * mount. Memoizing removes it from any parent re-render cascade.
 *
 * Accessibility: uses a real <nav> landmark, an aria-label, a button with
 * aria-expanded for the mobile menu, and keyboard-focusable links.
 */
function Navbar({ links = DEFAULT_LINKS }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.nav} aria-label="Primary">
      <a href="#top" className={styles.brand} aria-label="Ramky Estates home">
        <Logo />
      </a>

      <button
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="primary-menu"
        aria-label="Toggle navigation menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      <div
        id="primary-menu"
        className={`${styles.menu} ${open ? styles.menuOpen : ''}`}
      >
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <CTAButton href="#enquire" variant="ghost" className={styles.navCta}>
          Enquire Now
        </CTAButton>
      </div>
    </nav>
  );
}

export default memo(Navbar);
