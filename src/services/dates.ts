import type { ExamId } from '../engine';

const DAY_MS = 86400000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function toKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toKey(new Date());
}

export function addDays(key: string, n: number): string {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

export function daysBetween(fromK: string, toK: string): number {
  const a = Date.UTC(...ymd(fromK));
  const b = Date.UTC(...ymd(toK));
  return Math.round((b - a) / DAY_MS);
}

function ymd(key: string): [number, number, number] {
  const [y, m, d] = key.split('-').map(Number);
  return [y, m - 1, d];
}

export function daysUntil(key: string): number {
  return Math.max(0, daysBetween(todayKey(), key));
}

export function formatLong(key: string): string {
  const d = fromKey(key);
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatShort(key: string): string {
  const d = fromKey(key);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function monthName(index: number): string {
  return MONTHS[index];
}

export function weekdayInitial(key: string): string {
  return WEEKDAYS[fromKey(key).getDay()].slice(0, 1);
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function nthWeekday(year: number, monthIndex: number, weekday: number, n: number): Date {
  const first = new Date(year, monthIndex, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, monthIndex, 1 + offset + (n - 1) * 7);
}

function lastWeekday(year: number, monthIndex: number, weekday: number): Date {
  const last = new Date(year, monthIndex + 1, 0);
  const offset = (last.getDay() - weekday + 7) % 7;
  return new Date(year, monthIndex, last.getDate() - offset);
}

export interface DatePreset {
  key: string;
  label: string;
}

const SAT = 6;
const MON = 1;
const TUE = 2;

function satSittings(year: number): DatePreset[] {
  return [
    { d: nthWeekday(year, 2, SAT, 2), label: 'March SAT' },
    { d: nthWeekday(year, 4, SAT, 1), label: 'May SAT' },
    { d: nthWeekday(year, 5, SAT, 1), label: 'June SAT' },
    { d: lastWeekday(year, 7, SAT), label: 'August SAT' },
    { d: nthWeekday(year, 9, SAT, 1), label: 'October SAT' },
    { d: nthWeekday(year, 10, SAT, 1), label: 'November SAT' },
    { d: nthWeekday(year, 11, SAT, 1), label: 'December SAT' },
  ].map((s) => ({ key: toKey(s.d), label: s.label }));
}

export function datePresets(exam: ExamId, fromK: string = todayKey()): DatePreset[] {
  const year = fromKey(fromK).getFullYear();
  const minKey = addDays(fromK, 7);
  let all: DatePreset[];
  if (exam === 'sat') {
    all = [...satSittings(year), ...satSittings(year + 1)];
  } else if (exam === 'ap-calc-ab') {
    all = [year, year + 1, year + 2].map((y) => ({
      key: toKey(nthWeekday(y, 4, MON, 1)),
      label: `AP exams, early May ${y}`,
    }));
  } else {
    all = [year, year + 1, year + 2].map((y) => ({
      key: toKey(nthWeekday(y, 5, TUE, 1)),
      label: `A-Level summer series, June ${y}`,
    }));
  }
  return all.filter((p) => p.key >= minKey).slice(0, 3);
}
