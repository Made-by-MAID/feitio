import { settleArrival } from './actions/settle-arrival.ts';

/** A page marked data-feitio-arriving lets its transitions run once it has loaded and painted. */
export function settle(window: Window): void {
  settleArrival(window);
}
