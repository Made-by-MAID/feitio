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
const PAGES = [
  'components/button/',
  'components/notice/',
  ...[
    'link',
    'linkcard',
    'heading',
    'text',
    'icon',
    'block',
    'visually-hidden',
    'skiplink',
    'divider',
    'kbd',
  ].map((s) => `components/${s}/`),
];

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

// Every page, every language: day, night, and a phone.
for (const lang of LOCALES) {
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
  await page.click('#n-close .close');
  await page.waitForTimeout(700);
  check(await page.locator('#n-close').isHidden(), 'notice: the close button did not close it');
  await page.click('[data-notice-again="n-close"]');
  check(await page.locator('#n-close').isVisible(), 'notice: show again did not bring it back');
  await page.locator('#n-time').scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(9000);
  check(await page.locator('#n-time').isHidden(), 'notice: the timed notice did not go away');
  await page.click('[data-notice-again="n-time"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => document.getElementById('n-time')?.classList.remove('feitio-place'));
  await page.click('[data-notice-again="n-time"]');
  const placedAgain = await page
    .locator('#n-time')
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

await browser.close();
server.stop();
if (problems.length) {
  console.error(
    `The docs site has ${problems.length} problem(s):\n${problems.map((p) => `- ${p}`).join('\n')}`,
  );
  process.exit(1);
}
console.log(`The docs site passed. Screenshots in ${shots}`);
