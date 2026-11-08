const DEFINED = /(--feitio-[a-z0-9-]+)\s*:/g;
const USED = /var\(\s*(--feitio-[a-z0-9-]+)/g;

/** The Feitio custom properties a stylesheet declares. */
export function definedVariables(css: string): Set<string> {
  return new Set([...css.matchAll(DEFINED)].map((match) => match[1] as string));
}

/** The Feitio custom properties a stylesheet reads with var(). */
export function usedVariables(css: string): Set<string> {
  return new Set([...css.matchAll(USED)].map((match) => match[1] as string));
}
