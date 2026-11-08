# Iconography

## Icons

Icons are drawn by hand, the same way as the corners: the line overshoots the corner, a ring does
not close, a dot is not round, and the whole drawing leans a little (`feitio-icon`, rotated 3
degrees).

**No icon is a single line.** Every joint is two strokes crossing: the two legs of a check, the two
arcs of a ring, the two sides of a chevron. A continuous line reads as drawn by a computer.

Technically: a 24 by 24 grid, `stroke="currentColor"`, stroke width 2.3 with round caps and joins,
paths only, `aria-hidden="true"`. An icon is decoration; the word next to it, or the `aria-label` of
an icon-only button, names it.

## Illustrations

Small drawings for empty screens and big errors, in the same hand: ink in the text color with a
touch of orange (`feitio-hot`). They are inlined in the page so they follow the theme. In themes for
outside work, illustrations belong to the client.

## Avoid

- A ready-made geometric icon set next to these.
- Icons with fixed colors.
- An icon as the only way to tell what something does.
