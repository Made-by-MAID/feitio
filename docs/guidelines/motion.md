# Motion

## Nothing jumps

Every change of state is a transition: colors when day turns to night, spacing when the density
changes, sizes when content grows, a hover. One duration (`duration-change`, 320ms) and one curve
(`easing-change`) that starts gently and lands softly. The base CSS sets this on every element.

## Paper being placed

What arrives floating, a menu, a notice, settles like a cut-out laid on the table: a small turn,
the shadow forming (`feitio-place`, `duration-place` and `easing-place`, with a slight overshoot).
It happens only when someone acts.

## One paper at a time

When one action makes several things appear, only one arrives as placed paper: the one that speaks
to the person, like the notice that it worked. The others slide in, like a new row in a list that
opens room and pushes the rows below. Two papers landing at once compete for the eye and look like a
mess.

What is already on screen does not land again. If the same action happens twice, the notice swaps its
text and stays where it is. Leaving is a slide too: the piece fades and its space closes.

## Where motion turns off

Where a piece follows the finger (dragging, drawing, resizing, a huge list scrolling), a transition
would make it lag. `data-motion="direct"` turns motion off in that area only.

## Less motion

When the system asks for reduced motion, there is none: no transition, no animation.

## Avoid

- Motion nobody asked for: sections sliding in on scroll, hovers that bounce.
- More than one moment of motion arriving on its own on a page.
