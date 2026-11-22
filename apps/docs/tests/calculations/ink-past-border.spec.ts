import { expect, test } from 'bun:test';
import { type Corners, inkPastBorder } from './ink-past-border.ts';

const square: Corners = {
  topLeft: [0, 0],
  topRight: [0, 0],
  bottomRight: [0, 0],
  bottomLeft: [0, 0],
};
const inner = { left: 0, top: 0, right: 100, bottom: 20 };

test('ink inside the border goes past by nothing', () => {
  expect(inkPastBorder({ left: 4, top: 2, right: 96, bottom: 18 }, inner, square)).toBe(0);
});

test('ink past a side goes past by the distance to that side', () => {
  expect(inkPastBorder({ left: 4, top: 2, right: 101.5, bottom: 18 }, inner, square)).toBe(1.5);
  expect(inkPastBorder({ left: -2, top: 2, right: 96, bottom: 18 }, inner, square)).toBe(2);
  expect(inkPastBorder({ left: 4, top: -3, right: 96, bottom: 18 }, inner, square)).toBe(3);
  expect(inkPastBorder({ left: 4, top: 2, right: 96, bottom: 24 }, inner, square)).toBe(4);
});

test('ink in a rounded corner goes past by how far it is outside the curve', () => {
  const round: Corners = { ...square, topRight: [10, 10] };
  // The corner of the ink sits where the square corner was: outside a 10px curve.
  const past = inkPastBorder({ left: 4, top: 0, right: 100, bottom: 18 }, inner, round);
  expect(past).toBeCloseTo(10 * Math.SQRT2 - 10, 5);
  // Well inside the curve, and inside the corner's box but under the curve: nothing.
  expect(inkPastBorder({ left: 4, top: 4, right: 96, bottom: 18 }, inner, round)).toBe(0);
});

test('each corner reads its own radii', () => {
  const ink = { left: 0, top: 0, right: 100, bottom: 20 };
  expect(inkPastBorder(ink, inner, { ...square, topLeft: [4, 4] })).toBeGreaterThan(0);
  expect(inkPastBorder(ink, inner, { ...square, bottomRight: [4, 4] })).toBeGreaterThan(0);
  expect(inkPastBorder(ink, inner, { ...square, bottomLeft: [4, 4] })).toBeGreaterThan(0);
  expect(inkPastBorder(ink, inner, square)).toBe(0);
});

test('an elliptic corner scales the distance by its smaller radius', () => {
  const ellipse: Corners = { ...square, topRight: [8, 4] };
  const past = inkPastBorder({ left: 4, top: 0, right: 100, bottom: 18 }, inner, ellipse);
  expect(past).toBeCloseTo((Math.SQRT2 - 1) * 4, 5);
});
