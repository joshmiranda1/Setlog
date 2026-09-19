import { useMemo, useState } from 'react';
import { Trash } from '@phosphor-icons/react';
import Button from '../atoms/Button.jsx';
import SessionCard from '../molecules/SessionCard.jsx';
import ExerciseSetGroup from './ExerciseSetGroup.jsx';
import { groupSetsByExercise, volumeOf } from '../../lib/stats.js';
import { formatShortDate } from '../../lib/format.js';
import styles from './SessionList.module.css';

export default function SessionList({
  sessions,
  sets,
  exercisesById,
  activeSessionId,
  expandedId,
  onToggle,
  onDeleteSet,
  onDeleteSession,
}) {
  const [deletingId, setDeletingId] = useState(null);

  const setsBySession = useMemo(() => {
    const map = new Map();
    for (const s of sets) {
      if (!map.has(s.session_id)) map.set(s.session_id, []);
      map.get(s.session_id).push(s);
    }
    return map;
  }, [sets]);

  async function handleDeleteSession(session) {
    if (!window.confirm(`Delete the session from ${formatShortDate(session.date)} and all its sets?`)) return;
    setDeletingId(session.id);
    try {
      await onDeleteSession(session.id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ul className={styles.grid}>
      {sessions.map((session) => {
        const list = setsBySession.get(session.id) ?? [];
        const groups = groupSetsByExercise(list, exercisesById);
        const expanded = expandedId === session.id;
        return (
          <li key={session.id}>
            <SessionCard
              session={session}
              exerciseCount={groups.length}
              setCount={list.length}
              volume={volumeOf(list)}
              expanded={expanded}
              isActive={session.id === activeSessionId}
              onToggle={() => onToggle(expanded ? null : session.id)}
            >
              {groups.length ? (
                groups.map((g) => (
                  <ExerciseSetGroup key={g.exercise.id} exercise={g.exercise} sets={g.sets} onDeleteSet={onDeleteSet} />
                ))
              ) : (
                <p className={styles.empty}>No sets were logged in this session.</p>
              )}
              <div className={styles.footer}>
                <Button
                  variant="ghost"
                  icon={<Trash size={18} aria-hidden="true" />}
                  loading={deletingId === session.id}
                  onClick={() => handleDeleteSession(session)}
                >
                  Delete session
                </Button>
              </div>
            </SessionCard>
          </li>
        );
      })}
    </ul>
  );
}
