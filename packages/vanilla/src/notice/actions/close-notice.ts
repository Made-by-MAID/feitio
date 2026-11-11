import { LEAVE_FALLBACK_MS, type NoticeHost } from '../data/notice.ts';

/** Closes a notice: it fades and its space slides shut, then it is hidden. Stops its clock. */
export function closeNotice(host: NoticeHost, notice: HTMLElement): void {
  if (notice.hidden || notice.classList.contains('leaving')) return;
  host.clocks.get(notice)?.();
  host.clocks.delete(notice);
  notice.classList.add('leaving');
  function done(): void {
    notice.hidden = true;
    notice.classList.remove('leaving');
  }
  notice.addEventListener('animationend', done, { once: true });
  host.window.setTimeout(() => {
    if (!notice.hidden) done();
  }, LEAVE_FALLBACK_MS);
}
