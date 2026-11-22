---
"@feitio/core": minor
"@feitio/astro": minor
"@feitio/react": minor
---

Masonry and Heatmap, and no letter cut by a border. Masonry puts blocks in columns that fit the width, each right under the one before (CSS columns today, native `grid-lanes` masonry where the browser has it), with `gap`, `min` (`narrow`, `regular`, `wide`) and `as`. Heatmap is a grid of fixed positions for a value over time (13 weeks by 7 days, 7 days by 24 hours), a real table with a caption, labelled rows and columns, a title and a level for every square, and a legend in words; tones for states (`ok`, `warn`, `error`, `empty`) and an ink scale (`low`, `mid`, `high`). Neither needs an inline style, so both work under a strict CSP. New tokens `inset-word` and `inset-word-block` give every bordered short word (Tag at both sizes, the small Button, SegmentedControl, Kbd, KanbanCard's move button) room for a letter that reaches past its width or below the line, like the f of "Off" or a j. New tokens `measure-column` (Grid's default column, now a token), `measure-column-narrow`, `measure-column-wide` and `size-square`.
