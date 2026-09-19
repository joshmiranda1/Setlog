import { Link } from 'react-router-dom';
import styles from './AppHeader.module.css';

/** Top bar: wordmark, the nav (children) and an optional right slot. */
export default function AppHeader({ title = 'Setlog', aside, children }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.wordmark} aria-label={`${title}, go to Today`}>
          <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="8" />
            <path d="M8 13v6M11 11v10M21 11v10M24 13v6M11 16h10" />
          </svg>
          {title}
        </Link>
        {children}
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
    </header>
  );
}
