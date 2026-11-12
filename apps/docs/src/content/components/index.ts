import { ACTIONS_AND_TEXT } from './batch-actions-text.ts';
import type { ComponentDoc, GroupKey } from './types.ts';

/** Every component documented by the generic page. Button and Notice have pages of their own. */
export const COMPONENTS: ComponentDoc[] = [...ACTIONS_AND_TEXT];

/** The components with a page of their own, and their group, for the side navigation. */
export const OWN_PAGES: { name: string; slug: string; group: GroupKey }[] = [
  { name: 'Button', slug: 'button', group: 'actions' },
  { name: 'Notice', slug: 'notice', group: 'feedback' },
];
