import { useMemo } from 'react';
import Select from '../atoms/Select.jsx';
import FormField from './FormField.jsx';

/** Exercise <select>, grouped by muscle group. */
export default function ExercisePicker({ id, exercises, value, onChange, label = 'Exercise', hint }) {
  const options = useMemo(() => {
    const groups = new Map();
    for (const e of exercises) {
      if (!groups.has(e.muscle_group)) groups.set(e.muscle_group, []);
      groups.get(e.muscle_group).push({ value: e.id, label: e.name });
    }
    return [...groups.entries()].map(([group, opts]) => ({ label: group, options: opts }));
  }, [exercises]);

  return (
    <FormField label={label} id={id} hint={hint}>
      <Select
        id={id}
        value={value ?? ''}
        onChange={(e) => onChange(Number(e.target.value))}
        options={options}
        placeholder="Choose an exercise"
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
    </FormField>
  );
}
