import { Link } from 'react-router-dom';
import { CaretRight } from '@phosphor-icons/react';
import ExerciseThumb from '../atoms/ExerciseThumb.jsx';
import Tag from '../atoms/Tag.jsx';
import styles from './GuideRow.module.css';

export default function GuideRow({ exercise, inLibrary }) {
  return (
    <li className={styles.item}>
      <Link to={`/exercises/guide/${exercise.slug}`} className={styles.row}>
        <ExerciseThumb slug={exercise.slug} size={64} />
        <span className={styles.text}>
          <span className={styles.name}>{exercise.name}</span>
          <span className={styles.meta}>
            {exercise.primary} · {exercise.equipment}
          </span>
        </span>
        {inLibrary && <Tag>In library</Tag>}
        <CaretRight className={styles.caret} size={18} aria-hidden="true" />
      </Link>
    </li>
  );
}
