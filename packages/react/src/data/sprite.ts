import { createContext } from 'react';

/** Where the icon sprite is served when nobody says otherwise: the same default as the Astro Icon. */
export const DEFAULT_SPRITE = '/feitio/icons/sprite.svg';

/** The sprite for every icon under a FeitioProvider. */
export const SpriteContext = createContext<string | undefined>(undefined);
