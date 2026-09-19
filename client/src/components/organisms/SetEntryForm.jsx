import { useEffect, useRef, useState } from 'react';
import { Check, Minus, Plus } from '@phosphor-icons/react';
import Button from '../atoms/Button.jsx';
import IconButton from '../atoms/IconButton.jsx';
import Input from '../atoms/Input.jsx';
import ExercisePicker from '../molecules/ExercisePicker.jsx';
import FormField from '../molecules/FormField.jsx';
import { formatSet } from '../../lib/format.js';
import styles from './SetEntryForm.module.css';

const WEIGHT_STEP = 2.5;

const initialValues = (lastSet) => ({
  reps: lastSet ? String(lastSet.reps) : '',
  weight: lastSet ? String(lastSet.weight) : '',
});

function validate({ reps, weight }) {
  const errors = {};
  const r = Number(reps);
  const w = Number(weight);
  if (reps === '') errors.reps = 'Enter reps.';
  else if (!Number.isInteger(r) || r < 1 || r > 1000) errors.reps = 'Use a whole number from 1 to 1000.';
  if (weight === '') errors.weight = 'Enter a weight (0 for bodyweight).';
  else if (!Number.isFinite(w) || w < 0 || w > 2000) errors.weight = 'Use 0 to 2000 kg.';
  return errors;
}

/**
 * Picks an exercise and logs one set. Owns the reps/weight inputs; the selected
 * exercise is owned by TodayPage and passed in.
 */
export default function SetEntryForm({ exercises, selectedExerciseId, onSelectExercise, lastSet, onAddSet }) {
  const [values, setValues] = useState(() => initialValues(lastSet));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [prefilledFor, setPrefilledFor] = useState(selectedExerciseId);
  const repsRef = useRef(null);
  const addedTimer = useRef(null);

  // Switching exercise prefills with the last set logged for it.
  if (prefilledFor !== selectedExerciseId) {
    setPrefilledFor(selectedExerciseId);
    setValues(initialValues(lastSet));
    setErrors({});
    setSubmitError(null);
  }

  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  const step = (field, delta, min) => {
    setValues((v) => {
      const current = Number(v[field]) || 0;
      const next = Math.max(min, Math.round((current + delta) * 100) / 100);
      return { ...v, [field]: String(next) };
    });
    setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setSubmitError(null);
    if (found.reps) return repsRef.current?.focus();
    if (found.weight) return document.getElementById('set-weight')?.focus();

    setSaving(true);
    try {
      await onAddSet({ exercise_id: selectedExerciseId, reps: Number(values.reps), weight: Number(values.weight) });
      // Keep the values: the next set is usually the same.
      setJustAdded(true);
      clearTimeout(addedTimer.current);
      addedTimer.current = setTimeout(() => setJustAdded(false), 1400);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const describedBy = (field) => (errors[field] ? `set-${field}-error` : undefined);

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate aria-labelledby="set-entry-heading">
      <h2 id="set-entry-heading" className={styles.heading}>
        Log a set
      </h2>

      <ExercisePicker
        id="set-exercise"
        exercises={exercises}
        value={selectedExerciseId}
        onChange={onSelectExercise}
        hint={lastSet ? `Last time: ${formatSet(lastSet)}` : 'First time logging this one.'}
      />

      <div className={styles.numbers}>
        <FormField label="Reps" id="set-reps" error={errors.reps}>
          <div className={styles.stepper}>
            <IconButton label="One fewer rep" onClick={() => step('reps', -1, 1)}>
              <Minus size={16} weight="bold" aria-hidden="true" />
            </IconButton>
            <Input
              ref={repsRef}
              id="set-reps"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={values.reps}
              onChange={update('reps')}
              invalid={!!errors.reps}
              aria-describedby={describedBy('reps')}
              className={styles.stepperInput}
            />
            <IconButton label="One more rep" onClick={() => step('reps', 1, 1)}>
              <Plus size={16} weight="bold" aria-hidden="true" />
            </IconButton>
          </div>
        </FormField>

        <FormField label="Weight (kg)" id="set-weight" error={errors.weight}>
          <div className={styles.stepper}>
            <IconButton label={`${WEIGHT_STEP} kg lighter`} onClick={() => step('weight', -WEIGHT_STEP, 0)}>
              <Minus size={16} weight="bold" aria-hidden="true" />
            </IconButton>
            <Input
              id="set-weight"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.25"
              value={values.weight}
              onChange={update('weight')}
              invalid={!!errors.weight}
              aria-describedby={describedBy('weight')}
              className={styles.stepperInput}
            />
            <IconButton label={`${WEIGHT_STEP} kg heavier`} onClick={() => step('weight', WEIGHT_STEP, 0)}>
              <Plus size={16} weight="bold" aria-hidden="true" />
            </IconButton>
          </div>
        </FormField>
      </div>

      <Button
        type="submit"
        fullWidth
        loading={saving}
        disabled={!selectedExerciseId}
        icon={justAdded ? <Check size={18} weight="bold" aria-hidden="true" /> : null}
      >
        {justAdded ? 'Set added' : 'Add set'}
      </Button>

      {submitError && (
        <p className={styles.submitError} role="alert">
          {submitError}
        </p>
      )}
    </form>
  );
}
