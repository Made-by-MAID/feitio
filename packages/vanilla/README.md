# @feitio/vanilla

The little JavaScript some Feitio components need, for any HTML: no framework, no build step
required. Each behavior takes the page (`window`) as a parameter and works by delegation, so HTML
added later is covered too.

```sh
npm install @feitio/core @feitio/vanilla
```

```js
import { dialogs, forms, menus, notices, scrolls } from '@feitio/vanilla';

const notice = notices(window); // close buttons, and timed notices that pause under the pointer
notice.show(document.getElementById('saved'));
menus(window); // Menu: position, focus, arrow keys
forms(window); // Switch, SegmentedControl, TimeInput, FilterField
dialogs(window); // openers, typed confirmation, reset on close
scrolls(window); // ScrollFade and BackToTop
```

Each behavior also has its own entry point (`@feitio/vanilla/notice`, `/menu`, `/forms`,
`/status`, `/scroll`, `/dialog`). The markup comes from Feitio's components
([`@feitio/astro`](https://www.npmjs.com/package/@feitio/astro), or the HTML in the docs), and the
styles from [`@feitio/core`](https://www.npmjs.com/package/@feitio/core).

Docs: https://made-by-maid.github.io/feitio/

MIT.
