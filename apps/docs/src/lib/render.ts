import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

let container: AstroContainer | undefined;

/**
 * The HTML a Feitio component renders, as text: the live example and its "Show code" both come from
 * it, so the code shown is always what runs. Astro's own data-astro attributes and scripts are left out.
 */
export async function renderHtml(
  component: AstroComponentFactory,
  props: Record<string, unknown> = {},
  slot = '',
): Promise<string> {
  container ??= await AstroContainer.create();
  const html = await container.renderToString(component, {
    props,
    slots: slot ? { default: slot } : {},
  });
  return html
    .replace(/<script\b[\s\S]*?<\/script>/g, '')
    .replace(/\s+data-astro-[\w-]+(="[^"]*")?/g, '')
    .trim();
}
