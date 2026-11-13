import { wireDialogs } from './actions/wire-dialogs.ts';

export { typedTheWord } from './calculations/confirm-word.ts';

/** The Dialogs of a page: openers, the typed confirmation, the reset on close. */
export function dialogs(window: Window, root: Document | HTMLElement = window.document): void {
  wireDialogs(window, root);
}
