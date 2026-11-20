import { menuPosition, nextMenuIndex } from '../../menu/calculations/menu-focus.ts';
import { targetsOf } from '../calculations/kanban-rules.ts';
import { moveCard } from './move-card.ts';

/**
 * The card's move button: a Menu list with only the columns the card may go to. The way to move on a
 * phone and with the keyboard. After the move, the focus stays on the card's button.
 */
export function wireMoveMenu(window: Window, board: HTMLElement): void {
  const doc = window.document;
  let list: HTMLElement | undefined;
  let opener: HTMLElement | undefined;
  // The list is made on the first use, at the end of the page: nothing is added to the board itself.
  const make = (): HTMLElement => {
    const ul = doc.createElement('ul');
    ul.className = 'feitio-menu-list feitio-kanban-menu';
    ul.id = `${board.id || 'kanban'}-move`;
    ul.setAttribute('popover', 'auto');
    doc.body.append(ul);
    ul.addEventListener('toggle', (event) => {
      if ((event as ToggleEvent).newState === 'closed')
        opener?.setAttribute('aria-expanded', 'false');
    });
    ul.addEventListener('keydown', (event) => {
      const all = items();
      const next = nextMenuIndex(
        event.key,
        all.indexOf(doc.activeElement as HTMLElement),
        all.length,
      );
      if (next === undefined) return;
      event.preventDefault();
      all[next]?.focus();
    });
    return ul;
  };
  const items = (): HTMLElement[] => [...(list?.querySelectorAll<HTMLElement>('button') ?? [])];
  board.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLElement>('.feitio-kanban-card > .move');
    if (!button || !board.contains(button)) return;
    const card = button.parentElement as HTMLElement;
    opener = button;
    list ??= make();
    const menu = list;
    menu.replaceChildren();
    const head = doc.createElement('li');
    head.className = 'head';
    head.setAttribute('role', 'presentation');
    head.textContent = board.dataset.moveLabel ?? 'Move to';
    menu.append(head);
    for (const to of targetsOf(card.dataset.to)) {
      const title = board.querySelector(`.col[data-col="${to}"] .col-head h3`)?.textContent?.trim();
      if (!title) continue;
      const li = doc.createElement('li');
      const choice = doc.createElement('button');
      choice.type = 'button';
      choice.textContent = title;
      choice.addEventListener('click', () => {
        menu.hidePopover?.();
        if (moveCard(window, board, card, to))
          window.requestAnimationFrame(() =>
            card.querySelector<HTMLElement>(':scope > .move')?.focus({ preventScroll: true }),
          );
      });
      li.append(choice);
      menu.append(li);
    }
    menu.showPopover?.();
    button.setAttribute('aria-expanded', 'true');
    const place = menuPosition(
      button.getBoundingClientRect(),
      menu.getBoundingClientRect(),
      { width: window.innerWidth, height: window.innerHeight },
      8,
    );
    menu.style.left = `${place.left}px`;
    menu.style.top = `${place.top}px`;
    items()[0]?.focus();
  });
}
