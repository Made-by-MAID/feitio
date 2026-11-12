import { expect, test } from 'bun:test';
import { matchesFilter, plainText, togglePeriod } from './form-values.ts';

test('AM and PM swap', () => {
  expect(togglePeriod('AM')).toBe('PM');
  expect(togglePeriod(' pm ')).toBe('AM');
});

test('the filter ignores accents, case and the order of the words', () => {
  expect(plainText('Ação')).toBe('acao');
  expect(matchesFilter('Regar as plantas', 'plantas regar')).toBe(true);
  expect(matchesFilter('Relatório do mês', 'relatorio')).toBe(true);
  expect(matchesFilter('Backup semanal', 'mensal')).toBe(false);
  expect(matchesFilter('Backup', '   ')).toBe(true);
});
