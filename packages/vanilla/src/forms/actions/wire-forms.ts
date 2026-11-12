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
  const timers = new WeakMap<HTMLElement, number>();
  function filterNow(field: HTMLInputElement, list: HTMLElement): void {
    const document = window.document;
    const listId = list.id;
    const items = [...list.querySelectorAll<HTMLElement>('[data-search]')];
    list.dataset.filtering = '';
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
  }
  /**
   * Runs the search: on the list here, or, with data-async, by telling the page (a feitio-filter event
   * with the query and a done() to call when its results are in) while the field shows it is busy.
   */
  function run(field: HTMLInputElement, box: HTMLElement | null): void {
    const list = window.document.getElementById(field.dataset.filter ?? '');
    if (field.dataset.async === undefined) {
      if (box) delete box.dataset.state;
      if (list) filterNow(field, list);
      return;
    }
    if (box) box.dataset.state = 'busy';
    const busy = window.document.querySelector(`[data-count="${field.dataset.filter}"]`);
    if (busy && field.dataset.busyLabel) busy.textContent = field.dataset.busyLabel;
    const query = field.value;
    const done = (): void => {
      if (field.value !== query) return;
      if (box) delete box.dataset.state;
      if (list) filterNow(field, list);
    };
    field.dispatchEvent(
      new CustomEvent('feitio-filter', { bubbles: true, detail: { query, done } }),
    );
  }
  root.addEventListener('input', (event) => {
    const field = event.target as HTMLInputElement;
    if (!field.dataset?.filter) return;
    const box = field.closest<HTMLElement>('.feitio-filter');
    const wait = Number(field.dataset.debounce ?? 0);
    window.clearTimeout(timers.get(field));
    if (!(wait > 0)) {
      run(field, box);
      return;
    }
    // Debounce: the line under the field fills while the search waits for the typing to stop.
    if (box) {
      box.style.setProperty('--feitio-filter-debounce', `${wait}ms`);
      delete box.dataset.state;
      void box.offsetWidth;
      box.dataset.state = 'waiting';
    }
    timers.set(
      field,
      window.setTimeout(() => run(field, box), wait),
    );
  });
}
