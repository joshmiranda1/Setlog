import { useState } from 'react';
import { X } from '@phosphor-icons/react';
import IconButton from '../atoms/IconButton.jsx';
import { formatKg } from '../../lib/format.js';
import styles from './SetRow.module.css';

export default function SetRow({ setNumber, reps, weight, exerciseName, onDelete, isTop = false }) {
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    setBusy(true);
    try {
      await onDelete();
    } catch {
      setBusy(false);
    }
  }

  return (
    <li className={`${styles.row} ${busy ? styles.leaving : ''}`}>
      <span className={styles.number} aria-hidden="true">
        {String(setNumber).padStart(2, '0')}
      </span>
      <span className={styles.value}>
        <span className="visually-hidden">Set {setNumber}: </span>
        <strong className={styles.reps}>{reps}</strong>
        <span className={styles.times}>×</span>
        {weight > 0 ? (
          <span className={styles.weight}>{formatKg(weight)}</span>
        ) : (
          <span className={styles.weight}>bodyweight</span>
        )}
        {isTop && <span className={styles.top}>top set</span>}
      </span>
      {onDelete && (
        <IconButton label={`Delete set ${setNumber} of ${exerciseName}`} onClick={handleDelete} disabled={busy}>
          <X size={18} weight="bold" aria-hidden="true" />
        </IconButton>
      )}
    </li>
  );
}
