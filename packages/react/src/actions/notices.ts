import { notices } from '@feitio/vanilla/notice/source';
import { useCallback } from 'react';

/** What the page's Notice controller does. */
export interface NoticeApi {
  show: (notice: HTMLElement) => void;
  close: (notice: HTMLElement) => void;
  wire: (root: ParentNode) => void;
}
type Page = Window & { feitioNotice?: NoticeApi };

/**
 * The page's Notice controller, the same one the Astro Notice creates (window.feitioNotice); made
 * here first, it wires the notices already on the page, as the Astro script would.
 */
export function noticeApi(window: Window): NoticeApi {
  const page = window as Page;
  page.feitioNotice ??= notices(window);
  return page.feitioNotice;
}

/** Show and close a Notice from code: show(element) brings a hidden notice in, close(element) takes it out. */
export function useNotices(): {
  show: (notice: HTMLElement) => void;
  close: (notice: HTMLElement) => void;
} {
  const show = useCallback((notice: HTMLElement) => noticeApi(window).show(notice), []);
  const close = useCallback((notice: HTMLElement) => noticeApi(window).close(notice), []);
  return { show, close };
}
