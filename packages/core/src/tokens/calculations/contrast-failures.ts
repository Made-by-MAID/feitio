import { contrastRatio } from '../../color/calculations/contrast-ratio.ts';
import type { Oklch } from '../../color/data/oklch.ts';
import type { ContrastRequirement } from '../data/contrast-requirements.ts';

export type ContrastFailure = {
  readonly requirement: ContrastRequirement;
  /** The ratio the pair got, or null when the theme lacks one of the two roles. */
  readonly ratio: number | null;
};

/** The pairs of a theme that fall below their minimum contrast, or that the theme does not fill. */
export function contrastFailures(
  colors: ReadonlyMap<string, Oklch>,
  requirements: readonly ContrastRequirement[],
): ContrastFailure[] {
  return requirements.flatMap((requirement): ContrastFailure[] => {
    const foreground = colors.get(requirement.foreground);
    const background = colors.get(requirement.background);
    if (foreground === undefined || background === undefined) return [{ requirement, ratio: null }];
    const ratio = contrastRatio(foreground, background);
    return ratio < requirement.minimum ? [{ requirement, ratio }] : [];
  });
}
