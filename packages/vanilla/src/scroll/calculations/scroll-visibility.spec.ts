import { expect, test } from 'bun:test';
import { backToTopVisible, fadeVisible } from './scroll-visibility.ts';

test('the fade shows while there is more below, and goes at the end', () => {
  expect(fadeVisible(0, 200, 1000)).toBe(true);
  expect(fadeVisible(795, 200, 1000)).toBe(false);
  expect(fadeVisible(0, 200, 200)).toBe(false);
});

test('back to top shows after half a screen', () => {
  expect(backToTopVisible(99, 200)).toBe(false);
  expect(backToTopVisible(101, 200)).toBe(true);
});
