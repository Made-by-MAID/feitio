import { describe, expect, test } from 'bun:test';
import { renderSprite } from './render-sprite.ts';

const svg = (inner: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">${inner}</svg>\n`;

describe('renderSprite', () => {
  const sprite = renderSprite([
    { name: 'plus', svg: svg('<path d="M1 1"/>') },
    { name: 'check', svg: svg('<path d="M2 2"/>') },
  ]);

  test('turns each icon into a symbol named feitio-<name>, keeping its look and drawing', () => {
    expect(sprite).toContain(
      '<symbol id="feitio-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 1"/></symbol>',
    );
  });

  test('leaves aria-hidden to the page that uses the symbol', () => {
    const hidden = svg('<path d="M3 3"/>').replace(
      '<svg xmlns="http://www.w3.org/2000/svg"',
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"',
    );
    expect(renderSprite([{ name: 'x', svg: hidden }])).toContain(
      '<symbol id="feitio-x" viewBox="0 0 24 24"',
    );
  });

  test('refuses a file that is not a single svg element', () => {
    expect(() => renderSprite([{ name: 'broken', svg: '<g/>' }])).toThrow('icons/broken.svg');
  });

  test('sorts the symbols by name', () => {
    expect(sprite.indexOf('feitio-check')).toBeLessThan(sprite.indexOf('feitio-plus'));
  });

  test('is a hidden svg, ready to sit at the top of a page or be fetched', () => {
    expect(
      sprite.startsWith(
        '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none">',
      ),
    ).toBe(true);
    expect(sprite.endsWith('</svg>\n')).toBe(true);
  });
});
