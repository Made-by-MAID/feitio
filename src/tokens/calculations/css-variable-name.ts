/** The CSS custom property of a token: `--feitio-` and its path, so it never clashes with a host page. */
export function cssVariableName(path: readonly string[]): string {
  return `--feitio-${path.join('-')}`;
}
