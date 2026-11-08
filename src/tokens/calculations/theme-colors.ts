import type { Oklch } from '../../color/data/oklch.ts';
import type { TokenGroup } from '../data/token.ts';
import { flattenTokens } from './flatten-tokens.ts';

/** The color roles a theme fills, by name (`surface`, `accent`...), as OKLCH. */
export function themeColors(tokens: TokenGroup): Map<string, Oklch> {
  const entries = flattenTokens(tokens).flatMap(({ path, type, value }) => {
    const [group, role] = path;
    if (type !== 'color' || group !== 'color' || role === undefined) return [];
    if (typeof value !== 'object' || !('colorSpace' in value)) return [];
    const [l, c, h] = value.components;
    return [[role, { l, c, h }] as const];
  });
  return new Map(entries);
}
