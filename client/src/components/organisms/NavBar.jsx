import { Barbell, ChartLineUp, ClockCounterClockwise, ListBullets } from '@phosphor-icons/react';
import NavItem from '../molecules/NavItem.jsx';
import styles from './NavBar.module.css';

const ROUTES = [
  { to: '/', label: 'Today', icon: Barbell },
  { to: '/history', label: 'History', icon: ClockCounterClockwise },
  { to: '/progress', label: 'Progress', icon: ChartLineUp },
  { to: '/exercises', label: 'Exercises', icon: ListBullets },
];

/** Fixed to the bottom on phones, inline in the header from 768px up. */
export default function NavBar() {
  return (
    <nav className={styles.nav} aria-label="Main">
      <ul className={styles.list}>
        {ROUTES.map((r) => (
          <NavItem key={r.to} {...r} />
        ))}
      </ul>
    </nav>
  );
}
