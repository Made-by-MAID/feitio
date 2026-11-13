import type { ReactElement } from 'react';
import { useSprite } from './actions/use-sprite.ts';

export interface IconProps {
  /** The icon's name in the sprite, like "check" or "search". */
  name: string;
  /** Where the sprite is served; without it, the FeitioProvider's, else /feitio/icons/sprite.svg. */
  sprite?: string;
}

/** A hand-drawn icon from the sprite. Decorative: the words beside it say what it means. */
export function Icon({ name, sprite }: IconProps): ReactElement {
  const href = useSprite(sprite);
  return (
    <svg className="feitio-icon" aria-hidden="true">
      <use href={`${href}#feitio-${name}`} />
    </svg>
  );
}
