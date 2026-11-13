/**
 * Lighthouse on the built site, so a change cannot make it worse without anyone noticing: on the
 * home, a component page and a guide page, accessibility, best practices and SEO must stay at 100,
 * and performance at or above the floor below (the CI machine is slower and noisier than a visitor's,
 * and this server neither compresses nor caches, so the floor has room). The scores go to
 * tests/lighthouse.json for a human to look at. Run after `bun run docs:build`.
 */
import { join } from 'node:path';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';

const PERFORMANCE_FLOOR = 80;
const PAGES = ['pt/', 'pt/components/button/', 'en/design/cor/'];

const dist = join(import.meta.dir, '..', 'dist');
const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const path = decodeURIComponent(new URL(request.url).pathname);
    const file = Bun.file(join(dist, path.endsWith('/') ? `${path}index.html` : path));
    return (await file.exists()) ? new Response(file) : new Response('not found', { status: 404 });
  },
});
const port = 9300 + Math.floor(Math.random() * 500);
const browser = await chromium.launch({
  executablePath: process.env.SHOT_BROWSER || undefined,
  args: [`--remote-debugging-port=${port}`],
});

const problems: string[] = [];
const scores: Record<string, Record<string, number>> = {};
for (const path of PAGES) {
  const result = await lighthouse(`http://localhost:${server.port}/${path}`, {
    port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  });
  const categories = result?.lhr.categories ?? {};
  const page: Record<string, number> = {};
  for (const [id, category] of Object.entries(categories))
    page[id] = Math.round((category.score ?? 0) * 100);
  scores[path] = page;
  for (const id of ['accessibility', 'best-practices', 'seo'])
    if (page[id] !== 100) problems.push(`${path}: ${id} is ${page[id]}, not 100`);
  if ((page.performance ?? 0) < PERFORMANCE_FLOOR)
    problems.push(`${path}: performance is ${page.performance}, under ${PERFORMANCE_FLOOR}`);
}

await browser.close();
server.stop();
await Bun.write(join(import.meta.dir, 'lighthouse.json'), JSON.stringify(scores, null, 2));
for (const [path, page] of Object.entries(scores)) console.log(path, page);
if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join('\n'));
  process.exit(1);
}
console.log('Lighthouse: every page at its mark');
