---
"@feitio/core": minor
"@feitio/vanilla": minor
"@feitio/astro": minor
"@feitio/react": minor
---

Anchor gets its behavior: `anchors(window, root?)` in `@feitio/vanilla` (also `@feitio/vanilla/anchor`). A click scrolls smoothly to the section (at once with reduced motion or inside `data-motion="direct"`), writes the hash without a jump and moves the focus to the section; while the page (or the box that scrolls, such as an AppShell's main area) scrolls, the link of the section in view gets `aria-current="location"`, watched with IntersectionObserver. In React the Anchor wires itself. A new `sticky` prop (`data-sticky`) keeps the Anchor in view in a side column, with its own scroll when it is taller than the screen.

AppShell on a wide screen: the navigation column stays put while the page scrolls, sticky at the top of the viewport, as tall as it, with its own scroll when it is longer. The phone Drawer is unchanged.
