# @feitio/core

## 0.4.0

### Minor Changes

- 88dc6f8: Masonry and Heatmap, and no letter cut by a border. Masonry puts blocks in columns that fit the width, each right under the one before (CSS columns today, native `grid-lanes` masonry where the browser has it), with `gap`, `min` (`narrow`, `regular`, `wide`) and `as`. Heatmap is a grid of fixed positions for a value over time (13 weeks by 7 days, 7 days by 24 hours), a real table with a caption, labelled rows and columns, a title and a level for every square, and a legend in words; tones for states (`ok`, `warn`, `error`, `empty`) and an ink scale (`low`, `mid`, `high`). Neither needs an inline style, so both work under a strict CSP. New tokens `inset-word` and `inset-word-block` give every bordered short word (Tag at both sizes, the small Button, SegmentedControl, Kbd, KanbanCard's move button) room for a letter that reaches past its width or below the line, like the f of "Off" or a j. New tokens `measure-column` (Grid's default column, now a token), `measure-column-narrow`, `measure-column-wide` and `size-square`.

## 0.3.2

### Patch Changes

- 48f2c95: An open Dialog shows again. `components.css` had a second `.feitio-dialog[open]` rule with `opacity: 0` outside its `@starting-style`, so every open Dialog stayed invisible behind its backdrop. A test now refuses an open state hidden that way.

## 0.3.1

No changes in this release.

## 0.3.0

### Minor Changes

- 41ea4d4: Kanban and KanbanCard: work in columns, one per stage. Wide, a file of folders with tabs and cards held by tape; on a phone, stage tabs. Cards move by dragging (they follow the hand on a spring) or with their button (phone and keyboard), only to the columns they list; every move sends the cancelable `feitio-kanban-move` first. Columns may offer a new-card button (`feitio-kanban-create`). The sides fade while there is more to scroll, and a map of the board shows when the columns do not fit. The card's content is free.

## 0.2.1

### Patch Changes

- c8b7b9d: The docs moved to their own domain, https://feitio.bymaid.com: every package's homepage and README point there.

## 0.2.0

### Minor Changes

- ac96dc2: `css/fonts.css` now serves Alegreya and Alegreya Sans from the package itself (`fonts/`, Latin and Latin Extended, with the SIL OFL), instead of loading them from Google Fonts: no request to any other site.

## 0.1.0

### Minor Changes

- 8e911b8: `@feitio/core` gains `css/components.css` (layer `feitio.components`, loaded by `feitio.css`): Stack, Inline and Grid, Link, VisuallyHidden, Button, Tag and Notice, with small and large control sizes in the base. New `@feitio/astro`: the components as the single source of their HTML (Icon, Button, Link, Tag, Notice).
- ddc6d37: Text, LinkCard, SkipLink, Divider and Kbd styles move into `components.css`. New Astro components: LinkCard, Heading, Text, Block, VisuallyHidden, SkipLink, Divider and Kbd.
- 4a3087f: Button: pressed feedback (the lifted paper presses flat). Divider: `orientation="vertical"`, between pieces side by side.
- 9417360: Data: Table (cards on a phone, compact density), SummaryList, TaskList and Pagination in Astro; their styles move into core.
- 0a44a42: Feedback: ErrorMessage, ErrorSummary, EmptyState and StatusOverlay in Astro; their styles in core; `status()` in vanilla sets a StatusOverlay's state and words.
- 2c34205: FilterField: filtered items slide shut and open again; optional `debounce` (a line fills under the field while it waits) and `async` search (a `feitio-filter` event with the query and `done()`, with a turning stroke and a busy label). Both off by default.
- 501d247: First packages: `@feitio/core` (tokens, layered base CSS, hand-drawn icons and illustrations) and `@feitio/vanilla` (the Notice's close button and timer).
- 4cce61b: Forms: Field, TextInput, Textarea, Select, Checkbox, Radios, Switch, TimeInput, Fieldset, SegmentedControl and FilterField. Styles move into core; behaviors in vanilla (`forms`: Switch state in words, AM/PM, segmented choice, filter by delegation); HTML in astro.
- 125f025: New Menu: a button that opens a short list of links or actions as lifted paper, with the popover API, focus on the current item, arrows, Home, End and Esc. Styles in core, behavior in vanilla (`menus`), HTML in astro (`Menu.astro`).
- 46cbe71: Navigation: AppShell, Nav, Breadcrumbs, Anchor, Details, ScrollFade, BackToTop, Search, Header and Footer in Astro; their styles in core; `scrolls()` in vanilla wires ScrollFade and BackToTop to the box around them (or the window).
- e685900: On top of the screen and documentation: Dialog (with typed confirmation), Drawer (any edge, optional footer), CodeBlock, Example, DoDont and Swatch in Astro, with their styles in core; `dialogs()` in vanilla opens Dialogs and handles the typed confirmation.

### Patch Changes

- 00308ce: Documentation site: every Design, Development and Resources page, the components overview and the home page, in five languages.
- 0a1821e: Documentation site: a Markdown copy of every page, and an `llms.txt` and `llms-full.txt` per language, for AI agents.
- 78a795e: Every package has its README on npm, keywords, homepage and issue links. `@feitio/vanilla` ships type declarations for each entry point.
