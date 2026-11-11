import type { NoticeHost } from '../data/notice.ts';
import { closeNotice } from './close-notice.ts';
import { startNoticeTimer } from './start-notice-timer.ts';

/**
 * Wires every notice under root: the close button closes it, and a timed notice already on the page
 * (after saving and coming back, say) only starts counting once it shows in the window.
 */
export function wireNotices(host: NoticeHost, root: ParentNode): void {
  const notices = [...root.querySelectorAll<HTMLElement>('.feitio-notice')];
  const Observer = (host.window as Window & { IntersectionObserver?: typeof IntersectionObserver })
    .IntersectionObserver;
  const seen = Observer
    ? new Observer(
        (entries: IntersectionObserverEntry[]) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            seen?.unobserve(entry.target);
            startNoticeTimer(host, entry.target as HTMLElement);
          }
        },
        { threshold: 0.9 },
      )
    : undefined;
  for (const notice of notices) {
    notice.querySelector('.close')?.addEventListener('click', () => closeNotice(host, notice));
    if (!notice.dataset.timeout || notice.hidden) continue;
    if (seen) seen.observe(notice);
    else startNoticeTimer(host, notice);
  }
}
