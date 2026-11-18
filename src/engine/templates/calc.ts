import { Frac, num, paren, poly, signed, Template } from '../core';

export const CALC_TEMPLATES: Template[] = [
  {
    id: 'calc-limit-factor',
    exam: 'ap-calc-ab',
    topicId: 'calc-limits',
    difficulty: 1,
    build: (r) => {
      const a = r.nonZero(-6, 6);
      let b = r.nonZero(-6, 6);
      if (b === -a) b = b + 1 === 0 ? 2 : b + 1;
      const B = b - a;
      const C = -a * b;
      return {
        prompt: `What is lim (x → ${a}) of (${poly([1, B, C])}) / (x ${signed(-a)})?`,
        answer: num(a + b),
        wrong: [num(b), 'The limit does not exist', num(a - b)],
        steps: [
          `Direct substitution gives 0/0, so factor the numerator: ${poly([1, B, C])} = (x ${signed(-a)})(x ${signed(b)}).`,
          `Cancel (x ${signed(-a)}): the expression becomes x ${signed(b)} for x ≠ ${a}.`,
          `Substitute x = ${a}: ${a} ${signed(b)} = ${num(a + b)}.`,
        ],
        pitfalls: ['Stopping at 0/0 and saying the limit does not exist.', 'Reading the root of the factor with the wrong sign.'],
      };
    },
  },
  {
    id: 'calc-power-rule',
    exam: 'ap-calc-ab',
    topicId: 'calc-derivatives',
    difficulty: 1,
    build: (r) => {
      const a = r.nonZero(-4, 5);
      const b = r.nonZero(-6, 6);
      const c = r.int(-9, 9);
      const k = r.nonZero(-3, 3);
      const d = 3 * a * k * k + b;
      return {
        prompt: `If f(x) = ${poly([a, 0, b, c])}, what is f′(${k})?`,
        answer: num(d),
        wrong: [num(a * k * k * k + b * k + c), num(3 * a * k + b), num(3 * a * k * k + b + c)],
        steps: [
          'Use the power rule: d/dx xⁿ = n·xⁿ⁻¹. Constants differentiate to 0.',
          `f′(x) = ${poly([3 * a, 0, b])}.`,
          `f′(${k}) = ${3 * a}·${paren(k)}² ${signed(b)} = ${num(d)}.`,
        ],
        pitfalls: ['Plugging into f instead of f′.', 'Keeping the constant term after differentiating.'],
      };
    },
  },
  {
    id: 'calc-product-rule',
    exam: 'ap-calc-ab',
    topicId: 'calc-derivatives',
    difficulty: 2,
    build: (r) => {
      const a = r.nonZero(-4, 4);
      const b = r.int(-6, 6);
      const c = r.nonZero(-3, 3);
      const d = r.int(-6, 6);
      const k = r.nonZero(-2, 3);
      const u = a * k + b;
      const v = c * k * k + d;
      const res = a * v + u * 2 * c * k;
      return {
        prompt: `If g(x) = (${poly([a, b])})(${poly([c, 0, d])}), what is g′(${k})?`,
        answer: num(res),
        wrong: [num(a * 2 * c * k), num(a * v - u * 2 * c * k), num(u * v)],
        steps: [
          'Product rule: (uv)′ = u′v + uv′.',
          `u = ${poly([a, b])}, u′ = ${a}; v = ${poly([c, 0, d])}, v′ = ${poly([2 * c, 0])}.`,
          `At x = ${k}: u = ${u}, v = ${v}, v′ = ${2 * c * k}.`,
          `g′(${k}) = ${a}·${paren(v)} + ${paren(u)}·${paren(2 * c * k)} = ${num(res)}.`,
        ],
        pitfalls: ["Multiplying the derivatives (u′v′) — that isn't the product rule.", 'Subtracting instead of adding the two terms.'],
      };
    },
  },
  {
    id: 'calc-chain-rule',
    exam: 'ap-calc-ab',
    topicId: 'calc-derivatives',
    difficulty: 2,
    build: (r) => {
      const a = r.nonZero(-3, 3);
      const b = r.int(-4, 4);
      const n = r.int(2, 4);
      const k = r.int(-2, 2);
      const inner = a * k + b;
      const res = n * a * Math.pow(inner, n - 1);
      return {
        prompt: `If h(x) = (${poly([a, b])})${n === 2 ? '²' : n === 3 ? '³' : '⁴'}, what is h′(${k})?`,
        answer: num(res),
        wrong: [num(n * Math.pow(inner, n - 1)), num(Math.pow(inner, n)), num(n * a * Math.pow(inner, n))],
        steps: [
          'Chain rule: d/dx [u(x)]ⁿ = n·[u(x)]ⁿ⁻¹·u′(x).',
          `Here u = ${poly([a, b])} and u′ = ${a}, so h′(x) = ${n}·(${poly([a, b])})${n - 1 === 1 ? '' : n - 1 === 2 ? '²' : '³'}·${paren(a)}.`,
          `At x = ${k}: u = ${inner}, so h′(${k}) = ${n}·${paren(inner)}${n - 1 === 1 ? '' : n - 1 === 2 ? '²' : '³'}·${paren(a)} = ${num(res)}.`,
        ],
        pitfalls: ['Forgetting to multiply by the inner derivative u′.', 'Lowering the power but not multiplying by n.'],
      };
    },
  },
  {
    id: 'calc-tangent-line',
    exam: 'ap-calc-ab',
    topicId: 'calc-applications',
    difficulty: 2,
    build: (r) => {
      const a = r.nonZero(-3, 3);
      const b = r.int(-5, 5);
      const c = r.int(-6, 6);
      const k = r.nonZero(-3, 3);
      const y0 = a * k * k + b * k + c;
      const m = 2 * a * k + b;
      const q = y0 - m * k;
      const line = (mm: number, qq: number) => `y = ${poly([mm, qq])}`;
      return {
        prompt: `Which is the equation of the line tangent to f(x) = ${poly([a, b, c])} at x = ${k}?`,
        answer: line(m, q),
        wrong: [line(m, y0), line(y0, q), line(2 * a + b, y0 - (2 * a + b) * k)],
        steps: [
          `Point: f(${k}) = ${y0}, so the line passes through (${k}, ${y0}).`,
          `Slope: f′(x) = ${poly([2 * a, b])}, so f′(${k}) = ${m}.`,
          `Point-slope: y − ${paren(y0)} = ${m}(x − ${paren(k)}), which simplifies to ${line(m, q)}.`,
        ],
        pitfalls: ['Using f(k) as the y-intercept.', 'Using f′(1) instead of f′(k) for the slope.'],
      };
    },
  },
  {
    id: 'calc-local-max',
    exam: 'ap-calc-ab',
    topicId: 'calc-applications',
    difficulty: 3,
    build: (r) => {
      const r1 = r.int(-5, 2);
      const r2 = r1 + 2 * r.int(1, 3);
      const b = new Frac(-3 * (r1 + r2), 2);
      const c = 3 * r1 * r2;
      return {
        prompt: `At what value of x does f(x) = ${poly([1, b, c, 0])} have a local maximum?`,
        answer: `x = ${num(r1)}`,
        wrong: [`x = ${num(r2)}`, `x = ${num((r1 + r2) / 2)}`, `x = ${num(-r1)}`],
        steps: [
          `f′(x) = ${poly([3, b.mul(2), c])} = 3(x ${signed(-r1)})(x ${signed(-r2)}).`,
          `Critical points: x = ${r1} and x = ${r2}.`,
          `f′ changes from positive to negative at x = ${r1}, so that is the local maximum (x = ${r2} is a local minimum).`,
        ],
        pitfalls: ['Picking the critical point where f′ changes from − to + (that is a minimum).'],
      };
    },
  },
  {
    id: 'calc-definite-integral',
    exam: 'ap-calc-ab',
    topicId: 'calc-integrals',
    difficulty: 2,
    build: (r) => {
      const a = r.int(-3, 3) * 3 || 3;
      const b = r.int(-4, 4) * 2;
      const c = r.int(-5, 5);
      const p = r.int(-2, 1);
      const q = p + r.int(1, 3);
      const F = (x: number) => new Frac(a * x * x * x, 3).add(new Frac(b * x * x, 2)).add(c * x);
      const res = F(q).sub(F(p));
      const naive = new Frac(a * q * q + b * q + c).sub(a * p * p + b * p + c);
      return {
        prompt: `Evaluate the integral of (${poly([a, b, c])}) dx from x = ${p} to x = ${q}.`,
        answer: res.toString(),
        wrong: [naive.toString(), F(q).toString(), F(q).add(F(p)).toString()],
        steps: [
          `Antiderivative: F(x) = ${poly([new Frac(a, 3), new Frac(b, 2), c, 0])}.`,
          `F(${q}) = ${F(q)}, F(${p}) = ${F(p)}.`,
          `Integral = F(${q}) − F(${p}) = ${res}.`,
        ],
        pitfalls: ['Evaluating the integrand instead of the antiderivative at the bounds.', 'Adding F(b) and F(a) instead of subtracting.'],
      };
    },
  },
  {
    id: 'calc-ftc',
    exam: 'ap-calc-ab',
    topicId: 'calc-integrals',
    difficulty: 2,
    build: (r) => {
      const k = r.int(-8, 8);
      const lo = r.int(0, 3);
      const a = r.nonZero(-4, 4);
      const res = a * a + k;
      return {
        prompt: `Let F(x) = ∫ from ${lo} to x of (t² ${signed(k)}) dt. What is F′(${a})?`,
        answer: num(res),
        wrong: [num(2 * a), num((a * a * a) / 3 + k * a), num(res - (lo * lo + k))],
        steps: [
          'By the Fundamental Theorem of Calculus, d/dx ∫ₐˣ f(t) dt = f(x).',
          `So F′(x) = x² ${signed(k)}.`,
          `F′(${a}) = ${paren(a)}² ${signed(k)} = ${num(res)}.`,
        ],
        pitfalls: ['Integrating the function instead of just evaluating it.', 'Differentiating t² again to get 2x.'],
      };
    },
  },
  {
    id: 'calc-trig-derivative',
    exam: 'ap-calc-ab',
    topicId: 'calc-derivatives',
    difficulty: 1,
    build: (r) => {
      const a = r.nonZero(-5, 5);
      const b = r.nonZero(-5, 5);
      const pt = r.pick([
        { label: '0', s: 0, c: 1 },
        { label: 'π/2', s: 1, c: 0 },
        { label: 'π', s: 0, c: -1 },
      ]);
      const res = a * pt.c - b * pt.s;
      const coef = (v: number, fn: string, first: boolean) => {
        const sign = v < 0 ? (first ? '−' : ' − ') : first ? '' : ' + ';
        const mag = Math.abs(v) === 1 ? '' : String(Math.abs(v));
        return `${sign}${mag}${fn}`;
      };
      return {
        prompt: `If y = ${coef(a, 'sin x', true)}${coef(b, 'cos x', false)}, what is dy/dx at x = ${pt.label}?`,
        answer: num(res),
        wrong: [num(a * pt.c + b * pt.s), num(a * pt.s + b * pt.c), num(-a * pt.c - b * pt.s)],
        steps: [
          'd/dx sin x = cos x and d/dx cos x = −sin x.',
          `dy/dx = ${coef(a, 'cos x', true)}${coef(-b, 'sin x', false)}.`,
          `At x = ${pt.label}: cos = ${pt.c}, sin = ${pt.s}, so dy/dx = ${num(res)}.`,
        ],
        pitfalls: ['Forgetting the minus sign in the derivative of cos x.'],
      };
    },
  },
  {
    id: 'calc-average-value',
    exam: 'ap-calc-ab',
    topicId: 'calc-integrals',
    difficulty: 3,
    build: (r) => {
      const a = r.nonZero(-3, 4) * 3;
      const c = r.int(1, 4);
      const b = r.int(-5, 5);
      const res = new Frac(a * c * c, 3).add(b);
      const wrongInt = new Frac(a * c * c * c, 3).add(b * c);
      return {
        prompt: `What is the average value of f(x) = ${poly([a, 0, b])} on the interval [0, ${c}]?`,
        answer: res.toString(),
        wrong: [wrongInt.toString(), new Frac(a * c * c + b * 2, 2).toString(), new Frac(a * c * c + b).toString()],
        steps: [
          'Average value = (1/(b − a)) × ∫ f(x) dx over [a, b].',
          `∫ from 0 to ${c} of (${poly([a, 0, b])}) dx = ${wrongInt}.`,
          `Divide by the width ${c}: ${wrongInt} ÷ ${c} = ${res}.`,
        ],
        pitfalls: ['Forgetting to divide the integral by the interval width.', 'Averaging f(0) and f(b) instead of integrating.'],
      };
    },
  },
];
