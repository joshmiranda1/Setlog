import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Plus } from '@phosphor-icons/react';
import Button from '../atoms/Button.jsx';
import IconButton from '../atoms/IconButton.jsx';
import BodyMap from '../organisms/BodyMap.jsx';
import FrameViewer from '../organisms/FrameViewer.jsx';
import { useAppData } from '../../state/AppDataContext.jsx';
import { findGuideFor, getGuide, libraryGroupFor, typeLabel } from '../../lib/guide.js';
import { plural } from '../../lib/format.js';
import styles from './ExerciseGuidePage.module.css';

export default function ExerciseGuidePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { exercises, sets, addExercise, notify } = useAppData();
  const [adding, setAdding] = useState(false);
  const exercise = getGuide(slug);

  const libraryExercise = useMemo(
    () => exercises.find((e) => findGuideFor(e.name)?.slug === slug) ?? null,
    [exercises, slug],
  );
  const loggedSets = libraryExercise ? sets.filter((s) => s.exercise_id === libraryExercise.id).length : 0;

  // Go back to wherever the user came from (keeps list filters); fall back to the guide list.
  const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate('/exercises?view=guide'));

  async function handleAdd() {
    setAdding(true);
    try {
      await addExercise({ name: exercise.name, muscle_group: libraryGroupFor(exercise.primary) });
      notify(`Added ${exercise.name} to your library`);
    } catch (err) {
      notify(err.message);
    } finally {
      setAdding(false);
    }
  }

  if (!exercise) {
    return (
      <div className={styles.missing}>
        <h1 tabIndex={-1} data-page-title>
          Movement not found.
        </h1>
        <Link to="/exercises?view=guide">Browse the movement guide</Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.topbar}>
        <IconButton label="Back" onClick={goBack} className={styles.back}>
          <ArrowLeft size={20} aria-hidden="true" />
        </IconButton>
        <span className={styles.topTitle}>Exercise</span>
      </div>

      <div className={styles.layout}>
        <section className={`${styles.card} ${styles.hero}`} aria-labelledby="guide-title">
          <p className={styles.eyebrow}>{exercise.primary}</p>
          <h1 id="guide-title" className={styles.title} tabIndex={-1} data-page-title>
            {exercise.name}
          </h1>
          <p className={styles.meta}>
            {exercise.equipment} · {typeLabel(exercise.type)}
            {exercise.stretch && ' · stretch'}
          </p>
          <FrameViewer key={exercise.slug} slug={exercise.slug} name={exercise.name} frames={exercise.frames} />
        </section>

        <div className={styles.side}>
          <section className={styles.card} aria-label="Muscles worked">
            <BodyMap primary={exercise.primary} secondary={exercise.secondary} />
          </section>

          <section className={`${styles.card} ${styles.library}`} aria-label="Your library">
            {libraryExercise ? (
              <p className={styles.inLibrary}>
                <Check size={18} weight="bold" aria-hidden="true" />
                In your library as <strong>{libraryExercise.name}</strong> ·{' '}
                {loggedSets ? `${plural(loggedSets, 'set')} logged` : 'not logged yet'}
              </p>
            ) : (
              <>
                <p className={styles.libraryText}>Add it to your library to log sets and track progress.</p>
                <Button onClick={handleAdd} loading={adding} icon={<Plus size={18} weight="bold" aria-hidden="true" />}>
                  Add to my library
                </Button>
              </>
            )}
          </section>

          <p className={styles.credit}>
            Illustration by{' '}
            <a href={exercise.credit.url} target="_blank" rel="noreferrer">
              {exercise.credit.creator}
            </a>{' '}
            from the Workout Guide library, based in part on{' '}
            <a href="https://github.com/everkinetic/data" target="_blank" rel="noreferrer">
              Everkinetic
            </a>
            . Licensed{' '}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">
              {exercise.credit.license}
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
