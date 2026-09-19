import { useMemo } from 'react';
import PageTitle from '../molecules/PageTitle.jsx';
import ExerciseForm from '../organisms/ExerciseForm.jsx';
import ExerciseList from '../organisms/ExerciseList.jsx';
import { useAppData } from '../../state/AppDataContext.jsx';
import { plural } from '../../lib/format.js';
import styles from './ExercisesPage.module.css';

export default function ExercisesPage() {
  const { exercises, sets, addExercise, updateExercise, deleteExercise, notify } = useAppData();

  const setCounts = useMemo(() => {
    const counts = new Map();
    for (const s of sets) counts.set(s.exercise_id, (counts.get(s.exercise_id) ?? 0) + 1);
    return counts;
  }, [sets]);

  const muscleGroups = useMemo(() => [...new Set(exercises.map((e) => e.muscle_group))], [exercises]);

  async function handleAdd(fields) {
    const created = await addExercise(fields);
    notify(`Added ${created.name}`);
  }

  async function handleDelete(exercise) {
    await deleteExercise(exercise.id);
    notify(`Deleted ${exercise.name}`);
  }

  return (
    <>
      <PageTitle eyebrow="Library" title="Exercises">
        <span className={styles.count}>
          {plural(exercises.length, 'exercise')} · {plural(muscleGroups.length, 'group')}
        </span>
      </PageTitle>

      <div className={styles.split}>
        <div className={styles.formCol}>
          <ExerciseForm muscleGroups={muscleGroups} onAdd={handleAdd} />
        </div>
        <div className={styles.listCol}>
          <ExerciseList
            exercises={exercises}
            setCounts={setCounts}
            onRename={(id, name) => updateExercise(id, { name })}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
}
