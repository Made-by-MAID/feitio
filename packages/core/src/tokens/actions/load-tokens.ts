import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parseThemeFileName } from '../calculations/parse-theme-file-name.ts';
import type { Theme, TokenGroup } from '../data/token.ts';
import { readJsonFile } from './read-json-file.ts';

/** The base tokens and every theme of a tokens folder, themes sorted by name, day before night. */
export async function loadTokens(folder: string): Promise<{ base: TokenGroup; themes: Theme[] }> {
  const base = (await readJsonFile(join(folder, 'base.tokens.json'))) as TokenGroup;
  const files = (await readdir(join(folder, 'themes'))).sort();
  const themes: Theme[] = [];
  for (const file of files) {
    const parsed = parseThemeFileName(file);
    if (parsed === null) continue;
    const tokens = (await readJsonFile(join(folder, 'themes', file))) as TokenGroup;
    themes.push({ ...parsed, tokens });
  }
  themes.sort((a, b) => a.name.localeCompare(b.name) || (a.mode === 'light' ? -1 : 1));
  return { base, themes };
}
