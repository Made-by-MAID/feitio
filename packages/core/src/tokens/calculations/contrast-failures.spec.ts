import { describe, expect, test } from 'bun:test';
import { contrastFailures } from './contrast-failures.ts';

const ink = { l: 0.26, c: 0.022, h: 55 };
const cream = { l: 0.96, c: 0.018, h: 80 };
const pale = { l: 0.8, c: 0.02, h: 80 };

describe('contrastFailures', () => {
  test('passes when every pair reaches its minimum', () => {
    const colors = new Map([
      ['text', ink],
      ['surface', cream],
    ]);
    const pairs = [{ foreground: 'text', background: 'surface', minimum: 4.5, why: 'text' }];
    expect(contrastFailures(colors, pairs)).toEqual([]);
  });

  test('reports a pair below its minimum, with the ratio it got', () => {
    const colors = new Map([
      ['text-soft', pale],
      ['surface', cream],
    ]);
    const pairs = [{ foreground: 'text-soft', background: 'surface', minimum: 4.5, why: 'soft' }];
    const [failure] = contrastFailures(colors, pairs);
    expect(failure?.requirement.foreground).toBe('text-soft');
    expect(failure?.ratio).toBeLessThan(4.5);
  });

  test('reports a role the theme does not fill as a failure with no ratio', () => {
    const requirement = { foreground: 'ok', background: 'ok-surface', minimum: 4.5, why: 'ok' };
    expect(contrastFailures(new Map(), [requirement])).toEqual([{ requirement, ratio: null }]);
  });
});
