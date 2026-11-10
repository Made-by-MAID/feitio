# Color

Every theme fills the same **roles**. Components never know a color, only a role.

| Role                  | Use                                              |
| --------------------- | ------------------------------------------------ |
| `surface`             | Page background                                  |
| `surface-raised`      | Blocks on the page                               |
| `surface-top`         | Lifted paper: menus, dialogs                     |
| `text`                | Main text                                        |
| `text-soft`           | Supporting text                                  |
| `accent`              | The main action, the focus ring. Rare on purpose |
| `accent-strong`       | Orange text and links                            |
| `on-accent`           | Text on the accent                               |
| `line`                | Hairlines and dividers                           |
| `shadow`              | The hard shadow of lifted paper                  |
| `ok`, `warn`, `error` | Status ink, each with a `-surface` to sit on     |

## The house theme

`casa` is cream paper, warm ink and a lively orange, more vivid than the usual terracotta.

- **By day:** cream background, near-black brown ink, orange.
- **At night:** warm charcoal, cream as ink, and orange text and links lit up to keep their
  contrast. Night is designed on its own; it is never the day inverted.

The main action is the same in both modes: a deep orange with cream text on it. WCAG 2's formula
overrates dark text on a saturated mid-tone orange, which passed the test and still tired the eye;
the perceptual APCA measure agrees with the eye, so the orange stays deep and the text on it light.

With no `data-mode`, a page follows the system. `data-mode="light"` or `"dark"` chooses.

## Status colors

Earthy, from the same family as the cream: **moss green** (it worked), **mustard** (attention),
**wine** (it failed). The wine is pulled away from the orange so an error never looks like the main
action. Color never speaks alone: a status always comes with an icon and a word.

## Themes for outside work

A landing page for a shop, a side project: a theme of its own changes **only the colors**. Type,
shape, space and motion stay Feitio's. A theme starts by day only and gets a night version when the
work asks for it. Anything that needs more than colors is made outside Feitio.

## Contrast

Every pair that carries text or meaning reaches WCAG 2.2 AA in every theme, by day and at night:
4.5 to 1 for text, 3 to 1 for shapes. The tests check every pair and fail the build otherwise.

## Avoid

- A color written straight in CSS instead of a role.
- Orange for decoration, or more than one orange thing competing on a screen.
- Status told by color alone.
