import type { Oklch } from '../data/oklch.ts';
import { oklchToLinearSrgb } from './oklch-to-linear-srgb.ts';

/** How far past 0 or 1 a channel may go and still count as inside, for rounding. */
const TOLERANCE = 0.002;

/** Whether an OKLCH color can be shown on an ordinary sRGB screen without clipping. */
export function isInSrgbGamut(color: Oklch): boolean {
  const { r, g, b } = oklchToLinearSrgb(color);
  return [r, g, b].every((channel) => channel >= -TOLERANCE && channel <= 1 + TOLERANCE);
}
