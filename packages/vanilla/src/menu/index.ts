import { wireMenus } from './actions/wire-menus.ts';

export { menuPosition, nextMenuIndex } from './calculations/menu-focus.ts';

/** The Menu for a page: every button with a list of links or actions under it. */
export function menus(window: Window, root: ParentNode = window.document): void {
  wireMenus(window, root);
}
