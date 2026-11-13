/**
 * The Feitio card, design "B": a title on lifted paper, laid out by Satori and drawn by resvg with the
 * site's own Alegreya (SIL OFL). Used for every page's link preview (og.ts) and the repository's
 * social preview (social-preview.ts).
 */
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

const root = join(import.meta.dir, '..');
const font = (file: string) => Bun.file(join(root, 'node_modules/@fontsource', file)).arrayBuffer();
export const fonts = [
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
export function short(text: string, max = 110): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/[\s,;:.]+\S*$/, '')}…`;
}

type Node = { type: string; props: Record<string, unknown> };
function h(type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node {
  return { type, props: { style, children } };
}

export interface Card {
  section: string;
  title: string;
  description: string;
  lang: string;
  host: string;
}

/** The card at a size: 1200×630 for link previews, 1280×640 for the repository's social preview. */
export function card(
  { section, title, description, lang, host }: Card,
  width = 1200,
  height = 630,
): Node {
  const inner = { width: width - 126, height: height - 128 };
  const big = title.length > 22 ? 76 : title.length > 14 ? 88 : 104;
  const corners = '22px 30px 18px 34px';
  const box = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: inner.width,
    height: inner.height,
    borderRadius: corners,
  };
  return h(
    'div',
    {
      display: 'flex',
      width,
      height,
      boxSizing: 'border-box',
      padding: '50px 56px 78px',
      background: C.bg,
      fontFamily: 'Sans',
      color: C.ink,
    },
    h(
      'div',
      { display: 'flex', position: 'relative', width: inner.width, height: inner.height },
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
          h('span', {}, lang.length <= 3 ? lang.toUpperCase() : lang),
        ),
      ),
    ),
  );
}

/** The card as a PNG. */
export async function cardPng(content: Card, width = 1200, height = 630): Promise<Uint8Array> {
  const svg = await satori(card(content, width, height) as never, { width, height, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}
