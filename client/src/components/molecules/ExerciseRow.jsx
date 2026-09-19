import { useState } from 'react';
import { Check, PencilSimple, Trash, X } from '@phosphor-icons/react';
import IconButton from '../atoms/IconButton.jsx';
import Input from '../atoms/Input.jsx';
import Tag from '../atoms/Tag.jsx';
import { plural } from '../../lib/format.js';
import styles from './ExerciseRow.module.css';

export default function ExerciseRow({ exercise, setCount, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(exercise.name);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const inputId = `exercise-name-${exercise.id}`;

  function startEdit() {
    setName(exercise.name);
    setError(null);
    setEditing(true);
  }

  async function save(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError('Name cannot be empty.');
    if (trimmed === exercise.name) return setEditing(false);
    setBusy(true);
    try {
      await onRename(trimmed);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    const warning = setCount
      ? `Delete ${exercise.name}? This also deletes its ${plural(setCount, 'logged set')}.`
      : `Delete ${exercise.name}?`;
    if (!window.confirm(warning)) return;
    setBusy(true);
    try {
      await onDelete();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <li className={styles.row}>
        <form className={styles.editForm} onSubmit={save}>
          <label htmlFor={inputId} className="visually-hidden">
            Exercise name
          </label>
          <Input
            id={inputId}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
            invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            autoFocus
            maxLength={100}
          />
          <IconButton label="Save name" type="submit" disabled={busy}>
            <Check size={18} weight="bold" aria-hidden="true" />
          </IconButton>
          <IconButton label="Cancel editing" onClick={() => setEditing(false)}>
            <X size={18} weight="bold" aria-hidden="true" />
          </IconButton>
        </form>
        {error && (
          <p id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </p>
        )}
      </li>
    );
  }

  return (
    <li className={styles.row}>
      <div className={styles.main}>
        <div className={styles.text}>
          <span className={styles.name}>{exercise.name}</span>
          <span className={styles.meta}>
            <Tag>{exercise.muscle_group}</Tag>
            <span className={styles.count}>{setCount ? plural(setCount, 'set') + ' logged' : 'Not logged yet'}</span>
          </span>
        </div>
        <div className={styles.actions}>
          <IconButton label={`Rename ${exercise.name}`} onClick={startEdit} disabled={busy}>
            <PencilSimple size={18} aria-hidden="true" />
          </IconButton>
          <IconButton label={`Delete ${exercise.name}`} onClick={remove} disabled={busy}>
            <Trash size={18} aria-hidden="true" />
          </IconButton>
        </div>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </li>
  );
}
