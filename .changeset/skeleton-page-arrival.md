---
"@feitio/core": minor
"@feitio/vanilla": minor
"@feitio/astro": minor
"@feitio/react": minor
---

New Skeleton (a loading placeholder: text lines, a block or a circle) and Page (a page's frame inside the AppShell: header and content in the dashboard, sections, detail or board layout); new `settle(window)` in `@feitio/vanilla/arrival`, which holds every transition while a page marked `data-feitio-arriving` settles, so it no longer animates into place on load; on a wide screen the AppShell is at least the window's height (`--feitio-app-min`, `100dvh` by default: a page with a banner beside the shell sets the window less the banner), so its page fills the window without passing it and the wheel over a sticky Anchor or the navigation scrolls the page (#34, #35); a filterable item's clip leaves room for a lifted card's shadow.
