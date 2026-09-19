import { NavLink } from 'react-router-dom';
import styles from './NavItem.module.css';

export default function NavItem({ to, label, icon: Icon }) {
  return (
    <li className={styles.item}>
      <NavLink to={to} end={to === '/'} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
        {({ isActive }) => (
          <>
            <Icon className={styles.icon} size={22} weight={isActive ? 'fill' : 'regular'} aria-hidden="true" />
            <span className={styles.label}>{label}</span>
          </>
        )}
      </NavLink>
    </li>
  );
}
