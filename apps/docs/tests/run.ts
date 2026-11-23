/**
 * The documentation site in a real browser, as a person uses it. For every page in every language:
 * no broken request or script error, no axe violation by day (every rule) and no contrast failure at
 * night (axe's color-contrast: only the colors change at night), no sideways scroll on a phone. Then each component's behavior: the playground, the Notice's close and time, the language
 * Menu with the keyboard. Screenshots go to tests/screenshots/ for a human to look at.
 * Run with `bun run test:docs` (it builds the site first).
 */
import { mkdir, readFile } from 'node:fs/promises';
import { cpus } from 'node:os';
import { join } from 'node:path';
import { parseHTML } from 'linkedom';
import { chromium, type Page } from 'playwright';
import { INLINE_STYLE_ALLOWED } from '../../../packages/react/parity/cases.ts';
import { inkPastBorder } from './calculations/ink-past-border.ts';

type AxeResults = { violations: { id: string; help: string; nodes: { target: string[] }[] }[] };

const repo = join(import.meta.dir, '..', '..', '..');
const dist = join(import.meta.dir, '..', 'dist');
const shots = join(import.meta.dir, 'screenshots');
const axeSource = await readFile(join(repo, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const LOCALES = ['pt', 'en', 'es', 'fr', 'de'];
const drafts = JSON.parse(
  await readFile(join(import.meta.dir, '..', 'src', 'content', 'drafts.json'), 'utf8'),
) as { slug: string }[];
const areas = JSON.parse(
  await readFile(join(import.meta.dir, '..', 'src', 'content', 'areas.json'), 'utf8'),
) as { pages: { area: string; slug: string }[] };
const PAGES = [
  '',
  ...drafts.map((d) => `components/${d.slug}/`),
  ...areas.pages.map((p) =>
    p.area === 'components' && p.slug === 'index' ? 'components/' : `${p.area}/${p.slug}/`,
  ),
].filter(
  (p) => !process.env.PAGES || process.env.PAGES.split(',').some((only) => p.includes(only)),
);

const core = join(repo, 'packages', 'core');
const parityFile = Bun.file(join(dist, 'parity.json'));
const parity = (await parityFile.exists())
  ? ((await parityFile.json()) as Record<string, string>)
  : {};

/**
 * A page with some components as the Astro components render them (the parity cases), Feitio's own
 * CSS and fonts, and a Content Security Policy that forbids inline styles and scripts, like a
 * consumer's strict page. Nothing on it may need a style attribute to look right.
 */
function fixture(ids: string[], mode: string): Response {
  const body = ids
    .map((id) => `<div class="fixture" data-case="${id}">${parity[id] ?? ''}</div>`)
    .join('');
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Fixture</title><link rel="stylesheet" href="/core/css/fonts.css"><link rel="stylesheet" href="/core/css/feitio.css"><link rel="stylesheet" href="/fixture.css"><body class="feitio-root" data-theme="casa" data-mode="${mode}">${body}</body></html>`;
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'content-security-policy': "default-src 'self'; style-src 'self'; script-src 'none'",
    },
  });
}
const FIXTURE_CSS = `body { margin: 0; padding: var(--feitio-space-4); background: var(--feitio-color-surface); color: var(--feitio-color-text); }
.fixture { display: inline-block; margin: var(--feitio-space-2); vertical-align: top; }
.fixture:has(.feitio-heatmap, .feitio-masonry, .feitio-app) { display: block; }`;

const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname);
    if (path === '/fixture')
      return fixture(
        (url.searchParams.get('ids') ?? '').split(','),
        url.searchParams.get('mode') ?? 'light',
      );
    if (path === '/fixture.css')
      return new Response(FIXTURE_CSS, { headers: { 'content-type': 'text/css' } });
    if (path.startsWith('/core/')) {
      const file = Bun.file(join(core, path.slice('/core/'.length)));
      return (await file.exists())
        ? new Response(file)
        : new Response('not found', { status: 404 });
    }
    const file = Bun.file(join(dist, path.endsWith('/') ? `${path}index.html` : path));
    return (await file.exists()) ? new Response(file) : new Response('not found', { status: 404 });
  },
});
const origin = `http://localhost:${server.port}`;
const problems: string[] = [];

function check(condition: boolean, what: string): void {
  if (!condition) problems.push(what);
}

/** axe on the page: every rule, or only color contrast (the night run: only colors change). */
async function axe(page: Page, state: string, contrastOnly = false): Promise<void> {
  if ((await page.evaluate('typeof axe')) === 'undefined')
    await page.addScriptTag({ content: axeSource });
  const options = contrastOnly ? "{ runOnly: { type: 'rule', values: ['color-contrast'] } }" : '{}';
  const results = (await page.evaluate(`axe.run(document, ${options})`)) as AxeResults;
  for (const violation of results.violations) {
    const where = violation.nodes.map((node) => node.target.join(' ')).join(', ');
    problems.push(`${state}: ${violation.id} (${violation.help}) at ${where}`);
  }
}

/**
 * Reports what goes wrong on a page under its name. A page that is reused for many URLs passes the
 * name as a function, read when each event happens; a request is reported under the URL it was made
 * for, and one that a new navigation cut short (net::ERR_ABORTED) belongs to the page left behind.
 */
function watch(page: Page, state: string | (() => string)): void {
  const name = typeof state === 'string' ? () => state : state;
  const madeFor = new WeakMap<object, string>();
  page.on('pageerror', (error) => problems.push(`${name()}: script error: ${error.message}`));
  page.on('requestfailed', (request) => {
    const when = madeFor.get(request) ?? name();
    if (request.failure()?.errorText === 'net::ERR_ABORTED' && when !== name()) return;
    problems.push(`${when}: failed request ${request.url()}`);
  });
  // Nothing goes to anyone else: no fonts, scripts or images from another site (privacy).
  page.on('request', (request) => {
    madeFor.set(request, name());
    const url = request.url();
    if (!url.startsWith(origin) && !url.startsWith('data:'))
      problems.push(`${name()}: request to another site ${url}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && response.url().startsWith(origin))
      problems.push(
        `${madeFor.get(response.request()) ?? name()}: ${response.status()} ${response.url()}`,
      );
  });
}

/** Waits for what a check needs: the page loaded, its fonts in, and two frames painted. */
async function settled(page: Page): Promise<void> {
  await page.waitForLoadState('load');
  await page.evaluate(() =>
    document.fonts.ready.then(
      () =>
        new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => done(0)))),
    ),
  );
}

await mkdir(shots, { recursive: true });
const browser = await chromium.launch();

// Every page, every language: day (full axe), night (axe's color contrast: only colors change at
// night) and a phone (no sideways scroll). ONLY=behavior skips this, to run the rest quickly.
// A small pool of workers shares the pages; each worker keeps three pages open (day, night, phone)
// and only navigates them, with axe loaded on each navigation by an init script. DOCS_WORKERS sets
// the pool (4 on CI, whose runner has 4 vCPUs; locally, half the CPUs, between 2 and 8: each
// worker drives three Chromium pages, and more workers than that only make them wait). It prints its
// progress, so a run in CI never looks stuck.
const pageLangs = process.env.ONLY === 'behavior' ? [] : LOCALES;
const pageList = pageLangs.flatMap((lang) =>
  PAGES.map((path) => ({
    lang,
    path,
    name: `${lang}-${path.replaceAll('/', '-').replace(/-$/, '') || 'home'}`,
  })),
);
const pageTotal = pageList.length;
const workers = Math.max(
  1,
  Math.min(
    pageTotal,
    Number(process.env.DOCS_WORKERS) ||
      (process.env.CI ? 4 : Math.min(8, Math.max(2, Math.floor(cpus().length / 2)))),
  ),
);
let pageNext = 0;
let pageDone = 0;
const pagesStarted = performance.now();
if (pageTotal)
  console.log(
    `Pages: ${pageTotal} (${PAGES.length} in ${pageLangs.length} languages), day, night and phone, ${workers} at a time`,
  );

async function pageWorker(): Promise<void> {
  let label = '';
  const open = async (options: Parameters<typeof browser.newPage>[0]): Promise<Page> => {
    const page = await browser.newPage(options);
    await page.addInitScript({ content: axeSource });
    return page;
  };
  const day = await open({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const night = await open({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  watch(day, () => label);
  watch(night, () => label);
  while (pageNext < pageTotal) {
    const item = pageList[pageNext++];
    if (!item) break;
    const url = `${origin}/${item.lang}/${item.path}`;
    for (const [mode, page] of [
      ['light', day],
      ['dark', night],
    ] as const) {
      label = `${item.name} ${mode}`;
      await page.goto(url);
      await settled(page);
      await axe(page, label, mode === 'dark');
      if (item.lang === 'pt')
        await page.screenshot({ path: join(shots, `${item.name}-${mode}.png`), fullPage: true });
    }
    await phone.goto(url);
    await settled(phone);
    const sideways = await phone.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    check(!sideways, `${item.name} phone: sideways scroll`);
    if (item.lang === 'pt')
      await phone.screenshot({ path: join(shots, `${item.name}-phone.png`), fullPage: true });
    pageDone += 1;
    if (pageDone % 25 === 0 || pageDone === pageTotal)
      console.log(`Pages: ${pageDone} of ${pageTotal}, ${problems.length} problem(s) so far`);
  }
  // The pages are left behind: what they do after this belongs to no check.
  label = 'closed';
  await Promise.all([day.close(), night.close(), phone.close()]);
}

await Promise.all(Array.from({ length: pageTotal ? workers : 0 }, () => pageWorker()));
if (pageTotal)
  console.log(`Pages: done in ${((performance.now() - pagesStarted) / 1000).toFixed(0)}s`);
console.log('Behaviors: playgrounds, Notice, Menu, forms, Kanban…');

// Search and link previews, read from the built files: every page in every language has its
// description, canonical, the five languages plus x-default, its preview image (which exists), and is
// in the sitemap.
{
  const sitemap = await readFile(join(dist, 'sitemap-0.xml'), 'utf8').catch(() => '');
  const links = new Set<string>();
  check(sitemap.length > 0, 'sitemap: sitemap-0.xml is missing');
  for (const lang of LOCALES) {
    for (const path of PAGES) {
      const name = `${lang}/${path}`;
      const html = await readFile(join(dist, lang, path, 'index.html'), 'utf8');
      const { document } = parseHTML(html);
      const content = (selector: string) =>
        document.querySelector(selector)?.getAttribute('content') ?? '';
      check(content('meta[name="description"]').length > 20, `${name}: no description`);
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
      check(
        canonical.startsWith('http') && canonical.endsWith(`/${lang}/${path}`),
        `${name}: canonical is "${canonical}"`,
      );
      const alternates = [...document.querySelectorAll('link[rel="alternate"][hreflang]')];
      check(
        alternates.length === 6 &&
          alternates.every((l) => l.getAttribute('href')?.startsWith('http')),
        `${name}: hreflang should be five languages plus x-default, absolute`,
      );
      check(sitemap.includes(`<loc>${canonical}</loc>`), `${name}: not in the sitemap`);
      const image = content('meta[property="og:image"]');
      const file = Bun.file(join(dist, new URL(image).pathname));
      check(
        image.endsWith('.png') && (await file.exists()) && file.size < 300_000,
        `${name}: preview image ${image} missing or over 300 KB`,
      );
      check(
        content('meta[name="twitter:card"]') === 'summary_large_image',
        `${name}: no twitter card`,
      );
      check(
        document.querySelector('script[type="application/ld+json"]') !== null,
        `${name}: no structured data`,
      );
      // Every link inside the site leads to a page or file that exists.
      for (const link of document.querySelectorAll('a[href^="/"]')) {
        const target = (link.getAttribute('href') ?? '').split(/[#?]/)[0] ?? '';
        if (!target || links.has(target)) continue;
        links.add(target);
        const file = target.endsWith('/') ? join(dist, target, 'index.html') : join(dist, target);
        check(await Bun.file(file).exists(), `${name}: broken link ${target}`);
      }
    }
  }
}

// The page for an address that does not exist: in the site's frame, accessible by day and at night,
// and kept out of search.
for (const mode of ['light', 'dark'] as const) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: mode });
  watch(page, `404 ${mode}`);
  await page.goto(`${origin}/404.html`);
  await axe(page, `404 ${mode}`);
  check(
    (await page.locator('meta[name="robots"]').getAttribute('content')) === 'noindex',
    '404: not noindex',
  );
  check(
    (await page.locator('.feitio-link-card').count()) === 4,
    '404: the other four languages are missing',
  );
  await page.close();
}

// Button: the playground changes the live button and its code together.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${origin}/en/components/button/`);
  await page.click('[data-prop="variant"][data-value="primary"]');
  await page.click('[data-prop="size"][data-value="large"]');
  await page.fill('[data-text]', 'Send it');
  const live = await page
    .locator('.playground .live .feitio-button')
    .evaluate((b) => [b.getAttribute('data-variant'), b.getAttribute('data-size'), b.textContent]);
  check(live.join('|') === 'primary|large|Send it', `button playground: live is ${live.join('|')}`);
  const code = (await page.locator('.playground .feitio-code pre').textContent()) ?? '';
  check(
    code.includes('data-variant="primary"') && code.includes('Send it'),
    'button playground: the code did not follow',
  );
  await page.close();
}

// Notice: the close button closes; the timed one goes away; showing it again while on screen does not land it again.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${origin}/en/components/notice/`);
  await page.click('#ex-n-fechar .close');
  await page.waitForTimeout(700);
  check(await page.locator('#ex-n-fechar').isHidden(), 'notice: the close button did not close it');
  await page.click('[data-notice-show="ex-n-fechar"]');
  check(await page.locator('#ex-n-fechar').isVisible(), 'notice: show again did not bring it back');
  await page.locator('#ex-n-tempo').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(9000);
  check(await page.locator('#ex-n-tempo').isHidden(), 'notice: the timed notice did not go away');
  await page.click('[data-notice-show="ex-n-tempo"]');
  await page.waitForTimeout(300);
  await page.evaluate(() =>
    document.getElementById('ex-n-tempo')?.classList.remove('feitio-place'),
  );
  await page.click('[data-notice-show="ex-n-tempo"]');
  const placedAgain = await page
    .locator('#ex-n-tempo')
    .evaluate((n) => n.classList.contains('feitio-place'));
  check(!placedAgain, 'notice: showing it again while on screen landed it again');
  await page.close();
}

// Menu: opens on its button, the focus goes to the current language, arrows move it, Esc closes.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${origin}/pt/components/button/`);
  await page.click('[popovertarget="lang-list"]');
  await page.waitForTimeout(300);
  check(
    (await page.locator('#lang-list').evaluate((l) => l.matches(':popover-open'))) === true,
    'menu: did not open',
  );
  check(
    (await page.evaluate(() => document.activeElement?.textContent?.trim())) === 'Português',
    'menu: the focus is not on the current language',
  );
  await page.keyboard.press('ArrowDown');
  check(
    (await page.evaluate(() => document.activeElement?.textContent?.trim())) === 'English',
    'menu: ArrowDown did not move the focus',
  );
  await page.keyboard.press('Escape');
  check(
    (await page.locator('#lang-list').evaluate((l) => l.matches(':popover-open'))) === false,
    'menu: Esc did not close it',
  );
  await page.click('[popovertarget="lang-list"]');
  await page.click('#lang-list a[hreflang="es"]');
  await page.waitForURL('**/es/components/button/');
  await page.close();
}

// Forms: the Switch says its state, AM/PM swaps once per click, the SegmentedControl marks its choice,
// the FilterField filters and counts, and the playground re-renders with its controls.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${origin}/en/components/switch/`);
  await page.click('.playground .live .feitio-switch');
  check(
    (await page.locator('.playground .live .feitio-switch .state').textContent())?.trim() === 'On',
    'switch: the state did not say On',
  );
  await page.click('[data-prop="state"][data-value="disabled"]');
  check(
    await page.locator('.playground .live .feitio-switch input').isDisabled(),
    'switch playground: disabled did not apply',
  );
  await page.goto(`${origin}/en/components/timeinput/`);
  await page.click('[data-prop="cycle"][data-value="12"]');
  const before = (await page.locator('.playground .live .period').textContent())?.trim();
  await page.click('.playground .live .period');
  const after = (await page.locator('.playground .live .period').textContent())?.trim();
  check(before !== after && Boolean(after), `timeinput: AM/PM did not swap (${before} → ${after})`);
  await page.goto(`${origin}/en/components/segmented/`);
  await page.click('[data-prop="count"][data-value="3"]');
  await page.click('.playground .live .feitio-segmented button:nth-child(3)');
  check(
    (await page
      .locator('.playground .live .feitio-segmented button:nth-child(3)')
      .getAttribute('aria-pressed')) === 'true',
    'segmented: the choice was not marked',
  );
  await page.goto(`${origin}/en/components/filterfield/`);
  await page.fill('#pg-filter', 'plants');
  const visible = await page.locator('#pg-filter-list li:not([hidden])').count();
  check(visible === 1, `filterfield: ${visible} items left instead of 1`);
  check(
    ((await page.locator('[data-count="pg-filter-list"]').textContent()) ?? '').includes('1'),
    'filterfield: the count did not follow',
  );
  // With the debounce and the async search on: it waits, then it is busy, then the results arrive.
  await page.click('[data-prop="debounce"][data-value="on"]');
  await page.click('[data-prop="async"][data-value="on"]');
  await page.fill('#pg-filter', 'photos');
  check(
    (await page.locator('.playground .feitio-filter').getAttribute('data-state')) === 'waiting',
    'filterfield: it did not wait (debounce)',
  );
  await page.waitForTimeout(800);
  check(
    (await page.locator('.playground .feitio-filter').getAttribute('data-state')) === 'busy',
    'filterfield: it was not busy during the async search',
  );
  check(
    ((await page.locator('[data-count="pg-filter-list"]').textContent()) ?? '').includes(
      'Searching',
    ),
    'filterfield: the count did not say Searching',
  );
  await page.waitForTimeout(1300);
  check(
    (await page.locator('.playground .feitio-filter').getAttribute('data-state')) === null,
    'filterfield: it stayed busy after the results',
  );
  check(
    (await page.locator('#pg-filter-list li:not([hidden])').count()) === 1,
    'filterfield: the async results were not applied',
  );
  // Kanban: the move button lists only where the card may go; the move says so above the board.
  await page.goto(`${origin}/en/components/kanban/`);
  await page.click('#kb-en .feitio-kanban-card[data-id="k10"] .move');
  const choices = await page.locator('#kb-en-move button').allTextContents();
  check(choices.join(',') === 'Published', `kanban: the move list offered ${choices.join(',')}`);
  await page.click('#kb-en-move button');
  await page.waitForTimeout(400);
  check(
    (await page
      .locator('#kb-en .col[data-col="publicado"] .feitio-kanban-card[data-id="k10"]')
      .count()) === 1,
    'kanban: the card did not move with the button',
  );
  check(
    ((await page.locator('#kb-en .col[data-col="publicado"] .col-head .n').textContent()) ?? '') ===
      '2',
    'kanban: the count did not follow the move',
  );
  check(
    (
      (await page
        .locator('[data-demo-kanban]:has(#kb-en) > .feitio-notice strong')
        .first()
        .textContent()) ?? ''
    ).includes('Published'),
    'kanban: the notice above the board did not say where the card went',
  );
  // Dragging with the mouse: the card follows, the folder opens, and letting go moves it.
  const drag = page.locator('#kb-en .feitio-kanban-card[data-id="k11"]');
  await drag.scrollIntoViewIfNeeded();
  const from = await drag.boundingBox();
  const art = await page.locator('#kb-en .col[data-col="arte"]').boundingBox();
  if (from && art) {
    await page.mouse.move(from.x + 30, from.y + from.height - 12);
    await page.mouse.down();
    await page.mouse.move(art.x + art.width / 2, art.y + 120, { steps: 20 });
    check(
      (await page.locator('.feitio-kanban-ghost').count()) === 1,
      'kanban: the held card did not follow the hand',
    );
    check(
      (await page.locator('#kb-en .col[data-col="arte"] .slot').count()) === 1,
      'kanban: the folder did not open a place',
    );
    await page.mouse.up();
    await page.waitForTimeout(400);
    check(
      (await page
        .locator('#kb-en .col[data-col="arte"] .feitio-kanban-card[data-id="k11"]')
        .count()) === 1,
      'kanban: letting go did not move the card',
    );
  }
  // A new idea: the form takes the button's place, and saving adds the card.
  await page.click('#kb-en .col[data-col="ideia"] .add');
  await page.fill('#kb-en .col[data-col="ideia"] .draft textarea', 'A fresh idea');
  await page.click('#kb-en .col[data-col="ideia"] .draft [type="submit"]');
  check(
    (await page
      .locator('#kb-en .col[data-col="ideia"] .feitio-kanban-card[aria-label="A fresh idea"]')
      .count()) === 1,
    'kanban: the new idea did not become a card',
  );
  // On a phone the stages are tabs: one shows at a time, and the chosen one opens in view.
  await page.setViewportSize({ width: 390, height: 844 });
  {
    const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await phone.goto(`${origin}/en/components/kanban/`);
    await phone.waitForTimeout(400);
    const seen = await phone.locator('#kb-en .tabs').evaluate((row) => {
      const tab = row.querySelector('[aria-pressed="true"]') as HTMLElement;
      const r = row.getBoundingClientRect();
      const t = tab.getBoundingClientRect();
      return t.left >= r.left && t.right <= r.right;
    });
    check(seen, 'kanban: the chosen stage opened out of view in the tab row');
    await phone.close();
  }
  await page.click('#kb-en .tabs [data-col="publicado"]');
  check(
    (await page.locator('#kb-en .col[data-col="publicado"]').isVisible()) &&
      !(await page.locator('#kb-en .col[data-col="aprovado"]').isVisible()),
    'kanban: the phone tabs did not switch the stage',
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${origin}/en/components/field/`);
  await page.click('[data-prop="state"][data-value="error"]');
  check(
    (await page.locator('.playground .live input').getAttribute('aria-invalid')) === 'true',
    'field playground: the error did not mark the input',
  );
  await page.close();
}

// ScrollFade and BackToTop inside a box: the fade shows while there is more, BackToTop after half a box, and it goes back up.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${origin}/en/components/backtotop/`);
  check(
    (await page.locator('#pg-scroll .feitio-scroll-fade').getAttribute('data-visible')) !== null,
    'scrollfade: no fade while there is more below',
  );
  await page.locator('#pg-scroll').evaluate((box) => box.scrollTo({ top: box.scrollHeight }));
  await page.waitForTimeout(300);
  check(
    (await page.locator('#pg-scroll .feitio-back-to-top').getAttribute('data-visible')) !== null,
    'backtotop: it did not show after scrolling',
  );
  check(
    (await page.locator('#pg-scroll .feitio-scroll-fade').getAttribute('data-visible')) === null,
    'scrollfade: the fade stayed at the end',
  );
  await page.click('#pg-scroll .feitio-back-to-top');
  await page.waitForTimeout(900);
  check(
    (await page.locator('#pg-scroll').evaluate((box) => box.scrollTop)) === 0,
    'backtotop: it did not go back to the top',
  );
  // The content shrinks with no scroll at all: the fade leaves, since nothing is below anymore.
  await page.locator('#pg-scroll').evaluate((box) => {
    for (const child of [...box.children]) {
      if (!child.matches('.feitio-scroll-fade, .feitio-back-to-top'))
        (child as HTMLElement).style.display = 'none';
    }
  });
  await page.waitForTimeout(300);
  check(
    (await page.locator('#pg-scroll .feitio-scroll-fade').getAttribute('data-visible')) === null,
    'scrollfade: the fade stayed after the content shrank',
  );
  await page.close();
}

// Dialog and Drawer: the button opens them; the typed confirmation turns the danger action on; the Drawer opens from the chosen edge.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${origin}/en/components/dialog/`);
  await page.click('[data-prop="kind"][data-value="word"]');
  await page.click('.playground .live [data-open-dialog]');
  await page.waitForTimeout(300);
  check(
    await page.locator('#pg-dialog').evaluate((d) => (d as HTMLDialogElement).open),
    'dialog: the button did not open it',
  );
  check(
    await page.locator('#pg-dialog [data-variant="danger"]').isDisabled(),
    'dialog: the danger action was on before typing',
  );
  await page.keyboard.type('DELETE');
  check(
    await page.locator('#pg-dialog [data-variant="danger"]').isEnabled(),
    'dialog: typing the word did not turn the action on',
  );
  await page.keyboard.press('Escape');
  await page.goto(`${origin}/en/components/drawer/`);
  await page.click('[data-prop="side"][data-value="bottom"]');
  await page.click('.playground .live [popovertarget="pg-drawer"]');
  await page.waitForTimeout(500);
  check(
    await page
      .locator('#pg-drawer')
      .evaluate((d) => d.matches(':popover-open') && d.getAttribute('data-side') === 'bottom'),
    'drawer: it did not open from the bottom',
  );
  await page.close();
}

// Home, Try it: the new row slides in (the slide animation runs), and the notice lands as paper.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${origin}/en/`);
  await page.click('#try-save');
  await page.waitForTimeout(50);
  const anim = await page
    .locator('#try-list li')
    .first()
    .evaluate((li) => getComputedStyle(li).animationName);
  check(anim === 'try-slide', `home: the new row did not slide (${anim})`);
  check(await page.locator('#try-notice').isVisible(), 'home: the notice did not show');
  await page.goto(`${origin}/en/design/espaco/`);
  const bars = await page
    .locator('.ruler .bar')
    .evaluateAll((all) => all.map((b) => b.getBoundingClientRect().height));
  check(bars.length === 7 && bars.every((h) => h > 0), 'space: the ruler bars do not show');
  await page.close();
}

// No letter is cut by a border (issue #24): every bordered component that wraps a short word, with
// words that end in letters reaching past their width, by day and at night. The ink of each word
// (measured with a canvas in the page's own font) must stay at least 1px inside the inner edge of
// every border or background around it, its hand-cut corners included.
{
  const ids = Object.keys(parity).filter((id) => id.startsWith('glyph-'));
  check(ids.length > 0, 'glyphs: no glyph-* case in parity.json (build with FEITIO_PARITY=1)');
  for (const mode of ['light', 'dark'] as const) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce',
    });
    watch(page, `glyphs ${mode}`);
    page.on('console', (message) => {
      if (message.text().includes('Content Security Policy'))
        problems.push(`glyphs ${mode}: ${message.text()}`);
    });
    await page.goto(`${origin}/fixture?ids=${ids.join(',')}&mode=${mode}`);
    const results = (await page.evaluate(`(async () => {
      const inkPastBorder = ${inkPastBorder.toString()};
      await document.fonts.ready;
      const canvas = document.createElement('canvas').getContext('2d');
      const out = [];
      for (const fixture of document.querySelectorAll('.fixture')) {
        const walker = document.createTreeWalker(fixture, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const raw = node.textContent;
          const text = raw.trim();
          const element = node.parentElement;
          if (!text || element.closest('.feitio-visually-hidden')) continue;
          const style = getComputedStyle(element);
          const font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(' ');
          await document.fonts.load(font, text);
          canvas.font = font;
          const metrics = canvas.measureText(text);
          const range = document.createRange();
          const start = raw.length - raw.trimStart().length;
          range.setStart(node, start);
          range.setEnd(node, start + text.length);
          const box = range.getBoundingClientRect();
          const baseline = box.top + metrics.fontBoundingBoxAscent;
          const ink = {
            left: box.left - metrics.actualBoundingBoxLeft,
            right: box.left + metrics.actualBoundingBoxRight,
            top: baseline - metrics.actualBoundingBoxAscent,
            bottom: baseline + metrics.actualBoundingBoxDescent,
          };
          for (let around = element; around && fixture.contains(around); around = around.parentElement) {
            const s = getComputedStyle(around);
            const widths = ['Top', 'Right', 'Bottom', 'Left'].map((side) => parseFloat(s['border' + side + 'Width']));
            const painted = widths.some((w) => w > 0) || s.backgroundColor !== 'rgba(0, 0, 0, 0)';
            if (!painted) continue;
            const r = around.getBoundingClientRect();
            const inner = { left: r.left + widths[3] + 1, top: r.top + widths[0] + 1, right: r.right - widths[1] - 1, bottom: r.bottom - widths[2] - 1 };
            const radius = (corner, x, y) => {
              const [h, v = h] = s['border' + corner + 'Radius'].split(' ').map(parseFloat);
              return [Math.max(0, h - widths[x]), Math.max(0, v - widths[y])];
            };
            const past = inkPastBorder(ink, inner, {
              topLeft: radius('TopLeft', 3, 0),
              topRight: radius('TopRight', 1, 0),
              bottomRight: radius('BottomRight', 1, 2),
              bottomLeft: radius('BottomLeft', 3, 2),
            });
            if (past > 0) out.push(fixture.dataset.case + ' "' + text + '" in ' + (around.className || around.tagName) + ' by ' + past.toFixed(2) + 'px');
          }
        }
      }
      return out;
    })()`)) as string[];
    for (const result of results) problems.push(`glyphs ${mode}: ink past the border: ${result}`);
    await page.close();
  }
}

// Heatmap and Masonry under a strict CSP (no inline style): they render from their classes and
// data attributes alone. The squares stay square, at size-square on a wide screen, smaller on a
// phone, and never wider than the screen.
for (const [width, name] of [
  [1440, 'wide'],
  [390, 'phone'],
] as const) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  watch(page, `csp ${name}`);
  page.on('console', (message) => {
    if (message.text().includes('Content Security Policy'))
      problems.push(`csp ${name}: ${message.text()}`);
  });
  await page.goto(
    `${origin}/fixture?ids=heatmap,heatmap-count,masonry-min,masonry-narrow&mode=light`,
  );
  const result = (await page.evaluate(`(() => {
    const styled = document.querySelectorAll('.fixture [style]').length;
    const squares = [...document.querySelectorAll('.feitio-heatmap td[data-tone]')].map((td) => {
      const s = getComputedStyle(td, '::before');
      return [parseFloat(s.width), parseFloat(s.height)];
    });
    const sideways = document.documentElement.scrollWidth > innerWidth;
    const columns = getComputedStyle(document.querySelector('.feitio-masonry[data-min="wide"]')).columnWidth;
    return { styled, squares, sideways, columns };
  })()`)) as { styled: number; squares: number[][]; sideways: boolean; columns: string };
  check(result.styled === 0, `csp ${name}: ${result.styled} element(s) with a style attribute`);
  check(result.squares.length > 0, `csp ${name}: the Heatmap drew no squares`);
  for (const [w, h] of result.squares) {
    check(
      Math.abs((w ?? 0) - (h ?? 0)) < 0.5 && (w ?? 0) > 4,
      `csp ${name}: a square is ${w}×${h}`,
    );
    if (name === 'wide')
      check(Math.abs((w ?? 0) - 16) < 0.5, `csp ${name}: a square is ${w}px, not 16`);
  }
  check(!result.sideways, `csp ${name}: sideways scroll`);
  check(
    result.columns === '320px',
    `csp ${name}: data-min="wide" gives columns of ${result.columns}`,
  );
  await page.close();
}

// No inline style anywhere a component renders (consumers serve `style-src 'self'`): not in any
// component's HTML (every parity case, Astro side, which React matches), and nowhere on any
// component page in any language, playground combinations included. The one exception is the
// legacy Grid length, in its parity case only.
{
  const allowed = new Set(INLINE_STYLE_ALLOWED);
  for (const [id, html] of Object.entries(parity))
    if (!allowed.has(id) && /\sstyle=/.test(html))
      problems.push(`inline style: the ${id} case renders a style attribute`);
  for (const lang of LOCALES)
    for (const draft of drafts) {
      const html = await readFile(join(dist, lang, 'components', draft.slug, 'index.html'), 'utf8');
      const { document } = parseHTML(html);
      for (const element of document.querySelectorAll('[style]'))
        problems.push(
          `inline style: ${lang}/${draft.slug}: <${element.tagName.toLowerCase()} class="${element.getAttribute('class') ?? ''}" style="${element.getAttribute('style')}">`,
        );
      const combos = [...document.querySelectorAll('[data-combos]')].map(
        (n) => n.textContent ?? '',
      );
      if (combos.some((json) => /\sstyle=/.test(json)))
        problems.push(`inline style: ${lang}/${draft.slug}: a playground combination`);
    }
}

// Anchor: a click scrolls the box smoothly to the section, writes the hash, moves the focus there
// and marks the link; scrolling the box marks the section in view. With reduced motion, at once.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page, 'anchor');
  await page.goto(`${origin}/en/components/anchor/`);
  const demo = page.locator('.anchor-demo');
  const box = demo.locator('.anchor-demo-box');
  await demo.scrollIntoViewIfNeeded();
  check(
    (await demo.locator('a[aria-current="location"]').getAttribute('href')) === '#demo-water',
    'anchor: on load the first section is not the current one',
  );
  // Sample the box's scroll on every frame while it travels: smooth means positions in between.
  const samples = box.evaluate(
    (b) =>
      new Promise<number[]>((resolve) => {
        const seen: number[] = [];
        const start = performance.now();
        const frame = (): void => {
          seen.push(b.scrollTop);
          if (performance.now() - start < 1500) requestAnimationFrame(frame);
          else resolve(seen);
        };
        requestAnimationFrame(frame);
      }),
  );
  await demo.locator('a[href="#demo-soil"]').click();
  const seen = await samples;
  const landed = await box.evaluate((b) => {
    const target = b.querySelector('#demo-soil') as HTMLElement;
    return target.getBoundingClientRect().top - b.getBoundingClientRect().top;
  });
  const end = await box.evaluate((b) => b.scrollTop);
  check(
    seen.some((top) => top > 0 && top < end - 1),
    `anchor: the scroll did not travel smoothly (${[...new Set(seen.map(Math.round))].join(', ')})`,
  );
  check(Math.abs(landed - 16) < 4, `anchor: the section landed ${landed}px from the box's top`);
  check(
    new URL(page.url()).hash === '#demo-soil',
    `anchor: the hash is "${new URL(page.url()).hash}"`,
  );
  check(
    (await page.evaluate(() => document.activeElement?.id)) === 'demo-soil',
    'anchor: the focus did not move to the section',
  );
  check(
    (await demo.locator('a[aria-current="location"]').getAttribute('href')) === '#demo-soil',
    'anchor: the clicked section is not the current one',
  );
  await box.evaluate((b) => {
    const target = b.querySelector('#demo-light') as HTMLElement;
    b.scrollTop += target.getBoundingClientRect().top - b.getBoundingClientRect().top;
  });
  await page.waitForTimeout(300);
  check(
    (await demo.locator('a[aria-current="location"]').getAttribute('href')) === '#demo-light',
    'anchor: scrolling the box did not mark the section in view',
  );
  // The page's own index follows the window's scroll too.
  await page.evaluate(() => {
    const target = document.getElementById('a11y') as HTMLElement;
    window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 20);
  });
  await page.waitForTimeout(400);
  check(
    (await page.locator('.site-toc a[aria-current="location"]').getAttribute('href')) === '#a11y',
    'anchor: the page index does not follow the window',
  );
  await page.close();
  const still = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  await still.goto(`${origin}/en/components/anchor/`);
  const stillBox = still.locator('.anchor-demo-box');
  await still.locator('.anchor-demo a[href="#demo-pruning"]').click();
  const atOnce = await stillBox.evaluate((b) => b.scrollTop);
  await still.waitForTimeout(800);
  const later = await stillBox.evaluate((b) => b.scrollTop);
  check(
    atOnce > 0 && atOnce === later,
    `anchor: with reduced motion the scroll is not instant (${atOnce}, then ${later})`,
  );
  await still.close();
}

// A page arrives still and then moves (settle()): marked while it loads, so nothing transitions as its fonts,
// theme and container queries settle; the mark gone once it has painted, so its transitions are back.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page, 'arrival');
  await page.goto(`${origin}/en/components/tag/`);
  await page.waitForTimeout(400);
  const after = (await page.evaluate(`({
    marked: document.documentElement.hasAttribute('data-feitio-arriving'),
    moves: getComputedStyle(document.querySelector('.site-main h1')).transitionDuration !== '0s',
  })`)) as { marked: boolean; moves: boolean };
  check(!after.marked, 'arrival: the page is still marked as arriving after it loaded');
  check(after.moves, 'arrival: the page has no transitions after it settled');
  const html = await (await fetch(`${origin}/en/components/tag/`)).text();
  check(
    /<html[^>]*data-feitio-arriving/.test(html),
    'arrival: the page is not marked as arriving when it is served',
  );
  await page.close();
}

// Every component of the navigation has its card on the Components page, in every language: the cards are written
// apart from the navigation, and five once went missing.
for (const lang of ['pt', 'en', 'es', 'fr', 'de']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page, `component cards ${lang}`);
  await page.goto(`${origin}/${lang}/components/`);
  const missing = (await page.evaluate(`(() => {
    const slug = (href) => (href.match(/\\/components\\/([a-z-]+)\\//) || [])[1];
    const cards = new Set([...document.querySelectorAll('.comp-card')].map((a) => slug(a.getAttribute('href'))));
    const nav = [...document.querySelectorAll('a[href*="/components/"]')]
      .filter((a) => !a.closest('.comp-card'))
      .map((a) => slug(a.getAttribute('href')))
      .filter((s) => s && s !== 'docpage');
    return [...new Set(nav)].filter((s) => !cards.has(s));
  })()`)) as string[];
  check(
    missing.length === 0,
    `component cards ${lang}: no card on the Components page for ${missing.join(', ')}`,
  );
  const counted = (await page.evaluate(`(() => {
    const cards = document.querySelectorAll('.comp-card').length;
    const said = (document.querySelector('.site-main p')?.textContent.match(/\\d+/) || [])[0];
    return { cards, said: Number(said) };
  })()`)) as { cards: number; said: number };
  check(
    counted.said === counted.cards,
    `component cards ${lang}: the page says ${counted.said} components and shows ${counted.cards}`,
  );
  await page.close();
}

// A Skeleton's lines beside a circle in an Inline stay beside it, with room, on a phone: a min() with 100% once
// shrank them and dropped them below the circle.
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  watch(page, 'skeleton beside');
  await page.goto(`${origin}/en/components/skeleton/`);
  const row = (await page.evaluate(`(() => {
    const live = [...document.querySelectorAll('.feitio-example .live')].find((l) => l.querySelector('.feitio-skeleton[data-shape="circle"]'));
    const circle = live.querySelector('.feitio-skeleton[data-shape="circle"]').getBoundingClientRect();
    const lines = live.querySelector('.feitio-skeleton[data-shape="text"]').getBoundingClientRect();
    return { beside: lines.top < circle.bottom && lines.left >= circle.right, width: lines.width };
  })()`)) as { beside: boolean; width: number };
  check(row.beside, 'skeleton beside: the lines fell below the circle');
  check(row.width >= 150, `skeleton beside: the lines are ${row.width}px wide beside the circle`);
  await page.close();
}

// A filterable item clips to slide shut, with room for what its card casts: the lifted card's shadow on hover
// once lost its bottom-right corner to the clip.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page, 'card shadow');
  await page.goto(`${origin}/en/components/`);
  const before = (await page.evaluate(
    `getComputedStyle(document.querySelector('[data-search]')).overflow`,
  )) as string;
  check(
    before === 'visible',
    `card shadow: before any filter a card's item clips (overflow ${before})`,
  );
  await page.locator('.feitio-filter input').first().fill('button');
  await page.waitForTimeout(400);
  const room = (await page.evaluate(
    `parseFloat(getComputedStyle(document.querySelector('[data-search]:not([hidden])')).overflowClipMargin) || 0`,
  )) as number;
  check(
    room >= 8,
    `card shadow: after a filter a shown item clips with ${room}px of room, too little for a lifted card's shadow`,
  );
  await page.close();
}

// The site's search: "/" opens it, and a word finds this page's sections and other pages (Pagefind), with no
// error on the page (a missing variable once left it empty).
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page, 'search');
  await page.goto(`${origin}/en/components/tag/`);
  await page.evaluate('document.activeElement?.blur()');
  await page.keyboard.press('/');
  await page.waitForTimeout(300);
  check(
    (await page.evaluate('document.getElementById("busca")?.open === true')) as boolean,
    'search: "/" did not open it',
  );
  await page.keyboard.type('button');
  await page.waitForTimeout(1500);
  const found = (await page.evaluate(
    'document.querySelectorAll("#busca .results li").length',
  )) as number;
  check(found > 0, 'search: "button" found nothing');
  await page.close();
}

// AppShell on a wide screen: the navigation column stays put while a long page scrolls.
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  watch(page, 'app shell');
  await page.goto(`${origin}/fixture?ids=app-shell&mode=light`);
  await page.evaluate(`(() => {
    const app = document.querySelector('.feitio-app');
    const frame = document.createElement('div');
    frame.className = 'feitio-app-frame';
    app.before(frame);
    frame.append(app);
    const main = app.querySelector('.feitio-app-main');
    for (let i = 0; i < 200; i += 1) {
      const p = document.createElement('p');
      p.textContent = 'A long page, line ' + (i + 1);
      main.append(p);
    }
    window.scrollTo(0, 2000);
  })()`);
  await page.waitForTimeout(200);
  const nav = (await page.evaluate(`(() => {
    const link = document.querySelector('.feitio-app-nav a').getBoundingClientRect();
    return { top: link.top, bottom: link.bottom, width: link.width, scrolled: window.scrollY };
  })()`)) as { top: number; bottom: number; width: number; scrolled: number };
  check(nav.width > 0, 'app shell: the navigation column is not shown at 1440px');
  check(nav.scrolled >= 2000, `app shell: the page scrolled only ${nav.scrolled}px`);
  check(
    nav.top >= 0 && nav.bottom <= 900,
    `app shell: after scrolling 2000px the nav's first link is at ${nav.top}px, out of view`,
  );
  await page.close();
}

// AppShell on a wide screen with a short page (#34): it fills the window and no more, so nothing scrolls and its
// ScrollFade stays hidden; the navigation column's line reaches the window's bottom.
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  watch(page, 'app shell short');
  await page.goto(`${origin}/fixture?ids=app-shell&mode=light`);
  await page.evaluate(`(() => {
    const app = document.querySelector('.feitio-app');
    const frame = document.createElement('div');
    frame.className = 'feitio-app-frame';
    app.before(frame);
    frame.append(app);
    // The fixture's own spacing is not the shell's: the shell alone fills the window.
    document.body.style.padding = '0';
    document.querySelector('.fixture').style.margin = '0';
  })()`);
  await page.waitForTimeout(200);
  const short = (await page.evaluate(`(() => {
    const nav = document.querySelector('.feitio-app-nav').getBoundingClientRect();
    const fade = document.querySelector('.feitio-scroll-fade');
    return {
      height: document.documentElement.scrollHeight,
      window: document.documentElement.clientHeight,
      navBottom: nav.bottom,
      fade: fade ? fade.hasAttribute('data-visible') : false,
    };
  })()`)) as { height: number; window: number; navBottom: number; fade: boolean };
  check(
    short.height <= short.window,
    `app shell: a short page is ${short.height}px tall in a ${short.window}px window, so it scrolls`,
  );
  check(!short.fade, 'app shell: a short page shows its ScrollFade');
  check(
    Math.abs(short.navBottom - short.window) < 2,
    `app shell: the navigation column ends at ${short.navBottom}px, not at the window's bottom (${short.window}px)`,
  );
  // More links than the window holds: the column scrolls on its own and the page still does not.
  await page.evaluate(`(() => {
    const list = document.querySelector('.feitio-app-nav .drawer-body ul, .feitio-app-nav .drawer-body ol');
    const item = list.lastElementChild;
    for (let i = 0; i < 40; i++) list.append(item.cloneNode(true));
  })()`);
  await page.waitForTimeout(200);
  const long = (await page.evaluate(`({
    height: document.documentElement.scrollHeight,
    window: document.documentElement.clientHeight,
    navBottom: document.querySelector('.feitio-app-nav').getBoundingClientRect().bottom,
  })`)) as { height: number; window: number; navBottom: number };
  check(
    long.height <= long.window,
    `app shell: with a long navigation a short page is ${long.height}px tall in a ${long.window}px window, so it scrolls`,
  );
  check(
    Math.abs(long.navBottom - long.window) < 2,
    `app shell: with a long navigation the column ends at ${long.navBottom}px, not at the window's bottom (${long.window}px)`,
  );
  await page.close();
}

// A sticky Anchor that fits hands the wheel to the page (#35): over it, on a long page, the window scrolls.
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  watch(page, 'anchor wheel');
  await page.goto(`${origin}/fixture?ids=anchor-sticky&mode=light`);
  await page.evaluate(`(() => {
    for (let i = 0; i < 200; i += 1) {
      const p = document.createElement('p');
      p.textContent = 'A long page, line ' + (i + 1);
      document.body.append(p);
    }
  })()`);
  await page.locator('.feitio-anchor[data-sticky]').hover();
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(400);
  const scrolled = (await page.evaluate('window.scrollY')) as number;
  check(scrolled > 0, 'anchor: the wheel over a sticky Anchor that fits did not scroll the page');
  await page.close();
}

// Masonry's max: on a 2560px screen, six narrow blocks would make more than three columns; with
// data-max="3" they make at most three, from the class alone (the page forbids inline styles).
{
  const page = await browser.newPage({
    viewport: { width: 2560, height: 1200 },
    reducedMotion: 'reduce',
  });
  watch(page, 'masonry max');
  await page.goto(`${origin}/fixture?ids=masonry-max,masonry-uncapped&mode=light`);
  // Each Masonry gets six Blocks of different heights, built in the page (no style attribute).
  await page.evaluate(`(() => {
    for (const masonry of document.querySelectorAll('.feitio-masonry')) {
      masonry.replaceChildren(...[3, 1, 4, 2, 5, 1].map((lines) => {
        const block = document.createElement('div');
        block.className = 'feitio-block';
        for (let i = 0; i < lines; i += 1) block.append(document.createElement('p'), 'Line');
        return block;
      }));
    }
  })()`);
  const columns =
    (await page.evaluate(`(() => [...document.querySelectorAll('.feitio-masonry')].map(
    (m) => new Set([...m.children].map((c) => Math.round(c.getBoundingClientRect().left))).size,
  ))()`)) as number[];
  const [capped = 0, uncapped = 0] = columns;
  check(capped > 1 && capped <= 3, `masonry max: data-max="3" makes ${capped} column(s) at 2560px`);
  check(
    uncapped > 3,
    `masonry max: without data-max, ${uncapped} column(s) at 2560px (expected more than 3)`,
  );
  await page.close();
}

// Heatmap: a named table; every square says its title and its level; the legend has the words.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${origin}/en/components/heatmap/`);
  const weeks = page.locator('#ex-hm-weeks');
  check(
    (await weeks.getByRole('table', { name: 'Last 13 weeks, one square a day' }).count()) === 1,
    'heatmap: the weeks table has no accessible name',
  );
  check(
    (await weeks.locator('td[data-tone]').count()) === 91,
    'heatmap: 13 weeks by 7 days is not 91 squares',
  );
  check(
    (await weeks.getByRole('cell', { name: 'Nov 22, 2026, Down' }).count()) === 1,
    'heatmap: the last square does not say its title and level',
  );
  check(
    (await weeks.locator('thead th[scope="col"]').allTextContents()).join(' ') === 'Sep Oct Nov',
    'heatmap: the month labels are not Sep Oct Nov',
  );
  check(
    (await weeks.locator('tbody th[scope="row"]').count()) === 4,
    'heatmap: not every other weekday is labelled',
  );
  check(
    (await page.locator('#ex-hm-hours thead th[scope="col"]').allTextContents()).join(' ') ===
      '00h 06h 12h 18h',
    'heatmap: the hours are not labelled every 6 hours',
  );
  check(
    (await weeks.locator('.legend li').allTextContents()).join('|') ===
      'All answered|Some missed|Down|No data',
    'heatmap: the legend does not give every level its words',
  );
  check(
    (await page.locator('.feitio-heatmap[style], .feitio-heatmap [style]').count()) === 0,
    'heatmap: an inline style in the rendered HTML',
  );
  await page.close();
}

// Masonry: columns on a wide screen, one on a phone; no block split between columns; no inline style.
for (const [width, name] of [
  [1440, 'wide'],
  [390, 'phone'],
] as const) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`${origin}/en/components/masonry/`);
  const layout = (await page.evaluate(`(() => {
    const masonry = document.querySelector('.feitio-example .feitio-masonry');
    const children = [...masonry.children];
    return {
      columns: new Set(children.map((c) => Math.round(c.getBoundingClientRect().left))).size,
      split: children.filter((c) => c.getClientRects().length > 1).length,
      styled: document.querySelectorAll('.feitio-masonry[style], .feitio-masonry [style]').length,
    };
  })()`)) as { columns: number; split: number; styled: number };
  check(
    name === 'wide' ? layout.columns > 1 : layout.columns === 1,
    `masonry ${name}: ${layout.columns} column(s)`,
  );
  check(layout.split === 0, `masonry ${name}: ${layout.split} block(s) split between columns`);
  check(layout.styled === 0, `masonry ${name}: an inline style in the rendered HTML`);
  await page.close();
}

// For agents: every page has its Markdown, every language its llms.txt and llms-full.txt, and the root llms.txt lists them.
{
  const root = await readFile(join(dist, 'llms.txt'), 'utf8').catch(() => '');
  check(
    LOCALES.every((l) => root.includes(`${l}/llms.txt`)),
    'llms.txt: the root does not list every language',
  );
  for (const lang of LOCALES) {
    const index = await readFile(join(dist, lang, 'llms.txt'), 'utf8').catch(() => '');
    check(index.includes('index.md'), `llms.txt: ${lang} lists no page`);
    const full = await readFile(join(dist, lang, 'llms-full.txt'), 'utf8').catch(() => '');
    check(full.length > 50000, `llms-full.txt: ${lang} is too short`);
    for (const path of PAGES) {
      const md = await readFile(join(dist, lang, path, 'index.md'), 'utf8').catch(() => '');
      check(md.startsWith('# '), `markdown: ${lang}/${path} has no Markdown copy`);
    }
  }
}

await browser.close();
server.stop();
if (problems.length) {
  console.error(
    `The docs site has ${problems.length} problem(s):\n${problems.map((p) => `- ${p}`).join('\n')}`,
  );
  process.exit(1);
}
console.log(`The docs site passed. Screenshots in ${shots}`);
