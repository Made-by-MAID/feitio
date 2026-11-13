/**
 * After the build: a Markdown copy of every page (index.md next to its index.html), and for each
 * language an llms.txt (the pages, each with its Markdown link) and an llms-full.txt (every page in
 * one file). The root llms.txt points to each language. What only makes sense on screen (live
 * examples, playground controls, drawings) is left out; code stays, as fenced blocks.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parseHTML } from 'linkedom';
import TurndownService from 'turndown';

const dist = join(import.meta.dir, '..', 'dist');
const base = (process.env.FEITIO_BASE ?? '/').replace(/\/?$/, '/');
const site = process.env.FEITIO_SITE ?? '';
const LOCALES = ['pt', 'en', 'es', 'fr', 'de'];
const INTRO: Record<string, string> = {
  pt: 'Feitio é um design system humanista, feito à mão: papel creme, tinta quente e um laranja raro. Estas são as páginas da documentação, em Markdown.',
  en: 'Feitio is a humanist, handmade design system: cream paper, warm ink and a rare orange. These are the documentation pages, in Markdown.',
  es: 'Feitio es un design system humanista, hecho a mano: papel crema, tinta cálida y un naranja escaso. Estas son las páginas de la documentación, en Markdown.',
  fr: 'Feitio est un design system humaniste, fait main : papier crème, encre chaude et un orange rare. Voici les pages de la documentation, en Markdown.',
  de: 'Feitio ist ein humanistisches, handgemachtes Designsystem: cremefarbenes Papier, warme Tinte und ein seltenes Orange. Das sind die Seiten der Dokumentation, in Markdown.',
};

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});
turndown.addRule('code-block', {
  filter: (node) => node.nodeName === 'PRE',
  replacement: (_content, node) => {
    const lang = (node as HTMLElement).closest?.('[data-lang]')?.getAttribute('data-lang') ?? '';
    return `\n\n\`\`\`${lang}\n${(node.textContent ?? '').replace(/\n$/, '')}\n\`\`\`\n\n`;
  },
});
turndown.remove([
  'script',
  'style',
  'svg',
  'button',
  'input',
  'select',
  'textarea',
  'dialog',
  'nav',
]);

async function pages(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await pages(path)));
    else if (entry.name === 'index.html') out.push(path);
  }
  return out;
}

function markdownOf(html: string): { title: string; markdown: string } {
  const { document } = parseHTML(html);
  const main = document.querySelector('main');
  const title = (document.querySelector('h1')?.textContent ?? document.title).trim();
  if (!main) return { title, markdown: '' };
  // Only on screen: live examples, the playground's stage and controls, the anatomy pieces, the breadcrumbs, the page index.
  for (const el of main.querySelectorAll(
    'h1, .feitio-code .bar, .live, .stage, .controls, .sketch-anatomy .parts, .feitio-breadcrumbs, .toc-mobile, .mosaic, .board, .try-screen, .try-controls, .lay-box, [aria-hidden="true"], .copy',
  ))
    el.remove();
  return {
    title,
    markdown: `${turndown
      .turndown(main.innerHTML)
      .replace(/\n{3,}/g, '\n\n')
      .trim()}\n`,
  };
}

const byLang: Record<string, { title: string; url: string; markdown: string }[]> =
  Object.fromEntries(LOCALES.map((l) => [l, []]));
for (const file of await pages(dist)) {
  const rel = relative(dist, file).replace(/index\.html$/, '');
  const lang = rel.split('/')[0] ?? '';
  if (!LOCALES.includes(lang)) continue;
  const { title, markdown } = markdownOf(await readFile(file, 'utf8'));
  if (!markdown) continue;
  await writeFile(file.replace(/index\.html$/, 'index.md'), `# ${title}\n\n${markdown}`);
  byLang[lang]?.push({
    title,
    url: `${site}${base}${rel}index.md`,
    markdown: `# ${title}\n\n${markdown}`,
  });
}
for (const lang of LOCALES) {
  const list = (byLang[lang] ?? []).sort((a, b) => a.url.localeCompare(b.url));
  const index = `# Feitio (${lang})\n\n> ${INTRO[lang]}\n\n${list.map((p) => `- [${p.title}](${p.url})`).join('\n')}\n`;
  await writeFile(join(dist, lang, 'llms.txt'), index);
  await writeFile(
    join(dist, lang, 'llms-full.txt'),
    list.map((p) => p.markdown).join('\n\n---\n\n'),
  );
}
await writeFile(
  join(dist, 'llms.txt'),
  `# Feitio\n\n> ${INTRO.en}\n\n${LOCALES.map((l) => `- [${l}](${site}${base}${l}/llms.txt) (full: [${l}/llms-full.txt](${site}${base}${l}/llms-full.txt))`).join('\n')}\n`,
);
console.log(
  `Markdown: ${Object.values(byLang).reduce((n, l) => n + l.length, 0)} pages, llms.txt for ${LOCALES.length} languages.`,
);
