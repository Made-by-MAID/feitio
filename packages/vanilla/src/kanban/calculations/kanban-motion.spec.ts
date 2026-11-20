import { expect, test } from 'bun:test';
import {
  autoScrollSpeed,
  curveDuration,
  edgesVisible,
  FLY,
  flightTilt,
  followStep,
  HOP,
  insertionIndex,
  SETTLE,
  springCurve,
} from './kanban-motion.ts';

test('a spring starts at 0, rests at exactly 1, and the loose one passes the mark first', () => {
  const fly = springCurve(FLY);
  expect(fly[0]).toBe(0);
  expect(fly.at(-1)).toBe(1);
  expect(Math.max(...fly)).toBeGreaterThan(1.02);
  const settle = springCurve(SETTLE);
  expect(Math.max(...settle)).toBeLessThan(Math.max(...fly));
  expect(springCurve(HOP).at(-1)).toBe(1);
});

test('a spring that never rests stops at the frame limit', () => {
  const curve = springCurve({ stiffness: 100, damping: 0 }, 10);
  expect(curve).toHaveLength(11);
  expect(curve.at(-1)).toBe(1);
  expect(curveDuration(curve)).toBeCloseTo(183.33, 1);
});

test('the card in the hand lags behind the pointer and leans toward where it goes', () => {
  let s = { x: 0, y: 0, vx: 0, vy: 0, tilt: 0 };
  s = followStep(s, 100, 0);
  expect(s.x).toBeGreaterThan(0);
  expect(s.x).toBeLessThan(100);
  expect(s.tilt).toBeGreaterThan(0);
  for (let i = 0; i < 200; i++) s = followStep(s, 100, 50);
  expect(s.x).toBeCloseTo(100, 1);
  expect(s.y).toBeCloseTo(50, 1);
  expect(Math.abs(s.tilt)).toBeLessThan(0.5);
  const fast = followStep({ x: 0, y: 0, vx: 0, vy: 0, tilt: 0 }, -5000, 0);
  expect(fast.tilt).toBeCloseTo(-14 * 0.18, 5);
});

test('the flight leans with the distance, up to 9 degrees', () => {
  expect(flightTilt(70)).toBe(2);
  expect(flightTilt(1000)).toBe(9);
  expect(flightTilt(-1000)).toBe(-9);
});

test('a side fades only while there is more to scroll on it', () => {
  expect(edgesVisible(0, 500, 1200)).toEqual({ start: false, end: true });
  expect(edgesVisible(300, 500, 1200)).toEqual({ start: true, end: true });
  expect(edgesVisible(700, 500, 1200)).toEqual({ start: true, end: false });
  expect(edgesVisible(0, 500, 500)).toEqual({ start: false, end: false });
});

test('the board scrolls by itself near its sides, faster at the very edge', () => {
  expect(autoScrollSpeed(500, 0, 1000)).toBe(0);
  expect(autoScrollSpeed(0, 0, 1000)).toBe(-16);
  expect(autoScrollSpeed(45, 0, 1000)).toBe(-8);
  expect(autoScrollSpeed(1000, 0, 1000)).toBe(16);
  expect(autoScrollSpeed(955, 0, 1000)).toBe(8);
});

test('a dropped card goes before the first card whose middle is below it', () => {
  expect(insertionIndex([100, 200, 300], 50)).toBe(0);
  expect(insertionIndex([100, 200, 300], 150)).toBe(1);
  expect(insertionIndex([100, 200, 300], 350)).toBe(3);
  expect(insertionIndex([], 10)).toBe(0);
});
