/**
 * Shows the feedback on a StatusOverlay's container: "loading", "ok" or "error", with the words for
 * it; null clears it. The status region announces the words to screen readers.
 */
export function setStatus(
  host: HTMLElement,
  state: 'loading' | 'ok' | 'error' | null,
  label = '',
): void {
  const words = host.querySelector('.feitio-status .label');
  if (state === null) {
    delete host.dataset.state;
    if (words) words.textContent = '';
    return;
  }
  host.dataset.state = state;
  if (words) words.textContent = label;
}
