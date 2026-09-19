import { CaretDown } from '@phosphor-icons/react';
import styles from './Select.module.css';

/**
 * options: [{ value, label }] or grouped: [{ label, options: [{ value, label }] }]
 */
export default function Select({ options = [], placeholder, className = '', ...rest }) {
  const renderOption = (o) => (
    <option key={o.value} value={o.value}>
      {o.label}
    </option>
  );
  return (
    <span className={`${styles.wrap} ${className}`}>
      <select className={styles.select} {...rest}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) =>
          o.options ? (
            <optgroup key={o.label} label={o.label}>
              {o.options.map(renderOption)}
            </optgroup>
          ) : (
            renderOption(o)
          ),
        )}
      </select>
      <CaretDown className={styles.caret} size={16} weight="bold" aria-hidden="true" />
    </span>
  );
}
