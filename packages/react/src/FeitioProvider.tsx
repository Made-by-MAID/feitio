import type { ReactElement, ReactNode } from 'react';
import { SpriteContext } from './data/sprite.ts';

export interface FeitioProviderProps {
  /** Where the icon sprite is served, for every icon inside. */
  sprite?: string;
  children?: ReactNode;
}

/** Settings for every Feitio component inside it; today, where the icon sprite lives. */
export function FeitioProvider({ sprite, children }: FeitioProviderProps): ReactElement {
  return <SpriteContext value={sprite}>{children}</SpriteContext>;
}
