# Shape and depth

## Uneven corners

Corners are slightly uneven, like paper cut by hand: each corner has its own small radius
(`--feitio-radius`). The same shape goes on blocks and controls alike.

## The ink line

Borders are a fine pen stroke: `border-width`, 1px, in the text color.

The scrollbar is ink too: thin, in soft ink over a clear track, in every scrolling box. The base
CSS sets it, so nothing needs to be done per page.

## Lifted paper

What floats above the page, a menu, a dialog, a highlighted card, is **lifted paper**
(`feitio-lift`): the ink line, the `surface-top` color and a hard shadow offset down and to the
right (`shadow-lift`), never blurred. Because it is strong, it is kept for what really sits on top.

## Avoid

- Soft blurred shadows.
- The same perfect radius on everything, or no radius at all.
- Thick borders.
