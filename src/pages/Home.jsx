import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import styles from './Home.module.css';

/*
 * Simple index page linking to the two demo versions. Kept intentionally light.
 */
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.wrap}>
        <div className={styles.card}>
          <p className={styles.eyebrow}>Frontend Performance Demo</p>
          <h1 className={styles.title}>Ramky Estates — Hero Section Rebuild</h1>
          <p className={styles.lead}>
            The same luxury real-estate hero, built two ways. Run Lighthouse on
            each route (mobile) and compare the numbers.
          </p>

          <div className={styles.links}>
            <Link className={`${styles.link} ${styles.before}`} to="/before">
              <span className={styles.linkTag}>BEFORE</span>
              <span className={styles.linkText}>Unoptimized version</span>
            </Link>
            <Link className={`${styles.link} ${styles.after}`} to="/after">
              <span className={styles.linkTag}>AFTER</span>
              <span className={styles.linkText}>Optimized version</span>
            </Link>
          </div>

          <p className={styles.note}>
            Tip: open DevTools → Lighthouse → Mobile → Analyze, for
            <code> /before</code> and <code> /after</code>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
