import { describe, expect, test } from 'bun:test';
import { themeColors } from './theme-colors.ts';

describe('themeColors', () => {
  test('maps each color role to its OKLCH, leaving other tokens out', () => {
    const colors = themeColors({
      color: {
        $type: 'color',
        surface: { $value: { colorSpace: 'oklch', components: [0.96, 0.018, 80] } },
      },
      space: { $type: 'dimension', '1': { $value: { value: 4, unit: 'px' } } },
    });
    expect([...colors]).toEqual([['surface', { l: 0.96, c: 0.018, h: 80 }]]);
  });

  test('a color given by reference is left out, since it has no value of its own', () => {
    const colors = themeColors({ color: { $type: 'color', link: { $value: '{color.accent}' } } });
    expect(colors.size).toBe(0);
  });
});
