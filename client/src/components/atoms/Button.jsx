import styles from './Button.module.css';

export default function Button({
  variant = 'primary',
  type = 'button',
  loading = false,
  fullWidth = false,
  icon,
  disabled,
  children,
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.full : ''} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : icon}
      <span>{children}</span>
    </button>
  );
}
