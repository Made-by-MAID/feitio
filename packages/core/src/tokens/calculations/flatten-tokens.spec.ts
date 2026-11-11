import { describe, expect, test } from 'bun:test';
import type { TokenGroup } from '../data/token.ts';
import { flattenTokens } from './flatten-tokens.ts';

describe('flattenTokens', () => {
  test('walks nested groups and keeps the path of each token', () => {
    const tree: TokenGroup = {
      space: { $type: 'dimension', '1': { $value: { value: 4, unit: 'px' } } },
    };
    expect(flattenTokens(tree)).toEqual([
      { path: ['space', '1'], type: 'dimension', value: { value: 4, unit: 'px' } },
    ]);
  });

  test("a token's own type wins over its group's", () => {
    const tree: TokenGroup = {
      misc: {
        $type: 'number',
        ratio: { $value: 1.6 },
        gap: { $type: 'dimension', $value: { value: 1, unit: 'rem' } },
      },
    };
    expect(flattenTokens(tree).map((token) => token.type)).toEqual(['number', 'dimension']);
  });

  test('skips $description and other $ keys', () => {
    const tree: TokenGroup = {
      $description: 'root',
      a: { $type: 'number', $description: 'g', b: { $value: 1 } },
    };
    expect(flattenTokens(tree)).toHaveLength(1);
  });

  test('refuses a token with no type anywhere', () => {
    const tree: TokenGroup = { a: { $value: 1 } };
    expect(() => flattenTokens(tree)).toThrow('a has no $type');
  });
});
