import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import { setStatus } from './set-status.ts';

test('the state and its words go on the container, and null clears them', () => {
  const window = new Window();
  window.document.body.innerHTML =
    '<form class="feitio-status-host"><div class="feitio-status" role="status"><span class="label"></span></div></form>';
  const host = window.document.querySelector('form') as unknown as HTMLElement;
  setStatus(host, 'loading', 'Saving');
  expect(host.dataset.state).toBe('loading');
  expect(host.querySelector('.label')?.textContent).toBe('Saving');
  setStatus(host, null);
  expect(host.dataset.state).toBeUndefined();
  expect(host.querySelector('.label')?.textContent).toBe('');
});
