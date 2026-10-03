# Setlog: Workout Set Tracker

[![Made with AI](https://img.shields.io/badge/Made_with-AI_assistance-blue)](AI-USAGE.md)

Built with extensive Claude AI and Codex assistance. Read the [AI-use record and code attribution](AI-USAGE.md).

Log every set (reps × kg) of each workout, then see exercise by exercise whether your lifts are going up.
Planning docs live in [`docs/`](docs/) (proposal, wireframes, design system).

| Part | Stack | Folder |
| --- | --- | --- |
| Front end | React 19 + Vite, React Router, Recharts, CSS Modules | [`client/`](client/) |
| API | Node + Express 5, `pg` connection pool | [`server/`](server/) |
| Database | PostgreSQL (3 tables: `exercises`, `sessions`, `sets`) | [`server/db/migrations/`](server/db/migrations/) |

React never talks to Postgres. It calls the REST API with `fetch`, and in development Vite proxies `/api` to Express on port 4000.

## How to run it

It takes about 5 minutes. All commands are run from the project root folder (the one containing this README).

### 1. Prerequisites

| Tool | Version | Check with |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | **22.9 or newer** (developed on 24) | `node -v` |
| [PostgreSQL](https://www.postgresql.org/download/) | **14 or newer**, running on port 5432 | `psql --version`, or look for the PostgreSQL service |

When you install PostgreSQL, you choose a password for the `postgres` user. You'll need it in step 3.

### 2. Install dependencies

```bash
npm run install:all
```

This installs packages for the root, `server/` and `client/`.

### 3. Point the app at your database

Copy the template file:

```bash
cp server/.env.example server/.env
```

On Windows Command Prompt, use `copy server\.env.example server\.env`. You can also duplicate the file in your editor.

Open `server/.env` and replace `YOUR_PASSWORD` with your PostgreSQL password:

```
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/setlog
```

You don't need to create the `setlog` database yourself. The next step creates it.

### 4. Create the tables and load demo data

```bash
npm run db:setup
```

Expected output:

```
Created database "setlog"
Applied 001_init.sql
Done: 1 migration(s) applied.
Seeded 23 exercises, 12 sessions, 208 sets.
```

The demo data covers four weeks of push/pull/legs workouts, so History and Progress have something to show right away.

### 5. Start the app

```bash
npm run dev
```

This starts the API on http://localhost:4000 and the web app on http://localhost:5173. **Open http://localhost:5173** in a browser. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop both.

### Things to try

1. **Today:** click **Start session**, pick *Bench Press*, and click **Add set**. The form prefills from your last set. Use the − / + buttons to change reps or weight. Then click **Finish session**.
2. **History:** click a session card to expand it. You can delete a set, and **Undo** brings it back.
3. **Progress:** pick an exercise and switch between *Top set*, *Volume* and *Total reps*.
4. **Exercises → My library:** add, rename, filter or delete exercises. Click a name to open its illustrated guide.
5. **Exercises → Movement guide:** browse 302 illustrated movements, filter by muscle or equipment, and open one to see it animate and see the muscles it works. **Add to my library** makes it loggable.
6. Use the **sun/moon switch** in the header to change between light and dark mode. It starts from your system setting and remembers your choice.
7. Narrow the browser (or use the phone view in DevTools). The navigation moves to a bottom bar.

### Troubleshooting

| Problem | Fix |
| --- | --- |
| `password authentication failed for user "postgres"` | The password in `server/.env` is wrong. If it contains `@ : / # ?`, URL-encode those characters (for example, `@` becomes `%40`). |
| `ECONNREFUSED` / "Setlog can't reach its database" | PostgreSQL isn't running. On Windows, start the **postgresql-x64-…** service in `services.msc`. On macOS with Homebrew, run `brew services start postgresql`. |
| `DATABASE_URL is not set` | `server/.env` is missing (see step 3). |
| `bad option: --env-file-if-exists` | Node.js is too old. Install 22.9 or newer. |
| Port 4000 or 5173 already in use | Close the other program, or change `PORT` in `server/.env` and the proxy target in `client/vite.config.js`. |
| Want the original demo data back | `npm run seed`. **This deletes all data** and reseeds it. |

## Scripts (root)

| Script | What it does |
| --- | --- |
| `npm run dev` | API (port 4000, auto-restarts) + Vite (port 5173) together |
| `npm run migrate` | Applies any new `server/db/migrations/*.sql` files, tracked in `schema_migrations` |
| `npm run seed` | Resets the database to the demo data |
| `npm run db:setup` | `migrate` then `seed` |
| `npm run build` | Production build of the client into `client/dist` |

## REST API

All bodies are JSON. Errors come back as `{ "error": "message" }` with a 400, 404, 409 or 503 status.

| Method | Path | Body / query | Notes |
| --- | --- | --- | --- |
| GET | `/api/health` | | Checks the DB connection |
| GET | `/api/exercises` | | Sorted by muscle group, then name |
| POST | `/api/exercises` | `{ name, muscle_group }` | 409 if the name exists (case-insensitive) |
| PATCH | `/api/exercises/:id` | `{ name?, muscle_group? }` | |
| DELETE | `/api/exercises/:id` | | Cascades to its sets |
| GET | `/api/sessions` | | Newest first |
| GET | `/api/sessions/:id` | | |
| POST | `/api/sessions` | `{ note? }` | `date` defaults to now |
| PATCH | `/api/sessions/:id` | `{ note }` | |
| DELETE | `/api/sessions/:id` | | Cascades to its sets |
| GET | `/api/sets` | `?session_id=` optional | |
| POST | `/api/sets` | `{ session_id, exercise_id, reps, weight }` | reps 1 to 1000, weight 0 to 2000 kg |
| DELETE | `/api/sets/:id` | | |

## How the app works

- **State:** `App` owns `exercises`, `sessions`, `sets`, `activeSessionId`, `loading` and `error` (see `client/src/state/AppDataContext.jsx`) and shares them through context. `TodayPage` owns `selectedExerciseId`, and `SetEntryForm` owns the reps and weight inputs.
- **Active session:** the schema has no "finished" flag, so the id of the in-progress session is kept in `localStorage`. **Finish session** clears it, and discards the session if no sets were logged. Progress leaves out the in-progress session until it's finished, so a half-done workout doesn't read as a drop.
- **Movement guide:** the illustrations come from the [Workout Guide](https://github.com/bryllim/workout-guide) library (302 exercises, 3 frames each). `client/scripts/sync-workout-guide.mjs` copies its SVG frames into `client/public/workout-guide/` and its metadata into `client/src/data/workout-guide.json`. Those copies are committed, so no extra setup is needed. Library exercises are matched to illustrations by name (`client/src/lib/guide.js`), so no database change was required.
- **Theme:** light and dark colour tokens live in `client/src/styles/tokens.css`. The choice is saved in `localStorage` and applied before first paint.
- **Components** follow the wireframe's atomic structure: `client/src/components/{atoms,molecules,organisms,pages}`, each with a `.module.css` file that uses only the tokens in `client/src/styles/tokens.css`.

## Screenshots

**Today:** start a workout and log exercise sets.

![Setlog Today screen](docs/screenshots/today-light.png)

**History:** review earlier sessions and their recorded sets.

![Setlog History screen](docs/screenshots/history-light.png)

**Progress:** compare an exercise's top set, volume, and total reps across sessions.

![Setlog Progress screen](docs/screenshots/progress-light.png)

**My library:** add, rename, filter, or delete exercises.

![Setlog exercise library](docs/screenshots/exercise-library-light.png)

**Movement guide:** browse illustrated exercises and open a movement's form guide.

![Setlog Movement guide](docs/screenshots/movement-guide-light.png)

## Credits

Exercise illustrations: [Workout Guide](https://github.com/bryllim/workout-guide) by [Bryl Lim](https://bryllim.com), with original pose artwork from [Everkinetic](https://github.com/everkinetic/data). Licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). See `client/public/workout-guide/ATTRIBUTION.md`.

Claude AI and Codex assisted extensively with implementation and documentation. My decisions, corrections, added code, and the source of that assistance are recorded in [AI-USAGE.md](AI-USAGE.md).
