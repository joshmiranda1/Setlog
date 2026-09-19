import styles from './PageTitle.module.css';

/** Page heading. The <h1> receives focus after navigation (see AppLayout). */
export default function PageTitle({ eyebrow, title, children }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.text}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title} tabIndex={-1} data-page-title>
          {title}
        </h1>
      </div>
      {children && <div className={styles.aside}>{children}</div>}
    </div>
  );
}
