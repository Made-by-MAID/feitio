import type { ReactElement, ReactNode } from 'react';
import { Icon } from './Icon.tsx';

export interface DoDontProps {
  doWhy: string;
  dontWhy: string;
  doLabel?: string;
  dontLabel?: string;
  sprite?: string;
  /** The right way. */
  do?: ReactNode;
  /** The wrong way. */
  dont?: ReactNode;
}

/** DoDont: the right way and the wrong way side by side, each with why. */
export function DoDont({
  doWhy,
  dontWhy,
  doLabel = 'Faça assim',
  dontLabel = 'Não faça',
  sprite,
  do: right,
  dont: wrong,
}: DoDontProps): ReactElement {
  return (
    <div className="pair feitio-dodont">
      <div className="do">
        <p className="verdict">
          <Icon name="check" sprite={sprite} />
          {doLabel}
        </p>
        <div className="demo">{right}</div>
        <p className="why">{doWhy}</p>
      </div>
      <div className="dont">
        <p className="verdict">
          <Icon name="close" sprite={sprite} />
          {dontLabel}
        </p>
        <div className="demo">{wrong}</div>
        <p className="why">{dontWhy}</p>
      </div>
    </div>
  );
}
