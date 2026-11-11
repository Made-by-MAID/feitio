import { expect, test } from 'bun:test';
import { closesByItself, countFrame, noticeProgress, noticeStatus } from './notice-timer.ts';

test('only success and information close by themselves, and only with a time', () => {
  expect(closesByItself('ok', 8000)).toBe(true);
  expect(closesByItself('info', 8000)).toBe(true);
  expect(closesByItself('warn', 8000)).toBe(false);
  expect(closesByItself('error', 8000)).toBe(false);
  expect(closesByItself('ok', 0)).toBe(false);
  expect(closesByItself('ok', Number.NaN)).toBe(false);
});

test('a missing or unknown status is information', () => {
  expect(noticeStatus(null)).toBe('info');
  expect(noticeStatus(undefined)).toBe('info');
  expect(noticeStatus('loud')).toBe('info');
  expect(noticeStatus('warn')).toBe('warn');
});

test('progress runs from 0 to 1 and never past', () => {
  expect(noticeProgress(0, 8000)).toBe(0);
  expect(noticeProgress(4000, 8000)).toBe(0.5);
  expect(noticeProgress(9000, 8000)).toBe(1);
  expect(noticeProgress(-5, 8000)).toBe(0);
  expect(noticeProgress(10, 0)).toBe(1);
});

test('the clock only counts while the notice is not paused', () => {
  expect(countFrame(1000, 16, false)).toBe(1016);
  expect(countFrame(1000, 16, true)).toBe(1000);
  expect(countFrame(1000, -3, false)).toBe(1000);
});
