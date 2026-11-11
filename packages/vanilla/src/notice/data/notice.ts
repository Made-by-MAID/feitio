/** What the notice actions need from the page: passed in, so a test can hand in its own window. */
export type NoticeHost = {
  readonly window: Window;
  /** The running clock of each timed notice, to stop it when it closes or starts again. */
  readonly clocks: WeakMap<HTMLElement, () => void>;
};

/** How long a leaving notice may take before it is hidden anyway (no animation with reduced motion). */
export const LEAVE_FALLBACK_MS = 600;
