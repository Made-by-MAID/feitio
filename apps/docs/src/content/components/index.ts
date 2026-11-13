import type { Locale } from '../../i18n/ui.ts';
import drafts from '../drafts.json';
import type { GroupKey } from './types.ts';

/** A component page's content: the approved drafts in PT and EN, translated to ES, FR and DE. */
export type DraftSection = {
  id: string;
  title: Record<Locale, string>;
  html: Record<Locale, string>;
};
export type DraftComponent = {
  name: string;
  slug: string;
  group: GroupKey | 'templates';
  lede: Record<Locale, string>;
  sections: DraftSection[];
};

export const COMPONENTS = drafts as DraftComponent[];
