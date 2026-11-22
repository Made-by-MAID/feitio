import { currentSection, followLine, motionFor } from '../calculations/anchor-current.ts';

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]';

/**
 * Wires every Anchor under root. A click on one of its links scrolls to the section (smoothly,
 * unless motion is reduced or data-motion="direct" turns it off), writes the hash without a jump
 * and moves the focus to the section, for the keyboard and screen readers. While the page scrolls,
 * the link of the section in view gets aria-current="location": the last section whose top passed a
 * line near the top of the box that scrolls (the window, or a box such as an AppShell's main area),
 * watched with IntersectionObserver. Each Anchor is wired once, so calling it again is safe.
 */
export function wireAnchors(window: Window, root: ParentNode): void {
  const document = window.document;
  function scrollerOf(element: HTMLElement): HTMLElement | null {
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const overflow = window.getComputedStyle(parent).overflowY;
      if (overflow === 'auto' || overflow === 'scroll') return parent;
    }
    return null;
  }
  for (const anchor of root.querySelectorAll<HTMLElement>('.feitio-anchor')) {
    if (anchor.dataset.wired !== undefined) continue;
    anchor.dataset.wired = '';
    const links = [...anchor.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
    const sections = links
      .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
      .filter((section): section is HTMLElement => section !== null);
    const first = sections[0];
    if (!first) continue;
    const box = scrollerOf(first);
    let held: string | undefined;

    function mark(id: string | undefined): void {
      for (const link of links) {
        if (id !== undefined && link.hash === `#${id}`)
          link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
    function follow(): void {
      if (held !== undefined) {
        mark(held);
        return;
      }
      const top = box ? box.getBoundingClientRect().top : 0;
      const height = box ? box.clientHeight : window.innerHeight;
      const scrolled = box ? box.scrollTop : window.scrollY;
      const total = box ? box.scrollHeight : document.documentElement.scrollHeight;
      const atEnd = total > height + 2 && scrolled + height >= total - 2;
      const rem =
        Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
      const tops = sections.map((section) => section.getBoundingClientRect().top - top);
      mark(sections[currentSection(tops, followLine(height, rem), atEnd)]?.id);
    }

    anchor.addEventListener('click', (event) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const section = link && document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!link || !section) return;
      event.preventDefault();
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const direct = Boolean(anchor.closest('[data-motion="direct"]'));
      section.scrollIntoView({ behavior: motionFor(reduced, direct), block: 'start' });
      window.history.pushState(null, '', link.hash);
      if (!section.matches(FOCUSABLE)) section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
      // While the scroll travels, the clicked link stays current; then the scroll leads again.
      held = section.id;
      mark(held);
      const release = (): void => {
        held = undefined;
        follow();
      };
      (box ?? window).addEventListener('scrollend', release, { once: true });
      window.setTimeout(() => {
        if (held === section.id) release();
      }, 1200);
    });

    const Observer = (window as Window & { IntersectionObserver?: typeof IntersectionObserver })
      .IntersectionObserver;
    if (typeof Observer === 'function') {
      // A section crossing the line (the top quarter's lower edge), and one coming into view at all
      // (a short last section at the end of the page), are the moments the current one may change.
      const crossing = new Observer(follow, {
        root: box,
        rootMargin: '0px 0px -75% 0px',
      });
      const showing = new Observer(follow, { root: box, threshold: [0, 1] });
      for (const section of sections) {
        crossing.observe(section);
        showing.observe(section);
      }
    }
    follow();
  }
}
