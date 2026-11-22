/**
 * The documentation site in a real browser, as a person uses it. For every page in every language:
 * no broken request or script error, no axe violation by day and at night, no sideways scroll on a
 * phone. Then each component's behavior: the playground, the Notice's close and time, the language
 * Menu with the keyboard. Screenshots go to tests/screenshots/ for a human to look at.
 * Run with `bun run test:docs` (it builds the site first).
 */
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseHTML } from 'linkedom';
import { chromium, type Page } from 'playwright';
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
.fixture:has(.feitio-heatmap, .feitio-masonry) { display: block; }`;

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

async function axe(page: Page, state: string): Promise<void> {
  await page.addScriptTag({ content: axeSource });
  const results = (await page.evaluate('axe.run(document)')) as AxeResults;
  for (const violation of results.violations) {
    const where = violation.nodes.map((node) => node.target.join(' ')).join(', ');
    problems.push(`${state}: ${violation.id} (${violation.help}) at ${where}`);
  }
}

function watch(page: Page, state: string): void {
  page.on('pageerror', (error) => problems.push(`${state}: script error: ${error.message}`));
  page.on('requestfailed', (request) => problems.push(`${state}: failed request ${request.url()}`));
  // Nothing goes to anyone else: no fonts, scripts or images from another site (privacy).
  page.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith(origin) && !url.startsWith('data:'))
      problems.push(`${state}: request to another site ${url}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && response.url().startsWith(origin))
      problems.push(`${state}: ${response.status()} ${response.url()}`);
  });
}

await mkdir(shots, { recursive: true });
const browser = await chromium.launch();

// Every page, every language: day, night, and a phone. ONLY=behavior skips this, to run the rest quickly.
// It takes minutes and prints its progress, so a run in CI never looks stuck.
const pageLangs = process.env.ONLY === 'behavior' ? [] : LOCALES;
const pageTotal = pageLangs.length * PAGES.length;
let pageDone = 0;
if (pageTotal)
  console.log(
    `Pages: ${pageTotal} (${PAGES.length} in ${pageLangs.length} languages), day, night and phone`,
  );
for (const lang of pageLangs) {
  for (const path of PAGES) {
    const name = `${lang}-${path.replaceAll('/', '-').replace(/-$/, '') || 'home'}`;
    for (const mode of ['light', 'dark'] as const) {
      const page = await browser.newPage({
        viewport: { width: 1440, height: 900 },
        colorScheme: mode,
      });
      watch(page, `${name} ${mode}`);
      await page.goto(`${origin}/${lang}/${path}`);
      await page.waitForTimeout(400);
      await axe(page, `${name} ${mode}`);
      if (lang === 'pt')
        await page.screenshot({ path: join(shots, `${name}-${mode}.png`), fullPage: true });
      await page.close();
    }
    const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await phone.goto(`${origin}/${lang}/${path}`);
    const sideways = await phone.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    check(!sideways, `${name} phone: sideways scroll`);
    if (lang === 'pt')
      await phone.screenshot({ path: join(shots, `${name}-phone.png`), fullPage: true });
    await phone.close();
    pageDone += 1;
    if (pageDone % 25 === 0 || pageDone === pageTotal)
      console.log(`Pages: ${pageDone} of ${pageTotal}, ${problems.length} problem(s) so far`);
  }
}
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
