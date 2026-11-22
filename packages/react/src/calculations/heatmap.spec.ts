import { expect, test } from 'bun:test';
import { labelSpans, squareOf } from './heatmap.ts';

test('a label spans its column and the unlabelled ones after it', () => {
  expect(labelSpans(['Sep', undefined, undefined, 'Oct', ''])).toEqual([
    { label: 'Sep', span: 3 },
    { label: 'Oct', span: 2 },
  ]);
});

test('the unlabelled columns before the first label make one empty span', () => {
  expect(labelSpans([undefined, '', 'Nov', undefined])).toEqual([
    { label: '', span: 2 },
    { label: 'Nov', span: 2 },
  ]);
  expect(labelSpans(['', ''])).toEqual([{ label: '', span: 2 }]);
  expect(labelSpans([])).toEqual([]);
});

test('every label alone spans one column', () => {
  expect(labelSpans(['00h', '01h'])).toEqual([
    { label: '00h', span: 1 },
    { label: '01h', span: 1 },
  ]);
});

const levels = [
  { id: 'up', label: 'All answered', tone: 'ok' as const },
  { id: 'down', label: 'Down', tone: 'error' as const },
];

test('a square takes its level’s tone and says its title and its level’s words', () => {
  expect(squareOf({ level: 'down', title: '2026-11-22' }, levels)).toEqual({
    tone: 'error',
    text: '2026-11-22, Down',
  });
});

test('a square with an unknown level is empty and says only its title', () => {
  expect(squareOf({ level: 'gone', title: '2026-11-21' }, levels)).toEqual({
    tone: 'empty',
    text: '2026-11-21',
  });
});

test('a missing square is empty and says nothing', () => {
  expect(squareOf(undefined, levels)).toEqual({ tone: 'empty', text: '' });
});
