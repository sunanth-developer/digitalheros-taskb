import styles from './Footer.module.css';

/*
 * Required submission credit. Must stay visible on every public page so
 * Digital Heroes can verify the build is yours.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.credit}>
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built for Digital Heroes Training Task
        </a>
      </p>
    </footer>
  );
}
