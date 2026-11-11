import type { NoticeHost } from '../data/notice.ts';
import { startNoticeTimer } from './start-notice-timer.ts';

/**
 * Shows a notice after an action. Hidden, it arrives as placed paper; already on screen, it does not
 * land again: only its time starts over (one paper at a time).
 */
export function showNotice(host: NoticeHost, notice: HTMLElement): void {
  if (notice.hidden) {
    notice.hidden = false;
    notice.classList.remove('feitio-place');
    void notice.offsetWidth;
    notice.classList.add('feitio-place');
  }
  notice.style.setProperty('--notice-p', '0');
  startNoticeTimer(host, notice);
}
