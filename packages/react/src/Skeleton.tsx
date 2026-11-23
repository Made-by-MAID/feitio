import type { ReactElement } from 'react';

export interface SkeletonProps {
  shape?: 'text' | 'block' | 'circle';
  /** Lines of a text skeleton, 1 to 20 (a number or its text). */
  lines?: number | string;
  /** The block's height, or the circle's size. */
  size?: 'small' | 'medium' | 'large';
  /** What a screen reader hears. Empty for the other skeletons of one loading area: one status says it. */
  label?: string;
}

/** Skeleton: the shape of what is coming, while it loads. */
export function Skeleton({
  shape = 'text',
  lines = 3,
  size,
  label = 'Carregando…',
}: SkeletonProps): ReactElement {
  const count = Number(lines);
  const bones =
    shape === 'text'
      ? Number.isFinite(count)
        ? Math.min(Math.max(1, Math.floor(count)), 20)
        : 3
      : 1;
  return (
    <div
      className="feitio-skeleton"
      data-shape={shape}
      data-size={size}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : 'true'}
    >
      {label && <span className="feitio-visually-hidden">{label}</span>}
      {Array.from({ length: bones }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the bones are identical and never reorder.
        <span key={index} className="bone" aria-hidden="true" />
      ))}
    </div>
  );
}
