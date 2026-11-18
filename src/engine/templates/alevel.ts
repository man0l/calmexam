import { Frac, num, paren, poly, signed, sup, Template } from '../core';

function choose(n: number, k: number): number {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

export const ALEVEL_TEMPLATES: Template[] = [
  {
    id: 'al-stationary-point',
    exam: 'a-level',
    topicId: 'al-differentiation',
    difficulty: 2,
    build: (r) => {
      const a = r.nonZero(-3, 3);
      const h = r.nonZero(-5, 5);
      const k = r.int(-9, 9);
      const b = -2 * a * h;
      const c = a * h * h + k;
      const pt = (x: number, y: number) => `(${num(x)}, ${num(y)})`;
      return {
        prompt: `Find the coordinates of the stationary point of the curve y = ${poly([a, b, c])}.`,
        answer: pt(h, k),
        wrong: [pt(-h, k), pt(h, c), pt(-h, a * h * h + 2 * a * h * h + c)],
        steps: [
          `Differentiate: dy/dx = ${poly([2 * a, b])}.`,
          `Set dy/dx = 0: ${2 * a}x = ${-b}, so x = ${h}.`,
          `Substitute back: y = ${a}·${paren(h)}² ${signed(b)}·${paren(h)} ${signed(c)} = ${k}.`,
        ],
        pitfalls: ['Solving dy/dx = 0 with the wrong sign.', 'Giving the y-intercept c as the y-coordinate.'],
      };
    },
  },
  {
    id: 'al-binomial',
    exam: 'a-level',
    topicId: 'al-algebra',
    difficulty: 2,
    build: (r) => {
      const n = r.int(4, 7);
      const a = r.int(1, 3);
      const b = r.nonZero(-3, 3);
      const k = r.int(1, Math.min(3, n - 1));
      const coef = choose(n, k) * Math.pow(a, n - k) * Math.pow(b, k);
      return {
        prompt: `Find the coefficient of x${sup(k) === '¹' ? '' : sup(k)} in the expansion of (${a} ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x)${sup(n)}.`,
        answer: num(coef),
        wrong: [num(choose(n, k) * Math.pow(b, k)), num(choose(n, k) * Math.pow(a, k) * Math.pow(b, n - k)), num(Math.pow(a, n - k) * Math.pow(b, k))],
        steps: [
          `The general term is C(${n}, r)·${a}^(${n} − r)·(${b}x)^r.`,
          `For x${sup(k) === '¹' ? '' : sup(k)} take r = ${k}: C(${n}, ${k}) = ${choose(n, k)}.`,
          `Coefficient = ${choose(n, k)} × ${a}^${n - k} × ${paren(b)}^${k} = ${num(coef)}.`,
        ],
        pitfalls: ['Forgetting to raise the constant term to the power n − r.', 'Dropping the sign of a negative b for odd r.'],
      };
    },
  },
  {
    id: 'al-log-solve',
    exam: 'a-level',
    topicId: 'al-exponentials-logs',
    difficulty: 2,
    build: (r) => {
      const base = r.pick([2, 3, 5]);
      const n = base === 2 ? r.int(3, 6) : base === 3 ? r.int(2, 4) : r.int(2, 3);
      const total = Math.pow(base, n);
      const divs = [] as number[];
      for (let d = 2; d < total; d++) if (total % d === 0) divs.push(d);
      const k = r.pick(divs);
      const x = total / k;
      return {
        prompt: `Solve log${sub(base)}(x) + log${sub(base)}(${k}) = ${n}.`,
        answer: `x = ${x}`,
        wrong: [`x = ${n - k > 0 ? n - k : total - k}`, `x = ${total}`, `x = ${total - k}`],
        steps: [
          `Combine the logs: log${sub(base)}(${k}x) = ${n}.`,
          `Rewrite in exponential form: ${k}x = ${base}${sup(n)} = ${total}.`,
          `x = ${total} ÷ ${k} = ${x}.`,
        ],
        pitfalls: ['Subtracting the log term as if log(x) + log(k) = log(x + k).'],
      };
    },
  },
  {
    id: 'al-arithmetic-series',
    exam: 'a-level',
    topicId: 'al-sequences',
    difficulty: 1,
    build: (r) => {
      const a = r.int(-5, 12);
      const d = r.nonZero(-3, 6);
      const n = r.int(8, 30);
      const s = (n * (2 * a + (n - 1) * d)) / 2;
      return {
        prompt: `An arithmetic series has first term ${a} and common difference ${d}. Find the sum of the first ${n} terms.`,
        answer: num(s),
        wrong: [num((n * (2 * a + n * d)) / 2), num(a + (n - 1) * d), num(n * (a + (n - 1) * d))],
        steps: [
          'Sₙ = n/2 × (2a + (n − 1)d).',
          `S${sub(n)} = ${n}/2 × (2·${paren(a)} + ${n - 1}·${paren(d)}) = ${n}/2 × ${2 * a + (n - 1) * d}.`,
          `= ${num(s)}.`,
        ],
        pitfalls: ['Using n instead of n − 1 in the formula.', 'Giving the nth term instead of the sum.'],
      };
    },
  },
  {
    id: 'al-geometric-infinity',
    exam: 'a-level',
    topicId: 'al-sequences',
    difficulty: 2,
    build: (r) => {
      const ratio = r.pick([new Frac(1, 2), new Frac(1, 3), new Frac(2, 3), new Frac(1, 4), new Frac(3, 4), new Frac(-1, 2), new Frac(2, 5)]);
      const a = r.int(2, 30);
      const s = new Frac(a).div(new Frac(1).sub(ratio));
      return {
        prompt: `A geometric series has first term ${a} and common ratio ${ratio}. Find its sum to infinity.`,
        answer: s.toString(),
        wrong: [new Frac(a).div(new Frac(1).add(ratio)).toString(), new Frac(a).mul(ratio).div(new Frac(1).sub(ratio)).toString(), new Frac(a).div(ratio).toString()],
        steps: ['S∞ = a / (1 − r), valid because |r| < 1.', `S∞ = ${a} / (1 − ${ratio.n < 0 ? `(${ratio})` : ratio}) = ${a} ÷ (${new Frac(1).sub(ratio)}) = ${s}.`],
        pitfalls: ['Using 1 + r in the denominator.'],
      };
    },
  },
  {
    id: 'al-discriminant',
    exam: 'a-level',
    topicId: 'al-algebra',
    difficulty: 2,
    build: (r) => {
      const m = r.int(1, 7);
      const c = m * m;
      const lead = r.pick([1, 4, 9]);
      const k = 2 * m * Math.sqrt(lead);
      return {
        prompt: `The equation ${lead === 1 ? '' : lead}x² + kx + ${c} = 0 has equal roots. Find the positive value of k.`,
        answer: `k = ${k}`,
        wrong: [`k = ${m * Math.sqrt(lead)}`, `k = ${4 * c * lead}`, `k = ${2 * c}`],
        steps: [
          'Equal roots means the discriminant is zero: b² − 4ac = 0.',
          `k² − 4·${lead}·${c} = 0, so k² = ${4 * lead * c}.`,
          `k = ±${k}; the positive value is ${k}.`,
        ],
        pitfalls: ['Forgetting the square root at the end (giving k²).', 'Using b² − 4ac > 0 (that is two distinct roots).'],
      };
    },
  },
  {
    id: 'al-trig-equation',
    exam: 'a-level',
    topicId: 'al-trigonometry',
    difficulty: 2,
    build: (r) => {
      const opt = r.pick([
        { fn: 'sin', v: '1/2', base: 30 },
        { fn: 'sin', v: '√3/2', base: 60 },
        { fn: 'sin', v: '√2/2', base: 45 },
        { fn: 'cos', v: '1/2', base: 60 },
        { fn: 'cos', v: '√3/2', base: 30 },
        { fn: 'cos', v: '√2/2', base: 45 },
      ]);
      const second = opt.fn === 'sin' ? 180 - opt.base : 360 - opt.base;
      return {
        prompt: `Solve ${opt.fn} x = ${opt.v} for 0° ≤ x ≤ 360°. Give the larger solution.`,
        answer: `${second}°`,
        wrong: [`${opt.fn === 'sin' ? 360 - opt.base : 180 - opt.base}°`, `${opt.base}°`, `${180 + opt.base}°`],
        steps: [
          `The principal value is x = ${opt.base}°.`,
          opt.fn === 'sin'
            ? `sin is also positive in the second quadrant: x = 180° − ${opt.base}° = ${second}°.`
            : `cos is also positive in the fourth quadrant: x = 360° − ${opt.base}° = ${second}°.`,
        ],
        pitfalls: ['Using the sin rule (180° − α) for cos, or the cos rule (360° − α) for sin.'],
      };
    },
  },
  {
    id: 'al-perpendicular-gradient',
    exam: 'a-level',
    topicId: 'al-coordinate-geometry',
    difficulty: 1,
    build: (r) => {
      const p = r.nonZero(-5, 5);
      const q = r.int(1, 5);
      const c = r.int(-8, 8);
      const m = new Frac(p, q);
      const perp = new Frac(-q, p);
      return {
        prompt: `Find the gradient of a line perpendicular to ${q === 1 ? '' : q}y = ${poly([p, c * q])}.`,
        answer: perp.toString(),
        wrong: [m.toString(), m.neg().toString(), new Frac(q, p).toString()],
        steps: [
          `Rearrange: y = ${poly([m, c])}, so the gradient is ${m}.`,
          'Perpendicular gradients multiply to −1: m₂ = −1/m₁.',
          `m₂ = −1 ÷ ${m} = ${perp}.`,
        ],
        pitfalls: ['Taking the reciprocal but forgetting to change the sign.', 'Not dividing through by the y coefficient first.'],
      };
    },
  },
  {
    id: 'al-circle-centre',
    exam: 'a-level',
    topicId: 'al-coordinate-geometry',
    difficulty: 2,
    build: (r) => {
      const h = r.nonZero(-7, 7);
      const k = r.nonZero(-7, 7);
      const rad = r.int(1, 8);
      const F = h * h + k * k - rad * rad;
      const pt = (x: number, y: number) => `(${num(x)}, ${num(y)})`;
      return {
        prompt: `A circle has equation x² + y² ${signed(-2 * h)}x ${signed(-2 * k)}y ${signed(F)} = 0. Find the coordinates of its centre.`,
        answer: pt(h, k),
        wrong: [pt(-h, -k), pt(-2 * h, -2 * k), pt(k, h)],
        steps: [
          'Complete the square for x and y.',
          `(x ${signed(-h)})² + (y ${signed(-k)})² = ${rad * rad}.`,
          `The centre is ${pt(h, k)} (and the radius is ${rad}).`,
        ],
        pitfalls: ['Reading the centre straight off the coefficients without halving and flipping the sign.'],
      };
    },
  },
  {
    id: 'al-definite-integral',
    exam: 'a-level',
    topicId: 'al-integration',
    difficulty: 2,
    build: (r) => {
      const a = r.int(1, 6) * 2;
      const k = r.int(2, 6);
      const res = new Frac(a).mul(new Frac(1).sub(new Frac(1, k)));
      return {
        prompt: `Evaluate ∫ from 1 to ${k} of ${a}/x² dx.`,
        answer: res.toString(),
        wrong: [new Frac(a).mul(new Frac(1, k).sub(1)).toString(), new Frac(a * (k - 1)).toString(), new Frac(a).mul(new Frac(1).sub(new Frac(1, k * k))).toString()],
        steps: [
          `Write ${a}/x² as ${a}x⁻². Its integral is −${a}x⁻¹ = −${a}/x.`,
          `Evaluate: [−${a}/x] from 1 to ${k} = (−${a}/${k}) − (−${a}).`,
          `= ${res}.`,
        ],
        pitfalls: ['Losing the minus sign when integrating x⁻².', 'Subtracting the bounds in the wrong order.'],
      };
    },
  },
  {
    id: 'al-suvat',
    exam: 'a-level',
    topicId: 'al-mechanics',
    difficulty: 2,
    build: (r) => {
      const u = r.int(0, 8);
      const a = r.int(1, 4);
      let v = u + r.int(2, 10);
      while ((v * v - u * u) % (2 * a) !== 0) v++;
      const s = (v * v - u * u) / (2 * a);
      return {
        prompt: `A particle moves in a straight line with constant acceleration ${a} m s⁻². Its initial speed is ${u} m s⁻¹, and it travels ${s} m. Find its final speed.`,
        answer: `${v} m s⁻¹`,
        wrong: [`${u + a * s} m s⁻¹`, `${num(Math.sqrt(u * u + a * s))} m s⁻¹`, `${v * v} m s⁻¹`],
        steps: [
          'Use v² = u² + 2as (no time given).',
          `v² = ${u}² + 2·${a}·${s} = ${u * u} + ${2 * a * s} = ${v * v}.`,
          `v = √${v * v} = ${v} m s⁻¹.`,
        ],
        pitfalls: ['Using v = u + at with the distance in place of time.', 'Forgetting the 2 in 2as.'],
      };
    },
  },
];

function sub(n: number): string {
  const map = '₀₁₂₃₄₅₆₇₈₉';
  return String(n)
    .split('')
    .map((c) => map[Number(c)] ?? c)
    .join('');
}
