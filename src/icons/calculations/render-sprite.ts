export type IconSource = { readonly name: string; readonly svg: string };

const ROOT = /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"([^>]*)>([\s\S]*)<\/svg>\s*$/;

function symbol({ name, svg }: IconSource): string {
  const match = ROOT.exec(svg);
  if (match === null) throw new Error(`icons/${name}.svg is not a single svg element`);
  // Decorative in a file of its own; in the sprite, the page decides on the <svg> that uses it.
  const look = (match[1] as string).replace(' aria-hidden="true"', '');
  return `  <symbol id="feitio-${name}"${look}>${(match[2] as string).trim()}</symbol>`;
}

/** Every icon in one hidden SVG, each as `<symbol id="feitio-<name>">`, for `<use href="#feitio-plus">`. */
export function renderSprite(icons: readonly IconSource[]): string {
  const sorted = [...icons].sort((a, b) => a.name.localeCompare(b.name));
  const symbols = sorted.map(symbol).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:none">\n${symbols}\n</svg>\n`;
}
