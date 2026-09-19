import styles from './Input.module.css';

/** Text or number input. `suffix` renders a unit (e.g. "kg") inside the field. */
export default function Input({ type = 'text', suffix, invalid = false, className = '', ...rest }) {
  const input = (
    <input
      type={type}
      className={`${styles.input} ${suffix ? styles.hasSuffix : ''} ${className}`}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
  if (!suffix) return input;
  return (
    <span className={styles.wrap}>
      {input}
      <span className={styles.suffix} aria-hidden="true">
        {suffix}
      </span>
    </span>
  );
}
