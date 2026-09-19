CREATE TABLE exercises (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,
  muscle_group TEXT NOT NULL
);

-- "Bench Press" and "bench press" should count as the same exercise.
CREATE UNIQUE INDEX exercises_name_lower_idx ON exercises (LOWER(name));

CREATE TABLE sessions (
  id   SERIAL PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX sessions_date_idx ON sessions (date DESC);

CREATE TABLE sets (
  id          SERIAL PRIMARY KEY,
  session_id  INTEGER NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises (id) ON DELETE CASCADE,
  reps        INTEGER NOT NULL CHECK (reps > 0),
  weight      NUMERIC(6, 2) NOT NULL CHECK (weight >= 0)
);

CREATE INDEX sets_session_id_idx ON sets (session_id);
CREATE INDEX sets_exercise_id_idx ON sets (exercise_id);
