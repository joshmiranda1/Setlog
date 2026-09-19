# 1. App Proposal

## App name

Setlog: Workout Set Tracker

## What the app is for, in one sentence

Setlog lets me log every set (reps × weight) of each workout and then shows, exercise by exercise, whether my lifts are actually going up over time.

## Who is it for

- **Who:** Me. This is a personal tool for a single user (I lift weights a few times a week), so there are no accounts or login.
- **In the moment I open it:** I am mid-workout, on my phone between sets, and want to log "bench press, 8 reps × 60 kg" in a few taps, or I am at home checking whether my bench has gone up this month.

## Tech

React with Vite on the front end, and a Postgres database behind a small Node API. React never talks to Postgres directly; it calls the API with `fetch`.

## Sections or routes this app needs

| # | Section / route | What it is for |
| - | --- | --- |
| 1 | Today (`/`) | Start a session for today, add exercises, and log sets as reps × weight. This is the main screen. |
| 2 | History (`/history`) | Browse past sessions by date and see the exercises and sets from each one. |
| 3 | Progress (`/progress`) | Pick an exercise and see a chart of how its weight or reps changed across sessions. This answers the app's core question. |
| 4 | Exercises (`/exercises`) | View and add exercises (name, muscle group) so the picker on the Today screen has something to choose from. |

> Test: without History, I can still log and see progress. Without Exercises, I can still log using the seeded list. History is how I fix mistakes and Exercises is how the list stays mine, but they are the first to cut if time runs short.

## State: what data does the app hold?

Most important screen: **Today (the active session)**.

Postgres is the source of truth. The React app fetches the data on load and keeps a copy in state; every change is sent to the API first, then the state is updated.

| Data | Shape (rough) | Who owns it (which component) | Changes when... |
| --- | --- | --- | --- |
| exercises | `[{ id, name, muscleGroup }]` (table `exercises`) | `App` (shared with Today and Exercises) | I add an exercise |
| sessions | `[{ id, date, note }]` (table `sessions`) | `App` (shared with Today and History) | I start a session or edit its note |
| sets | `[{ id, sessionId, exerciseId, reps, weight }]` (table `sets`) | `App` (shared with Today, History, and Progress) | I log or delete a set |
| activeSessionId | `id` or `null` | `App` | I start or finish a session |
| loading / error | `boolean` / `string` or `null` | `App` | an API request starts, succeeds, or fails |
| selectedExerciseId | `id` or `null` | `TodayPage` | I pick an exercise to log |
| set form inputs | `{ reps: "", weight: "" }` | `SetForm` | I type in the reps or weight field |

> Sets and sessions live in `App` (not `TodayPage`) because History and Progress also need them. Selected exercise and form inputs stay low because only the Today screen uses them.

## What each screen contains

- Screen: **Today**
  - Block 1: Header with today's date and a session note field
  - Block 2: Exercise picker (choose which exercise I am logging)
  - Block 3: Set entry form (reps input, weight input, "Add set" button)
  - Block 4: List of sets logged so far this session, grouped by exercise, each with a delete button
  - Block 5: "Finish session" button
  - Block 6: Bottom navigation between Today, History, Progress, and Exercises

## Content you need to gather

- A starter list of about 20 common exercises with muscle groups (bench press, squat, deadlift, overhead press, rows, pull-ups, curls, and so on), loaded into Postgres with a seed script
- Sample sessions and sets covering a few weeks, seeded the same way, so History and Progress look meaningful during development and demo
- The Postgres schema: three tables (`exercises`, `sessions`, `sets`), with `sets` holding foreign keys to the other two
- The list of API endpoints the front end needs (list, create, and delete for exercises, sessions, and sets)
- Decision on units: kg
- An app icon or logo and a simple icon set for navigation

## One risk

The Progress screen: turning many logged sets into one number per session per exercise (for example, the heaviest set, or total volume) and drawing that as a chart. I have not used a charting library in React, I still have to decide whether that grouping happens in a SQL query or in the front end, and I have to decide what "going up" means when I change both reps and weight.
