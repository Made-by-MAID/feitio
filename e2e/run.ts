/**
 * Opens the showcase in a real browser and checks it as a person would see it: no broken requests
 * or script errors, no accessibility violation by axe-core by day, at night, in compact density
 * and in Portuguese, and no sideways scroll on a phone. Screenshots of each state go to e2e/screenshots/ for
 * a human to look at. Run with `bun run test:e2e` after `bunx playwright install chromium`.
 */
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium, type Page } from 'playwright';

type AxeResults = { violations: { id: string; help: string; nodes: { target: string[] }[] }[] };

const root = join(import.meta.dir, '..');
const shots = join(import.meta.dir, 'screenshots');
const axeSource = await readFile(join(root, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');

const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const path = decodeURIComponent(new URL(request.url).pathname);
    const file = Bun.file(join(root, path.endsWith('/') ? `${path}index.html` : path));
    return (await file.exists()) ? new Response(file) : new Response('not found', { status: 404 });
  },
});
const url = `http://localhost:${server.port}/site/index.html`;

const problems: string[] = [];

async function axe(page: Page, state: string): Promise<void> {
  await page.addScriptTag({ content: axeSource });
  const results = (await page.evaluate('axe.run(document)')) as AxeResults;
  for (const violation of results.violations) {
    const where = violation.nodes.map((node) => node.target.join(' ')).join(', ');
    problems.push(`${state}: ${violation.id} (${violation.help}) at ${where}`);
  }
}

async function settle(page: Page): Promise<void> {
  // Every change of state is a transition; wait for it to land before judging colors.
  await page.waitForTimeout(600);
}

const browser = await chromium.launch();
try {
  await mkdir(shots, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (error) => problems.push(`script error: ${error.message}`));
  page.on('response', (response) => {
    if (response.url().startsWith('http://localhost') && response.status() >= 400) {
      problems.push(`broken request: ${response.url()} (${response.status()})`);
    }
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await settle(page);
  await axe(page, 'day');
  await page.screenshot({ path: join(shots, 'day.png'), fullPage: true });

  await page.getByRole('button', { name: 'Night' }).click();
  await settle(page);
  await axe(page, 'night');
  await page.screenshot({ path: join(shots, 'night.png'), fullPage: true });

  await page.getByRole('button', { name: 'Day' }).click();
  await page.getByRole('button', { name: 'Compact' }).click();
  await page.getByRole('button', { name: 'Sort by' }).click();
  await settle(page);
  await axe(page, 'compact, menu open');
  await page.screenshot({ path: join(shots, 'compact-menu.png'), fullPage: true });

  await page.getByRole('button', { name: 'Português' }).click();
  await settle(page);
  await axe(page, 'portuguese');
  const untranslated = (await page.evaluate(
    "[...document.querySelectorAll('[data-pt]')].filter((e) => e.textContent !== e.dataset.pt).length",
  )) as number;
  if (untranslated > 0) problems.push(`portuguese: ${untranslated} text(s) did not switch`);
  if ((await page.evaluate('document.documentElement.lang')) !== 'pt-BR') {
    problems.push('portuguese: the page language did not switch to pt-BR');
  }
  await page.screenshot({ path: join(shots, 'portuguese.png'), fullPage: true });

  const phone = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await phone.goto(url, { waitUntil: 'networkidle' });
  const overflow = (await phone.evaluate(
    'document.documentElement.scrollWidth - window.innerWidth',
  )) as number;
  if (overflow > 0) problems.push(`phone: the page scrolls sideways by ${overflow}px`);
  await phone.screenshot({ path: join(shots, 'phone.png'), fullPage: true });
} finally {
  await browser.close();
  server.stop();
}

if (problems.length > 0) {
  console.error(
    `The showcase has ${problems.length} problem(s):\n${problems.map((p) => `- ${p}`).join('\n')}`,
  );
  process.exit(1);
}
console.log(`The showcase passed. Screenshots in ${shots}`);
