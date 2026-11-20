/** The columns a card may go to, as its data-to lists them (separated by spaces). */
export function targetsOf(attribute: string | null | undefined): string[] {
  return (attribute ?? '').split(/\s+/).filter(Boolean);
}

/** Whether a card may move from one column to another: never to where it is, only where it lists. */
export function canMove(targets: string[], from: string, to: string): boolean {
  return to !== from && targets.includes(to);
}

/** The scale of the miniature: its width over the board's whole scroll width. */
export function minimapScale(mapWidth: number, scrollWidth: number): number {
  return scrollWidth > 0 ? mapWidth / scrollWidth : 0;
}

/** Where the board scrolls to when the miniature is touched at x: that point in the middle of the view. */
export function minimapScroll(x: number, scale: number, clientWidth: number): number {
  return scale > 0 ? Math.max(0, x / scale - clientWidth / 2) : 0;
}
