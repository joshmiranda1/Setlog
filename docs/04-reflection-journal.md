# 4. Reflection Journal

## A. The road so far

- **JavaScript fundamentals** (variables, functions, arrays, objects): JavaScript is where I learned to treat data as arrays of objects. Setlog is three of them: exercises, sessions, and sets. The backend module made this concrete when I built an Express API with in-memory CRUD. I took from it that the shape of the data comes first, and the code follows.
- **React** (components, props, state, hooks, routing): I have built tab and modal components for a scheduling system in React with Supabase, using `useMemo` for derived lists. Planning Setlog taught me that state lives in the lowest component that needs it and flows down as props, and that four screens are four routes in one shared layout.
- **Styling and design** (your styling approach, responsive layout, design systems): For Setlog I chose CSS Modules with custom properties, black-and-white tokens, an 8px spacing unit, and one breakpoint at 768px. A design system is decisions made once, so every screen looks like the same product.

## B. What clicked, and what is still shaky

- **One concept that finally clicked for me:** state ownership. In my state table, sets and sessions had to live in `App` because History and Progress read them too, while the selected exercise and form inputs could stay lower. Walking through "log a bench set, then check progress" showed me state I had missed: Progress needs its own selected exercise, and History needs to know which session is expanded.
- **One concept I still find confusing:** turning many logged sets into one number per session for the Progress chart. I am not sure whether that grouping belongs in a SQL query or in React, and I have not used a charting library yet.
- **A problem I solved that I am proud of:** my wireframe sketches ran past their borders once rendered. I spotted it in a screenshot and had every line padded to the same width so the borders line up.

## C. How I work

- **How I get unstuck:** I use AI tools, and they work best when I give something concrete, like a screenshot of what is wrong or an example format to follow, such as the flowchart layout I wanted for my screen map. I still check the output against my plan.
- **One habit to keep, one to change:** I want to keep showing exactly what I want. I want to change my order: settle the data and state first, then draw screens, because my sanity check found state I had left out.

## D. Connecting it to the final project

- **Which skill does my project lean on the most?** React state and props, since the app is forms, lists of sets, and data shared between four screens. It also leans on my Express and Postgres work, because Setlog stores everything in Postgres behind a small API.
- **Which part of my plan am I least prepared for, and what will I do about it?** The Progress screen. I will build it last, after logging and History work. First I will write the query that returns the best set per session for one exercise, then try a small chart library on fake data before connecting the real API.
- **What do I want to be able to say I learned?** That I built a full-stack app end to end, with a React front end, a Postgres database, and a consistent look from a small set of tokens, and that it answers one real question: is my bench going up?
