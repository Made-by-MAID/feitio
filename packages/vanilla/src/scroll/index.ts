import { wireScrolls } from './actions/wire-scrolls.ts';

export { backToTopVisible, fadeVisible } from './calculations/scroll-visibility.ts';

/** ScrollFade and BackToTop for a page or a part of it; safe to call again after new HTML. */
export function scrolls(window: Window, root: ParentNode = window.document): void {
  wireScrolls(window, root);
}
