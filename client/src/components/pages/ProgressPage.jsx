import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, TrendDown, TrendUp } from '@phosphor-icons/react';
import ExercisePicker from '../molecules/ExercisePicker.jsx';
import PageTitle from '../molecules/PageTitle.jsx';
import ProgressChart, { METRICS } from '../organisms/ProgressChart.jsx';
import ProgressTable from '../organisms/ProgressTable.jsx';
import { useAppData } from '../../state/AppDataContext.jsx';
import { formatShortDate, formatSet, plural } from '../../lib/format.js';
import { progressFor } from '../../lib/stats.js';
import styles from './ProgressPage.module.css';

export default function ProgressPage() {
  const { exercises, sets: allSets, sessionsById, exercisesById, activeSessionId } = useAppData();
  // A half-finished session would drag volume and reps down, so it joins the chart once finished.
  const sets = useMemo(
    () => (activeSessionId ? allSets.filter((s) => s.session_id !== activeSessionId) : allSets),
    [allSets, activeSessionId],
  );
  const activeHasExercise = (id) => allSets.some((s) => s.session_id === activeSessionId && s.exercise_id === id);

  // Default to the exercise logged in the most sessions.
  const [selectedExerciseId, setSelectedExerciseId] = useState(() => {
    const sessionsPerExercise = new Map();
    for (const s of sets) {
      if (!sessionsPerExercise.has(s.exercise_id)) sessionsPerExercise.set(s.exercise_id, new Set());
      sessionsPerExercise.get(s.exercise_id).add(s.session_id);
    }
    let best = exercises[0]?.id ?? null;
    let bestCount = 0;
    for (const [id, ids] of sessionsPerExercise) {
      if (ids.size > bestCount) [best, bestCount] = [id, ids.size];
    }
    return best;
  });
  const [chosenMetric, setChosenMetric] = useState(null);

  const exercise = exercisesById.get(selectedExerciseId);
  const points = useMemo(
    () => (selectedExerciseId ? progressFor(selectedExerciseId, sets, sessionsById) : []),
    [selectedExerciseId, sets, sessionsById],
  );

  const bodyweight = points.length > 0 && points.every((p) => p.topWeight === 0);
  const metricOptions = bodyweight ? ['reps'] : ['topWeight', 'volume', 'reps'];
  const metric = metricOptions.includes(chosenMetric) ? chosenMetric : metricOptions[0];
  const { unit, label, format } = METRICS[metric];

  const first = points[0];
  const latest = points.at(-1);
  const change = first && latest ? latest[metric] - first[metric] : 0;
  const pct = first && first[metric] ? (change / first[metric]) * 100 : 0;
  const best = points.reduce((max, p) => Math.max(max, p[metric]), 0);
  const direction = points.length < 2 || change === 0 ? 'flat' : change > 0 ? 'up' : 'down';
  const TrendIcon = { up: TrendUp, down: TrendDown, flat: Minus }[direction];

  const summary =
    points.length < 2
      ? 'Not enough sessions to show a trend yet.'
      : `${label} ${direction === 'up' ? 'up' : direction === 'down' ? 'down' : 'unchanged'} ${format(Math.abs(change))} ${unit} over ${plural(points.length, 'session')}, from ${format(first[metric])} to ${format(latest[metric])} ${unit}.`;

  const headline = {
    up: 'Going up.',
    down: 'Going down.',
    flat: points.length < 2 ? 'Too early to tell.' : 'Holding steady.',
  }[direction];

  return (
    <>
      <PageTitle eyebrow="Progress" title={exercise ? exercise.name : 'Progress'} />

      <div className={styles.controls}>
        <div className={styles.picker}>
          <ExercisePicker
            id="progress-exercise"
            exercises={exercises}
            value={selectedExerciseId}
            onChange={setSelectedExerciseId}
          />
        </div>
        {points.length > 0 && (
          <fieldset className={styles.segmented}>
            <legend className={styles.legend}>Measure</legend>
            <div className={styles.segments}>
              {metricOptions.map((key) => (
                <label key={key} className={styles.segment}>
                  <input
                    type="radio"
                    name="metric"
                    value={key}
                    checked={metric === key}
                    onChange={() => setChosenMetric(key)}
                  />
                  <span>{METRICS[key].label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      {points.length === 0 ? (
        <div className={styles.empty}>
          <p>{exercise ? `No sets of ${exercise.name} logged yet.` : 'Add an exercise to track progress.'}</p>
          <Link to="/" className={styles.emptyLink}>
            Log a set on Today
          </Link>
        </div>
      ) : (
        <>
          <section className={styles.verdict} aria-labelledby="verdict-heading">
            <h2 id="verdict-heading" className={styles.verdictHeading}>
              <TrendIcon size={28} weight="bold" aria-hidden="true" />
              {headline}
            </h2>
            <p className={styles.verdictText}>{summary}</p>
            {activeSessionId && activeHasExercise(selectedExerciseId) && (
              <p className={styles.verdictNote}>Today’s session will be added when you finish it.</p>
            )}
          </section>

          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt>Latest</dt>
              <dd>
                {format(latest[metric])}
                <span className={styles.unit}> {unit}</span>
              </dd>
            </div>
            <div className={styles.stat}>
              <dt>Change since {formatShortDate(first.date)}</dt>
              <dd>
                {change > 0 ? '+' : change < 0 ? '−' : '±'}
                {format(Math.abs(change))}
                <span className={styles.unit}>
                  {' '}
                  {unit}
                  {pct ? ` (${pct > 0 ? '+' : ''}${pct.toFixed(0)}%)` : ''}
                </span>
              </dd>
            </div>
            <div className={styles.stat}>
              <dt>Best</dt>
              <dd>
                {format(best)}
                <span className={styles.unit}> {unit}</span>
              </dd>
            </div>
            <div className={styles.stat}>
              <dt>Latest best set</dt>
              <dd className={styles.small}>{formatSet(latest.best)}</dd>
            </div>
          </dl>

          <div className={styles.split}>
            <section className={styles.chartCol} aria-labelledby="chart-heading">
              <h2 id="chart-heading" className={styles.sectionHeading}>
                {label} per session <span className={styles.sectionNote}>{METRICS[metric].describe}</span>
              </h2>
              <ProgressChart points={points} metric={metric} summary={summary} />
            </section>
            <section className={styles.tableCol} aria-labelledby="table-heading">
              <h2 id="table-heading" className={styles.sectionHeading}>
                Sessions
              </h2>
              <ProgressTable exerciseName={exercise?.name ?? ''} points={points} />
            </section>
          </div>
        </>
      )}
    </>
  );
}
