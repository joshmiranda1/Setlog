import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Flag, Play } from '@phosphor-icons/react';
import Button from '../atoms/Button.jsx';
import Input from '../atoms/Input.jsx';
import FormField from '../molecules/FormField.jsx';
import PageTitle from '../molecules/PageTitle.jsx';
import SetEntryForm from '../organisms/SetEntryForm.jsx';
import SetGroupList from '../organisms/SetGroupList.jsx';
import { useAppData } from '../../state/AppDataContext.jsx';
import {
  formatCompact,
  formatVolume,
  formatLongDate,
  formatNumber,
  formatShortDate,
  plural,
  relativeDay,
} from '../../lib/format.js';
import { groupSetsByExercise, lastSetOf, volumeOf } from '../../lib/stats.js';
import styles from './TodayPage.module.css';

export default function TodayPage() {
  const { activeSessionId, sessionsById } = useAppData();
  const session = activeSessionId ? sessionsById.get(activeSessionId) : null;
  return session ? <ActiveSession session={session} /> : <Idle />;
}

function Idle() {
  const { sessions, sets, startSession } = useAppData();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  const last = sessions[0];
  const lastSets = last ? sets.filter((s) => s.session_id === last.id) : [];

  const week = useMemo(() => {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - 6);
    const ids = new Set(sessions.filter((s) => new Date(s.date) >= since).map((s) => s.id));
    const weekSets = sets.filter((s) => ids.has(s.session_id));
    return { sessions: ids.size, sets: weekSets.length, volume: volumeOf(weekSets) };
  }, [sessions, sets]);

  async function handleStart() {
    setStarting(true);
    setError(null);
    try {
      await startSession();
    } catch (err) {
      setError(err.message);
      setStarting(false);
    }
  }

  return (
    <>
      <PageTitle eyebrow="Today" title={formatLongDate(new Date())} />

      <section className={styles.idle} aria-labelledby="idle-heading">
        <h2 id="idle-heading" className={styles.idleHeading}>
          No session in progress.
        </h2>
        <p className={styles.idleText}>Start one, then log each set as you finish it.</p>
        <Button onClick={handleStart} loading={starting} icon={<Play size={18} weight="fill" aria-hidden="true" />}>
          Start session
        </Button>
        {error && (
          <p className={styles.inlineError} role="alert">
            {error}
          </p>
        )}
      </section>

      <h2 className={styles.statsHeading} id="week-heading">
        Last 7 days
      </h2>
      <dl className={styles.stats} aria-labelledby="week-heading">
        <div className={styles.stat}>
          <dt>Sessions</dt>
          <dd>{week.sessions}</dd>
        </div>
        <div className={styles.stat}>
          <dt>Sets</dt>
          <dd>{week.sets}</dd>
        </div>
        <div className={styles.stat}>
          <dt>Volume</dt>
          <dd title={`${formatNumber(week.volume)} kg`}>
            {formatCompact(week.volume)}
            <span className={styles.unit}> kg</span>
          </dd>
        </div>
      </dl>

      {last && (
        <Link to="/history" className={styles.lastSession}>
          <span className={styles.lastLabel}>Last session · {relativeDay(last.date)}</span>
          <span className={styles.lastTitle}>{last.note || formatShortDate(last.date)}</span>
          <span className={styles.lastMeta}>
            {formatShortDate(last.date)} · {plural(lastSets.length, 'set')}
          </span>
          <ArrowRight className={styles.lastArrow} size={20} aria-hidden="true" />
        </Link>
      )}
    </>
  );
}

function ActiveSession({ session }) {
  const navigate = useNavigate();
  const { exercises, exercisesById, sessionsById, sets, addSet, deleteSet, updateSessionNote, finishSession, notify } =
    useAppData();

  const sessionSets = useMemo(() => sets.filter((s) => s.session_id === session.id), [sets, session.id]);
  const groups = useMemo(() => groupSetsByExercise(sessionSets, exercisesById), [sessionSets, exercisesById]);

  // Local UI state: which exercise the form is logging.
  const [selectedExerciseId, setSelectedExerciseId] = useState(
    () => sessionSets.at(-1)?.exercise_id ?? exercises[0]?.id ?? null,
  );
  const lastSet = selectedExerciseId ? lastSetOf(selectedExerciseId, sets, sessionsById, session.id) : null;

  const [note, setNote] = useState(session.note);
  const [noteStatus, setNoteStatus] = useState(null);
  const [finishing, setFinishing] = useState(false);

  async function saveNote() {
    if (note === session.note) return;
    setNoteStatus('Saving…');
    try {
      await updateSessionNote(session.id, note);
      setNoteStatus('Saved');
    } catch (err) {
      setNoteStatus(`Not saved: ${err.message}`);
    }
  }

  async function handleFinish() {
    if (!sessionSets.length && !window.confirm('No sets logged yet. Discard this empty session?')) return;
    setFinishing(true);
    try {
      await saveNote();
      const { discarded } = await finishSession();
      if (discarded) notify('Empty session discarded');
      else
        notify(`Session saved · ${plural(sessionSets.length, 'set')}`, {
          label: 'View',
          run: () => navigate('/history'),
        });
    } catch (err) {
      notify(err.message);
      setFinishing(false);
    }
  }

  const volume = volumeOf(sessionSets);
  const started = new Date(session.date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  return (
    <>
      <PageTitle eyebrow={`Session in progress · started ${started}`} title={formatLongDate(session.date)} />

      <div className={styles.layout}>
        <div className={styles.note}>
          <FormField
            label="Session note"
            id="session-note"
            hint={noteStatus ?? 'Saved when you leave the field.'}
          >
            <Input
              id="session-note"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setNoteStatus(null);
              }}
              onBlur={saveNote}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              placeholder="e.g. Push day, felt strong"
              maxLength={500}
              aria-describedby="session-note-hint"
            />
          </FormField>
        </div>

        <div className={styles.form}>
          <SetEntryForm
            exercises={exercises}
            selectedExerciseId={selectedExerciseId}
            onSelectExercise={setSelectedExerciseId}
            lastSet={lastSet}
            onAddSet={addSet}
          />
        </div>

        <section className={styles.sets} aria-labelledby="session-sets-heading">
          <div className={styles.setsHeader}>
            <h2 id="session-sets-heading" className={styles.setsHeading}>
              This session
            </h2>
            <p className={styles.setsSummary} aria-live="polite">
              {plural(groups.length, 'exercise')} · {plural(sessionSets.length, 'set')}
              {volume > 0 && <> · {formatVolume(volume)}</>}
            </p>
          </div>
          <SetGroupList
            groups={groups}
            onDeleteSet={deleteSet}
            emptyMessage="Nothing logged yet. Your sets will appear here."
          />
        </section>

        <div className={styles.finish}>
          <Button
            variant="secondary"
            fullWidth
            loading={finishing}
            onClick={handleFinish}
            icon={<Flag size={18} aria-hidden="true" />}
          >
            Finish session
          </Button>
        </div>
      </div>
    </>
  );
}
