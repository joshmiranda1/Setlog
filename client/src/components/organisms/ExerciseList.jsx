import { useMemo, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import Input from '../atoms/Input.jsx';
import ExerciseRow from '../molecules/ExerciseRow.jsx';
import styles from './ExerciseList.module.css';

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function ExerciseList({ exercises, setCounts, onRename, onDelete }) {
  const [filter, setFilter] = useState('');

  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const map = new Map();
    for (const e of exercises) {
      if (q && !e.name.toLowerCase().includes(q) && !e.muscle_group.toLowerCase().includes(q)) continue;
      if (!map.has(e.muscle_group)) map.set(e.muscle_group, []);
      map.get(e.muscle_group).push(e);
    }
    return [...map.entries()];
  }, [exercises, filter]);

  return (
    <div className={styles.wrap}>
      <div className={styles.search}>
        <label htmlFor="exercise-filter" className="visually-hidden">
          Filter exercises
        </label>
        <MagnifyingGlass className={styles.searchIcon} size={18} aria-hidden="true" />
        <Input
          id="exercise-filter"
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={`Filter ${exercises.length} exercises`}
          className={styles.searchInput}
          autoComplete="off"
        />
      </div>

      {groups.length === 0 ? (
        <p className={styles.empty}>
          {exercises.length ? `Nothing matches "${filter}".` : 'No exercises yet. Add your first one.'}
        </p>
      ) : (
        groups.map(([group, list]) => (
          <section key={group} className={styles.group} aria-labelledby={`group-${slug(group)}`}>
            <h2 id={`group-${slug(group)}`} className={styles.groupHeading}>
              {group} <span className={styles.groupCount}>{list.length}</span>
            </h2>
            <ul>
              {list.map((e) => (
                <ExerciseRow
                  key={e.id}
                  exercise={e}
                  setCount={setCounts.get(e.id) ?? 0}
                  onRename={(name) => onRename(e.id, name)}
                  onDelete={() => onDelete(e)}
                />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
