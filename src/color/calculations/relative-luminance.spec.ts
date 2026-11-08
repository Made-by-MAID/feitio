import { describe, expect, test } from 'bun:test';
import { relativeLuminance } from './relative-luminance.ts';

describe('relativeLuminance', () => {
  test('white is 1 and black is 0', () => {
    expect(relativeLuminance({ l: 1, c: 0, h: 0 })).toBeCloseTo(1, 4);
    expect(relativeLuminance({ l: 0, c: 0, h: 0 })).toBe(0);
  });

  test('channels outside the gamut are clipped before weighing', () => {
    const luminance = relativeLuminance({ l: 0.7, c: 0.35, h: 145 });
    expect(luminance).toBeGreaterThan(0);
    expect(luminance).toBeLessThanOrEqual(1);
  });
});
