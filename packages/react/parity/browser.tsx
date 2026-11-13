/**
 * The React port in a real browser: the page is rendered on the server, hydrated (with no mismatch),
 * and each behavior the hooks wire is driven as a person would: the Menu with the keyboard, the
 * Switch's words, the SegmentedControl, AM/PM, a Notice closing and shown from code, the Dialog's
 * typed word, the FilterField and a StatusOverlay driven by state.
 */
import { join } from 'node:path';
import { chromium } from 'playwright';
import { renderToString } from 'react-dom/server';
import { App } from './app.tsx';

const core = join(import.meta.dir, '..', '..', 'core');
const built = await Bun.build({
  entrypoints: [join(import.meta.dir, 'client.tsx')],
  target: 'browser',
});
if (!built.success) throw new Error(built.logs.join('\n'));
const script = await built.outputs[0]?.text();
const html = `<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Feitio React</title>
<link rel="stylesheet" href="/feitio/css/feitio.css"></head>
<body><div id="app">${renderToString(<App />)}</div><script type="module" src="/client.js"></script></body></html>`;

const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const path = new URL(request.url).pathname;
    if (path === '/') return new Response(html, { headers: { 'content-type': 'text/html' } });
    if (path === '/client.js')
      return new Response(script, { headers: { 'content-type': 'text/javascript' } });
    const file = Bun.file(join(core, path.replace(/^\/feitio\//, '')));
    return (await file.exists()) ? new Response(file) : new Response('not found', { status: 404 });
  },
});

const problems: string[] = [];
function check(condition: boolean, what: string): void {
  if (!condition) problems.push(what);
}

const browser = await chromium.launch(
  process.env.SHOT_BROWSER ? { executablePath: process.env.SHOT_BROWSER } : {},
);
const page = await browser.newPage();
page.on('pageerror', (error) => problems.push(`script error: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') problems.push(`console: ${message.text()}`);
});
await page.goto(`http://localhost:${server.port}/`);
await page.waitForTimeout(300);
const hydration = await page.evaluate(
  () => (window as Window & { hydrationErrors?: string[] }).hydrationErrors ?? [],
);
check(hydration.length === 0, `hydration: ${hydration.join(' | ')}`);

// Menu: opens on click, the current item takes the focus, the arrows move it.
await page.click('.feitio-menu > button');
await page.waitForTimeout(100);
check(
  (await page.getAttribute('.feitio-menu > button', 'aria-expanded')) === 'true',
  'Menu: aria-expanded',
);
check(
  (await page.evaluate(() => document.activeElement?.textContent)) === 'Português',
  'Menu: focus on the current item',
);
await page.keyboard.press('ArrowDown');
check(
  (await page.evaluate(() => document.activeElement?.textContent)) === 'English',
  'Menu: ArrowDown moves the focus',
);
await page.keyboard.press('Escape');

// Switch: says its state in words.
await page.click('.feitio-switch input');
check((await page.textContent('.feitio-switch .state')) === 'Ligado', 'Switch: says Ligado');

// SegmentedControl: marks the choice, and onChange reaches React state.
await page.click('.feitio-segmented button:nth-child(2)');
check(
  (await page.getAttribute('.feitio-segmented button:nth-child(2)', 'aria-pressed')) === 'true',
  'SegmentedControl: aria-pressed',
);
check((await page.textContent('#view')) === 'Grade', 'SegmentedControl: onChange');

// TimeInput: AM/PM swaps.
await page.click('.feitio-time-field .period');
check((await page.textContent('.feitio-time-field .period')) === 'PM', 'TimeInput: AM becomes PM');

// Notice: the close button closes it; useNotices().show brings a hidden one in.
await page.click('#closable .close');
await page.waitForTimeout(900);
check(
  await page.evaluate(() => document.getElementById('closable')?.hidden === true),
  'Notice: closes',
);
await page.click('#show');
await page.waitForTimeout(200);
check(
  await page.evaluate(() => document.getElementById('saved')?.hidden === false),
  'Notice: show()',
);

// Dialog: the opener opens it, and the danger button waits for the typed word.
await page.click('[data-open-dialog="erase"]');
check(
  await page.evaluate(() => (document.getElementById('erase') as HTMLDialogElement).open),
  'Dialog: opens',
);
const danger = '#erase [data-variant="danger"]';
check(await page.isDisabled(danger), 'Dialog: danger starts off');
await page.fill('#erase-word', 'APAGAR');
check(!(await page.isDisabled(danger)), 'Dialog: the word turns it on');
await page.click('#erase [value="cancel"]');

// FilterField: filters the list and counts what is left.
await page.fill('#filter', 'ma');
await page.waitForTimeout(100);
check(
  (await page.evaluate(
    () =>
      [...document.querySelectorAll('#fruits li')].filter((li) => !(li as HTMLElement).hidden)
        .length,
  )) === 2,
  'FilterField: filters',
);
check((await page.textContent('[data-count="fruits"]')) === '2 / 3', 'FilterField: counts');

// StatusOverlay: driven by React state.
await page.click('#save');
check(
  (await page.getAttribute('.feitio-status-host', 'data-state')) === 'ok',
  'StatusOverlay: state',
);
check((await page.textContent('.feitio-status .label')) === 'Salvo', 'StatusOverlay: label');

await browser.close();
server.stop();
if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join('\n'));
  process.exit(1);
}
console.log('React in the browser: hydration and every behavior work');
