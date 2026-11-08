# Motion

## Nothing jumps

Every change of state is a transition: colors when day turns to night, spacing when the density
changes, sizes when content grows, a hover. One duration (`duration-change`, 320ms) and one curve
(`easing-change`) that starts gently and lands softly. The base CSS sets this on every element.

## Paper being placed

What arrives floating, a menu, a notice, settles like a cut-out laid on the table: a small turn,
the shadow forming (`feitio-place`, `duration-place` and `easing-place`, with a slight overshoot).
It happens only when someone acts.

## Less motion

When the system asks for reduced motion, there is none: no transition, no animation.

## Avoid

- Motion nobody asked for: sections sliding in on scroll, hovers that bounce.
- More than one moment of motion arriving on its own on a page.
