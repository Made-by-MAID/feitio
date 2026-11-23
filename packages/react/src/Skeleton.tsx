import type { ReactElement } from 'react';

export interface SkeletonProps {
  shape?: 'text' | 'block' | 'circle';
  /** Lines of a text skeleton. */
  lines?: number;
  /** The block's height, or the circle's size. */
  size?: 'small' | 'medium' | 'large';
  /** What a screen reader hears. */
  label?: string;
}

/** Skeleton: the shape of what is coming, while it loads. */
export function Skeleton({
  shape = 'text',
  lines = 3,
  size,
  label = 'Loading…',
}: SkeletonProps): ReactElement {
  const bones = shape === 'text' ? Math.max(1, Math.floor(lines)) : 1;
  return (
    <div className="feitio-skeleton" data-shape={shape} data-size={size} role="status">
      <span className="feitio-visually-hidden">{label}</span>
      {Array.from({ length: bones }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the bones are identical and never reorder.
        <span key={index} className="bone" aria-hidden="true" />
      ))}
    </div>
  );
}
