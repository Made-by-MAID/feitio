# @feitio/core

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
