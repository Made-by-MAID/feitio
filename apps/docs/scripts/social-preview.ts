/**
 * The repository's social preview (1280×640 PNG, the card of og-card.ts), for GitHub: Settings →
 * General → Social preview. Run `bun scripts/social-preview.ts`; it writes social-preview.png here.
 */
import { join } from 'node:path';
import { cardPng } from './og-card.ts';

const out = join(import.meta.dir, '..', 'social-preview.png');
await Bun.write(
  out,
  await cardPng(
    {
      section: 'A handmade, humanist design system',
      title: 'Feitio',
      description:
        'Guidelines, tokens, CSS and components for Astro and React. Accessible, in five languages.',
      lang: 'npm @feitio',
      host: 'feitio.bymaid.com',
    },
    1280,
    640,
  ),
);
console.log(out);
