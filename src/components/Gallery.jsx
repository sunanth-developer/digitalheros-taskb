import LazyImage from './LazyImage.jsx';
import styles from './Gallery.module.css';

// Optimized (After) responsive assets — WebP + JPEG fallback at 2 widths.
import interiorWebp600 from '../assets/interior-600.webp';
import interiorWebp1000 from '../assets/interior-1000.webp';
import interiorJpg600 from '../assets/interior-600.jpg';
import interiorJpg1000 from '../assets/interior-1000.jpg';
import interior2Webp600 from '../assets/interior2-600.webp';
import interior2Webp1000 from '../assets/interior2-1000.webp';
import interior2Jpg600 from '../assets/interior2-600.jpg';
import interior2Jpg1000 from '../assets/interior2-1000.jpg';

// Unoptimized (Before) full-size JPEGs.
import interiorBefore from '../assets/interior-before.jpg';
import interior2Before from '../assets/interior2-before.jpg';

const PROJECTS = [
  {
    id: 'odyssey',
    title: 'Ramky One Odyssey',
    location: 'Hyderabad',
    tag: 'Ongoing',
    webp: `${interiorWebp600} 600w, ${interiorWebp1000} 1000w`,
    jpg: `${interiorJpg600} 600w, ${interiorJpg1000} 1000w`,
    fallback: interiorJpg1000,
    before: interiorBefore,
  },
  {
    id: 'galaxia',
    title: 'Ramky One Galaxia',
    location: 'Bengaluru',
    tag: 'Completed',
    webp: `${interior2Webp600} 600w, ${interior2Webp1000} 1000w`,
    jpg: `${interior2Jpg600} 600w, ${interior2Jpg1000} 1000w`,
    fallback: interior2Jpg1000,
    before: interior2Before,
  },
  {
    id: 'kosmos',
    title: 'Ramky One Kosmos',
    location: 'Visakhapatnam',
    tag: 'Upcoming',
    webp: `${interiorWebp600} 600w, ${interiorWebp1000} 1000w`,
    jpg: `${interiorJpg600} 600w, ${interiorJpg1000} 1000w`,
    fallback: interiorJpg1000,
    before: interior2Before,
  },
];

/*
 * Below-the-fold "Our Projects" grid.
 *
 * When `optimized` is true (After page) each card uses <LazyImage>, which lazy-
 * loads via IntersectionObserver and serves responsive WebP. When false (Before
 * page) each card renders a plain, eager, full-size <img> — the anti-pattern.
 */
export default function Gallery({ optimized = false }) {
  return (
    <section className={styles.section} id="projects">
      <div className="container">
        <p className={styles.eyebrow}>Our Projects</p>
        <h2 className={styles.heading}>Signature developments</h2>

        <div className={styles.grid}>
          {PROJECTS.map((p) => (
            <article key={p.id} className={styles.card}>
              <div className={styles.media}>
                {optimized ? (
                  <LazyImage
                    src={p.fallback}
                    webpSrcSet={p.webp}
                    jpgSrcSet={p.jpg}
                    sizes="(max-width: 720px) 100vw, 33vw"
                    alt={`${p.title}, a residential project in ${p.location}`}
                    width={600}
                    height={420}
                  />
                ) : (
                  // Anti-pattern: eager, full-size JPEG, no responsive sizes.
                  <img
                    className={styles.plainImg}
                    src={p.before}
                    alt={`${p.title} in ${p.location}`}
                  />
                )}
              </div>
              <div className={styles.body}>
                <span className={styles.tag}>{p.tag}</span>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.location}>{p.location}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
