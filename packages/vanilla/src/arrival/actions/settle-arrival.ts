/**
 * Lets a page's transitions run once it has settled. Its fonts, theme and container queries resolve just
 * after the first paint, and each of those changes would transition (spacing and sizes included), so
 * every page seemed to arrange itself. A root marked data-feitio-arriving moves nothing until the page
 * has loaded and painted twice; then the mark goes. A root without the mark is left alone.
 */
export function settleArrival(window: Window): void {
  const root = window.document.documentElement;
  if (!root.hasAttribute('data-feitio-arriving')) return;
  function settled(): void {
    root.removeAttribute('data-feitio-arriving');
  }
  function afterTwoFrames(): void {
    window.requestAnimationFrame(() => window.requestAnimationFrame(settled));
  }
  if (window.document.readyState === 'complete') afterTwoFrames();
  else window.addEventListener('load', afterTwoFrames, { once: true });
}
