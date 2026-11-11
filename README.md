# Feitio

A handmade, humanist design system. _Feitio_ is Portuguese for the way a thing is made, by hand.

Feitio holds what every interface built with it shares: the guidelines, the design tokens, the base
CSS, the icons and the illustrations. It has no components and no framework. Components live in a
port per framework (`feitio-react`, `feitio-astro`...), each one built on this repository.

## The idea

**A living workshop**: interfaces that show the care of whoever made them and the will to keep going.

- **Refinement.** Few elements, each one well finished. If it does not help, it goes.
- **Process.** The marks of the work stay in sight when they help to understand: what changed, why,
  what comes next.
- **Energy.** The orange is movement. It shows up only where something happens.

And three things Feitio never is: **techy** (no neon, no glowing dark screens, no decorative
monospace), **convoluted** (one idea per block, few kinds of component) and **noisy** (rare orange,
motion only in answer to an action).

The guidelines are in [`docs/guidelines/`](docs/guidelines/README.md).

## Use it

Feitio is plain CSS, in the package `@feitio/core`. Load the fonts (or host them yourself) and the
stylesheet:

```html
<link rel="stylesheet" href="packages/core/css/fonts.css">
<link rel="stylesheet" href="packages/core/css/feitio.css">
```

Once published, the same files come from npm (`@feitio/core/css/feitio.css`) or a CDN that serves npm.

That is enough for a page in the house theme, by day or at night following the system. Pick them
yourself with attributes on any element, the root or a single block:

```html
<html data-theme="casa" data-mode="dark">
<section data-density="compact">
```

- `data-theme`: the color theme. `casa` (cream, ink and orange) is the default.
- `data-mode`: `light` or `dark`. With none, the page follows the system.
- `data-density`: `compact` for work screens with tables and forms; reading pages stay comfortable.

Every value is a CSS custom property prefixed `--feitio-`:

```css
.card {
  background: var(--feitio-color-surface-raised);
  border-radius: var(--feitio-radius);
  padding: var(--feitio-space-5) var(--feitio-space-4);
}
```

The shared shapes come as classes: `feitio-block`, `feitio-lift` (lifted paper), `feitio-place`
(paper being placed), `feitio-paper` (the uneven corners), `feitio-note` (a process note),
`feitio-measure` (a reading column), `feitio-icon` and `feitio-illustration`.

### Icons

Every icon is in `packages/core/icons/sprite.svg`, as a symbol named `feitio-<name>`:

```html
<svg class="feitio-icon" aria-hidden="true"><use href="packages/core/icons/sprite.svg#feitio-search"/></svg>
```

An icon is decoration: the word next to it, or the `aria-label` of an icon-only button, names it.

### Behaviors

`@feitio/vanilla` brings the little JavaScript some components need, for any HTML. Today, the
Notice: a close button and, when asked, a time to go away that stops under the pointer or focus.

```js
import { notices } from '@feitio/vanilla/notice';
const notice = notices(window);
notice.show(document.getElementById('saved'));
```

### A theme of your own

A theme for outside work (a shop's landing page, a side project) changes **only the colors**. Add
`packages/core/tokens/themes/<name>.light.tokens.json` filling the same color roles as `casa`, run the build, and
use `data-theme="<name>"`. A night version (`<name>.dark.tokens.json`) is optional. The tests fail
if any pair of roles falls below WCAG 2.2 AA contrast. Work that needs more than new colors is
better made outside Feitio.

## What is here

A Bun workspace. Every published package shares one version.

- `packages/core` (`@feitio/core`): the foundation.
  - `tokens/`: the source of truth, in the [Design Tokens](https://www.designtokens.org/) format
    (2025.10). `base.tokens.json` for what every theme shares; `themes/` for the colors.
  - `css/tokens.css`, `js/tokens.ts`, `icons/sprite.svg`: generated from `tokens/` and `icons/` by
    the build. Never edit them by hand.
  - `css/base.css`: the page itself and the shared shapes, in the layers `feitio.reset`,
    `feitio.base` and `feitio.shapes`.
  - `icons/`, `illustrations/`: hand-drawn SVG.
- `packages/vanilla` (`@feitio/vanilla`): component behaviors in plain JavaScript.
- `docs/guidelines/`: how and why.
- `site/`: the showcase, in English and Portuguese, published on GitHub Pages straight from `main`
  (the root `index.html` sends visitors there).
- `skills/feitio/`: a skill for AI coding agents that build interfaces with Feitio.

Coming next: `@feitio/astro` (the components, the single source of their HTML), the documentation
site built with it, and `@feitio/react`.

## Work on it

With [Bun](https://bun.sh):

```sh
bun install
bun run build   # tokens and icons into packages/core: css/, js/ and icons/sprite.svg
bun run check   # style, types and tests (contrast, gamut, icons, generated files up to date)
```

The showcase (`site/index.html`, published on GitHub Pages) is checked in a real browser by
`bun run test:e2e`: axe-core accessibility by day, at night and in compact density, no broken
request, no sideways scroll on a phone. It needs Chromium (`bunx playwright install chromium`).

Read [`AGENTS.md`](AGENTS.md) before changing anything; it holds the rules for people and agents.

## License

[MIT](LICENSE). Alegreya and Alegreya Sans, by Juan Pablo del Peral (Huerta Tipográfica), are under
the SIL Open Font License and are not part of this repository.

Made by MAID, an AI assistant, for [@HenriqueArtur](https://github.com/HenriqueArtur).
