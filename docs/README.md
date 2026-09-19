# Setlog: Workout Set Tracker

> **Status (Finals Week 1):** Setlog is still in development. Planning is finished (proposal, wireframes, and design system). The app itself is not finished, so the setup, run, and endpoint details will be added as they are built. This README only describes what has been decided so far, and says clearly what is not ready yet.

## 1. Overview

Setlog is a personal workout tracker. I log each workout as a session, add the exercises I did, and log every set as reps × weight (for example, bench press: 8 reps × 60 kg). The logged sets add up over time so I can see whether each lift is going up. It is built for one user (me), so there are no accounts or login.

**Tech stack:** React with Vite on the front end, and a Postgres database behind a small Node API.

## 2. Setup and installation

Not available yet. The app is still being built, so there is no tested install process to document.

What I know I will need:

- Node.js and npm
- PostgreSQL

The complete steps (versions, cloning, installing dependencies, environment variables, and setting up and seeding the database) will be added once the app can run.

**Planned data model** (three tables):

| Table | Fields |
| --- | --- |
| `exercises` | name, muscle group |
| `sessions` | date, note |
| `sets` | session, exercise, reps, weight |

## 3. How to run it

Not available yet. The start commands and the expected first screen will be added once there is a running version.

## 4. Features and usage

None of these are finished yet. This is the planned design.

**Planned main flow: log a workout, then check progress**

1. On **Today**, start a session.
2. Pick an exercise, enter reps and weight, and add the set. Repeat for each set.
3. Finish the session.
4. On **Progress**, pick an exercise and see whether that lift is going up over time.
5. On **History**, browse past sessions and their sets.

**Planned screens**

| Route | Screen | What it does |
| --- | --- | --- |
| `/` | Today | Start a session and log sets |
| `/history` | History | Browse past sessions and their sets |
| `/progress` | Progress | Chart of one exercise over time |
| `/exercises` | Exercises | View and add exercises |

**API endpoints:** not defined yet. They will be listed here (method, path, and what each does) once the API is built.

## 5. Project structure

The project has not been set up in code yet. The planning documents are the current reference:

- `docs/01-proposal.md`: what the app is, who it is for, and the data it holds
- `docs/02-wireframes.md`: the screen map, screen sketches, and component tree
- `docs/03-design-system.md` and `docs/03-design-system.pdf`: colours, type, spacing, and components

The planned front end organizes its components into `atoms`, `molecules`, `organisms`, and `pages` folders, with the design tokens in one `tokens.css` file. The full folder map will be added once the code exists.

## 6. Screenshots

There is no running app to screenshot yet. Screenshots of the working screens will be added as they are built. For now, the planned layouts are sketched in `docs/02-wireframes.md`.

## 7. Known issues and next steps

**Known issues**

- The app is not finished, so it cannot be run yet.
- I have not decided where the best-set-per-session grouping for the Progress chart should happen (in a SQL query or in React), and I have not chosen a charting library.

**Next steps**

- Create the Postgres tables and sample data, then build and test the API endpoints.
- Build the design tokens and the components, then the four screens and their routes.
- Build History and Progress last, then add screenshots and finish this README with the real setup and run steps.
