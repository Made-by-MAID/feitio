import { describe, expect, test } from 'bun:test';
import { formatCssValue } from './format-css-value.ts';

describe('formatCssValue', () => {
  test('a color becomes oklch with lightness in percent', () => {
    expect(formatCssValue('color', { colorSpace: 'oklch', components: [0.96, 0.018, 80] })).toBe(
      'oklch(96% 0.018 80)',
    );
  });

  test('a color with alpha keeps it after a slash', () => {
    expect(
      formatCssValue('color', { colorSpace: 'oklch', components: [0.26, 0.022, 55], alpha: 0.15 }),
    ).toBe('oklch(26% 0.022 55 / 0.15)');
  });

  test('a dimension or duration joins value and unit', () => {
    expect(formatCssValue('dimension', { value: 1.25, unit: 'rem' })).toBe('1.25rem');
    expect(formatCssValue('duration', { value: 260, unit: 'ms' })).toBe('260ms');
  });

  test('a font family quotes names with spaces and leaves generic families bare', () => {
    expect(formatCssValue('fontFamily', ['Alegreya Sans', 'Georgia', 'sans-serif'])).toBe(
      '"Alegreya Sans", "Georgia", sans-serif',
    );
  });

  test('numbers and weights are written as they are', () => {
    expect(formatCssValue('fontWeight', 800)).toBe('800');
    expect(formatCssValue('number', 1.6)).toBe('1.6');
  });

  test('a cubic bezier becomes the CSS function', () => {
    expect(formatCssValue('cubicBezier', [0.2, 0.9, 0.3, 1.25])).toBe(
      'cubic-bezier(0.2, 0.9, 0.3, 1.25)',
    );
  });

  test('a shadow lists its offsets and points its color reference at the variable', () => {
    const shadow = {
      color: '{color.shadow}',
      offsetX: { value: 5, unit: 'px' },
      offsetY: { value: 6, unit: 'px' },
      blur: { value: 0, unit: 'px' },
      spread: { value: 0, unit: 'px' },
    } as const;
    expect(formatCssValue('shadow', shadow)).toBe('5px 6px 0px 0px var(--feitio-color-shadow)');
  });

  test('a reference anywhere becomes the variable it names', () => {
    expect(formatCssValue('dimension', '{space.3}')).toBe('var(--feitio-space-3)');
  });

  test.each([
    ['color', 12],
    ['dimension', 12],
    ['duration', [1]],
    ['fontFamily', 12],
    ['fontWeight', [400]],
    ['number', { value: 1, unit: 'px' }],
    ['cubicBezier', 12],
    ['shadow', 12],
  ] as const)('refuses a %s token holding %p', (type, value) => {
    expect(() => formatCssValue(type, value)).toThrow(`a ${type} token cannot hold`);
  });
});
