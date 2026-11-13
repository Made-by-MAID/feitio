import { dialogs } from '@feitio/vanilla/dialog/source';
import { forms } from '@feitio/vanilla/forms/source';
import { menus } from '@feitio/vanilla/menu/source';
import { scrolls } from '@feitio/vanilla/scroll/source';
import { noticeApi } from './notices.ts';

/** The form controls of the page: Switch words, SegmentedControl choice, AM/PM, FilterField. */
export function wireForms(window: Window): void {
  forms(window);
}

/** The Dialogs of the page: openers, the typed confirmation, the reset on close. */
export function wireDialogs(window: Window): void {
  dialogs(window);
}

/** One Menu: its button, its list, the arrows. */
export function wireMenu(element: HTMLElement): void {
  menus(window, element);
}

/** One Notice: its close button and, when timed, its clock. */
export function wireNotice(element: HTMLElement): void {
  noticeApi(window).wire(element);
}

/** The ScrollFade or BackToTop next to this element (each one is wired once). */
export function wireScroll(element: HTMLElement): void {
  scrolls(window, element.parentElement ?? element);
}
