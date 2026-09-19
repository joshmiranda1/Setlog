# 3. Design System

App: **Setlog: Workout Set Tracker.** Black and white, kept simple. Components come from the [wireframes](02-wireframes.md). The picture version of this design system is `03-design-system.pdf` (palette swatches, type at real sizes, spacing bars, component sketches).

---

## Step A: Styling approach

My approach: **CSS Modules with CSS custom properties.** The tokens live once in `:root` in `src/styles/tokens.css`, and every component's `.module.css` file uses `var(--token)` instead of raw values. Front end is React + Vite.

## Step B: Colour tokens

Five colours, all black, white, or grey.

| Token | Role | Your colour (hex) |
| --- | --- | --- |
| `--color-primary` | Primary buttons, active nav tab, chart line, headings | `#111111` (near black) |
| `--color-bg` | Page background, text on primary buttons | `#FFFFFF` |
| `--color-surface` | Cards, set list, session cards | `#F5F5F5` |
| `--color-text-muted` | Labels, captions, dates | `#595959` |
| `--color-border` | Input borders, dividers, icon buttons | `#767676` |

There is no separate accent colour. The one call-to-action on a screen (Add set, Finish session) is the filled `--color-primary` button, and everything else is an outlined secondary button.

**Contrast checks** (WCAG ratio; text needs 4.5 : 1, borders and icons need 3 : 1):

| Pair | Ratio | Used for | Result |
| --- | --- | --- | --- |
| `#111111` on `#FFFFFF` | 18.9 : 1 | body text, headings | Pass |
| `#FFFFFF` on `#111111` | 18.9 : 1 | primary button text, active tab | Pass |
| `#111111` on `#F5F5F5` | 17.3 : 1 | text on cards | Pass |
| `#595959` on `#FFFFFF` | 7.0 : 1 | muted text | Pass |
| `#595959` on `#F5F5F5` | 6.4 : 1 | muted text on cards | Pass |
| `#767676` on `#FFFFFF` | 4.5 : 1 | input borders (needs 3 : 1) | Pass |

`#767676` is only used for borders and icons, never for text, because on `#F5F5F5` it drops to 4.2 : 1.

## Step C: Type scale

Font stack: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` (no font files to load).

| Style | Size | Weight | Used for |
| --- | --- | --- | --- |
| Heading (`--font-size-lg`) | 24px | Bold | screen titles, session date |
| Body (`--font-size-md`) | 16px | Regular | inputs, buttons, set rows |
| Small (`--font-size-sm`) | 14px | Regular | labels, captions, nav labels |

Line height is 1.5 for body and small, and 1.2 for headings. Numbers in set rows use `font-variant-numeric: tabular-nums` so weights and reps line up down the list.

## Step D: Spacing rule

Base unit **8px**. Every padding, gap, and margin is a multiple of it.

- Tight spacing (between related items): 8px (`--space-1`)
- Standard spacing (between sections): 24px (`--space-3`)
- Screen edge padding: 16px on phone (`--space-2`), 32px on desktop (`--space-4`)

Other tokens:

| Token | Value | Used for |
| --- | --- | --- |
| `--radius` | 8px | buttons, inputs, cards |
| `--border-width` | 1px | inputs, cards, dividers |
| `--tap-target` | 44px | minimum height of every button and input (used mid-workout on a phone) |
| `--focus-ring` | 2px solid `#111111`, 2px offset | keyboard focus on every control |
| `--content-max` | 1100px | desktop content width |

## Step E: Reusable components

Pulled from the component tree in the wireframes (Step C).

| Component | Level | Appears on | Props it takes |
| --- | --- | --- | --- |
| `Button` | atom | every screen | `variant` ("primary" or "secondary"), `onClick`, `disabled`, `children` |
| `Input` | atom | Today, Exercises | `id`, `type` ("text" or "number"), `value`, `onChange` |
| `Select` | atom | Today, Progress, Exercises | `id`, `value`, `onChange`, `options` |
| `IconButton` | atom | Today, History (inside `SetRow`) | `label` (used as `aria-label`), `onClick`, `children` |
| `Tag` | atom | Exercises, Today, History | `children` |
| `FormField` | molecule | Today, Exercises | `label`, `id`, `children` (the input) |
| `ExercisePicker` | molecule | Today, Progress | `exercises`, `value`, `onChange` |
| `SetRow` | molecule | Today, History | `setNumber`, `reps`, `weight`, `onDelete` |
| `NavItem` | molecule | every screen (inside `NavBar`) | `to`, `label` |
| `AppHeader` | organism | every screen | `title`, `children` (optional right slot, such as the date) |
| `NavBar` | organism | every screen | none (the four routes are fixed) |
| `ExerciseSetGroup` | organism | Today, History | `exerciseName`, `sets`, `onDeleteSet` |

Components used on one screen only (`SetEntryForm`, `SetGroupList`, `SessionCard`, `SessionList`, `ProgressChart`, `ProgressTable`, `ExerciseForm`, `ExerciseList`, `ExerciseRow`) follow the same tokens. `ProgressChart` uses a black line on white with `--color-border` gridlines.

No UI library is used, so all of these are built by hand.

## Step F: Responsive plan

One breakpoint at **768px**.

- Below 768px (phone): one column. `NavBar` is fixed at the bottom. Edge padding is 16px. Reps and weight inputs sit side by side.
- Above 768px (desktop): `NavBar` moves to the top. Today, Progress, and Exercises use two columns (History uses a 2-column grid of cards). Content is capped at 1100px and centered, with 32px edge padding.

There is no horizontal scrolling at 375px. The chart and table use `width: 100%`.

## Accessibility check

- [x] Every text-on-background pair passes 4.5 : 1 contrast (see Step B).
- [x] Real semantic elements: `<header>`, `<nav>`, `<main>`, `<form>`, `<ul>` for lists of sets, and `<button>` for every action.
- [x] There are no meaningful images. `ProgressTable` gives the chart a text version, and any decorative icon uses `alt=""` or `aria-hidden`.
- [x] Every form input has a `<label>`, connected through `FormField` with `htmlFor` and `id`.
- [x] Every control can be reached with the Tab key and shows the 2px focus ring. `IconButton` carries an `aria-label` such as "Delete set 1". The active nav tab is filled black and not shown by colour alone.

## What to keep

- The tokens become `src/styles/tokens.css` (`:root` custom properties).
- Each component in Step E becomes one component in `src/components/` under `atoms/`, `molecules/`, and `organisms/`.
- The responsive plan becomes one `@media (min-width: 768px)` block per component module.
