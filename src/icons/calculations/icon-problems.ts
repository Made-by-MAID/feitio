const FIXED_COLOR = /(?:fill|stroke)="(?!none"|currentColor")[^"]*"/;
const ELEMENT = /<([a-z]+)[\s/>]/g;
const ALLOWED = new Set(['svg', 'path']);

/** What keeps an icon from fitting the set: the 24 grid, currentColor, paths only. */
export function iconProblems(svg: string): string[] {
  const problems: string[] = [];
  if (!svg.includes('viewBox="0 0 24 24"')) problems.push('not on the 24 by 24 grid');
  if (FIXED_COLOR.test(svg)) problems.push('has a fixed color: use currentColor');
  const others = [...new Set([...svg.matchAll(ELEMENT)].map((match) => match[1] as string))].filter(
    (element) => !ALLOWED.has(element),
  );
  for (const element of others) problems.push(`draws with <${element}>: draw with <path> only`);
  return problems;
}
