import { formatShortDate, formatSet, formatVolume } from '../../lib/format.js';
import styles from './ProgressTable.module.css';

/** Text version of the chart, newest first. */
export default function ProgressTable({ exerciseName, points }) {
  const rows = [...points].reverse();
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className="visually-hidden">{exerciseName}: best set and volume per session, newest first</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Best set</th>
            <th scope="col" className={styles.num}>
              Volume
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => {
            const prev = rows[i + 1];
            const up = prev && p.topWeight > prev.topWeight;
            return (
              <tr key={p.sessionId}>
                <th scope="row" className={styles.date}>
                  {formatShortDate(p.date)}
                </th>
                <td className={styles.mono}>
                  {formatSet(p.best)}
                  {up && (
                    <span className={styles.up} title="Heavier than the session before">
                      <span aria-hidden="true">↑</span>
                      <span className="visually-hidden"> heavier than previous session</span>
                    </span>
                  )}
                </td>
                <td className={`${styles.mono} ${styles.num}`}>{p.volume > 0 ? formatVolume(p.volume) : '–'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
