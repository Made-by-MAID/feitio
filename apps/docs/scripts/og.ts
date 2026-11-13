/**
 * The link-preview image of every page (1200×630 PNG, design "B": the page's title on lifted paper),
 * made after the build from each page's own head: og:title, og:description, article:section and
 * og:image, which says where the image goes. Satori lays it out, resvg draws it; the fonts are the
 * site's own Alegreya (SIL OFL).
 */
import { mkdir, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { parseHTML } from 'linkedom';
import satori from 'satori';

const root = join(import.meta.dir, '..');
const dist = join(root, 'dist');
const font = (file: string) => Bun.file(join(root, 'node_modules/@fontsource', file)).arrayBuffer();
const fonts = [
  {
    name: 'Alegreya',
    data: await font('alegreya/files/alegreya-latin-500-normal.woff'),
    weight: 500 as const,
  },
  {
    name: 'Sans',
    data: await font('alegreya-sans/files/alegreya-sans-latin-700-normal.woff'),
    weight: 700 as const,
  },
  {
    name: 'Sans',
    data: await font('alegreya-sans/files/alegreya-sans-latin-500-normal.woff'),
    weight: 500 as const,
  },
];
const C = { bg: '#f8f1e6', paper: '#fdfaf3', ink: '#2d211a', soft: '#65574c', hot: '#ba4209' };

/** The mark with its colors written in, since the image renderer does not read its <style>. */
const markSource = await Bun.file(join(root, 'public/marca/feitio.svg')).text();
const mark = `data:image/svg+xml;base64,${btoa(
  markSource
    .replace(/<style>[\s\S]*?<\/style>/, '')
    .replace(/<title>.*?<\/title>/, '')
    .replace(/<!--.*?-->/, '')
    .replaceAll('class="shadow"', `fill="${C.ink}"`)
    .replaceAll('class="paper"', `fill="${C.paper}"`)
    .replaceAll(
      'class="ink"',
      `fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"`,
    )
    .replaceAll(
      'class="hot"',
      `fill="none" stroke="${C.hot}" stroke-width="3" stroke-linecap="round"`,
    ),
)}`;

/** At most two lines under the title: cut at a word, with an ellipsis. */
function short(text: string, max = 110): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/[\s,;:.]+\S*$/, '')}…`;
}

type Node = { type: string; props: Record<string, unknown> };
function h(type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node {
  return { type, props: { style, children } };
}

interface Card {
  section: string;
  title: string;
  description: string;
  lang: string;
  host: string;
}

function card({ section, title, description, lang, host }: Card): Node {
  const big = title.length > 22 ? 76 : title.length > 14 ? 88 : 104;
  const corners = '22px 30px 18px 34px';
  const box = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 1074,
    height: 502,
    borderRadius: corners,
  };
  return h(
    'div',
    {
      display: 'flex',
      width: 1200,
      height: 630,
      boxSizing: 'border-box',
      padding: '50px 56px 78px',
      background: C.bg,
      fontFamily: 'Sans',
      color: C.ink,
    },
    h(
      'div',
      { display: 'flex', position: 'relative', width: 1074, height: 502 },
      h('div', { ...box, left: 14, top: 16, background: C.ink }),
      h(
        'div',
        {
          ...box,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          padding: '48px 64px',
          background: C.paper,
          border: `4px solid ${C.ink}`,
        },
        h(
          'div',
          { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
          h('span', { fontSize: 30, fontWeight: 700, color: C.hot }, section),
          h(
            'div',
            { display: 'flex', alignItems: 'center', gap: 14 },
            h('span', { fontSize: 34, fontWeight: 700 }, 'Feitio'),
            { type: 'img', props: { src: mark, width: 52, height: 52 } },
          ),
        ),
        h(
          'div',
          { display: 'flex', flexDirection: 'column', gap: 16 },
          h('span', { fontFamily: 'Alegreya', fontSize: big, lineHeight: 1.05 }, title),
          h(
            'span',
            {
              fontFamily: 'Alegreya',
              fontSize: 32,
              color: C.soft,
              lineHeight: 1.3,
              maxWidth: 900,
            },
            short(description),
          ),
        ),
        h(
          'div',
          {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 24,
            color: C.soft,
            fontWeight: 500,
          },
          h('span', {}, host),
          h('span', {}, lang.toUpperCase()),
        ),
      ),
    ),
  );
}

async function pages(dir: string): Promise<string[]> {
  const found: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await pages(path)));
    else if (entry.name === 'index.html') found.push(path);
  }
  return found;
}

let made = 0;
for (const file of await pages(dist)) {
  const { document } = parseHTML(await Bun.file(file).text());
  const meta = (key: string) =>
    document.querySelector(`meta[property="${key}"]`)?.getAttribute('content') ?? '';
  const image = meta('og:image');
  if (!image) continue;
  const url = new URL(image);
  const base = process.env.FEITIO_BASE ?? '/';
  const out = join(dist, url.pathname.slice(base.length));
  const page = new URL(meta('og:url'));
  // The home's title is "Feitio · what it is": the name big, what it is above it.
  const [name, tagline] = meta('og:title').split(' · ');
  const svg = await satori(
    card({
      section: meta('article:section') || tagline || 'Feitio',
      title: tagline ? (name ?? 'Feitio') : meta('og:title'),
      description: meta('og:description'),
      lang: document.documentElement.getAttribute('lang')?.slice(0, 2) ?? 'pt',
      host: `${page.host}${base.replace(/\/$/, '')}`,
    }),
    { width: 1200, height: 630, fonts },
  );
  await mkdir(dirname(out), { recursive: true });
  await Bun.write(out, new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
  made += 1;
}
console.log(`Link previews: ${made} images.`);
