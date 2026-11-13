import { useEffect } from 'react';

type Page = Window & Record<string, unknown>;

/**
 * Wires a delegated behavior once for the whole page (it listens on the document, so components that
 * mount later are covered too). The flag on window is shared with the Astro components, so a page
 * that mixes both never wires it twice.
 */
export function usePageBehavior(flag: string, wire: (window: Window) => void): void {
  useEffect(() => {
    const page = window as unknown as Page;
    if (page[flag]) return;
    page[flag] = true;
    wire(window);
  }, [flag, wire]);
}
