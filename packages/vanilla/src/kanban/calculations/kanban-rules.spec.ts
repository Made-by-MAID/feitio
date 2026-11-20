import { expect, test } from 'bun:test';
import { canMove, minimapScale, minimapScroll, targetsOf } from './kanban-rules.ts';

test('a card lists where it may go; none means it stays put', () => {
  expect(targetsOf('agendado  publicado recusado')).toEqual(['agendado', 'publicado', 'recusado']);
  expect(targetsOf('')).toEqual([]);
  expect(targetsOf(null)).toEqual([]);
  expect(targetsOf(undefined)).toEqual([]);
});

test('a card moves only to a column it lists, never to where it is', () => {
  expect(canMove(['b', 'c'], 'a', 'b')).toBe(true);
  expect(canMove(['b', 'c'], 'a', 'd')).toBe(false);
  expect(canMove(['a', 'b'], 'a', 'a')).toBe(false);
});

test('the miniature is the board at scale, and touching it centers that point', () => {
  expect(minimapScale(176, 1760)).toBe(0.1);
  expect(minimapScale(176, 0)).toBe(0);
  expect(minimapScroll(100, 0.1, 600)).toBe(700);
  expect(minimapScroll(10, 0.1, 600)).toBe(0);
  expect(minimapScroll(10, 0, 600)).toBe(0);
});
