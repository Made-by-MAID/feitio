import { canMove, targetsOf } from '../calculations/kanban-rules.ts';
import { animateFrom, type KanbanSnapshot, snapshot } from './kanban-flip.ts';
import { syncKanban } from './sync-kanban.ts';

/** What the feitio-kanban-move event says: which card, from where, to where, and at which place. */
export interface KanbanMoveDetail {
  card: HTMLElement;
  id: string;
  from: string;
  to: string;
  index: number;
}

/**
 * Asks to move a card: the board sends feitio-kanban-move (cancelable). Unless the page cancels it to
 * move the card itself (a React state, a server), the card goes to the column, at that place. On the
 * next frame everything animates from where it was, whoever moved it.
 */
export function moveCard(
  window: Window,
  board: HTMLElement,
  card: HTMLElement,
  to: string,
  index?: number,
  before?: KanbanSnapshot,
  from?: { x: number; y: number; tilt: number },
): boolean {
  const fromCol = card.closest<HTMLElement>('.col')?.dataset.col ?? '';
  const id = card.dataset.id ?? '';
  const target = board.querySelector<HTMLElement>(`.col[data-col="${to}"]`);
  if (!target || !canMove(targetsOf(card.dataset.to), fromCol, to)) return false;
  const cards = [
    ...target.querySelectorAll<HTMLElement>(':scope > .feitio-kanban-card:not(.draft)'),
  ];
  const place = index === undefined ? cards.length : Math.min(index, cards.length);
  const picture = before ?? snapshot(board, id);
  if (!picture.clones.size) {
    const own = snapshot(board, id).clones;
    for (const [k, v] of own) picture.clones.set(k, v);
  }
  const detail: KanbanMoveDetail = { card, id, from: fromCol, to, index: place };
  const event = new CustomEvent('feitio-kanban-move', {
    bubbles: true,
    cancelable: true,
    detail,
  });
  const done = (): void => {
    syncKanban(board);
    animateFrom(window, board, picture, { id, to, from });
  };
  if (board.dispatchEvent(event)) {
    const ref = cards[place] ?? target.querySelector(':scope > .add');
    target.insertBefore(card, ref);
    syncKanban(board);
    window.requestAnimationFrame(done);
  } else {
    // The page moves it (a React state renders on its own schedule): wait one frame more.
    window.requestAnimationFrame(() => window.requestAnimationFrame(done));
  }
  return true;
}
