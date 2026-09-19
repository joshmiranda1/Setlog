import { useState } from 'react';
import { X } from '@phosphor-icons/react';
import styles from './Toast.module.css';

/** Short-lived status message with an optional action (e.g. Undo). Never steals focus. */
export default function Toast({ toast, onDismiss }) {
  const [running, setRunning] = useState(false);

  async function runAction() {
    setRunning(true);
    try {
      await toast.action.run();
      onDismiss();
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className={styles.toast}>
          <span className={styles.message}>{toast.message}</span>
          {toast.action && (
            <button type="button" className={styles.action} onClick={runAction} disabled={running}>
              {toast.action.label}
            </button>
          )}
          <button type="button" className={styles.close} onClick={onDismiss} aria-label="Dismiss message">
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
