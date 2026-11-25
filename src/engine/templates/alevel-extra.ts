import { Frac, gcd, num, paren, poly, signed, sup, Template, term } from '../core';

function sub(n: number): string {
  const map = '₀₁₂₃₄₅₆₇₈₉';
  return String(n)
    .split('')
    .map((c) => map[Number(c)] ?? c)
    .join('');
}

function lineEq(a: number, b: number, c: number): string {
  const g = gcd(gcd(a, b), c);
  let [A, B, C] = [a / g, b / g, c / g];
  if (A < 0 || (A === 0 && B < 0)) [A, B, C] = [-A, -B, -C];
  return `${term(A, 1, 'x', true)}${term(B, 1, 'y', A === 0)}${term(C, 0)} = 0`;
}

function sf3(v: number): string {
  return v.toPrecision(3);
}

function co(f: Frac): string {
  if (f.n === 1 && f.d === 1) return '';
  return f.isInt() ? f.toString() : `(${f})`;
}

function fpow(f: Frac, n: number): Frac {
  let out = new Frac(1);
  for (let i = 0; i < n; i++) out = out.mul(f);
  return out;
}

const gm = (f: Frac) => (f.isInt() ? f.toString() : `(${f})`);

const fx = (root: number) => (root === 0 ? 'x' : `(x ${signed(-root)})`);

const pt = (x: number, y: number) => `(${num(x)}, ${num(y)})`;

export const ALEVEL_EXTRA_TEMPLATES: Template[] = [
  {
    id: 'al-complete-square',
    exam: 'a-level',
    topicId: 'al-algebra',
    difficulty: 1,
    build: (r) => {
      const p = r.nonZero(-6, 6);
      const q = r.nonZero(-12, 12);
      const b = 2 * p;
      const c = p * p + q;
      const form = (h: number, k: number) => `(x ${signed(h)})² ${signed(k)}`;
      return {
        prompt: `Write ${poly([1, b, c])} in the form (x + p)² + q, where p and q are constants.`,
        answer: form(p, q),
        wrong: [form(p, c), form(-p, q), form(b, c - b * b)],
        steps: [
          `Halve the coefficient of x: ${b} ÷ 2 = ${p}, so use (x ${signed(p)})².`,
          `(x ${signed(p)})² = ${poly([1, b, p * p])}.`,
          `Adjust the constant: ${c} − ${p * p} = ${q}, so ${poly([1, b, c])} = ${form(p, q)}.`,
        ],
        pitfalls: [`Keeping the constant as ${c} instead of subtracting ${paren(p)}² = ${p * p}.`, `Putting ${b} inside the bracket instead of half of it, ${p}.`],
      };
    },
  },
  {
    id: 'al-factor-theorem',
    exam: 'a-level',
    topicId: 'al-algebra',
    difficulty: 2,
    build: (r) => {
      const k = r.nonZero(-3, 3);
      const a = r.nonZero(-6, 6);
      let q = r.nonZero(-9, 9);
      let c = -(k ** 3 + a * k * k + q * k);
      if (c === 0) {
        q += q > 0 ? 1 : -1;
        c = -(k ** 3 + a * k * k + q * k);
      }
      const K = k ** 3 + q * k + c;
      const k2 = k * k === 1 ? '' : String(k * k);
      return {
        prompt: `f(x) = x³ + ax² ${signed(q)}x ${signed(c)}, where a is a constant. Given that (x ${signed(-k)}) is a factor of f(x), find the value of a.`,
        answer: `a = ${a}`,
        wrong: [`a = ${new Frac(k ** 3 + q * k - c, k * k)}`, `a = ${-a}`, `a = ${new Frac(-K, k)}`],
        steps: [
          `By the factor theorem, f(${k}) = 0.`,
          `${paren(k)}³ + a·${paren(k)}² ${signed(q)}·${paren(k)} ${signed(c)} = 0, so ${k2}a ${signed(K)} = 0.`,
          `a = ${new Frac(-K, k * k)}.`,
        ],
        pitfalls: [
          `Substituting x = ${-k} instead of x = ${k}: the factor (x ${signed(-k)}) means f(${k}) = 0.`,
          `Dropping the sign when cubing ${paren(k)}: ${paren(k)}³ = ${k ** 3}.`,
        ],
      };
    },
  },
  {
    id: 'al-quadratic-inequality',
    exam: 'a-level',
    topicId: 'al-algebra',
    difficulty: 3,
    build: (r) => {
      let p = 0;
      let q = 0;
      do {
        p = r.int(-7, 5);
        q = p + r.int(1, 7);
      } while (p === 0 || q === 0 || p + q === 0);
      const less = r.next() < 0.5;
      const op = less ? '<' : '>';
      const b = -(p + q);
      const c = p * q;
      const inside = `${p} < x < ${q}`;
      const outside = `x < ${p} or x > ${q}`;
      return {
        prompt: `Find the set of values of x for which ${poly([1, b, 0])} ${op} ${-c}.`,
        answer: less ? inside : outside,
        wrong: less ? [outside, `${-q} < x < ${-p}`, `x < ${q}`] : [inside, `x < ${-q} or x > ${-p}`, `x > ${q}`],
        steps: [
          `Rearrange so one side is zero: ${poly([1, b, c])} ${op} 0.`,
          `Factorise: (x ${signed(-p)})(x ${signed(-q)}) ${op} 0, so the critical values are x = ${p} and x = ${q}.`,
          `The parabola opens upwards, so it is ${less ? 'below' : 'above'} the x-axis ${less ? 'between' : 'outside'} the roots: ${less ? inside : outside}.`,
        ],
        pitfalls: [
          `Choosing the wrong region: ${op} 0 for an upward parabola means ${less ? 'between' : 'outside'} ${p} and ${q}.`,
          `Reading the critical values as ${-p} and ${-q} straight from the brackets (x ${signed(-p)}) and (x ${signed(-q)}).`,
        ],
      };
    },
  },
  {
    id: 'al-gradient-fractional-power',
    exam: 'a-level',
    topicId: 'al-differentiation',
    difficulty: 1,
    build: (r) => {
      const a = r.pick([2, 4, 6, -2, -4]);
      const b = r.pick([-8, -6, -5, -3, -2, 2, 3, 4, 5, 7, 8]);
      const t = r.pick([2, 3, 4]);
      const x = t * t;
      const c1 = (3 * a) / 2;
      const grad = new Frac(c1 * t).add(new Frac(b, 2 * t));
      return {
        prompt: `Find the gradient of the curve y = ${a}x^(3/2) ${b < 0 ? '−' : '+'} ${Math.abs(b)}√x at the point where x = ${x}.`,
        answer: grad.toString(),
        wrong: [new Frac(a * t ** 3 + b * t).toString(), new Frac(c1 * t).add(new Frac(b * t, 2)).toString(), new Frac(c1 * x).add(new Frac(b, 2 * x)).toString()],
        steps: [
          `Write √x as x^(1/2): y = ${a}x^(3/2) ${signed(b)}x^(1/2).`,
          `dy/dx = ${c1}x^(1/2) ${signed(b)}·½x^(−1/2) = ${c1}√x ${signed(b)}/(2√x).`,
          `At x = ${x}, √x = ${t}: dy/dx = ${c1}·${t} ${signed(b)}/${2 * t} = ${grad}.`,
        ],
        pitfalls: [
          `Differentiating ${b}√x as ${b}·½√x: the new power is −1/2, so it becomes ${b}/(2√x).`,
          `Substituting x = ${x} instead of √x = ${t} into ${c1}√x.`,
        ],
      };
    },
  },
  {
    id: 'al-diff-exp-ln',
    exam: 'a-level',
    topicId: 'al-differentiation',
    difficulty: 2,
    build: (r) => {
      const A = r.pick([2, 3, 4, 5, -2, -3]);
      const k = r.pick([-3, -2, 2, 3, 4]);
      const B = r.pick([2, 3, 4, 5, 6, -2, -3, -4]);
      const c = r.pick([2, 3, 4, 5]);
      const sg = B < 0 ? '−' : '+';
      const bb = Math.abs(B);
      return {
        prompt: `Given that y = ${A}e^(${k}x) ${sg} ${bb} ln(${c}x), find dy/dx.`,
        answer: `dy/dx = ${A * k}e^(${k}x) ${sg} ${bb}/x`,
        wrong: [`dy/dx = ${A}e^(${k}x) ${sg} ${bb}/x`, `dy/dx = ${A * k}e^(${k}x) ${sg} ${bb * c}/x`, `dy/dx = ${A * k}e^(${k}x) ${sg} ${bb}/(${c}x)`],
        steps: [
          `The derivative of e^(${k}x) is ${k}e^(${k}x), so ${A}e^(${k}x) gives ${A * k}e^(${k}x).`,
          `ln(${c}x) = ln ${c} + ln x, and ln ${c} is a constant, so the derivative of ln(${c}x) is 1/x.`,
          `dy/dx = ${A * k}e^(${k}x) ${sg} ${bb}/x.`,
        ],
        pitfalls: [`Multiplying by ${c} when differentiating ln(${c}x): the ${c} cancels and leaves 1/x.`, `Leaving ${A}e^(${k}x) unchanged instead of multiplying by ${k}.`],
      };
    },
  },
  {
    id: 'al-second-derivative-nature',
    exam: 'a-level',
    topicId: 'al-differentiation',
    difficulty: 2,
    build: (r) => {
      const k = r.pick([-2, -1, 1, 2]);
      const p = r.int(-4, 3);
      const q = p + 2 * r.int(1, 3);
      const c = r.int(-9, 9);
      const s = p + q;
      const coefs = [k, (-3 * k * s) / 2, 3 * k * p * q, c];
      const at = r.pick([p, q]);
      const d2 = 6 * k * at - 3 * k * s;
      const nat = d2 > 0 ? 'Minimum' : 'Maximum';
      const opp = d2 > 0 ? 'Maximum' : 'Minimum';
      return {
        prompt: `The curve y = ${poly(coefs)} has stationary points where x = ${p} and x = ${q}. Use the second derivative to determine the nature of the stationary point where x = ${at}.`,
        answer: `${nat} point (d²y/dx² = ${d2})`,
        wrong: [`${opp} point (d²y/dx² = ${d2})`, `${opp} point (d²y/dx² = ${-d2})`, 'Point of inflection (d²y/dx² = 0)'],
        steps: [
          `dy/dx = ${poly([3 * k, -3 * k * s, 3 * k * p * q])}.`,
          `d²y/dx² = ${poly([6 * k, -3 * k * s])}.`,
          `At x = ${at}: d²y/dx² = ${6 * k}·${paren(at)} ${signed(-3 * k * s)} = ${d2}.`,
          `${d2} ${d2 > 0 ? '>' : '<'} 0, so it is a ${nat.toLowerCase()} point.`,
        ],
        pitfalls: [
          `Reading d²y/dx² = ${d2} as a ${opp.toLowerCase()}: positive means minimum, negative means maximum.`,
          `Substituting x = ${at} into dy/dx, which is 0 at every stationary point and says nothing about the nature.`,
        ],
      };
    },
  },
  {
    id: 'al-normal-equation',
    exam: 'a-level',
    topicId: 'al-differentiation',
    difficulty: 3,
    build: (r) => {
      let a = 1;
      let b = 0;
      let p = 1;
      let m = 0;
      do {
        a = r.nonZero(-3, 3);
        b = r.int(-6, 6);
        p = r.nonZero(-3, 3);
        m = 2 * a * p + b;
      } while (m === 0);
      const c = r.int(-9, 9);
      const y0 = a * p * p + b * p + c;
      const nm = new Frac(-1, m);
      return {
        prompt: `Find an equation of the normal to the curve y = ${poly([a, b, c])} at the point where x = ${p}. Give your answer in the form ax + by + c = 0, where a, b and c are integers.`,
        answer: lineEq(1, m, -p - m * y0),
        wrong: [lineEq(m, -1, y0 - m * p), lineEq(1, -m, m * y0 - p), lineEq(1, m, p + m * y0)],
        steps: [
          `dy/dx = ${poly([2 * a, b])}. At x = ${p}, the tangent gradient is ${m} and y = ${y0}.`,
          `The normal is perpendicular to the tangent, so its gradient is −1/${paren(m)} = ${nm}.`,
          `y ${signed(-y0)} = ${gm(nm)}(x ${signed(-p)}), which rearranges to ${lineEq(1, m, -p - m * y0)}.`,
        ],
        pitfalls: [`Using the tangent gradient ${m} instead of the normal gradient ${nm}.`, `Forgetting to find y = ${y0} at x = ${p} before writing the line.`],
      };
    },
  },
  {
    id: 'al-integrate-fractional-power',
    exam: 'a-level',
    topicId: 'al-integration',
    difficulty: 1,
    build: (r) => {
      const m = r.int(1, 4);
      const a = 3 * m;
      const b = r.nonZero(-6, 6);
      const sg = b < 0 ? '−' : '+';
      const opp = b < 0 ? '+' : '−';
      const bb = Math.abs(b);
      return {
        prompt: `Find ∫ (${a}√x ${sg} ${bb}/√x) dx.`,
        answer: `${2 * m}x^(3/2) ${sg} ${2 * bb}√x + c`,
        wrong: [
          `${co(new Frac(3 * a, 2))}x^(3/2) ${sg} ${co(new Frac(bb, 2))}√x + c`,
          `${2 * m}x^(3/2) ${sg} ${co(new Frac(bb, 2))}√x + c`,
          `${2 * m}x^(3/2) ${opp} ${2 * bb}√x + c`,
        ],
        steps: [
          `Write the integrand with powers: ${a}x^(1/2) ${signed(b)}x^(−1/2).`,
          `Add 1 to each power and divide by the new power: ${a}x^(3/2) ÷ 3/2 ${signed(b)}x^(1/2) ÷ 1/2.`,
          `= ${2 * m}x^(3/2) ${sg} ${2 * bb}√x + c.`,
        ],
        pitfalls: [
          `Multiplying by the new power 3/2 instead of dividing by it, which gives ${co(new Frac(3 * a, 2))}x^(3/2).`,
          `Dividing ${b}x^(1/2) by 2 instead of by 1/2, which gives ${co(new Frac(b, 2))}√x instead of ${2 * b}√x.`,
        ],
      };
    },
  },
  {
    id: 'al-area-between-roots',
    exam: 'a-level',
    topicId: 'al-integration',
    difficulty: 3,
    build: (r) => {
      const k = r.pick([1, 2, 3]);
      const p = r.int(-4, 3);
      const w = r.int(2, 6);
      const q = p + w;
      const below = r.next() < 0.5;
      const s = below ? k : -k;
      const coefs = [s, -s * (p + q), s * p * q];
      const area = new Frac(k * w ** 3, 6);
      const integral = below ? area.neg() : area;
      const lead = s === 1 ? '' : s === -1 ? '−' : String(s);
      return {
        prompt: `The curve y = ${poly(coefs)} meets the x-axis at two points. Find the area of the finite region enclosed by the curve and the x-axis.`,
        answer: area.toString(),
        wrong: [area.neg().toString(), new Frac(k * w ** 3, 3).toString(), new Frac(k * w ** 3, 2).toString()],
        steps: [
          `Factorise: y = ${lead}${fx(p)}${fx(q)}, so the curve meets the axis at x = ${p} and x = ${q}.`,
          `Integrate: ∫ y dx = ${poly([new Frac(s, 3), new Frac(-s * (p + q), 2), s * p * q, 0]).replace(/(\d+\/\d+)x/g, '($1)x')}.`,
          `Evaluate from ${p} to ${q}: the integral is ${integral}${below ? ', negative because the region is below the x-axis' : ''}.`,
          `The area is ${area}.`,
        ],
        pitfalls: below
          ? [`Giving ${area.neg()} as the area: the region is below the x-axis, so take the size.`, p === 0 ? `Integrating from ${q} to 0, which flips the sign of the integral.` : `Integrating from 0 to ${q} instead of between the roots ${p} and ${q}.`]
          : [p === 0 ? `Integrating from ${q} to 0, which flips the sign of the integral.` : `Integrating from 0 to ${q} instead of between the roots ${p} and ${q}.`, `Forgetting to divide x³ by 3 and x² by 2 when integrating ${poly(coefs)}.`],
      };
    },
  },
  {
    id: 'al-curve-from-gradient',
    exam: 'a-level',
    topicId: 'al-integration',
    difficulty: 2,
    build: (r) => {
      const A = r.nonZero(-2, 2);
      const B = r.int(-3, 3);
      const C = r.int(-6, 6);
      const D = r.nonZero(-9, 9);
      const p = r.nonZero(-2, 3);
      const Fp = A * p ** 3 + B * p * p + C * p;
      const y0 = Fp + D;
      const D3 = y0 - (3 * A * p ** 3 + 2 * B * p * p + C * p);
      return {
        prompt: `A curve has gradient function dy/dx = ${poly([3 * A, 2 * B, C])} and passes through the point (${p}, ${y0}). Find the equation of the curve.`,
        answer: `y = ${poly([A, B, C, D])}`,
        wrong: [`y = ${poly([A, B, C, 0])}`, `y = ${poly([A, B, C, y0 + Fp])}`, `y = ${poly([3 * A, 2 * B, C, D3])}`],
        steps: [
          `Integrate: y = ${poly([A, B, C, 0])} + c.`,
          `Substitute (${p}, ${y0}): ${y0} = ${Fp} + c.`,
          `c = ${D}, so y = ${poly([A, B, C, D])}.`,
        ],
        pitfalls: [`Leaving out + c, which gives a curve that does not pass through (${p}, ${y0}).`, `Solving ${y0} = ${Fp} + c as c = ${y0 + Fp} instead of ${D}.`],
      };
    },
  },
  {
    id: 'al-trapezium-rule',
    exam: 'a-level',
    topicId: 'al-integration',
    difficulty: 2,
    build: (r) => {
      const h = r.pick([0.5, 1, 2]);
      const n = r.pick([4, 5]);
      const x0 = r.int(0, 2);
      const xs = Array.from({ length: n + 1 }, (_, i) => x0 + i * h);
      const ys = Array.from({ length: n + 1 }, () => r.int(1, 12));
      const ends = ys[0] + ys[n];
      const mids = ys.slice(1, n);
      const M = mids.reduce((s, v) => s + v, 0);
      const est = (h / 2) * (ends + 2 * M);
      return {
        prompt: `The table gives values of y for some values of x. x: ${xs.map(num).join(', ')}; y: ${ys.join(', ')}. Use the trapezium rule with all of these values to estimate ∫ from ${x0} to ${num(xs[n])} of y dx.`,
        answer: num(est),
        wrong: [num(h * (ends + 2 * M)), num((h / 2) * (ends + M)), num(h * (ends + M))],
        steps: [
          `There are ${n} strips, each of width h = ${num(h)}.`,
          `End values: ${ys[0]} + ${ys[n]} = ${ends}. Middle values: ${mids.join(' + ')} = ${M}.`,
          `Estimate = ${num(h)}/2 × (${ends} + 2 × ${M}) = ${num(est)}.`,
        ],
        pitfalls: [`Forgetting to double the middle values ${mids.join(', ')}.`, `Using the number of strips ${n} or of values ${n + 1} as h instead of the width ${num(h)}.`],
      };
    },
  },
  {
    id: 'al-exponential-solve-3sf',
    exam: 'a-level',
    topicId: 'al-exponentials-logs',
    difficulty: 2,
    build: (r) => {
      const a = r.pick([2, 3, 4, 5, 6, 7]);
      let b = r.int(5, 90);
      const isPow = (v: number) => {
        let t = a;
        while (t < v) t *= a;
        return t === v;
      };
      while (isPow(b)) b++;
      const x = Math.log(b) / Math.log(a);
      return {
        prompt: `Solve ${a}ˣ = ${b}, giving your answer to 3 significant figures.`,
        answer: `x = ${sf3(x)}`,
        wrong: [`x = ${sf3(Math.log(a) / Math.log(b))}`, `x = ${sf3(Math.log10(b) / Math.log(a))}`, `x = ${sf3(b / a)}`],
        steps: [`Take logs of both sides: x log ${a} = log ${b}.`, `x = log ${b} ÷ log ${a} = ${x.toFixed(5)}...`, `To 3 s.f., x = ${sf3(x)}.`],
        pitfalls: [`Dividing the other way: log ${a} ÷ log ${b} = ${sf3(Math.log(a) / Math.log(b))}.`, `Mixing log₁₀ ${b} with ln ${a} in the same fraction.`],
      };
    },
  },
  {
    id: 'al-combine-logs',
    exam: 'a-level',
    topicId: 'al-exponentials-logs',
    difficulty: 1,
    build: (r) => {
      const a = r.pick([2, 3, 5]);
      const m = r.pick([2, 3]);
      const b = r.int(2, 9);
      const am = a ** m;
      const N = am * b;
      const divs: number[] = [];
      for (let d = 2; d < N; d++) if (N % d === 0 && d !== b && d !== a) divs.push(d);
      const c = r.pick(divs);
      const v = N / c;
      return {
        prompt: `Write ${m} log ${a} + log ${b} − log ${c} as a single logarithm.`,
        answer: `log ${v}`,
        wrong: [`log ${new Frac(m * a * b, c)}`, `log ${N * c}`, `${m} log ${new Frac(a * b, c)}`],
        steps: [
          `Power law: ${m} log ${a} = log ${a}${sup(m)} = log ${am}.`,
          `Add by multiplying: log ${am} + log ${b} = log ${N}.`,
          `Subtract by dividing: log ${N} − log ${c} = log (${N} ÷ ${c}) = log ${v}.`,
        ],
        pitfalls: [
          m * a === am ? `Multiplying by ${c} instead of dividing when subtracting log ${c}.` : `Writing ${m} log ${a} as log ${m * a} instead of log ${am}.`,
          `Turning log ${N} − log ${c} into log ${N} ÷ log ${c}, which is not a law of logs.`,
        ],
      };
    },
  },
  {
    id: 'al-change-of-base',
    exam: 'a-level',
    topicId: 'al-exponentials-logs',
    difficulty: 2,
    build: (r) => {
      const p = r.pick([2, 3, 5]);
      const maxPow = p === 2 ? 7 : p === 3 ? 5 : 3;
      const m = r.int(2, Math.min(3, maxPow - 1));
      let n = r.int(1, maxPow);
      while (n % m === 0) n = n === maxPow ? 1 : n + 1;
      const base = p ** m;
      const arg = p ** n;
      const ans = new Frac(n, m);
      return {
        prompt: `Use a change of base to find the exact value of log${sub(base)} ${arg}.`,
        answer: ans.toString(),
        wrong: [new Frac(m, n).toString(), new Frac(arg, base).toString(), String(n - m)],
        steps: [
          `Write both numbers as powers of ${p}: ${base} = ${p}${sup(m)} and ${arg} = ${p}${n === 1 ? '' : sup(n)}.`,
          `log${sub(base)} ${arg} = log${sub(p)} ${arg} ÷ log${sub(p)} ${base} = ${n} ÷ ${m}.`,
          `= ${ans}.`,
        ],
        pitfalls: [`Inverting the answer to ${new Frac(m, n)}: the log of the base goes on the bottom.`, `Dividing ${arg} by ${base} instead of comparing the powers ${n} and ${m}.`],
      };
    },
  },
  {
    id: 'al-log-quadratic',
    exam: 'a-level',
    topicId: 'al-exponentials-logs',
    difficulty: 3,
    build: (r) => {
      const opts: { b: number; n: number; s: number; t: number }[] = [];
      for (const b of [2, 3, 6]) {
        for (let n = 2; b ** n <= 800; n++) {
          const total = b ** n;
          for (let s = 2; s * s < total; s++) if (total % s === 0) opts.push({ b, n, s, t: total / s });
        }
      }
      const o = r.pick(opts);
      const total = o.b ** o.n;
      const k = o.t - o.s;
      const plus = r.next() < 0.5;
      const pm = plus ? '+' : '−';
      const ans = plus ? o.s : o.t;
      const neg = plus ? -o.t : -o.s;
      const other = plus ? o.t : o.s;
      const slip = new Frac(plus ? total - k : total + k, 2);
      return {
        prompt: `Solve log${sub(o.b)} x + log${sub(o.b)}(x ${pm} ${k}) = ${o.n}.`,
        answer: `x = ${ans}`,
        wrong: [`x = ${ans} or x = ${neg}`, `x = ${slip}`, `x = ${other}`],
        steps: [
          `Combine: log${sub(o.b)}(x(x ${pm} ${k})) = ${o.n}, so x(x ${pm} ${k}) = ${o.b}${sup(o.n)} = ${total}.`,
          `x² ${pm} ${k}x − ${total} = 0 factorises as (x ${signed(-ans)})(x ${signed(-neg)}) = 0.`,
          `x = ${ans} or x = ${neg}. Reject ${neg}, because the log of a negative number is not defined, so x = ${ans}.`,
        ],
        pitfalls: [
          `Keeping x = ${neg}: log${sub(o.b)}(${neg}) is not defined, so that root must be rejected.`,
          `Writing log${sub(o.b)} x + log${sub(o.b)}(x ${pm} ${k}) as log${sub(o.b)}(2x ${pm} ${k}), which gives x = ${slip}.`,
        ],
      };
    },
  },
  {
    id: 'al-geometric-sigma',
    exam: 'a-level',
    topicId: 'al-sequences',
    difficulty: 3,
    build: (r) => {
      const c = r.int(1, 6);
      const k = r.pick([2, 3, -2]);
      const n = r.int(4, k === 3 ? 7 : 9);
      const S = (c * k * (k ** n - 1)) / (k - 1);
      const lead = c === 1 ? '' : `${c} × `;
      return {
        prompt: `Find the value of Σ from r = 1 to ${n} of ${lead}${paren(k)}ʳ.`,
        answer: num(S),
        wrong: [num((c * (k ** (n + 1) - 1)) / (k - 1)), num((c * (k ** n - 1)) / (k - 1)), num(c * k ** n)],
        steps: [
          `This is a geometric series with first term a = ${c * k} (r = 1), common ratio ${k} and ${n} terms.`,
          `Sₙ = a(rⁿ − 1)/(r − 1) = ${c * k}(${paren(k)}${sup(n)} − 1)/(${k} − 1).`,
          `= ${c * k} × ${k ** n - 1} ÷ ${k - 1} = ${num(S)}.`,
        ],
        pitfalls: [`Taking the first term as ${c} (the r = 0 term) instead of ${c * k} (the r = 1 term).`, `Counting ${n + 1} terms instead of ${n}.`],
      };
    },
  },
  {
    id: 'al-geometric-find-ratio',
    exam: 'a-level',
    topicId: 'al-sequences',
    difficulty: 2,
    build: (r) => {
      const rr = r.pick([new Frac(2), new Frac(3), new Frac(-2), new Frac(1, 2), new Frac(-1, 2), new Frac(1, 3), new Frac(-3)]);
      const p = r.int(1, 3);
      const g = rr.n < 0 ? 3 : r.pick([2, 3]);
      const q = p + g;
      const k = r.int(1, 5) * (r.next() < 0.3 ? -1 : 1);
      const a = new Frac(k * rr.d ** (q - 1));
      const up = a.mul(fpow(rr, p - 1));
      const uq = a.mul(fpow(rr, q - 1));
      const ratio = uq.div(up);
      return {
        prompt: `A geometric sequence has u${sub(p)} = ${up} and u${sub(q)} = ${uq}.${g === 2 ? ' The common ratio is positive.' : ''} Find the common ratio.`,
        answer: rr.toString(),
        wrong: [ratio.toString(), uq.sub(up).div(g).toString(), new Frac(rr.d, rr.n).toString()],
        steps: [
          `u${sub(q)} ÷ u${sub(p)} = r${sup(g)}, because ${g} steps separate the terms.`,
          `r${sup(g)} = ${uq} ÷ ${paren(up.value())} = ${ratio}.`,
          `r = ${g === 2 ? '√' : '∛'}(${ratio}) = ${rr}.`,
        ],
        pitfalls: [
          `Stopping at r${sup(g)} = ${ratio} without taking the ${g === 2 ? 'square' : 'cube'} root.`,
          `Treating the sequence as arithmetic and dividing the difference ${uq.sub(up)} by ${g}.`,
        ],
      };
    },
  },
  {
    id: 'al-recurrence-relation',
    exam: 'a-level',
    topicId: 'al-sequences',
    difficulty: 2,
    build: (r) => {
      const a = r.pick([2, 3, -2, -3]);
      const b = r.nonZero(-6, 6);
      let u1 = r.int(-4, 5);
      if ((1 - a) * u1 === b) u1 += 1;
      const t = r.pick([3, 4]);
      const u = [0, u1];
      for (let i = 2; i <= t + 1; i++) u.push(a * u[i - 1] + b);
      let alt = u1;
      for (let i = 2; i <= t; i++) alt = a * (alt + b);
      const steps = [] as string[];
      for (let i = 2; i <= t; i++) steps.push(`u${sub(i)} = ${a}·${paren(u[i - 1])} ${signed(b)} = ${u[i]}.`);
      return {
        prompt: `A sequence is defined by uₙ₊₁ = ${a}uₙ ${signed(b)}, with u₁ = ${u1}. Find u${sub(t)}.`,
        answer: num(u[t]),
        wrong: [num(u[t - 1]), num(u[t + 1]), num(alt)],
        steps,
        pitfalls: [
          `Stopping at u${sub(t - 1)} = ${u[t - 1]}: reaching u${sub(t)} takes ${t - 1} applications of the rule.`,
          `Working out ${a}(uₙ ${signed(b)}) instead of ${a}uₙ ${signed(b)}, which gives ${alt}.`,
        ],
      };
    },
  },
  {
    id: 'al-exact-trig-values',
    exam: 'a-level',
    topicId: 'al-trigonometry',
    difficulty: 1,
    build: (r) => {
      const vals: Record<string, Record<number, string>> = {
        sin: { 30: '1/2', 45: '√2/2', 60: '√3/2' },
        cos: { 30: '√3/2', 45: '√2/2', 60: '1/2' },
        tan: { 30: '√3/3', 45: '1', 60: '√3' },
      };
      const base = r.pick([30, 45, 60]);
      const fn = r.pick(['sin', 'cos', 'tan']);
      const quad = r.int(1, 4);
      const theta = [base, 180 - base, 180 + base, 360 - base][quad - 1];
      const positive = fn === 'sin' ? quad <= 2 : fn === 'cos' ? quad === 1 || quad === 4 : quad === 1 || quad === 3;
      const mag = vals[fn][base];
      const coFn = fn === 'sin' ? 'cos' : fn === 'cos' ? 'sin' : 'tan';
      const coMag = fn === 'tan' ? vals.tan[90 - base] : vals[coFn][base];
      const sg = (s: boolean, v: string) => (s ? '' : '−') + v;
      const ans = sg(positive, mag);
      const pool = [sg(!positive, mag), sg(positive, coMag), sg(!positive, coMag), ...(fn === 'tan' ? [sg(positive, '√3'), sg(positive, '√3/3'), sg(!positive, '√3')] : [sg(positive, '1/2'), sg(positive, '√3/2'), sg(!positive, '√2/2')])];
      return {
        prompt: `Find the exact value of ${fn} ${theta}°.`,
        answer: ans,
        wrong: pool.filter((w) => w !== ans),
        steps: [
          quad === 1 ? `${theta}° is in the first quadrant, so it is its own reference angle.` : `${theta}° lies in quadrant ${quad}, with reference angle ${base}°.`,
          `${fn} is ${positive ? 'positive' : 'negative'} in that quadrant (CAST).`,
          `${fn} ${base}° = ${mag}, so ${fn} ${theta}° = ${ans}.`,
        ],
        pitfalls: [
          `Missing the sign: ${fn} is ${positive ? 'positive' : 'negative'} in the quadrant that contains ${theta}°.`,
          coMag === mag
            ? `Using a reference angle other than ${base}° for ${theta}°.`
            : fn === 'tan'
              ? `Using tan ${90 - base}° = ${coMag} instead of tan ${base}° = ${mag}.`
              : `Using the ${coFn} value ${coMag} for ${base}° in place of the ${fn} value ${mag}.`,
        ],
      };
    },
  },
  {
    id: 'al-sine-cosine-rule',
    exam: 'a-level',
    topicId: 'al-trigonometry',
    difficulty: 2,
    build: (r) => {
      const rad = Math.PI / 180;
      if (r.next() < 0.5) {
        const b = r.int(4, 15);
        const c = r.int(4, 15);
        const A = r.pick([25, 30, 35, 40, 50, 55, 65, 70, 75, 100, 110, 115, 120, 130, 140]);
        const sq = b * b + c * c - 2 * b * c * Math.cos(A * rad);
        const ans = Math.sqrt(sq);
        const radMode = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(A));
        return {
          prompt: `In triangle PQR, PQ = ${c} cm, PR = ${b} cm and angle QPR = ${A}°. Find the length of QR, giving your answer to 1 decimal place.`,
          answer: `${ans.toFixed(1)} cm`,
          wrong: [
            `${Math.sqrt(b * b + c * c + 2 * b * c * Math.cos(A * rad)).toFixed(1)} cm`,
            `${radMode.toFixed(1)} cm`,
            `${Math.sqrt(b * b + c * c - b * c * Math.cos(A * rad)).toFixed(1)} cm`,
          ],
          steps: [
            'Two sides and the angle between them are known, so use the cosine rule.',
            `QR² = ${b}² + ${c}² − 2 × ${b} × ${c} × cos ${A}° = ${sq.toFixed(2)}.`,
            `QR = √${sq.toFixed(2)} = ${ans.toFixed(1)} cm (1 d.p.).`,
          ],
          pitfalls: [`Leaving the calculator in radians, which gives ${radMode.toFixed(1)} cm.`, `Adding 2 × ${b} × ${c} × cos ${A}° instead of subtracting it.`],
        };
      }
      let A = 0;
      let B = 0;
      do {
        A = r.int(5, 22) * 5;
        B = r.int(5, 22) * 5;
      } while (A === B || A + B > 160);
      const C = 180 - A - B;
      const b = r.int(5, 20);
      const ans = (b * Math.sin(A * rad)) / Math.sin(B * rad);
      return {
        prompt: `In triangle ABC, AC = ${b} cm, angle BAC = ${A}° and angle ABC = ${B}°. Find the length of BC, giving your answer to 1 decimal place.`,
        answer: `${ans.toFixed(1)} cm`,
        wrong: [
          `${((b * Math.sin(B * rad)) / Math.sin(A * rad)).toFixed(1)} cm`,
          `${((b * Math.sin(C * rad)) / Math.sin(B * rad)).toFixed(1)} cm`,
          `${(b * Math.sin(A * rad)).toFixed(1)} cm`,
        ],
        steps: [
          `BC is opposite angle A and AC is opposite angle B, so use the sine rule: BC/sin ${A}° = ${b}/sin ${B}°.`,
          `BC = ${b} × sin ${A}° ÷ sin ${B}° = ${ans.toFixed(1)} cm (1 d.p.).`,
        ],
        pitfalls: [`Pairing ${b} cm with sin ${A}° instead of sin ${B}°, the angle opposite it.`, `Using angle ACB = ${C}° instead of angle BAC = ${A}°.`],
      };
    },
  },
  {
    id: 'al-arc-sector-radians',
    exam: 'a-level',
    topicId: 'al-trigonometry',
    difficulty: 2,
    build: (r) => {
      const rad = r.int(3, 15);
      const th = r.int(3, 25) / 10;
      const ctx = r.pick([
        { what: 'A sector of a circle', u: 'cm' },
        { what: 'A fan-shaped piece of card', u: 'cm' },
        { what: 'A sector-shaped flower bed', u: 'm' },
      ]);
      const ask = r.pick(['arc', 'area', 'perimeter'] as const);
      const arc = rad * th;
      const area = 0.5 * rad * rad * th;
      const per = 2 * rad + arc;
      const deg = (th / 360) * 2 * Math.PI * rad;
      const L = (v: number) => `${num(v)} ${ctx.u}`;
      const S = (v: number) => `${num(v)} ${ctx.u}²`;
      const base = `${ctx.what} has radius ${rad} ${ctx.u} and angle ${num(th)} radians at the centre.`;
      if (ask === 'arc') {
        return {
          prompt: `${base} Find the length of its arc.`,
          answer: L(arc),
          wrong: [L(area), L(deg), L(per)],
          steps: ['With the angle in radians, arc length s = rθ.', `s = ${rad} × ${num(th)} = ${num(arc)} ${ctx.u}.`],
          pitfalls: [`Treating ${num(th)} as degrees and using θ/360 × 2πr, which gives ${num(deg)}.`, `Using ½r²θ, which is the area, not the arc length.`],
        };
      }
      if (ask === 'area') {
        return {
          prompt: `${base} Find its area.`,
          answer: S(area),
          wrong: [S(rad * rad * th), S(arc), S((th / 360) * Math.PI * rad * rad)],
          steps: ['With the angle in radians, area = ½r²θ.', `Area = ½ × ${rad}² × ${num(th)} = ${num(area)} ${ctx.u}².`],
          pitfalls: [`Forgetting the ½ and giving ${rad}² × ${num(th)} = ${num(rad * rad * th)}.`, `Treating ${num(th)} as degrees in θ/360 × πr².`],
        };
      }
      return {
        prompt: `${base} Find its perimeter.`,
        answer: L(per),
        wrong: [L(arc), L(rad + arc), L(2 * rad + area)],
        steps: [`Arc length = rθ = ${rad} × ${num(th)} = ${num(arc)} ${ctx.u}.`, `Perimeter = two radii + arc = 2 × ${rad} + ${num(arc)} = ${num(per)} ${ctx.u}.`],
        pitfalls: [`Giving only the arc, ${num(arc)}, and leaving out the two radii.`, `Adding one radius instead of two, which gives ${num(rad + arc)}.`],
      };
    },
  },
  {
    id: 'al-trig-quadratic-sin',
    exam: 'a-level',
    topicId: 'al-trigonometry',
    difficulty: 3,
    build: (r) => {
      const e = r.pick([1, -1]);
      const k = r.pick([2, 3, -2, -3]);
      const useCos = r.next() < 0.5;
      const B = -(2 * k + e);
      const C = e * k;
      const sinEq = `2sin²θ ${signed(B)} sin θ ${signed(C)} = 0`;
      const cosEq = `2cos²θ ${signed(-B)} sin θ${C + 2 === 0 ? '' : ` ${signed(-(C + 2))}`} = 0`;
      const ans = e > 0 ? 'θ = 30°, 150°' : 'θ = 210°, 330°';
      const wrong = e > 0 ? ['θ = 210°, 330°', 'θ = 30°', 'θ = 30°, 330°'] : ['θ = 30°, 150°', 'θ = 330°', 'θ = 150°, 210°'];
      const steps = [
        `Factorise: (2 sin θ ${e > 0 ? '−' : '+'} 1)(sin θ ${signed(-k)}) = 0.`,
        `sin θ = ${k} has no solutions because −1 ≤ sin θ ≤ 1, so sin θ = ${e > 0 ? '1/2' : '−1/2'}.`,
        e > 0 ? 'θ = 30° or θ = 180° − 30° = 150°.' : 'θ = 180° + 30° = 210° or θ = 360° − 30° = 330°.',
      ];
      if (useCos) steps.unshift(`Replace cos²θ with 1 − sin²θ and rearrange: ${sinEq}.`);
      return {
        prompt: `Solve ${useCos ? cosEq : sinEq} for 0° ≤ θ < 360°.`,
        answer: ans,
        wrong,
        steps,
        pitfalls: [
          `Trying to solve sin θ = ${k}: its size is greater than 1, so it gives no angles.`,
          useCos
            ? 'Replacing cos²θ with 1 + sin²θ instead of 1 − sin²θ.'
            : e > 0
              ? 'Giving only 30° and missing 180° − 30° = 150°.'
              : 'Stopping at the calculator value −30°, which is outside 0° ≤ θ < 360°.',
        ],
      };
    },
  },
  {
    id: 'al-midpoint-distance',
    exam: 'a-level',
    topicId: 'al-coordinate-geometry',
    difficulty: 1,
    build: (r) => {
      if (r.next() < 0.5) {
        const tri = r.pick([
          [3, 4, 5],
          [5, 12, 13],
          [6, 8, 10],
          [8, 15, 17],
          [7, 24, 25],
        ]);
        const swap = r.next() < 0.5;
        const dx = swap ? tri[1] : tri[0];
        const dy = swap ? tri[0] : tri[1];
        const d = tri[2];
        const x1 = r.int(-6, 6);
        const y1 = r.int(-6, 6);
        const x2 = x1 + (r.next() < 0.5 ? -dx : dx);
        const y2 = y1 + (r.next() < 0.5 ? -dy : dy);
        const sumSq = (x1 + x2) ** 2 + (y1 + y2) ** 2;
        return {
          prompt: `Find the distance between the points A(${x1}, ${y1}) and B(${x2}, ${y2}).`,
          answer: String(d),
          wrong: [String(dx + dy), String(d * d), sumSq === d * d ? String(d + 1) : `√${sumSq}`],
          steps: [`Differences: x changes by ${dx} and y changes by ${dy}.`, `AB² = ${dx}² + ${dy}² = ${d * d}.`, `AB = √${d * d} = ${d}.`],
          pitfalls: [`Adding the differences, ${dx} + ${dy} = ${dx + dy}, instead of using Pythagoras.`, `Forgetting the square root and giving ${d * d}.`],
        };
      }
      let x1 = 0;
      let y1 = 0;
      let x2 = 0;
      let y2 = 0;
      do {
        x1 = r.int(-9, 9);
        y1 = r.int(-9, 9);
        x2 = r.int(-9, 9);
        y2 = r.int(-9, 9);
      } while (x1 === x2 || y1 === y2);
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      return {
        prompt: `Find the midpoint of the line segment joining P(${x1}, ${y1}) and Q(${x2}, ${y2}).`,
        answer: pt(mx, my),
        wrong: [pt((x2 - x1) / 2, (y2 - y1) / 2), pt(x1 + x2, y1 + y2), pt(my, mx)],
        steps: [`Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2).`, `= ((${x1} + ${paren(x2)})/2, (${y1} + ${paren(y2)})/2) = ${pt(mx, my)}.`],
        pitfalls: [`Subtracting the coordinates instead of adding them, which gives ${pt((x2 - x1) / 2, (y2 - y1) / 2)}.`, `Forgetting to halve, which gives ${pt(x1 + x2, y1 + y2)}.`],
      };
    },
  },
  {
    id: 'al-line-through-two-points',
    exam: 'a-level',
    topicId: 'al-coordinate-geometry',
    difficulty: 2,
    build: (r) => {
      let x1 = 0;
      let y1 = 0;
      let x2 = 0;
      let y2 = 0;
      do {
        x1 = r.int(-8, 8);
        y1 = r.int(-8, 8);
        x2 = r.int(-8, 8);
        y2 = r.int(-8, 8);
      } while (x1 === x2 || y1 === y2);
      const dx = x2 - x1;
      const dy = y2 - y1;
      const m = new Frac(dy, dx);
      const ans = lineEq(dy, -dx, dx * y1 - dy * x1);
      return {
        prompt: `Find an equation of the straight line through A(${x1}, ${y1}) and B(${x2}, ${y2}). Give your answer in the form ax + by + c = 0, where a, b and c are integers.`,
        answer: ans,
        wrong: [lineEq(dx, -dy, dy * y1 - dx * x1), lineEq(dy, dx, -dy * x1 - dx * y1), lineEq(dy, -dx, dy * x1 - dx * y1)],
        steps: [
          `Gradient m = (${y2} − ${paren(y1)}) ÷ (${x2} − ${paren(x1)}) = ${m}.`,
          `y ${signed(-y1)} = ${gm(m)}(x ${signed(-x1)}).`,
          `Clear fractions and collect every term on one side: ${ans}.`,
        ],
        pitfalls: [`Using ${new Frac(dx, dy)} (change in x over change in y) as the gradient.`, `Losing a sign when moving y ${signed(-y1)} across to the other side.`],
      };
    },
  },
  {
    id: 'al-circle-tangent',
    exam: 'a-level',
    topicId: 'al-coordinate-geometry',
    difficulty: 3,
    build: (r) => {
      const h = r.nonZero(-6, 6);
      const k = r.nonZero(-6, 6);
      const u = r.nonZero(-5, 5);
      const v = r.nonZero(-5, 5);
      const R2 = u * u + v * v;
      const px = h + u;
      const py = k + v;
      const F = h * h + k * k - R2;
      const circle =
        r.next() < 0.5
          ? `(x ${signed(-h)})² + (y ${signed(-k)})² = ${R2}`
          : `x² + y² ${signed(-2 * h)}x ${signed(-2 * k)}y${F === 0 ? '' : ` ${signed(F)}`} = 0`;
      const ans = lineEq(u, v, -(u * px + v * py));
      return {
        prompt: `The point P(${px}, ${py}) lies on the circle ${circle}. Find an equation of the tangent to the circle at P, in the form ax + by + c = 0, where a, b and c are integers.`,
        answer: ans,
        wrong: [lineEq(v, -u, -(v * px - u * py)), lineEq(u, v, -(u * h + v * k)), lineEq(u, -v, -(u * px - v * py))],
        steps: [
          `The centre is C(${h}, ${k}), so the radius CP has gradient ${v} ÷ ${paren(u)} = ${new Frac(v, u)}.`,
          `The tangent is perpendicular to CP, so its gradient is ${new Frac(-u, v)}.`,
          `y ${signed(-py)} = ${gm(new Frac(-u, v))}(x ${signed(-px)}), which rearranges to ${ans}.`,
        ],
        pitfalls: [`Using the gradient of the radius, ${new Frac(v, u)}, instead of the perpendicular gradient ${new Frac(-u, v)}.`, `Drawing the line through the centre (${h}, ${k}) instead of through P.`],
      };
    },
  },
  {
    id: 'al-newton-friction',
    exam: 'a-level',
    topicId: 'al-mechanics',
    difficulty: 1,
    build: (r) => {
      const acc = r.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]);
      const m = r.int(2, 12);
      const F = r.int(3, 30);
      const P = m * acc + F;
      const obj = r.pick(['box', 'crate', 'sledge', 'trolley']);
      const u = (v: number) => `${num(v)} m s⁻²`;
      return {
        prompt: `A ${obj} of mass ${m} kg is pulled along rough horizontal ground by a horizontal force of ${num(P)} N. The friction force on the ${obj} is ${F} N. Find the acceleration of the ${obj}.`,
        answer: u(acc),
        wrong: [u((P + F) / m), u(P / m), u(m / (P - F))],
        steps: [`Resultant force = ${num(P)} − ${F} = ${num(P - F)} N.`, `F = ma: ${num(P - F)} = ${m}a.`, `a = ${num(P - F)} ÷ ${m} = ${num(acc)} m s⁻².`],
        pitfalls: [`Ignoring friction and using ${num(P)} ÷ ${m} = ${num(P / m)}.`, `Adding the friction ${F} N to the pull instead of subtracting it.`],
      };
    },
  },
  {
    id: 'al-velocity-time-distance',
    exam: 'a-level',
    topicId: 'al-mechanics',
    difficulty: 2,
    build: (r) => {
      const V = r.int(6, 25);
      const t1 = r.int(2, 10);
      const t2 = r.int(5, 30);
      const t3 = r.int(2, 10);
      const T = t1 + t2 + t3;
      const dist = (V * (t2 + T)) / 2;
      const veh = r.pick(['car', 'tram', 'train', 'bus']);
      const m = (v: number) => `${num(v)} m`;
      return {
        prompt: `A ${veh} starts from rest and accelerates uniformly to ${V} m s⁻¹ in ${t1} s. It travels at this speed for ${t2} s, then decelerates uniformly to rest in a further ${t3} s. Find the total distance travelled.`,
        answer: m(dist),
        wrong: [m(V * T), m(V * t2), m((V * T) / 2)],
        steps: [
          `The velocity-time graph is a trapezium with parallel sides ${t2} s and ${T} s, and height ${V} m s⁻¹.`,
          `Distance = area = ½ × (${t2} + ${T}) × ${V}.`,
          `= ${num(dist)} m.`,
        ],
        pitfalls: [`Multiplying ${V} by the total time ${T} s as if the speed were constant all the way.`, `Using only the constant-speed part, ${V} × ${t2} = ${V * t2} m.`],
      };
    },
  },
  {
    id: 'al-pulley-acceleration',
    exam: 'a-level',
    topicId: 'al-mechanics',
    difficulty: 2,
    build: (r) => {
      const S = r.pick([4, 5, 7, 10, 14]);
      const M = r.int(Math.floor(S / 2) + 1, S - 1);
      const m = S - M;
      const d = M - m;
      const f = r.pick([1, 0.5, 2]);
      const acc = (9.8 * d) / S;
      const u = (v: number) => `${num(v)} m s⁻²`;
      return {
        prompt: `Particles of mass ${num(M * f)} kg and ${num(m * f)} kg are attached to the ends of a light inextensible string that passes over a smooth fixed pulley. The particles are released from rest with the string taut and both parts vertical. Taking g = 9.8 m s⁻², find the acceleration of the particles.`,
        answer: u(acc),
        wrong: [u((9.8 * d) / M), u((9.8 * M) / S), u((10 * d) / S)],
        steps: [
          `Heavier particle (moving down): ${num(M * f)}g − T = ${num(M * f)}a.`,
          `Lighter particle (moving up): T − ${num(m * f)}g = ${num(m * f)}a.`,
          `Add to remove T: ${num(d * f)}g = ${num(S * f)}a, so a = ${num(d * f)} × 9.8 ÷ ${num(S * f)} = ${num(acc)} m s⁻².`,
        ],
        pitfalls: [`Dividing by ${num(M * f)} instead of the total mass ${num(S * f)}: both particles accelerate together.`, `Using g = 10 instead of 9.8, which gives ${num((10 * d) / S)}.`],
      };
    },
  },
  {
    id: 'al-moments-beam',
    exam: 'a-level',
    topicId: 'al-mechanics',
    difficulty: 3,
    build: (r) => {
      const L = r.int(2, 6);
      let d2 = r.int(1, 2 * L - 1);
      if (d2 === L) d2 = L + 1;
      const d = d2 / 2;
      const q = r.int(20, 45);
      const P = 2 * L * q;
      const W = 2 * r.int(10, 60);
      const RB = W / 2 + 2 * q * d;
      const RA = W + P - RB;
      const askB = r.next() < 0.5;
      const beam = r.pick(['plank', 'beam', 'rod']);
      const load = r.pick(['A child', 'A box', 'A person', 'A sack of sand']);
      const N = (v: number) => `${num(v)} N`;
      const ans = askB ? RB : RA;
      const other = askB ? RA : RB;
      const noBeam = askB ? (P * d) / L : (P * (L - d)) / L;
      return {
        prompt: `A uniform ${beam} AB has length ${L} m and weight ${W} N. It rests horizontally on two supports, one at A and one at B. ${load} of weight ${P} N is at the point C on AB, where AC = ${num(d)} m. Find the reaction force at ${askB ? 'B' : 'A'}.`,
        answer: N(ans),
        wrong: [N(other), N(noBeam), N((W + P) / 2)],
        steps: askB
          ? [
              `Take moments about A: R_B × ${L} = ${W} × ${num(L / 2)} + ${P} × ${num(d)}.`,
              `${L}R_B = ${num((W * L) / 2 + P * d)}, so R_B = ${num(RB)} N.`,
              `Check: R_A = ${W + P} − ${num(RB)} = ${num(RA)} N.`,
            ]
          : [
              `Take moments about B: R_A × ${L} = ${W} × ${num(L / 2)} + ${P} × ${num(L - d)}.`,
              `${L}R_A = ${num((W * L) / 2 + P * (L - d))}, so R_A = ${num(RA)} N.`,
              `Check: R_B = ${W + P} − ${num(RA)} = ${num(RB)} N.`,
            ],
        pitfalls: [
          `Forgetting the ${beam}'s own weight, ${W} N, acting at its midpoint ${num(L / 2)} m from A.`,
          `Using the distance ${num(askB ? L - d : d)} m instead of ${num(askB ? d : L - d)} m, which gives the reaction at ${askB ? 'A' : 'B'}, ${num(other)} N.`,
        ],
      };
    },
  },
];
