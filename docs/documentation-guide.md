# Documentation guide (what your docs must contain)

Your Documentation Update is graded in week 1 and again in week 2. Documentation
is not an afterthought: a reader who has never seen your project should be able
to understand what it is, get it running, and use it, from your docs alone. Keep
your documentation in your project repository's `README.md` (and link it, or a
copy, from your workspace `project/`).

Your documentation must contain these sections. Aim for clear and complete, not
long.

## 1. Overview

What the project is, in two or three sentences. What problem it solves and who it
is for.

## 2. Setup and installation

Every step to get the project running from nothing, in order:

- What to install first (runtime, database, tools) and any versions that matter.
- How to get the code (clone).
- How to install dependencies.
- **Environment and configuration.** List every environment variable the app
  needs, with an example value. Never commit real credentials; show placeholders.
- How to set up and seed the database.

## 3. How to run it

The exact command(s) to start the app, and what a reader should see when it
works (the address to open, the expected first screen or response).

## 4. Features and usage

What the app does and how to use its main features. Walk through the primary
flow. If it has an API, list the main endpoints (method, path, what each does).

## 5. Project structure

A short map of the important folders and files, so a reader knows where things
live.

## 6. Screenshots

At least one screenshot of the app running. More if it has several screens.

## 7. Known issues and next steps

What is not finished, what is known to be broken, and what you would do next.
Being honest here scores; pretending everything is perfect does not.

## How it is graded

See `rubrics.md` in this unit for the exact point breakdown. In short: your setup
and run steps must actually work (that is the largest share), your feature and
usage docs must match what the code really does, and screenshots plus clear
writing carry the rest.
