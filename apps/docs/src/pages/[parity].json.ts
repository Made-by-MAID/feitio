import type { APIRoute } from 'astro';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { cases } from '../../../../packages/react/parity/cases.ts';
import { renderHtml } from '../lib/render.ts';

/**
 * The parity file: every case of packages/react/parity rendered by the Astro component, for the React
 * port to be compared against (bun run test:parity). Built only when FEITIO_PARITY is set, so the
 * published site does not carry it.
 */
const components = import.meta.glob<{ default: AstroComponentFactory }>(
  '../../../../packages/astro/src/*.astro',
  { eager: true },
);

export function getStaticPaths(): { params: { parity: string } }[] {
  return process.env.FEITIO_PARITY ? [{ params: { parity: 'parity' } }] : [];
}

export const GET: APIRoute = async () => {
  const html: Record<string, string> = {};
  for (const c of cases) {
    const component = components[`../../../../packages/astro/src/${c.component}.astro`];
    if (!component) throw new Error(`No Astro component named ${c.component}`);
    html[c.id] = await renderHtml(component.default, c.props, c.slots ?? {});
  }
  return new Response(JSON.stringify(html, null, 2));
};
