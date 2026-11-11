const THEME_FILE = /^([a-z0-9-]+)\.(light|dark)\.tokens\.json$/;

/** A theme file is `<name>.<light|dark>.tokens.json`; anything else is not a theme. */
export function parseThemeFileName(file: string): { name: string; mode: 'light' | 'dark' } | null {
  const match = THEME_FILE.exec(file);
  if (match?.[1] === undefined || match[2] === undefined) return null;
  return { name: match[1], mode: match[2] as 'light' | 'dark' };
}
