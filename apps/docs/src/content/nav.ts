import type { Locale } from '../i18n/ui.ts';
import type { NavGroup } from '../layouts/DocPage.astro';
import { COMPONENTS } from './components/index.ts';
import { GROUPS } from './components/types.ts';

/** The Components area's side navigation: the groups in order, each with its pages. */
export function componentsNav(lang: Locale, base: string, current: string): NavGroup[] {
  return GROUPS.map(([key, title]) => ({
    title: title[lang],
    items: COMPONENTS.filter((c) => c.group === key).map((c) => ({
      text: c.name,
      href: `${base}${lang}/components/${c.slug}/`,
      current: c.name === current,
    })),
  })).filter((g) => g.items.length > 0);
}
