# @feitio/core

The foundation of Feitio, a handmade, humanist design system: the design tokens, the layered base
and component CSS, the hand-drawn icons and the illustrations. Plain CSS, for any page.

```sh
npm install @feitio/core
```

```html
<link rel="stylesheet" href="node_modules/@feitio/core/css/fonts.css">
<link rel="stylesheet" href="node_modules/@feitio/core/css/feitio.css">

<button type="submit" class="feitio-button" data-variant="primary">Save changes</button>
```

Or, with a bundler: `import '@feitio/core/css/feitio.css';`

- **Themes and modes by attribute**: `data-theme="casa"`, `data-mode="dark"`,
  `data-density="compact"`, on the root or on a single block.
- **Tokens**: every value is a `--feitio-` custom property. The source is in `tokens/` (Design
  Tokens format), and `js/tokens.ts` names each one for TypeScript.
- **Icons**: `icons/sprite.svg`, each icon a symbol named `feitio-<name>`.
- **Illustrations**: `illustrations/*.svg`, ink in `currentColor`.

Components: [`@feitio/astro`](https://www.npmjs.com/package/@feitio/astro) and
[`@feitio/react`](https://www.npmjs.com/package/@feitio/react). Behaviors for plain HTML:
[`@feitio/vanilla`](https://www.npmjs.com/package/@feitio/vanilla).

Guidelines, every component and when not to use it: https://made-by-maid.github.io/feitio/

MIT. The Alegreya fonts are under the SIL Open Font License and are not part of this package.
