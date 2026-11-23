import { expect, test } from 'bun:test';
import { Window as HappyWindow } from 'happy-dom';
import { settle } from '../index.ts';

function page(state: 'loading' | 'complete', marked = true) {
  const window = new HappyWindow({ url: 'https://example.com/page' });
  if (marked) window.document.documentElement.setAttribute('data-feitio-arriving', '');
  Object.defineProperty(window.document, 'readyState', { value: state, configurable: true });
  const frames: FrameRequestCallback[] = [];
  Object.defineProperty(window, 'requestAnimationFrame', {
    value: (callback: FrameRequestCallback) => frames.push(callback),
  });
  const timeouts: (() => void)[] = [];
  Object.defineProperty(window, 'setTimeout', {
    value: (callback: () => void) => timeouts.push(callback),
  });
  function paint(): void {
    for (const frame of frames.splice(0)) frame(0);
  }
  return { window, paint, frames, timeouts, root: window.document.documentElement };
}

test('a loaded page keeps still for two frames, then lets its transitions run', () => {
  const { window, paint, root } = page('complete');
  settle(window as unknown as Window);
  expect(root.hasAttribute('data-feitio-arriving')).toBe(true);
  paint();
  expect(root.hasAttribute('data-feitio-arriving')).toBe(true);
  paint();
  expect(root.hasAttribute('data-feitio-arriving')).toBe(false);
});

test('a page still loading waits for its load first', () => {
  const { window, paint, root } = page('loading');
  settle(window as unknown as Window);
  paint();
  paint();
  expect(root.hasAttribute('data-feitio-arriving')).toBe(true);
  window.dispatchEvent(new window.Event('load'));
  paint();
  paint();
  expect(root.hasAttribute('data-feitio-arriving')).toBe(false);
});

test('a page whose load is slow settles a second after the call anyway, and only once', () => {
  const { window, paint, root, frames, timeouts } = page('loading');
  settle(window as unknown as Window);
  expect(timeouts.length).toBe(1);
  timeouts[0]?.();
  expect(frames.length).toBe(1);
  paint();
  paint();
  expect(root.hasAttribute('data-feitio-arriving')).toBe(false);
  window.dispatchEvent(new window.Event('load'));
  expect(frames.length).toBe(0);
});

test('a page that never marked itself is left alone', () => {
  const { window, paint, root } = page('complete', false);
  settle(window as unknown as Window);
  paint();
  paint();
  expect(root.hasAttribute('data-feitio-arriving')).toBe(false);
});
