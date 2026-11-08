import { expect, test } from 'bun:test';
import { join } from 'node:path';
import { loadIcons } from '../icons/actions/load-icons.ts';
import { readTextFile } from '../tokens/actions/read-text-file.ts';
import { definedVariables, usedVariables } from './calculations/css-variables.ts';

const repo = join(import.meta.dir, '..', '..');

async function read(...path: string[]): Promise<string> {
  return (await readTextFile(join(repo, ...path))) ?? '';
}

test('the showcase reads only Feitio variables that exist', async () => {
  const declared = new Set([
    ...definedVariables(await read('css', 'tokens.css')),
    ...definedVariables(await read('css', 'base.css')),
  ]);
  const unknown = [...usedVariables(await read('site', 'index.html'))].filter(
    (name) => !declared.has(name),
  );
  expect(unknown).toEqual([]);
});

test('the showcase uses only icons the sprite has', async () => {
  const page = await read('site', 'index.html');
  const known = new Set((await loadIcons(join(repo, 'icons'))).map((icon) => icon.name));
  const inMarkup = [...page.matchAll(/#feitio-([a-z-]+)"/g)].map((match) => match[1] as string);
  const listed = [
    ...(page.match(/const icons = \{([^}]*)\}/)?.[1] ?? '').matchAll(/'?([a-z-]+)'?:/g),
  ].map((match) => match[1] as string);
  expect([...inMarkup, ...listed].filter((name) => !known.has(name))).toEqual([]);
  expect(listed.sort()).toEqual([...known].sort());
});

test('every switch the showcase script wires has its buttons in the markup', async () => {
  const page = await read('site', 'index.html');
  const markup = page.slice(0, page.indexOf('<script>'));
  const wired = [...page.matchAll(/\[data-([a-z]+)-set\]/g)].map((match) => match[1] as string);
  const switches = [...new Set([...wired, 'mode', 'density', 'language'])];
  const missing = switches.filter((name) => !markup.includes(`data-${name}-set=`));
  expect(missing).toEqual([]);
});
