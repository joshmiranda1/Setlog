# 5. Midterm Reflection Journal
## A. The front end, in your own words

- **JavaScript fundamentals:** The idea that carried furthest is the array of objects. In my Express API it was the data store, and in Setlog it is exercises, sessions, and sets.
- **React:** A component is a function that takes props and returns UI. State is not just a variable because React remembers it between renders and re-renders when it changes. A normal variable resets every render and changes nothing on screen.
- **Styling and design:** Deliberate came from deciding once: five colours with checked contrast, three type sizes, and an 8px spacing unit, all named tokens.

## B. The backend half

- **Node and Express:** When a server "listens", a program waits on a port for HTTP requests and runs code for each one. A route pairs a method and a path with a handler function. I wrote custom middleware in my HAUnted Sightings API.
- **REST:** The URL names a thing and the verb says what to do to it: GET reads, POST creates, PUT or PATCH updates, DELETE removes. Status codes report the outcome, like 201 and 404. **[FILL IN: one endpoint you wrote: method, path, what it returned.]**
- **PostgreSQL:** The array in my Express API disappeared when the server restarted, and Postgres keeps the data. It also gives me foreign keys, and joins and grouping done by the database. Parameterized queries (`$1`, `$2`) keep user input from becoming SQL. The query I most want to get right is Setlog's: the heaviest set per session for one exercise. **[FILL IN: or a query you were proud of, or that took an hour.]**
- **Connecting the two:** **[FILL IN: what surprised you about a front end talking to your own API.]**

## C. What clicked, and what is still shaky

- **One thing that finally clicked:** the browser never talks to Postgres directly. React calls my API with `fetch`, the API runs the SQL, and only the API holds the database connection.
- **One thing I still do not really understand:** for Setlog's Progress screen, whether grouping sets into a best set per session belongs in SQL or in React, and how to keep loading and error state right while the request is pending.
- **One bug I solved that I am proud of:** **[FILL IN: what happened, how you found it, the cause, the activity.]**
- **One error message I now recognize on sight:** **[FILL IN: the message and what it usually means.]**

## D. How I work

- **When I get stuck now:** I show something concrete, like a screenshot of the problem or an example of the format I want. **[FILL IN: what you did at the start of term, and what changed.]**
- **AI tools:** I used an AI tool to draft my planning documents from my own decisions: a personal single-user app, React and Vite with Postgres, and a black and white palette. I reviewed them and had problems fixed, like misaligned box sketches. **[FILL IN: any AI code you could not explain or that failed.]**
- **Last minute:** **[FILL IN: the activity and what it cost.]**
- **Habits:** I will keep showing exactly what I want. I will change my order: settle data and state first, then draw screens, because my sanity check found state I had left out.

## E. Looking forward to the final project

- **What my project leans on most:** The Today route (`/`) leans on my Express work: a `POST /sets` endpoint returning 201 with the new set, like the create endpoints in HAUnted Sightings. History and Progress lean on Postgres joins across sets, sessions, and exercises.
- **Biggest gap:** The Postgres side: a Node API that reaches Postgres through a connection pool with parameterized queries, and then the Progress chart.
- **Two weeks from now:** The Postgres schema (exercises, sessions, sets) created and seeded, and a Node API where `GET /exercises` and `POST /sets` work in Postman.
