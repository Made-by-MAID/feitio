import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Every language is its own set of pages (/pt/, /en/...), so search, Markdown and llms.txt come per
// language. FEITIO_BASE sets the path when the site is served under one (GitHub Pages: /feitio/),
// and FEITIO_SITE its origin, for canonical addresses, link previews and the sitemap.
export default defineConfig({
  site: process.env.FEITIO_SITE ?? 'https://made-by-maid.github.io',
  base: process.env.FEITIO_BASE ?? '/',
  trailingSlash: 'always',
  i18n: {
    locales: ['pt', 'en', 'es', 'fr', 'de'],
    defaultLocale: 'pt',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // Only the pages themselves: not the root that redirects, the 404 or the parity file.
      filter: (page) => /\/(pt|en|es|fr|de)\//.test(new URL(page).pathname),
      i18n: {
        defaultLocale: 'pt',
        locales: { pt: 'pt-BR', en: 'en', es: 'es', fr: 'fr', de: 'de' },
      },
    }),
  ],
});
