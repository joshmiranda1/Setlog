import Tag from '../atoms/Tag.jsx';
import SetRow from '../molecules/SetRow.jsx';
import { formatVolume, plural } from '../../lib/format.js';
import { bestSet, volumeOf } from '../../lib/stats.js';
import styles from './ExerciseSetGroup.module.css';

/** One exercise and its sets. Omit onDeleteSet for a read-only list. */
export default function ExerciseSetGroup({ exercise, sets, onDeleteSet, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const volume = volumeOf(sets);
  // Only call out a top set when it actually stands out from the others.
  const best = volume > 0 ? bestSet(sets) : null;
  const top = best && sets.some((s) => s.weight !== best.weight || s.reps !== best.reps) ? best : null;

  return (
    <section className={styles.group} aria-label={exercise.name}>
      <header className={styles.header}>
        <Heading className={styles.name}>{exercise.name}</Heading>
        {exercise.muscle_group && <Tag>{exercise.muscle_group}</Tag>}
        <span className={styles.summary}>
          {plural(sets.length, 'set')}
          {volume > 0 && <> · {formatVolume(volume)}</>}
        </span>
      </header>
      <ul className={styles.sets}>
        {sets.map((set, i) => (
          <SetRow
            key={set.id}
            setNumber={i + 1}
            reps={set.reps}
            weight={set.weight}
            exerciseName={exercise.name}
            isTop={top?.id === set.id}
            onDelete={onDeleteSet ? () => onDeleteSet(set) : undefined}
          />
        ))}
      </ul>
    </section>
  );
}
