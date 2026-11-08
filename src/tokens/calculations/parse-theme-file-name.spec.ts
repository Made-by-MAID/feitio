import { describe, expect, test } from 'bun:test';
import { parseThemeFileName } from './parse-theme-file-name.ts';

describe('parseThemeFileName', () => {
  test('reads the theme name and mode from the file name', () => {
    expect(parseThemeFileName('casa.dark.tokens.json')).toEqual({ name: 'casa', mode: 'dark' });
    expect(parseThemeFileName('horta.light.tokens.json')).toEqual({ name: 'horta', mode: 'light' });
  });

  test('ignores any other file', () => {
    expect(parseThemeFileName('README.md')).toBeNull();
    expect(parseThemeFileName('casa.dusk.tokens.json')).toBeNull();
  });
});
