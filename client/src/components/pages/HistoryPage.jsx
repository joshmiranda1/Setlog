import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../molecules/PageTitle.jsx';
import SessionList from '../organisms/SessionList.jsx';
import { useAppData } from '../../state/AppDataContext.jsx';
import { plural } from '../../lib/format.js';
import styles from './HistoryPage.module.css';

export default function HistoryPage() {
  const { sessions, sets, exercisesById, activeSessionId, deleteSet, deleteSession, notify } = useAppData();
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  async function handleDeleteSession(id) {
    try {
      await deleteSession(id);
      notify('Session deleted');
    } catch (err) {
      notify(err.message);
    }
  }

  return (
    <>
      <PageTitle eyebrow="History" title="Past sessions">
        <span className={styles.count}>{plural(sessions.length, 'session')}</span>
      </PageTitle>

      {sessions.length === 0 ? (
        <div className={styles.empty}>
          <p>No sessions yet.</p>
          <Link to="/" className={styles.emptyLink}>
            Start your first session
          </Link>
        </div>
      ) : (
        <SessionList
          sessions={sessions}
          sets={sets}
          exercisesById={exercisesById}
          activeSessionId={activeSessionId}
          expandedId={expandedSessionId}
          onToggle={setExpandedSessionId}
          onDeleteSet={deleteSet}
          onDeleteSession={handleDeleteSession}
        />
      )}
    </>
  );
}
