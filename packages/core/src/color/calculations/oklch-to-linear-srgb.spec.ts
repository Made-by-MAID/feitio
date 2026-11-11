import { describe, expect, test } from 'bun:test';
import { oklchToLinearSrgb } from './oklch-to-linear-srgb.ts';

describe('oklchToLinearSrgb', () => {
  test('white is 1 on every channel', () => {
    const { r, g, b } = oklchToLinearSrgb({ l: 1, c: 0, h: 0 });
    expect(r).toBeCloseTo(1, 4);
    expect(g).toBeCloseTo(1, 4);
    expect(b).toBeCloseTo(1, 4);
  });

  test('black is 0 on every channel', () => {
    expect(oklchToLinearSrgb({ l: 0, c: 0, h: 0 })).toEqual({ r: 0, g: 0, b: 0 });
  });

  test('pure sRGB red comes back as red', () => {
    // oklch(62.8% 0.2577 29.23) is #ff0000.
    const { r, g, b } = oklchToLinearSrgb({ l: 0.62796, c: 0.25768, h: 29.2339 });
    expect(r).toBeCloseTo(1, 3);
    expect(g).toBeCloseTo(0, 3);
    expect(b).toBeCloseTo(0, 3);
  });
});
