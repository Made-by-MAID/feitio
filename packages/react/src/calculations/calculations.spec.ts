import { expect, test } from 'bun:test';
import { paginationEntries } from './pagination.ts';
import { reactAttributeName, svgParts } from './svg-parts.ts';
import { classNames, yearsText } from './text.ts';

test('a Pagination shows the first, the last and the pages around the current, with gaps', () => {
  expect(paginationEntries(5, 12)).toEqual([
    { kind: 'page', page: 1 },
    { kind: 'gap', after: 1 },
    { kind: 'page', page: 4 },
    { kind: 'page', page: 5 },
    { kind: 'page', page: 6 },
    { kind: 'gap', after: 6 },
    { kind: 'page', page: 12 },
  ]);
  expect(paginationEntries(1, 2)).toEqual([
    { kind: 'page', page: 1 },
    { kind: 'page', page: 2 },
  ]);
  expect(paginationEntries(1, 1)).toEqual([{ kind: 'page', page: 1 }]);
});

test('SVG attributes take the names React wants', () => {
  expect(reactAttributeName('stroke-width')).toBe('strokeWidth');
  expect(reactAttributeName('aria-hidden')).toBe('aria-hidden');
  expect(reactAttributeName('data-x')).toBe('data-x');
  expect(reactAttributeName('class')).toBe('className');
  expect(reactAttributeName('viewBox')).toBe('viewBox');
});

test('an SVG splits into its root attributes and its inner markup', () => {
  const parts = svgParts(
    '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" stroke-width="2">\n  <path d="M0 0"/>\n</svg>\n',
  );
  expect(parts).toEqual({
    attributes: { xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': 'true', strokeWidth: '2' },
    inner: '<path d="M0 0"/>',
  });
  expect(svgParts('not an svg')).toEqual({ attributes: {}, inner: '' });
  expect(svgParts('<svg><g/></svg>')).toEqual({ attributes: {}, inner: '<g/>' });
});

test('class names leave out the empty ones', () => {
  expect(classNames('feitio-button', undefined, false, 'extra', '')).toBe('feitio-button extra');
});

test('a Footer says one year, or a range', () => {
  expect(yearsText(2026, 2026)).toBe('2026');
  expect(yearsText(2024, 2026)).toBe('2024–2026');
});
