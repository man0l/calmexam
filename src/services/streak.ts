import { addDays, todayKey } from './dates';

export function currentStreak(days: Record<string, number>, today: string = todayKey()): number {
  let cursor = (days[today] ?? 0) > 0 ? today : addDays(today, -1);
  let n = 0;
  while ((days[cursor] ?? 0) > 0) {
    n++;
    cursor = addDays(cursor, -1);
  }
  return n;
}

export function bestStreak(days: Record<string, number>): number {
  const keys = Object.keys(days)
    .filter((k) => days[k] > 0)
    .sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const k of keys) {
    run = prev && addDays(prev, 1) === k ? run + 1 : 1;
    best = Math.max(best, run);
    prev = k;
  }
  return best;
}

export function weekKeys(today: string = todayKey()): string[] {
  const d = new Date(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1, Number(today.slice(8, 10)));
  const mondayOffset = (d.getDay() + 6) % 7;
  const start = addDays(today, -mondayOffset);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
