import { expect, test } from 'bun:test';
import { hiddenOpenStates } from './hidden-open-states.ts';

test('an open state hidden with opacity 0 outside @starting-style is found', () => {
  const css = `@layer feitio.components {
  .feitio-dialog[open] { opacity: 1; }
  .feitio-dialog[open] {
    opacity: 0;
    translate: 0 1rem;
  }
  .menu:popover-open { color: red; opacity:0 }
}`;
  expect(hiddenOpenStates(css)).toEqual(['.feitio-dialog[open]', '.menu:popover-open']);
});

test('the same rule inside @starting-style is where an entry starts, and is fine', () => {
  const css = `@layer x {
  /* .feitio-dialog[open] { opacity: 0 } in a comment counts for nothing */
  .feitio-dialog { opacity: 0; }
  .feitio-dialog[open] { opacity: 1; }
  @starting-style {
    .feitio-dialog[open] { opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) { .feitio-dialog[open] { opacity: 0.5; } }
}`;
  expect(hiddenOpenStates(css)).toEqual([]);
});
