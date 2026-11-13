import { type RefObject, useEffect } from 'react';

const wired = new WeakMap<Element, Set<string>>();

/**
 * Wires a behavior on one element when it mounts, only once per element (React's strict mode runs
 * effects twice in development; listeners must not double).
 */
export function useElementBehavior<T extends Element>(
  ref: RefObject<T | null>,
  name: string,
  wire: (element: T) => void,
): void {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const names = wired.get(element) ?? new Set<string>();
    if (names.has(name)) return;
    names.add(name);
    wired.set(element, names);
    wire(element);
  }, [ref, name, wire]);
}
