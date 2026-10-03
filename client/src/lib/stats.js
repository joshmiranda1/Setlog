export const volumeOf = (sets) => sets.reduce((sum, s) => sum + s.reps * s.weight, 0);/**Added the code myself - 09/20/2026 */

/** Groups sets by exercise, in the order each exercise was first logged. */
export function groupSetsByExercise(sets, exercisesById) {
  const groups = new Map();
  for (const set of sets) {
    if (!groups.has(set.exercise_id)) {
      groups.set(set.exercise_id, {
        exercise: exercisesById.get(set.exercise_id) ?? { id: set.exercise_id, name: 'Deleted exercise', muscle_group: '' },
        sets: [],
      });
    }
    groups.get(set.exercise_id).sets.push(set);
  }
  return [...groups.values()];
}

/** The heaviest set, ties broken by more reps. */
export function bestSet(sets) {
  return sets.reduce((best, s) =>
    !best || s.weight > best.weight || (s.weight === best.weight && s.reps > best.reps) ? s : best, null);
}

/** One point per session for an exercise, oldest first. */
export function progressFor(exerciseId, sets, sessionsById) {
  const bySession = new Map();
  for (const set of sets) {
    if (set.exercise_id !== exerciseId) continue;
    if (!bySession.has(set.session_id)) bySession.set(set.session_id, []);
    bySession.get(set.session_id).push(set);
  }
  return [...bySession.entries()]
    .map(([sessionId, list]) => {
      const top = bestSet(list);
      return {
        sessionId,
        date: sessionsById.get(sessionId)?.date,
        topWeight: top.weight,
        best: top,
        reps: list.reduce((sum, s) => sum + s.reps, 0),
        volume: volumeOf(list),
        setCount: list.length,
      };
    })
    .filter((p) => p.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

/** The most recent set of an exercise, optionally preferring one session. */
export function lastSetOf(exerciseId, sets, sessionsById, preferSessionId) {
  let latest = null;
  let latestTime = -Infinity;
  for (const set of sets) {
    if (set.exercise_id !== exerciseId) continue;
    const time =
      set.session_id === preferSessionId ? Infinity : new Date(sessionsById.get(set.session_id)?.date ?? 0).getTime();
    if (time > latestTime || (time === latestTime && set.id > latest.id)) {
      latest = set;
      latestTime = time;
    }
  }
  return latest;
}
