import { edgesVisible } from '../calculations/kanban-motion.ts';

/** How far from the row's start the chosen tab lands: the width of the faded side, 3rem. */
const REVEAL_MARGIN = 48;

/**
 * A row that scrolls sideways (the tabs, the columns): its sides fade while there is more to see. The
 * tab row also scrolls with the mouse wheel and by dragging it with the mouse; touch scrolls by itself.
 */
export function wireScrollRow(box: HTMLElement): void {
  const row = box.querySelector<HTMLElement>(':scope > .tabs, :scope > .cols');
  const start = box.querySelector<HTMLElement>(':scope > .edge.start');
  const end = box.querySelector<HTMLElement>(':scope > .edge.end');
  if (!row) return;
  const sync = (): void => {
    const seen = edgesVisible(row.scrollLeft, row.clientWidth, row.scrollWidth);
    start?.toggleAttribute('data-visible', seen.start);
    end?.toggleAttribute('data-visible', seen.end);
  };
  row.addEventListener('scroll', sync, { passive: true });
  if (row.classList.contains('tabs')) {
    // The stage a phone opens on starts in view, clear of the faded side, not past the end of the row.
    const reveal = (): void => {
      const tab = row.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!tab) return;
      const offset =
        tab.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft;
      row.scrollLeft = Math.max(0, offset - REVEAL_MARGIN);
    };
    reveal();
    void row.ownerDocument.fonts?.ready.then(reveal);
  }
  if (typeof ResizeObserver === 'function') new ResizeObserver(sync).observe(row);
  sync();
  if (!row.classList.contains('tabs')) return;
  row.addEventListener(
    'wheel',
    (event) => {
      if (row.scrollWidth <= row.clientWidth || Math.abs(event.deltaX) > Math.abs(event.deltaY))
        return;
      event.preventDefault();
      row.scrollLeft += event.deltaY;
    },
    { passive: false },
  );
  let down: { x: number; scroll: number; moved: boolean; id: number } | undefined;
  row.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse')
      down = { x: event.clientX, scroll: row.scrollLeft, moved: false, id: event.pointerId };
  });
  row.addEventListener('pointermove', (event) => {
    if (!down) return;
    const d = event.clientX - down.x;
    if (!down.moved && Math.abs(d) > 4) {
      down.moved = true;
      row.setPointerCapture?.(down.id);
    }
    if (down.moved) row.scrollLeft = down.scroll - d;
  });
  row.addEventListener('pointerup', () => {
    // A drag is not a click on the tab it ended on.
    if (down?.moved)
      row.addEventListener(
        'click',
        (e) => {
          e.stopPropagation();
          e.preventDefault();
        },
        { capture: true, once: true },
      );
    down = undefined;
  });
}
