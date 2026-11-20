import {
  curveDuration,
  FLY,
  flightTilt,
  HOP,
  SETTLE,
  type Spring,
  springCurve,
} from '../calculations/kanban-motion.ts';

/** Where everything was before a change: each card's and each new-card button's box, each column's width. */
export interface KanbanSnapshot {
  rects: Map<string, { left: number; top: number; width: number }>;
  widths: Map<string, number>;
  clones: Map<string, HTMLElement>;
}

/** What moved and how: the card, where it went, and where the hand let it go (when it was dragged). */
export interface KanbanMotion {
  id?: string;
  to?: string;
  from?: { x: number; y: number; tilt: number };
}

/** The key that finds a piece again after the change. */
function keyOf(el: HTMLElement): string | undefined {
  if (el.classList.contains('feitio-kanban-card'))
    return el.dataset.id ? `card:${el.dataset.id}` : undefined;
  const col = el.closest<HTMLElement>('.col');
  return col ? `add:${col.dataset.col}` : undefined;
}

function pieces(board: HTMLElement): HTMLElement[] {
  return [
    ...board.querySelectorAll<HTMLElement>('.col > .feitio-kanban-card:not(.draft), .col > .add'),
  ];
}

/** Takes the picture of before. The card that is about to move keeps a copy, for a flight to a hidden tab. */
export function snapshot(board: HTMLElement, moving?: string): KanbanSnapshot {
  const rects = new Map<string, { left: number; top: number; width: number }>();
  const clones = new Map<string, HTMLElement>();
  for (const el of pieces(board)) {
    const key = keyOf(el);
    const r = el.getBoundingClientRect();
    if (key && r.width) rects.set(key, { left: r.left, top: r.top, width: r.width });
    if (key && moving && key === `card:${moving}`)
      clones.set(key, el.cloneNode(true) as HTMLElement);
  }
  const widths = new Map<string, number>();
  for (const col of board.querySelectorAll<HTMLElement>('.col')) {
    const w = col.getBoundingClientRect().width;
    if (w) widths.set(col.dataset.col ?? '', w);
  }
  return { rects, widths, clones };
}

/** Plays a spring on an element, frame by frame. Pages without the Web Animations API skip it. */
export function play(
  el: HTMLElement,
  spring: Spring,
  frame: (p: number) => Keyframe,
): Animation | undefined {
  if (typeof el.animate !== 'function') return undefined;
  const curve = springCurve(spring);
  return el.animate(curve.map(frame), { duration: curveDuration(curve), easing: 'linear' });
}

/** Whether the page asked for less motion. */
export function reduced(window: Window): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/**
 * Animates from the picture of before to where everything is now: columns that filled or emptied
 * change width on a spring, the cards around make room, and the card that moved flies to its place,
 * leaning, and settles. On a phone, a card that went to a hidden stage flies to its tab, which hops.
 */
export function animateFrom(
  window: Window,
  board: HTMLElement,
  before: KanbanSnapshot,
  motion: KanbanMotion,
): void {
  if (reduced(window)) return;
  const after = new Map<string, [HTMLElement, DOMRect]>();
  for (const el of pieces(board)) {
    const key = keyOf(el);
    const r = el.getBoundingClientRect();
    if (key && r.width) after.set(key, [el, r]);
  }
  for (const col of board.querySelectorAll<HTMLElement>('.col')) {
    const w0 = before.widths.get(col.dataset.col ?? '');
    const w1 = col.getBoundingClientRect().width;
    if (!w0 || !w1 || Math.abs(w0 - w1) < 1) continue;
    play(col, SETTLE, (p) => ({
      flexBasis: `${w0 + (w1 - w0) * p}px`,
      flexGrow: 0,
      flexShrink: 0,
    }));
  }
  const mover = motion.id ? `card:${motion.id}` : undefined;
  for (const [key, [el, r1]] of after) {
    const isMover = key === mover;
    let r0: { left: number; top: number } | undefined = before.rects.get(key);
    if (isMover && motion.from) r0 = { left: motion.from.x, top: motion.from.y };
    if (!r0) {
      if (isMover)
        play(el, FLY, (p) => ({
          transform: `translateY(${-24 * (1 - p)}px) scale(${1 + 0.08 * (1 - p)})`,
          opacity: Math.min(1, p * 2),
        }));
      continue;
    }
    const dx = r0.left - r1.left;
    const dy = r0.top - r1.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    if (!isMover) {
      play(el, SETTLE, (p) => ({ transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p)}px)` }));
      continue;
    }
    const tilt = motion.from ? motion.from.tilt : flightTilt(dx);
    const lift = motion.from ? 0.04 : 0.06;
    el.style.zIndex = '5';
    const run = play(el, FLY, (p) => ({
      transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p)}px) rotate(${tilt * (1 - p)}deg) scale(${1 + lift * Math.max(0, 1 - p)})`,
    }));
    if (run) run.onfinish = () => el.style.removeProperty('z-index');
  }
  if (!mover) return;
  const landed = after.get(mover);
  const cols = board.querySelector<HTMLElement>('.cols');
  // The stage it went to is out of view: the board scrolls there, and the card arrives with it.
  if (landed && !motion.from && cols) {
    const r = landed[1];
    const box = cols.getBoundingClientRect();
    if (r.right > box.right - 72)
      cols.scrollBy({ left: r.right - box.right + 72, behavior: 'smooth' });
    else if (r.left < box.left + 72)
      cols.scrollBy({ left: r.left - box.left - 72, behavior: 'smooth' });
  }
  const r0 = before.rects.get(mover);
  const clone = before.clones.get(mover);
  const tab = board.querySelector<HTMLElement>(`.tabs [data-col="${motion.to}"]`);
  if (landed || !r0 || !clone || !tab || typeof tab.animate !== 'function') return;
  const tr = tab.getBoundingClientRect();
  const ghost = window.document.createElement('div');
  ghost.className = 'feitio-kanban-ghost';
  ghost.setAttribute('aria-hidden', 'true');
  Object.assign(ghost.style, { left: `${r0.left}px`, top: `${r0.top}px`, width: `${r0.width}px` });
  clone.removeAttribute('id');
  ghost.append(clone);
  window.document.body.append(ghost);
  const dx = tr.left + tr.width / 2 - (r0.left + r0.width / 2);
  const dy = tr.top + tr.height / 2 - (r0.top + clone.getBoundingClientRect().height / 2);
  const flight = ghost.animate(
    [
      { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
      {
        transform: `translate(${dx * 0.35}px, ${dy * 0.35 - 30}px) scale(0.7) rotate(-5deg)`,
        opacity: 1,
        offset: 0.45,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(0.08) rotate(-14deg)`, opacity: 0.2 },
    ],
    { duration: 560, easing: 'cubic-bezier(0.45, 0, 0.8, 0.4)' },
  );
  flight.onfinish = () => {
    ghost.remove();
    play(tab, HOP, (p) => ({ transform: `scale(${1 + 0.4 * (1 - p)})` }));
  };
}
