import { Frac, gcd, money, num, paren, poly, signed, sup, Template } from '../core';

const piStr = (f: Frac): string => (f.d === 1 ? (f.n === 1 ? 'π' : `${f.n}π`) : `${f.n === 1 ? '' : f.n}π/${f.d}`);

const surd = (c: number, root: number): string => (root === 1 ? String(c) : c === 1 ? `√${root}` : `${c}√${root}`);

const rootStr = (n: number): string => {
  const s = Math.round(Math.sqrt(n));
  return s * s === n ? String(s) : `√${n}`;
};

const pt = (x: number, y: number): string => `(${x}, ${y})`;

const compoundCents = (p: number, rate: number, t: number): number => Math.round((p * Math.pow(100 + rate, t)) / Math.pow(100, t - 1));

export const SAT_EXTRA_TEMPLATES: Template[] = [
  {
    id: 'sat-linear-distribute',
    exam: 'sat',
    topicId: 'sat-linear-equations',
    difficulty: 2,
    build: (r) => {
      const x = r.nonZero(-8, 10);
      const a = r.int(2, 7);
      let c = r.int(2, 7);
      if (c === a) c = a === 7 ? 2 : a + 1;
      const b = r.nonZero(-9, 9);
      const d = r.nonZero(-9, 9);
      const e = a * (x + b) - c * (x + d);
      const tail = e === 0 ? '' : ` ${signed(e)}`;
      return {
        prompt: `What value of x satisfies the equation ${a}(x ${signed(b)}) = ${c}(x ${signed(d)})${tail}?`,
        answer: num(x),
        wrong: [new Frac(d + e - b, a - c).toString(), new Frac(c * d + e - a * b, a + c).toString(), num(-x)],
        steps: [
          `Distribute on both sides: ${a}x ${signed(a * b)} = ${c}x ${signed(c * d + e)}.`,
          `Collect x terms on the left and numbers on the right: ${a - c}x = ${c * d + e - a * b}.`,
          `Divide by ${a - c}: x = ${num(x)}.`,
        ],
        pitfalls: [
          `Multiplying only the x by ${a}. The ${a} also multiplies ${b}, so the left side is ${a}x ${signed(a * b)}.`,
          `Forgetting that ${c} multiplies ${d} as well, which gives ${c * d}.`,
        ],
      };
    },
  },
  {
    id: 'sat-linear-solution-count',
    exam: 'sat',
    topicId: 'sat-linear-equations',
    difficulty: 3,
    build: (r) => {
      const a = r.int(2, 6);
      const b = r.nonZero(-8, 8);
      let c = r.nonZero(-5, 5);
      if (a + c === 0) c += 1;
      const s = a + c;
      const k0 = a * b;
      const kind = r.pick(['one', 'none', 'many'] as const);
      let e = s;
      let f = k0;
      if (kind === 'none') f = k0 + r.nonZero(-6, 6);
      if (kind === 'one') {
        let delta = r.nonZero(-3, 3);
        if (s + delta === 0) delta = -delta;
        e = s + delta;
        f = r.int(-12, 12);
      }
      const labels = { one: 'Exactly one solution', none: 'No solution', many: 'Infinitely many solutions' };
      const finalStep =
        kind === 'one'
          ? `The x coefficients differ (${s} and ${e}), so the equation becomes ${s - e}x = ${f - k0}, which has exactly one solution.`
          : kind === 'none'
            ? `The x terms match (${s}x on both sides) but the constants differ, so removing the x terms leaves ${k0} = ${f}, which is never true. There is no solution.`
            : `Both sides are the same expression, so the equation is true for every x. There are infinitely many solutions.`;
      const pitfall =
        kind === 'one'
          ? `Combining ${a}x and ${c}x incorrectly. The left side has ${s}x, which differs from ${e}x, so there is exactly one solution.`
          : kind === 'none'
            ? `Seeing ${s}x on both sides and deciding x = 0 works, when the leftover statement ${k0} = ${f} is false.`
            : `Reading the leftover ${k0} = ${k0} as "no solution". A statement that is always true means every x works.`;
      return {
        prompt: `How many solutions does the equation ${a}(x ${signed(b)}) ${signed(c)}x = ${poly([e, f])} have?`,
        answer: labels[kind],
        wrong: [...(['one', 'none', 'many'] as const).filter((k) => k !== kind).map((k) => labels[k]), 'Exactly two solutions'],
        steps: [
          `Distribute and combine the left side: ${a}x ${signed(k0)} ${signed(c)}x = ${poly([s, k0])}.`,
          `Compare it with the right side, ${poly([e, f])}.`,
          finalStep,
        ],
        pitfalls: [pitfall, `Forgetting to multiply ${b} by ${a} when distributing, which changes the constant.`],
      };
    },
  },
  {
    id: 'sat-linear-expression-value',
    exam: 'sat',
    topicId: 'sat-linear-equations',
    difficulty: 2,
    build: (r) => {
      const k = r.int(2, 5);
      const a = r.int(2, 7);
      const b = r.nonZero(-9, 9);
      const x = r.nonZero(-6, 9);
      const val = a * x + b;
      const rhs = k * val;
      return {
        prompt: `If ${k * a}x ${signed(k * b)} = ${rhs}, what is the value of ${a}x ${signed(b)}?`,
        answer: num(val),
        wrong: [num(x), num(rhs), num(k * a * x)],
        steps: [
          `Notice that ${k * a}x ${signed(k * b)} = ${k}(${a}x ${signed(b)}).`,
          `So ${k}(${a}x ${signed(b)}) = ${rhs}.`,
          `Divide both sides by ${k}: ${a}x ${signed(b)} = ${num(val)}.`,
        ],
        pitfalls: [
          `Solving for x (x = ${num(x)}) and stopping, when the question asks for ${a}x ${signed(b)}.`,
          `Missing the common factor ${k}, which turns the question into a single division.`,
        ],
      };
    },
  },
  {
    id: 'sat-line-intercept',
    exam: 'sat',
    topicId: 'sat-linear-functions',
    difficulty: 2,
    build: (r) => {
      const m = r.nonZero(-5, 5);
      const b = r.int(-10, 10);
      const x1 = r.nonZero(-6, 6);
      let x2 = r.nonZero(-6, 6);
      if (x2 === x1) x2 = x1 === 6 ? -6 : x1 + 1;
      const y1 = m * x1 + b;
      const y2 = m * x2 + b;
      return {
        prompt: `A line in the xy-plane passes through the points (${x1}, ${y1}) and (${x2}, ${y2}). What is the y-coordinate of the y-intercept of the line?`,
        answer: num(b),
        wrong: [num(y1 + m * x1), num(m), num(-b)],
        steps: [
          `Slope: (${y2} − ${paren(y1)}) ÷ (${x2} − ${paren(x1)}) = ${y2 - y1}/${x2 - x1} = ${m}.`,
          `Substitute (${x1}, ${y1}) into y = ${m}x + b: ${y1} = ${m * x1} + b.`,
          `So b = ${y1} − ${paren(m * x1)} = ${b}.`,
        ],
        pitfalls: [`Adding ${paren(m * x1)} instead of subtracting it when solving for b, which gives ${y1 + m * x1}.`, `Answering with the slope ${m} instead of the intercept.`],
      };
    },
  },
  {
    id: 'sat-parallel-perpendicular-slope',
    exam: 'sat',
    topicId: 'sat-linear-functions',
    difficulty: 3,
    build: (r) => {
      const a = r.nonZero(-6, 6);
      let b = r.nonZero(-6, 6);
      if (Math.abs(a) === Math.abs(b)) b = b > 0 ? b + 1 : b - 1;
      const c = r.int(-15, 15);
      const perp = r.next() < 0.6;
      const m = new Frac(-a, b);
      const ans = perp ? new Frac(b, a) : m;
      return {
        prompt: `Line ℓ in the xy-plane has equation ${a}x ${signed(b)}y = ${c}. Line k is ${perp ? 'perpendicular' : 'parallel'} to line ℓ. What is the slope of line k?`,
        answer: ans.toString(),
        wrong: perp ? [m.toString(), new Frac(-b, a).toString(), new Frac(a, b).toString()] : [new Frac(b, a).toString(), new Frac(a, b).toString(), new Frac(-b, a).toString()],
        steps: [
          `Solve for y: ${b}y = ${poly([-a, c])}.`,
          `Divide by ${b}: the slope of line ℓ is ${m}.`,
          perp ? `Perpendicular slopes multiply to −1, so the slope of k is the negative reciprocal of ${m}, which is ${ans}.` : `Parallel lines have equal slopes, so line k also has slope ${m}.`,
        ],
        pitfalls: perp
          ? [`Flipping ${m} to ${new Frac(-b, a)} but forgetting to change the sign.`, `Reading the slope as ${new Frac(a, b)} straight from the coefficients, without the minus sign in −a/b.`]
          : [`Using the negative reciprocal ${new Frac(b, a)}, which is the slope of a perpendicular line.`, `Reading the slope as ${new Frac(a, b)} straight from the coefficients, without the minus sign in −a/b.`],
      };
    },
  },
  {
    id: 'sat-function-solve-input',
    exam: 'sat',
    topicId: 'sat-linear-functions',
    difficulty: 1,
    build: (r) => {
      const a = r.nonZero(-6, 8);
      const b = r.int(-12, 12);
      const k = r.nonZero(-9, 9);
      const v = a * k + b;
      const name = r.pick(['f', 'g', 'h']);
      return {
        prompt: `The function ${name} is defined by ${name}(x) = ${poly([a, b])}. For what value of x does ${name}(x) = ${v}?`,
        answer: num(k),
        wrong: [num(a * v + b), new Frac(v + b, a).toString(), num(-k)],
        steps: [
          `Set ${poly([a, b])} = ${v}.`,
          ...(b === 0 ? [] : [`${b > 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides: ${a}x = ${v - b}.`]),
          `Divide by ${a}: x = ${num(k)}.`,
        ],
        pitfalls: [`Finding ${name}(${v}) = ${a * v + b} instead of solving ${name}(x) = ${v}.`, `Moving ${b} to the other side without changing its sign.`],
      };
    },
  },
  {
    id: 'sat-system-substitution',
    exam: 'sat',
    topicId: 'sat-systems',
    difficulty: 1,
    build: (r) => {
      const x = r.nonZero(-6, 8);
      const m = r.nonZero(-5, 6);
      let n = r.nonZero(-5, 6);
      if (n === m) n = m + 1 === 0 ? m + 2 : m + 1;
      const b = r.int(-10, 10);
      const y = m * x + b;
      const c = y - n * x;
      return {
        prompt: `y = ${poly([m, b])}\ny = ${poly([n, c])}\nIf (x, y) is the solution to the system of equations above, what is the value of y?`,
        answer: num(y),
        wrong: [num(x), num(-m * x + b), num(c)],
        steps: [
          `Both equations equal y, so set them equal: ${poly([m, b])} = ${poly([n, c])}.`,
          `Collect terms: ${m - n}x = ${c - b}, so x = ${x}.`,
          `Substitute into y = ${poly([m, b])}: y = ${m}·${paren(x)} ${signed(b)} = ${y}.`,
        ],
        pitfalls: [`Stopping at x = ${x} when the question asks for y.`, `Moving ${b} across with the wrong sign, which gives x = ${-x} and the wrong y.`],
      };
    },
  },
  {
    id: 'sat-system-mixture-count',
    exam: 'sat',
    topicId: 'sat-systems',
    difficulty: 2,
    build: (r) => {
      const ctx = r.pick([
        { hi: 'adult tickets', lo: 'student tickets', ph: r.pick([900, 1000, 1200, 1400]), pl: r.pick([400, 500, 600]), kind: 'tickets' },
        { hi: 'quarters', lo: 'dimes', ph: 25, pl: 10, kind: 'coins' },
        { hi: 'large pizzas', lo: 'small pizzas', ph: r.pick([1400, 1500, 1600]), pl: r.pick([800, 900, 1000]), kind: 'pizzas' },
      ]);
      const h = r.int(6, 40);
      let l = r.int(6, 40);
      if (l === h) l += 3;
      const n = h + l;
      const total = h * ctx.ph + l * ctx.pl;
      const tot = money(total / 100);
      const prompt =
        ctx.kind === 'tickets'
          ? `A theater sold ${n} tickets for a total of ${tot}. Adult tickets cost ${money(ctx.ph / 100)} each and student tickets cost ${money(ctx.pl / 100)} each. How many student tickets were sold?`
          : ctx.kind === 'coins'
            ? `A jar holds ${n} coins, all quarters and dimes, with a total value of ${tot}. How many dimes are in the jar?`
            : `A club ordered ${n} pizzas for a total of ${tot}. Large pizzas cost ${money(ctx.ph / 100)} each and small pizzas cost ${money(ctx.pl / 100)} each. How many small pizzas did the club order?`;
      const p1 = num(ctx.ph / 100);
      const p2 = num(ctx.pl / 100);
      return {
        prompt,
        answer: String(l),
        wrong: [String(h), String(Math.round(n / 2)), String(Math.abs(h - l))],
        steps: [
          `Let x be the number of ${ctx.hi} and y the number of ${ctx.lo}: x + y = ${n} and ${p1}x + ${p2}y = ${num(total / 100)}.`,
          `Substitute x = ${n} − y: ${p1}(${n} − y) + ${p2}y = ${num(total / 100)}.`,
          `So ${num((ctx.ph - ctx.pl) / 100)}y = ${num((ctx.ph * n - total) / 100)}, which gives y = ${l}.`,
        ],
        pitfalls: [`Giving the number of ${ctx.hi} (${h}) instead of the number of ${ctx.lo}.`, `Splitting the ${n} items in half, which ignores the different prices.`],
      };
    },
  },
  {
    id: 'sat-system-no-solution-k',
    exam: 'sat',
    topicId: 'sat-systems',
    difficulty: 3,
    build: (r) => {
      const a = r.nonZero(-6, 7);
      const b = r.nonZero(-6, 6);
      const c1 = r.int(-12, 12);
      const m = r.pick([2, 3, 4, -2, -3]);
      let c2 = r.int(-20, 20);
      if (c2 === m * c1) c2 += r.pick([1, -1]) * r.int(1, 5);
      const k = m * a;
      return {
        prompt: `${a}x ${signed(b)}y = ${c1}\nkx ${signed(m * b)}y = ${c2}\nIn the system of equations above, k is a constant. For what value of k does the system have no solution?`,
        answer: num(k),
        wrong: [num(a), num(-k), new Frac(a, m).toString()],
        steps: [
          'A linear system has no solution when the lines are parallel: the x and y coefficients are in the same ratio, but the constants are not.',
          `The y coefficients are in the ratio ${m * b} ÷ ${paren(b)} = ${m}.`,
          `So k = ${m} × ${paren(a)} = ${k}. Check the constants: ${m} × ${paren(c1)} = ${m * c1}, which is not ${c2}, so the lines are parallel and distinct.`,
        ],
        pitfalls: [`Setting k equal to ${a}, the x coefficient of the first equation, without scaling by ${m}.`, `Dividing by ${m} instead of multiplying, which gives ${new Frac(a, m)}.`],
      };
    },
  },
  {
    id: 'sat-system-combine',
    exam: 'sat',
    topicId: 'sat-systems',
    difficulty: 2,
    build: (r) => {
      const x = r.int(-5, 9);
      const y = r.int(-5, 9);
      const a = r.int(2, 9);
      let b = r.int(1, 8);
      if (b === a) b = a - 1;
      const sum = r.next() < 0.5;
      const p = a * x + b * y;
      const q = b * x + a * y;
      const ans = sum ? x + y : x - y;
      return {
        prompt: `${a}x + ${b}y = ${p}\n${b}x + ${a}y = ${q}\nIf (x, y) is the solution to the system of equations above, what is the value of ${sum ? 'x + y' : 'x − y'}?`,
        answer: num(ans),
        wrong: sum ? [num(p + q), num(x - y), num(x)] : [num(p - q), num(x + y), num(y - x)],
        steps: sum
          ? [`Add the two equations: ${a + b}x + ${a + b}y = ${p + q}.`, `Factor: ${a + b}(x + y) = ${p + q}.`, `Divide by ${a + b}: x + y = ${num(ans)}.`]
          : [`Subtract the second equation from the first: ${a - b}x ${signed(b - a)}y = ${p - q}.`, `Factor: ${a - b}(x − y) = ${p - q}.`, `Divide by ${a - b}: x − y = ${num(ans)}.`],
        pitfalls: sum
          ? [`Stopping at ${p + q} and forgetting to divide by ${a + b}.`, 'Solving for x and y one at a time, when adding the equations gives x + y in one step.']
          : [`Stopping at ${p - q} and forgetting to divide by ${a - b}.`, `Subtracting in the wrong order, which gives y − x = ${y - x}.`],
      };
    },
  },
  {
    id: 'sat-vertex-form-read',
    exam: 'sat',
    topicId: 'sat-quadratics',
    difficulty: 1,
    build: (r) => {
      const a = r.nonZero(-3, 3);
      const h = r.nonZero(-7, 7);
      const k = r.nonZero(-9, 9);
      const coef = a === 1 ? '' : a === -1 ? '−' : String(a);
      const expr = `${coef}(x ${signed(-h)})² ${signed(k)}`;
      const word = a > 0 ? 'minimum' : 'maximum';
      const prompt = r.pick([
        `The function f is defined by f(x) = ${expr}. What are the coordinates of the vertex of the graph of y = f(x)?`,
        `The graph of y = ${expr} is a parabola in the xy-plane. What is the ${word} point of the graph?`,
      ]);
      return {
        prompt,
        answer: pt(h, k),
        wrong: [pt(-h, k), pt(h, -k), pt(-h, -k)],
        steps: [
          'Vertex form y = a(x − h)² + k has its vertex at (h, k).',
          h < 0 ? `Here (x ${signed(-h)}) = (x − ${paren(h)}), so h = ${h}, and k = ${k}.` : `Match (x − ${h}) with (x − h): h = ${h}, and k = ${k}.`,
          `The vertex is (${h}, ${k}). Since a = ${a} is ${a > 0 ? 'positive, it is the lowest' : 'negative, it is the highest'} point.`,
        ],
        pitfalls: [
          `Reading h as ${-h} from "x ${signed(-h)}". The x-coordinate of the vertex has the opposite sign of the number inside the brackets.`,
          `Changing the sign of k as well. The ${signed(k)} outside the brackets is used as it is.`,
        ],
      };
    },
  },
  {
    id: 'sat-quadratic-sum-product',
    exam: 'sat',
    topicId: 'sat-quadratics',
    difficulty: 2,
    build: (r) => {
      const a = r.int(2, 6);
      const b = r.nonZero(-12, 12);
      const c = -r.int(1, 15);
      const askSum = r.next() < 0.5;
      const sum = new Frac(-b, a);
      const prod = new Frac(c, a);
      return {
        prompt: `What is the ${askSum ? 'sum' : 'product'} of the solutions to ${poly([a, b, c])} = 0?`,
        answer: (askSum ? sum : prod).toString(),
        wrong: askSum ? [new Frac(b, a).toString(), prod.toString(), String(-b)] : [prod.neg().toString(), sum.toString(), String(c)],
        steps: [
          'For ax² + bx + c = 0, the sum of the solutions is −b/a and the product is c/a.',
          `Here a = ${a}, b = ${b} and c = ${c}.`,
          askSum ? `Sum = −(${b})/${a} = ${sum}.` : `Product = ${c}/${a}${prod.d === a ? '' : ` = ${prod}`}.`,
        ],
        pitfalls: askSum
          ? [`Dropping the minus sign in −b/a, which gives ${new Frac(b, a)}.`, `Using −b = ${-b} and forgetting to divide by a = ${a}.`]
          : [`Using c = ${c} without dividing by a = ${a}.`, `Adding a minus sign to c/a. Only the sum uses −b/a.`],
      };
    },
  },
  {
    id: 'sat-quadratic-one-solution',
    exam: 'sat',
    topicId: 'sat-quadratics',
    difficulty: 3,
    build: (r) => {
      const a = r.int(1, 3);
      const m = r.nonZero(-6, 6);
      const b = 2 * a * m;
      const k = a * m * m;
      const lhs = `${poly([a, b, 0])} + k`;
      const prompt = r.pick([
        `In the equation ${lhs} = 0, k is a constant. The equation has exactly one real solution. What is the value of k?`,
        `In the xy-plane, the graph of y = ${lhs}, where k is a constant, touches the x-axis at exactly one point. What is the value of k?`,
      ]);
      return {
        prompt,
        answer: num(k),
        wrong: [num(4 * a * m * m), num(a * a * m * m), num(-k), num(Math.abs(a * m))],
        steps: [
          'Exactly one real solution means the discriminant is zero: b² − 4ac = 0.',
          `Here ${paren(b)}² − 4·${a}·k = 0, so ${b * b} = ${4 * a}k.`,
          `k = ${b * b} ÷ ${4 * a} = ${k}.`,
        ],
        pitfalls: [`Dropping the 4 in b² − 4ac, which gives k = ${4 * a * m * m}.`, 'Setting the discriminant greater than zero, which is the condition for two real solutions.'],
      };
    },
  },
  {
    id: 'sat-percent-reverse',
    exam: 'sat',
    topicId: 'sat-percentages',
    difficulty: 3,
    build: (r) => {
      const p = r.pick([5, 10, 15, 20, 25, 30, 40]);
      const orig = r.int(3, 30) * 20;
      const up = r.next() < 0.35;
      const after = up ? (orig * (100 + p)) / 100 : (orig * (100 - p)) / 100;
      const item = r.pick(['backpack', 'lamp', 'pair of headphones', 'bicycle helmet', 'winter coat', 'desk chair']);
      const fUp = num((100 + p) / 100);
      const fDown = num((100 - p) / 100);
      return {
        prompt: up
          ? `After a ${p}% sales tax is added, a ${item} costs ${money(after)}. What was the price of the ${item} before tax?`
          : `A ${item} is on sale for ${p}% off the original price. The sale price is ${money(after)}. What was the original price?`,
        answer: money(orig),
        wrong: up
          ? [money((after * (100 - p)) / 100), money(after - p), money((after * (100 + p)) / 100)]
          : [money((after * (100 + p)) / 100), money(after + p), money((after * (100 - p)) / 100)],
        steps: up
          ? [`Adding ${p}% tax means you pay ${100 + p}% of the price, so ${fUp} × price = ${num(after)}.`, `Price = ${num(after)} ÷ ${fUp} = ${num(orig)}.`]
          : [`A ${p}% discount leaves ${100 - p}% of the price, so ${fDown} × original = ${num(after)}.`, `Original = ${num(after)} ÷ ${fDown} = ${num(orig)}.`],
        pitfalls: up
          ? [`Taking ${p}% off ${money(after)}, which gives ${money((after * (100 - p)) / 100)}. The tax was ${p}% of the lower price, not of ${money(after)}.`]
          : [`Adding ${p}% of ${money(after)} back on, which gives ${money((after * (100 + p)) / 100)}. The ${p}% was taken from the original price, not the sale price.`],
      };
    },
  },
  {
    id: 'sat-percent-change-between',
    exam: 'sat',
    topicId: 'sat-percentages',
    difficulty: 2,
    build: (r) => {
      const a = r.pick([20, 40, 50, 80, 120, 150, 200, 250, 400, 500, 600, 800]);
      const up = r.next() < 0.5;
      const options = up ? [10, 20, 25, 30, 40, 50, 60, 75, 80, 150] : [10, 20, 25, 30, 40, 50, 60, 75, 80];
      let pct = r.pick(options);
      for (let i = 0; i < 10 && (a * pct) % 100 !== 0; i++) pct = r.pick(options);
      if ((a * pct) % 100 !== 0) pct = 50;
      const diff = (a * pct) / 100;
      const b = up ? a + diff : a - diff;
      const thing = r.pick(['members of a running club', 'daily visitors to a museum', 'trees in a city park', 'subscribers to a newsletter', 'books in a school library']);
      return {
        prompt: `The number of ${thing} changed from ${a} to ${b}. What was the percent ${up ? 'increase' : 'decrease'}?`,
        answer: `${pct}%`,
        wrong: [`${num((diff / b) * 100)}%`, `${num((b / a) * 100)}%`, `${num(diff)}%`],
        steps: [`The ${up ? 'increase' : 'decrease'} is ${Math.max(a, b)} − ${Math.min(a, b)} = ${diff}.`, `Divide by the original value: ${diff} ÷ ${a} = ${num(pct / 100)}.`, `${num(pct / 100)} × 100 = ${pct}%.`],
        pitfalls: [`Dividing by the new value ${b} instead of the original ${a}, which gives ${num((diff / b) * 100)}%.`, `Reporting ${b} ÷ ${a} = ${num(b / a)} as ${num((b / a) * 100)}%. That ratio is the multiplier, not the change.`],
      };
    },
  },
  {
    id: 'sat-percent-of-percent',
    exam: 'sat',
    topicId: 'sat-percentages',
    difficulty: 2,
    build: (r) => {
      const n = r.pick([200, 400, 500, 600, 800, 1000, 1200]);
      const opts = [10, 20, 25, 30, 40, 50, 60, 75, 80];
      let a = r.pick(opts);
      let b = r.pick(opts);
      for (let i = 0; i < 20 && (n * a * b) % 10000 !== 0; i++) {
        a = r.pick(opts);
        b = r.pick(opts);
      }
      if ((n * a * b) % 10000 !== 0) {
        a = 50;
        b = 20;
      }
      const first = (n * a) / 100;
      const ans = (first * b) / 100;
      const ctx = r.pick([
        { text: `A school has ${n} students. ${a}% of the students play a sport, and ${b}% of the students who play a sport are on the swim team. How many students are on the swim team?`, group: 'students who play a sport' },
        { text: `A survey received ${n} responses. ${a}% of the responses came from adults, and ${b}% of the adult responses rated the park as excellent. How many adult responses rated the park as excellent?`, group: 'adult responses' },
        { text: `A farm planted ${n} trees. ${a}% of the trees are fruit trees, and ${b}% of the fruit trees are apple trees. How many apple trees did the farm plant?`, group: 'fruit trees' },
      ]);
      return {
        prompt: ctx.text,
        answer: num(ans),
        wrong: [num(first), num((n * b) / 100), num((n * (a + b)) / 100)],
        steps: [`${a}% of ${n} is ${num(first)} ${ctx.group}.`, `${b}% of ${num(first)} is ${num(first)} × ${num(b / 100)} = ${num(ans)}.`],
        pitfalls: [`Taking ${b}% of all ${n} instead of ${b}% of the ${num(first)} ${ctx.group}.`, `Stopping after the first step at ${num(first)}.`],
      };
    },
  },
  {
    id: 'sat-exp-rate-from-model',
    exam: 'sat',
    topicId: 'sat-exponentials',
    difficulty: 1,
    build: (r) => {
      const rate = r.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25]);
      const grow = r.next() < 0.55;
      const p = r.int(2, 40) * 50;
      const factor = grow ? (100 + rate) / 100 : (100 - rate) / 100;
      const [ctx, unit] = grow
        ? r.pick([
            ['the population of a town', 'year'],
            ['the number of members of an online forum', 'month'],
            ['the value of a rare coin', 'year'],
          ])
        : r.pick([
            ['the value of a used car', 'year'],
            ['the number of fish in a lake', 'year'],
            ['the amount of a medicine in the bloodstream, in milligrams', 'hour'],
          ]);
      const fs = num(factor);
      return {
        prompt: `The function f(t) = ${p}(${fs})ᵗ models ${ctx}, where t is the number of ${unit}s since the start. By what percent does the amount ${grow ? 'increase' : 'decrease'} each ${unit}?`,
        answer: `${rate}%`,
        wrong: grow ? [`${num(factor * 100)}%`, `${num(rate / 100)}%`, `${100 - rate}%`] : [`${num(factor * 100)}%`, `${num(rate / 100)}%`, `${100 + rate}%`],
        steps: [
          `In f(t) = a·bᵗ, the base b is the ${grow ? 'growth' : 'decay'} factor. Here b = ${fs}.`,
          grow ? `b = 1 + r, so r = ${fs} − 1 = ${num(rate / 100)}.` : `b = 1 − r, so r = 1 − ${fs} = ${num(rate / 100)}.`,
          `${num(rate / 100)} as a percent is ${rate}%.`,
        ],
        pitfalls: grow
          ? [`Reading the base ${fs} as ${num(factor * 100)}%. The base includes the original 100%, so the increase is only ${rate}%.`]
          : [`Answering ${100 - rate}%, which is the share that remains each ${unit}, not the share that is lost.`],
      };
    },
  },
  {
    id: 'sat-half-life',
    exam: 'sat',
    topicId: 'sat-exponentials',
    difficulty: 2,
    build: (r) => {
      const h = r.pick([2, 3, 4, 5, 6, 8, 10, 12]);
      const n = r.int(3, 5);
      const left = r.int(3, 30);
      const start = left * Math.pow(2, n);
      const t = h * n;
      const [what, unit] = r.pick([
        ['a radioactive isotope in a sample', 'grams'],
        ["a medicine in a patient's bloodstream", 'milligrams'],
        ['a tracer chemical in a water tank', 'grams'],
      ]);
      return {
        prompt: `There are ${start} ${unit} of ${what}. The half-life of the substance is ${h} hours. How many ${unit} remain after ${t} hours?`,
        answer: num(left),
        wrong: [num(start / (2 * n)), num(start / Math.pow(2, n - 1)), num(start / Math.pow(2, n + 1)), num(start / 2)],
        steps: [`Number of half-lives: ${t} ÷ ${h} = ${n}.`, `Remaining = ${start} × (1/2)${sup(n)} = ${start} ÷ ${Math.pow(2, n)} = ${left}.`],
        pitfalls: [`Dividing ${start} by 2 × ${n} = ${2 * n} instead of by 2${sup(n)} = ${Math.pow(2, n)}.`, `Using ${t} hours as the number of halvings instead of ${t} ÷ ${h} = ${n}.`],
      };
    },
  },
  {
    id: 'sat-compound-interest',
    exam: 'sat',
    topicId: 'sat-exponentials',
    difficulty: 2,
    build: (r) => {
      const p = r.pick([500, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000]);
      const rate = r.pick([2, 3, 4, 5, 6, 8, 10]);
      const t = r.int(2, 4);
      const name = r.pick(['Maya', 'Jonah', 'Priya', 'Luis', 'Amara', 'Kenji']);
      const cents = compoundCents(p, rate, t);
      const g = num((100 + rate) / 100);
      const simple = p * (1 + (rate * t) / 100);
      return {
        prompt: `${name} deposits ${money(p)} into an account that earns ${rate}% interest compounded annually. No other deposits or withdrawals are made. To the nearest cent, what is the balance after ${t} years?`,
        answer: money(cents / 100),
        wrong: [money(simple), money(compoundCents(p, rate, t - 1) / 100), money(cents / 100 - p)],
        steps: [`Each year the balance is multiplied by 1 + ${num(rate / 100)} = ${g}.`, `Balance = ${p} × ${g}${sup(t)}.`, `${p} × ${g}${sup(t)} = ${money(cents / 100)} to the nearest cent.`],
        pitfalls: [`Using simple interest, ${p} × ${num(rate / 100)} × ${t} added once, which gives ${money(simple)}.`, `Giving only the interest earned, ${money(cents / 100 - p)}, instead of the full balance.`],
      };
    },
  },
  {
    id: 'sat-doubling-time',
    exam: 'sat',
    topicId: 'sat-exponentials',
    difficulty: 3,
    build: (r) => {
      const start = r.int(2, 15) * 100;
      const k = r.pick([2, 3, 4, 5, 6, 8]);
      const n = r.int(3, 6);
      const ratio = Math.pow(2, n);
      const target = start * ratio;
      const [ctx, unit] = r.pick([
        ['A colony of bacteria has', 'hours'],
        ['A new app has', 'months'],
        ['An island has a rabbit population of', 'years'],
      ]);
      const what = ctx.endsWith('of') ? '' : ctx.includes('app') ? ' users' : ' cells';
      return {
        prompt: `${ctx} ${start}${what}, and this number doubles every ${k} ${unit}. After how many ${unit} will the number first reach ${target}?`,
        answer: String(n * k),
        wrong: [String(n), String(k * (ratio / 2)), String(k * (n + 1))],
        steps: [`Find the number of doublings: ${target} ÷ ${start} = ${ratio} = 2${sup(n)}, so ${n} doublings.`, `Each doubling takes ${k} ${unit}, so the time is ${n} × ${k} = ${n * k} ${unit}.`],
        pitfalls: [`Stopping at ${n} doublings and forgetting to multiply by ${k} ${unit}.`, `Treating the ratio ${ratio} as the number of doublings instead of solving 2ⁿ = ${ratio}.`],
      };
    },
  },
  {
    id: 'sat-circle-measure',
    exam: 'sat',
    topicId: 'sat-circles',
    difficulty: 1,
    build: (r) => {
      const d = r.int(2, 12) * 2;
      const rad = d / 2;
      const askArea = r.next() < 0.5;
      const thing = r.pick(['A circular rug', 'A round table top', 'A circular garden', 'A circular window', 'A round pool cover']);
      return {
        prompt: `${thing} has a diameter of ${d} feet. What is its ${askArea ? 'area, in square feet' : 'circumference, in feet'}?`,
        answer: piStr(new Frac(askArea ? rad * rad : d)),
        wrong: askArea ? [d * d, d, 2 * rad * rad].map((v) => piStr(new Frac(v))) : [rad, rad * rad, 2 * d].map((v) => piStr(new Frac(v))),
        steps: askArea
          ? [`The radius is half the diameter: ${d} ÷ 2 = ${rad}.`, `Area = πr² = π × ${rad}² = ${rad * rad}π.`]
          : ['Circumference = πd, which is the same as 2πr.', `Circumference = π × ${d} = ${d}π.`],
        pitfalls: askArea
          ? [`Using the diameter ${d} as the radius, which gives ${d * d}π.`, `Using the circumference formula and getting ${d}π.`]
          : [`Using πr with r = ${rad}, which gives ${rad}π, only half the circumference.`, `Using the area formula and getting ${rad * rad}π.`],
      };
    },
  },
  {
    id: 'sat-arc-central-angle',
    exam: 'sat',
    topicId: 'sat-circles',
    difficulty: 2,
    build: (r) => {
      const rad = r.int(2, 12);
      const ang = r.pick([20, 30, 40, 45, 60, 72, 80, 90, 100, 120, 135, 150, 160, 200, 225, 240, 270, 300]);
      const len = new Frac(ang * rad, 180);
      const share = new Frac(ang, 360);
      return {
        prompt: `A circle has radius ${rad}. An arc of the circle has length ${piStr(len)}. What is the measure, in degrees, of the central angle that intercepts this arc?`,
        answer: `${ang}°`,
        wrong: [`${2 * ang}°`, `${num(ang / 2)}°`, `${360 - ang}°`],
        steps: [`Arc length = (angle ÷ 360°) × 2πr, and 2πr = ${2 * rad}π.`, `So angle ÷ 360° = ${piStr(len)} ÷ ${2 * rad}π = ${share}.`, `Angle = ${share} × 360° = ${ang}°.`],
        pitfalls: [`Using πr = ${rad}π instead of 2πr = ${2 * rad}π, which doubles the angle to ${2 * ang}°.`, `Giving ${360 - ang}°, the angle for the rest of the circle.`],
      };
    },
  },
  {
    id: 'sat-circle-point-check',
    exam: 'sat',
    topicId: 'sat-circles',
    difficulty: 2,
    build: (r) => {
      const h = r.nonZero(-6, 6);
      const k = r.nonZero(-6, 6);
      const [p, q, rad] = r.pick([
        [3, 4, 5],
        [6, 8, 10],
        [5, 12, 13],
      ]);
      const sx = r.pick([1, -1]);
      const sy = r.pick([1, -1]);
      const [dx, dy] = r.next() < 0.5 ? [q, p] : [p, q];
      const on: [number, number] = [h + sx * dx, k + sy * dy];
      const cands: [number, number][] = [
        [-h + sx * dx, -k + sy * dy],
        [h + sx * rad, k + sy * rad],
        [h + sx * dx, k + sy * rad],
        [h + sx * (dx + dy), k],
      ];
      const wrong = cands.filter(([x, y]) => (x - h) * (x - h) + (y - k) * (y - k) !== rad * rad).map(([x, y]) => pt(x, y));
      return {
        prompt: `A circle in the xy-plane has equation (x ${signed(-h)})² + (y ${signed(-k)})² = ${rad * rad}. Which of the following points lies on the circle?`,
        answer: pt(on[0], on[1]),
        wrong,
        steps: [
          `The circle has center (${h}, ${k}) and radius √${rad * rad} = ${rad}.`,
          `For ${pt(on[0], on[1])}: x − ${paren(h)} = ${sx * dx} and y − ${paren(k)} = ${sy * dy}.`,
          `${paren(sx * dx)}² + ${paren(sy * dy)}² = ${dx * dx} + ${dy * dy} = ${rad * rad}, which matches the right side.`,
        ],
        pitfalls: [`Reading the center as (${-h}, ${-k}) from the signs inside the brackets.`, `Treating ${rad * rad} as the radius instead of √${rad * rad} = ${rad}.`],
      };
    },
  },
  {
    id: 'sat-special-right-triangles',
    exam: 'sat',
    topicId: 'sat-geometry',
    difficulty: 3,
    build: (r) => {
      const s = r.int(2, 12);
      const iso = 'In a right triangle with two 45° angles';
      const tri = 'A right triangle has angles of 30°, 60° and 90°.';
      const short = 'the side opposite the 30° angle';
      const long = 'the side opposite the 60° angle';
      const cases = [
        {
          prompt: `${iso}, each leg has length ${s}. What is the length of the hypotenuse?`,
          answer: surd(s, 2),
          wrong: [String(2 * s), surd(s, 3), String(s)],
          steps: ['In a 45°, 45°, 90° triangle, the hypotenuse is a leg times √2.', `Hypotenuse = ${s} × √2 = ${surd(s, 2)}.`],
          pitfall: `Doubling the leg to ${2 * s}. In this triangle the hypotenuse is the leg times √2.`,
        },
        {
          prompt: `${iso}, the hypotenuse has length ${surd(s, 2)}. What is the length of each leg?`,
          answer: String(s),
          wrong: [String(2 * s), surd(s, 2), surd(s, 3)],
          steps: ['In a 45°, 45°, 90° triangle, a leg is the hypotenuse divided by √2.', `Leg = ${surd(s, 2)} ÷ √2 = ${s}.`],
          pitfall: `Multiplying by √2 again instead of dividing, which gives ${2 * s}.`,
        },
        {
          prompt: `${iso}, the hypotenuse has length ${2 * s}. What is the length of each leg?`,
          answer: surd(s, 2),
          wrong: [String(s), surd(2 * s, 2), surd(s, 3)],
          steps: ['In a 45°, 45°, 90° triangle, a leg is the hypotenuse divided by √2.', `Leg = ${2 * s}/√2 = ${2 * s}√2/2 = ${surd(s, 2)}.`],
          pitfall: `Halving the hypotenuse to ${s}. You divide by √2, not by 2.`,
        },
        {
          prompt: `${tri} The side opposite the 30° angle has length ${s}. What is the length of the hypotenuse?`,
          answer: String(2 * s),
          wrong: [surd(s, 3), surd(s, 2), String(3 * s)],
          steps: ['In a 30°, 60°, 90° triangle, the sides are in the ratio 1 : √3 : 2.', `The hypotenuse is twice the shortest side: 2 × ${s} = ${2 * s}.`],
          pitfall: `Multiplying by √3, which gives ${surd(s, 3)}, the side opposite 60°, not the hypotenuse.`,
        },
        {
          prompt: `${tri} The side opposite the 30° angle has length ${s}. What is the length of ${long}?`,
          answer: surd(s, 3),
          wrong: [String(2 * s), surd(s, 2), String(3 * s)],
          steps: ['In a 30°, 60°, 90° triangle, the sides are in the ratio 1 : √3 : 2.', `The side opposite 60° is ${s} × √3 = ${surd(s, 3)}.`],
          pitfall: `Doubling the short side to ${2 * s}, which is the hypotenuse, not the side opposite 60°.`,
        },
        {
          prompt: `${tri} The hypotenuse has length ${2 * s}. What is the length of ${short}?`,
          answer: String(s),
          wrong: [surd(s, 3), surd(s, 2), String(4 * s)],
          steps: ['In a 30°, 60°, 90° triangle, the side opposite 30° is half the hypotenuse.', `${2 * s} ÷ 2 = ${s}.`],
          pitfall: `Mixing up the legs. ${surd(s, 3)} is the side opposite 60°, not 30°.`,
        },
        {
          prompt: `${tri} The hypotenuse has length ${2 * s}. What is the length of ${long}?`,
          answer: surd(s, 3),
          wrong: [String(s), surd(2 * s, 3), surd(s, 2)],
          steps: [`The side opposite 30° is half the hypotenuse: ${2 * s} ÷ 2 = ${s}.`, `The side opposite 60° is that times √3: ${surd(s, 3)}.`],
          pitfall: `Stopping at the short side ${s}. The side opposite 60° is ${s} × √3.`,
        },
        {
          prompt: `${tri} The side opposite the 60° angle has length ${surd(s, 3)}. What is the length of ${short}?`,
          answer: String(s),
          wrong: [String(3 * s), String(2 * s), surd(s, 2)],
          steps: ['In a 30°, 60°, 90° triangle, the side opposite 60° is √3 times the side opposite 30°.', `Short side = ${surd(s, 3)} ÷ √3 = ${s}.`],
          pitfall: `Multiplying by √3 instead of dividing, which gives ${3 * s}.`,
        },
      ];
      const c = r.pick(cases);
      return {
        prompt: c.prompt,
        answer: c.answer,
        wrong: c.wrong,
        steps: c.steps,
        pitfalls: [c.pitfall],
      };
    },
  },
  {
    id: 'sat-distance-points',
    exam: 'sat',
    topicId: 'sat-geometry',
    difficulty: 2,
    build: (r) => {
      const [a, b, c] = r.pick([
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
        [6, 8, 10],
        [9, 12, 15],
      ]);
      const x1 = r.int(-8, 8);
      const y1 = r.int(-8, 8);
      const [ex, ey] = r.next() < 0.5 ? [a, b] : [b, a];
      const dx = r.pick([1, -1]) * ex;
      const dy = r.pick([1, -1]) * ey;
      const x2 = x1 + dx;
      const y2 = y1 + dy;
      const slip = (x2 + x1) * (x2 + x1) + (y2 + y1) * (y2 + y1);
      return {
        prompt: `In the xy-plane, what is the distance between the points (${x1}, ${y1}) and (${x2}, ${y2})?`,
        answer: String(c),
        wrong: [String(a + b), String(c * c), rootStr(slip)],
        steps: [
          `Horizontal change: ${x2} − ${paren(x1)} = ${dx}. Vertical change: ${y2} − ${paren(y1)} = ${dy}.`,
          `Distance = √(${paren(dx)}² + ${paren(dy)}²) = √(${dx * dx} + ${dy * dy}) = √${c * c}.`,
          `√${c * c} = ${c}.`,
        ],
        pitfalls: [`Adding the changes ${ex} + ${ey} = ${a + b} instead of using the Pythagorean theorem.`, `Stopping at ${c * c}, which is the distance squared.`],
      };
    },
  },
  {
    id: 'sat-triangle-angle-sum',
    exam: 'sat',
    topicId: 'sat-geometry',
    difficulty: 1,
    build: (r) => {
      const mode = r.pick(['two', 'isosceles', 'exterior'] as const);
      if (mode === 'two') {
        const a = r.int(25, 85);
        const b = r.int(25, 85);
        const c = 180 - a - b;
        return {
          prompt: `In triangle ABC, the measure of angle A is ${a}° and the measure of angle B is ${b}°. What is the measure of angle C?`,
          answer: `${c}°`,
          wrong: [`${360 - a - b}°`, `${a + b}°`, `${180 - a}°`],
          steps: ['The angles of a triangle add up to 180°.', `C = 180° − ${a}° − ${b}° = ${c}°.`],
          pitfalls: [`Subtracting from 360° instead of 180°, which gives ${360 - a - b}°.`],
        };
      }
      if (mode === 'isosceles') {
        const v = r.int(10, 80) * 2;
        const base = (180 - v) / 2;
        return {
          prompt: `In triangle PQR, PQ = PR and the measure of angle P is ${v}°. What is the measure of angle Q?`,
          answer: `${base}°`,
          wrong: [`${180 - v}°`, `${v}°`, `${Math.abs(180 - 2 * v)}°`],
          steps: ['Since PQ = PR, the angles opposite those sides, Q and R, are equal.', `Q + R = 180° − ${v}° = ${180 - v}°.`, `Q = ${180 - v}° ÷ 2 = ${base}°.`],
          pitfalls: [`Forgetting to split ${180 - v}° between the two equal angles Q and R.`, `Treating ${v}° as one of the equal angles. The equal sides PQ and PR meet at P, so Q and R are the equal angles.`],
        };
      }
      const a = r.int(30, 70);
      const b = r.int(30, 80);
      const e = a + b;
      return {
        prompt: `In triangle ABC, the measure of angle A is ${a}°. The exterior angle at vertex C measures ${e}°. What is the measure of angle B?`,
        answer: `${b}°`,
        wrong: [`${180 - e}°`, `${180 - a}°`, `${e}°`],
        steps: ['An exterior angle equals the sum of the two interior angles that are not next to it.', `${e}° = ${a}° + B, so B = ${e}° − ${a}° = ${b}°.`],
        pitfalls: [`Finding the interior angle at C, 180° − ${e}° = ${180 - e}°, instead of angle B.`],
      };
    },
  },
  {
    id: 'sat-similar-triangles',
    exam: 'sat',
    topicId: 'sat-geometry',
    difficulty: 2,
    build: (r) => {
      const [q, p] = r.pick([
        [2, 3],
        [3, 4],
        [2, 5],
        [3, 5],
        [4, 5],
        [3, 2],
        [5, 2],
        [4, 3],
      ]);
      const m = r.int(1, 4);
      const n = r.int(2, 6);
      const ab = q * m;
      const de = p * m;
      const bc = q * n;
      const ef = p * n;
      const askEf = r.next() < 0.5;
      const head = 'Triangle ABC is similar to triangle DEF, with vertices A, B and C corresponding to D, E and F.';
      return askEf
        ? {
            prompt: `${head} If AB = ${ab}, DE = ${de} and BC = ${bc}, what is EF?`,
            answer: num(ef),
            wrong: [num(bc + de - ab), num((bc * ab) / de), num(de)],
            steps: [`Corresponding sides share one ratio: EF/BC = DE/AB = ${de}/${ab}${new Frac(de, ab).d === ab ? '' : ` = ${new Frac(de, ab)}`}.`, `EF = ${bc} × ${new Frac(de, ab)} = ${num(ef)}.`],
            pitfalls: [`Adding the difference ${de} − ${ab} = ${de - ab} to BC instead of multiplying by the scale factor.`, `Flipping the ratio to ${new Frac(ab, de)}, which gives ${num((bc * ab) / de)}.`],
          }
        : {
            prompt: `${head} If AB = ${ab}, DE = ${de} and EF = ${ef}, what is BC?`,
            answer: num(bc),
            wrong: [num(ef + ab - de), num((ef * de) / ab), num(ab)],
            steps: [`Corresponding sides share one ratio: BC/EF = AB/DE = ${ab}/${de}${new Frac(ab, de).d === de ? '' : ` = ${new Frac(ab, de)}`}.`, `BC = ${ef} × ${new Frac(ab, de)} = ${num(bc)}.`],
            pitfalls: [`Adding the difference ${ab} − ${de} = ${ab - de} to EF instead of multiplying by the scale factor.`, `Flipping the ratio to ${new Frac(de, ab)}, which gives ${num((ef * de) / ab)}.`],
          };
    },
  },
  {
    id: 'sat-mean-shift-scale',
    exam: 'sat',
    topicId: 'sat-statistics',
    difficulty: 1,
    build: (r) => {
      const n = r.int(5, 12);
      const m = r.int(12, 60);
      const k = r.int(2, 9);
      const add = r.next() < 0.5;
      return {
        prompt: add
          ? `A data set of ${n} numbers has a mean of ${m}. If ${k} is added to every number in the data set, what is the mean of the new data set?`
          : `A data set of ${n} numbers has a mean of ${m}. If every number in the data set is multiplied by ${k}, what is the mean of the new data set?`,
        answer: num(add ? m + k : m * k),
        wrong: add ? [num(m), num(m + k * n), num(m + k / n)] : [num(m), num(m + k), num(m * k * n)],
        steps: add
          ? [`The total starts at ${n} × ${m} = ${m * n}. Adding ${k} to each of the ${n} numbers adds ${k * n}.`, `The new total is ${m * n + k * n}.`, `New mean = ${m * n + k * n} ÷ ${n} = ${m + k}.`]
          : [`The total starts at ${n} × ${m} = ${m * n}. Multiplying every number by ${k} multiplies the total by ${k}: ${m * n * k}.`, `New mean = ${m * n * k} ÷ ${n} = ${m * k}.`],
        pitfalls: add
          ? [`Adding ${k} to the total only once, which moves the mean by just ${num(k / n)}.`, `Thinking the mean stays at ${m} because the spread does not change.`]
          : [`Adding ${k} instead of multiplying, which gives ${m + k}.`],
      };
    },
  },
  {
    id: 'sat-mean-remove-value',
    exam: 'sat',
    topicId: 'sat-statistics',
    difficulty: 2,
    build: (r) => {
      const n = r.int(5, 10);
      const m = r.int(30, 90);
      let d = r.nonZero(-5, 5);
      let v = m - (n - 1) * d;
      if (v <= 0) {
        d = -d;
        v = m - (n - 1) * d;
      }
      if (v > 100) {
        d = Math.abs(d);
        v = m - (n - 1) * d;
      }
      const m2 = m + d;
      const [things, label, unit] = r.pick([
        ['test scores', 'score', ''],
        ['daily high temperatures', 'temperature', '°F'],
        ['package weights', 'weight', ' pounds'],
      ]);
      const tot = n * m;
      return {
        prompt: `The mean of ${n} ${things} is ${m}${unit}. When one ${label} of ${v}${unit} is removed, what is the mean of the remaining ${n - 1} ${things}?`,
        answer: num(m2),
        wrong: [num((tot - v) / n), num(m), num((tot + v) / (n - 1))],
        steps: [`Total of all ${n} values: ${n} × ${m} = ${tot}.`, `Remove ${v}: ${tot} − ${v} = ${tot - v}.`, `New mean = ${tot - v} ÷ ${n - 1} = ${m2}.`],
        pitfalls: [`Dividing by ${n} instead of ${n - 1} after the value is removed, which gives ${num((tot - v) / n)}.`, `Subtracting ${v} from the mean ${m} instead of from the total ${tot}.`],
      };
    },
  },
  {
    id: 'sat-consecutive-integers-mean',
    exam: 'sat',
    topicId: 'sat-statistics',
    difficulty: 2,
    build: (r) => {
      const n = r.pick([3, 5, 7, 9]);
      const kind = r.pick(['', 'even ', 'odd '] as const);
      const step = kind === '' ? 1 : 2;
      let mid = r.int(8, 70);
      if (kind === 'even ' && mid % 2 !== 0) mid += 1;
      if (kind === 'odd ' && mid % 2 === 0) mid += 1;
      const half = (n - 1) / 2;
      const large = r.next() < 0.5;
      const ans = large ? mid + half * step : mid - half * step;
      const total = n * mid;
      return {
        prompt: `The sum of ${n} consecutive ${kind}integers is ${total}. What is the ${large ? 'largest' : 'smallest'} of these integers?`,
        answer: num(ans),
        wrong: [num(mid), num(large ? mid - half * step : mid + half * step), num(large ? mid + (n - 1) * step : mid - (n - 1) * step), num(large ? mid + half : mid - half)],
        steps: [
          `The mean of evenly spaced numbers is the middle number: ${total} ÷ ${n} = ${mid}.`,
          `With ${n} numbers, the ${large ? 'largest' : 'smallest'} is ${half} step${half === 1 ? '' : 's'} of ${step} from the middle.`,
          `${large ? 'Largest' : 'Smallest'} = ${mid} ${large ? '+' : '−'} ${half} × ${step} = ${num(ans)}.`,
        ],
        pitfalls:
          step === 2
            ? [`Giving the middle number ${mid} instead of the ${large ? 'largest' : 'smallest'}.`, `Counting by 1 instead of 2 for consecutive ${kind.trim()} integers, which gives ${num(large ? mid + half : mid - half)}.`]
            : [`Giving the middle number ${mid} instead of the ${large ? 'largest' : 'smallest'}.`, `Moving ${n - 1} steps from the middle instead of ${half}.`],
      };
    },
  },
  {
    id: 'sat-weighted-mean',
    exam: 'sat',
    topicId: 'sat-statistics',
    difficulty: 3,
    build: (r) => {
      const sizes = [10, 15, 20, 25, 30];
      const n1 = r.pick(sizes);
      let n2 = r.pick(sizes);
      if (n2 === n1) n2 = n1 === 30 ? 10 : n1 + 5;
      const g = gcd(n1, n2);
      const t = r.nonZero(-3, 3);
      const mean = r.int(60, 80);
      const a = mean + (t * n2) / g;
      const b = mean - (t * n1) / g;
      const [g1, g2, who, what] = r.pick([
        ['Class A', 'Class B', 'students', 'test score'],
        ['Lab A', 'Lab B', 'plants', 'height, in centimeters,'],
        ['Section 1', 'Section 2', 'students', 'quiz score'],
      ]);
      const tot = n1 * a + n2 * b;
      return {
        prompt: `${g1} has ${n1} ${who} with a mean ${what} of ${a}. ${g2} has ${n2} ${who} with a mean ${what} of ${b}. What is the mean ${what} of all ${n1 + n2} ${who} combined?`,
        answer: num(mean),
        wrong: [num((a + b) / 2), num((n2 * a + n1 * b) / (n1 + n2))],
        steps: [`Total for ${g1}: ${n1} × ${a} = ${n1 * a}. Total for ${g2}: ${n2} × ${b} = ${n2 * b}.`, `Combined total: ${n1 * a} + ${n2 * b} = ${tot}.`, `Mean = ${tot} ÷ ${n1 + n2} = ${mean}.`],
        pitfalls: [`Averaging ${a} and ${b} to get ${num((a + b) / 2)}, which ignores that the groups have ${n1} and ${n2} members.`, 'Swapping the group sizes, so each mean is weighted by the other group.'],
      };
    },
  },
];
