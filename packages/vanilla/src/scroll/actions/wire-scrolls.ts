import { backToTopVisible, fadeVisible } from '../calculations/scroll-visibility.ts';

/**
 * Wires every ScrollFade and BackToTop under root to the box that scrolls around it (or the window):
 * the fade shows while there is more below, BackToTop after half a screen, and its click scrolls
 * back up (smoothly, unless motion is reduced) and moves the focus to its target. Each element is
 * wired once, so calling it again after new HTML arrives is safe.
 */
export function wireScrolls(window: Window, root: ParentNode): void {
  const document = window.document;
  function scrollerOf(element: HTMLElement): HTMLElement | null {
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const overflow = window.getComputedStyle(parent).overflowY;
      if (overflow === 'auto' || overflow === 'scroll') return parent;
    }
    return null;
  }
  for (const element of root.querySelectorAll<HTMLElement>(
    '.feitio-scroll-fade, .feitio-back-to-top',
  )) {
    if (element.dataset.wired !== undefined) continue;
    element.dataset.wired = '';
    const box = scrollerOf(element);
    const area = box ?? document.documentElement;
    const fade = element.classList.contains('feitio-scroll-fade');
    const update = (): void => {
      const visible = fade
        ? fadeVisible(area.scrollTop, area.clientHeight, area.scrollHeight)
        : backToTopVisible(area.scrollTop, area.clientHeight);
      element.toggleAttribute('data-visible', visible);
    };
    (box ?? window).addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // The content may grow or shrink with no scroll at all (a tab, a list filtered, a details
    // opened): the fade follows its size too, so it never shows over a page with nothing below.
    if (typeof ResizeObserver === 'function') {
      const sizes = new ResizeObserver(update);
      if (box) for (const child of box.children) sizes.observe(child);
      else sizes.observe(document.body);
    }
    update();
    if (!fade) {
      element.addEventListener('click', (event) => {
        event.preventDefault();
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        area.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
        const target = element.getAttribute('href');
        if (target?.startsWith('#'))
          document.querySelector<HTMLElement>(target)?.focus({ preventScroll: true });
      });
    }
  }
}
