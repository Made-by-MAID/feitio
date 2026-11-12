/** Whether the ScrollFade shows: there is more than a few pixels left below what is in view. */
export function fadeVisible(scrollTop: number, viewHeight: number, scrollHeight: number): boolean {
  return scrollTop + viewHeight < scrollHeight - 8;
}

/** Whether BackToTop shows: the person has scrolled past half a screen. */
export function backToTopVisible(scrollTop: number, viewHeight: number): boolean {
  return scrollTop > viewHeight * 0.5;
}
