# @feitio/vanilla

## 0.7.0

### Minor Changes

- 51b2a87: New Skeleton (a loading placeholder: text lines, a block or a circle) and Page (a page's frame inside the AppShell: header and content in the dashboard, sections, detail or board layout); new `settle(window)` in `@feitio/vanilla/arrival`, which holds every transition while a page marked `data-feitio-arriving` settles, so it no longer animates into place on load; on a wide screen the AppShell is at least the window's height (`--feitio-app-min`, `100dvh` by default: a page with a banner beside the shell sets the window less the banner), so its page fills the window without passing it and the wheel over a sticky Anchor or the navigation scrolls the page (#34, #35); a filterable item's clip leaves room for a lifted card's shadow.

### Patch Changes

- Updated dependencies [51b2a87]
  - @feitio/core@0.7.0

## 0.6.0

### Minor Changes

- 7794262: Anchor gets its behavior: `anchors(window, root?)` in `@feitio/vanilla` (also `@feitio/vanilla/anchor`). A click scrolls smoothly to the section (at once with reduced motion or inside `data-motion="direct"`), writes the hash without a jump and moves the focus to the section; while the page (or the box that scrolls, such as an AppShell's main area) scrolls, the link of the section in view gets `aria-current="location"`, watched with IntersectionObserver. In React the Anchor wires itself. A new `sticky` prop (`data-sticky`) keeps the Anchor in view in a side column, with its own scroll when it is taller than the screen.
  
  AppShell on a wide screen: the navigation column stays put while the page scrolls, sticky at the top of the viewport, as tall as it, with its own scroll when it is longer. The phone Drawer is unchanged.

### Patch Changes

- Updated dependencies [7794262]
  - @feitio/core@0.6.0

## 0.5.0

### Patch Changes

- Updated dependencies [cb6150a]
  - @feitio/core@0.5.0

## 0.4.0

### Patch Changes

- Updated dependencies [88dc6f8]
  - @feitio/core@0.4.0

## 0.3.2

### Patch Changes

- Updated dependencies [48f2c95]
  - @feitio/core@0.3.2

## 0.3.1

### Patch Changes

- c3c7a3b: ScrollFade follows the size of the content too, not only the scroll: when the content shrinks with no scroll (a tab, a filtered list), the fade leaves instead of staying over a page with nothing below. Kanban: on a phone, the chosen stage opens in view in the tab row, clear of the faded side.
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

- 0a44a42: Feedback: ErrorMessage, ErrorSummary, EmptyState and StatusOverlay in Astro; their styles in core; `status()` in vanilla sets a StatusOverlay's state and words.
- 2c34205: FilterField: filtered items slide shut and open again; optional `debounce` (a line fills under the field while it waits) and `async` search (a `feitio-filter` event with the query and `done()`, with a turning stroke and a busy label). Both off by default.
- 501d247: First packages: `@feitio/core` (tokens, layered base CSS, hand-drawn icons and illustrations) and `@feitio/vanilla` (the Notice's close button and timer).
- 4cce61b: Forms: Field, TextInput, Textarea, Select, Checkbox, Radios, Switch, TimeInput, Fieldset, SegmentedControl and FilterField. Styles move into core; behaviors in vanilla (`forms`: Switch state in words, AM/PM, segmented choice, filter by delegation); HTML in astro.
- 125f025: New Menu: a button that opens a short list of links or actions as lifted paper, with the popover API, focus on the current item, arrows, Home, End and Esc. Styles in core, behavior in vanilla (`menus`), HTML in astro (`Menu.astro`).
- 46cbe71: Navigation: AppShell, Nav, Breadcrumbs, Anchor, Details, ScrollFade, BackToTop, Search, Header and Footer in Astro; their styles in core; `scrolls()` in vanilla wires ScrollFade and BackToTop to the box around them (or the window).
- e685900: On top of the screen and documentation: Dialog (with typed confirmation), Drawer (any edge, optional footer), CodeBlock, Example, DoDont and Swatch in Astro, with their styles in core; `dialogs()` in vanilla opens Dialogs and handles the typed confirmation.
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
