import { describe, expect, test } from 'bun:test';
import { iconProblems } from './icon-problems.ts';

const good =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 1"/></svg>';

describe('iconProblems', () => {
  test('an icon on the 24 grid, in currentColor, with only paths, has none', () => {
    expect(iconProblems(good)).toEqual([]);
  });

  test('reports another grid', () => {
    expect(iconProblems(good.replace('0 0 24 24', '0 0 32 32'))).toEqual([
      'not on the 24 by 24 grid',
    ]);
  });

  test('reports a fixed color, which would not follow the theme', () => {
    expect(iconProblems(good.replace('<path', '<path stroke="#e2571e"'))).toEqual([
      'has a fixed color: use currentColor',
    ]);
  });

  test('reports anything that is not a path', () => {
    expect(iconProblems(good.replace('<path d="M1 1"/>', '<circle r="2"/>'))).toEqual([
      'draws with <circle>: draw with <path> only',
    ]);
  });
});
