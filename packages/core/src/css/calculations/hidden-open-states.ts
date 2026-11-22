const OPEN = /\[open\]|:popover-open|:modal/;
const HIDDEN = /(^|;)\s*opacity\s*:\s*0\s*(;|$)/;

/**
 * The selectors of an open state (a Dialog, a Details, a popover) that a stylesheet hides with
 * opacity 0 outside @starting-style. Inside it, that is where an entry animation starts; anywhere
 * else, it is an open thing nobody can see.
 */
export function hiddenOpenStates(css: string): string[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const headers: string[] = [];
  const found: string[] = [];
  let since = 0;
  for (let at = 0; at < text.length; at++) {
    const char = text[at];
    if (char === '{') {
      const header = text.slice(since, at).split(/[;}]/).at(-1)?.trim() ?? '';
      headers.push(header);
      since = at + 1;
    } else if (char === '}') {
      const header = headers.pop() ?? '';
      const body = text.slice(since, at);
      const starting = headers.some((one) => one.startsWith('@starting-style'));
      if (!header.startsWith('@') && OPEN.test(header) && HIDDEN.test(body) && !starting)
        found.push(header);
      since = at + 1;
    }
  }
  return found;
}
