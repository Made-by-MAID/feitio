# @feitio/astro

## 0.2.0

### Patch Changes

- Updated dependencies [ac96dc2]
  - @feitio/core@0.2.0
  - @feitio/vanilla@0.2.0

## 0.1.0

### Minor Changes

- 8e911b8: `@feitio/core` gains `css/components.css` (layer `feitio.components`, loaded by `feitio.css`): Stack, Inline and Grid, Link, VisuallyHidden, Button, Tag and Notice, with small and large control sizes in the base. New `@feitio/astro`: the components as the single source of their HTML (Icon, Button, Link, Tag, Notice).
- ddc6d37: Text, LinkCard, SkipLink, Divider and Kbd styles move into `components.css`. New Astro components: LinkCard, Heading, Text, Block, VisuallyHidden, SkipLink, Divider and Kbd.
- 4a3087f: Button: pressed feedback (the lifted paper presses flat). Divider: `orientation="vertical"`, between pieces side by side.
- 9417360: Data: Table (cards on a phone, compact density), SummaryList, TaskList and Pagination in Astro; their styles move into core.
- 0a44a42: Feedback: ErrorMessage, ErrorSummary, EmptyState and StatusOverlay in Astro; their styles in core; `status()` in vanilla sets a StatusOverlay's state and words.
- 2c34205: FilterField: filtered items slide shut and open again; optional `debounce` (a line fills under the field while it waits) and `async` search (a `feitio-filter` event with the query and `done()`, with a turning stroke and a busy label). Both off by default.
- 4cce61b: Forms: Field, TextInput, Textarea, Select, Checkbox, Radios, Switch, TimeInput, Fieldset, SegmentedControl and FilterField. Styles move into core; behaviors in vanilla (`forms`: Switch state in words, AM/PM, segmented choice, filter by delegation); HTML in astro.
- a624c9a: Layout in Astro: Stack (gap, align), Inline (gap, justify, wrapping) and Grid (gap, narrowest column).
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
- Updated dependencies [83a1c51]
  - @feitio/core@0.1.0
  - @feitio/vanilla@0.1.0
