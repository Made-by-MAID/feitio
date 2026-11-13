/** An SVG file split for React: its root attributes, named as React wants them, and its inner markup. */
export interface SvgParts {
  attributes: Record<string, string>;
  inner: string;
}

/** stroke-width becomes strokeWidth; aria-*, data-* and names without a dash stay as they are. */
export function reactAttributeName(name: string): string {
  if (name.startsWith('aria-') || name.startsWith('data-')) return name;
  if (name === 'class') return 'className';
  return name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

/** Splits an SVG file's text into its root's attributes and what is inside it. */
export function svgParts(svg: string): SvgParts {
  const match = /<svg\b([^>]*)>([\s\S]*)<\/svg>/.exec(svg);
  if (!match) return { attributes: {}, inner: '' };
  const attributes: Record<string, string> = {};
  for (const [, name, value] of (match[1] ?? '').matchAll(/([\w:-]+)="([^"]*)"/g))
    if (name !== undefined) attributes[reactAttributeName(name)] = value ?? '';
  return { attributes, inner: (match[2] ?? '').trim() };
}
