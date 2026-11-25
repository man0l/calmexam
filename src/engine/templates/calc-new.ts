import { Frac, num, paren, poly, Rng, signed, Template } from '../core';

function coef(c: number): string {
  return c === 1 ? '' : c === -1 ? '−' : num(c);
}

function piStr(v: Frac | number): string {
  const f = Frac.of(v);
  const top = f.n === 1 ? 'π' : f.n === -1 ? '−π' : `${num(f.n)}π`;
  return f.d === 1 ? top : `${top}/${f.d}`;
}

function overPi(f: Frac): string {
  return f.d === 1 ? `${num(f.n)}/π` : `${num(f.n)}/(${f.d}π)`;
}

function list(vals: number[]): string {
  return vals.map(num).join(', ');
}

function tableTimes(r: Rng): number[] {
  let widths: number[] = [];
  do {
    widths = [0, 0, 0, 0].map(() => r.int(1, 4));
  } while (new Set(widths).size < 2);
  const t = [0];
  widths.forEach((w) => t.push(t[t.length - 1] + w));
  return t;
}

function fac(v: number): string {
  return v === 0 ? 'x' : `(x ${signed(-v)})`;
}

function sameSign(a: number, b: number): boolean {
  return (a > 0 && b > 0) || (a < 0 && b < 0);
}

const TRIPLES: [number, number][] = [
  [3, 4],
  [4, 3],
  [5, 12],
  [12, 5],
  [6, 8],
  [8, 6],
  [8, 15],
  [15, 8],
];

const RATE_CTX = [
  { f: 'R', intro: 'Water is pumped into a tank at a rate of R(t) liters per minute.', tAbbr: 'min', fUnit: 'L/min', total: 'the total amount of water pumped into the tank', unit: 'liters' },
  { f: 'v', intro: 'A cyclist rides along a straight road with positive velocity v(t) meters per second.', tAbbr: 's', fUnit: 'm/s', total: 'the distance the cyclist travels', unit: 'meters' },
  { f: 'r', intro: 'Rain falls on a garden at a rate of r(t) millimeters per hour.', tAbbr: 'h', fUnit: 'mm/h', total: 'the total rainfall', unit: 'millimeters' },
  { f: 'G', intro: 'Gas flows into a weather balloon at a rate of G(t) cubic feet per minute.', tAbbr: 'min', fUnit: 'ft³/min', total: 'the total volume of gas that flows in', unit: 'cubic feet' },
];

const AMOUNT_CTX = [
  { f: 'T', what: 'the temperature of a cup of tea, in degrees Celsius,', tName: 'minutes', tAbbr: 'min', tWord: 'minute', fUnit: '°C', dir: -1, lo: 70, hi: 95 },
  { f: 'H', what: 'the height of a sunflower, in centimeters,', tName: 'days', tAbbr: 'days', tWord: 'day', fUnit: 'cm', dir: 1, lo: 10, hi: 40 },
  { f: 'D', what: 'the depth of water in a canal lock, in centimeters,', tName: 'hours', tAbbr: 'h', tWord: 'hour', fUnit: 'cm', dir: 1, lo: 50, hi: 120 },
  { f: 'S', what: 'the amount of sand left in a hopper, in kilograms,', tName: 'minutes', tAbbr: 'min', tWord: 'minute', fUnit: 'kg', dir: -1, lo: 200, hi: 300 },
];

function rateTable(r: Rng) {
  const ctx = r.pick(RATE_CTX);
  const t = tableTimes(r);
  let f: number[] = [];
  let left = 0;
  let right = 0;
  do {
    f = t.map(() => r.int(2, 20));
    left = 0;
    right = 0;
    for (let i = 0; i < 4; i++) {
      const w = t[i + 1] - t[i];
      left += f[i] * w;
      right += f[i + 1] * w;
    }
  } while (left === right);
  const table = `t (${ctx.tAbbr}): ${list(t)}; ${ctx.f}(t) (${ctx.fUnit}): ${list(f)}`;
  return { ctx, t, f, left, right, trap: (left + right) / 2, table };
}

export const CALC_NEW_TEMPLATES: Template[] = [
  {
    id: 'calc-implicit-slope',
    exam: 'ap-calc-ab',
    topicId: 'calc-implicit',
    difficulty: 1,
    build: (r) => {
      if (r.next() < 0.5) {
        const [u, v] = r.pick(TRIPLES);
        const a = u * (r.next() < 0.5 ? -1 : 1);
        const b = v * (r.next() < 0.5 ? -1 : 1);
        const ans = new Frac(-a, b);
        return {
          prompt: `The point (${a}, ${b}) lies on the circle x² + y² = ${a * a + b * b}. What is dy/dx at this point?`,
          answer: ans.toString(),
          wrong: [new Frac(a, b).toString(), new Frac(-b, a).toString(), new Frac(b, a).toString()],
          steps: [
            'Differentiate both sides with respect to x: 2x + 2y·dy/dx = 0.',
            'Solve for the derivative: dy/dx = −x/y.',
            `At (${a}, ${b}): dy/dx = −${paren(a)}/${paren(b)} = ${ans}.`,
          ],
          pitfalls: [
            `Writing dy/dx = −y/x, which flips the ratio to ${new Frac(-b, a)}.`,
            `Giving the slope of the radius, ${new Frac(b, a)}, instead of the tangent slope, which is perpendicular to it.`,
          ],
        };
      }
      let p = 0;
      let q = 0;
      do {
        p = r.nonZero(-6, 6);
        q = r.nonZero(-6, 6);
      } while (Math.abs(p) === Math.abs(q));
      const ans = new Frac(-q, p);
      return {
        prompt: `The point (${p}, ${q}) lies on the curve xy = ${p * q}. What is dy/dx at this point?`,
        answer: ans.toString(),
        wrong: [new Frac(-p, q).toString(), new Frac(q, p).toString(), new Frac(p, q).toString()],
        steps: [
          'Differentiate with the product rule: y + x·dy/dx = 0.',
          'Solve for the derivative: dy/dx = −y/x.',
          `At (${p}, ${q}): dy/dx = −${paren(q)}/${paren(p)} = ${ans}.`,
        ],
        pitfalls: [
          `Writing −x/y instead of −y/x, which gives ${new Frac(-p, q)}.`,
          `Forgetting the product rule on xy and losing the minus sign, which gives ${new Frac(q, p)}.`,
        ],
      };
    },
  },
  {
    id: 'calc-implicit-mixed-curve',
    exam: 'ap-calc-ab',
    topicId: 'calc-implicit',
    difficulty: 2,
    build: (r) => {
      let p = 0;
      let q = 0;
      let k = 0;
      let top = 0;
      let bottom = 0;
      let C = 0;
      do {
        p = r.nonZero(-4, 4);
        q = r.nonZero(-4, 4);
        k = r.nonZero(-3, 3);
        top = 2 * p + k * q;
        bottom = k * p + 2 * q;
        C = p * p + k * p * q + q * q;
      } while (top === 0 || bottom === 0 || C === 0);
      const ans = new Frac(-top, bottom);
      const curve = `x² ${k < 0 ? '−' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}xy + y² = ${C}`;
      return {
        prompt: `The point (${p}, ${q}) lies on the curve ${curve}. What is dy/dx at this point?`,
        answer: ans.toString(),
        wrong: [new Frac(top, bottom).toString(), new Frac(-2 * p, bottom).toString(), new Frac(-top, 2 * q).toString(), new Frac(-bottom, top).toString(), new Frac(-p, q).toString()],
        steps: [
          `Differentiate term by term, using the product rule on ${coef(k)}xy: 2x ${k < 0 ? '−' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}(y + x·dy/dx) + 2y·dy/dx = 0.`,
          `Collect the dy/dx terms: dy/dx·(${coef(k)}x + 2y) = −(2x ${signed(k)}y).`,
          `At (${p}, ${q}): dy/dx = −(${top})/(${bottom}) = ${ans}.`,
        ],
        pitfalls: [
          `Differentiating ${coef(k)}xy as ${coef(k)}x·dy/dx only, which drops the ${coef(k)}y term and gives ${new Frac(-2 * p, bottom)}.`,
          `Differentiating ${coef(k)}xy as ${coef(k)}y only, which drops the x·dy/dx term and gives ${new Frac(-top, 2 * q)}.`,
        ],
      };
    },
  },
  {
    id: 'calc-chain-rule-values',
    exam: 'ap-calc-ab',
    topicId: 'calc-implicit',
    difficulty: 2,
    build: (r) => {
      const [outer, inner] = r.pick([
        ['f', 'g'],
        ['g', 'f'],
      ]);
      const a = r.int(1, 4);
      let b = r.int(0, 5);
      if (b === a) b = a + 1;
      const ip = r.nonZero(-5, 5);
      const oa = r.int(-6, 6);
      const opa = r.nonZero(-6, 6);
      let opb = r.nonZero(-6, 6);
      if (opb === opa) opb = opa === 6 ? -6 : opa + 1;
      let ob = r.int(-6, 6);
      if (ob === opb) ob = opb + 2;
      const ans = opb * ip;
      return {
        prompt: `Let h(x) = ${outer}(${inner}(x)). You know ${inner}(${a}) = ${b}, ${inner}′(${a}) = ${ip}, ${outer}(${a}) = ${oa}, ${outer}′(${a}) = ${opa}, ${outer}(${b}) = ${ob} and ${outer}′(${b}) = ${opb}. What is h′(${a})?`,
        answer: num(ans),
        wrong: [num(opa * ip), num(opb), num(ob * ip)],
        steps: [
          `Chain rule: h′(x) = ${outer}′(${inner}(x))·${inner}′(x).`,
          `${inner}(${a}) = ${b}, so h′(${a}) = ${outer}′(${b})·${inner}′(${a}).`,
          `h′(${a}) = ${opb}·${paren(ip)} = ${num(ans)}.`,
        ],
        pitfalls: [
          `Using ${outer}′(${a}) = ${opa} instead of ${outer}′(${b}); the outer derivative is evaluated at ${inner}(${a}) = ${b}.`,
          `Stopping at ${outer}′(${b}) = ${opb} and forgetting to multiply by ${inner}′(${a}) = ${ip}.`,
        ],
      };
    },
  },
  {
    id: 'calc-composite-trig-eval',
    exam: 'ap-calc-ab',
    topicId: 'calc-implicit',
    difficulty: 2,
    build: (r) => {
      const A = r.nonZero(-4, 4);
      const rootCoef = (c: number, root: string) => (c === 1 ? root : c === -1 ? `−${root}` : `${num(c)}${root}`);
      if (r.next() < 0.5) {
        const k = r.int(1, 4);
        const s = k % 2 === 0 ? 1 : -1;
        const C = 2 * A * k * s;
        const kPi = k === 1 ? 'π' : `${k}π`;
        return {
          prompt: `If y = ${coef(A)}sin(${k}x²), what is dy/dx at x = √π?`,
          answer: rootCoef(C, '√π'),
          wrong: [rootCoef(-C, '√π'), num(A * s), rootCoef(A * k * s, '√π')],
          steps: [
            `Chain rule: d/dx sin(u) = cos(u)·u′ with u = ${k}x², so u′ = ${2 * k}x.`,
            `dy/dx = ${num(2 * A * k)}x·cos(${k}x²).`,
            `At x = √π: ${k}x² = ${kPi} and cos(${kPi}) = ${s}, so dy/dx = ${num(2 * A * k)}·√π·${paren(s)} = ${rootCoef(C, '√π')}.`,
          ],
          pitfalls: [
            `Forgetting the inner derivative ${2 * k}x and answering ${num(A * s)}.`,
            `Taking the derivative of x² as x instead of 2x, which halves the answer to ${rootCoef(A * k * s, '√π')}.`,
          ],
        };
      }
      const k = r.pick([1, 3]);
      const s = k === 1 ? 1 : -1;
      const C = -2 * A * k * s;
      const arg = k === 1 ? 'π/2' : '3π/2';
      return {
        prompt: `If y = ${coef(A)}cos(${k}x²), what is dy/dx at x = √(π/2)?`,
        answer: rootCoef(C, '√(π/2)'),
        wrong: [rootCoef(-C, '√(π/2)'), num(-A * s), rootCoef(-A * k * s, '√(π/2)')],
        steps: [
          `Chain rule: d/dx cos(u) = −sin(u)·u′ with u = ${k}x², so u′ = ${2 * k}x.`,
          `dy/dx = ${num(-2 * A * k)}x·sin(${k}x²).`,
          `At x = √(π/2): ${k}x² = ${arg} and sin(${arg}) = ${s}, so dy/dx = ${rootCoef(C, '√(π/2)')}.`,
        ],
        pitfalls: [
          `Dropping the minus sign from the derivative of cos, which gives ${rootCoef(-C, '√(π/2)')}.`,
          `Forgetting the inner derivative ${2 * k}x and answering ${num(-A * s)}.`,
        ],
      };
    },
  },
  {
    id: 'calc-inverse-derivative',
    exam: 'ap-calc-ab',
    topicId: 'calc-implicit',
    difficulty: 3,
    build: (r) => {
      let a = 0;
      let b = 0;
      let c = 0;
      let N = 0;
      do {
        a = r.int(1, 5);
        b = r.int(-6, 6);
        c = r.int(-2, 2);
        N = c * c * c + a * c + b;
      } while (N === c || N === -c);
      const s = 3 * c * c + a;
      const wrongAtN = 3 * N * N + a;
      return {
        prompt: `Let f(x) = ${poly([1, 0, a, b])} and let g be the inverse function of f. What is g′(${N})?`,
        answer: new Frac(1, s).toString(),
        wrong: [num(s), new Frac(1, wrongAtN).toString(), new Frac(-1, s).toString(), num(-s)],
        steps: [
          `Find the input that f sends to ${N}: f(${c}) = ${paren(c)}³ ${signed(a)}·${paren(c)}${b ? ' ' + signed(b) : ''} = ${N}, so g(${N}) = ${c}.`,
          `f′(x) = ${poly([3, 0, a])}, so f′(${c}) = ${s}.`,
          `g′(${N}) = 1/f′(g(${N})) = 1/f′(${c}) = ${new Frac(1, s)}.`,
        ],
        pitfalls: [
          `Evaluating f′ at ${N} instead of at g(${N}) = ${c}, which gives ${new Frac(1, wrongAtN)}.`,
          `Forgetting the reciprocal and answering f′(${c}) = ${s}.`,
        ],
      };
    },
  },
  {
    id: 'calc-implicit-second-derivative',
    exam: 'ap-calc-ab',
    topicId: 'calc-implicit',
    difficulty: 3,
    build: (r) => {
      const [u, v] = r.pick(TRIPLES.slice(0, 6));
      const a = u * (r.next() < 0.5 ? -1 : 1);
      const b = v * (r.next() < 0.5 ? -1 : 1);
      const R2 = a * a + b * b;
      const ans = new Frac(-R2, b * b * b);
      return {
        prompt: `For the circle x² + y² = ${R2}, what is d²y/dx² at the point (${a}, ${b})?`,
        answer: ans.toString(),
        wrong: [new Frac(-1, b).toString(), new Frac(R2, b * b * b).toString(), new Frac(-a, b).toString()],
        steps: [
          'Implicit differentiation gives dy/dx = −x/y.',
          'Quotient rule: d²y/dx² = −(y − x·dy/dx)/y² = −(y + x²/y)/y² = −(x² + y²)/y³.',
          `Since x² + y² = ${R2}: d²y/dx² = −${R2}/${paren(b)}³ = ${ans}.`,
        ],
        pitfalls: [
          `Treating y as a constant when differentiating −x/y, which gives −1/y = ${new Frac(-1, b)}.`,
          `Stopping at the first derivative, −x/y = ${new Frac(-a, b)}.`,
        ],
      };
    },
  },
  {
    id: 'calc-rr-circle-sphere',
    exam: 'ap-calc-ab',
    topicId: 'calc-contextual',
    difficulty: 1,
    build: (r) => {
      const rad = r.int(3, 12);
      const dr = r.int(2, 5);
      if (r.next() < 0.5) {
        const ctx = r.pick(['A circular ripple spreads across a pond', 'An oil spill spreads out in a circle', 'A circular patch of light widens on a wall']);
        return {
          prompt: `${ctx}. Its radius grows at ${dr} cm/s. How fast is its area increasing when the radius is ${rad} cm?`,
          answer: `${piStr(2 * rad * dr)} cm²/s`,
          wrong: [`${piStr(rad * rad * dr)} cm²/s`, `${piStr(2 * rad)} cm²/s`, `${piStr(2 * dr)} cm²/s`],
          steps: ['A = πr², so dA/dt = 2πr·dr/dt.', `dA/dt = 2π·${rad}·${dr} = ${piStr(2 * rad * dr)} cm²/s.`],
          pitfalls: [
            `Leaving out dr/dt = ${dr} and answering ${piStr(2 * rad)}.`,
            `Multiplying πr² by the rate to get ${piStr(rad * rad * dr)} instead of differentiating first.`,
          ],
        };
      }
      const ctx = r.pick(['A spherical balloon is being inflated', 'A spherical snowball is rolled in fresh snow', 'A spherical soap bubble expands']);
      return {
        prompt: `${ctx} so that its radius grows at ${dr} cm/s. How fast is its volume increasing when the radius is ${rad} cm?`,
        answer: `${piStr(4 * rad * rad * dr)} cm³/s`,
        wrong: [`${piStr(4 * rad * rad)} cm³/s`, `${piStr(new Frac(4 * rad * rad * dr, 3))} cm³/s`, `${piStr(8 * rad * dr)} cm³/s`],
        steps: ['V = (4/3)πr³, so dV/dt = 4πr²·dr/dt.', `dV/dt = 4π·${rad}²·${dr} = ${piStr(4 * rad * rad * dr)} cm³/s.`],
        pitfalls: [
          `Keeping the 1/3 after differentiating r³, which gives ${piStr(new Frac(4 * rad * rad * dr, 3))}.`,
          `Leaving out dr/dt = ${dr} and answering ${piStr(4 * rad * rad)}.`,
        ],
      };
    },
  },
  {
    id: 'calc-rr-ladder',
    exam: 'ap-calc-ab',
    topicId: 'calc-contextual',
    difficulty: 2,
    build: (r) => {
      const [x, y] = r.pick(TRIPLES);
      const L = Math.round(Math.sqrt(x * x + y * y));
      const v = r.int(1, 4);
      const [obj, u, uw] = r.pick([
        ['ladder', 'ft', 'feet'],
        ['ladder', 'm', 'meters'],
        ['wooden plank', 'ft', 'feet'],
      ]);
      const ans = new Frac(v * x, y);
      return {
        prompt: `A ${L}-${u === 'ft' ? 'foot' : 'meter'} ${obj} leans against a vertical wall. The bottom slides away from the wall at ${v} ${u}/s. How fast is the top sliding down the wall when the bottom is ${x} ${uw} from the wall?`,
        answer: `${ans} ${u}/s`,
        wrong: [`${new Frac(v * y, x)} ${u}/s`, `${v} ${u}/s`, `${new Frac(v * x, L)} ${u}/s`],
        steps: [
          `Let x be the distance of the bottom from the wall and y the height of the top: x² + y² = ${L * L}.`,
          'Differentiate: 2x·dx/dt + 2y·dy/dt = 0, so dy/dt = −(x/y)·dx/dt.',
          `When x = ${x}, y = √(${L * L} − ${x * x}) = ${y}.`,
          `dy/dt = −(${x}/${y})·${v} = −${ans}, so the top slides down at ${ans} ${u}/s.`,
        ],
        pitfalls: [
          `Using y/x instead of x/y, which gives ${new Frac(v * y, x)}.`,
          `Assuming the top moves at the same ${v} ${u}/s as the bottom.`,
        ],
      };
    },
  },
  {
    id: 'calc-rr-cone-filling',
    exam: 'ap-calc-ab',
    topicId: 'calc-contextual',
    difficulty: 3,
    build: (r) => {
      const [R, H] = r.pick([
        [3, 6],
        [4, 8],
        [2, 6],
        [3, 9],
        [4, 6],
        [5, 5],
      ]);
      const k = new Frac(R, H);
      const k2 = k.mul(k);
      const h = r.int(2, H - 1);
      const Q = r.int(2, 20);
      const ans = new Frac(Q).div(k2.mul(h * h));
      const liquid = r.pick(['Water', 'Grain', 'Sand']);
      return {
        prompt: `A conical tank has its vertex pointing down. It is ${H} m tall and the radius of its top is ${R} m. ${liquid} pours in at ${Q} m³/min. How fast is the level rising when it is ${h} m deep?`,
        answer: `${overPi(ans)} m/min`,
        wrong: [`${overPi(new Frac(Q, R * R))} m/min`, `${overPi(ans.div(3))} m/min`, `${overPi(ans.mul(h))} m/min`],
        steps: [
          `Similar triangles: r/h = ${R}/${H}, so r = (${k})h.`,
          `V = (1/3)πr²h = (1/3)π·(${k2})h³, so dV/dt = π·(${k2})h²·dh/dt.`,
          `${Q} = π·(${k2})·${h}²·dh/dt, so dh/dt = ${overPi(ans)} m/min.`,
        ],
        pitfalls: [
          `Treating the radius as fixed at ${R} m, which gives ${overPi(new Frac(Q, R * R))}.`,
          `Differentiating h³ but forgetting that the 3 cancels the 1/3, which gives ${overPi(ans.div(3))}.`,
        ],
      };
    },
  },
  {
    id: 'calc-particle-at-rest',
    exam: 'ap-calc-ab',
    topicId: 'calc-contextual',
    difficulty: 2,
    build: (r) => {
      const a = r.int(1, 4);
      const b = a + r.int(1, 4);
      const c = r.int(-9, 9);
      const mid = (a + b) / 2;
      return {
        prompt: `A particle moves along the x-axis so that its position at time t ≥ 0 seconds is x(t) = ${poly([2, -3 * (a + b), 6 * a * b, c], 't')}. At what times is the particle at rest?`,
        answer: `t = ${a} and t = ${b}`,
        wrong: [`t = ${num(mid)} only`, `t = ${a} only`, `t = ${a * b} only`],
        steps: [
          'The particle is at rest when v(t) = x′(t) = 0.',
          `v(t) = ${poly([6, -6 * (a + b), 6 * a * b], 't')} = 6(t − ${a})(t − ${b}).`,
          `v(t) = 0 at t = ${a} and t = ${b}.`,
        ],
        pitfalls: [
          `Setting the acceleration ${poly([12, -6 * (a + b)], 't')} to zero, which gives t = ${num(mid)}; that is where the velocity is smallest, not zero.`,
          `Reading 6·${a}·${b} = ${6 * a * b} as a root, or stopping after the first root t = ${a}.`,
        ],
      };
    },
  },
  {
    id: 'calc-particle-speeding-up',
    exam: 'ap-calc-ab',
    topicId: 'calc-contextual',
    difficulty: 3,
    build: (r) => {
      let p = 0;
      let q = 0;
      let c = 0;
      let T = 0;
      let X = 0;
      let V = 0;
      let A = 0;
      do {
        p = r.int(-6, 2);
        q = r.int(-8, 8);
        c = r.int(-5, 5);
        T = r.int(1, 4);
        X = T * T * T + p * T * T + q * T + c;
        V = 3 * T * T + 2 * p * T + q;
        A = 6 * T + 2 * p;
      } while (V === 0 || A === 0 || X === 0 || X === V);
      const verdict = (v: number, a: number) => (sameSign(v, a) ? 'Speeding up' : 'Slowing down');
      const flip = (s: string) => (s === 'Speeding up' ? 'Slowing down' : 'Speeding up');
      const opt = (s: string, v: number, a: number) => `${s}, since v(${T}) = ${num(v)} and a(${T}) = ${num(a)}`;
      const right = verdict(V, A);
      const slip = verdict(X, V);
      return {
        prompt: `A particle moves along a line with position x(t) = ${poly([1, p, q, c], 't')} meters at time t seconds. At t = ${T}, is the particle speeding up or slowing down?`,
        answer: opt(right, V, A),
        wrong: [opt(flip(right), V, A), opt(slip, X, V), opt(flip(slip), X, V)],
        steps: [
          `v(t) = ${poly([3, 2 * p, q], 't')}, so v(${T}) = ${num(V)}.`,
          `a(t) = ${poly([6, 2 * p], 't')}, so a(${T}) = ${num(A)}.`,
          `Velocity and acceleration ${sameSign(V, A) ? 'have the same sign' : 'have opposite signs'}, so the particle is ${right.toLowerCase()}.`,
        ],
        pitfalls: [
          `Judging by the sign of a(${T}) = ${num(A)} alone; speed depends on whether v and a share a sign.`,
          `Using the position x(${T}) = ${num(X)} as if it were the velocity.`,
        ],
      };
    },
  },
  {
    id: 'calc-frq-tank-rate',
    exam: 'ap-calc-ab',
    topicId: 'calc-contextual',
    difficulty: 2,
    style: 'frq',
    build: (r) => {
      const [liquid, holder, unit] = r.pick([
        ['Water', 'tank', 'liters'],
        ['Oil', 'storage tank', 'gallons'],
        ['Water', 'swimming pool', 'cubic feet'],
      ]);
      let p = 0;
      let q = 0;
      let s = 0;
      let m = 0;
      let T = 0;
      let net = 0;
      do {
        p = r.int(10, 40);
        q = r.int(1, 6);
        s = r.int(1, 3);
        m = r.int(1, 8);
        T = r.int(1, 7);
        net = p + q * T - (m + s * T * T);
      } while (net === 0);
      const Rv = p + q * T;
      const Lv = m + s * T * T;
      const verdict = net > 0 ? 'Increasing' : 'Decreasing';
      const other = net > 0 ? 'Decreasing' : 'Increasing';
      const opt = (v: string, x: number) => `${v} at ${num(x)} ${unit} per hour`;
      return {
        prompt: `${liquid} flows into a ${holder} at a rate of R(t) = ${poly([q, p], 't')} ${unit} per hour and drains out at a rate of L(t) = ${poly([s, 0, m], 't')} ${unit} per hour, for 0 ≤ t ≤ 8 hours. At t = ${T}, is the amount in the ${holder} increasing or decreasing, and at what rate?`,
        answer: opt(verdict, Math.abs(net)),
        wrong: [opt(other, Math.abs(net)), opt(verdict, Rv + Lv), opt(other, Rv + Lv)],
        steps: [
          'The amount A(t) changes at A′(t) = R(t) − L(t).',
          `R(${T}) = ${Rv} and L(${T}) = ${Lv}.`,
          `A′(${T}) = ${Rv} − ${Lv} = ${num(net)}, which is ${net > 0 ? 'positive' : 'negative'}, so the amount is ${verdict.toLowerCase()} at ${Math.abs(net)} ${unit} per hour.`,
        ],
        pitfalls: [
          `Adding R(${T}) and L(${T}) to get ${Rv + Lv} instead of subtracting the outflow.`,
          `Deciding from R(${T}) = ${Rv} alone and ignoring the outflow L(${T}) = ${Lv}.`,
        ],
      };
    },
  },
  {
    id: 'calc-frq-table-rate-estimate',
    exam: 'ap-calc-ab',
    topicId: 'calc-contextual',
    difficulty: 2,
    style: 'frq',
    build: (r) => {
      const ctx = r.pick(AMOUNT_CTX);
      let t: number[] = [];
      let f: number[] = [];
      let k = 1;
      let ans = new Frac(0);
      let fwd = new Frac(0);
      let back = new Frac(0);
      let raw = 0;
      do {
        t = tableTimes(r);
        f = [r.int(ctx.lo, ctx.hi)];
        for (let i = 0; i < 4; i++) f.push(f[i] + ctx.dir * r.int(1, 12));
        k = r.int(1, 3);
        raw = f[k + 1] - f[k - 1];
        ans = new Frac(raw, t[k + 1] - t[k - 1]);
        fwd = new Frac(f[k + 1] - f[k], t[k + 1] - t[k]);
        back = new Frac(f[k] - f[k - 1], t[k] - t[k - 1]);
      } while (new Set([ans.toString(), fwd.toString(), back.toString(), num(raw)]).size < 4);
      const rate = `${ctx.fUnit} per ${ctx.tWord}`;
      return {
        prompt: `${ctx.f}(t) is ${ctx.what} at time t ${ctx.tName}. Selected values: t (${ctx.tAbbr}): ${list(t)}; ${ctx.f}(t) (${ctx.fUnit}): ${list(f)}. Using the average rate of change of ${ctx.f} over ${t[k - 1]} ≤ t ≤ ${t[k + 1]}, estimate ${ctx.f}′(${t[k]}).`,
        answer: `${ans} ${rate}`,
        wrong: [`${fwd} ${rate}`, `${back} ${rate}`, `${num(raw)} ${rate}`],
        steps: [
          `Average rate of change = (${ctx.f}(${t[k + 1]}) − ${ctx.f}(${t[k - 1]}))/(${t[k + 1]} − ${t[k - 1]}).`,
          `= (${f[k + 1]} − ${f[k - 1]})/${t[k + 1] - t[k - 1]} = ${ans} ${rate}.`,
        ],
        pitfalls: [
          `Reporting the change ${num(raw)} ${ctx.fUnit} without dividing by the ${t[k + 1] - t[k - 1]} ${ctx.tName} it took.`,
          `Using only the interval ${t[k]} ≤ t ≤ ${t[k + 1]}, which gives ${fwd}, instead of the interval the question names.`,
        ],
      };
    },
  },
  {
    id: 'calc-frq-table-mvt',
    exam: 'ap-calc-ab',
    topicId: 'calc-contextual',
    difficulty: 3,
    style: 'frq',
    build: (r) => {
      const ctx = r.pick(AMOUNT_CTX);
      const t = tableTimes(r);
      const w = [0, 1, 2, 3].map((i) => t[i + 1] - t[i]);
      const j = r.int(0, 3);
      const k = ctx.dir * r.int(2, 5);
      const traps = [0, 1, 2, 3].filter((i) => i !== j && w[i] >= 2);
      const trap = traps.length ? r.pick(traps) : -1;
      const d = [0, 1, 2, 3].map((i) => {
        if (i === j) return k * w[i];
        if (i === trap) return k;
        let v = 0;
        do {
          v = ctx.dir * r.int(1, 12);
        } while (v === k * w[i]);
        return v;
      });
      const f = [r.int(ctx.lo, ctx.hi)];
      d.forEach((x) => f.push(f[f.length - 1] + x));
      const rate = `${ctx.fUnit} per ${ctx.tWord}`;
      const iv = (i: number) => `between t = ${t[i]} and t = ${t[i + 1]}`;
      const avgs = [0, 1, 2, 3].map((i) => `${t[i]} to ${t[i + 1]}: ${new Frac(d[i], w[i])}`).join('; ');
      return {
        prompt: `${ctx.f}(t) is ${ctx.what} at time t ${ctx.tName}, and ${ctx.f} is differentiable. Selected values: t (${ctx.tAbbr}): ${list(t)}; ${ctx.f}(t) (${ctx.fUnit}): ${list(f)}. On which interval does the Mean Value Theorem guarantee a time c with ${ctx.f}′(c) = ${k} ${rate}?`,
        answer: iv(j),
        wrong: [0, 1, 2, 3].filter((i) => i !== j).map(iv),
        steps: [
          `${ctx.f} is differentiable, so it is continuous, and the Mean Value Theorem applies on each interval of the table.`,
          `Average rates of change: ${avgs}.`,
          `Only ${iv(j)} has average rate (${f[j + 1]} − ${f[j]})/${w[j]} = ${k}, so some c there has ${ctx.f}′(c) = ${k}.`,
        ],
        pitfalls: [
          trap >= 0
            ? `Choosing ${iv(trap)} because ${ctx.f} changes by ${k} there; over ${w[trap]} ${ctx.tName} that is an average rate of ${new Frac(k, w[trap])}.`
            : `Looking for an interval where ${ctx.f} changes by ${k} in total, instead of dividing each change by the interval width.`,
          `Citing the Intermediate Value Theorem on ${ctx.f}; that is about values of ${ctx.f}, not of ${ctx.f}′.`,
        ],
      };
    },
  },
  {
    id: 'calc-net-change-rate',
    exam: 'ap-calc-ab',
    topicId: 'calc-integration-applications',
    difficulty: 1,
    build: (r) => {
      const [what, u, amt] = r.pick([
        ['Oil leaks from a tanker at a rate of', 'gallons per hour', 'gallons of oil leak out'],
        ['Snow piles up on a roof at a rate of', 'centimeters per hour', 'centimeters of snow pile up'],
        ['A factory fills bottles at a rate of', 'hundred bottles per hour', 'hundred bottles are filled'],
      ]);
      const a = r.int(1, 4);
      const b = r.int(0, 9);
      const p = r.int(0, 3);
      const q = p + r.int(1, 4);
      const F = (x: number) => a * x * x + b * x;
      const ans = F(q) - F(p);
      return {
        prompt: `${what} r(t) = ${poly([2 * a, b], 't')} ${u}, where t is in hours. How many ${amt} from t = ${p} to t = ${q}?`,
        answer: num(ans),
        wrong: [num(2 * a * (q - p)), num(F(q)), num((2 * a * q + b) * (q - p))],
        steps: [
          `Net change = ∫ from ${p} to ${q} of r(t) dt.`,
          `An antiderivative is ${poly([a, b, 0], 't')}.`,
          `${F(q)} − ${F(p)} = ${num(ans)}.`,
        ],
        pitfalls: [
          `Subtracting rates, r(${q}) − r(${p}) = ${2 * a * (q - p)}, instead of integrating the rate.`,
          `Multiplying the final rate r(${q}) = ${2 * a * q + b} by the ${q - p} hours, as if the rate were constant.`,
        ],
      };
    },
  },
  {
    id: 'calc-area-between-curves',
    exam: 'ap-calc-ab',
    topicId: 'calc-integration-applications',
    difficulty: 2,
    build: (r) => {
      const A = r.int(1, 3);
      const p = r.int(-3, 2);
      const q = p + r.int(1, 4);
      const m = r.int(-4, 4);
      const n = r.int(-5, 5);
      const B = m - A * (p + q);
      const C = n + A * p * q;
      const area = new Frac(A * Math.pow(q - p, 3), 6);
      const Fp = (x: number) => new Frac(A * x * x * x, 3).add(new Frac(B * x * x, 2)).add(C * x);
      const parInt = Fp(q).sub(Fp(p));
      return {
        prompt: `What is the area of the region enclosed by the parabola y = ${poly([A, B, C])} and the line y = ${poly([m, n])}?`,
        answer: area.toString(),
        wrong: [area.neg().toString(), new Frac(A * Math.pow(q - p, 3), 3).toString(), parInt.toString(), new Frac(A * Math.pow(q - p, 3), 2).toString(), new Frac(A * Math.pow(q - p, 2), 2).toString()],
        steps: [
          `Set the curves equal: ${poly([A, B - m, C - n])} = 0, so ${coef(A)}${fac(p)}${fac(q)} = 0 and x = ${p} or x = ${q}.`,
          `Between them the line is on top: line − parabola = ${poly([-A, A * (p + q), -A * p * q])}.`,
          `Area = ∫ from ${p} to ${q} of (${poly([-A, A * (p + q), -A * p * q])}) dx = ${area}.`,
        ],
        pitfalls: [
          `Subtracting in the wrong order (parabola − line) and getting ${area.neg()}; an area is never negative.`,
          `Integrating only the parabola from ${p} to ${q}, which gives ${parInt}.`,
        ],
      };
    },
  },
  {
    id: 'calc-disc-volume',
    exam: 'ap-calc-ab',
    topicId: 'calc-integration-applications',
    difficulty: 2,
    build: (r) => {
      const k = r.int(2, 4);
      const b = r.int(1, 5);
      if (r.next() < 0.5) {
        const V = new Frac(k * k * b * b, 2);
        return {
          prompt: `The region bounded by y = ${k}√x, the x-axis and the line x = ${b} is revolved about the x-axis. What is the volume of the solid?`,
          answer: piStr(V),
          wrong: [piStr(new Frac(k * b * b, 2)), V.toString(), piStr(k * k * b * b)],
          steps: [
            `Disc method: V = π ∫ from 0 to ${b} of (${k}√x)² dx = π ∫ from 0 to ${b} of ${k * k}x dx.`,
            `= π·${k * k}·x²/2 evaluated from 0 to ${b} = π·${k * k}·${b * b}/2.`,
            `V = ${piStr(V)}.`,
          ],
          pitfalls: [`Squaring √x but not the ${k}, which gives ${piStr(new Frac(k * b * b, 2))}.`, 'Leaving out the π from the area of each disc, πr².'],
        };
      }
      const V = new Frac(k * k * b * b * b, 3);
      return {
        prompt: `The triangle bounded by y = ${k}x, the x-axis and the line x = ${b} is revolved about the x-axis. What is the volume of the resulting cone?`,
        answer: piStr(V),
        wrong: [piStr(new Frac(k * b * b * b, 3)), V.toString(), piStr(new Frac(k * k * b * b, 2))],
        steps: [
          `Disc method: V = π ∫ from 0 to ${b} of (${k}x)² dx = π ∫ from 0 to ${b} of ${k * k}x² dx.`,
          `= π·${k * k}·x³/3 evaluated from 0 to ${b} = π·${k * k}·${b * b * b}/3.`,
          `V = ${piStr(V)}.`,
        ],
        pitfalls: [`Writing (${k}x)² as ${k}x², which gives ${piStr(new Frac(k * b * b * b, 3))}.`, `Integrating ${k * k}x instead of ${k * k}x², which gives ${piStr(new Frac(k * k * b * b, 2))}.`],
      };
    },
  },
  {
    id: 'calc-frq-particle-position',
    exam: 'ap-calc-ab',
    topicId: 'calc-integration-applications',
    difficulty: 2,
    style: 'frq',
    build: (r) => {
      const subject = r.pick(['A particle moves along the x-axis', 'A bead slides along a straight wire', 'A robot moves back and forth along a straight track']);
      let a = 0;
      let b = 0;
      let c = 0;
      let T = 0;
      let disp = 0;
      do {
        a = r.pick([-1, 1, 2]);
        b = r.int(-3, 3);
        c = r.int(-8, 8);
        T = r.int(2, 4);
        disp = a * T * T * T + b * T * T + c * T;
      } while (disp === 0);
      const x0 = r.int(-10, 10);
      const vT = 3 * a * T * T + 2 * b * T + c;
      const ans = x0 + disp;
      return {
        prompt: `${subject} with velocity v(t) = ${poly([3 * a, 2 * b, c], 't')} meters per second for t ≥ 0. Its position at t = 0 is x(0) = ${x0} meters. What is its position at t = ${T} seconds?`,
        answer: `${num(ans)} m`,
        wrong: [`${num(disp)} m`, `${num(x0 + vT)} m`, `${num(x0 - disp)} m`],
        steps: [
          `x(${T}) = x(0) + ∫ from 0 to ${T} of v(t) dt.`,
          `∫ from 0 to ${T} of v(t) dt = [${poly([a, b, c, 0], 't')}] from 0 to ${T} = ${num(disp)}.`,
          `x(${T}) = ${x0} + ${paren(disp)} = ${num(ans)} m.`,
        ],
        pitfalls: [
          `Giving the displacement ${num(disp)} m and forgetting the starting position ${x0} m.`,
          `Adding the velocity v(${T}) = ${num(vT)} to x(0) instead of integrating.`,
        ],
      };
    },
  },
  {
    id: 'calc-frq-total-distance',
    exam: 'ap-calc-ab',
    topicId: 'calc-integration-applications',
    difficulty: 3,
    style: 'frq',
    build: (r) => {
      const A = r.pick([1, 2, 3, -1, -2, -3]);
      const s = r.int(1, 3);
      const u = r.int(0, 3);
      const T = s + r.int(1, 3);
      const F = (t: number) => new Frac(A * t * t * t, 3).add(new Frac(A * (u - s) * t * t, 2)).sub(A * s * u * t);
      const part1 = F(s).sub(F(0));
      const part2 = F(T).sub(F(s));
      const abs = (f: Frac) => (f.n < 0 ? f.neg() : f);
      const dist = abs(part1).add(abs(part2));
      const disp = F(T).sub(F(0));
      const factored = `${coef(A)}${u === 0 ? 't' : `(t + ${u})`}(t − ${s})`;
      return {
        prompt: `A particle moves along a line with velocity v(t) = ${poly([A, A * (u - s), -A * s * u], 't')} meters per second for 0 ≤ t ≤ ${T}. What is the total distance the particle travels over this interval?`,
        answer: `${dist} m`,
        wrong: [`${disp} m`, `${abs(part2)} m`, `${abs(part1)} m`],
        steps: [
          `v(t) = ${factored}, which changes sign at t = ${s}.`,
          `∫ from 0 to ${s} of v dt = ${part1}; ∫ from ${s} to ${T} of v dt = ${part2}.`,
          `Total distance = |${part1}| + |${part2}| = ${dist} m.`,
        ],
        pitfalls: [
          `Integrating straight from 0 to ${T}, which gives the displacement ${disp} m, not the distance.`,
          `Missing that v changes sign at t = ${s}, so the two pieces must be made positive before adding.`,
        ],
      };
    },
  },
  {
    id: 'calc-frq-tank-amount',
    exam: 'ap-calc-ab',
    topicId: 'calc-integration-applications',
    difficulty: 3,
    style: 'frq',
    build: (r) => {
      const [liquid, holder, unit] = r.pick([
        ['Water', 'tank', 'liters'],
        ['Water', 'reservoir', 'thousand gallons'],
        ['Fuel', 'storage tank', 'gallons'],
      ]);
      let W0 = 0;
      let p = 0;
      let q = 0;
      let s = 0;
      let m = 0;
      let T = 0;
      let inflow = 0;
      let outflow = 0;
      do {
        W0 = r.int(10, 50) * 10;
        p = r.int(10, 30);
        q = r.int(1, 5);
        s = r.int(1, 2);
        m = r.int(0, 5);
        T = r.int(2, 6);
        inflow = p * T + q * T * T;
        outflow = m * T + s * T * T * T;
      } while (W0 + inflow - outflow <= 0 || inflow === outflow);
      const ans = W0 + inflow - outflow;
      const Rt = p + 2 * q * T;
      const Lt = m + 3 * s * T * T;
      return {
        prompt: `${liquid} flows into a ${holder} at R(t) = ${poly([2 * q, p], 't')} ${unit} per hour and flows out at L(t) = ${poly([3 * s, 0, m], 't')} ${unit} per hour. At t = 0 the ${holder} holds ${W0} ${unit}. How much is in the ${holder} at t = ${T} hours?`,
        answer: `${num(ans)} ${unit}`,
        wrong: [`${num(W0 + inflow)} ${unit}`, `${num(inflow - outflow)} ${unit}`, `${num(W0 + Rt - Lt)} ${unit}`],
        steps: [
          `Amount = ${W0} + ∫ from 0 to ${T} of (R(t) − L(t)) dt.`,
          `∫ R dt = [${poly([q, p, 0], 't')}] from 0 to ${T} = ${inflow}; ∫ L dt = [${poly([s, 0, m, 0], 't')}] from 0 to ${T} = ${outflow}.`,
          `Amount = ${W0} + ${inflow} − ${outflow} = ${num(ans)} ${unit}.`,
        ],
        pitfalls: [
          `Leaving out the starting ${W0} ${unit} and answering ${num(inflow - outflow)}.`,
          `Using the rates at t = ${T}, R(${T}) − L(${T}) = ${Rt - Lt}, instead of integrating them over the ${T} hours.`,
        ],
      };
    },
  },
  {
    id: 'calc-frq-riemann-table',
    exam: 'ap-calc-ab',
    topicId: 'calc-integration-applications',
    difficulty: 2,
    style: 'frq',
    build: (r) => {
      const { ctx, t, f, left, right, trap, table } = rateTable(r);
      const isLeft = r.next() < 0.5;
      const side = isLeft ? 'left' : 'right';
      const ans = isLeft ? left : right;
      const other = isLeft ? right : left;
      const used = isLeft ? f.slice(0, 4) : f.slice(1);
      const terms = [0, 1, 2, 3].map((i) => `${used[i]}·${t[i + 1] - t[i]}`).join(' + ');
      return {
        prompt: `${ctx.intro} Selected values: ${table}. Using a ${side} Riemann sum with the four subintervals shown in the table, estimate ${ctx.total} from t = 0 to t = ${t[4]}.`,
        answer: `${num(ans)} ${ctx.unit}`,
        wrong: [`${num(other)} ${ctx.unit}`, `${num(trap)} ${ctx.unit}`, `${num(used.reduce((x, y) => x + y, 0))} ${ctx.unit}`],
        steps: [
          `A ${side} sum uses the ${isLeft ? 'first' : 'last'} value on each subinterval times its width.`,
          `Widths: ${[0, 1, 2, 3].map((i) => t[i + 1] - t[i]).join(', ')}.`,
          `${terms} = ${num(ans)} ${ctx.unit}.`,
        ],
        pitfalls: [
          `Using the ${isLeft ? 'right' : 'left'} endpoints, which gives ${num(other)}.`,
          `Adding the values ${list(used)} without multiplying by the unequal widths.`,
        ],
      };
    },
  },
  {
    id: 'calc-frq-trapezoid-table',
    exam: 'ap-calc-ab',
    topicId: 'calc-integration-applications',
    difficulty: 3,
    style: 'frq',
    build: (r) => {
      const { ctx, t, f, left, right, trap, table } = rateTable(r);
      const terms = [0, 1, 2, 3].map((i) => `(${f[i]} + ${f[i + 1]})/2·${t[i + 1] - t[i]}`).join(' + ');
      return {
        prompt: `${ctx.intro} Selected values: ${table}. Using a trapezoidal sum with the four subintervals shown in the table, estimate ${ctx.total} from t = 0 to t = ${t[4]}.`,
        answer: `${num(trap)} ${ctx.unit}`,
        wrong: [`${num(left)} ${ctx.unit}`, `${num(right)} ${ctx.unit}`, `${num(2 * trap)} ${ctx.unit}`],
        steps: [
          'Each trapezoid has area (average of the two end values) × (width), and the widths here are not equal.',
          `${terms}.`,
          `Total = ${num(trap)} ${ctx.unit}.`,
        ],
        pitfalls: [
          `Forgetting to halve each pair of values, which doubles the estimate to ${num(2 * trap)}.`,
          `Using one common width for every subinterval even though they are ${[0, 1, 2, 3].map((i) => t[i + 1] - t[i]).join(', ')}.`,
        ],
      };
    },
  },
  {
    id: 'calc-de-exponential-solution',
    exam: 'ap-calc-ab',
    topicId: 'calc-differential-equations',
    difficulty: 1,
    build: (r) => {
      const L = r.pick(['y', 'P', 'N', 'Q']);
      const k = r.pick([0.2, 0.3, 0.5, 2, 3, 4, -0.1, -0.4, -2, -3]);
      const y0 = r.int(3, 60);
      return {
        prompt: `Which function solves d${L}/dt = ${num(k)}${L} with ${L}(0) = ${y0}?`,
        answer: `${L} = ${y0}e^(${coef(k)}t)`,
        wrong: [`${L} = e^(${coef(k)}t) + ${y0}`, `${L} = ${y0} ${signed(k)}t`, `${L} = ${num(k)}e^(${y0}t)`],
        steps: [
          `Separate: d${L}/${L} = ${num(k)} dt.`,
          `Integrate: ln|${L}| = ${num(k)}t + C, so ${L} = Ae^(${coef(k)}t).`,
          `${L}(0) = A = ${y0}, so ${L} = ${y0}e^(${coef(k)}t).`,
        ],
        pitfalls: [
          `Adding ${y0} as a constant after integrating; the constant becomes a factor A = ${y0} once you exponentiate.`,
          `Treating ${num(k)}${L} as a constant rate, which gives the straight line ${L} = ${y0} ${signed(k)}t.`,
        ],
      };
    },
  },
  {
    id: 'calc-de-slope-field-value',
    exam: 'ap-calc-ab',
    topicId: 'calc-differential-equations',
    difficulty: 1,
    build: (r) => {
      let p = 0;
      let q = 0;
      do {
        p = r.nonZero(-3, 3);
        q = r.nonZero(-3, 3);
      } while (p === q);
      const form = r.int(0, 2);
      if (form === 0) {
        const a = r.nonZero(-3, 3);
        const b = r.nonZero(-3, 3);
        const val = a * p + b * q;
        return {
          prompt: `A slope field is drawn for dy/dx = ${num(a)}x ${signed(b)}y. What is the slope of the segment drawn at the point (${p}, ${q})?`,
          answer: num(val),
          wrong: [num(a * q + b * p), num(a * p - b * q), num(-val)],
          steps: ['A slope field segment at (x, y) has slope dy/dx evaluated there.', `dy/dx = ${num(a)}·${paren(p)} ${signed(b)}·${paren(q)} = ${num(val)}.`],
          pitfalls: [`Swapping the coordinates and evaluating at (${q}, ${p}), which gives ${num(a * q + b * p)}.`, `Losing the sign of ${b}y when y = ${q}.`],
        };
      }
      if (form === 1) {
        const c = r.int(1, 4);
        const val = p * p - c * q;
        return {
          prompt: `A slope field is drawn for dy/dx = x² − ${coef(c)}y. What is the slope of the segment drawn at the point (${p}, ${q})?`,
          answer: num(val),
          wrong: [num(q * q - c * p), num(2 * p - c * q), num(p * p + c * q)],
          steps: ['A slope field segment at (x, y) has slope dy/dx evaluated there.', `dy/dx = ${paren(p)}² − ${c}·${paren(q)} = ${num(val)}.`],
          pitfalls: [`Swapping the coordinates and evaluating at (${q}, ${p}), which gives ${num(q * q - c * p)}.`, `Differentiating x² to 2x; the slope field uses dy/dx as given, so no extra derivative is needed.`],
        };
      }
      let c = 0;
      do {
        c = r.nonZero(-4, 4);
      } while (p + c === 0);
      const val = new Frac(p + c, q);
      return {
        prompt: `A slope field is drawn for dy/dx = (x ${signed(c)})/y. What is the slope of the segment drawn at the point (${p}, ${q})?`,
        answer: val.toString(),
        wrong: [new Frac(q + c, p).toString(), new Frac(q, p + c).toString(), new Frac(p - c, q).toString(), new Frac(-(p + c), q).toString(), num(p + c)],
        steps: ['A slope field segment at (x, y) has slope dy/dx evaluated there.', `dy/dx = (${p} ${signed(c)})/${paren(q)} = ${val}.`],
        pitfalls: [`Swapping the coordinates and evaluating at (${q}, ${p}), which gives ${new Frac(q + c, p)}.`, `Inverting the fraction to y/(x ${signed(c)}), which gives ${new Frac(q, p + c)}.`],
      };
    },
  },
  {
    id: 'calc-de-particular-polynomial',
    exam: 'ap-calc-ab',
    topicId: 'calc-differential-equations',
    difficulty: 2,
    build: (r) => {
      let a = 0;
      let b = 0;
      let c = 0;
      let x0 = 0;
      let Fx0 = 0;
      do {
        a = r.pick([-1, 1, 2]);
        b = r.int(-3, 3);
        c = r.int(-5, 5);
        x0 = r.pick([-1, 1, 2]);
        Fx0 = a * x0 * x0 * x0 + b * x0 * x0 + c * x0;
      } while (Fx0 === 0);
      const y1 = r.int(-8, 8);
      const C = y1 - Fx0;
      const badC = y1 - (3 * a * x0 * x0 * x0 + 2 * b * x0 * x0 + c * x0);
      return {
        prompt: `Find the particular solution of dy/dx = ${poly([3 * a, 2 * b, c])} that satisfies y(${x0}) = ${y1}.`,
        answer: `y = ${poly([a, b, c, C])}`,
        wrong: [`y = ${poly([a, b, c, y1])}`, `y = ${poly([a, b, c, y1 + Fx0])}`, `y = ${poly([3 * a, 2 * b, c, badC])}`],
        steps: [
          `Integrate: y = ${poly([a, b, c, 0])} + C.`,
          `Use y(${x0}) = ${y1}: ${Fx0} + C = ${y1}, so C = ${C}.`,
          `y = ${poly([a, b, c, C])}.`,
        ],
        pitfalls: [
          `Setting C = ${y1} straight away; that only works when the initial condition is at x = 0, not x = ${x0}.`,
          `Raising each power without dividing by the new exponent, which gives y = ${poly([3 * a, 2 * b, c, badC])}.`,
        ],
      };
    },
  },
  {
    id: 'calc-de-doubling-model',
    exam: 'ap-calc-ab',
    topicId: 'calc-differential-equations',
    difficulty: 2,
    build: (r) => {
      if (r.next() < 0.5) {
        const D = r.int(3, 12);
        const grow = r.next() < 0.5;
        const [thing, unit] = r.pick([
          ['the number of cells in a culture', 'hours'],
          ['the value of a rare coin', 'years'],
          ['the mass of a radioactive sample', 'days'],
        ]);
        const sign = grow ? '' : '−';
        return {
          prompt: `Q(t) is ${thing}, with dQ/dt = kQ and t in ${unit}. Q ${grow ? 'doubles' : 'halves'} every ${D} ${unit}. What is k?`,
          answer: `${sign}(ln 2)/${D}`,
          wrong: [`${sign}${D}/(ln 2)`, `${grow ? '−' : ''}(ln 2)/${D}`, `${sign}1/${2 * D}`],
          steps: [
            `The solution is Q = Q₀e^(kt). ${grow ? 'Doubling' : 'Halving'} means e^(${D}k) = ${grow ? '2' : '1/2'}.`,
            `Take logs: ${D}k = ${grow ? 'ln 2' : '−ln 2'}.`,
            `k = ${sign}(ln 2)/${D}.`,
          ],
          pitfalls: [
            `Writing k = ${D}/(ln 2), which is the reciprocal of the right value.`,
            grow ? 'Giving k a negative sign; a quantity that doubles has k > 0.' : 'Leaving k positive; a quantity that halves decays, so k < 0.',
          ],
        };
      }
      const g = r.pick([2, 3]);
      const n = g === 2 ? r.int(3, 4) : r.int(2, 3);
      const D = r.int(2, 8);
      const P0 = r.int(1, 6) * 50;
      const word = g === 2 ? 'doubles' : 'triples';
      const ans = P0 * Math.pow(g, n);
      return {
        prompt: `A culture of bacteria grows according to dP/dt = kP. It starts with ${P0} bacteria and ${word} every ${D} hours. How many bacteria are there after ${n * D} hours?`,
        answer: num(ans),
        wrong: [num(P0 * g * n), num(P0 * Math.pow(g, n - 1)), num(P0 * Math.pow(g, n + 1))],
        steps: [
          `dP/dt = kP gives exponential growth, so P = ${P0}·${g}^(t/${D}).`,
          `${n * D} hours is ${n} periods of ${D} hours.`,
          `P = ${P0}·${g}^${n} = ${num(ans)}.`,
        ],
        pitfalls: [
          `Multiplying by ${g} × ${n} = ${g * n} instead of by ${g}^${n} = ${Math.pow(g, n)}.`,
          `Counting ${n - 1} or ${n + 1} periods instead of ${n * D}/${D} = ${n}.`,
        ],
      };
    },
  },
  {
    id: 'calc-de-second-derivative',
    exam: 'ap-calc-ab',
    topicId: 'calc-differential-equations',
    difficulty: 3,
    build: (r) => {
      const p = r.nonZero(-3, 3);
      const q = r.nonZero(-3, 3);
      const form = r.int(0, 2);
      let rhs = '';
      let y1 = 0;
      let y2 = 0;
      let noChain = 0;
      let partial = 0;
      let step2 = '';
      if (form === 0) {
        const a = r.nonZero(-3, 3);
        const b = r.nonZero(-3, 3);
        rhs = `${num(a)}x ${signed(b)}y`;
        y1 = a * p + b * q;
        y2 = a + b * y1;
        noChain = a;
        partial = a - b * y1;
        step2 = `d²y/dx² = ${a} ${signed(b)}·dy/dx = ${a} ${signed(b)}·${paren(y1)}`;
      } else if (form === 1) {
        const k = r.nonZero(-2, 2);
        rhs = `${coef(k)}xy`;
        y1 = k * p * q;
        y2 = k * q + k * p * y1;
        noChain = k * q;
        partial = k * p * y1;
        step2 = `d²y/dx² = ${coef(k)}(y + x·dy/dx) = ${k}·(${q} ${signed(p * y1)})`;
      } else {
        const c = r.nonZero(-2, 2);
        rhs = `${coef(c)}y² + x`;
        y1 = c * q * q + p;
        y2 = 2 * c * q * y1 + 1;
        noChain = 1;
        partial = 2 * c * q + 1;
        step2 = `d²y/dx² = ${2 * c}y·dy/dx + 1 = ${2 * c * q}·${paren(y1)} + 1`;
      }
      return {
        prompt: `Let y = f(x) satisfy dy/dx = ${rhs}, with f(${p}) = ${q}. What is d²y/dx² at x = ${p}?`,
        answer: num(y2),
        wrong: [num(noChain), num(y1), num(partial)],
        steps: [`At (${p}, ${q}): dy/dx = ${num(y1)}.`, `Differentiate the equation implicitly, treating y as a function of x: ${step2}.`, `d²y/dx² = ${num(y2)}.`],
        pitfalls: [
          `Treating y as a constant when differentiating, which gives ${num(noChain)}.`,
          `Stopping at the first derivative, dy/dx = ${num(y1)}.`,
        ],
      };
    },
  },
  {
    id: 'calc-frq-de-tangent-approx',
    exam: 'ap-calc-ab',
    topicId: 'calc-differential-equations',
    difficulty: 2,
    style: 'frq',
    build: (r) => {
      let x0 = 0;
      let y0 = 0;
      let m = 0;
      let rhs = '';
      let work = '';
      do {
        x0 = r.int(-2, 3);
        y0 = r.nonZero(-4, 5);
        const form = r.int(0, 2);
        if (form === 0) {
          rhs = 'xy';
          m = x0 * y0;
          work = `${x0}·${paren(y0)}`;
        } else if (form === 1) {
          const a = r.nonZero(-3, 3);
          rhs = `${num(a)}x − y`;
          m = a * x0 - y0;
          work = `${a}·${paren(x0)} − ${paren(y0)}`;
        } else {
          rhs = 'x² − 2y';
          m = x0 * x0 - 2 * y0;
          work = `${paren(x0)}² − 2·${paren(y0)}`;
        }
      } while (m === 0);
      const h = r.pick([0.1, 0.2, -0.1, 0.5]);
      const ans = y0 + m * h;
      const x1 = x0 + h;
      return {
        prompt: `Let y = f(x) be the particular solution to dy/dx = ${rhs} with f(${x0}) = ${y0}. Use the line tangent to the graph of f at x = ${x0} to approximate f(${num(x1)}).`,
        answer: num(ans),
        wrong: [num(y0 - m * h), num(m * h), num(y0 + m), num(y0 + h), num(m + h)],
        steps: [
          `Slope at (${x0}, ${y0}): dy/dx = ${work} = ${m}.`,
          `Tangent line: y = ${y0} ${m < 0 ? '−' : '+'} ${Math.abs(m) === 1 ? '' : Math.abs(m)}${x0 === 0 ? 'x' : `(x ${signed(-x0)})`}.`,
          `f(${num(x1)}) ≈ ${y0} ${signed(m)}·${paren(h)} = ${num(ans)}.`,
        ],
        pitfalls: [
          `Forgetting to add the starting value f(${x0}) = ${y0}, which leaves only ${num(m * h)}.`,
          `Multiplying the slope ${m} by 1 instead of by the step ${num(h)}, which gives ${num(y0 + m)}.`,
        ],
      };
    },
  },
];
