import styles from './IconButton.module.css';

/** Icon-only button. `label` becomes the accessible name. */
export default function IconButton({ label, type = 'button', className = '', children, ...rest }) {
  return (
    <button type={type} className={`${styles.iconButton} ${className}`} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
}
