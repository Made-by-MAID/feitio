import { wireAnchors } from './actions/wire-anchors.ts';

export { currentSection, followLine, motionFor } from './calculations/anchor-current.ts';

/**
 * Anchor for a page or a part of it: a click scrolls to the section (smoothly unless motion is
 * reduced), writes the hash and moves the focus there; the scroll marks the current section's link.
 * Safe to call again after new HTML.
 */
export function anchors(window: Window, root: ParentNode = window.document): void {
  wireAnchors(window, root);
}
