/**
 * Compares the React port with the Astro components: renders every parity case in React and checks
 * its HTML against what Astro rendered (apps/docs/dist/parity.json, built with FEITIO_PARITY=1).
 * Attribute order, whitespace between tags and React's empty boolean values do not count.
 */
import { Window } from 'happy-dom';
import { createElement, type FunctionComponent, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as Feitio from '../src/index.ts';
import { cases } from './cases.ts';

const astroFile = new URL('../../../apps/docs/dist/parity.json', import.meta.url).pathname;
const astro = (await Bun.file(astroFile).json()) as Record<string, string>;
const window = new Window();

function canonicalStyle(style: string): string {
  return style
    .split(';')
    .map((rule) => rule.trim().replace(/\s*:\s*/, ':'))
    .filter(Boolean)
    .join(';');
}

function canonical(node: Node, inPre = false): string {
  if (node.nodeType === 3) {
    const text = node.textContent ?? '';
    if (!inPre && text.trim() === '') return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }
  if (node.nodeType !== 1) return '';
  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  const attributes = [...element.attributes]
    .map(
      (a) =>
        [a.name.toLowerCase(), a.name === 'style' ? canonicalStyle(a.value) : a.value] as const,
    )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => ` ${name}="${value}"`)
    .join('');
  const pre = inPre || tag === 'pre';
  const children = [...(tag === 'template' ? [] : element.childNodes)]
    .map((child) => canonical(child as unknown as Node, pre))
    .join('');
  return `<${tag}${attributes}>${children}</${tag}>`;
}

function normalize(html: string): string {
  const box = window.document.createElement('div');
  box.innerHTML = html;
  return [...box.childNodes].map((n) => canonical(n as unknown as Node)).join('');
}

const components = Feitio as unknown as Record<string, FunctionComponent<Record<string, unknown>>>;
let failed = 0;
for (const c of cases) {
  const component = components[c.component];
  const expected = astro[c.id];
  if (!component || expected === undefined) {
    console.error(
      `✗ ${c.id}: ${component ? 'missing from parity.json (rebuild it)' : `no React ${c.component}`}`,
    );
    failed += 1;
    continue;
  }
  const { default: children, ...named } = c.slots ?? {};
  const props: Record<string, unknown> = { ...c.props, ...named, ...c.react };
  if ('class' in props) {
    props.className = props.class;
    delete props.class;
  }
  const react = renderToStaticMarkup(createElement(component, props, children as ReactNode));
  const a = normalize(expected);
  const r = normalize(react);
  if (a === r) continue;
  failed += 1;
  let at = 0;
  while (a[at] === r[at]) at += 1;
  console.error(`✗ ${c.id} (${c.component}) differs at ${at}:`);
  console.error(`  astro: …${a.slice(Math.max(0, at - 80), at + 120)}`);
  console.error(`  react: …${r.slice(Math.max(0, at - 80), at + 120)}`);
}
const components_ = new Set(cases.map((c) => c.component));
const untested = Object.keys(Feitio).filter(
  (name) => /^[A-Z]/.test(name) && name !== 'FeitioProvider' && !components_.has(name),
);
if (untested.length) {
  console.error(`✗ components without a parity case: ${untested.join(', ')}`);
  failed += 1;
}
console.log(failed ? `${failed} parity problem(s)` : `${cases.length} cases: React matches Astro`);
await window.happyDOM.close();
process.exit(failed ? 1 : 0);
