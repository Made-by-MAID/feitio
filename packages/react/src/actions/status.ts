import { status as setStatus } from '@feitio/vanilla/status/source';

/**
 * Shows a StatusOverlay's feedback from code, on its element: "loading", "ok" or "error", with the
 * words for it; null clears it. In React, the state and label props usually do this.
 */
export function status(
  host: HTMLElement,
  state: 'loading' | 'ok' | 'error' | null,
  label = '',
): void {
  setStatus(host, state, label);
}
