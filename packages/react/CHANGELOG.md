# @feitio/react

## 0.6.0

### Minor Changes

- 7794262: Anchor gets its behavior: `anchors(window, root?)` in `@feitio/vanilla` (also `@feitio/vanilla/anchor`). A click scrolls smoothly to the section (at once with reduced motion or inside `data-motion="direct"`), writes the hash without a jump and moves the focus to the section; while the page (or the box that scrolls, such as an AppShell's main area) scrolls, the link of the section in view gets `aria-current="location"`, watched with IntersectionObserver. In React the Anchor wires itself. A new `sticky` prop (`data-sticky`) keeps the Anchor in view in a side column, with its own scroll when it is taller than the screen.
  
  AppShell on a wide screen: the navigation column stays put while the page scrolls, sticky at the top of the viewport, as tall as it, with its own scroll when it is longer. The phone Drawer is unchanged.

### Patch Changes

- Updated dependencies [7794262]
  - @feitio/core@0.6.0

## 0.5.0

### Minor Changes

- cb6150a: Masonry takes `max` (2 to 6), the most columns it may make, rendered as `data-max`: on a very wide screen a few blocks stay together instead of leaving the right half empty. Without it, as many columns as fit, as before. CSS columns get the count as their maximum; with native masonry (`grid-lanes`), the tracks are capped the same way.
  
  No component renders an inline `style` attribute any more, so every one works under a strict CSP (`style-src 'self'`): Table's frame is now the `feitio-table-frame` class, Swatch takes its role as `data-role`, and Grid's `min` takes the steps `narrow`, `regular` and `wide` as `data-min`, like Masonry. Grid still accepts any length for compatibility, as an inline custom property, which a strict CSP blocks.

### Patch Changes

- Updated dependencies [cb6150a]
  - @feitio/core@0.5.0

## 0.4.0

### Minor Changes

- 88dc6f8: Masonry and Heatmap, and no letter cut by a border. Masonry puts blocks in columns that fit the width, each right under the one before (CSS columns today, native `grid-lanes` masonry where the browser has it), with `gap`, `min` (`narrow`, `regular`, `wide`) and `as`. Heatmap is a grid of fixed positions for a value over time (13 weeks by 7 days, 7 days by 24 hours), a real table with a caption, labelled rows and columns, a title and a level for every square, and a legend in words; tones for states (`ok`, `warn`, `error`, `empty`) and an ink scale (`low`, `mid`, `high`). Neither needs an inline style, so both work under a strict CSP. New tokens `inset-word` and `inset-word-block` give every bordered short word (Tag at both sizes, the small Button, SegmentedControl, Kbd, KanbanCard's move button) room for a letter that reaches past its width or below the line, like the f of "Off" or a j. New tokens `measure-column` (Grid's default column, now a token), `measure-column-narrow`, `measure-column-wide` and `size-square`.

### Patch Changes

- Updated dependencies [88dc6f8]
  - @feitio/core@0.4.0

## 0.3.2

### Patch Changes

- Updated dependencies [48f2c95]
  - @feitio/core@0.3.2

## 0.3.1

### Patch Changes

- @feitio/core@0.3.1

## 0.3.0

### Minor Changes

- 41ea4d4: Kanban and KanbanCard: work in columns, one per stage. Wide, a file of folders with tabs and cards held by tape; on a phone, stage tabs. Cards move by dragging (they follow the hand on a spring) or with their button (phone and keyboard), only to the columns they list; every move sends the cancelable `feitio-kanban-move` first. Columns may offer a new-card button (`feitio-kanban-create`). The sides fade while there is more to scroll, and a map of the board shows when the columns do not fit. The card's content is free.

### Patch Changes

- Updated dependencies [41ea4d4]
  - @feitio/core@0.3.0

## 0.2.1

### Patch Changes

- c8b7b9d: The docs moved to their own domain, https://feitio.bymaid.com: every package's homepage and README point there.
- Updated dependencies [c8b7b9d]
  - @feitio/core@0.2.1

## 0.2.0

### Patch Changes

- Updated dependencies [ac96dc2]
  - @feitio/core@0.2.0

## 0.1.0

### Minor Changes

- 83a1c51: `@feitio/react`: every component for React, rendering the same HTML as the Astro ones, with the behaviors wired by hooks when they mount, `useNotices()` and `FeitioProvider`. Astro gets Label and Hint; the vanilla Notice controller gets `wire(root)` for notices added later.

### Patch Changes

- 78a795e: Every package has its README on npm, keywords, homepage and issue links. `@feitio/vanilla` ships type declarations for each entry point.
- Updated dependencies [8e911b8]
- Updated dependencies [ddc6d37]
- Updated dependencies [4a3087f]
- Updated dependencies [9417360]
- Updated dependencies [00308ce]
- Updated dependencies [0a1821e]
- Updated dependencies [0a44a42]
- Updated dependencies [2c34205]
- Updated dependencies [501d247]
- Updated dependencies [4cce61b]
- Updated dependencies [125f025]
- Updated dependencies [46cbe71]
- Updated dependencies [78a795e]
- Updated dependencies [e685900]
  - @feitio/core@0.1.0
