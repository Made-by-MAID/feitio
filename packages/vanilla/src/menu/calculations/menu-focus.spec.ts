import { expect, test } from 'bun:test';
import { menuPosition, nextMenuIndex } from './menu-focus.ts';

test('arrows move through the items and wrap around; Home and End jump', () => {
  expect(nextMenuIndex('ArrowDown', -1, 5)).toBe(0);
  expect(nextMenuIndex('ArrowDown', 4, 5)).toBe(0);
  expect(nextMenuIndex('ArrowUp', 0, 5)).toBe(4);
  expect(nextMenuIndex('ArrowUp', -1, 5)).toBe(4);
  expect(nextMenuIndex('ArrowUp', 3, 5)).toBe(2);
  expect(nextMenuIndex('Home', 3, 5)).toBe(0);
  expect(nextMenuIndex('End', 1, 5)).toBe(4);
  expect(nextMenuIndex('a', 1, 5)).toBeUndefined();
  expect(nextMenuIndex('ArrowDown', -1, 0)).toBeUndefined();
});

test('the menu opens under its button, and moves where it has room', () => {
  const viewport = { width: 1000, height: 800 };
  const menu = { width: 200, height: 240 };
  expect(menuPosition({ left: 100, right: 160, top: 10, bottom: 50 }, menu, viewport, 8)).toEqual({
    left: 100,
    top: 58,
  });
  expect(menuPosition({ left: 900, right: 960, top: 10, bottom: 50 }, menu, viewport, 8)).toEqual({
    left: 760,
    top: 58,
  });
  expect(menuPosition({ left: 100, right: 160, top: 700, bottom: 740 }, menu, viewport, 8)).toEqual(
    { left: 100, top: 452 },
  );
  expect(
    menuPosition(
      { left: 2, right: 40, top: 10, bottom: 50 },
      { width: 900, height: 900 },
      { width: 600, height: 500 },
      8,
    ),
  ).toEqual({ left: 8, top: 8 });
});
