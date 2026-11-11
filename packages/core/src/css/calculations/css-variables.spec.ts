import { describe, expect, test } from 'bun:test';
import { definedVariables, usedVariables } from './css-variables.ts';

const css = `
  :root { --feitio-space-1: 0.25rem; --feitio-radius: var(--feitio-r-a) var(--feitio-r-b); }
  body { margin: var(--feitio-space-1); color: var(--other); }
`;

describe('definedVariables', () => {
  test('lists every --feitio- property a stylesheet declares', () => {
    expect([...definedVariables(css)].sort()).toEqual(['--feitio-radius', '--feitio-space-1']);
  });
});

describe('usedVariables', () => {
  test('lists every --feitio- property a stylesheet reads, once each', () => {
    expect([...usedVariables(css)].sort()).toEqual([
      '--feitio-r-a',
      '--feitio-r-b',
      '--feitio-space-1',
    ]);
  });
});
