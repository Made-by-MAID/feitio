import { animateFrom, snapshot } from './kanban-flip.ts';
import { syncKanban } from './sync-kanban.ts';

/** What the feitio-kanban-create event says: the column, its element, and what was written. */
export interface KanbanCreateDetail {
  column: string;
  element: HTMLElement;
  text: string;
}

let drafts = 0;

/**
 * The new-card button of a column that allows it: a card with a field takes its place, with Save and
 * Cancel (Esc cancels too). Saving sends feitio-kanban-create; the page adds the card it wants (the
 * content is the page's), and it arrives on a spring.
 */
export function wireCreate(window: Window, board: HTMLElement): void {
  const doc = window.document;
  board.addEventListener('click', (event) => {
    const add = (event.target as Element).closest<HTMLElement>('.col > .add');
    if (!add || !board.contains(add)) return;
    const col = add.parentElement as HTMLElement;
    const id = `${board.id || 'kanban'}-new-${++drafts}`;
    const form = doc.createElement('form');
    form.className = 'feitio-kanban-card draft feitio-place';
    const label = doc.createElement('label');
    label.htmlFor = id;
    label.textContent = add.dataset.field ?? '';
    const field = doc.createElement('textarea');
    field.className = 'feitio-textarea';
    field.id = id;
    field.required = true;
    field.rows = 2;
    const actions = doc.createElement('div');
    actions.className = 'actions';
    const save = doc.createElement('button');
    save.type = 'submit';
    save.className = 'feitio-button';
    save.dataset.variant = 'primary';
    save.dataset.size = 'small';
    save.textContent = add.dataset.save ?? 'Save';
    const cancel = doc.createElement('button');
    cancel.type = 'button';
    cancel.className = 'feitio-button';
    cancel.dataset.size = 'small';
    cancel.textContent = add.dataset.cancel ?? 'Cancel';
    actions.append(save, cancel);
    form.append(label, field, actions);
    add.hidden = true;
    col.insertBefore(form, add);
    field.focus();
    const close = (): void => {
      form.remove();
      add.hidden = false;
      add.focus();
    };
    cancel.addEventListener('click', close);
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = field.value.trim();
      if (!text) return field.focus();
      const before = snapshot(board);
      const known = new Set(
        [...col.querySelectorAll<HTMLElement>(':scope > .feitio-kanban-card')].map(
          (c) => c.dataset.id,
        ),
      );
      const detail: KanbanCreateDetail = { column: col.dataset.col ?? '', element: col, text };
      board.dispatchEvent(new CustomEvent('feitio-kanban-create', { bubbles: true, detail }));
      close();
      window.requestAnimationFrame(() => {
        syncKanban(board);
        const fresh = [
          ...col.querySelectorAll<HTMLElement>(':scope > .feitio-kanban-card:not(.draft)'),
        ].find((c) => !known.has(c.dataset.id));
        animateFrom(window, board, before, { id: fresh?.dataset.id });
      });
    });
  });
}
