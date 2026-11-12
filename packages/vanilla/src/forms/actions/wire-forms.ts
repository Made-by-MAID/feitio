import { matchesFilter, togglePeriod } from '../calculations/form-values.ts';

/**
 * Wires the form controls of a page by delegation, so controls added later (a playground re-rendering)
 * work too: the Switch says its state in words, the SegmentedControl marks the chosen option, the
 * TimeInput's AM/PM swaps, and a FilterField filters its list and counts what is left.
 */
export function wireForms(window: Window, root: Document | HTMLElement): void {
  root.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    const label = input.closest<HTMLElement>('.feitio-switch');
    if (!label || input.type !== 'checkbox') return;
    const state = label.querySelector('.state');
    if (state)
      state.textContent = input.checked
        ? (label.dataset.on ?? 'Ligado')
        : (label.dataset.off ?? 'Desligado');
  });
  root.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const option = target.closest<HTMLButtonElement>('.feitio-segmented button[aria-pressed]');
    if (option && !option.closest('[data-playground] .controls')) {
      for (const sibling of option.parentElement?.querySelectorAll('button[aria-pressed]') ?? [])
        sibling.setAttribute('aria-pressed', String(sibling === option));
    }
    const period = target.closest<HTMLButtonElement>('.feitio-time-field .period');
    if (period && !period.disabled) period.textContent = togglePeriod(period.textContent ?? 'AM');
  });
  root.addEventListener('input', (event) => {
    const field = event.target as HTMLInputElement;
    const listId = field.dataset?.filter;
    if (!listId) return;
    const document = window.document;
    const list = document.getElementById(listId);
    if (!list) return;
    const items = [...list.querySelectorAll<HTMLElement>('[data-search]')];
    let shown = 0;
    for (const item of items) {
      const match = matchesFilter(item.dataset.search ?? item.textContent ?? '', field.value);
      item.hidden = !match;
      if (match) shown += 1;
    }
    const count = document.querySelector(`[data-count="${listId}"]`);
    if (count) count.textContent = field.value.trim() ? `${shown} / ${items.length}` : '';
    const empty = document.querySelector<HTMLElement>(`[data-empty="${listId}"]`);
    if (empty) empty.hidden = shown > 0;
  });
}
