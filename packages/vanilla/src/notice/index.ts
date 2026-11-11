import { closeNotice } from './actions/close-notice.ts';
import { showNotice } from './actions/show-notice.ts';
import { wireNotices } from './actions/wire-notices.ts';
import type { NoticeHost } from './data/notice.ts';

export { closesByItself, noticeProgress } from './calculations/notice-timer.ts';

/** The Notice for a page: wires every notice in it and hands back show and close. */
export function notices(
  window: Window,
  root: ParentNode = window.document,
): {
  show: (notice: HTMLElement) => void;
  close: (notice: HTMLElement) => void;
} {
  const host: NoticeHost = { window, clocks: new WeakMap() };
  wireNotices(host, root);
  return {
    show: (notice) => showNotice(host, notice),
    close: (notice) => closeNotice(host, notice),
  };
}
