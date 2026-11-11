import {
  closesByItself,
  countFrame,
  noticeProgress,
  noticeStatus,
} from '../calculations/notice-timer.ts';
import type { NoticeHost } from '../data/notice.ts';
import { closeNotice } from './close-notice.ts';

/**
 * Starts a timed notice's clock: it counts in JavaScript, frame by frame, not in a CSS animation, so
 * it still runs with reduced motion. The time stops while the pointer or focus is on the notice, and
 * --notice-p carries how far it has run, for the thread around the close button.
 */
export function startNoticeTimer(host: NoticeHost, notice: HTMLElement): void {
  host.clocks.get(notice)?.();
  const total = Number(notice.dataset.timeout);
  if (!closesByItself(noticeStatus(notice.dataset.status), total)) return;
  const { window } = host;
  let used = 0;
  let last = window.performance.now();
  let paused = notice.matches(':hover, :focus-within');
  let frame = 0;
  function pause(): void {
    paused = true;
  }
  function resume(): void {
    window.setTimeout(() => {
      if (notice.matches(':hover, :focus-within')) return;
      paused = false;
      last = window.performance.now();
    });
  }
  const listeners: [string, () => void][] = [
    ['mouseenter', pause],
    ['focusin', pause],
    ['mouseleave', resume],
    ['focusout', resume],
  ];
  for (const [event, listener] of listeners) notice.addEventListener(event, listener);
  function tick(now: number): void {
    used = countFrame(used, now - last, paused);
    last = now;
    const progress = noticeProgress(used, total);
    notice.style.setProperty('--notice-p', progress.toFixed(4));
    if (progress >= 1) closeNotice(host, notice);
    else frame = window.requestAnimationFrame(tick);
  }
  host.clocks.set(notice, () => {
    window.cancelAnimationFrame(frame);
    for (const [event, listener] of listeners) notice.removeEventListener(event, listener);
  });
  frame = window.requestAnimationFrame(tick);
}
