import { minimapScale, minimapScroll } from '../calculations/kanban-rules.ts';

const WIDTH = 176;

/**
 * The board in miniature, at the bottom right, while the columns do not fit: a rectangle per column
 * (dashed when empty), a line per card, the part in view in orange. A touch or a drag on it takes the
 * board there. Rebuilt when the board changes size or its cards change.
 */
export function wireMinimap(window: Window, board: HTMLElement): () => void {
  const map = board.querySelector<HTMLElement>(':scope > .minimap');
  const cols = board.querySelector<HTMLElement>('.cols');
  if (!map || !cols) return () => {};
  let scale = 0;
  const pad = 4;
  const place = (): void => {
    const view = map.querySelector<HTMLElement>('.view');
    if (!view) return;
    view.style.insetInlineStart = `${pad + cols.scrollLeft * scale}px`;
    view.style.inlineSize = `${cols.clientWidth * scale}px`;
  };
  const build = (): void => {
    const wide = window.getComputedStyle(cols).display === 'flex';
    const over = wide && cols.scrollWidth > cols.clientWidth + 8;
    map.hidden = !over;
    if (!over) return;
    scale = minimapScale(WIDTH, cols.scrollWidth);
    map.replaceChildren();
    for (const col of cols.querySelectorAll<HTMLElement>('.col')) {
      const m = window.document.createElement('div');
      m.className = 'm-col';
      m.style.inlineSize = `${Math.max(6, col.offsetWidth * scale)}px`;
      if (col.hasAttribute('data-empty')) m.dataset.empty = '';
      for (const _ of col.querySelectorAll(':scope > .feitio-kanban-card:not(.draft)')) {
        const c = window.document.createElement('i');
        c.className = 'm-card';
        m.append(c);
      }
      map.append(m);
    }
    const view = window.document.createElement('span');
    view.className = 'view';
    map.append(view);
    place();
  };
  const go = (event: PointerEvent | MouseEvent): void => {
    const r = map.getBoundingClientRect();
    cols.scrollLeft = minimapScroll(event.clientX - r.left - pad, scale, cols.clientWidth);
  };
  let dragging = false;
  map.addEventListener('pointerdown', (event) => {
    dragging = true;
    map.setPointerCapture?.(event.pointerId);
    go(event);
  });
  map.addEventListener('pointermove', (event) => {
    if (dragging) go(event);
  });
  map.addEventListener('pointerup', () => {
    dragging = false;
  });
  cols.addEventListener('scroll', place, { passive: true });
  if (typeof ResizeObserver === 'function') new ResizeObserver(build).observe(cols);
  build();
  return build;
}
