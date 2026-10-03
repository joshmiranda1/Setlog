# AI-use evidence — Setlog

## Claude planning prompts

Source: [shared Claude conversation](https://claude.ai/share/e24c0b0f-1ec4-41f2-9195-d0a8815616f8). The visible messages are dated September 19, 2026. Attachments hidden by the share are not included here.

| Date | Request | Result |
| --- | --- | --- |
| 2026-09-19 | “Let's do 01 proposal md”, following my Setlog idea and data requirements. | Proposal with four screens, a state/data plan, and a Progress-chart risk. |
| 2026-09-19 | “This project is only intended for me (the user) not for other people. Use react and vite and postgres backend”. | Revised personal-user scope and React/Vite/Postgres stack. |
| 2026-09-19 | “Do this for me regarding the proposal you made”. | Wireframes and component breakdown; the attached brief is hidden in the share. |
| 2026-09-19 | I supplied a Mermaid `flowchart LR` example and asked Claude to use that format for Setlog's screen map. | Revised screen map with labeled navigation arrows. |
| 2026-09-19 | “On step B: box sketches at two widths, can you fix the formatting on the box sketch so it doesn't go out of the box. It should be aligned to each thing. Here is a screenshot on what I want you to fix.” | Aligned sketches with fixed line widths and shorter form rows. |
| 2026-09-19 | “I choose the colors of black and white to make it look simple for the setlog app”. | Monochrome design system in Markdown and PDF. |

[Original wireframe screenshot](screenshots/claude-wireframe-overflow.png).

## Codex screenshot correction

Source: saved Codex chat **Create this week’s report**, associated with the APSI project. Both exchanges below occurred on September 27, 2026, in Asia/Shanghai.

My original request:

> Put this in the screenshots section in the README so it can actually be viewed in github and explain them briefly.

Codex saved five images locally, updated both README copies, and said it had checked the paths for GitHub display.

My follow-up, with screenshots showing the missing images:

> Why is it not viewable on github?

Codex acknowledged that it had checked local image links but had not checked whether the images were on GitHub. It identified that the class repository shown in my screenshot was different from the local Setlog repository.

The submitted Setlog README now includes the five images in this repository, using paths relative to its root. This correction publishes the screenshots in Setlog; it does not claim to update the separate class repository.

## Code annotations

The comments identifying parts I personally added were published on October 3, 2026:

| Part | Annotation commit |
| --- | --- |
| `formatSet` and `plural` | [33f445d](https://github.com/joshmiranda1/setlog/commit/33f445db1c62fd8e173ae16e4abc93ab49c52dc6) |
| `volumeOf` | [cf2f655](https://github.com/joshmiranda1/setlog/commit/cf2f65599b201715bc46bef2593f139c303de80b) |
| `ALIASES` | [3b695d2](https://github.com/joshmiranda1/setlog/commit/3b695d2fea053e6ab121b696e1f78298afdee31d) |

The function bodies already existed in earlier implementation commits. These later commits add the attribution comments.
