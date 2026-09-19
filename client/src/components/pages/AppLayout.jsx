import { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowClockwise } from '@phosphor-icons/react';
import Button from '../atoms/Button.jsx';
import ThemeToggle from '../molecules/ThemeToggle.jsx';
import AppHeader from '../organisms/AppHeader.jsx';
import NavBar from '../organisms/NavBar.jsx';
import Toast from '../organisms/Toast.jsx';
import { useAppData } from '../../state/AppDataContext.jsx';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const { loading, error, reload, activeSessionId, toast, dismissToast, exercises } = useAppData();
  const { pathname } = useLocation();
  const firstRender = useRef(true);

  // Move focus to the new page's heading so screen readers announce the change.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo(0, 0);
    // Lazy routes render their heading a moment later, so poll briefly.
    let timer;
    let tries = 0;
    const focusTitle = () => {
      const title = document.querySelector('[data-page-title]');
      if (title) title.focus({ preventScroll: true });
      else if (tries++ < 60) timer = setTimeout(focusTitle, 50);
    };
    focusTitle();
    return () => clearTimeout(timer);
  }, [pathname]);

  const hasData = exercises.length > 0;

  let content;
  if (loading && !hasData) {
    content = <LoadingState />;
  } else if (error && !hasData) {
    content = <ErrorState message={error} onRetry={reload} />;
  } else {
    content = <Outlet />;
  }

  return (
    <div className={styles.app}>
      <a href="#main" className={styles.skip}>
        Skip to content
      </a>
      <AppHeader
        actions={<ThemeToggle />}
        aside={
          activeSessionId && pathname !== '/' ? (
            <Link to="/" className={styles.live}>
              <span className={styles.dot} aria-hidden="true" />
              Session live
            </Link>
          ) : null
        }
      >
        <NavBar />
      </AppHeader>
      <main id="main" className={styles.main}>
        <div key={pathname} className={styles.page}>
          {content}
        </div>
      </main>
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}

function LoadingState() {
  return (
    <div className={styles.loading} aria-busy="true" aria-label="Loading your training log">
      <div className={`${styles.skeleton} ${styles.skelTitle}`} />
      <div className={`${styles.skeleton} ${styles.skelBlock}`} />
      <div className={`${styles.skeleton} ${styles.skelLine}`} />
      <div className={`${styles.skeleton} ${styles.skelLine}`} />
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className={styles.error} role="alert">
      <p className={styles.errorEyebrow}>Can’t load data</p>
      <h1 className={styles.errorTitle} tabIndex={-1} data-page-title>
        Setlog can’t reach its database.
      </h1>
      <p className={styles.errorMessage}>{message}</p>
      <p className={styles.errorHelp}>
        Check that PostgreSQL is running, that <code>server/.env</code> has the right <code>DATABASE_URL</code>, and that
        you ran <code>npm run db:setup</code>.
      </p>
      <Button variant="secondary" onClick={onRetry} icon={<ArrowClockwise size={18} aria-hidden="true" />}>
        Try again
      </Button>
    </div>
  );
}
