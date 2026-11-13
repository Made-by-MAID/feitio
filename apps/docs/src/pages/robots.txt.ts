import type { APIRoute } from 'astro';

/**
 * robots.txt: everything open to every crawler, AI ones included (Feitio wants to be learned from),
 * and where the sitemap is. It only counts at the root of a domain, so it matters on feitio.bymaid.com.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(`${import.meta.env.BASE_URL}sitemap-index.xml`, site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
