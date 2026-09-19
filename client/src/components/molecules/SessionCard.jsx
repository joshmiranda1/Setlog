import { CaretDown } from '@phosphor-icons/react';
import Tag from '../atoms/Tag.jsx';
import { formatShortDate, formatVolume, plural, relativeDay } from '../../lib/format.js';
import styles from './SessionCard.module.css';

/** A past session. The expanded body (set groups) is passed in as children. */
export default function SessionCard({ session, exerciseCount, setCount, volume, expanded, onToggle, isActive, children }) {
  const bodyId = `session-${session.id}-body`;
  return (
    <article className={`${styles.card} ${expanded ? styles.expanded : ''}`}>
      <h2 className={styles.heading}>
        <button type="button" className={styles.toggle} aria-expanded={expanded} aria-controls={bodyId} onClick={onToggle}>
          <span className={styles.top}>
            <span className={styles.date}>{formatShortDate(session.date)}</span>
            <span className={styles.relative}>{relativeDay(session.date)}</span>
            {isActive && <Tag variant="solid">In progress</Tag>}
          </span>
          <span className={styles.note}>{session.note || 'No note'}</span>
          <span className={styles.summary}>
            {plural(exerciseCount, 'exercise')} · {plural(setCount, 'set')}
            {volume > 0 && <> · {formatVolume(volume)} volume</>}
          </span>
          <CaretDown className={styles.caret} size={20} weight="bold" aria-hidden="true" />
        </button>
      </h2>
      <div id={bodyId} className={styles.body} hidden={!expanded}>
        {expanded && children}
      </div>
    </article>
  );
}
