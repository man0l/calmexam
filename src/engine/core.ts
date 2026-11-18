export type ExamId = 'sat' | 'ap-calc-ab' | 'a-level';

export interface Exam {
  id: ExamId;
  name: string;
  shortName: string;
  region: string;
  scale: { min: number; max: number; label: string };
  hubSlug: string;
  hubKeyword: string;
}

export interface Topic {
  id: string;
  exam: ExamId;
  name: string;
  slug: string;
  blurb: string;
}

export interface Problem {
  id: string;
  templateId: string;
  exam: ExamId;
  topicId: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  choices: string[];
  answerIndex: number;
  answer: string;
  steps: string[];
  pitfalls: string[];
  seed: number;
}

export interface Draft {
  prompt: string;
  answer: string;
  wrong: string[];
  steps: string[];
  pitfalls: string[];
}

export interface Template {
  id: string;
  exam: ExamId;
  topicId: string;
  difficulty: 1 | 2 | 3;
  build: (r: Rng) => Draft;
}

export class Rng {
  private s: number;
  constructor(seed: number) {
    this.s = seed >>> 0 || 1;
  }
  next(): number {
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }
  nonZero(min: number, max: number): number {
    let v = 0;
    while (v === 0) v = this.int(min, max);
    return v;
  }
  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }
  shuffle<T>(items: T[]): T[] {
    const a = items.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export class Frac {
  readonly n: number;
  readonly d: number;
  constructor(n: number, d = 1) {
    if (d === 0) throw new Error('zero denominator');
    const g = gcd(n, d);
    const s = d < 0 ? -1 : 1;
    this.n = (s * n) / g;
    this.d = (s * d) / g;
  }
  static of(v: number | Frac): Frac {
    return v instanceof Frac ? v : new Frac(v);
  }
  add(o: number | Frac): Frac {
    const b = Frac.of(o);
    return new Frac(this.n * b.d + b.n * this.d, this.d * b.d);
  }
  sub(o: number | Frac): Frac {
    const b = Frac.of(o);
    return new Frac(this.n * b.d - b.n * this.d, this.d * b.d);
  }
  mul(o: number | Frac): Frac {
    const b = Frac.of(o);
    return new Frac(this.n * b.n, this.d * b.d);
  }
  div(o: number | Frac): Frac {
    const b = Frac.of(o);
    return new Frac(this.n * b.d, this.d * b.n);
  }
  neg(): Frac {
    return new Frac(-this.n, this.d);
  }
  isInt(): boolean {
    return this.d === 1;
  }
  value(): number {
    return this.n / this.d;
  }
  toString(): string {
    const sign = this.n < 0 ? '−' : '';
    const n = Math.abs(this.n);
    return this.d === 1 ? `${sign}${n}` : `${sign}${n}/${this.d}`;
  }
}

export function num(v: number): string {
  const r = Math.round(v * 100) / 100;
  const s = Number.isInteger(r) ? String(Math.abs(r)) : Math.abs(r).toFixed(2).replace(/0$/, '');
  return (r < 0 ? '−' : '') + s;
}

export function money(v: number): string {
  return '$' + (Math.round(v * 100) / 100).toFixed(2);
}

const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };

export function sup(n: number): string {
  return String(n)
    .split('')
    .map((c) => SUP[c] ?? c)
    .join('');
}

export function term(coef: number | Frac, power: number, variable = 'x', first = false): string {
  const c = Frac.of(coef);
  if (c.n === 0) return '';
  const neg = c.n < 0;
  const abs = neg ? c.neg() : c;
  const mag = power === 0 ? abs.toString() : abs.n === 1 && abs.d === 1 ? '' : abs.toString();
  const v = power === 0 ? '' : power === 1 ? variable : variable + sup(power);
  const body = mag + v;
  if (first) return (neg ? '−' : '') + body;
  return (neg ? ' − ' : ' + ') + body;
}

export function poly(coefs: (number | Frac)[], variable = 'x'): string {
  let out = '';
  const deg = coefs.length - 1;
  coefs.forEach((c, i) => {
    const t = term(c, deg - i, variable, out === '');
    out += t;
  });
  return out || '0';
}

export function signed(v: number): string {
  return v < 0 ? `− ${Math.abs(v)}` : `+ ${v}`;
}

export function paren(v: number): string {
  return v < 0 ? `(−${Math.abs(v)})` : String(v);
}

export function buildProblem(t: Template, seed: number): Problem {
  for (let attempt = 0; attempt < 20; attempt++) {
    const rng = new Rng(seed * 7919 + attempt * 104729 + hash(t.id));
    const d = t.build(rng);
    const wrong = Array.from(new Set(d.wrong.filter((w) => w !== d.answer)));
    let k = 1;
    while (wrong.length < 3 && k < 50) {
      const filler = perturb(d.answer, k, rng);
      if (filler && filler !== d.answer && !wrong.includes(filler)) wrong.push(filler);
      k++;
    }
    if (wrong.length < 3) continue;
    const answer = tidy(d.answer);
    const choices = rng.shuffle([answer, ...wrong.slice(0, 3).map(tidy)]);
    if (new Set(choices).size !== 4) continue;
    return {
      id: `${t.id}:${seed}`,
      templateId: t.id,
      exam: t.exam,
      topicId: t.topicId,
      difficulty: t.difficulty,
      prompt: tidy(d.prompt),
      choices,
      answerIndex: choices.indexOf(answer),
      answer,
      steps: d.steps.map(tidy),
      pitfalls: d.pitfalls.map(tidy),
      seed,
    };
  }
  throw new Error(`template ${t.id} failed to build for seed ${seed}`);
}

export function tidy(s: string): string {
  return s
    .replace(/-(?=\d)/g, '−')
    .replace(/(?<![\d.])1(?=[xy](?![\d]))/g, '')
    .replace(/\(−1\)·/g, '−');
}

function perturb(answer: string, k: number, rng: Rng): string | null {
  const m = answer.match(/−?\d+(\.\d+)?/);
  if (!m) return null;
  const raw = m[0].replace('−', '-');
  const v = Number(raw);
  const decimals = (m[1] ?? '').length - 1;
  const step = decimals > 0 ? rng.int(1, 9) + rng.int(1, 9) * Math.pow(10, -decimals) * 10 : rng.int(1, 3) * (Math.abs(v) >= 50 ? Math.max(1, Math.round(Math.abs(v) / 20)) : 1);
  const nv = v + (k % 2 === 0 ? 1 : -1) * step * Math.ceil(k / 2);
  const str = decimals > 0 ? nv.toFixed(decimals) : String(nv);
  return answer.replace(m[0], str.replace('-', '−'));
}

export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
