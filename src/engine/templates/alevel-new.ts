import { Frac, num, paren, Rng, signed, sup, Template, term } from '../core';

function choose(n: number, k: number): number {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

function dp(v: number, places: number): string {
  const f = Math.pow(10, places);
  const rounded = Math.round(v * f) / f;
  const s = Math.abs(rounded).toFixed(places);
  return (rounded < 0 && Number(s) !== 0 ? '−' : '') + s;
}

function uniq(answer: string, cands: string[]): string[] {
  const out: string[] = [];
  for (const c of cands) if (c !== answer && !out.includes(c)) out.push(c);
  return out;
}

function surd(n: number): string {
  let s = 1;
  let t = n;
  for (let i = 2; i * i <= t; i++) {
    while (t % (i * i) === 0) {
      t /= i * i;
      s *= i;
    }
  }
  if (t === 1) return String(s);
  return s === 1 ? `√${t}` : `${s}√${t}`;
}

function vec(cs: number[]): string {
  const names = ['i', 'j', 'k'];
  let out = '';
  cs.forEach((c, i) => {
    out += term(c, 1, names[i], out === '');
  });
  return out || '0';
}

function vecWith(cs: number[], idx: number, sym: string): string {
  const names = ['i', 'j', 'k'];
  let out = '';
  cs.forEach((c, i) => {
    if (i === idx) out += out === '' ? `${sym}${names[i]}` : ` + ${sym}${names[i]}`;
    else out += term(c, 1, names[i], out === '');
  });
  return out;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

function smallestFactor(n: number): number {
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return i;
  return n;
}

function binom(n: number, p: number, x: number): number {
  return choose(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
}

function cumLE(n: number, p: number, x: number): number {
  let s = 0;
  for (let i = 0; i <= x; i++) s += binom(n, p, i);
  return s;
}

function cumGE(n: number, p: number, x: number): number {
  let s = 0;
  for (let i = x; i <= n; i++) s += binom(n, p, i);
  return s;
}

function lin(c: number, v: string, first: boolean): string {
  if (c === 0) return '';
  const mag = Math.abs(c) === 1 && v !== '' ? '' : String(Math.abs(c));
  if (first) return (c < 0 ? '−' : '') + mag + v;
  return (c < 0 ? ' − ' : ' + ') + mag + v;
}

function expr(parts: [number, string][]): string {
  let out = '';
  for (const [c, v] of parts) out += lin(c, v, out === '');
  return out || '0';
}

function fx(v: number): string {
  return (v < 0 ? '−' : '') + String(Number(Math.abs(v).toFixed(4)));
}

function kExp(k: number): string {
  return `e^(${fx(k)}t)`;
}

function pickDistinct<T>(r: Rng, items: T[], n: number): T[] {
  return r.shuffle(items).slice(0, n);
}

export const ALEVEL_NEW_TEMPLATES: Template[] = [
  {
    id: 'al-vec-magnitude',
    exam: 'a-level',
    topicId: 'al-vectors',
    difficulty: 1,
    build: (r) => {
      const three = r.next() < 0.6;
      const cs = three ? [r.nonZero(-7, 7), r.nonZero(-7, 7), r.nonZero(-7, 7)] : [r.nonZero(-9, 9), r.nonZero(-9, 9)];
      const N = cs.reduce((s, c) => s + c * c, 0);
      const last = cs[cs.length - 1];
      const sumAbs = cs.reduce((s, c) => s + Math.abs(c), 0);
      const name = r.pick(['a', 'b', 'p', 'v']);
      const ans = surd(N);
      const slip = three ? surd(N - last * last) : Math.abs(cs[0] * cs[0] - cs[1] * cs[1]) > 0 ? surd(Math.abs(cs[0] * cs[0] - cs[1] * cs[1])) : String(sumAbs + 1);
      return {
        prompt: r.pick([`Find |${name}|, where ${name} = ${vec(cs)}.`, `Find the magnitude of the vector ${vec(cs)}.`]),
        answer: ans,
        wrong: uniq(ans, [String(N), String(sumAbs), slip, surd(N + 2)]),
        steps: [
          `|${name}| = √(${cs.map((c) => `${paren(c)}²`).join(' + ')}).`,
          `= √(${cs.map((c) => c * c).join(' + ')}) = √${N}.`,
          ans === `√${N}` ? `√${N} does not simplify, so |${name}| = ${ans}.` : `Simplify: √${N} = ${ans}.`,
        ],
        pitfalls: [
          `Adding the components (giving ${sumAbs}) instead of squaring them first.`,
          three ? `Leaving out the k component, which gives ${surd(N - last * last)}.` : `Forgetting the square root and giving ${N}.`,
        ],
      };
    },
  },
  {
    id: 'al-vec-ab-from-position',
    exam: 'a-level',
    topicId: 'al-vectors',
    difficulty: 2,
    build: (r) => {
      const dim = r.pick([2, 3, 3]);
      const a = Array.from({ length: dim }, () => r.nonZero(-6, 6));
      const b = Array.from({ length: dim }, () => r.int(-6, 6));
      for (let i = 0; i < dim; i++) if (b[i] === a[i]) b[i] += r.pick([-3, 2]);
      const ab = b.map((v, i) => v - a[i]);
      const ba = ab.map((v) => -v);
      const forward = r.next() < 0.6;
      const ans = forward ? ab : ba;
      const slip = ans.map((v, i) => (i === 0 ? (forward ? b[0] + a[0] : a[0] + b[0]) : v));
      const label = forward ? 'AB' : 'BA';
      return {
        prompt: `Points A and B have position vectors ${vec(a)} and ${vec(b)} respectively. Find the vector ${label}→.`,
        answer: vec(ans),
        wrong: uniq(vec(ans), [vec(forward ? ba : ab), vec(a.map((v, i) => v + b[i])), vec(slip)]),
        steps: [
          forward ? 'AB→ = OB→ − OA→ = b − a.' : 'BA→ = OA→ − OB→ = a − b.',
          `Subtract component by component: ${ans.map((_, i) => (forward ? `${b[i]} − ${paren(a[i])}` : `${a[i]} − ${paren(b[i])}`)).join(', ')}.`,
          `${label}→ = ${vec(ans)}.`,
        ],
        pitfalls: [`Working out ${forward ? 'a − b' : 'b − a'}, which gives ${label === 'AB' ? 'BA' : 'AB'}→ = ${vec(forward ? ba : ab)} instead.`, 'Adding the position vectors instead of subtracting them.'],
      };
    },
  },
  {
    id: 'al-vec-unit-vector',
    exam: 'a-level',
    topicId: 'al-vectors',
    difficulty: 2,
    build: (r) => {
      const base = r.pick([
        { cs: [3, 4], m: 5 },
        { cs: [5, 12], m: 13 },
        { cs: [8, 15], m: 17 },
        { cs: [7, 24], m: 25 },
        { cs: [1, 2, 2], m: 3 },
        { cs: [2, 3, 6], m: 7 },
        { cs: [1, 4, 8], m: 9 },
        { cs: [4, 4, 7], m: 9 },
        { cs: [2, 6, 9], m: 11 },
        { cs: [6, 6, 7], m: 11 },
        { cs: [2, 10, 11], m: 15 },
      ]);
      const cs = r.shuffle(base.cs).map((c) => c * r.pick([1, -1]));
      const m = base.m;
      const v = vec(cs);
      const sumAbs = cs.reduce((s, c) => s + Math.abs(c), 0);
      const name = r.pick(['a', 'u', 'p']);
      return {
        prompt: `Given that ${name} = ${v}, find a unit vector in the same direction as ${name}.`,
        answer: `(1/${m})(${v})`,
        wrong: uniq(`(1/${m})(${v})`, [`${m}(${v})`, `(1/${m * m})(${v})`, `(1/${sumAbs})(${v})`]),
        steps: [
          `|${name}| = √(${cs.map((c) => c * c).join(' + ')}) = √${m * m} = ${m}.`,
          `A unit vector in the direction of ${name} is ${name} ÷ |${name}|.`,
          `= (1/${m})(${v}).`,
        ],
        pitfalls: [`Dividing by |${name}|² = ${m * m} instead of |${name}| = ${m}.`, `Dividing by the sum of the components, ${sumAbs}, instead of the magnitude.`],
      };
    },
  },
  {
    id: 'al-vec-angle-with-i',
    exam: 'a-level',
    topicId: 'al-vectors',
    difficulty: 3,
    build: (r) => {
      const three = r.next() < 0.4;
      const a = r.nonZero(-9, 9);
      let b = r.nonZero(-9, 9);
      if (Math.abs(b) === Math.abs(a)) b = b > 0 ? b + 1 : b - 1;
      const c = three ? r.nonZero(-6, 6) : 0;
      const cs = three ? [a, b, c] : [a, b];
      const N = a * a + b * b + c * c;
      const rad = Math.acos(a / Math.sqrt(N));
      const theta = (rad * 180) / Math.PI;
      const ans = `${dp(theta, 1)}°`;
      const acute = (Math.atan(Math.abs(b) / Math.abs(a)) * 180) / Math.PI;
      const no3 = (Math.acos(a / Math.sqrt(a * a + b * b)) * 180) / Math.PI;
      const cands = three
        ? [`${dp(no3, 1)}°`, `${dp(Math.abs(90 - theta), 1)}°`, `${dp(180 - theta, 1)}°`, `${dp(rad, 1)}°`]
        : [`${dp(acute, 1)}°`, `${dp(Math.abs(90 - theta), 1)}°`, `${dp(180 - theta, 1)}°`, `${dp(360 - theta, 1)}°`];
      return {
        prompt: `Find the angle between the vector ${vec(cs)} and the unit vector i. Give your answer in degrees to 1 decimal place.`,
        answer: ans,
        wrong: uniq(ans, cands),
        steps: [
          `The magnitude is √(${cs.map((x) => x * x).join(' + ')}) = √${N}.`,
          `cos θ = (i component) ÷ magnitude = ${a}/√${N}.`,
          `θ = cos⁻¹(${a}/√${N}) = ${ans}${a < 0 ? ' (obtuse, because the i component is negative)' : ''}.`,
        ],
        pitfalls: three
          ? [`Leaving out the k component ${c} when finding the magnitude.`, 'Having the calculator in radian mode.']
          : [a < 0 ? `Using tan⁻¹(${Math.abs(b)}/${Math.abs(a)}) and giving the acute angle ${dp(acute, 1)}° when the i component ${a} is negative.` : `Finding the angle with j instead of i, which gives ${dp(Math.abs(90 - theta), 1)}°.`, 'Having the calculator in radian mode.'],
      };
    },
  },
  {
    id: 'al-vec-parallel-find',
    exam: 'a-level',
    topicId: 'al-vectors',
    difficulty: 2,
    build: (r) => {
      const dim = r.pick([2, 3, 3]);
      const u = Array.from({ length: dim }, () => r.nonZero(-5, 5));
      const lam = r.pick([-3, -2, 2, 3]);
      const w = u.map((c) => c * lam);
      const idx = r.int(0, dim - 1);
      const sym = r.pick(['p', 't', 'q']);
      const inB = r.next() < 0.6;
      const ans = inB ? w[idx] : u[idx];
      const aStr = inB ? vec(u) : vecWith(u, idx, sym);
      const bStr = inB ? vecWith(w, idx, sym) : vec(w);
      const known = (idx + 1) % dim;
      const wrong = inB ? [new Frac(u[idx], lam).toString(), num(-w[idx]), num(u[idx] + lam)] : [num(lam * w[idx]), num(-u[idx]), num(w[idx])];
      return {
        prompt: `The vectors a = ${aStr} and b = ${bStr} are parallel. Find the value of ${sym}.`,
        answer: `${sym} = ${num(ans)}`,
        wrong: uniq(`${sym} = ${num(ans)}`, wrong.map((x) => `${sym} = ${x}`)),
        steps: [
          'Parallel vectors are scalar multiples: b = λa.',
          `Use a known pair of components: λ = ${w[known]} ÷ ${paren(u[known])} = ${lam}.`,
          inB ? `${sym} = λ × ${paren(u[idx])} = ${lam} × ${paren(u[idx])} = ${num(ans)}.` : `${sym} = ${w[idx]} ÷ λ = ${w[idx]} ÷ ${paren(lam)} = ${num(ans)}.`,
        ],
        pitfalls: [
          inB ? `Dividing by λ = ${lam} instead of multiplying.` : `Multiplying by λ = ${lam} instead of dividing.`,
          `Dropping the sign of λ = ${lam}${lam < 0 ? '; parallel vectors can point in opposite directions' : ''}.`,
        ],
      };
    },
  },
  {
    id: 'al-stat-binomial-exact',
    exam: 'a-level',
    topicId: 'al-statistics',
    difficulty: 2,
    build: (r) => {
      const n = r.int(6, 15);
      const p = r.pick([0.1, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.6, 0.7, 0.8]);
      let x = Math.min(n - 1, Math.max(1, Math.round(n * p) + r.int(-2, 2)));
      while (binom(n, p, x) < 0.002) x += x < n * p ? 1 : -1;
      const ans = dp(binom(n, p, x), 4);
      const ctx = r.pick([
        { s: `Each component made by a machine is faulty with probability ${p}, independently. A random sample of ${n} components is taken.`, q: `exactly ${x} are faulty` },
        { s: `A player scores each penalty with probability ${p}, independently. She takes ${n} penalties.`, q: `she scores exactly ${x}` },
        { s: `Seeds germinate independently with probability ${p}. A gardener plants ${n} seeds.`, q: `exactly ${x} germinate` },
        { s: `The random variable X ~ B(${n}, ${p}).`, q: `X = ${x}` },
      ]);
      return {
        prompt: `${ctx.s} Find the probability that ${ctx.q}. Give your answer to 4 decimal places.`,
        answer: ans,
        wrong: uniq(
          ans,
          [Math.pow(p, x) * Math.pow(1 - p, n - x), cumLE(n, p, x), choose(n, x) * Math.pow(p, n - x) * Math.pow(1 - p, x), cumGE(n, p, x), 1 - binom(n, p, x)].filter((v) => v >= 0.0005).map((v) => dp(v, 4)),
        ),
        steps: [
          `Let X ~ B(${n}, ${p}). P(X = ${x}) = C(${n}, ${x}) × ${p}${sup(x)} × ${num(1 - p)}${sup(n - x)}.`,
          `C(${n}, ${x}) = ${choose(n, x)}.`,
          `P(X = ${x}) = ${ans} (4 d.p.).`,
        ],
        pitfalls: [`Leaving out C(${n}, ${x}) = ${choose(n, x)}, the number of arrangements.`, `Giving P(X ≤ ${x}) from cumulative tables instead of P(X = ${x}).`],
      };
    },
  },
  {
    id: 'al-stat-binomial-mean-variance',
    exam: 'a-level',
    topicId: 'al-statistics',
    difficulty: 1,
    build: (r) => {
      const n = r.int(10, 60);
      const pt = r.int(1, 9);
      const p = pt / 10;
      const mean = (n * pt) / 10;
      const v = (n * pt * (10 - pt)) / 100;
      const ctx = r.pick([
        `X ~ B(${n}, ${p}).`,
        `A biased coin lands heads with probability ${p}. It is tossed ${n} times and X is the number of heads.`,
        `In a large school, ${pt * 10}% of students walk to school. X is the number who walk in a random sample of ${n} students.`,
      ]);
      const fmt = (m: number, s: string) => `E(X) = ${num(m)}, Var(X) = ${s}`;
      const ans = fmt(mean, num(v));
      return {
        prompt: `${ctx} Find E(X) and Var(X).`,
        answer: ans,
        wrong: uniq(ans, [fmt(mean, num(mean)), fmt(mean, num(Math.sqrt(v))), fmt(v, num(mean)), fmt((n * (10 - pt)) / 10, num(v)), fmt(mean, num((n * pt * pt) / 100))]),
        steps: ['For X ~ B(n, p): E(X) = np and Var(X) = np(1 − p).', `E(X) = ${n} × ${p} = ${num(mean)}.`, `Var(X) = ${n} × ${p} × ${num(1 - p)} = ${num(v)}.`],
        pitfalls: [`Giving the standard deviation ${num(Math.sqrt(v))} instead of the variance ${num(v)}.`, `Forgetting the factor (1 − p) = ${num(1 - p)} in the variance.`],
      };
    },
  },
  {
    id: 'al-stat-normal-standardise',
    exam: 'a-level',
    topicId: 'al-statistics',
    difficulty: 2,
    build: (r) => {
      const mu = r.int(20, 160);
      const sigma = r.int(2, 12);
      const z = r.pick([-2, -1.5, -1.25, -1, -0.75, -0.5, -0.25, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5]);
      const x = mu + z * sigma;
      const ctx = r.pick([
        { s: `The masses, X grams, of apples are modelled by X ~ N(${mu}, ${sigma * sigma}).`, u: ' g' },
        { s: `The times, X minutes, taken to finish a puzzle are modelled by X ~ N(${mu}, ${sigma * sigma}).`, u: ' minutes' },
        { s: `The random variable X ~ N(${mu}, ${sigma * sigma}).`, u: '' },
      ]);
      if (r.next() < 0.5) {
        return {
          prompt: `${ctx.s} Find the standardised value z for x = ${num(x)}.`,
          answer: `z = ${num(z)}`,
          wrong: uniq(`z = ${num(z)}`, [`z = ${num(z / sigma)}`, `z = ${num(-z)}`, `z = ${num(z * sigma)}`]),
          steps: [`σ² = ${sigma * sigma}, so σ = ${sigma}.`, `z = (x − μ)/σ = (${num(x)} − ${mu})/${sigma}.`, `= ${num(z * sigma)}/${sigma} = ${num(z)}.`],
          pitfalls: [`Dividing by the variance ${sigma * sigma} instead of σ = ${sigma}.`, `Working out μ − x, which flips the sign to ${num(-z)}.`],
        };
      }
      return {
        prompt: `${ctx.s} A value x has standardised value z = ${num(z)}. Find x.`,
        answer: `${num(x)}${ctx.u}`,
        wrong: uniq(`${num(x)}${ctx.u}`, [`${num(mu + z * sigma * sigma)}${ctx.u}`, `${num(mu - z * sigma)}${ctx.u}`, `${num(mu + z)}${ctx.u}`]),
        steps: [`σ² = ${sigma * sigma}, so σ = ${sigma}.`, 'Rearrange z = (x − μ)/σ to get x = μ + zσ.', `x = ${mu} + ${paren(z)} × ${sigma} = ${num(x)}.`],
        pitfalls: [`Using the variance ${sigma * sigma} as σ.`, `Subtracting zσ from μ, which gives ${num(mu - z * sigma)}.`],
      };
    },
  },
  {
    id: 'al-stat-binomial-hypothesis',
    exam: 'a-level',
    topicId: 'al-statistics',
    difficulty: 3,
    build: (r) => {
      for (;;) {
        const upper = r.next() < 0.55;
        const n = r.int(10, 20);
        const p0 = upper ? r.pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.4]) : r.pick([0.3, 0.35, 0.4, 0.45, 0.5, 0.6]);
        const alpha = r.pick([0.05, 0.05, 0.1]);
        let crit = -1;
        if (upper) {
          for (let x = 0; x <= n; x++) if (cumGE(n, p0, x) <= alpha) {
            crit = x;
            break;
          }
        } else {
          for (let x = n; x >= 0; x--) if (cumLE(n, p0, x) <= alpha) {
            crit = x;
            break;
          }
        }
        if (crit < 0) continue;
        const obs = crit + r.pick([-1, 0, 1]);
        if (obs < 0 || obs > n) continue;
        const pv = upper ? cumGE(n, p0, obs) : cumLE(n, p0, obs);
        if (Math.abs(pv - alpha) < 0.001) continue;
        const ge = upper ? '≥' : '≤';
        const stmt = (label: string, v: number, a: number) => `${label} = ${dp(v, 4)} ${v <= a ? '<' : '>'} ${a}, so ${v <= a ? 'reject H₀' : 'do not reject H₀'}`;
        const ans = stmt(`P(X ${ge} ${obs})`, pv, alpha);
        const pct = Math.round(p0 * 100);
        const ctx = upper
          ? r.pick([
              `A website owner believes that more than ${pct}% of visitors click on a new link. In a random sample of ${n} visitors, ${obs} click it.`,
              `A manager suspects that the proportion of faulty items is higher than the usual ${pct}%. In a sample of ${n} items, ${obs} are faulty.`,
              `A coach thinks a player now scores with probability greater than ${p0}. In ${n} attempts the player scores ${obs} times.`,
            ])
          : r.pick([
              `A supplier claims that ${pct}% of its bulbs flower. A gardener suspects the proportion is lower. She plants ${n} bulbs and ${obs} flower.`,
              `A survey company believes the proportion of people who recycle is less than ${pct}%. In a sample of ${n} people, ${obs} recycle.`,
              `A tester suspects a dice game is won with probability less than ${p0}. In ${n} games, ${obs} are won.`,
            ]);
        const otherTail = upper ? cumLE(n, p0, obs) : cumGE(n, p0, obs);
        const strict = upper ? cumGE(n, p0, obs + 1) : cumLE(n, p0, obs - 1);
        const cands = [
          stmt(`P(X = ${obs})`, binom(n, p0, obs), alpha),
          stmt(`P(X ${upper ? '≤' : '≥'} ${obs})`, otherTail, alpha),
          stmt(`P(X ${upper ? '>' : '<'} ${obs})`, strict, alpha),
        ];
        if (pv > alpha / 2 && pv <= alpha) cands.unshift(stmt(`P(X ${ge} ${obs})`, pv, alpha / 2));
        return {
          prompt: `${ctx} Test this claim at the ${alpha * 100}% significance level, using H₀: p = ${p0} and H₁: p ${upper ? '>' : '<'} ${p0}. Which line gives the correct test probability and conclusion?`,
          answer: ans,
          wrong: uniq(ans, cands),
          steps: [
            `Under H₀, X ~ B(${n}, ${p0}). The test is one-tailed, so look at P(X ${ge} ${obs}).`,
            `P(X ${ge} ${obs}) = ${dp(pv, 4)}.`,
            `The critical region is X ${ge} ${crit}, since P(X ${ge} ${crit}) = ${dp(upper ? cumGE(n, p0, crit) : cumLE(n, p0, crit), 4)} ≤ ${alpha}.`,
            pv <= alpha
              ? `${obs} is in the critical region, so reject H₀: there is evidence that p ${upper ? '>' : '<'} ${p0}.`
              : `${obs} is not in the critical region, so do not reject H₀: there is not enough evidence that p ${upper ? '>' : '<'} ${p0}.`,
          ],
          pitfalls: [`Using P(X = ${obs}) = ${dp(binom(n, p0, obs), 4)} instead of the tail probability P(X ${ge} ${obs}).`, `Comparing with ${alpha / 2} as if the test were two-tailed.`],
        };
      }
    },
  },
  {
    id: 'al-stat-frequency-mean',
    exam: 'a-level',
    topicId: 'al-statistics',
    difficulty: 1,
    build: (r) => {
      const N = r.pick([20, 25, 50]);
      const s = r.int(0, 2);
      const xs = [s, s + 1, s + 2, s + 3, s + 4];
      const cap = Math.floor((2 * N) / 5);
      let fs: number[] = [];
      for (;;) {
        fs = xs.slice(0, 4).map(() => r.int(1, cap));
        const last = N - fs.reduce((a, b) => a + b, 0);
        if (last >= 1 && last <= cap) {
          fs.push(last);
          break;
        }
      }
      const sfx = xs.reduce((a, x, i) => a + x * fs[i], 0);
      const ans = num(sfx / N);
      const ctx = r.pick([
        { x: 'Goals scored', who: `${N} football matches` },
        { x: 'Number of siblings', who: `${N} students` },
        { x: 'Books borrowed', who: `${N} library users in a week` },
        { x: 'Defects per sheet', who: `${N} sheets of glass` },
      ]);
      return {
        prompt: `The table shows data for ${ctx.who}. ${ctx.x}: ${xs.join(', ')}; Frequency: ${fs.join(', ')}. Find the mean.`,
        answer: ans,
        wrong: uniq(ans, [num(sfx / 5), num(s + 2), num(N / 5), num(sfx / (N - 1))]),
        steps: [`Σf = ${fs.join(' + ')} = ${N}.`, `Σfx = ${xs.map((x, i) => `${x}×${fs[i]}`).join(' + ')} = ${sfx}.`, `Mean = Σfx ÷ Σf = ${sfx} ÷ ${N} = ${ans}.`],
        pitfalls: [`Dividing Σfx = ${sfx} by the 5 categories instead of the total frequency ${N}.`, `Averaging the values ${xs.join(', ')} and ignoring the frequencies.`],
      };
    },
  },
  {
    id: 'al-proof-counterexample',
    exam: 'a-level',
    topicId: 'al-proof',
    difficulty: 1,
    build: (r) => {
      const kind = r.pick(['quadPlus', 'quadMinus', 'twoPlus', 'mersenne', 'threePlus']);
      let text = '';
      let domain: number[] = [];
      let f: (n: number) => number = (n) => n;
      if (kind === 'quadPlus' || kind === 'quadMinus') {
        const p = r.pick([5, 11, 17, 41]);
        const plus = kind === 'quadPlus';
        f = (n) => n * n + (plus ? n : -n) + p;
        text = `n² ${plus ? '+' : '−'} n + ${p} is prime for every positive integer n`;
        domain = Array.from({ length: p + 4 }, (_, i) => i + 1);
      } else if (kind === 'twoPlus') {
        f = (n) => Math.pow(2, n) + 1;
        text = '2ⁿ + 1 is prime for every positive integer n';
        domain = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      } else if (kind === 'mersenne') {
        f = (n) => Math.pow(2, n) - 1;
        text = '2ⁿ − 1 is prime whenever n is prime';
        domain = [2, 3, 5, 7, 11, 13, 17, 19, 23];
      } else {
        f = (n) => Math.pow(3, n) + 2;
        text = '3ⁿ + 2 is prime for every positive integer n';
        domain = [1, 2, 3, 4, 5, 6, 7, 8];
      }
      const bad = domain.filter((n) => !isPrime(f(n)));
      const good = domain.filter((n) => isPrime(f(n)));
      const fail = r.pick(bad);
      const holds = pickDistinct(r, good, 3);
      const listed = [fail, ...holds].sort((a, b) => a - b);
      const v = f(fail);
      const sf = smallestFactor(v);
      return {
        prompt: `Which value of n is a counterexample to the statement "${text}"? Choose from n = ${listed.join(', ')}.`,
        answer: `n = ${fail}`,
        wrong: holds.map((h) => `n = ${h}`),
        steps: [
          'A counterexample is a single value that makes the statement false.',
          `For n = ${fail}: the expression equals ${v} = ${sf} × ${v / sf}, which is not prime.`,
          `The other values give ${holds
            .slice()
            .sort((a, b) => a - b)
            .map((h) => f(h))
            .join(', ')}, which are all prime.`,
        ],
        pitfalls: [`Thinking that the primes found for n = ${holds.slice().sort((a, b) => a - b).join(', ')} prove the statement for every n.`, `Missing that ${v} has the factor ${sf}.`],
      };
    },
  },
  {
    id: 'al-proof-consecutive-sum',
    exam: 'a-level',
    topicId: 'al-proof',
    difficulty: 2,
    build: (r) => {
      const k = r.pick([3, 5, 7]);
      const d = r.int(1, 6);
      const dk = d * k;
      const m = (k - 1) / 2;
      const C = (d * k * (k - 1)) / 2;
      const f = (lead: number, c: number) => `${lead}(n ${signed(c)})`;
      const ans = `${dk}n + ${C} = ${f(dk, m)}`;
      const sumText =
        d === 1
          ? k === 3
            ? 'n + (n + 1) + (n + 2)'
            : `n + (n + 1) + … + (n + ${k - 1})`
          : k === 3
            ? `${d}n + ${d}(n + 1) + ${d}(n + 2)`
            : `${d}n + ${d}(n + 1) + … + ${d}(n + ${k - 1})`;
      const what = d === 1 ? `${k} consecutive integers` : `${k} consecutive multiples of ${d}`;
      return {
        prompt: `Let n be an integer. The sum of ${what}, starting at ${d === 1 ? 'n' : `${d}n`}, is ${sumText}. Which line correctly shows that this sum is a multiple of ${dk}?`,
        answer: ans,
        wrong: uniq(ans, [
          `${dk}n + ${dk * (k - 1)} = ${f(dk, k - 1)}`,
          `${dk}n + ${C} = ${f(dk, C)}`,
          d === 1 ? `${dk}n + ${dk * (m + 1)} = ${f(dk, m + 1)}` : `${k}n + ${k * m} = ${f(k, m)}`,
          `${dk}n − ${C} = ${f(dk, -m)}`,
        ]),
        steps: [
          `There are ${k} terms in n, giving ${dk}n.`,
          d === 1 ? `The constants are 0 + 1 + … + ${k - 1} = ${C}.` : `The constants are ${d}×(0 + 1 + … + ${k - 1}) = ${d}×${(k * (k - 1)) / 2} = ${C}.`,
          `${dk}n + ${C} = ${f(dk, m)}, and n + ${m} is an integer, so the sum is a multiple of ${dk}.`,
        ],
        pitfalls: [`Only adding the last constant ${d === 1 ? k - 1 : d * (k - 1)} instead of all ${k} constants.`, `Taking out ${dk} but leaving ${C} inside the bracket instead of ${C} ÷ ${dk} = ${m}.`],
      };
    },
  },
  {
    id: 'al-proof-odd-even',
    exam: 'a-level',
    topicId: 'al-proof',
    difficulty: 2,
    build: (r) => {
      const kind = r.pick(['product', 'product', 'sum', 'square']);
      const p = r.pick([1, 3, 5, 7]);
      const q = r.pick([1, 3, 5, 7]);
      if (kind === 'product') {
        const c = (p * q - 1) / 2;
        const form = (a: number, b: number, mn: number, cc: number, one: boolean) => `2(${expr([[mn, 'mn'], [a, 'm'], [b, 'n'], [cc, '']])})${one ? ' + 1' : ''}`;
        const ans = form(q, p, 2, c, true);
        return {
          prompt: `Given that m and n are integers, which expression shows that (2m + ${p})(2n + ${q}) is odd?`,
          answer: ans,
          wrong: uniq(ans, [form(p, q, 2, c, true), form(q, p, 1, c, true), form(q, p, 2, (p * q + 1) / 2, false), form(2 * q, 2 * p, 2, c, true)]),
          steps: [
            `Expand: (2m + ${p})(2n + ${q}) = 4mn + ${2 * q}m + ${2 * p}n + ${p * q}.`,
            `Write ${p * q} as ${p * q - 1} + 1 and take out 2: ${ans}.`,
            'The bracket is an integer, so the product has the form 2k + 1 and is odd.',
          ],
          pitfalls: [`Pairing ${p} with m instead of n when expanding: the m term is 2m × ${q} = ${2 * q}m.`, `Halving 4mn to mn instead of 2mn when taking out the factor 2.`],
        };
      }
      if (kind === 'sum') {
        const c = (p + q) / 2;
        const form = (cc: number, one: boolean) => `2(${expr([[1, 'm'], [1, 'n'], [cc, '']])})${one ? ' + 1' : ''}`;
        const ans = form(c, false);
        return {
          prompt: `Given that m and n are integers, which expression shows that (2m + ${p}) + (2n + ${q}) is even?`,
          answer: ans,
          wrong: uniq(ans, [form(p + q, false), form(c - 1, true), form(c + 1, false), `2(m + n)${p + q - 2 ? ` + ${p + q - 2}` : ''}`]),
          steps: [
            `Add: (2m + ${p}) + (2n + ${q}) = 2m + 2n + ${p + q}.`,
            `${p + q} = 2 × ${c}, so the sum is ${ans}.`,
            'The bracket is an integer, so the sum is a multiple of 2 and is even.',
          ],
          pitfalls: [`Taking out 2 but leaving ${p + q} inside the bracket instead of ${c}.`, 'Assuming the sum of two odd numbers is odd.'],
        };
      }
      const c = (p * p - 1) / 2;
      const form = (a: number, b: number, cc: number, one: boolean) => `2(${expr([[a, 'n²'], [b, 'n'], [cc, '']])})${one ? ' + 1' : ''}`;
      const ans = form(2, 2 * p, c, true);
      return {
        prompt: `Given that n is an integer, which expression shows that (2n + ${p})² is odd?`,
        answer: ans,
        wrong: uniq(ans, [form(2, p, c, true), form(2, 0, c, true), form(2, 2 * p, (p * p + 1) / 2, false), form(1, 2 * p, c, true)]),
        steps: [
          `Expand: (2n + ${p})² = 4n² + ${4 * p}n + ${p * p}.`,
          `Write ${p * p} as ${p * p - 1} + 1 and take out 2: ${ans}.`,
          'The bracket is an integer, so the square has the form 2k + 1 and is odd.',
        ],
        pitfalls: [`Squaring term by term to get 4n² + ${p * p}, which loses the ${4 * p}n term.`, `Writing ${2 * p}n for the middle term: (a + b)² has 2ab, which here is 2 × 2n × ${p} = ${4 * p}n.`],
      };
    },
  },
  {
    id: 'al-proof-exhaustion-cases',
    exam: 'a-level',
    topicId: 'al-proof',
    difficulty: 3,
    build: (r) => {
      const m = r.pick([3, 4, 5, 6]);
      const rr = r.int(1, m - 1);
      const residues = Array.from(new Set(Array.from({ length: m }, (_, i) => (i * i) % m))).sort((a, b) => a - b);
      const resText = residues.length === 2 ? `${residues[0]} or ${residues[1]}` : `${residues.slice(0, -1).join(', ')} or ${residues[residues.length - 1]}`;
      const q = Math.floor((rr * rr) / m);
      const rem = (rr * rr) % m;
      const line = (A: number, B: number, Cc: number, D: number) => `n² = ${m}(${expr([[A, 'k²'], [B, 'k'], [Cc, '']])})${D === 0 ? '' : ` + ${D}`}`;
      const ans = line(m, 2 * rr, q, rem);
      const raw: [number, number, number, number][] = [
        [m, rr, q, rem],
        [1, 2 * rr, q, rem],
        [m, 0, q, rem],
        [m, 2 * rr, q + 1, rem],
        [m, 2 * rr, q, (rem + 1) % m],
      ];
      const cands = raw.filter(([A, B, Cc, D]) => !(A === m && B === 2 * rr && m * Cc + D === rr * rr)).map(([A, B, Cc, D]) => line(A, B, Cc, D));
      return {
        prompt: `A proof by exhaustion shows that when a square number n² is divided by ${m}, the remainder is ${resText}. One case is n = ${m}k + ${rr}, where k is an integer. Which line is correct for this case?`,
        answer: ans,
        wrong: uniq(ans, cands),
        steps: [
          `n² = (${m}k + ${rr})² = ${m * m}k² + ${2 * m * rr}k + ${rr * rr}.`,
          `Split ${rr * rr} as ${m}×${q} + ${rem} and take out ${m}: ${ans.replace('n² = ', '')}.`,
          `So in this case the remainder is ${rem}, which is in the list ${resText}.`,
        ],
        pitfalls: [`Missing the middle term: (${m}k + ${rr})² is not ${m * m}k² + ${rr * rr}.`, `Leaving ${rr * rr} whole instead of writing it as ${m}×${q} + ${rem}, so the remainder is hidden.`],
      };
    },
  },
  {
    id: 'al-proof-flawed-step',
    exam: 'a-level',
    topicId: 'al-proof',
    difficulty: 2,
    build: (r) => {
      const kind = r.pick(['divide', 'root', 'expand', 'log']);
      let body = '';
      let bad = 1;
      let why = '';
      let pit = '';
      if (kind === 'divide') {
        const a = r.nonZero(-7, 7);
        const b = r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        body = `A student solves (x ${signed(a)})² = ${b}(x ${signed(a)}). Step 1: divide both sides by (x ${signed(a)}) to get x ${signed(a)} = ${b}. Step 2: so x = ${b - a}. Step 3: so the only solution is x = ${b - a}.`;
        bad = 1;
        why = `Step 1 divides by (x ${signed(a)}), which is zero when x = ${-a}, so the solution x = ${-a} is lost.`;
        pit = `Not checking what happens when x ${signed(a)} = 0, which gives the lost solution x = ${-a}.`;
      } else if (kind === 'root') {
        const s = r.int(2, 9);
        const c = r.int(1, 20);
        body = `A student solves x² + ${c} = ${s * s + c}. Step 1: subtract ${c} to get x² = ${s * s}. Step 2: take the square root to get x = ${s}. Step 3: so the only solution is x = ${s}.`;
        bad = 2;
        why = `Step 2 takes only the positive root; x² = ${s * s} gives x = ±${s}.`;
        pit = `Forgetting the negative root x = −${s}.`;
      } else if (kind === 'expand') {
        const a = r.int(2, 9);
        body = `A student claims (n + ${a})² − n² = ${a * a} for every n. Step 1: (n + ${a})² − n² = (n + ${a})(n + ${a}) − n². Step 2: = n² + ${a * a} − n². Step 3: = ${a * a}.`;
        bad = 2;
        why = `Step 2 expands (n + ${a})² as n² + ${a * a}; it should be n² + ${2 * a}n + ${a * a}.`;
        pit = `Squaring term by term and losing the ${2 * a}n term.`;
      } else {
        const base = r.pick([2, 3]);
        const a = r.int(2, 6);
        const e = r.int(3, 6);
        const sub = base === 2 ? '₂' : '₃';
        const pw = Math.pow(base, e);
        body = `A student solves log${sub} x + log${sub} ${a} = ${e}. Step 1: log${sub} x + log${sub} ${a} = log${sub}(${a}x). Step 2: so ${a}x = ${base}${sup(e)} = ${pw}. Step 3: so x = ${pw} − ${a} = ${pw - a}.`;
        bad = 3;
        why = `Step 3 subtracts ${a} instead of dividing by it; ${a}x = ${pw} gives x = ${new Frac(pw, a)}.`;
        pit = `Undoing a multiplication by ${a} with a subtraction.`;
      }
      const ans = `Step ${bad}`;
      return {
        prompt: `${body} Which is the first incorrect step?`,
        answer: ans,
        wrong: uniq(ans, ['Step 1', 'Step 2', 'Step 3', 'There is no error']),
        steps: ['Check each step on its own: does it follow from the line before, and is anything lost?', why, `So the first incorrect step is ${ans}.`],
        pitfalls: [pit, 'Blaming the final line, which only repeats the earlier mistake.'],
      };
    },
  },
  {
    id: 'al-expm-evaluate',
    exam: 'a-level',
    topicId: 'al-exponential-modelling',
    difficulty: 1,
    build: (r) => {
      const ctx = r.pick([
        { s: 'The number of bacteria, N, in a culture t hours after it is set up', v: 'N', p0: 50 * r.int(2, 18), k: r.pick([0.05, 0.08, 0.12, 0.15, 0.2, 0.25, 0.3]), pre: '', post: '', tu: 'hours' },
        { s: 'The value, £V, of a car t years after it is bought', v: 'V', p0: 500 * r.int(16, 60), k: r.pick([-0.08, -0.1, -0.12, -0.15, -0.18, -0.2, -0.25]), pre: '£', post: '', tu: 'years' },
        { s: 'The mass, m grams, of a radioactive sample t days after it is measured', v: 'm', p0: 10 * r.int(5, 40), k: r.pick([-0.02, -0.03, -0.05, -0.07, -0.1]), pre: '', post: ' g', tu: 'days' },
        { s: 'The population, P, of a town t years after 2010', v: 'P', p0: 100 * r.int(20, 200), k: r.pick([0.01, 0.015, 0.02, 0.03, 0.04, 0.05]), pre: '', post: '', tu: 'years' },
      ]);
      const T = r.int(2, 12);
      const val = (x: number) => `${ctx.pre}${Math.round(x)}${ctx.post}`;
      const ans = val(ctx.p0 * Math.exp(ctx.k * T));
      return {
        prompt: `${ctx.s} is modelled by ${ctx.v} = ${ctx.p0}${kExp(ctx.k)}. Find ${ctx.v} when t = ${T}, to the nearest whole number.`,
        answer: ans,
        wrong: uniq(ans, [ctx.p0 * Math.exp(-ctx.k * T), ctx.p0 * (1 + ctx.k * T), ctx.p0 * Math.pow(1 + ctx.k, T), ctx.p0 * Math.exp(ctx.k) * T].filter((x) => x > 0).map(val)),
        steps: [
          `Substitute t = ${T}: ${ctx.v} = ${ctx.p0}e^(${fx(ctx.k)} × ${T}) = ${ctx.p0}e^(${fx(ctx.k * T)}).`,
          `e^(${fx(ctx.k * T)}) = ${dp(Math.exp(ctx.k * T), 4)}.`,
          `${ctx.v} = ${ctx.p0} × ${dp(Math.exp(ctx.k * T), 4)} = ${ans} (nearest whole number).`,
        ],
        pitfalls: [`Treating the model as a fixed ${ctx.k < 0 ? 'drop' : 'rise'} of ${num(Math.abs(ctx.k) * 100)}% of ${ctx.p0} each unit of time.`, `Losing the sign of k = ${fx(ctx.k)}, which turns ${ctx.k < 0 ? 'decay into growth' : 'growth into decay'}.`],
      };
    },
  },
  {
    id: 'al-expm-find-k',
    exam: 'a-level',
    topicId: 'al-exponential-modelling',
    difficulty: 2,
    build: (r) => {
      const growth = r.next() < 0.6;
      const p0 = growth ? 20 * r.int(5, 40) : 50 * r.int(4, 40);
      const kTrue = growth ? r.int(4, 40) / 100 : -r.int(3, 30) / 100;
      const T = r.int(2, 10);
      let p1 = Math.round(p0 * Math.exp(kTrue * T));
      if (p1 === p0) p1 += growth ? 1 : -1;
      const k = Math.log(p1 / p0) / T;
      const ctx = growth
        ? r.pick([
            { s: `The number of followers, F, of a new account t weeks after launch is modelled by F = ${p0}e^(kt).`, v: 'F' },
            { s: `The number of cells, N, in a sample t hours after it is prepared is modelled by N = ${p0}e^(kt).`, v: 'N' },
          ])
        : r.pick([
            { s: `The temperature excess, D °C, of a drink t minutes after it is poured is modelled by D = ${p0}e^(kt).`, v: 'D' },
            { s: `The amount of a drug, A mg, in the blood t hours after a dose is modelled by A = ${p0}e^(kt).`, v: 'A' },
          ]);
      const ans = `k = ${dp(k, 3)}`;
      return {
        prompt: `${ctx.s} When t = ${T}, ${ctx.v} = ${p1}. Find the value of k, giving your answer to 3 decimal places.`,
        answer: ans,
        wrong: uniq(ans, [`k = ${dp((p1 / p0 - 1) / T, 3)}`, `k = ${dp(Math.log(p1 / p0), 3)}`, `k = ${dp(-k, 3)}`, `k = ${dp(Math.log(Math.abs(p1 - p0)) / T, 3)}`]),
        steps: [
          `${p1} = ${p0}e^(${T}k), so e^(${T}k) = ${p1}/${p0}.`,
          `Take natural logs: ${T}k = ln(${p1}/${p0}) = ${dp(Math.log(p1 / p0), 4)}.`,
          `k = ${dp(Math.log(p1 / p0), 4)} ÷ ${T} = ${dp(k, 3)} (3 d.p.).`,
        ],
        pitfalls: [`Forgetting to divide ln(${p1}/${p0}) by ${T}.`, `Writing ln(${p0}/${p1}), which gives the wrong sign.`],
      };
    },
  },
  {
    id: 'al-expm-half-life',
    exam: 'a-level',
    topicId: 'al-exponential-modelling',
    difficulty: 2,
    build: (r) => {
      const growth = r.next() < 0.5;
      const k = r.int(2, 35) / 100;
      const p0 = growth ? 100 * r.int(2, 50) : 10 * r.int(4, 60);
      const ctx = growth
        ? r.pick([
            { s: `The number of users, U, of an app t months after launch is modelled by U = ${p0}e^(${k}t).`, tu: 'months', what: 'the number of users to double' },
            { s: `The number of bacteria, N, t hours after a culture is started is modelled by N = ${p0}e^(${k}t).`, tu: 'hours', what: 'the number of bacteria to double' },
          ])
        : r.pick([
            { s: `The mass, m grams, of a radioactive substance after t years is modelled by m = ${p0}e^(−${k}t).`, tu: 'years', what: 'the mass to halve (the half-life)' },
            { s: `The concentration, C mg/l, of a medicine t hours after an injection is modelled by C = ${p0}e^(−${k}t).`, tu: 'hours', what: 'the concentration to halve' },
          ]);
      const t = Math.log(2) / k;
      const fmt = (x: number) => `${dp(x, 1)} ${ctx.tu}`;
      const ans = fmt(t);
      return {
        prompt: `${ctx.s} Find the time taken for ${ctx.what}, to 1 decimal place.`,
        answer: ans,
        wrong: uniq(ans, [fmt(0.5 / k), fmt(Math.log(growth ? 2 * p0 : p0 / 2) / k), fmt(2 / k), fmt(1 / k)]),
        steps: [
          growth ? `Set ${p0}e^(${k}t) = ${2 * p0}, so e^(${k}t) = 2.` : `Set ${p0}e^(−${k}t) = ${p0 / 2}, so e^(−${k}t) = 1/2, which means e^(${k}t) = 2.`,
          `${k}t = ln 2 = ${dp(Math.log(2), 4)}.`,
          `t = ${dp(Math.log(2), 4)} ÷ ${k} = ${ans}.`,
        ],
        pitfalls: [`Taking ln of ${growth ? 2 * p0 : p0 / 2} rather than of the ratio 2; the starting amount ${p0} cancels.`, `Treating the change as linear and using 0.5 ÷ ${k}.`],
      };
    },
  },
  {
    id: 'al-expm-initial-value',
    exam: 'a-level',
    topicId: 'al-exponential-modelling',
    difficulty: 2,
    build: (r) => {
      const growth = r.next() < 0.5;
      const k = growth ? r.int(2, 30) / 100 : -r.int(5, 30) / 100;
      const T = r.int(2, 10);
      const V = growth ? 10 * r.int(30, 900) : 100 * r.int(20, 150);
      const ctx = growth
        ? r.pick([
            { s: `The number of visitors per day, N, to a website t weeks after launch is modelled by N = A${kExp(k)}.`, v: 'N', pre: '' },
            { s: `The area, R cm², covered by mould t days after it is first seen is modelled by R = A${kExp(k)}.`, v: 'R', pre: '' },
          ])
        : r.pick([
            { s: `The value, £V, of a machine t years after it is bought is modelled by V = A${kExp(k)}.`, v: 'V', pre: '£' },
            { s: `The number of fish, F, in a lake t years after pollution begins is modelled by F = A${kExp(k)}.`, v: 'F', pre: '' },
          ]);
      const fmt = (x: number) => `${ctx.pre}${Math.round(x)}`;
      const A = V * Math.exp(-k * T);
      const ans = `A = ${fmt(A)}`;
      return {
        prompt: `${ctx.s} When t = ${T}, ${ctx.v} = ${ctx.pre}${V}. Find the value of A, to the nearest whole number.`,
        answer: ans,
        wrong: uniq(ans, [V * Math.exp(k * T), V * Math.exp(-k), V * (1 - k * T), V * Math.exp(-k * (T - 1))].filter((x) => x > 0).map((x) => `A = ${fmt(x)}`)),
        steps: [
          `Substitute: ${V} = Ae^(${fx(k)} × ${T}) = Ae^(${fx(k * T)}).`,
          `A = ${V} ÷ e^(${fx(k * T)}) = ${V} × e^(${fx(-k * T)}).`,
          `A = ${V} × ${dp(Math.exp(-k * T), 4)} = ${fmt(A)} (nearest whole number). A is the value when t = 0.`,
        ],
        pitfalls: [`Multiplying ${V} by e^(${fx(k * T)}) instead of dividing.`, `Using e^(${fx(k)}) and forgetting to multiply k by t = ${T}.`],
      };
    },
  },
  {
    id: 'al-expm-time-to-reach',
    exam: 'a-level',
    topicId: 'al-exponential-modelling',
    difficulty: 3,
    build: (r) => {
      if (r.next() < 0.5) {
        const R = r.int(15, 25);
        const D = 5 * r.int(10, 16);
        const k = r.int(2, 9) / 100;
        const Y = R + 5 * r.int(2, Math.floor(D / 5) - 2);
        const t = Math.log(D / (Y - R)) / k;
        const fmt = (x: number) => `${dp(x, 1)} minutes`;
        const ans = fmt(t);
        return {
          prompt: `A cup of tea cools so that its temperature, θ °C, t minutes after it is made is modelled by θ = ${R} + ${D}e^(−${k}t). Find the time taken for the temperature to fall to ${Y} °C, to 1 decimal place.`,
          answer: ans,
          wrong: uniq(ans, [fmt(Math.log((R + D) / Y) / k), fmt(Math.log(D / Y) / k), fmt(Math.log(D - (Y - R)) / k), fmt(((D - (Y - R)) / D) / k)]),
          steps: [
            `${Y} = ${R} + ${D}e^(−${k}t), so ${D}e^(−${k}t) = ${Y - R}.`,
            `e^(−${k}t) = ${new Frac(Y - R, D)}, so −${k}t = ln(${new Frac(Y - R, D)}).`,
            `t = ln(${new Frac(D, Y - R)}) ÷ ${k} = ${ans}.`,
          ],
          pitfalls: [`Not subtracting the room temperature ${R} before dividing by ${D}.`, `Dividing ${Y} by ${R + D} instead of isolating the exponential term.`],
        };
      }
      const P0 = 100 * r.int(2, 40);
      const k = r.int(3, 30) / 100;
      const mult = r.pick([1.5, 2.5, 3, 4, 5, 6]);
      const X = P0 * mult;
      const t = Math.log(mult) / k;
      const tu = r.pick(['years', 'months', 'weeks']);
      const fmt = (x: number) => `${dp(x, 1)} ${tu}`;
      const ans = fmt(t);
      return {
        prompt: `The number of members, M, of a club t ${tu} after it opens is modelled by M = ${P0}e^(${k}t). Find the time taken for M to reach ${X}, to 1 decimal place.`,
        answer: ans,
        wrong: uniq(ans, [fmt(Math.log(X - P0) / k), fmt((mult - 1) / k), fmt(Math.log(X) / k)]),
        steps: [
          `${X} = ${P0}e^(${k}t), so e^(${k}t) = ${X}/${P0} = ${num(mult)}.`,
          `${k}t = ln ${num(mult)} = ${dp(Math.log(mult), 4)}.`,
          `t = ${dp(Math.log(mult), 4)} ÷ ${k} = ${ans}.`,
        ],
        pitfalls: [`Taking ln(${X}) without first dividing by ${P0}.`, `Subtracting ${P0} from ${X} instead of dividing.`],
      };
    },
  },
];
