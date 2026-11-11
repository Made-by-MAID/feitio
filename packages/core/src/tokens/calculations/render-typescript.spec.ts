import { describe, expect, test } from 'bun:test';
import type { TokenGroup } from '../data/token.ts';
import { renderTypescript } from './render-typescript.ts';

describe('renderTypescript', () => {
  const base: TokenGroup = {
    space: { $type: 'dimension', '1': { $value: { value: 0.25, unit: 'rem' } } },
  };
  const theme: TokenGroup = {
    color: { $type: 'color', surface: { $value: { colorSpace: 'oklch', components: [1, 0, 0] } } },
  };
  const code = renderTypescript(base, [theme, theme]);

  test('maps each token name to its CSS variable, once even when several themes fill it', () => {
    expect(code).toContain(
      "  'space.1': 'var(--feitio-space-1)',\n  'color.surface': 'var(--feitio-color-surface)',\n} as const;",
    );
    expect(code.match(/color\.surface/g)).toHaveLength(1);
  });

  test('exports the union of token names as a type', () => {
    expect(code).toContain('export type TokenName = keyof typeof tokens;');
  });
});
