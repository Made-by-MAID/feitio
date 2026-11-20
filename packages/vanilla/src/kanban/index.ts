import { moveCard } from './actions/move-card.ts';
import { syncKanban } from './actions/sync-kanban.ts';
import { wireKanbans } from './actions/wire-kanbans.ts';

export type { KanbanMoveDetail } from './actions/move-card.ts';
export type { KanbanCreateDetail } from './actions/wire-create.ts';
export { canMove, targetsOf } from './calculations/kanban-rules.ts';

/**
 * The Kanban boards of a page, or of a part of it: wires them, and hands back move (the same move a
 * drag or the move button makes, for the page to call) and sync (after the page changed the cards).
 */
export function kanbans(
  window: Window,
  root: ParentNode = window.document,
): {
  move: (card: HTMLElement, to: string, index?: number) => boolean;
  sync: (board: HTMLElement) => void;
} {
  wireKanbans(window, root);
  return {
    move: (card, to, index) => {
      const board = card.closest<HTMLElement>('.feitio-kanban');
      return board ? moveCard(window, board, card, to, index) : false;
    },
    sync: syncKanban,
  };
}
