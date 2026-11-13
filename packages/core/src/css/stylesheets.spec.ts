import { expect, test } from 'bun:test';
import { join } from 'node:path';
import { readTextFile } from '../tokens/actions/read-text-file.ts';
import { definedVariables, usedVariables } from './calculations/css-variables.ts';

const cssFolder = join(import.meta.dir, '..', '..', 'css');

test('the base reads no Feitio variable that the tokens or the base do not declare', async () => {
  const tokens = (await readTextFile(join(cssFolder, 'tokens.css'))) ?? '';
  const base = (await readTextFile(join(cssFolder, 'base.css'))) ?? '';
  const declared = new Set([...definedVariables(tokens), ...definedVariables(base)]);
  const unknown = [...usedVariables(base)].filter((name) => !declared.has(name));
  expect(unknown).toEqual([]);
});

test('the components read no Feitio variable that the tokens or the base do not declare', async () => {
  const tokens = (await readTextFile(join(cssFolder, 'tokens.css'))) ?? '';
  const base = (await readTextFile(join(cssFolder, 'base.css'))) ?? '';
  const components = (await readTextFile(join(cssFolder, 'components.css'))) ?? '';
  const declared = new Set([
    ...definedVariables(tokens),
    ...definedVariables(base),
    '--notice-p',
    '--feitio-gap',
    '--feitio-grid-min',
    '--feitio-filter-debounce',
    '--feitio-scroll-fade-bleed',
    '--feitio-scroll-fade-to',
  ]);
  const unknown = [...usedVariables(components)].filter((name) => !declared.has(name));
  expect(unknown).toEqual([]);
});
