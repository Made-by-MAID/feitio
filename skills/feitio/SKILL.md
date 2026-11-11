---

name: feitio
description: Build interfaces with the Feitio design system. Use when a page, screen or component must follow Feitio (handmade, humanist, cream, ink and orange), or when making a color theme for outside work on top of it.
---

# Building with Feitio

Feitio decides how things look. Your job is to use it, not to invent style. Read the
[guidelines](../../docs/guidelines/README.md) first; this page is the short version.

## Setup

Load `css/fonts.css` (or host Alegreya and Alegreya Sans) and `css/feitio.css` from `@feitio/core`
(`packages/core/` in the repository). Icons are in its `icons/sprite.svg`. Behaviors (the timed
Notice) come from `@feitio/vanilla`. In a framework port, use the port's components; this skill covers what they
share.

## Rules

1. **Only tokens.** Every color, size, gap, radius, duration and curve is a `var(--feitio-...)`.
   Never write a literal. Colors are roles (`--feitio-color-surface`, `-text`, `-accent`...), never
   hues.
2. **One column, one idea per block.** Content in `feitio-measure`, blocks in `feitio-block`.
3. **Orange is rare.** One main action per screen gets `accent`. Links and notes use
   `accent-strong`. Never orange for decoration.
4. **Type:** Alegreya Sans for headings and anything you act on, Alegreya for reading, italic for
   process notes (`feitio-note`).
5. **Shape:** the uneven radius (`--feitio-radius`) on blocks and controls; borders are the 1px ink
   line; what floats is lifted paper (`feitio-lift`) and arrives with `feitio-place`.
6. **Motion:** the base CSS already transitions every change of state. Add no motion that nobody
   asked for. One paper at a time: when an action makes several things appear, only one arrives
   with `feitio-place`; the rest slide in. What is already on screen never lands again. Where a
   piece follows the finger, `data-motion="direct"` turns motion off.
7. **Density:** `data-density="compact"` on work areas with tables and forms; reading stays
   comfortable.
8. **Icons:** from the sprite, `aria-hidden="true"`, always next to a word or inside a button with
   an `aria-label`. New icons follow the [iconography](../../docs/guidelines/iconography.md) rule:
   no single continuous line.
9. **Status:** `ok`, `warn`, `error` with their `-surface`, always with an icon and a word.
10. **Notices that go away:** a notice may close by itself only when it says something worked or
    informs; warnings and errors stay until the person closes them. A timed notice always has a
    close button, and its time stops while the pointer or focus is on it.
11. **Hidden is hidden:** hide with the `hidden` attribute; the base CSS makes it win over any
    component's own `display`.
12. **Text:** direct, warm, action verbs. Buttons say what happens. Errors say what happened and how
    to fix it, without apologizing. Empty screens invite action.

## Never

- Techy looks: neon, glowing dark screens, decorative monospace, terminal grids.
- The generic generated look: all-caps eyebrows over every heading, `A · B · C` meta lines, one
  word of a heading in a different color, identical cards with soft grey shadows, `→` appended to
  every link.
- Soft blurred shadows, thick borders, a perfect radius on everything.

## A theme for outside work

When the work is for someone else (a shop's landing page), add
`packages/core/tokens/themes/<name>.light.tokens.json` with every color role of `casa`, in OKLCH, run
`bun run build` and `bun run check` (contrast must pass), and set `data-theme="<name>"`. Only colors
change. If the brief needs other type or shapes, do not bend Feitio: build outside it.

## Check your work

Look at it by day and at night (`data-mode`), and in compact density where it applies. Take a
screenshot if you can. Before finishing, remove one thing that does not help.
