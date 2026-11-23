---
"@feitio/core": minor
"@feitio/vanilla": minor
"@feitio/astro": minor
"@feitio/react": minor
---

New Skeleton (a loading placeholder: text lines, a block or a circle) and Page (a page's frame inside the AppShell: header and content in the dashboard, sections, detail or board layout); new `settle(window)` in `@feitio/vanilla/arrival`, which holds every transition while a page marked `data-feitio-arriving` settles, so it no longer animates into place on load; the AppShell's page fills the window without passing it and the wheel over a sticky Anchor or the navigation scrolls the page (#34, #35); a filterable item's clip leaves room for a lifted card's shadow.
