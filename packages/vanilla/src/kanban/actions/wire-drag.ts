import {
  autoScrollSpeed,
  type Follow,
  followStep,
  insertionIndex,
  SETTLE,
} from '../calculations/kanban-motion.ts';
import { targetsOf } from '../calculations/kanban-rules.ts';
import { animateFrom, play, reduced, snapshot } from './kanban-flip.ts';
import { moveCard } from './move-card.ts';

interface Held extends Follow {
  card: HTMLElement;
  ghost: HTMLElement;
  slot: HTMLElement;
  home: HTMLElement;
  homeNext: Node | null;
  offX: number;
  offY: number;
  px: number;
  py: number;
  running: boolean;
  opened?: HTMLElement;
}

/**
 * Holding and dragging a card, on a wide board, with a mouse or a pen (on a phone, the move button
 * does it). The card follows the hand on a spring: it lags a little, leans toward where it goes and
 * sways when the hand stops. The folder under it opens a place where it would land and the cards
 * there make room; folders that do not take it fade. Near the sides the board scrolls by itself.
 * Letting go moves it from where it was let go; Esc, or letting go outside, takes it home.
 */
export function wireDrag(window: Window, board: HTMLElement): void {
  const doc = window.document;
  const cols = (): HTMLElement | null => board.querySelector<HTMLElement>('.cols');
  board.addEventListener('pointerdown', (event) => {
    const card = (event.target as Element).closest<HTMLElement>('.col > .feitio-kanban-card');
    if (!card || !board.contains(card) || card.classList.contains('draft')) return;
    if (event.button !== 0 || event.pointerType === 'touch') return;
    if ((event.target as Element).closest('button, a, input, textarea, select, label')) return;
    if (!targetsOf(card.dataset.to).length) return;
    const row = cols();
    if (!row || window.getComputedStyle(row).display !== 'flex') return;
    event.preventDefault();
    const sx = event.clientX;
    const sy = event.clientY;
    let held: Held | undefined;
    const stop = (): void => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('keydown', onKey);
    };
    const onMove = (e: PointerEvent): void => {
      if (!held) {
        if (Math.hypot(e.clientX - sx, e.clientY - sy) < 5) return;
        held = lift(e, card);
      }
      held.px = e.clientX;
      held.py = e.clientY;
      hover(held);
    };
    const onUp = (): void => {
      stop();
      if (held) letGo(held, false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== 'Escape' || !held) return;
      stop();
      letGo(held, true);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('keydown', onKey);
  });

  function lift(event: PointerEvent, card: HTMLElement): Held {
    const r = card.getBoundingClientRect();
    const ghost = doc.createElement('div');
    ghost.className = 'feitio-kanban-ghost';
    ghost.dataset.motion = 'direct';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.style.width = `${r.width}px`;
    const copy = card.cloneNode(true) as HTMLElement;
    copy.removeAttribute('id');
    ghost.append(copy);
    doc.body.append(ghost);
    const slot = doc.createElement('div');
    slot.className = 'slot';
    slot.style.blockSize = `${r.height}px`;
    const home = card.closest<HTMLElement>('.col') as HTMLElement;
    const homeNext = card.nextSibling;
    card.replaceWith(slot);
    doc.documentElement.setAttribute('data-kanban-dragging', '');
    board.setAttribute('data-dragging', '');
    const targets = targetsOf(card.dataset.to);
    for (const col of board.querySelectorAll<HTMLElement>('.col')) {
      if (col !== home && !targets.includes(col.dataset.col ?? ''))
        col.setAttribute('data-blocked', '');
    }
    const held: Held = {
      card,
      ghost,
      slot,
      home,
      homeNext,
      offX: event.clientX - r.left,
      offY: event.clientY - r.top,
      x: r.left,
      y: r.top,
      vx: 0,
      vy: 0,
      tilt: 0,
      px: event.clientX,
      py: event.clientY,
      running: true,
    };
    follow(held);
    return held;
  }

  function follow(held: Held): void {
    if (!held.running) return;
    const tx = held.px - held.offX;
    const ty = held.py - held.offY;
    if (reduced(window)) Object.assign(held, { x: tx, y: ty, vx: 0, vy: 0, tilt: 0 });
    else Object.assign(held, followStep(held, tx, ty));
    held.ghost.style.transform = `translate(${held.x}px, ${held.y}px) rotate(${held.tilt}deg) scale(1.04)`;
    const row = cols();
    if (row) {
      const r = row.getBoundingClientRect();
      const v = autoScrollSpeed(held.px, r.left, r.right);
      if (v) {
        row.scrollLeft += v;
        hover(held);
      }
    }
    window.requestAnimationFrame(() => follow(held));
  }

  function hover(held: Held): void {
    const under = doc.elementFromPoint(held.px, held.py)?.closest<HTMLElement>('.col');
    const ok = Boolean(
      under && board.contains(under) && under !== held.home && !under.hasAttribute('data-blocked'),
    );
    const dest = ok && under ? under : held.home;
    let before: Element | null;
    if (ok) {
      const cards = [
        ...dest.querySelectorAll<HTMLElement>(':scope > .feitio-kanban-card:not(.draft)'),
      ];
      const i = insertionIndex(
        cards.map((c) => {
          const r = c.getBoundingClientRect();
          return r.top + r.height / 2;
        }),
        held.py,
      );
      before = cards[i] ?? dest.querySelector(':scope > .add');
    } else {
      before =
        held.homeNext && held.homeNext.parentNode === held.home
          ? (held.homeNext as Element)
          : held.home.querySelector(':scope > .add');
    }
    for (const col of board.querySelectorAll<HTMLElement>('.col'))
      col.toggleAttribute('data-over', ok && col === under);
    if (held.slot.parentNode === dest && held.slot.nextSibling === before) return;
    const moving = [
      ...board.querySelectorAll<HTMLElement>('.col > .feitio-kanban-card, .col > .add'),
    ];
    const first = new Map(moving.map((m) => [m, m.getBoundingClientRect()]));
    const widths = new Map(
      [...board.querySelectorAll<HTMLElement>('.col')].map((c) => [
        c,
        c.getBoundingClientRect().width,
      ]),
    );
    // An empty folder that is about to take the card opens; the one it leaves closes again.
    if (held.opened && held.opened !== dest) {
      held.opened.setAttribute('data-empty', '');
      held.opened = undefined;
    }
    if (dest !== held.home && dest.hasAttribute('data-empty')) {
      dest.removeAttribute('data-empty');
      held.opened = dest;
    }
    dest.insertBefore(held.slot, before);
    if (reduced(window)) return;
    for (const [col, w0] of widths) {
      const w1 = col.getBoundingClientRect().width;
      if (Math.abs(w1 - w0) > 1)
        play(col, SETTLE, (p) => ({
          flexBasis: `${w0 + (w1 - w0) * p}px`,
          flexGrow: 0,
          flexShrink: 0,
        }));
    }
    for (const m of moving) {
      const a = first.get(m) as DOMRect;
      const b = m.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)
        play(m, SETTLE, (p) => ({ transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p)}px)` }));
    }
  }

  function letGo(held: Held, cancel: boolean): void {
    held.running = false;
    doc.documentElement.removeAttribute('data-kanban-dragging');
    board.removeAttribute('data-dragging');
    for (const col of board.querySelectorAll<HTMLElement>('.col')) {
      col.removeAttribute('data-blocked');
      col.removeAttribute('data-over');
    }
    const dest = held.slot.closest<HTMLElement>('.col') as HTMLElement;
    const index = [
      ...dest.querySelectorAll(':scope > .feitio-kanban-card:not(.draft), :scope > .slot'),
    ].indexOf(held.slot);
    const id = held.card.dataset.id ?? '';
    // The picture of before is the board as the hand left it; the card starts where it was let go.
    const before = snapshot(board);
    const from = { x: held.x, y: held.y, tilt: held.tilt };
    held.ghost.remove();
    // The card goes back home first, so whoever moves it (this board, a React state) starts from the truth.
    held.home.insertBefore(
      held.card,
      held.homeNext && held.homeNext.parentNode === held.home ? held.homeNext : null,
    );
    held.slot.remove();
    if (held.opened) held.opened.setAttribute('data-empty', '');
    if (
      !cancel &&
      dest !== held.home &&
      moveCard(window, board, held.card, dest.dataset.col ?? '', index, before, from)
    )
      return;
    window.requestAnimationFrame(() => animateFrom(window, board, before, { id, from }));
  }
}
