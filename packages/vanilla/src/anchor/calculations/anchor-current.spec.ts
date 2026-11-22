import { expect, test } from 'bun:test';
import { currentSection, followLine, motionFor } from './anchor-current.ts';

test('the current section is the last one whose top passed the line', () => {
  expect(currentSection([-500, -20, 90, 400], 100, false)).toBe(2);
  expect(currentSection([-500, -20, 140, 400], 100, false)).toBe(1);
});

test('before any section passes the line, the first is current', () => {
  expect(currentSection([150, 600], 100, false)).toBe(0);
});

test('at the end of the scroll, the last section is current even if it never reached the line', () => {
  expect(currentSection([-900, -300, 500], 100, true)).toBe(2);
});

test('with no sections there is no current one', () => {
  expect(currentSection([], 100, true)).toBe(-1);
});

test('the line sits a quarter down the visible height, never further than 10rem', () => {
  expect(followLine(400, 16)).toBe(100);
  expect(followLine(2000, 16)).toBe(160);
});

test('the scroll is smooth unless motion is reduced or turned off around the anchor', () => {
  expect(motionFor(false, false)).toBe('smooth');
  expect(motionFor(true, false)).toBe('auto');
  expect(motionFor(false, true)).toBe('auto');
});
