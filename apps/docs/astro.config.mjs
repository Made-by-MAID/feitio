import { defineConfig } from 'astro/config';

// Every language is its own set of pages (/pt/, /en/...), so search, Markdown and llms.txt come per
// language. FEITIO_BASE sets the path when the site is served under one (GitHub Pages: /feitio/).
export default defineConfig({
  base: process.env.FEITIO_BASE ?? '/',
  trailingSlash: 'always',
  i18n: {
    locales: ['pt', 'en', 'es', 'fr', 'de'],
    defaultLocale: 'pt',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
