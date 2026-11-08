import { describe, expect, test } from 'bun:test';
import { contrastRatio } from './contrast-ratio.ts';

const white = { l: 1, c: 0, h: 0 };
const black = { l: 0, c: 0, h: 0 };

describe('contrastRatio', () => {
  test('black on white is 21 to 1', () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 1);
  });

  test('the order of the two colors does not matter', () => {
    expect(contrastRatio(white, black)).toBe(contrastRatio(black, white));
  });

  test('a color against itself is 1 to 1', () => {
    expect(contrastRatio(white, white)).toBe(1);
  });
});
