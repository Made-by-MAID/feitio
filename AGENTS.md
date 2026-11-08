# Working on Feitio

Rules for anyone changing this repository, people and AI agents alike. Read the
[guidelines](docs/guidelines/README.md) before touching anything visual.

## Never

- Edit generated files by hand: `css/tokens.css`, `js/tokens.ts`, `icons/sprite.svg`. Change
  `tokens/` or `icons/` and run `bun run build`.
- Write a color, size or duration directly in CSS. Every value comes from a token, read as
  `var(--feitio-...)`. A missing value is a new token, not a literal.
- Add a component here. Components belong to the framework ports.
- Add a theme that changes anything but colors.
- Draw an icon as a single continuous line (see [iconography](docs/guidelines/iconography.md)).

## Tokens

- The source of truth is `tokens/`, in the Design Tokens format 2025.10. Colors are OKLCH:
  `{ "colorSpace": "oklch", "components": [lightness 0..1, chroma, hue] }`.
- A theme is `tokens/themes/<name>.<light|dark>.tokens.json` and fills the color roles of
  `casa.light.tokens.json`, no more, no fewer. Day and night are designed apart; night is never the
  day inverted.
- The pairs that must stay readable are listed in `src/tokens/data/contrast-requirements.ts`. A new
  role that carries text or meaning gets its pair there.
- After any change: `bun run build`, then `bun run check`.

## Icons and illustrations

- Icons: `icons/<name>.svg`, on the 24 by 24 grid, `stroke="currentColor"`, drawn with `<path>`
  only, `aria-hidden="true"` on the root. The tests enforce the grid, the color and the paths.
- Illustrations: `illustrations/<name>.svg`, ink in `currentColor`, the orange touch on paths with
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
