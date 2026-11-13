# Working on Feitio

Rules for anyone changing this repository, people and AI agents alike. Read the
[guidelines](docs/guidelines/README.md) before touching anything visual.

## Never

- Edit generated files by hand: `packages/core/css/tokens.css`, `packages/core/js/tokens.ts`,
  `packages/core/icons/sprite.svg`. Change `packages/core/tokens/` or `packages/core/icons/` and run
  `bun run build`.
- Write a color, size or duration directly in CSS. Every value comes from a token, read as
  `var(--feitio-...)`. A missing value is a new token, not a literal.
- Write a component's HTML twice. The Astro components (`@feitio/astro`) are the single
  source of the markup; `@feitio/vanilla` holds only behavior, and every port (React) must match the
  Astro HTML: `packages/react/parity/` checks it.
- Add a theme that changes anything but colors.
- Draw an icon as a single continuous line (see [iconography](docs/guidelines/iconography.md)).

## Packages

- A Bun workspace: `packages/core` (`@feitio/core`: tokens, base CSS, component CSS, icons,
  illustrations), `packages/vanilla` (`@feitio/vanilla`: component behaviors), `packages/astro`
  (`@feitio/astro`: the components' HTML), `packages/react` (`@feitio/react`: the same components
  for React) and `apps/docs` (the site, private). Root scripts run for all of them.
- A component is four files at most: its HTML in `packages/astro/src/<Name>.astro`, its styles in
  `packages/core/css/components.css`, its behavior (if any) in `packages/vanilla/src/<name>/`, and
  its React twin in `packages/react/src/<Name>.tsx`, which renders the very same HTML and wires the
  behavior with a hook when it mounts. A new component, or a new prop, gets its cases in
  `packages/react/parity/cases.ts`; `bun run test:parity` compares both renders (after
  `FEITIO_PARITY=1 bun run docs:build`) and drives the hooks in a real browser. Its
  docs page lives in `apps/docs/src/pages/[lang]/components/`, with its words per language in
  `apps/docs/src/content/`; examples render the component itself (`renderHtml`), so "Show code"
  always shows what runs.
- Every docs page exists in all five languages (PT, EN, ES, FR, DE). New words go in all five.
- For agents, read `/<lang>/llms.txt` (an index) or `/<lang>/llms-full.txt` (everything) on the published site, or any page's `index.md`.
- A component enters with its tests in `apps/docs/tests/run.ts`, a real browser over the built site:
  axe by day and at night in every language, no sideways scroll on a phone, and its behavior
  (clicks, keyboard, focus). `bun run test:docs` builds the site and runs them. A component page
  with props worth trying gets a Playground (every combination rendered by the component itself).
- All published packages share one version (the `fixed` group in `.changeset/config.json`). A pull
  request that changes a published package adds a changeset: `bun run changeset`.
- Behaviors take the page as a parameter (`window`, a root), never a global, so a test hands in a
  happy-dom window. The DOM actions are tested with happy-dom; anything that needs layout, focus or
  the top layer is tested in a real browser.

## Tokens

- The source of truth is `packages/core/tokens/`, in the Design Tokens format 2025.10. Colors are OKLCH:
  `{ "colorSpace": "oklch", "components": [lightness 0..1, chroma, hue] }`.
- A theme is `packages/core/tokens/themes/<name>.<light|dark>.tokens.json` and fills the color roles of
  `casa.light.tokens.json`, no more, no fewer. Day and night are designed apart; night is never the
  day inverted.
- The pairs that must stay readable are listed in `packages/core/src/tokens/data/contrast-requirements.ts`. A new
  role that carries text or meaning gets its pair there.
- After any change: `bun run build`, then `bun run check`.

## Icons and illustrations

- Icons: `packages/core/icons/<name>.svg`, on the 24 by 24 grid, `stroke="currentColor"`, drawn with `<path>`
  only, `aria-hidden="true"` on the root. The tests enforce the grid, the color and the paths.
- Illustrations: `packages/core/illustrations/<name>.svg`, ink in `currentColor`, the orange touch on paths with
  `class="feitio-hot"`.

## Code

- TypeScript run by Bun, tested with `bun test`. Tests come first.
- Functional: data in `data/`, pure calculations in `calculations/`, anything that touches files in
  `actions/`, one action per file; `flows/` put them together. Functions are declared with
  `function`, never as arrow functions in a `const`.
- Calculations are fully covered; the coverage threshold enforces it.
- Exact dependency versions, never `^` or `~` (`bunfig.toml` writes them exact).
- Code, comments, commits and documentation in English.
- The showcase speaks English and Portuguese: English in the markup, Portuguese beside it in
  `data-pt` (plain text) or `data-pt-html` (text with links or emphasis). New text needs both.

## Checks

`bun run check` runs Biome, the TypeScript compiler and the tests: contrast and gamut of every
theme, icon rules, no unknown `--feitio-` variable in the base CSS, generated files up to date. It
must pass before any commit.

`bun run test:e2e` opens the showcase in Chromium and runs axe-core on it.
The showcase uses only Feitio's files and tokens, like any page built with it.
