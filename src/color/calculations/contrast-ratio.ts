import type { Oklch } from '../data/oklch.ts';
import { relativeLuminance } from './relative-luminance.ts';

/** WCAG 2 contrast ratio between two colors, from 1 (none) to 21 (black on white). */
export function contrastRatio(first: Oklch, second: Oklch): number {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort(
    (x, y) => y - x,
  ) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}
