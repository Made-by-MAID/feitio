# @feitio/react

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
