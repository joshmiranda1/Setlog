import { useMemo } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import Input from '../atoms/Input.jsx';
import Select from '../atoms/Select.jsx';
import FormField from '../molecules/FormField.jsx';
import GuideRow from '../molecules/GuideRow.jsx';
import { guideEquipment, guideMuscles, searchGuide } from '../../lib/guide.js';
import { plural } from '../../lib/format.js';
import styles from './GuideList.module.css';

const toOptions = (values, allLabel) => [{ value: '', label: allLabel }, ...values.map((v) => ({ value: v, label: v }))];
const MUSCLE_OPTIONS = toOptions(guideMuscles, 'All muscles');
const EQUIPMENT_OPTIONS = toOptions(guideEquipment, 'All equipment');

/** Searchable list of every guide movement. Filters live in the URL so Back restores them. */
export default function GuideList({ filters, onChange, librarySlugs }) {
  const results = useMemo(() => searchGuide(filters), [filters]);
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className={styles.wrap}>
      <div className={styles.filters}>
        <div className={styles.search}>
          <label htmlFor="guide-search" className="visually-hidden">
            Search movements
          </label>
          <MagnifyingGlass className={styles.searchIcon} size={18} aria-hidden="true" />
          <Input
            id="guide-search"
            type="search"
            value={filters.q}
            onChange={set('q')}
            placeholder="Search 302 movements"
            className={styles.searchInput}
            autoComplete="off"
          />
        </div>
        <FormField label="Muscle" id="guide-muscle">
          <Select id="guide-muscle" value={filters.muscle} onChange={set('muscle')} options={MUSCLE_OPTIONS} />
        </FormField>
        <FormField label="Equipment" id="guide-equipment">
          <Select id="guide-equipment" value={filters.equipment} onChange={set('equipment')} options={EQUIPMENT_OPTIONS} />
        </FormField>
      </div>

      <p className={styles.count} aria-live="polite">
        {plural(results.length, 'movement')}
      </p>

      {results.length ? (
        <ul className={styles.list}>
          {results.map((g) => (
            <GuideRow key={g.slug} exercise={g} inLibrary={librarySlugs.has(g.slug)} />
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No movements match those filters.</p>
      )}
    </div>
  );
}
