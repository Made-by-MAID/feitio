/**
 * The link-preview image of every page (1200×630 PNG, the card of og-card.ts), made after the build
 * from each page's own head: og:title, og:description, article:section and og:image, which says
 * where the image goes.
 */
import { mkdir, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { parseHTML } from 'linkedom';
import { cardPng } from './og-card.ts';

const root = join(import.meta.dir, '..');
const dist = join(root, 'dist');

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
  const png = await cardPng({
    section: meta('article:section') || tagline || 'Feitio',
    title: tagline ? (name ?? 'Feitio') : meta('og:title'),
    description: meta('og:description'),
    lang: document.documentElement.getAttribute('lang')?.slice(0, 2) ?? 'pt',
    host: `${page.host}${base.replace(/\/$/, '')}`,
  });
  await mkdir(dirname(out), { recursive: true });
  await Bun.write(out, png);
  made += 1;
}
console.log(`Link previews: ${made} images.`);
