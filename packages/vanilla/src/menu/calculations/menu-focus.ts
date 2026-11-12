/** Which item gets the focus after a key, in a menu of `count` items where `current` has it (-1: none). */
export function nextMenuIndex(key: string, current: number, count: number): number | undefined {
  if (count === 0) return undefined;
  switch (key) {
    case 'ArrowDown':
      return current < 0 ? 0 : (current + 1) % count;
    case 'ArrowUp':
      return current <= 0 ? count - 1 : current - 1;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return undefined;
  }
}

/**
 * Where the open menu goes, in the viewport: under its button, aligned to the button's end when it
 * would pass the window's edge, and above it when there is no room below.
 */
export function menuPosition(
  button: { left: number; right: number; top: number; bottom: number },
  menu: { width: number; height: number },
  viewport: { width: number; height: number },
  gap: number,
): { left: number; top: number } {
  const fitsRight = button.left + menu.width <= viewport.width - gap;
  const left = Math.max(gap, fitsRight ? button.left : button.right - menu.width);
  const fitsBelow = button.bottom + gap + menu.height <= viewport.height - gap;
  const top = fitsBelow ? button.bottom + gap : Math.max(gap, button.top - gap - menu.height);
  return { left, top };
}
