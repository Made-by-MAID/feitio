import { expect, test } from 'bun:test';
import { typedTheWord } from './confirm-word.ts';

test('the word, in any case and with spaces around, confirms; anything else does not', () => {
  expect(typedTheWord(' apagar ', 'APAGAR')).toBe(true);
  expect(typedTheWord('APAGA', 'APAGAR')).toBe(false);
  expect(typedTheWord('', '')).toBe(false);
});
