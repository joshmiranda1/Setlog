import ExerciseSetGroup from './ExerciseSetGroup.jsx';
import styles from './SetGroupList.module.css';

export default function SetGroupList({ groups, onDeleteSet, emptyMessage = 'No sets yet.' }) {
  if (!groups.length) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }
  return (
    <div className={styles.list}>
      {groups.map((g) => (
        <ExerciseSetGroup key={g.exercise.id} exercise={g.exercise} sets={g.sets} onDeleteSet={onDeleteSet} />
      ))}
    </div>
  );
}
