import { chooseStage, syncKanban } from './sync-kanban.ts';
import { wireCreate } from './wire-create.ts';
import { wireDrag } from './wire-drag.ts';
import { wireMinimap } from './wire-minimap.ts';
import { wireMoveMenu } from './wire-move-menu.ts';
import { wireScrollRow } from './wire-scroll-row.ts';

/** Boards already wired: an Astro script and a React hook may both see one. */
const wired = new WeakSet<HTMLElement>();

/**
 * Wires every Kanban under root, each once: the stage tabs of a phone, the fading sides, the
 * miniature, the move button, holding and dragging, and the new-card button. Any change to the cards,
 * by this board or by the page, keeps counts and empty folders in line.
 */
export function wireKanbans(window: Window, root: ParentNode): void {
  const self = (root as Element).matches?.('.feitio-kanban') ? [root as HTMLElement] : [];
  const boards: HTMLElement[] = [...self, ...root.querySelectorAll<HTMLElement>('.feitio-kanban')];
  for (const board of boards) {
    if (wired.has(board)) continue;
    wired.add(board);
    board.querySelector('.tabs')?.addEventListener('click', (event) => {
      const tab = (event.target as Element).closest<HTMLElement>('[data-col]');
      if (tab?.dataset.col) chooseStage(board, tab.dataset.col);
    });
    for (const box of board.querySelectorAll<HTMLElement>(':scope > .feitio-kanban-scroll'))
      wireScrollRow(box);
    const rebuild = wireMinimap(window, board);
    wireMoveMenu(window, board);
    wireDrag(window, board);
    wireCreate(window, board);
    board.addEventListener('feitio-kanban-move', () => window.requestAnimationFrame(rebuild));
    board.addEventListener('feitio-kanban-create', () => window.requestAnimationFrame(rebuild));
    syncKanban(board);
  }
}
