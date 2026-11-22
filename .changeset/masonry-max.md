---
"@feitio/core": minor
"@feitio/astro": minor
"@feitio/react": minor
---

Masonry takes `max` (2 to 6), the most columns it may make, rendered as `data-max`: on a very wide screen a few blocks stay together instead of leaving the right half empty. Without it, as many columns as fit, as before. CSS columns get the count as their maximum; with native masonry (`grid-lanes`), the tracks are capped the same way.

No component renders an inline `style` attribute any more, so every one works under a strict CSP (`style-src 'self'`): Table's frame is now the `feitio-table-frame` class, Swatch takes its role as `data-role`, and Grid's `min` takes the steps `narrow`, `regular` and `wide` as `data-min`, like Masonry. Grid still accepts any length for compatibility, as an inline custom property, which a strict CSP blocks.
