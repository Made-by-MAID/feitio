import { expect, test } from 'bun:test';
import { join } from 'node:path';
import { loadIcons } from './actions/load-icons.ts';
import { iconProblems } from './calculations/icon-problems.ts';

test('every icon is on the 24 grid, in currentColor, drawn with paths only', async () => {
  const icons = await loadIcons(join(import.meta.dir, '..', '..', 'icons'));
  const report = icons.flatMap(({ name, svg }) =>
    iconProblems(svg).map((problem) => `${name}: ${problem}`),
  );
  expect(icons.length).toBeGreaterThan(0);
  expect(report).toEqual([]);
});
