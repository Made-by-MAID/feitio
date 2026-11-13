import type { NoticeHost } from '../data/notice.ts';
import { closeNotice } from './close-notice.ts';
import { startNoticeTimer } from './start-notice-timer.ts';

/** Notices already wired, by any controller: an Astro script and a React hook may both see one. */
const wired = new WeakSet<HTMLElement>();

/**
 * Wires every notice under root (root itself too, when it is one), each only once: the close button closes it, and a timed notice already on the page
 * (after saving and coming back, say) only starts counting once it shows in the window.
 */
export function wireNotices(host: NoticeHost, root: ParentNode): void {
  const own = 'matches' in root && (root as Element).matches('.feitio-notice');
  const notices = [
    ...(own ? [root as HTMLElement] : []),
    ...root.querySelectorAll<HTMLElement>('.feitio-notice'),
  ];
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
    if (wired.has(notice)) continue;
    wired.add(notice);
    notice.querySelector('.close')?.addEventListener('click', () => closeNotice(host, notice));
    if (!notice.dataset.timeout || notice.hidden) continue;
    if (seen) seen.observe(notice);
    else startNoticeTimer(host, notice);
  }
}
