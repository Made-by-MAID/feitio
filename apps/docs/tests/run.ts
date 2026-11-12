/**
 * The documentation site in a real browser, as a person uses it. For every page in every language:
 * no broken request or script error, no axe violation by day and at night, no sideways scroll on a
 * phone. Then each component's behavior: the playground, the Notice's close and time, the language
 * Menu with the keyboard. Screenshots go to tests/screenshots/ for a human to look at.
 * Run with `bun run test:docs` (it builds the site first).
 */
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium, type Page } from 'playwright';

type AxeResults = { violations: { id: string; help: string; nodes: { target: string[] }[] }[] };

const repo = join(import.meta.dir, '..', '..', '..');
const dist = join(import.meta.dir, '..', 'dist');
const shots = join(import.meta.dir, 'screenshots');
const axeSource = await readFile(join(repo, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const LOCALES = ['pt', 'en', 'es', 'fr', 'de'];
const drafts = JSON.parse(
  await readFile(join(import.meta.dir, '..', 'src', 'content', 'drafts.json'), 'utf8'),
) as { slug: string }[];
const PAGES = drafts
  .map((d) => `components/${d.slug}/`)
  .filter(
    (p) => !process.env.PAGES || process.env.PAGES.split(',').some((only) => p.includes(only)),
  );

const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const path = decodeURIComponent(new URL(request.url).pathname);
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
  page.on('requestfailed', (request) => {
    // Google Fonts may be unreachable where the tests run; everything of ours must load.
    if (!request.url().includes('fonts.g'))
      problems.push(`${state}: failed request ${request.url()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && response.url().startsWith(origin))
      problems.push(`${state}: ${response.status()} ${response.url()}`);
  });
}

await mkdir(shots, { recursive: true });
const browser = await chromium.launch();

// Every page, every language: day, night, and a phone. ONLY=behavior skips this, to run the rest quickly.
for (const lang of process.env.ONLY === 'behavior' ? [] : LOCALES) {
  for (const path of PAGES) {
    const name = `${lang}-${path.replaceAll('/', '-').replace(/-$/, '')}`;
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
  }
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
  await page.close();
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
