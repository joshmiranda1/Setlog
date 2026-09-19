// Resets the database to demo data: 23 exercises and four weeks of a
// push / pull / legs program with steady progressive overload.
// WARNING: this deletes every existing exercise, session, and set.
import { pool, withTransaction } from '../src/db.js';

const EXERCISES = [
  ['Bench Press', 'Chest'],
  ['Incline Dumbbell Press', 'Chest'],
  ['Chest Fly', 'Chest'],
  ['Push-ups', 'Chest'],
  ['Deadlift', 'Back'],
  ['Barbell Row', 'Back'],
  ['Pull-ups', 'Back'],
  ['Lat Pulldown', 'Back'],
  ['Seated Cable Row', 'Back'],
  ['Squat', 'Legs'],
  ['Romanian Deadlift', 'Legs'],
  ['Leg Press', 'Legs'],
  ['Walking Lunges', 'Legs'],
  ['Calf Raises', 'Legs'],
  ['Overhead Press', 'Shoulders'],
  ['Lateral Raises', 'Shoulders'],
  ['Face Pulls', 'Shoulders'],
  ['Bicep Curls', 'Arms'],
  ['Hammer Curls', 'Arms'],
  ['Tricep Dips', 'Arms'],
  ['Tricep Pushdown', 'Arms'],
  ['Skull Crushers', 'Arms'],
  ['Hanging Leg Raises', 'Core'],
];

// [exercise, sets, base reps, base kg, kg added per week, reps added per week]
// Bodyweight moves use 0 kg and progress by reps instead.
const PROGRAM = {
  push: {
    notes: ['Push day', 'Push: bench felt fast', 'Push day, short on sleep', 'Push: new top set on bench'],
    lifts: [
      ['Bench Press', 4, 8, 60, 2.5, 0],
      ['Overhead Press', 3, 8, 37.5, 1.25, 0],
      ['Incline Dumbbell Press', 3, 10, 22, 1, 0],
      ['Lateral Raises', 3, 12, 8, 0, 1],
      ['Tricep Pushdown', 3, 12, 25, 2.5, 0],
      ['Tricep Dips', 3, 8, 0, 0, 1],
    ],
  },
  pull: {
    notes: ['Pull day', 'Pull: grip gave out on deadlifts', 'Pull day', 'Pull: deadlift moving well'],
    lifts: [
      ['Deadlift', 3, 5, 100, 5, 0],
      ['Pull-ups', 3, 6, 0, 0, 1],
      ['Barbell Row', 3, 8, 60, 2.5, 0],
      ['Face Pulls', 3, 15, 20, 0, 0],
      ['Bicep Curls', 3, 10, 12, 1, 0],
      ['Hammer Curls', 2, 12, 12, 0, 0],
    ],
  },
  legs: {
    notes: ['Leg day', 'Legs: squat depth better', 'Leg day, gym busy', 'Legs: squat PR'],
    lifts: [
      ['Squat', 4, 5, 80, 5, 0],
      ['Romanian Deadlift', 3, 8, 70, 2.5, 0],
      ['Leg Press', 3, 10, 120, 10, 0],
      ['Calf Raises', 3, 15, 60, 5, 0],
      ['Hanging Leg Raises', 3, 10, 0, 0, 1],
    ],
  },
};

// Monday, Wednesday, Friday of each of the last four weeks.
const SCHEDULE = [
  [0, 'push'],
  [2, 'pull'],
  [4, 'legs'],
];
const WEEKS = 4;

function sessionDate(dayIndex) {
  // dayIndex 0 is 27 days ago, so the most recent session lands 2 days ago.
  const d = new Date();
  d.setDate(d.getDate() - (WEEKS * 7 - 1 - dayIndex));
  d.setHours(18, 0, 0, 0);
  return d;
}

async function main() {
  const summary = await withTransaction(async (client) => {
    await client.query('TRUNCATE sets, sessions, exercises RESTART IDENTITY CASCADE');

    const ids = {};
    for (const [name, group] of EXERCISES) {
      const { rows } = await client.query(
        'INSERT INTO exercises (name, muscle_group) VALUES ($1, $2) RETURNING id',
        [name, group],
      );
      ids[name] = rows[0].id;
    }

    let sessionCount = 0;
    let setCount = 0;
    for (let week = 0; week < WEEKS; week++) {
      for (const [day, key] of SCHEDULE) {
        const program = PROGRAM[key];
        const { rows } = await client.query(
          'INSERT INTO sessions (date, note) VALUES ($1, $2) RETURNING id',
          [sessionDate(week * 7 + day), program.notes[week]],
        );
        const sessionId = rows[0].id;
        sessionCount++;

        for (const [name, sets, reps, kg, kgPerWeek, repsPerWeek] of program.lifts) {
          const weight = kg + kgPerWeek * week;
          for (let s = 0; s < sets; s++) {
            const last = s === sets - 1;
            // Last set drops a rep on odd weeks, like real fatigue.
            const setReps = reps + repsPerWeek * week - (last && week % 2 === 1 ? 1 : 0);
            await client.query(
              'INSERT INTO sets (session_id, exercise_id, reps, weight) VALUES ($1, $2, $3, $4)',
              [sessionId, ids[name], setReps, weight],
            );
            setCount++;
          }
        }
      }
    }
    return { exercises: EXERCISES.length, sessions: sessionCount, sets: setCount };
  });

  console.log(`Seeded ${summary.exercises} exercises, ${summary.sessions} sessions, ${summary.sets} sets.`);
}

main()
  .catch((err) => {
    console.error(`Seed failed: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
