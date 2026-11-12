import { menuPosition, nextMenuIndex } from '../calculations/menu-focus.ts';

/**
 * Wires every Feitio Menu under root: the button opens its list (the popover API does the opening,
 * Esc and the click outside); this places it next to the button, puts the focus on the current item,
 * and moves it with the arrows, Home and End.
 */
export function wireMenus(window: Window, root: ParentNode): void {
  for (const list of root.querySelectorAll<HTMLElement>('.feitio-menu-list[popover]')) {
    const button = root.querySelector<HTMLElement>(`[popovertarget="${list.id}"]`);
    if (!button) continue;
    const items = (): HTMLElement[] => [...list.querySelectorAll<HTMLElement>('a, button')];
    list.addEventListener('toggle', (event) => {
      const open = (event as ToggleEvent).newState === 'open';
      button.setAttribute('aria-expanded', String(open));
      if (!open) return;
      const place = menuPosition(
        button.getBoundingClientRect(),
        list.getBoundingClientRect(),
        { width: window.innerWidth, height: window.innerHeight },
        8,
      );
      list.style.left = `${place.left}px`;
      list.style.top = `${place.top}px`;
      const current = items().find((item) => item.getAttribute('aria-current')) ?? items()[0];
      current?.focus();
    });
    list.addEventListener('keydown', (event) => {
      const all = items();
      const next = nextMenuIndex(
        event.key,
        all.indexOf(window.document.activeElement as HTMLElement),
        all.length,
      );
      if (next === undefined) return;
      event.preventDefault();
      all[next]?.focus();
    });
  }
}
