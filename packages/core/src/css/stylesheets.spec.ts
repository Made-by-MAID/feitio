import { expect, test } from 'bun:test';
import { join } from 'node:path';
import { readTextFile } from '../tokens/actions/read-text-file.ts';
import { definedVariables, usedVariables } from './calculations/css-variables.ts';
import { hiddenOpenStates } from './calculations/hidden-open-states.ts';

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
    '--feitio-masonry-min',
    '--feitio-masonry-max',
    '--feitio-kanban-col',
    '--feitio-kanban-col-empty',
    '--feitio-kanban-tab',
    '--feitio-filter-debounce',
    '--feitio-scroll-fade-bleed',
    '--feitio-scroll-fade-to',
    // Set by the page for a Skeleton in a box narrower than its minimum.
    '--feitio-skeleton-min',
    // Set by the page for an AppShell under a banner or inside a page.
    '--feitio-app-min',
  ]);
  const unknown = [...usedVariables(components)].filter((name) => !declared.has(name));
  expect(unknown).toEqual([]);
});

test('no open state of a component is left invisible: opacity 0 only where an entry starts', async () => {
  const components = (await readTextFile(join(cssFolder, 'components.css'))) ?? '';
  expect(hiddenOpenStates(components)).toEqual([]);
});
