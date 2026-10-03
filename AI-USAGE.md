# AI Usage — Setlog

Setlog was built with extensive assistance from **Claude AI**, followed by **Codex**. I provided the app idea, chose the personal-user scope, React/Vite/Postgres stack, and black-and-white palette, added generated code to the project, and requested corrections when outputs did not match my needs.

Claude assisted with the planning documents and initial implementation. Codex assisted with reviewing the project, documentation, screenshots, and this disclosure. My remembered build request was to follow `docs/01-proposal.md`, `docs/02-wireframes.md`, and `docs/03-design-system/`. That request is a retrospective paraphrase; the original build prompts are not in the supplied share.

This record was first compiled on **2026-10-03** and finalized on **2026-10-04**. It is retrospective. Sources include the [Claude conversation](https://claude.ai/share/e24c0b0f-1ec4-41f2-9195-d0a8815616f8), saved Codex chats, [prompt evidence](docs/ai-prompt-evidence.md), and the commits below. Dates use Asia/Shanghai.

## 1. How I used AI

### 2026-09-19 — Setlog proposal

- **Tool:** Claude AI.
- **What I asked for:** I described a workout tracker storing exercises, sessions, and sets, then asked: “Let's do 01 proposal md”.
- **What it gave back:** A proposal with Today, History, Progress, and Exercises screens, a state/data plan, and a risk around calculating progress.
- **What I kept, what I changed, and why:** I kept the four-screen structure and workout data model. I then clarified the audience and technology choices because the first draft assumed a broader audience and browser storage.
- **File:** `docs/01-proposal.md`.
- **Commit:** [ee3b500 — retained proposal](https://github.com/joshmiranda1/setlog/commit/ee3b500686ea8b82714798272ebf2c400ca3e101).

### 2026-09-19 — Personal-user scope and technology stack

- **Tool:** Claude AI.
- **What I asked for:** “This project is only intended for me (the user) not for other people. Use react and vite and postgres backend”.
- **What it gave back:** A revised proposal for one user, with React/Vite, PostgreSQL as the main data store, and a Node API between the browser and database.
- **What I kept, what I changed, and why:** I kept that scope and stack because they matched my intended app. Workout records go through the API to Postgres. Browser storage is still used for preferences and the active-session ID, rather than as the main workout database.
- **File:** `docs/01-proposal.md`.
- **Commit:** [ee3b500 — revised scope and stack](https://github.com/joshmiranda1/setlog/commit/ee3b500686ea8b82714798272ebf2c400ca3e101).

### 2026-09-19 — Wireframes and component breakdown

- **Tool:** Claude AI.
- **What I asked for:** “Do this for me regarding the proposal you made”, with an attached brief. The share hides the attachment; Claude's reply identifies the output as the wireframes document.
- **What it gave back:** Screen sketches and a component breakdown into atoms, molecules, organisms, and pages, with responsive navigation.
- **What I kept, what I changed, and why:** I kept the component structure and layout plan as implementation references. I requested changes to the screen-map format and the box alignment afterward. The retained document sketches every phone screen and the Today desktop screen; the other desktop layouts are described in text.
- **File:** `docs/02-wireframes.md`.
- **Commit:** [ee3b500 — retained wireframes](https://github.com/joshmiranda1/setlog/commit/ee3b500686ea8b82714798272ebf2c400ca3e101).

### 2026-09-19 — Screen-map format

- **Tool:** Claude AI.
- **What I asked for:** I supplied a Mermaid `flowchart LR` example with labeled navigation arrows and wrote: “Use our flowchart but use this format for creating our own screen map.”
- **What it gave back:** A Setlog screen map with Today as the entry screen, arrows for starting and finishing sessions, and links between the main screens.
- **What I kept, what I changed, and why:** I kept the revised diagram. I supplied the desired format, and Claude adapted it to Setlog. The labeled arrows make the actions and navigation easier to follow.
- **File:** `docs/02-wireframes.md`, Step A.
- **Commit:** [ee3b500 — Mermaid screen map](https://github.com/joshmiranda1/setlog/commit/ee3b500686ea8b82714798272ebf2c400ca3e101).

### 2026-09-19 — Box-sketch alignment

- **Tool:** Claude AI.
- **What I asked for:** “On step B: box sketches at two widths, can you fix the formatting on the box sketch so it doesn't go out of the box. It should be aligned to each thing. Here is a screenshot on what I want you to fix.”
- **What it gave back:** Revised sketches with consistent line widths and the reps/weight labels separated from their inputs.
- **What I kept, what I changed, and why:** I noticed the overflow and supplied the screenshot and correction request. Claude produced the revised text, which I retained so the content fitted inside the borders.
- **File:** `docs/02-wireframes.md`, Step B.
- **Commit:** [ee3b500 — aligned sketches](https://github.com/joshmiranda1/setlog/commit/ee3b500686ea8b82714798272ebf2c400ca3e101).

### 2026-09-19 — Black-and-white design system

- **Tool:** Claude AI.
- **What I asked for:** “I choose the colors of black and white to make it look simple for the setlog app”.
- **What it gave back:** A Markdown design system and PDF with monochrome colour tokens, type sizes, an 8px spacing unit, CSS Modules and variables, and component guidance.
- **What I kept, what I changed, and why:** I kept the monochrome direction and reusable design tokens. The palette came from my choice; Claude expanded it into consistent styling decisions for the screens and components.
- **Files:** `docs/03-design-system/03-design-system.md` and `docs/03-design-system/03-design-system.pdf`.
- **Commit:** [ee3b500 — design-system artifacts](https://github.com/joshmiranda1/setlog/commit/ee3b500686ea8b82714798272ebf2c400ca3e101).

### 2026-09-27 — README screenshots, published 2026-10-04

- **Tool:** Codex.
- **What I asked for:** I supplied five screenshots and wrote: “Put this in the screenshots section in the README so it can actually be viewed in github and explain them briefly.”
- **What it gave back:** Locally saved images, Markdown image links, and short descriptions. Its claim that GitHub display had been verified was premature.
- **What I kept, what I changed, and why:** I kept the screenshots and descriptions, challenged the missing images on GitHub, and had the images included in this repository with paths relative to the README. This makes the submitted Setlog documentation contain the files it references.
- **Files:** `README.md` and `docs/screenshots/`.
- **Commit:** [bedf391 — README screenshots and supporting evidence](https://github.com/joshmiranda1/setlog/commit/bedf39104c5f650ef38093efefda4d6454c6c315).

## 2. Where the AI got it wrong

### Case 1 — Wireframe content extended outside the box

- **What it gave me:** Claude's phone sketch had a reps/weight row and navigation row extending past the right border.
- **What was wrong with it:** The content and border rows did not have consistent widths, making the layout difficult to read.
- **What I did instead:** I sent a screenshot and asked Claude to align the content and keep it inside the box. Claude padded the lines and separated the form labels from their inputs. I identified the problem and directed the correction.
- **File:** `docs/02-wireframes.md`, Step B.
- **Evidence:** [Original screenshot](docs/screenshots/claude-wireframe-overflow.png) and the [Claude conversation](https://claude.ai/share/e24c0b0f-1ec4-41f2-9195-d0a8815616f8).
- **Commit:** [ee3b500 — corrected sketches](https://github.com/joshmiranda1/setlog/commit/ee3b500686ea8b82714798272ebf2c400ca3e101). The initial commit contains the corrected version; the conversation and screenshot show the earlier problem.

### Case 2 — Unsuitable audience and storage assumptions

- **What it gave me:** Claude's first proposal assumed a broader recreational-lifter audience and browser localStorage for workout records.
- **What was wrong with it:** Those assumptions did not match the personal React/Vite/Postgres app I wanted.
- **What I did instead:** I clarified that the app was for me and specified React, Vite, and Postgres. Claude revised the audience, stack, and data flow. The retained proposal uses Postgres through a Node API for workout data.
- **File:** `docs/01-proposal.md`.
- **Evidence:** The initial assumptions and my clarification appear in the [Claude conversation](https://claude.ai/share/e24c0b0f-1ec4-41f2-9195-d0a8815616f8).
- **Commit:** [ee3b500 — personal-user and Postgres proposal](https://github.com/joshmiranda1/setlog/commit/ee3b500686ea8b82714798272ebf2c400ca3e101).

### Case 3 — Local screenshot checks were mistaken for GitHub availability

- **What it gave me:** Codex added screenshots locally and said it had verified their paths for GitHub display.
- **What was wrong with it:** Local files do not automatically exist on GitHub. The README I was viewing was in the class repository, while the local project pointed to the separate Setlog repository.
- **What I did instead:** I sent screenshots of the failure and asked: “Why is it not viewable on github?” Codex acknowledged the incomplete check. For this submission, I had the screenshots published in Setlog alongside its README, using `docs/screenshots/...` links. This fixes the submitted Setlog README; it does not claim to update the separate class repository.
- **Files:** `README.md` and `docs/screenshots/`.
- **Evidence:** [Recorded Codex exchange](docs/ai-prompt-evidence.md#codex-screenshot-correction).
- **Commit:** [bedf391 — screenshot publication and README links](https://github.com/joshmiranda1/setlog/commit/bedf39104c5f650ef38093efefda4d6454c6c315).

## 3. Who wrote what

### My contributions and code I added

I supplied the idea, personal-user scope, stack, palette, and screen-map format. I reviewed the wireframes and GitHub screenshots and requested corrections. I also added AI-provided implementation code to the project.

I marked the four parts below as personally added. The annotations were committed on October 3, 2026; their function bodies existed in earlier implementation commits. These are my reported additions within an AI-assisted codebase, not verified independent authorship. This record does not establish the assignment's minimum of 20% independently written code.

#### Set display formatting — `formatSet`

- **File:** `client/src/lib/format.js`.
- **Commit:** [33f445d — my annotation](https://github.com/joshmiranda1/setlog/commit/33f445db1c62fd8e173ae16e4abc93ab49c52dc6); implementation present in [ee3b500](https://github.com/joshmiranda1/setlog/commit/ee3b500686ea8b82714798272ebf2c400ca3e101).
- **What it does and why it is built this way:** When weight is positive, it displays reps and weight, such as `8 × 60 kg`. Otherwise it displays only reps, such as `12 reps`. The condition keeps bodyweight labels readable and gives the screens one consistent set format without changing saved data.

#### Count labels — `plural`

- **File:** `client/src/lib/format.js`.
- **Commit:** [33f445d — my annotation](https://github.com/joshmiranda1/setlog/commit/33f445db1c62fd8e173ae16e4abc93ab49c52dc6); implementation present in [ee3b500](https://github.com/joshmiranda1/setlog/commit/ee3b500686ea8b82714798272ebf2c400ca3e101).
- **What it does and why it is built this way:** It returns labels such as `1 session` or `3 sessions`. When the count is exactly 1 it adds no suffix; otherwise it adds `s`. This avoids repeating simple singular/plural conditions across screens. It is intended for regular plurals.

#### Workout-volume calculation — `volumeOf`

- **File:** `client/src/lib/stats.js`.
- **Commit:** [cf2f655 — my annotation](https://github.com/joshmiranda1/setlog/commit/cf2f65599b201715bc46bef2593f139c303de80b); implementation present in [ee3b500](https://github.com/joshmiranda1/setlog/commit/ee3b500686ea8b82714798272ebf2c400ca3e101).
- **What it does and why it is built this way:** It multiplies reps by weight for every supplied set and adds the results with `reduce`, starting at zero. For example, `8 × 60 + 10 × 40 = 880`. A shared formula keeps workout summaries and progress calculations consistent. Its caller decides which sets to include.

#### Exercise-guide name matching — `ALIASES`

- **File:** `client/src/lib/guide.js`.
- **Commit:** [3b695d2 — my annotation](https://github.com/joshmiranda1/setlog/commit/3b695d2fea053e6ab121b696e1f78298afdee31d); implementation present in [918f34d](https://github.com/joshmiranda1/setlog/commit/918f34d983f8578df8209e67b5bd66d9d9930324).
- **What it does and why it is built this way:** The object maps library exercise names to guide slugs when their wording differs. For example, `push-ups` maps to `push-up`, and `chest fly` maps to `dumbbell-fly`. `findGuideFor` checks these aliases before trying other matches, allowing the correct illustration to open without renaming the saved exercise.

### The AI-written part I understand best — `bestSet`

- **File:** `client/src/lib/stats.js`.
- **Commit:** [ee3b500 — best-set calculation](https://github.com/joshmiranda1/setlog/commit/ee3b500686ea8b82714798272ebf2c400ca3e101).
- **What it does and why it was kept:** It selects the heaviest set from the supplied list. If two sets have the same weight, it chooses the one with more reps. The result is used by `progressFor` to produce an exercise's top set for each session.

```js
export function bestSet(sets) {
  return sets.reduce((best, s) =>
    !best || s.weight > best.weight || (s.weight === best.weight && s.reps > best.reps) ? s : best, null);
}
```

The running value `best` starts as `null`. The first set becomes the current best. Each later set replaces it only if its weight is higher, or its weight ties and its reps are higher. An empty list returns `null`.

For example, between 8 reps at 60 kg, 6 reps at 65 kg, and 8 reps at 65 kg, the result is 8 reps at 65 kg. The function makes one pass through the list and does not reorder it. Keeping the rule in a helper gives the progress display a consistent definition of “top set”.

## README credit

The README displays the AI-assistance badge near the top, names Claude AI and Codex, describes extensive assistance, and links to this record. Third-party exercise illustrations are credited separately in the README and `client/public/workout-guide/ATTRIBUTION.md`.
