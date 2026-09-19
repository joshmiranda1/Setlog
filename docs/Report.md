# Weekly Increment Report

## Week of: September 14, 2026

## What changed this week

- Finished the planning documents for **Setlog**, my personal workout set tracker (React + Vite front end, Postgres database behind a small Node API, single user).
- **Proposal:** settled on four routes (Today, History, Progress, Exercises), a state table, and three database tables: `exercises`, `sessions`, and `sets`.
- **Wireframes:** drew the screen map as a flowchart, sketched every screen at phone and desktop width, and broke the screens into a component tree (atoms, molecules, organisms, pages).
- **Design system:** chose a black and white palette with five named colours, checked contrast (all text pairs pass 4.5 : 1), and set a three-size type scale, an 8px spacing unit, one breakpoint at 768px, and 12 reusable components with props. Made a PDF version of it.
- **Updated the proposal to match the wireframes:** added the state for the Progress, History, and Exercises screens, the "no active session" state on Today, and the navigation layout (bottom on phone, top on desktop).
- Drafted the prelim and midterm reflection journals.
- **[FILL IN if you wrote any code this week: components, endpoints, tables, or commits.]**

## Why

I planned before building so that cutting or changing a screen costs nothing. The proposal decides what the app is, the wireframes decide what components exist, and the design system decides the tokens, so on the first build day I can turn them into `tokens.css`, the `src/components/` folders, and the routes without re-deciding anything.

## What broke or what I got stuck on

- My wireframe box sketches looked fine as text but ran past their borders once rendered. I fixed it by padding every line to the same width so the borders line up.
- Walking through my main task ("log a bench set, then check progress") turned up state I had left out of the proposal: Progress needs its own selected exercise, History needs to know which session is expanded, and Today needs a "no active session" state. I added them to the proposal so it agrees with the wireframes.
- I am still unsure how to build the Progress screen: whether turning sets into a best set per session should happen in a SQL query or in React, and I have not used a charting library yet.

## What is left

- Create the Vite + React project and the Node API, then the Postgres schema and a seed script with sample exercises, sessions, and sets.
- Build the endpoints first (`GET /exercises`, `POST /sets`, and the rest), and test them in Postman.
- Build `tokens.css` and the components from atoms up, then the four pages and routes.
- Build History and Progress last, starting with the query for the heaviest set per session, then a small chart on fake data before connecting the real API.
- Fill in the personal sections of the midterm journal.
