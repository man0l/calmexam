import { Frac, money, num, paren, poly, signed, Template } from '../core';

export const SAT_TEMPLATES: Template[] = [
  {
    id: 'sat-linear-solve',
    exam: 'sat',
    topicId: 'sat-linear-equations',
    difficulty: 1,
    build: (r) => {
      const x = r.nonZero(-9, 12);
      const a = r.int(3, 9);
      let c = r.int(1, 8);
      if (c === a) c = a + 1;
      const b = r.int(-15, 15);
      const d = a * x + b - c * x;
      return {
        prompt: `If ${a}x ${signed(b)} = ${c}x ${signed(d)}, what is the value of x?`,
        answer: String(x).replace('-', '−'),
        wrong: [
          String(new Frac(d + b, a - c)),
          String(new Frac(d - b, a + c)),
          String(-x).replace('-', '−'),
        ],
        steps: [
          `Collect the x terms on one side: ${a}x − ${c}x = ${d} ${signed(-b)}.`,
          `Simplify: ${a - c}x = ${d - b}.`,
          `Divide both sides by ${a - c}: x = ${num(x)}.`,
        ],
        pitfalls: ['Moving a term across the equals sign without changing its sign.', 'Adding the x coefficients instead of subtracting them.'],
      };
    },
  },
  {
    id: 'sat-linear-word',
    exam: 'sat',
    topicId: 'sat-linear-equations',
    difficulty: 1,
    build: (r) => {
      const fee = r.int(2, 9) * 5;
      const rate = r.int(3, 12);
      const n = r.int(4, 20);
      const total = fee + rate * n;
      const [one, many] = r.pick([
        ['hour of tutoring', 'hours of tutoring'],
        ['guitar lesson', 'guitar lessons'],
        ['day of bike rental', 'days of bike rental'],
        ['yoga class', 'yoga classes'],
      ]);
      return {
        prompt: `A plan charges a one-time fee of $${fee} plus $${rate} per ${one}. A customer paid $${total} in total. How many ${many} did the customer pay for?`,
        answer: String(n),
        wrong: [String(Math.round(total / rate)), String(n + 1), String(Math.round((total + fee) / rate))],
        steps: [
          `Write the cost as an equation: ${fee} + ${rate}n = ${total}.`,
          `Subtract the fee: ${rate}n = ${total - fee}.`,
          `Divide by ${rate}: n = ${n}.`,
        ],
        pitfalls: ['Forgetting to subtract the one-time fee before dividing.'],
      };
    },
  },
  {
    id: 'sat-slope',
    exam: 'sat',
    topicId: 'sat-linear-functions',
    difficulty: 1,
    build: (r) => {
      const x1 = r.int(-6, 6);
      let x2 = r.int(-6, 6);
      if (x2 === x1) x2 = x1 + r.int(1, 4);
      const y1 = r.int(-9, 9);
      const y2 = r.int(-9, 9);
      const m = new Frac(y2 - y1, x2 - x1);
      const inv = y2 === y1 ? new Frac(x2 - x1 + 1, 1) : new Frac(x2 - x1, y2 - y1);
      return {
        prompt: `A line passes through the points (${x1}, ${y1}) and (${x2}, ${y2}). What is the slope of the line?`,
        answer: m.toString(),
        wrong: [inv.toString(), m.neg().toString(), new Frac(y2 + y1, x2 + x1 === 0 ? 1 : x2 + x1).toString()],
        steps: [
          'Slope = (change in y) ÷ (change in x).',
          `Change in y: ${y2} − ${paren(y1)} = ${y2 - y1}. Change in x: ${x2} − ${paren(x1)} = ${x2 - x1}.`,
          `Slope = ${y2 - y1}/${x2 - x1} = ${m}.`,
        ],
        pitfalls: ['Dividing change in x by change in y (upside down).', 'Subtracting the coordinates in a different order on top and bottom.'],
      };
    },
  },
  {
    id: 'sat-function-eval',
    exam: 'sat',
    topicId: 'sat-linear-functions',
    difficulty: 1,
    build: (r) => {
      const a = r.nonZero(-4, 5);
      const b = r.int(-9, 9);
      const c = r.int(-12, 12);
      const k = r.nonZero(-5, 5);
      const val = a * k * k + b * k + c;
      return {
        prompt: `The function f is defined by f(x) = ${poly([a, b, c])}. What is the value of f(${k})?`,
        answer: num(val),
        wrong: [num(-a * k * k + b * k + c), num(a * k * 2 + b * k + c), num(a * k * k - b * k + c)],
        steps: [
          `Substitute x = ${k} into each term.`,
          `${paren(k)}² = ${k * k}, so ${a === 1 ? '' : a === -1 ? '−' : a}x² = ${a * k * k}${b ? `, ${b === 1 ? '' : b === -1 ? '−' : b}x = ${b * k}` : ''}${c ? `, and the constant is ${c}` : ''}.`,
          `Add: f(${k}) = ${num(val)}.`,
        ],
        pitfalls: ['Squaring a negative number and keeping the minus sign.', 'Computing 2·x instead of x².'],
      };
    },
  },
  {
    id: 'sat-system',
    exam: 'sat',
    topicId: 'sat-systems',
    difficulty: 2,
    build: (r) => {
      const x = r.int(-6, 9);
      const y = r.int(-6, 9);
      const a1 = r.int(1, 5);
      const b1 = r.nonZero(-4, 4);
      let a2 = r.int(1, 5);
      const b2 = r.nonZero(-4, 4);
      if (a1 * b2 === a2 * b1) a2 = a2 + 1;
      const c1 = a1 * x + b1 * y;
      const c2 = a2 * x + b2 * y;
      const askSum = r.next() < 0.5;
      const ans = askSum ? x + y : x;
      return {
        prompt: `${poly([a1])}x ${b1 < 0 ? '−' : '+'} ${Math.abs(b1) === 1 ? '' : Math.abs(b1)}y = ${c1}\n${poly([a2])}x ${b2 < 0 ? '−' : '+'} ${Math.abs(b2) === 1 ? '' : Math.abs(b2)}y = ${c2}\nIf (x, y) is the solution to the system above, what is the value of ${askSum ? 'x + y' : 'x'}?`.replace(/^1x/gm, 'x'),
        answer: num(ans),
        wrong: askSum ? [num(x), num(y), num(x - y)] : [num(y), num(x + y), num(-x)],
        steps: [
          `Eliminate y: multiply the first equation by ${b2} and the second by ${b1}, then subtract.`,
          `${a1 * b2 - a2 * b1}x = ${c1 * b2 - c2 * b1}, so x = ${x}.`,
          `Substitute back into the first equation to get y = ${y}.`,
          askSum ? `x + y = ${x} ${signed(y)} = ${x + y}.` : `The question asks for x, so the answer is ${x}.`,
        ],
        pitfalls: ['Answering with y when the question asks for x (or the sum).', 'Sign errors when subtracting the equations.'],
      };
    },
  },
  {
    id: 'sat-quadratic-roots',
    exam: 'sat',
    topicId: 'sat-quadratics',
    difficulty: 2,
    build: (r) => {
      const p = r.int(1, 9);
      const q = -r.int(1, 9);
      const b = -(p + q);
      const c = p * q;
      return {
        prompt: `What is the positive solution to the equation ${poly([1, b, c])} = 0?`,
        answer: String(p),
        wrong: [String(-q), String(-p), String(Math.abs(c))],
        steps: [
          `Find two numbers that multiply to ${c} and add to ${b}: they are ${-p} and ${-q === 0 ? 0 : -q}.`,
          `Factor: (x − ${p})(x ${signed(-q)}) = 0.`,
          `So x = ${p} or x = ${num(q)}. The positive solution is ${p}.`,
        ],
        pitfalls: ['Taking the numbers from the factors (x − p) without flipping the sign.', 'Picking the negative root.'],
      };
    },
  },
  {
    id: 'sat-vertex',
    exam: 'sat',
    topicId: 'sat-quadratics',
    difficulty: 2,
    build: (r) => {
      const a = r.nonZero(-3, 3);
      const h = r.nonZero(-6, 6);
      const k = r.int(-10, 10);
      const b = -2 * a * h;
      const c = a * h * h + k;
      return {
        prompt: `The graph of y = ${poly([a, b, c])} is a parabola. What is the x-coordinate of its vertex?`,
        answer: num(h),
        wrong: [num(-h), num(k), num(new Frac(-b, a).value())],
        steps: [
          'The vertex of y = ax² + bx + c is at x = −b / (2a).',
          `Here a = ${a} and b = ${b}, so x = −(${b}) / (2·${paren(a)}) = ${num(h)}.`,
        ],
        pitfalls: ['Forgetting the 2 in the denominator.', 'Dropping the minus sign in −b.'],
      };
    },
  },
  {
    id: 'sat-percent-change',
    exam: 'sat',
    topicId: 'sat-percentages',
    difficulty: 2,
    build: (r) => {
      const p = r.int(4, 40) * 5;
      const up = r.pick([10, 20, 25, 30, 40, 50]);
      const down = r.pick([10, 20, 25, 30, 40, 50]);
      const final = (p * (100 + up) * (100 - down)) / 10000;
      return {
        prompt: `A jacket costs $${p}. The price is increased by ${up}%, and then the new price is decreased by ${down}%. What is the final price?`,
        answer: money(final),
        wrong: [money((p * (100 + up - down)) / 100), money((p * (100 - up) * (100 + down)) / 10000), money(p * (1 + up / 100))],
        steps: [
          `After the ${up}% increase: ${p} × ${1 + up / 100} = ${num((p * (100 + up)) / 100)}.`,
          `After the ${down}% decrease: ${num((p * (100 + up)) / 100)} × ${num(1 - down / 100)} = ${num(final)}.`,
        ],
        pitfalls: [`Adding and subtracting the percentages directly (${up}% − ${down}%). The second change applies to the new price.`],
      };
    },
  },
  {
    id: 'sat-percent-of',
    exam: 'sat',
    topicId: 'sat-percentages',
    difficulty: 1,
    build: (r) => {
      const whole = r.pick([20, 25, 40, 50, 80, 120, 150, 200, 250, 400]);
      const pct = r.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 75]);
      const part = (whole * pct) / 100;
      return {
        prompt: `${num(part)} is what percent of ${whole}?`,
        answer: `${pct}%`,
        wrong: [`${num((whole / part) * 10)}%`, `${num(100 - pct)}%`, `${num(part)}%`],
        steps: [`Percent = part ÷ whole × 100.`, `${num(part)} ÷ ${whole} = ${num(pct / 100)}.`, `${num(pct / 100)} × 100 = ${pct}%.`],
        pitfalls: ['Dividing the whole by the part.'],
      };
    },
  },
  {
    id: 'sat-exponential',
    exam: 'sat',
    topicId: 'sat-exponentials',
    difficulty: 2,
    build: (r) => {
      const p = r.int(2, 12) * 100;
      const k = r.pick([2, 3, 4, 5]);
      const t = k * r.int(2, 4);
      const v = p * Math.pow(2, t / k);
      return {
        prompt: `A bacteria culture starts with ${p} cells and doubles every ${k} hours. How many cells will there be after ${t} hours?`,
        answer: num(v),
        wrong: [num(p * 2 * (t / k)), num(p * Math.pow(2, t / k - 1)), num(p * Math.pow(2, t / k + 1))],
        steps: [
          `The number of doublings is ${t} ÷ ${k} = ${t / k}.`,
          `Cells = ${p} × 2^${t / k} = ${p} × ${Math.pow(2, t / k)} = ${num(v)}.`,
        ],
        pitfalls: ['Multiplying by 2 × (number of doublings) instead of raising 2 to that power.', 'Using the number of hours as the exponent.'],
      };
    },
  },
  {
    id: 'sat-circle-radius',
    exam: 'sat',
    topicId: 'sat-circles',
    difficulty: 3,
    build: (r) => {
      const h = r.nonZero(-6, 6);
      const k = r.nonZero(-6, 6);
      const rad = r.int(2, 9);
      const D = -2 * h;
      const E = -2 * k;
      const F = h * h + k * k - rad * rad;
      return {
        prompt: `The equation of a circle in the xy-plane is x² + y² ${signed(D)}x ${signed(E)}y ${signed(F)} = 0. What is the radius of the circle?`,
        answer: String(rad),
        wrong: [String(rad * rad), String(Math.abs(F)), String(Math.abs(h) + Math.abs(k))],
        steps: [
          'Complete the square in x and in y.',
          `(x ${signed(-h)})² + (y ${signed(-k)})² = ${-F} + ${h * h} + ${k * k} = ${rad * rad}.`,
          `The right side is r², so r = √${rad * rad} = ${rad}.`,
        ],
        pitfalls: ['Giving r² as the radius.', 'Forgetting to add the completed-square constants to the right side.'],
      };
    },
  },
  {
    id: 'sat-sector-area',
    exam: 'sat',
    topicId: 'sat-circles',
    difficulty: 2,
    build: (r) => {
      const rad = r.int(2, 12);
      const ang = r.pick([30, 45, 60, 90, 120, 135, 150, 180, 240, 270]);
      const a = new Frac(ang * rad * rad, 360);
      const piStr = (f: Frac) => (f.d === 1 ? (f.n === 1 ? 'π' : `${f.n}π`) : `${f.n}π/${f.d}`);
      return {
        prompt: `A circle has radius ${rad}. What is the area of a sector with a central angle of ${ang}°?`,
        answer: piStr(a),
        wrong: [piStr(new Frac(ang * rad * 2, 360)), piStr(new Frac(rad * rad)), piStr(new Frac(ang * rad, 360))],
        steps: [
          'Sector area = (angle ÷ 360°) × πr².',
          `πr² = ${rad * rad}π.`,
          `(${ang}/360) × ${rad * rad}π = ${piStr(a)}.`,
        ],
        pitfalls: ['Using the circumference 2πr instead of the area πr².'],
      };
    },
  },
  {
    id: 'sat-pythagorean',
    exam: 'sat',
    topicId: 'sat-geometry',
    difficulty: 1,
    build: (r) => {
      const [a0, b0, c0] = r.pick([
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
        [7, 24, 25],
      ]);
      const s = r.int(1, 4);
      const [a, b, c] = [a0 * s, b0 * s, c0 * s];
      const askHyp = r.next() < 0.5;
      return {
        prompt: askHyp
          ? `A right triangle has legs of length ${a} and ${b}. What is the length of the hypotenuse?`
          : `A right triangle has a hypotenuse of length ${c} and one leg of length ${a}. What is the length of the other leg?`,
        answer: String(askHyp ? c : b),
        wrong: askHyp ? [String(a + b), String(c + s), String(a * b)] : [String(c - a), String(c + a), String(b + s)],
        steps: askHyp
          ? ['Use a² + b² = c².', `${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}.`, `c = √${c * c} = ${c}.`]
          : ['Use a² + b² = c².', `b² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}.`, `b = √${b * b} = ${b}.`],
        pitfalls: ['Adding the side lengths instead of their squares.', 'Adding squares when you should subtract (finding a leg).'],
      };
    },
  },
  {
    id: 'sat-mean-missing',
    exam: 'sat',
    topicId: 'sat-statistics',
    difficulty: 2,
    build: (r) => {
      const n = r.int(4, 6);
      const vals = Array.from({ length: n }, () => r.int(60, 93));
      const missing = r.int(55, 100);
      const total = vals.reduce((s, v) => s + v, 0) + missing;
      const mean = new Frac(total, n + 1);
      if (!mean.isInt()) {
        const fix = (n + 1 - (total % (n + 1))) % (n + 1);
        vals[0] += fix;
      }
      const tot2 = vals.reduce((s, v) => s + v, 0) + missing;
      const m = tot2 / (n + 1);
      const known = vals.reduce((s, v) => s + v, 0);
      return {
        prompt: `A student's first ${n} test scores are ${vals.join(', ')}. What score does the student need on the next test so that the mean of all ${n + 1} scores is exactly ${m}?`,
        answer: String(missing),
        wrong: [String(m), String(Math.round(known / n)), String(m * n - known + m)],
        steps: [
          `For a mean of ${m} over ${n + 1} tests, the total must be ${m} × ${n + 1} = ${m * (n + 1)}.`,
          `The first ${n} scores add up to ${known}.`,
          `Needed score = ${m * (n + 1)} − ${known} = ${missing}.`,
        ],
        pitfalls: [`Multiplying the mean by ${n} instead of ${n + 1} tests.`],
      };
    },
  },
];
