import styles from './Tag.module.css';

export default function Tag({ variant = 'outline', children }) {
  return <span className={`${styles.tag} ${styles[variant]}`}>{children}</span>;
}
