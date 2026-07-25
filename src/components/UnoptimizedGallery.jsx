import styles from './Gallery.module.css';

// BEFORE-ONLY: oversized JPEGs, eagerly decoded. Kept in a separate module so
// the After chunk never downloads these multi‑MB assets.
import interiorBefore from '../assets/interior-before.jpg';
import interior2Before from '../assets/interior2-before.jpg';

const PROJECTS = [
  {
    id: 'odyssey',
    title: 'Ramky One Odyssey',
    location: 'Hyderabad',
    tag: 'Ongoing',
    src: interiorBefore,
  },
  {
    id: 'galaxia',
    title: 'Ramky One Galaxia',
    location: 'Bengaluru',
    tag: 'Completed',
    src: interior2Before,
  },
  {
    id: 'kosmos',
    title: 'Ramky One Kosmos',
    location: 'Visakhapatnam',
    tag: 'Upcoming',
    src: interiorBefore,
  },
  {
    id: 'discovery',
    title: 'Ramky Discovery City',
    location: 'Hyderabad',
    tag: 'Ongoing',
    src: interior2Before,
  },
  {
    id: 'grove',
    title: 'Gardenia Grove Villas',
    location: 'Chennai',
    tag: 'Completed',
    src: interiorBefore,
  },
  {
    id: 'huddle',
    title: 'The Huddle',
    location: 'Bengaluru',
    tag: 'Upcoming',
    src: interior2Before,
  },
];

/*
 * Unoptimized projects grid — every image is a full-size eager <img> with no
 * dimensions, no srcSet, and no lazy loading. Six of them compete with the hero.
 */
export default function UnoptimizedGallery() {
  return (
    <section className={styles.section} id="projects">
      <div className="container">
        <p className={styles.eyebrow}>Our Projects</p>
        <h2 className={styles.heading}>Signature developments</h2>

        <div className={styles.grid}>
          {PROJECTS.map((p) => (
            <article key={p.id} className={styles.card}>
              <div className={styles.media}>
                <img className={styles.plainImg} src={p.src} alt={`${p.title} in ${p.location}`} />
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
