import { useContext } from 'react';
import { DEFAULT_SPRITE, SpriteContext } from '../data/sprite.ts';

/** The sprite an icon uses: its own, else the FeitioProvider's, else the default path. */
export function useSprite(own?: string): string {
  const shared = useContext(SpriteContext);
  return own ?? shared ?? DEFAULT_SPRITE;
}
