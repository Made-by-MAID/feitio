import type { Locale } from '../i18n/ui.ts';
import data from './areas.json';

/** A page of the Design, Development or Resources area (or the Components overview), from the approved drafts. */
export type AreaPage = {
  area: 'design' | 'dev' | 'resources' | 'components';
  slug: string;
  title: Record<Locale, string>;
  lede: Record<Locale, string>;
  html: Record<Locale, string>;
};
type AreaNav = {
  title: Record<Locale, string>;
  items: { text: Record<Locale, string>; slug: string; soon: boolean }[];
}[];

export const AREA_PAGES = (data as { pages: AreaPage[] }).pages;
export const AREA_NAV = (data as { nav: Record<'design' | 'dev' | 'resources', AreaNav> }).nav;

/** The first page of an area, which its index shows. */
export const AREA_INDEX: Record<'design' | 'dev' | 'resources' | 'components', string> = {
  design: 'conceito',
  dev: 'comecar',
  resources: 'icones',
  components: 'index',
};
