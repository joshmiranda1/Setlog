import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageTitle from '../molecules/PageTitle.jsx';
import ExerciseForm from '../organisms/ExerciseForm.jsx';
import ExerciseList from '../organisms/ExerciseList.jsx';
import GuideList from '../organisms/GuideList.jsx';
import { useAppData } from '../../state/AppDataContext.jsx';
import { findGuideFor, guideExercises } from '../../lib/guide.js';
import { plural } from '../../lib/format.js';
import styles from './ExercisesPage.module.css';

export default function ExercisesPage() {
  const { exercises, sets, addExercise, updateExercise, deleteExercise, notify } = useAppData();
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'guide' ? 'guide' : 'library';

  const setCounts = useMemo(() => {
    const counts = new Map();
    for (const s of sets) counts.set(s.exercise_id, (counts.get(s.exercise_id) ?? 0) + 1);
    return counts;
  }, [sets]);

  const muscleGroups = useMemo(() => [...new Set(exercises.map((e) => e.muscle_group))], [exercises]);

  // Library exercise id -> guide slug, and the set of slugs already in the library.
  const guideSlugs = useMemo(() => new Map(exercises.map((e) => [e.id, findGuideFor(e.name)?.slug])), [exercises]);
  const librarySlugs = useMemo(() => new Set([...guideSlugs.values()].filter(Boolean)), [guideSlugs]);

  const guideFilters = { q: params.get('q') ?? '', muscle: params.get('muscle') ?? '', equipment: params.get('equipment') ?? '' };
  const setGuideFilters = (next) => {
    const p = new URLSearchParams({ view: 'guide' });
    for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
    setParams(p, { replace: true });
  };

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
          {view === 'guide'
            ? `${guideExercises.length} movements`
            : `${plural(exercises.length, 'exercise')} · ${plural(muscleGroups.length, 'group')}`}
        </span>
      </PageTitle>

      <nav className={styles.tabs} aria-label="Exercise views">
        <Link to="/exercises" className={styles.tab} aria-current={view === 'library' ? 'page' : undefined}>
          My library
        </Link>
        <Link to="/exercises?view=guide" className={styles.tab} aria-current={view === 'guide' ? 'page' : undefined}>
          Movement guide
        </Link>
      </nav>

      {view === 'guide' ? (
        <GuideList filters={guideFilters} onChange={setGuideFilters} librarySlugs={librarySlugs} />
      ) : (
        <div className={styles.split}>
          <div className={styles.formCol}>
            <ExerciseForm muscleGroups={muscleGroups} onAdd={handleAdd} />
          </div>
          <div className={styles.listCol}>
            <ExerciseList
              exercises={exercises}
              setCounts={setCounts}
              guideSlugs={guideSlugs}
              onRename={(id, name) => updateExercise(id, { name })}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
    </>
  );
}
