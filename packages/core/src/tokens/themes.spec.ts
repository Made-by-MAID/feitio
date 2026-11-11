import { describe, expect, test } from 'bun:test';
import dark from '../../tokens/themes/casa.dark.tokens.json';
import light from '../../tokens/themes/casa.light.tokens.json';
import { isInSrgbGamut } from '../color/calculations/is-in-srgb-gamut.ts';
import { contrastFailures } from './calculations/contrast-failures.ts';
import { themeColors } from './calculations/theme-colors.ts';
import { CONTRAST_REQUIREMENTS } from './data/contrast-requirements.ts';
import type { TokenGroup } from './data/token.ts';

// JSON imports are typed by their shape; the token files are DTCG groups.
const day = light as unknown as TokenGroup;
const night = dark as unknown as TokenGroup;
const themes: Record<string, TokenGroup> = { 'casa, by day': day, 'casa, at night': night };

describe.each(Object.entries(themes))('%s', (_name, tokens) => {
  const colors = themeColors(tokens);

  test('every pair that carries meaning reaches WCAG 2.2 AA', () => {
    const report = contrastFailures(colors, CONTRAST_REQUIREMENTS).map(
      ({ requirement, ratio }) =>
        `${requirement.foreground} on ${requirement.background} (${requirement.why}): ${ratio?.toFixed(2) ?? 'missing'}, needs ${requirement.minimum}`,
    );
    expect(report).toEqual([]);
  });

  test('every color fits an ordinary sRGB screen', () => {
    const outside = [...colors].filter(([, color]) => !isInSrgbGamut(color)).map(([role]) => role);
    expect(outside).toEqual([]);
  });
});

test('day and night fill the same color roles', () => {
  expect([...themeColors(night).keys()].sort()).toEqual([...themeColors(day).keys()].sort());
});
