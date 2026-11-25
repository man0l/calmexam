import { Frac, num, paren, poly, signed, sup, Template } from '../core';

function sub(n: number): string {
  const map = '₀₁₂₃₄₅₆₇₈₉';
  return String(n)
    .split('')
    .map((c) => (c === '-' ? '₋' : map[Number(c)] ?? c))
    .join('');
}

function coefFn(v: number, fn: string, first: boolean): string {
  const sign = v < 0 ? (first ? '−' : ' − ') : first ? '' : ' + ';
  const mag = Math.abs(v) === 1 ? '' : String(Math.abs(v));
  return `${sign}${mag}${fn}`;
}

function factor(root: number): string {
  return root === 0 ? 'x' : `(x ${signed(-root)})`;
}

function factors(p: number, q: number): string {
  return q === 0 ? `x${factor(p)}` : `${factor(p)}${factor(q)}`;
}

function supPow(n: number): string {
  return n === 1 ? '' : sup(n);
}

export const CALC_EXTRA_TEMPLATES: Template[] = [
  {
    id: 'calc-lim-infinity-rational',
    exam: 'ap-calc-ab',
    topicId: 'calc-limits',
    difficulty: 1,
    build: (r) => {
      const a = r.nonZero(-6, 6);
      const d = r.nonZero(-5, 5);
      const b = r.int(-9, 9);
      const c = r.nonZero(-9, 9);
      const e = r.nonZero(-9, 9);
      const f = r.nonZero(-9, 9);
      const dir = r.pick(['∞', '−∞']);
      const lower = r.next() < 0.35;
      if (lower) {
        return {
          prompt: `What is lim (x → ${dir}) of (${poly([a, c])}) / (${poly([d, e, f])})?`,
          answer: '0',
          wrong: [new Frac(a, d).toString(), new Frac(c, f).toString(), 'The limit does not exist'],
          steps: [
            `The numerator has degree 1 and the denominator has degree 2.`,
            `Divide every term by x²: the numerator becomes ${a}/x ${signed(c)}/x², which tends to 0, while the denominator tends to ${d}.`,
            `So the limit is 0 ÷ ${paren(d)} = 0.`,
          ],
          pitfalls: [
            `Dividing the leading coefficients to get ${new Frac(a, d)} even though the top is degree 1 and the bottom is degree 2.`,
            `Saying the limit does not exist because x → ${dir}; a lower-degree numerator always gives 0.`,
          ],
        };
      }
      return {
        prompt: `What is lim (x → ${dir}) of (${poly([a, b, c])}) / (${poly([d, e, f])})?`,
        answer: new Frac(a, d).toString(),
        wrong: [new Frac(c, f).toString(), new Frac(b, e).toString(), '∞', 'The limit does not exist'],
        steps: [
          'The numerator and denominator are both degree 2.',
          `Divide every term by x²: (${a} ${signed(b)}/x ${signed(c)}/x²) / (${d} ${signed(e)}/x ${signed(f)}/x²).`,
          `As x → ${dir}, every term with x in the denominator tends to 0, leaving ${a}/${paren(d)} = ${new Frac(a, d)}.`,
        ],
        pitfalls: [
          `Dividing the constant terms ${c} and ${f} instead of the leading coefficients ${a} and ${d}.`,
          'Answering ∞ because both the top and the bottom grow without bound.',
        ],
      };
    },
  },
  {
    id: 'calc-lim-one-sided-piecewise',
    exam: 'ap-calc-ab',
    topicId: 'calc-limits',
    difficulty: 2,
    build: (r) => {
      const k = r.int(-3, 4);
      const a = r.nonZero(-4, 4);
      const b = r.int(-6, 6);
      const c = r.nonZero(-3, 3);
      let d = r.int(-8, 8);
      const left = a * k + b;
      if (c * k * k + d === left) d += r.pick([-2, 2]);
      const right = c * k * k + d;
      const mode = r.pick(['left', 'right', 'right', 'left', 'two']);
      const def = `Let f(x) = ${poly([a, b])} for x < ${k}, and f(x) = ${poly([c, 0, d])} for x ≥ ${k}.`;
      const evalL = `${a}·${paren(k)} ${signed(b)} = ${left}`;
      const evalR = `${c === 1 ? '' : c === -1 ? '−' : c + '·'}${paren(k)}² ${signed(d)} = ${right}`;
      if (mode === 'two') {
        return {
          prompt: `${def} What is lim (x → ${k}) f(x)?`,
          answer: 'The limit does not exist',
          wrong: [num(left), num(right), num((left + right) / 2)],
          steps: [
            `From the left, use ${poly([a, b])}: ${evalL}.`,
            `From the right, use ${poly([c, 0, d])}: ${evalR}.`,
            `The one-sided limits ${left} and ${right} are different, so the two-sided limit does not exist.`,
          ],
          pitfalls: [`Reporting f(${k}) = ${right} as the limit without checking the left-hand piece.`, `Averaging ${left} and ${right}; a limit needs both sides to agree.`],
        };
      }
      const isLeft = mode === 'left';
      const ans = isLeft ? left : right;
      const other = isLeft ? right : left;
      const slip = isLeft ? -a * k + b : -c * k * k + d;
      return {
        prompt: `${def} What is lim (x → ${k}${isLeft ? '⁻' : '⁺'}) f(x)?`,
        answer: num(ans),
        wrong: [num(other), 'The limit does not exist', num(slip), num(left + right)],
        steps: [
          `x → ${k}${isLeft ? '⁻' : '⁺'} means x approaches ${k} from the ${isLeft ? 'left (x < ' + k + ')' : 'right (x > ' + k + ')'}.`,
          `On that side f(x) = ${isLeft ? poly([a, b]) : poly([c, 0, d])}, which is continuous, so substitute x = ${k}.`,
          `${isLeft ? evalL : evalR}.`,
        ],
        pitfalls: [
          `Using the ${isLeft ? 'right' : 'left'}-hand piece, which gives ${other}.`,
          'Saying the limit does not exist because the two pieces disagree; a one-sided limit only looks at one piece.',
        ],
      };
    },
  },
  {
    id: 'calc-lim-sin-ratio',
    exam: 'ap-calc-ab',
    topicId: 'calc-limits',
    difficulty: 2,
    build: (r) => {
      const a = r.int(2, 9);
      let b = r.int(2, 9);
      while (b === a) b = r.int(2, 9);
      const form = r.pick(['sinx', 'sinsin', 'tan', 'inv']);
      const ratio = form === 'inv' ? new Frac(b, a) : new Frac(a, b);
      const flipped = form === 'inv' ? new Frac(a, b) : new Frac(b, a);
      const expr =
        form === 'sinx'
          ? `sin(${a}x) / (${b}x)`
          : form === 'sinsin'
            ? `sin(${a}x) / sin(${b}x)`
            : form === 'tan'
              ? `tan(${a}x) / (${b}x)`
              : `(${b}x) / sin(${a}x)`;
      const rewrite =
        form === 'sinx'
          ? `sin(${a}x) / (${b}x) = (${a}/${b}) · sin(${a}x) / (${a}x).`
          : form === 'sinsin'
            ? `sin(${a}x) / sin(${b}x) = (${a}/${b}) · [sin(${a}x) / (${a}x)] · [(${b}x) / sin(${b}x)].`
            : form === 'tan'
              ? `tan(${a}x) / (${b}x) = (${a}/${b}) · tan(${a}x) / (${a}x).`
              : `(${b}x) / sin(${a}x) = (${b}/${a}) · (${a}x) / sin(${a}x).`;
      return {
        prompt: `What is lim (x → 0) of ${expr}?`,
        answer: ratio.toString(),
        wrong: [flipped.toString(), '1', '0', 'The limit does not exist'],
        steps: [
          `Use lim (θ → 0) sin θ / θ = 1${form === 'tan' ? ', and likewise tan θ / θ → 1' : ''}.`,
          `Rewrite: ${rewrite}`,
          `Each bracketed ratio tends to 1, so the limit is ${ratio}.`,
        ],
        pitfalls: [
          `Inverting the ratio to get ${flipped}.`,
          `Answering 1 straight from sin θ / θ → 1 without matching the ${a}x inside the function.`,
        ],
      };
    },
  },
  {
    id: 'calc-lim-continuity-k',
    exam: 'ap-calc-ab',
    topicId: 'calc-limits',
    difficulty: 3,
    build: (r) => {
      const c = r.pick([-3, -2, 2, 3, 4]);
      const k = r.nonZero(-5, 5);
      const b = r.nonZero(-6, 6);
      if (r.next() < 0.5) {
        const m = k * c + b - c * c;
        const R = c * c + m;
        return {
          prompt: `The function f is defined by f(x) = kx ${signed(b)} for x < ${c} and f(x) = ${poly([1, 0, m])} for x ≥ ${c}, where k is a constant. For what value of k is f continuous at x = ${c}?`,
          answer: num(k),
          wrong: [num(-k), new Frac(R + b, c).toString(), num(R - b)],
          steps: [
            `Continuity at x = ${c} needs the left-hand limit to equal f(${c}).`,
            `Right piece: f(${c}) = ${paren(c)}² ${signed(m)} = ${R}. Left piece: k·${paren(c)} ${signed(b)}.`,
            `${c}k ${signed(b)} = ${R}, so ${c}k = ${R - b} and k = ${num(k)}.`,
          ],
          pitfalls: [`Moving ${b} to the other side without changing its sign, which gives ${new Frac(R + b, c)}.`, `Stopping at ${c}k = ${R - b} and forgetting to divide by ${c}.`],
        };
      }
      const p = r.nonZero(-5, 5);
      const q = k * c * c + b - p * c;
      const R = p * c + q;
      return {
        prompt: `The function f is defined by f(x) = kx² ${signed(b)} for x < ${c} and f(x) = ${poly([p, q])} for x ≥ ${c}, where k is a constant. For what value of k is f continuous at x = ${c}?`,
        answer: num(k),
        wrong: [num(-k), new Frac(R - b, c).toString(), new Frac(R + b, c * c).toString()],
        steps: [
          `Continuity at x = ${c} needs both pieces to give the same value there.`,
          `Right piece: ${p}·${paren(c)} ${signed(q)} = ${R}. Left piece: k·${paren(c)}² ${signed(b)} = ${c * c}k ${signed(b)}.`,
          `${c * c}k = ${R} ${signed(-b)} = ${R - b}, so k = ${num(k)}.`,
        ],
        pitfalls: [`Squaring x but then dividing by ${c} instead of ${c * c}.`, `Moving ${b} across without changing its sign.`],
      };
    },
  },
  {
    id: 'calc-deriv-quotient-point',
    exam: 'ap-calc-ab',
    topicId: 'calc-derivatives',
    difficulty: 3,
    build: (r) => {
      const b = r.nonZero(-6, 6);
      const c = r.nonZero(-3, 3);
      const k = r.int(-2, 3);
      let d = r.int(-5, 5);
      while (Math.abs(c * k + d) < 2) d++;
      const v = c * k + d;
      const u = k * k + b;
      const up = 2 * k;
      const top = up * v - u * c;
      const ans = new Frac(top, v * v);
      return {
        prompt: `If f(x) = (${poly([1, 0, b])}) / (${poly([c, d])}), what is f′(${k})?`,
        answer: ans.toString(),
        wrong: [new Frac(-top, v * v).toString(), new Frac(top, v).toString(), new Frac(up, c).toString(), new Frac(up * v + u * c, v * v).toString()],
        steps: [
          'Quotient rule: (u/v)′ = (u′v − uv′) / v².',
          `u = ${poly([1, 0, b])}, u′ = 2x; v = ${poly([c, d])}, v′ = ${c}.`,
          `At x = ${k}: u = ${u}, u′ = ${up}, v = ${v}.`,
          `f′(${k}) = (${up}·${paren(v)} − ${paren(u)}·${paren(c)}) / ${paren(v)}² = ${top}/${v * v}${ans.toString() === new Frac(top).toString() + '/' + (v * v) ? '' : ` = ${ans}`}.`,
        ],
        pitfalls: [`Writing uv′ − u′v on top, which flips the answer to ${new Frac(-top, v * v)}.`, `Forgetting to square the denominator ${v}.`],
      };
    },
  },
  {
    id: 'calc-deriv-exp-log-second',
    exam: 'ap-calc-ab',
    topicId: 'calc-derivatives',
    difficulty: 2,
    build: (r) => {
      const form = r.pick(['exp', 'ln', 'second', 'limit']);
      if (form === 'exp') {
        const a = r.nonZero(-4, 4);
        const b = r.nonZero(-6, 6);
        const ex = (cs: number[]) => `eˣ(${poly(cs)})`;
        return {
          prompt: `If f(x) = ${ex([a, b])}, which expression is f′(x)?`,
          answer: ex([a, a + b]),
          wrong: [ex([a, b]), coefFn(a, 'eˣ', true), ex([a, b - a])],
          steps: [
            'Product rule with u = eˣ and v = ' + poly([a, b]) + ': f′ = u′v + uv′.',
            `u′ = eˣ and v′ = ${a}, so f′(x) = eˣ(${poly([a, b])}) ${a < 0 ? '−' : '+'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}eˣ.`,
            `Factor out eˣ: f′(x) = ${ex([a, a + b])}.`,
          ],
          pitfalls: [`Treating eˣ as the whole derivative and leaving ${poly([a, b])} unchanged.`, `Multiplying the two derivatives to get ${coefFn(a, 'eˣ', true)}.`],
        };
      }
      if (form === 'ln') {
        const k = r.int(2, 9);
        let m = r.int(2, 9);
        while (m === k) m = r.int(2, 9);
        return {
          prompt: `If f(x) = ln(${k}x) for x > 0, what is f′(${m})?`,
          answer: new Frac(1, m).toString(),
          wrong: [new Frac(k, m).toString(), new Frac(1, k * m).toString(), new Frac(1, k).toString()],
          steps: [
            `Chain rule: d/dx ln(${k}x) = ${k} / (${k}x).`,
            `The ${k}s cancel, so f′(x) = 1/x. (Also ln(${k}x) = ln ${k} + ln x.)`,
            `f′(${m}) = 1/${m}.`,
          ],
          pitfalls: [`Multiplying by the inner derivative ${k} but not dividing by ${k}x, giving ${new Frac(k, m)}.`, `Writing 1/(${k}x) and getting 1/${k * m}.`],
        };
      }
      if (form === 'second') {
        const a = r.nonZero(-2, 2);
        const b = r.int(-4, 4);
        const c = r.nonZero(-5, 5);
        const k = r.nonZero(-2, 2);
        const f2 = 12 * a * k * k + 6 * b * k + 2 * c;
        const f1 = 4 * a * k * k * k + 3 * b * k * k + 2 * c * k;
        return {
          prompt: `If f(x) = ${poly([a, b, c, 0, 0])}, what is f″(${k})?`,
          answer: num(f2),
          wrong: [num(f1), num(f2 - 2 * c), num(12 * a * k + 6 * b + 2 * c), num(f2 / 2)],
          steps: [
            `f′(x) = ${poly([4 * a, 3 * b, 2 * c, 0])}.`,
            `f″(x) = ${poly([12 * a, 6 * b, 2 * c])}.`,
            `f″(${k}) = ${12 * a}·${paren(k)}² ${signed(6 * b)}·${paren(k)} ${signed(2 * c)} = ${num(f2)}.`,
          ],
          pitfalls: [`Stopping after one derivative: f′(${k}) = ${num(f1)}.`, `Dropping the ${2 * c} that comes from differentiating ${poly([2 * c, 0])}.`],
        };
      }
      const k = r.int(2, 6);
      const n = r.int(2, 4);
      const kn = Math.pow(k, n);
      const ans = n * Math.pow(k, n - 1);
      return {
        prompt: `What is lim (h → 0) of [(${k} + h)${sup(n)} − ${kn}] / h?`,
        answer: num(ans),
        wrong: [num(kn), num(n * k), '0', 'The limit does not exist', num((n + 1) * Math.pow(k, n))],
        steps: [
          `${kn} = ${k}${sup(n)}, so this is [f(${k} + h) − f(${k})] / h with f(x) = x${sup(n)}.`,
          `That limit is the definition of f′(${k}), and f′(x) = ${n}x${supPow(n - 1)}.`,
          `f′(${k}) = ${n}·${k}${supPow(n - 1)} = ${num(ans)}.`,
        ],
        pitfalls: ['Substituting h = 0 directly and reading 0/0 as 0 or as "does not exist".', `Answering f(${k}) = ${kn} instead of the slope f′(${k}).`],
      };
    },
  },
  {
    id: 'calc-app-linear-approx',
    exam: 'ap-calc-ab',
    topicId: 'calc-applications',
    difficulty: 1,
    build: (r) => {
      const fn = r.pick(['f', 'g', 'F']);
      const a = r.int(1, 9);
      const p = r.int(-10, 20);
      const m = r.nonZero(-6, 6);
      const hT = r.pick([1, 2, 3, -1, -2, -3]);
      const ans = (10 * p + m * hT) / 10;
      const x1 = (10 * a + hT) / 10;
      return {
        prompt: `A differentiable function ${fn} has ${fn}(${a}) = ${p} and ${fn}′(${a}) = ${m}. Use the tangent line at x = ${a} to approximate ${fn}(${num(x1)}).`,
        answer: num(ans),
        wrong: [num((10 * p - m * hT) / 10), num(p + m), num((m * hT) / 10), num(p + m * x1)],
        steps: [
          `Tangent line: y = ${fn}(${a}) + ${fn}′(${a})(x − ${a}) = ${p} ${signed(m)}(x − ${a}).`,
          `At x = ${num(x1)}, x − ${a} = ${num(hT / 10)}.`,
          `${fn}(${num(x1)}) ≈ ${p} + ${paren(m)}·${paren(hT / 10)} = ${num(ans)}.`,
        ],
        pitfalls: [`Adding the full slope ${m} as if the step were 1 instead of ${num(hT / 10)}.`, `Multiplying ${m} by ${num(x1)} instead of by the change ${num(hT / 10)}.`],
      };
    },
  },
  {
    id: 'calc-app-absolute-extreme',
    exam: 'ap-calc-ab',
    topicId: 'calc-applications',
    difficulty: 2,
    build: (r) => {
      const r1 = r.int(-3, 1);
      const r2 = r1 + 2 * r.int(1, 2);
      const B = (-3 * (r1 + r2)) / 2;
      const C = 3 * r1 * r2;
      const D = r.int(-5, 5);
      const f = (x: number) => x * x * x + B * x * x + C * x + D;
      const lo = r1 - r.int(1, 2);
      const hi = r2 + r.int(1, 2);
      const wantMax = r.next() < 0.6;
      const xs = [lo, r1, r2, hi];
      const vals = xs.map(f);
      const best = wantMax ? Math.max(...vals) : Math.min(...vals);
      const xAt = xs[vals.indexOf(best)];
      const xAll = xs.filter((_, i) => vals[i] === best);
      const local = wantMax ? f(r1) : f(r2);
      const others = vals.filter((v) => v !== best);
      const word = wantMax ? 'maximum' : 'minimum';
      return {
        prompt: `What is the absolute ${word} value of f(x) = ${poly([1, B, C, D])} on the closed interval [${lo}, ${hi}]?`,
        answer: num(best),
        wrong: [num(local), ...others.map(num), `x = ${xAt}`, num(xAt)],
        steps: [
          `f′(x) = ${poly([3, 2 * B, C])} = 3${factors(r1, r2)}, so the critical points are x = ${r1} and x = ${r2}.`,
          `Check the critical points and the endpoints: ${xs.map((x, i) => `f(${x}) = ${vals[i]}`).join(', ')}.`,
          `The ${wantMax ? 'largest' : 'smallest'} of these is ${num(best)}, at x = ${xAll.join(' and x = ')}.`,
        ],
        pitfalls: [
          `Stopping at the local ${word} f(${wantMax ? r1 : r2}) = ${local} without checking the endpoints x = ${lo} and x = ${hi}.`,
          `Giving the x-value ${xAt} instead of the ${word} value of f.`,
        ],
      };
    },
  },
  {
    id: 'calc-app-inflection-cubic',
    exam: 'ap-calc-ab',
    topicId: 'calc-applications',
    difficulty: 2,
    build: (r) => {
      const x0 = r.nonZero(-4, 4);
      const a = r.nonZero(-3, 3);
      const b = -3 * a * x0;
      const c = r.int(-9, 9);
      const d = r.int(-9, 9);
      const ask = r.pick([
        'At what value of x does the graph of f(x) = F have a point of inflection?',
        'The graph of f(x) = F changes concavity at exactly one point. What is its x-coordinate?',
      ]);
      return {
        prompt: ask.replace('F', poly([a, b, c, d])),
        answer: `x = ${x0}`,
        wrong: [`x = ${-x0}`, `x = ${new Frac(-b, 2 * a)}`, `x = ${new Frac(-b, a)}`],
        steps: [
          `f′(x) = ${poly([3 * a, 2 * b, c])}, so f″(x) = ${poly([6 * a, 2 * b])}.`,
          `Set f″(x) = 0: ${6 * a}x = ${-2 * b}, so x = ${x0}.`,
          `f″ is linear and changes sign at x = ${x0}, so this is the point of inflection.`,
        ],
        pitfalls: [`Solving ${6 * a}x ${signed(2 * b)} = 0 with the wrong sign and getting x = ${-x0}.`, `Setting f′(x) = 0 instead of f″(x) = 0; that finds turning points, not inflection.`],
      };
    },
  },
  {
    id: 'calc-app-increasing-interval',
    exam: 'ap-calc-ab',
    topicId: 'calc-applications',
    difficulty: 2,
    build: (r) => {
      const r1 = r.int(-4, 2);
      let r2 = r1 + r.int(1, 4);
      if (r1 + r2 === 0) r2++;
      const s = r.pick([1, -1]);
      const D = r.int(-6, 6);
      const inc = r.next() < 0.65;
      const outside = (p: number, q: number) => `x < ${p} or x > ${q}`;
      const between = (p: number, q: number) => `${p} < x < ${q}`;
      const outsidePositive = s > 0;
      const wantOutside = inc === outsidePositive;
      const answer = wantOutside ? outside(r1, r2) : between(r1, r2);
      const word = inc ? 'increasing' : 'decreasing';
      return {
        prompt: `On which interval(s) is f(x) = ${poly([2 * s, -3 * s * (r1 + r2), 6 * s * r1 * r2, D])} ${word}?`,
        answer,
        wrong: [wantOutside ? between(r1, r2) : outside(r1, r2), wantOutside ? outside(-r2, -r1) : between(-r2, -r1), `x > ${r1}`, `x < ${r2}`],
        steps: [
          `f′(x) = ${poly([6 * s, -6 * s * (r1 + r2), 6 * s * r1 * r2])} = ${s > 0 ? '6' : '−6'}${factors(r1, r2)}.`,
          `f′ = 0 at x = ${r1} and x = ${r2}. ${s > 0 ? 'f′ > 0 outside these values and f′ < 0 between them.' : 'f′ < 0 outside these values and f′ > 0 between them.'}`,
          `f is ${word} where f′ ${inc ? '> 0' : '< 0'}: ${answer}.`,
        ],
        pitfalls: [
          `Reading the roots of f′ with the wrong sign, as x = ${-r1} and x = ${-r2}.`,
          s < 0 ? 'Forgetting that the negative leading coefficient flips the sign pattern of f′.' : `Mixing up where f′ is positive and negative around ${r1} and ${r2}.`,
        ],
      };
    },
  },
  {
    id: 'calc-int-antiderivative-choice',
    exam: 'ap-calc-ab',
    topicId: 'calc-integrals',
    difficulty: 1,
    build: (r) => {
      if (r.next() < 0.6) {
        const a = 3 * r.nonZero(-3, 3);
        const b = 2 * r.nonZero(-4, 4);
        const c = r.nonZero(-9, 9);
        const F = (cs: number[]) => `${poly(cs)} + C`;
        return {
          prompt: `Which of the following is ∫ (${poly([a, b, c])}) dx?`,
          answer: F([a / 3, b / 2, c, 0]),
          wrong: [F([a, b, c, 0]), F([2 * a, b]), F([a / 3, b / 2, 0, c]), F([3 * a, 2 * b, c, 0])],
          steps: [
            'Power rule for integrals: ∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C.',
            `${a}x² → ${a}x³/3 = ${poly([a / 3, 0, 0, 0])}; ${b}x → ${b}x²/2 = ${poly([b / 2, 0, 0])}; ${c} → ${poly([c, 0])}.`,
            `So the integral is ${F([a / 3, b / 2, c, 0])}.`,
          ],
          pitfalls: [`Raising the powers without dividing, giving ${F([a, b, c, 0])}.`, `Differentiating instead of integrating, which gives ${poly([2 * a, b])}.`],
        };
      }
      const p = r.nonZero(-5, 5);
      const q = r.nonZero(-5, 5);
      const T = (sv: number, cv: number) => `${coefFn(sv, 'sin x', true)}${coefFn(cv, 'cos x', false)} + C`;
      return {
        prompt: `Which of the following is ∫ (${coefFn(p, 'cos x', true)}${coefFn(q, 'sin x', false)}) dx?`,
        answer: T(p, -q),
        wrong: [T(-p, q), T(p, q), T(-p, -q)],
        steps: [
          '∫ cos x dx = sin x + C and ∫ sin x dx = −cos x + C.',
          `${coefFn(p, 'cos x', true)} integrates to ${coefFn(p, 'sin x', true)}; ${coefFn(q, 'sin x', true)} integrates to ${coefFn(-q, 'cos x', true)}.`,
          `So the integral is ${T(p, -q)}.`,
        ],
        pitfalls: ['Using the derivative signs: the derivative of cos x is −sin x, but the integral of sin x is −cos x.', `Forgetting the minus sign on the cos x term, giving ${T(p, q)}.`],
      };
    },
  },
  {
    id: 'calc-int-properties-given',
    exam: 'ap-calc-ab',
    topicId: 'calc-integrals',
    difficulty: 2,
    build: (r) => {
      const L = r.int(0, 2);
      const a = L + r.int(1, 4);
      const b = a + r.int(2, 6);
      const P = r.int(-6, 12);
      let Q = r.int(-6, 15);
      if (Q === P) Q += 3;
      const I = (lo: number, up: number, body: string) => `∫${sub(lo)}${sup(up)} ${body} dx`;
      const given = `${I(L, a, 'f(x)')} = ${P} and ${I(L, b, 'f(x)')} = ${Q}`;
      const mid = Q - P;
      const form = r.pick(['scale', 'reverse', 'shift']);
      if (form === 'scale') {
        const k = r.pick([2, 3, 4, 5, -2, -3]);
        return {
          prompt: `Given that ${given}, what is ${I(a, b, `${k}f(x)`)}?`,
          answer: num(k * mid),
          wrong: [num(k * (Q + P)), num(mid), num(k * Q - P), num(-k * mid)],
          steps: [
            `Split the interval: ${I(L, b, 'f(x)')} = ${I(L, a, 'f(x)')} + ${I(a, b, 'f(x)')}.`,
            `So ${I(a, b, 'f(x)')} = ${Q} − ${paren(P)} = ${mid}.`,
            `A constant factor comes out: ${I(a, b, `${k}f(x)`)} = ${k}·${paren(mid)} = ${num(k * mid)}.`,
          ],
          pitfalls: [`Adding ${P} and ${Q} instead of subtracting.`, `Forgetting to multiply ${mid} by ${k}.`],
        };
      }
      if (form === 'reverse') {
        return {
          prompt: `Given that ${given}, what is ${I(b, a, 'f(x)')}?`,
          answer: num(-mid),
          wrong: [num(mid), num(P + Q), num(-(P + Q))],
          steps: [
            `${I(a, b, 'f(x)')} = ${Q} − ${paren(P)} = ${mid}.`,
            `Swapping the limits changes the sign: ${I(b, a, 'f(x)')} = −${I(a, b, 'f(x)')}.`,
            `So the answer is ${num(-mid)}.`,
          ],
          pitfalls: [`Missing that the limits run from ${b} down to ${a}, which flips the sign.`, `Adding ${P} and ${Q} instead of subtracting.`],
        };
      }
      const c = r.nonZero(-4, 5);
      const ans = mid + c * (b - a);
      return {
        prompt: `Given that ${given}, what is ${I(a, b, `(f(x) ${signed(c)})`)}?`,
        answer: num(ans),
        wrong: [num(mid + c), num(mid + c * b), num(Q + P + c * (b - a))],
        steps: [
          `${I(a, b, 'f(x)')} = ${Q} − ${paren(P)} = ${mid}.`,
          `${I(a, b, String(c))} = ${c}·(${b} − ${a}) = ${c * (b - a)}.`,
          `Add: ${mid} ${signed(c * (b - a))} = ${num(ans)}.`,
        ],
        pitfalls: [`Adding just ${c} instead of ${c} times the width ${b - a}.`, `Using ${b} as the width instead of ${b} − ${a} = ${b - a}.`],
      };
    },
  },
  {
    id: 'calc-int-u-sub-definite',
    exam: 'ap-calc-ab',
    topicId: 'calc-integrals',
    difficulty: 3,
    build: (r) => {
      const q = r.int(1, 3);
      const c = r.int(1, 4);
      const m = r.int(1, 3);
      const n = r.int(1, 2);
      const U = m * m + c;
      const raw = Math.pow(U, n + 1) - Math.pow(c, n + 1);
      const ans = new Frac(q * raw, n + 1);
      const lead = 2 * q;
      return {
        prompt: `Evaluate the integral of ${lead}x(x² + ${c})${supPow(n)} dx from x = 0 to x = ${m}.`,
        answer: ans.toString(),
        wrong: [new Frac(q * Math.pow(m, n + 1), n + 1).toString(), new Frac(q * raw).toString(), new Frac(2 * q * raw, n + 1).toString(), new Frac(q * Math.pow(U, n + 1), n + 1).toString()],
        steps: [
          `Let u = x² + ${c}, so du = 2x dx and ${lead}x dx = ${q === 1 ? '' : q}du.`,
          `Change the limits: x = 0 gives u = ${c}; x = ${m} gives u = ${U}.`,
          `${q === 1 ? '' : q + '·'}∫ from ${c} to ${U} of u${supPow(n)} du = ${q === 1 ? '' : q + '·'}[u${sup(n + 1)}/${n + 1}] = ${q === 1 ? '' : q + '·'}(${U}${sup(n + 1)} − ${c}${sup(n + 1)})/${n + 1} = ${ans}.`,
        ],
        pitfalls: [`Keeping the x-limits 0 and ${m} after switching to u, instead of ${c} and ${U}.`, `Forgetting to divide by ${n + 1} when integrating u${supPow(n)}.`],
      };
    },
  },
];
