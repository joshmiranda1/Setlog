import { Moon, Sun } from '@phosphor-icons/react';
import { useTheme } from '../../lib/theme.js';
import styles from './ThemeToggle.module.css';

/** Two-option switch: Light / Dark. */
export default function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  return (
    <div className={styles.toggle} role="group" aria-label="Colour theme">
      <button
        type="button"
        className={styles.option}
        aria-pressed={theme === 'light'}
        onClick={() => setTheme('light')}
        title="Light mode"
      >
        <Sun size={18} weight={theme === 'light' ? 'fill' : 'regular'} aria-hidden="true" />
        <span className="visually-hidden">Light mode</span>
      </button>
      <button
        type="button"
        className={styles.option}
        aria-pressed={theme === 'dark'}
        onClick={() => setTheme('dark')}
        title="Dark mode"
      >
        <Moon size={18} weight={theme === 'dark' ? 'fill' : 'regular'} aria-hidden="true" />
        <span className="visually-hidden">Dark mode</span>
      </button>
    </div>
  );
}
