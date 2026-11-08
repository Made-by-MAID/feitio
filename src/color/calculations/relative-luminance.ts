import type { Oklch } from '../data/oklch.ts';
import { oklchToLinearSrgb } from './oklch-to-linear-srgb.ts';

function clip(channel: number): number {
  return Math.min(1, Math.max(0, channel));
}

/** WCAG relative luminance: linear-light sRGB weighed by how bright each channel looks. */
export function relativeLuminance(color: Oklch): number {
  const { r, g, b } = oklchToLinearSrgb(color);
  return 0.2126 * clip(r) + 0.7152 * clip(g) + 0.0722 * clip(b);
}
