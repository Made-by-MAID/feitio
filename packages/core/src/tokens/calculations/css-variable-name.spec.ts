import { describe, expect, test } from 'bun:test';
import { cssVariableName } from './css-variable-name.ts';

describe('cssVariableName', () => {
  test('prefixes the path with feitio and joins it with dashes', () => {
    expect(cssVariableName(['color', 'surface-raised'])).toBe('--feitio-color-surface-raised');
  });
});
