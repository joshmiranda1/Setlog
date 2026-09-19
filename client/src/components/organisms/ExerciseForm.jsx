import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import Button from '../atoms/Button.jsx';
import Input from '../atoms/Input.jsx';
import FormField from '../molecules/FormField.jsx';
import styles from './ExerciseForm.module.css';

const DEFAULT_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

export default function ExerciseForm({ muscleGroups, onAdd }) {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const groups = [...new Set([...DEFAULT_GROUPS, ...muscleGroups])];

  async function handleSubmit(e) {
    e.preventDefault();
    const found = {};
    if (!name.trim()) found.name = 'Enter a name.';
    if (!group.trim()) found.group = 'Choose or type a muscle group.';
    setErrors(found);
    if (found.name) return document.getElementById('exercise-name')?.focus();
    if (found.group) return document.getElementById('exercise-group')?.focus();

    setSaving(true);
    try {
      await onAdd({ name: name.trim(), muscle_group: group.trim() });
      setName('');
      document.getElementById('exercise-name')?.focus();
    } catch (err) {
      setErrors({ name: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate aria-labelledby="exercise-form-heading">
      <h2 id="exercise-form-heading" className={styles.heading}>
        Add an exercise
      </h2>
      <FormField label="Name" id="exercise-name" error={errors.name}>
        <Input
          id="exercise-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Front Squat"
          maxLength={100}
          autoComplete="off"
          invalid={!!errors.name}
          aria-describedby={errors.name ? 'exercise-name-error' : undefined}
        />
      </FormField>
      <FormField
        label="Muscle group"
        id="exercise-group"
        error={errors.group}
        hint="Pick one from the list or type a new group."
      >
        <Input
          id="exercise-group"
          list="muscle-groups"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          placeholder="e.g. Legs"
          maxLength={40}
          autoComplete="off"
          invalid={!!errors.group}
          aria-describedby={errors.group ? 'exercise-group-error' : 'exercise-group-hint'}
        />
        <datalist id="muscle-groups">
          {groups.map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>
      </FormField>
      <Button type="submit" fullWidth loading={saving} icon={<Plus size={18} weight="bold" aria-hidden="true" />}>
        Add exercise
      </Button>
    </form>
  );
}
