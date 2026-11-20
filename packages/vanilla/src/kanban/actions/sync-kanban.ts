/** Writes a text only when it changed, so a node another library owns (React) is left alone. */
function setText(el: Element | null, text: string): void {
  if (el && el.textContent !== text) el.textContent = text;
}

/** Brings the counts, the dots, the empty folders and their sentence in line with the cards there. */
export function syncKanban(board: HTMLElement): void {
  for (const col of board.querySelectorAll<HTMLElement>('.col')) {
    const n = col.querySelectorAll(':scope > .feitio-kanban-card:not(.draft)').length;
    const id = col.dataset.col ?? '';
    if (col.hasAttribute('data-empty') !== (n === 0)) col.toggleAttribute('data-empty', n === 0);
    setText(col.querySelector('.col-head .n'), String(n));
    const empty = col.querySelector<HTMLElement>(':scope > .empty');
    if (empty && empty.hidden !== n > 0) empty.hidden = n > 0;
    const tab = board.querySelector<HTMLElement>(`.tabs [data-col="${id}"]`);
    if (!tab) continue;
    if (tab.hasAttribute('data-has') !== n > 0) tab.toggleAttribute('data-has', n > 0);
    setText(tab.querySelector('.n'), String(n));
  }
}

/** Shows one stage on a phone: its column, and its tab pressed. */
export function chooseStage(board: HTMLElement, id: string): void {
  for (const col of board.querySelectorAll<HTMLElement>('.col')) {
    const on = col.dataset.col === id;
    if (col.hasAttribute('data-current') !== on) col.toggleAttribute('data-current', on);
  }
  for (const tab of board.querySelectorAll<HTMLElement>('.tabs [data-col]')) {
    tab.setAttribute('aria-pressed', String(tab.dataset.col === id));
  }
}
