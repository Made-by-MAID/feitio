/** A spring: how stiff it is and how much it brakes. */
export interface Spring {
  stiffness: number;
  damping: number;
}

/** The card that flies to another column: it passes the mark a little and comes back. */
export const FLY: Spring = { stiffness: 170, damping: 14 };
/** The cards that make room: firm, no bounce to speak of. */
export const SETTLE: Spring = { stiffness: 230, damping: 24 };
/** The tab that receives a card on a phone: a short hop. */
export const HOP: Spring = { stiffness: 320, damping: 11 };

/**
 * Where a mass on a spring is, frame by frame at 60 per second, from 0 until it rests at 1 (passing
 * it a little when the spring is loose). The last frame is always exactly 1.
 */
export function springCurve(spring: Spring, maxFrames = 240): number[] {
  let x = 0;
  let v = 0;
  const out = [0];
  const dt = 1 / 60;
  for (let i = 0; i < maxFrames; i++) {
    v += (-spring.stiffness * (x - 1) - spring.damping * v) * dt;
    x += v * dt;
    out.push(x);
    if (Math.abs(x - 1) < 0.002 && Math.abs(v) < 0.01) break;
  }
  out[out.length - 1] = 1;
  return out;
}

/** How long a curve of springCurve lasts, in milliseconds. */
export function curveDuration(curve: number[]): number {
  return (curve.length * 1000) / 60;
}

/** The card in the hand: where it is, how fast it goes, and how far it leans. */
export interface Follow {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tilt: number;
}

/**
 * One frame of the card following the pointer: it is pulled toward the target by a spring, so it lags
 * a little, leans toward where it is going (up to 14 degrees) and sways when the pointer stops.
 */
export function followStep(state: Follow, targetX: number, targetY: number): Follow {
  const vx = (state.vx + (targetX - state.x) * 0.3) * 0.62;
  const vy = (state.vy + (targetY - state.y) * 0.3) * 0.62;
  const lean = Math.max(-14, Math.min(14, vx * 1.2));
  return {
    x: state.x + vx,
    y: state.y + vy,
    vx,
    vy,
    tilt: state.tilt + (lean - state.tilt) * 0.18,
  };
}

/** How far a card leans on its way to another column: with the distance, up to 9 degrees. */
export function flightTilt(dx: number): number {
  return Math.max(-9, Math.min(9, dx / 35));
}

/** Whether the sides fade: there is more than a few pixels to scroll on that side. */
export function edgesVisible(
  scrollLeft: number,
  clientWidth: number,
  scrollWidth: number,
): { start: boolean; end: boolean } {
  return { start: scrollLeft > 8, end: scrollLeft + clientWidth < scrollWidth - 8 };
}

/**
 * How fast the board scrolls by itself while a card is held near its sides: nothing out of the zone,
 * up to max pixels a frame at the very edge.
 */
export function autoScrollSpeed(
  pointerX: number,
  left: number,
  right: number,
  zone = 90,
  max = 16,
): number {
  if (pointerX < left + zone) return -((left + zone - pointerX) / zone) * max;
  if (pointerX > right - zone) return ((pointerX - (right - zone)) / zone) * max;
  return 0;
}

/** Where a card dropped at height y goes among cards whose middles are given: before the first one below it. */
export function insertionIndex(middles: number[], y: number): number {
  const i = middles.findIndex((m) => y < m);
  return i === -1 ? middles.length : i;
}
