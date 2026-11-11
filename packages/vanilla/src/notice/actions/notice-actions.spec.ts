import { expect, test } from 'bun:test';
import { Window as HappyWindow } from 'happy-dom';
import type { NoticeHost } from '../data/notice.ts';
import { closeNotice } from './close-notice.ts';
import { showNotice } from './show-notice.ts';
import { wireNotices } from './wire-notices.ts';

function page(markup: string): { host: NoticeHost; notice: HTMLElement; window: HappyWindow } {
  const window = new HappyWindow();
  window.document.body.innerHTML = markup;
  const host: NoticeHost = { window: window as unknown as Window, clocks: new WeakMap() };
  const notice = window.document.querySelector('.feitio-notice') as unknown as HTMLElement;
  return { host, notice, window };
}

const timed = (status: string, ms: number) =>
  `<div class="feitio-notice" data-status="${status}" data-timeout="${ms}" hidden><strong>Saved</strong><span class="tools"><button type="button" class="close">x</button></span></div>`;

test('a timed success notice closes by itself after its time', async () => {
  const { host, notice } = page(timed('ok', 120));
  showNotice(host, notice);
  expect(notice.hidden).toBe(false);
  expect(notice.classList.contains('feitio-place')).toBe(true);
  await Bun.sleep(900);
  expect(notice.hidden).toBe(true);
});

test('a warning never closes by itself', async () => {
  const { host, notice } = page(timed('warn', 50));
  showNotice(host, notice);
  await Bun.sleep(800);
  expect(notice.hidden).toBe(false);
});

test('showing a notice already on screen does not place it again', () => {
  const { host, notice } = page(timed('ok', 5000));
  showNotice(host, notice);
  notice.classList.remove('feitio-place');
  showNotice(host, notice);
  expect(notice.classList.contains('feitio-place')).toBe(false);
  closeNotice(host, notice);
});

test('the close button closes it', async () => {
  const { host, notice } = page(timed('ok', 0).replace(' hidden', ''));
  wireNotices(host, host.window.document);
  (notice.querySelector('.close') as HTMLElement).click();
  await Bun.sleep(700);
  expect(notice.hidden).toBe(true);
});
