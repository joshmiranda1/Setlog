import { Barbell } from '@phosphor-icons/react';
import { frameUrl } from '../../lib/guide.js';
import styles from './ExerciseThumb.module.css';

/** Small first-frame illustration. Decorative: the exercise name is always shown beside it. */
export default function ExerciseThumb({ slug, size = 56 }) {
  return (
    <span className={styles.thumb} style={{ width: size, height: size }} aria-hidden="true">
      {slug ? (
        <img src={frameUrl(slug, 1)} alt="" width={size} height={size} loading="lazy" decoding="async" />
      ) : (
        <Barbell size={size * 0.4} className={styles.placeholder} />
      )}
    </span>
  );
}
