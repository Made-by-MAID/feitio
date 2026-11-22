/**
 * Which section an Anchor marks as current: the last one whose top has passed the line near the top
 * of the box that scrolls. Before any passes it, the first; at the very end of the scroll, the last,
 * even when it is too short to ever reach the line.
 * tops are the sections' tops measured from the top of the visible box, in document order.
 */
export function currentSection(tops: readonly number[], line: number, atEnd: boolean): number {
  if (tops.length === 0) return -1;
  if (atEnd) return tops.length - 1;
  let current = 0;
  tops.forEach((top, i) => {
    if (top <= line) current = i;
  });
  return current;
}

/** The line a section's top must pass: a quarter down the visible height, at most 10rem. */
export function followLine(visibleHeight: number, rem: number): number {
  return Math.min(visibleHeight / 4, 10 * rem);
}

/** How a click scrolls: smoothly, or at once when motion is reduced or turned off (data-motion="direct"). */
export function motionFor(reduced: boolean, direct: boolean): ScrollBehavior {
  return reduced || direct ? 'auto' : 'smooth';
}
