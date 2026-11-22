import { expect, test } from 'bun:test';
import { Window as HappyWindow } from 'happy-dom';
import { anchors } from '../index.ts';

const markup = `<nav class="feitio-anchor" aria-label="On this page"><ul>
  <li><a href="#uso">Use</a></li><li><a href="#regras">Rules</a><ul><li><a href="#mais">More</a></li></ul></li>
</ul></nav><main><h2 id="uso">Use</h2><p>…</p><h2 id="regras">Rules</h2><h3 id="mais">More</h3><a id="link" href="#x">x</a></main>`;

function page(reduced = false): { window: HappyWindow; scrolled: ScrollIntoViewOptions[] } {
  const window = new HappyWindow({ url: 'https://example.com/page' });
  window.document.body.innerHTML = markup;
  const scrolled: ScrollIntoViewOptions[] = [];
  for (const id of ['uso', 'regras', 'mais'])
    Object.defineProperty(window.document.getElementById(id), 'scrollIntoView', {
      value: (options: ScrollIntoViewOptions) => scrolled.push(options),
    });
  Object.defineProperty(window, 'matchMedia', {
    value: (query: string) => ({ matches: reduced && query.includes('reduce') }),
  });
  anchors(window as unknown as Window);
  return { window, scrolled };
}

function link(window: HappyWindow, hash: string): HTMLAnchorElement {
  return window.document.querySelector(`a[href="${hash}"]`) as unknown as HTMLAnchorElement;
}

test('a click scrolls smoothly to the section, writes the hash and focuses the section', () => {
  const { window, scrolled } = page();
  link(window, '#regras').click();
  expect(scrolled).toEqual([{ behavior: 'smooth', block: 'start' }]);
  expect(window.location.hash).toBe('#regras');
  const section = window.document.getElementById('regras');
  expect(section?.getAttribute('tabindex')).toBe('-1');
  expect(window.document.activeElement === section).toBe(true);
});

test('the clicked link is the current one while the scroll travels', () => {
  const { window } = page();
  link(window, '#mais').click();
  expect(link(window, '#mais').getAttribute('aria-current')).toBe('location');
  expect(link(window, '#uso').hasAttribute('aria-current')).toBe(false);
});

test('with reduced motion the scroll is instant', () => {
  const { window, scrolled } = page(true);
  link(window, '#uso').click();
  expect(scrolled).toEqual([{ behavior: 'auto', block: 'start' }]);
});

test('inside data-motion="direct" the scroll is instant', () => {
  const window = new HappyWindow({ url: 'https://example.com/page' });
  window.document.body.innerHTML = `<div data-motion="direct">${markup}</div>`;
  const scrolled: ScrollIntoViewOptions[] = [];
  Object.defineProperty(window.document.getElementById('uso'), 'scrollIntoView', {
    value: (options: ScrollIntoViewOptions) => scrolled.push(options),
  });
  Object.defineProperty(window, 'matchMedia', { value: () => ({ matches: false }) });
  anchors(window as unknown as Window);
  link(window, '#uso').click();
  expect(scrolled).toEqual([{ behavior: 'auto', block: 'start' }]);
});

test('a section that can take focus keeps its own tabindex', () => {
  const { window } = page();
  const section = window.document.getElementById('uso') as unknown as HTMLElement;
  section.setAttribute('tabindex', '0');
  link(window, '#uso').click();
  expect(section.getAttribute('tabindex')).toBe('0');
});

test('on load, one link is current; wiring again changes nothing', () => {
  const { window } = page();
  expect(window.document.querySelectorAll('[aria-current="location"]').length).toBe(1);
  anchors(window as unknown as Window);
  link(window, '#regras').click();
  expect(window.document.querySelectorAll('[aria-current="location"]').length).toBe(1);
});

test('an Anchor whose links lead nowhere is left alone', () => {
  const window = new HappyWindow();
  window.document.body.innerHTML = '<nav class="feitio-anchor"><a href="#none">x</a></nav>';
  anchors(window as unknown as Window);
  expect(window.document.querySelector('[aria-current]')).toBeNull();
});
