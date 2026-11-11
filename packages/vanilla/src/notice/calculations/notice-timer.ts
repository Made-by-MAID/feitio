/** A notice's status, as its data-status says: none is information. */
export type NoticeStatus = 'info' | 'ok' | 'warn' | 'error';

/**
 * Whether a notice may close by itself: only success and information, and only with a time.
 * Warnings and errors stay until the person closes them.
 */
export function closesByItself(status: NoticeStatus, timeoutMs: number): boolean {
  return (status === 'info' || status === 'ok') && Number.isFinite(timeoutMs) && timeoutMs > 0;
}

/** Reads data-status, where no attribute (or an unknown one) is information. */
export function noticeStatus(attribute: string | null | undefined): NoticeStatus {
  return attribute === 'ok' || attribute === 'warn' || attribute === 'error' ? attribute : 'info';
}

/** How far the time has run, from 0 to 1, given the milliseconds already counted. */
export function noticeProgress(usedMs: number, timeoutMs: number): number {
  if (timeoutMs <= 0) return 1;
  return Math.min(Math.max(usedMs / timeoutMs, 0), 1);
}

/**
 * The time counted after one frame: it only grows while the notice is not paused (no pointer
 * or focus on it), so hovering stops the clock instead of hiding the time it had left.
 */
export function countFrame(usedMs: number, elapsedMs: number, paused: boolean): number {
  return paused ? usedMs : usedMs + Math.max(elapsedMs, 0);
}
