import { describe, expect, test } from 'bun:test';
import { isInSrgbGamut } from './is-in-srgb-gamut.ts';

describe('isInSrgbGamut', () => {
  test('a warm cream fits in sRGB', () => {
    expect(isInSrgbGamut({ l: 0.96, c: 0.018, h: 80 })).toBe(true);
  });

  test('a very saturated green does not', () => {
    expect(isInSrgbGamut({ l: 0.7, c: 0.35, h: 145 })).toBe(false);
  });
});
