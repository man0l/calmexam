import { Frac, num, paren, poly, signed, Template } from '../core';

const piStr = (f: Frac) => {
  if (f.n === 0) return '0';
  const c = f.n === 1 ? '' : f.n === -1 ? '−' : String(f.n).replace('-', '−');
  return f.d === 1 ? `${c}π` : `${c}π/${f.d}`;
};

const pt = (x: number, y: number) => `(${num(x)}, ${num(y)})`;

const median = (vals: number[]) => {
  const s = vals.slice().sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};

const eq = (n: number, d: number) => (new Frac(n, d).d === d ? `${n}/${d}` : `${n}/${d} = ${new Frac(n, d)}`);

const near = (f: Frac) => [new Frac(f.n + 1, f.d + 1), new Frac(f.n, f.d + 1), f.n > 1 ? new Frac(f.n - 1, f.d) : new Frac(f.n + 1, f.d + 2)].map(String);

const flip: Record<string, string> = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
];

export const SAT_NEW_TEMPLATES: Template[] = [
  {
    id: 'sat-ratio-recipe-scale',
    exam: 'sat',
    topicId: 'sat-ratios',
    difficulty: 1,
    build: (r) => {
      const [unit, verb, items] = r.pick([
        ['cups of flour', 'make', 'muffins'],
        ['tablespoons of honey', 'make', 'granola bars'],
        ['liters of paint', 'cover', 'square meters of fence'],
        ['grams of yeast', 'bake', 'loaves of bread'],
        ['scoops of feed', 'feed', 'chickens'],
      ]);
      const b = r.pick([4, 6, 8, 10, 12]);
      let a = r.int(2, 9);
      if (a === b) a += 1;
      const t = r.pick([0.5, 1.5, 2, 2.5, 3, 4]);
      const c = b * t;
      const ans = a * t;
      return {
        prompt: `A plan uses ${a} ${unit} to ${verb} ${b} ${items}. At the same rate, how many ${unit} are needed to ${verb} ${c} ${items}?`,
        answer: num(ans),
        wrong: [num((c * b) / a), num(a + Math.abs(c - b)), num(a * c), num(a * t + a), num(a + t)],
        steps: [
          `Set up a proportion: ${a}/${b} = x/${c}.`,
          `Cross-multiply: ${b}x = ${a} × ${c} = ${a * c}.`,
          `Divide by ${b}: x = ${num(ans)}.`,
        ],
        pitfalls: [
          c > b ? `Adding the change in ${items} (${c} − ${b} = ${c - b}) to ${a} instead of scaling by ${num(t)}.` : `Subtracting ${b} − ${c} = ${b - c} from ${a} instead of scaling by ${num(t)}.`,
          `Flipping the ratio to ${b}/${a}, which gives ${num((c * b) / a)}.`,
        ],
      };
    },
  },
  {
    id: 'sat-ratio-part-whole',
    exam: 'sat',
    topicId: 'sat-ratios',
    difficulty: 2,
    build: (r) => {
      const [group, x, y] = r.pick([
        ['a school club', 'juniors', 'seniors'],
        ['a jar of marbles', 'red marbles', 'blue marbles'],
        ['an orchard', 'apple trees', 'pear trees'],
        ['a parking lot', 'cars', 'trucks'],
        ['a choir', 'altos', 'sopranos'],
      ]);
      const [p, q] = r.pick([
        [1, 2],
        [1, 3],
        [2, 3],
        [2, 5],
        [3, 4],
        [3, 5],
        [3, 7],
        [4, 5],
        [4, 7],
        [5, 6],
        [5, 8],
      ]);
      const k = r.int(3, 12);
      const total = (p + q) * k;
      const ans = (q - p) * k;
      return {
        prompt: `In ${group}, the ratio of ${x} to ${y} is ${p} to ${q}. There are ${total} in total, and every one is either one of the ${x} or one of the ${y}. How many more ${y} than ${x} are there?`,
        answer: String(ans),
        wrong: [String(q - p), String(q * k), String(Math.round((total * (q - p)) / q))],
        steps: [
          `The ratio ${p} : ${q} splits the total into ${p} + ${q} = ${p + q} equal parts.`,
          `Each part is ${total} ÷ ${p + q} = ${k}.`,
          `There are ${p * k} ${x} and ${q * k} ${y}, so the difference is ${q * k} − ${p * k} = ${ans}.`,
        ],
        pitfalls: [`Answering ${q - p}, the difference in the ratio numbers, without multiplying by the part size ${k}.`, `Giving the number of ${y} (${q * k}) instead of the difference.`],
      };
    },
  },
  {
    id: 'sat-ratio-unit-conversion',
    exam: 'sat',
    topicId: 'sat-ratios',
    difficulty: 2,
    build: (r) => {
      const kind = r.int(0, 2);
      if (kind === 0) {
        const v = r.int(4, 40);
        return {
          prompt: `A drone flies at a constant speed of ${v} meters per second. What is this speed in kilometers per hour? (1 kilometer = 1,000 meters)`,
          answer: num(v * 3.6),
          wrong: [num((v * 60) / 1000), num(v * 3600), num(v / 3.6)],
          steps: [`In one hour there are 3,600 seconds, so the drone covers ${v} × 3,600 = ${v * 3600} meters.`, `Convert to kilometers: ${v * 3600} ÷ 1,000 = ${num(v * 3.6)}.`],
          pitfalls: [`Converting seconds to minutes only (× 60) and getting ${num((v * 60) / 1000)}.`, `Forgetting to divide ${v * 3600} meters by 1,000.`],
        };
      }
      if (kind === 1) {
        const k = r.int(1, 6);
        const v = 22 * k;
        return {
          prompt: `A runner's top speed is ${v} feet per second. What is this speed in miles per hour? (1 mile = 5,280 feet)`,
          answer: num(15 * k),
          wrong: [num((v * 60) / 5280), num((v * 5280) / 3600), num(v * 60)],
          steps: [`Feet per hour: ${v} × 3,600 = ${v * 3600}.`, `Miles per hour: ${v * 3600} ÷ 5,280 = ${15 * k}.`],
          pitfalls: [`Multiplying by 5,280 instead of dividing, which gives ${num((v * 5280) / 3600)}.`, 'Using 60 seconds in an hour instead of 3,600.'],
        };
      }
      const k = r.int(1, 10);
      const L = 3 * k;
      return {
        prompt: `A pump moves water at ${L} liters per minute. What is this rate in milliliters per second? (1 liter = 1,000 milliliters)`,
        answer: num(50 * k),
        wrong: [num(L * 1000), num(L * 60000), num((L * 60) / 1000)],
        steps: [`Milliliters per minute: ${L} × 1,000 = ${L * 1000}.`, `There are 60 seconds in a minute: ${L * 1000} ÷ 60 = ${50 * k}.`],
        pitfalls: [`Stopping at ${L * 1000} milliliters per minute.`, `Multiplying by 60 instead of dividing when going from minutes to seconds.`],
      };
    },
  },
  {
    id: 'sat-ratio-map-scale',
    exam: 'sat',
    topicId: 'sat-ratios',
    difficulty: 2,
    build: (r) => {
      const s = r.pick([2, 4, 5]);
      const u = r.int(3, 12);
      const k = s * u;
      const d = r.int(3, 30) / 2;
      const D = d * u;
      const [a, b] = r.pick([
        ['two towns', 'towns'],
        ['two lakes', 'lakes'],
        ['two campsites', 'campsites'],
        ['two train stations', 'stations'],
      ]);
      if (r.next() < 0.5) {
        return {
          prompt: `On a map, ${s} centimeters represent ${k} kilometers. The distance between ${a} on the map is ${num(d)} centimeters. What is the actual distance between the ${b}, in kilometers?`,
          answer: num(D),
          wrong: [num(d * k), num(d / u), num(d * s), num(D + u), num(d + k)],
          steps: [`One centimeter represents ${k} ÷ ${s} = ${u} kilometers.`, `Actual distance: ${num(d)} × ${u} = ${num(D)} kilometers.`],
          pitfalls: [`Multiplying ${num(d)} by ${k} without first dividing by ${s}.`],
        };
      }
      return {
        prompt: `On a map, ${s} centimeters represent ${k} kilometers. ${a.charAt(0).toUpperCase() + a.slice(1)} are ${num(D)} kilometers apart. How far apart are they on the map, in centimeters?`,
        answer: num(d),
        wrong: [num(D / s), num(D / k), num(D * u), num(d * 2), num(d + s)],
        steps: [`One centimeter represents ${k} ÷ ${s} = ${u} kilometers.`, `Map distance: ${num(D)} ÷ ${u} = ${num(d)} centimeters.`],
        pitfalls: [`Dividing ${num(D)} by ${s} or by ${k} alone instead of by ${u} kilometers per centimeter.`],
      };
    },
  },
  {
    id: 'sat-ratio-average-speed',
    exam: 'sat',
    topicId: 'sat-ratios',
    difficulty: 3,
    build: (r) => {
      const [t1, t2] = r.pick([
        [1, 3],
        [3, 1],
        [1, 4],
        [4, 1],
        [2, 3],
        [3, 2],
      ]);
      const v1 = r.int(4, 14) * 5;
      let v2 = r.int(4, 14) * 5;
      if (v2 === v1) v2 = v1 + 10;
      const d1 = v1 * t1;
      const d2 = v2 * t2;
      const avg = (d1 + d2) / (t1 + t2);
      const who = r.pick(['A delivery van', 'A bus', 'A family on a road trip', 'A truck']);
      return {
        prompt: `${who} travels ${d1} miles at ${v1} miles per hour and then ${d2} miles at ${v2} miles per hour. What is the average speed for the whole trip, in miles per hour?`,
        answer: num(avg),
        wrong: [num((v1 + v2) / 2), num((v1 * t2 + v2 * t1) / (t1 + t2)), num((d1 + d2) / Math.max(t1, t2))],
        steps: [
          `Time for each part: ${d1} ÷ ${v1} = ${t1} h and ${d2} ÷ ${v2} = ${t2} h.`,
          `Total distance ${d1 + d2} miles, total time ${t1 + t2} hours.`,
          `Average speed = ${d1 + d2} ÷ ${t1 + t2} = ${num(avg)} miles per hour.`,
        ],
        pitfalls: [`Averaging the two speeds to get ${num((v1 + v2) / 2)}. The trip spends more time at one speed, so use total distance ÷ total time.`],
      };
    },
  },
  {
    id: 'sat-prob-multiple-card',
    exam: 'sat',
    topicId: 'sat-probability',
    difficulty: 1,
    build: (r) => {
      const N = r.int(20, 60);
      const k = r.int(3, 8);
      const c = Math.floor(N / k);
      const thing = r.pick(['cards', 'tickets', 'balls', 'tiles']);
      return {
        prompt: `A box holds ${N} ${thing} numbered 1 through ${N}. One is chosen at random. What is the probability that its number is a multiple of ${k}?`,
        answer: new Frac(c, N).toString(),
        wrong: [new Frac(c * k === N ? c - 1 : 1, c * k === N ? N : k).toString(), new Frac(c + 1, N).toString(), new Frac(c, N - c).toString(), ...near(new Frac(c, N))],
        steps: [
          `The multiples of ${k} up to ${N} are ${k}, ${2 * k}, …, ${c * k}, so there are ${N} ÷ ${k} rounded down = ${c} of them.`,
          new Frac(c, N).d === N ? `Probability = ${c}/${N}.` : `Probability = ${c}/${N} = ${new Frac(c, N)}.`,
        ],
        pitfalls: [
          c * k === N ? `Miscounting the multiples of ${k}: the last one, ${N}, is included, so there are ${c}.` : `Using 1/${k}, which only works when ${N} is a multiple of ${k}.`,
          `Dividing by the ${N - c} non-multiples instead of all ${N} ${thing}.`,
        ],
      };
    },
  },
  {
    id: 'sat-prob-complement',
    exam: 'sat',
    topicId: 'sat-probability',
    difficulty: 1,
    build: (r) => {
      const [x, y, z] = r.shuffle(['red', 'blue', 'green', 'yellow', 'white']).slice(0, 3);
      const a = r.int(2, 12);
      const b = r.int(2, 12);
      const c = r.int(2, 12);
      const total = a + b + c;
      return {
        prompt: `A bag contains ${a} ${x}, ${b} ${y} and ${c} ${z} marbles. One marble is drawn at random. What is the probability that it is not ${x}?`,
        answer: new Frac(b + c, total).toString(),
        wrong: [new Frac(a, total).toString(), new Frac(b, total).toString(), new Frac(a, b + c).toString(), ...near(new Frac(b + c, total))],
        steps: [`There are ${a} + ${b} + ${c} = ${total} marbles, and ${b + c} of them are not ${x}.`, `P(not ${x}) = 1 − ${a}/${total} = ${b + c}/${total}${new Frac(b + c, total).d === total ? '' : ` = ${new Frac(b + c, total)}`}.`],
        pitfalls: [`Giving P(${x}) = ${new Frac(a, total)} instead of 1 minus it.`, `Comparing ${x} to the rest (${a} : ${b + c}) instead of dividing by the total ${total}.`],
      };
    },
  },
  {
    id: 'sat-prob-two-way-conditional',
    exam: 'sat',
    topicId: 'sat-probability',
    difficulty: 2,
    build: (r) => {
      const [[g1, g2], [o1, o2], who] = r.pick([
        [['Grade 10', 'Grade 11'], ['chess club', 'robotics club'], 'students'],
        [['Morning shift', 'Evening shift'], ['walks to work', 'drives to work'], 'employees'],
        [['Under 30', '30 and over'], ['prefers tea', 'prefers coffee'], 'adults'],
        [['Team A', 'Team B'], ['right-handed', 'left-handed'], 'players'],
      ]);
      const a = r.int(8, 40);
      const b = r.int(8, 40);
      const c = r.int(8, 40);
      const d = r.int(8, 40);
      const byCol = r.next() < 0.5;
      const total = a + b + c + d;
      const table = `${g1}: ${o1} ${a}, ${o2} ${b}; ${g2}: ${o1} ${c}, ${o2} ${d}.`;
      const ans = byCol ? new Frac(d, b + d) : new Frac(d, c + d);
      const other = byCol ? new Frac(d, c + d) : new Frac(d, b + d);
      return {
        prompt: byCol
          ? `A survey of ${total} ${who} is summarized here. ${table} One of the ${who} in the ${o2} column is chosen at random. What is the probability that this person is in the ${g2} row?`
          : `A survey of ${total} ${who} is summarized here. ${table} One of the ${who} in the ${g2} row is chosen at random. What is the probability that this person is in the ${o2} column?`,
        answer: ans.toString(),
        wrong: [new Frac(d, total).toString(), other.toString(), (byCol ? new Frac(b, b + d) : new Frac(c, c + d)).toString(), ...near(ans)],
        steps: byCol
          ? [`The condition limits you to the ${o2} column: ${b} + ${d} = ${b + d} ${who}.`, `Of those, ${d} are in ${g2}.`, `Probability = ${d}/${b + d} = ${ans}.`]
          : [`The condition limits you to the ${g2} row: ${c} + ${d} = ${c + d} ${who}.`, `Of those, ${d} are in the ${o2} column.`, `Probability = ${d}/${c + d} = ${ans}.`],
        pitfalls: [`Dividing ${d} by all ${total} ${who} instead of only the group named in the condition.`, `Using the ${byCol ? `${g2} row total ${c + d}` : `${o2} column total ${b + d}`} as the denominator.`],
      };
    },
  },
  {
    id: 'sat-prob-independent-replace',
    exam: 'sat',
    topicId: 'sat-probability',
    difficulty: 2,
    build: (r) => {
      const red = r.int(2, 9);
      const blue = r.int(2, 9);
      const N = red + blue;
      const both = r.next() < 0.5;
      const ans = both ? new Frac(red * red, N * N) : new Frac(red * blue, N * N);
      const noReplace = both ? new Frac(red * (red - 1), N * (N - 1)) : new Frac(red * blue, N * (N - 1));
      const item = r.pick(['tokens', 'chips', 'cubes']);
      return {
        prompt: both
          ? `A bag has ${red} red ${item} and ${blue} blue ${item}. One is drawn at random, put back, and then a second is drawn. What is the probability that both are red?`
          : `A bag has ${red} red ${item} and ${blue} blue ${item}. One is drawn at random, put back, and then a second is drawn. What is the probability that the first is red and the second is blue?`,
        answer: ans.toString(),
        wrong: [noReplace.toString(), (both ? new Frac(2 * red, N) : new Frac(2 * red * blue, N * N)).toString(), (both ? new Frac(red, N) : new Frac(blue, N)).toString(), ...near(ans)],
        steps: [
          `The first ${item.slice(0, -1)} is put back, so the draws are independent and each has ${N} choices.`,
          both ? `P(red) = ${red}/${N} each time.` : `P(red) = ${red}/${N} and P(blue) = ${blue}/${N}.`,
          both ? `Multiply: (${red}/${N}) × (${red}/${N}) = ${ans}.` : `Multiply: (${red}/${N}) × (${blue}/${N}) = ${ans}.`,
        ],
        pitfalls: [`Reducing the count to ${N - 1} for the second draw, which gives ${noReplace}. The first one is put back.`, 'Adding the two probabilities instead of multiplying them.'],
      };
    },
  },
  {
    id: 'sat-prob-at-least-one',
    exam: 'sat',
    topicId: 'sat-probability',
    difficulty: 3,
    build: (r) => {
      const opts: [number, number][] = [
        [1, 2],
        [1, 3],
        [2, 3],
        [1, 4],
        [3, 4],
        [1, 5],
        [2, 5],
        [3, 5],
        [4, 5],
        [1, 6],
        [5, 6],
      ];
      const [pn, pd] = r.pick(opts);
      let [qn, qd] = r.pick(opts);
      if (qn === pn && qd === pd) [qn, qd] = pd === 2 ? [1, 3] : [1, 2];
      const p = new Frac(pn, pd);
      const q = new Frac(qn, qd);
      const none = new Frac(1).sub(p).mul(new Frac(1).sub(q));
      const ans = new Frac(1).sub(none);
      const [e1, e2, what] = r.pick([
        ['the first archer hits the target', 'the second archer hits the target', 'at least one archer hits the target'],
        ['machine A jams today', 'machine B jams today', 'at least one machine jams today'],
        ['Maya wins her match', 'Leo wins his match', 'at least one of them wins'],
        ['the morning train is late', 'the evening train is late', 'at least one train is late'],
      ]);
      return {
        prompt: `The probability that ${e1} is ${p}, and the probability that ${e2} is ${q}. The two events are independent. What is the probability that ${what}?`,
        answer: ans.toString(),
        wrong: [p.mul(q).toString(), new Frac(1).sub(p.mul(q)).toString(), none.toString(), ...near(ans)],
        steps: [
          `P(neither) = (1 − ${p})(1 − ${q}) = ${new Frac(1).sub(p)} × ${new Frac(1).sub(q)} = ${none}.`,
          `P(at least one) = 1 − ${none} = ${ans}.`,
        ],
        pitfalls: [`Multiplying ${p} × ${q} = ${p.mul(q)}, which is the chance that both happen, not at least one.`, `Stopping at P(neither) = ${none} and forgetting to subtract it from 1.`],
      };
    },
  },
  {
    id: 'sat-ineq-sign-flip',
    exam: 'sat',
    topicId: 'sat-inequalities',
    difficulty: 1,
    build: (r) => {
      const k = r.int(-8, 10);
      const b = r.int(2, 7);
      const c0 = r.nonZero(-10, 15);
      const d = c0 - b * k;
      const sym = r.pick(['<', '>', '≤', '≥']);
      const f = flip[sym];
      return {
        prompt: `Which inequality is equivalent to ${num(c0)} − ${b}x ${sym} ${num(d)}?`,
        answer: `x ${f} ${num(k)}`,
        wrong: [`x ${sym} ${num(k)}`, `x ${f} ${num(-k)}`, `x ${sym} ${num(-k)}`],
        steps: [`${c0 < 0 ? `Add ${-c0} to` : `Subtract ${c0} from`} both sides: −${b}x ${sym} ${num(d - c0)}.`, `Divide both sides by −${b} and flip the sign: x ${f} ${num(k)}.`],
        pitfalls: [`Dividing by −${b} without flipping ${sym} to ${f}.`],
      };
    },
  },
  {
    id: 'sat-ineq-extreme-integer',
    exam: 'sat',
    topicId: 'sat-inequalities',
    difficulty: 2,
    build: (r) => {
      const c = r.int(1, 4);
      const m = r.int(2, 5);
      const a = c + m;
      const N = r.int(-6, 12);
      const s = r.int(1, m);
      const lt = r.next() < 0.5;
      const R = lt ? m * N + s : m * N - s;
      const b = r.int(-9, 9);
      const e = b + R;
      const left = poly([a, b]);
      const right = poly([c, e]);
      const swap = r.next() < 0.5;
      const sym = lt ? '<' : '>';
      const ineq = swap ? `${right} ${flip[sym]} ${left}` : `${left} ${sym} ${right}`;
      const bound = new Frac(R, m);
      return {
        prompt: `What is the ${lt ? 'greatest' : 'least'} integer x that satisfies ${ineq}?`,
        answer: num(N),
        wrong: [num(lt ? N + 1 : N - 1), num(lt ? N - 1 : N + 1), num(-N)],
        steps: [
          `Collect x terms on the left and constants on the right: ${a}x − ${c}x ${sym} ${b ? `${num(e)} − ${paren(b)}` : num(e)}.`,
          `${m}x ${sym} ${R}, so x ${sym} ${bound}${bound.isInt() ? '' : ` (about ${num(bound.value())})`}.`,
          `The ${lt ? 'greatest' : 'least'} integer ${lt ? 'below' : 'above'} ${bound} is ${num(N)}.`,
        ],
        pitfalls: [
          bound.isInt() ? `Including the boundary value ${bound} even though the inequality is strict.` : `Rounding ${num(bound.value())} to the nearest integer instead of ${lt ? 'down' : 'up'}.`,
          swap ? `Collecting the x terms as ${c}x − ${a}x = −${m}x and then dividing by −${m} without flipping the inequality.` : `Moving ${num(b)} across without changing its sign.`,
        ],
      };
    },
  },
  {
    id: 'sat-ineq-budget',
    exam: 'sat',
    topicId: 'sat-inequalities',
    difficulty: 2,
    build: (r) => {
      const name = r.pick(['Priya', 'Marcus', 'Elena', 'Jonah', 'Aiko', 'Sam']);
      if (r.next() < 0.5) {
        const [item, fee] = r.pick([
          ['concert tickets', 'a one-time booking fee'],
          ['notebooks', 'a flat shipping charge'],
          ['plants', 'a delivery fee'],
          ['art prints', 'a framing setup charge'],
        ]);
        const p = r.int(3, 15);
        const N = r.int(4, 25);
        const f = r.int(2, 12);
        const s = r.int(0, p - 1);
        const B = f + p * N + s;
        return {
          prompt: `${name} has $${B} to spend on ${item}. Each costs $${p}, and there is ${fee} of $${f}. What is the greatest number of ${item} ${name} can buy?`,
          answer: String(N),
          wrong: [String(N + 1), String(Math.floor(B / p)), String(N - 1), String(N + 2)],
          steps: [`Write the inequality: ${p}n + ${f} ≤ ${B}.`, `Subtract ${f}: ${p}n ≤ ${B - f}.`, `n ≤ ${num((B - f) / p)}, so the greatest whole number is ${N}.`],
          pitfalls: [`Ignoring the $${f} charge and dividing ${B} by ${p}.`, s ? `Rounding ${num((B - f) / p)} up to ${N + 1}, which goes over budget.` : `Using < instead of ≤ and dropping the case that spends exactly $${B}.`],
        };
      }
      const w = r.int(8, 20);
      const N = r.int(5, 30);
      const k = r.int(1, w - 1);
      const s0 = r.int(2, 30) * 5;
      const T = s0 + w * N - k;
      const goal = r.pick(['a bike', 'a laptop', 'a trip', 'a camera']);
      return {
        prompt: `${name} has saved $${s0} and earns $${w} per hour. ${name} needs at least $${T} in total for ${goal}. What is the least number of whole hours ${name} must work?`,
        answer: String(N),
        wrong: [String(N - 1), String(Math.ceil(T / w)), String(N + 1)],
        steps: [`Write the inequality: ${s0} + ${w}h ≥ ${T}.`, `Subtract ${s0}: ${w}h ≥ ${T - s0}.`, `h ≥ ${num((T - s0) / w)}, so the least whole number of hours is ${N}.`],
        pitfalls: [`Rounding ${num((T - s0) / w)} down to ${N - 1}, which leaves ${name} short.`, `Forgetting the $${s0} already saved.`],
      };
    },
  },
  {
    id: 'sat-ineq-compound-count',
    exam: 'sat',
    topicId: 'sat-inequalities',
    difficulty: 3,
    build: (r) => {
      const b = r.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
      const p = r.int(-6, 4);
      const q = p + r.int(3, 8);
      const c = r.int(-12, 12);
      const L = b > 0 ? b * p + c : b * q + c;
      const U = b > 0 ? b * q + c : b * p + c;
      const s1 = r.pick(['<', '≤']);
      const s2 = r.pick(['<', '≤']);
      const ok = (v: number) => (s1 === '<' ? L < v : L <= v) && (s2 === '<' ? v < U : v <= U);
      const sols: number[] = [];
      for (let x = p - 2; x <= q + 2; x++) if (ok(b * x + c)) sols.push(x);
      const n = sols.length;
      const lo = Math.min(sols[0], sols[n - 1]);
      const hi = Math.max(sols[0], sols[n - 1]);
      return {
        prompt: `How many integers x satisfy ${num(L)} ${s1} ${poly([b, c])} ${s2} ${num(U)}?`,
        answer: String(n),
        wrong: [String(n + 1), String(n - 1), String(U - L)],
        steps: [
          `${c < 0 ? `Add ${-c} to` : `Subtract ${c} from`} all three parts: ${num(L - c)} ${s1} ${b}x ${s2} ${num(U - c)}.`,
          b < 0 ? `Divide every part by ${b} and flip both signs, so x lies between ${p} and ${q}.` : `Divide every part by ${b}, so x lies between ${p} and ${q}.`,
          `Check the ends: the integers that work run from ${lo} to ${hi}, which is ${n} integers.`,
        ],
        pitfalls: [
          b < 0 ? `Dividing by ${b} without flipping the signs, which swaps which end is included.` : `Counting ${q} − ${paren(p)} = ${q - p} without checking whether each end is included.`,
          `Counting the ${U - L} values of ${poly([b, c])} instead of the values of x.`,
        ],
      };
    },
  },
  {
    id: 'sat-ineq-system-point',
    exam: 'sat',
    topicId: 'sat-inequalities',
    difficulty: 2,
    build: (r) => {
      const a = r.nonZero(-3, 3);
      let c = r.nonZero(-3, 3);
      if (c === a) c = a === 3 ? -2 : a + 1;
      const b = r.int(-6, 6);
      const x0 = r.int(-3, 3);
      const gap = r.int(2, 6);
      const d = b + gap - (c - a) * x0;
      const y0 = a * x0 + b + r.int(1, gap - 1);
      const f1 = (x: number, y: number) => y > a * x + b;
      const f2 = (x: number, y: number) => y <= c * x + d;
      const onEdge = (x: number, y: number) => y === a * x + b || y === c * x + d;
      const only1: [number, number][] = [];
      const only2: [number, number][] = [];
      const neither: [number, number][] = [];
      for (let i = 0; i < 400; i++) {
        const x = r.int(-5, 5);
        const y = r.int(-6, 6) + (r.next() < 0.5 ? a * x + b : c * x + d);
        if ((x === x0 && y === y0) || onEdge(x, y)) continue;
        const A = f1(x, y);
        const B = f2(x, y);
        if (A && B) continue;
        const bucket = A ? only1 : B ? only2 : neither;
        if (!bucket.some(([u, v]) => u === x && v === y)) bucket.push([x, y]);
      }
      const pool: [number, number][] = [];
      if (only1.length) pool.push(only1[0]);
      if (only2.length) pool.push(only2[0]);
      if (neither.length) pool.push(neither[0]);
      for (const extra of [...only1.slice(1), ...only2.slice(1), ...neither.slice(1)]) if (pool.length < 3) pool.push(extra);
      const trap = only1[0];
      return {
        prompt: `Which point (x, y) is a solution to the system of inequalities y > ${poly([a, b])} and y ≤ ${poly([c, d])}?`,
        answer: pt(x0, y0),
        wrong: pool.slice(0, 3).map(([x, y]) => pt(x, y)),
        steps: [
          `First inequality at x = ${num(x0)}: ${poly([a, b])} = ${num(a * x0 + b)}, and ${num(y0)} > ${num(a * x0 + b)}.`,
          `Second inequality at x = ${num(x0)}: ${poly([c, d])} = ${num(c * x0 + d)}, and ${num(y0)} ≤ ${num(c * x0 + d)}.`,
          'It satisfies both, so it is a solution. Each other point fails at least one inequality.',
        ],
        pitfalls: trap
          ? [`Checking only the first inequality: ${pt(trap[0], trap[1])} passes y > ${poly([a, b])} but fails y ≤ ${poly([c, d])}.`]
          : [`Checking only one inequality. A solution must make both y > ${poly([a, b])} and y ≤ ${poly([c, d])} true.`],
      };
    },
  },
  {
    id: 'sat-area-rect-triangle',
    exam: 'sat',
    topicId: 'sat-area-volume',
    difficulty: 1,
    build: (r) => {
      const unit = r.pick(['centimeters', 'meters', 'inches', 'feet']);
      if (r.next() < 0.5) {
        const w = r.int(2, 15);
        const L = w + r.int(1, 12);
        const P = 2 * (L + w);
        return {
          prompt: `A rectangle has a perimeter of ${P} ${unit} and a width of ${w} ${unit}. What is its area, in square ${unit}?`,
          answer: num(L * w),
          wrong: [num((P - w) * w), num((P / 2) * w), num(L)],
          steps: [`Half the perimeter is length + width: ${P} ÷ 2 = ${P / 2}.`, `Length = ${P / 2} − ${w} = ${L}.`, `Area = ${L} × ${w} = ${L * w}.`],
          pitfalls: [`Using ${P} − ${w} = ${P - w} as the length. The perimeter counts each side twice.`],
        };
      }
      const base = r.int(3, 16);
      const h = r.int(2, 14);
      const A = new Frac(base * h, 2);
      return {
        prompt: `A triangle has a base of ${base} ${unit} and an area of ${num(A.value())} square ${unit}. What is the height of the triangle, in ${unit}?`,
        answer: num(h),
        wrong: [num(A.value() / base), num(A.value() * 2), num(h * 2)],
        steps: [`Area = (1/2) × base × height, so ${num(A.value())} = (1/2) × ${base} × h.`, `Multiply both sides by 2: ${base * h} = ${base}h.`, `h = ${base * h} ÷ ${base} = ${h}.`],
        pitfalls: [`Dividing ${num(A.value())} by ${base} and forgetting the 1/2 in the area formula.`],
      };
    },
  },
  {
    id: 'sat-area-composite',
    exam: 'sat',
    topicId: 'sat-area-volume',
    difficulty: 2,
    build: (r) => {
      const m = r.int(1, 4);
      const w = 4 * m;
      const h = r.int(3, 12);
      const [shape, unit] = r.pick([
        ['A window', 'feet'],
        ['A garden bed', 'meters'],
        ['A stage floor', 'meters'],
        ['A tabletop', 'feet'],
      ]);
      const pi = (k: number) => piStr(new Frac(k));
      return {
        prompt: `${shape} is shaped like a rectangle ${w} ${unit} wide and ${h} ${unit} long, with a semicircle attached along one ${w}-${unit === 'feet' ? 'foot' : 'meter'} side, so the side is the diameter. What is the total area, in square ${unit}?`,
        answer: `${w * h} + ${pi(2 * m * m)}`,
        wrong: [`${w * h} + ${pi(4 * m * m)}`, `${w * h} + ${pi(8 * m * m)}`, `${w * h} + ${pi(2 * m)}`],
        steps: [
          `Rectangle: ${w} × ${h} = ${w * h}.`,
          `The semicircle has diameter ${w}, so radius ${2 * m}. Its area is (1/2)π(${2 * m})² = ${pi(2 * m * m)}.`,
          `Total: ${w * h} + ${pi(2 * m * m)}.`,
        ],
        pitfalls: [`Using the diameter ${w} as the radius, which gives ${pi(8 * m * m)} for the semicircle.`, `Using a full circle (${pi(4 * m * m)}) instead of half of one.`],
      };
    },
  },
  {
    id: 'sat-volume-solids',
    exam: 'sat',
    topicId: 'sat-area-volume',
    difficulty: 2,
    build: (r) => {
      const kind = r.int(0, 2);
      if (kind === 0) {
        const rad = r.int(1, 8);
        const h = r.int(2, 15);
        const D = 2 * rad;
        const thing = r.pick(['can', 'water tank', 'candle']);
        return {
          prompt: `A ${thing} is a right circular cylinder with a diameter of ${D} inches and a height of ${h} inches. What is its volume, in cubic inches?`,
          answer: piStr(new Frac(rad * rad * h)),
          wrong: [piStr(new Frac(D * D * h)), piStr(new Frac(2 * rad * h)), piStr(new Frac(rad * rad * h, 3))],
          steps: [`The radius is half the diameter: ${D} ÷ 2 = ${rad}.`, `V = πr²h = π × ${rad}² × ${h} = ${piStr(new Frac(rad * rad * h))}.`],
          pitfalls: [`Using the diameter ${D} as r, which gives ${piStr(new Frac(D * D * h))}.`],
        };
      }
      if (kind === 1) {
        const rad = r.int(2, 9);
        const h = 3 * r.int(1, 6);
        const thing = r.pick(['paper cup', 'funnel', 'pile of sand']);
        const v = new Frac(rad * rad * h, 3);
        return {
          prompt: `A ${thing} is shaped like a right circular cone with a base radius of ${rad} centimeters and a height of ${h} centimeters. What is its volume, in cubic centimeters?`,
          answer: piStr(v),
          wrong: [piStr(new Frac(rad * rad * h)), piStr(new Frac(rad * h, 3)), piStr(new Frac(2 * rad * h, 3))],
          steps: [`V = (1/3)πr²h.`, `(1/3) × π × ${rad}² × ${h} = (1/3) × ${rad * rad * h}π = ${piStr(v)}.`],
          pitfalls: [`Leaving out the 1/3, which gives the cylinder volume ${piStr(new Frac(rad * rad * h))}.`],
        };
      }
      const rad = r.int(1, 9);
      const thing = r.pick(['ball', 'globe', 'bead']);
      const v = new Frac(4 * rad * rad * rad, 3);
      return {
        prompt: `A ${thing} is a sphere with a radius of ${rad} centimeters. What is its volume, in cubic centimeters?`,
        answer: piStr(v),
        wrong: [piStr(new Frac(4 * rad * rad)), piStr(new Frac(4 * rad * rad * rad)), piStr(new Frac(4 * rad * rad, 3))],
        steps: ['V = (4/3)πr³.', `${rad}³ = ${rad * rad * rad}, so V = (4/3) × ${rad * rad * rad}π = ${piStr(v)}.`],
        pitfalls: [`Using the surface area formula 4πr², which gives ${piStr(new Frac(4 * rad * rad))}.`, 'Cubing the radius but forgetting to divide by 3.'],
      };
    },
  },
  {
    id: 'sat-area-scale-factor',
    exam: 'sat',
    topicId: 'sat-area-volume',
    difficulty: 3,
    build: (r) => {
      const k = r.pick([2, 3, 4, 1.5]);
      const isVol = r.next() < 0.5;
      const base = k === 1.5 ? 8 * r.int(2, 12) : r.int(5, 60);
      if (isVol) {
        const [shape, how] = r.pick([
          ['A rectangular box', 'its length, width and height are each'],
          ['A cylinder', 'its radius and height are each'],
          ['A cone', 'its radius and height are each'],
        ]);
        const ans = base * k ** 3;
        return {
          prompt: `${shape} has a volume of ${base} cubic inches. A larger, similar solid is made where ${how} multiplied by ${num(k)}. What is the volume of the larger solid, in cubic inches?`,
          answer: num(ans),
          wrong: [num(base * k), num(base * k * k), num(base * 3 * k)],
          steps: [`Lengths scale by ${num(k)}, so volume scales by ${num(k)}³ = ${num(k ** 3)}.`, `${base} × ${num(k ** 3)} = ${num(ans)}.`],
          pitfalls: [`Multiplying the volume by ${num(k)} or by ${num(k)}² = ${num(k * k)} instead of ${num(k)}³.`],
        };
      }
      const [shape, how] = r.pick([
        ['A triangle', 'each side length is'],
        ['A photograph', 'its length and width are each'],
        ['A garden plot', 'its length and width are each'],
      ]);
      const ans = base * k * k;
      return {
        prompt: `${shape} has an area of ${base} square inches. It is enlarged so that ${how} multiplied by ${num(k)}. What is the area of the enlarged figure, in square inches?`,
        answer: num(ans),
        wrong: [num(base * k), num(base * k ** 3), num(base * 2 * k)],
        steps: [`Lengths scale by ${num(k)}, so area scales by ${num(k)}² = ${num(k * k)}.`, `${base} × ${num(k * k)} = ${num(ans)}.`],
        pitfalls: [`Multiplying the area by ${num(k)} as if area grew at the same rate as length.`],
      };
    },
  },
  {
    id: 'sat-volume-inscribed',
    exam: 'sat',
    topicId: 'sat-area-volume',
    difficulty: 3,
    build: (r) => {
      const m = r.int(1, 6);
      const e = 2 * m;
      const cube = e ** 3;
      const box = r.pick(['cube-shaped box', 'cube-shaped crate', 'cube-shaped mold']);
      if (r.next() < 0.5) {
        const s = new Frac(4 * m ** 3, 3);
        return {
          prompt: `A sphere fits exactly inside a ${box} with edge length ${e} centimeters, touching all six faces. What is the volume of the space inside the box that is not filled by the sphere, in cubic centimeters?`,
          answer: `${cube} − ${piStr(s)}`,
          wrong: [`${cube} − ${piStr(new Frac(4 * cube, 3))}`, `${cube} − ${piStr(new Frac(4 * m * m))}`, `${cube} − ${piStr(new Frac(4 * m ** 3))}`],
          steps: [`Cube volume: ${e}³ = ${cube}.`, `The sphere's diameter is ${e}, so r = ${m} and V = (4/3)π(${m})³ = ${piStr(s)}.`, `Empty space: ${cube} − ${piStr(s)}.`],
          pitfalls: [`Using the edge ${e} as the sphere's radius instead of ${m}.`],
        };
      }
      const cyl = new Frac(m * m * e);
      return {
        prompt: `A cylinder fits exactly inside a ${box} with edge length ${e} centimeters: its bases touch the top and bottom faces and its side touches the other four faces. What is the volume of the space inside the box that is not filled by the cylinder, in cubic centimeters?`,
        answer: `${cube} − ${piStr(cyl)}`,
        wrong: [`${cube} − ${piStr(new Frac(cube))}`, `${cube} − ${piStr(new Frac(m * m * e, 3))}`, piStr(cyl)],
        steps: [`Cube volume: ${e}³ = ${cube}.`, `The cylinder has r = ${m} and h = ${e}, so V = π(${m})²(${e}) = ${piStr(cyl)}.`, `Empty space: ${cube} − ${piStr(cyl)}.`],
        pitfalls: [`Using the edge ${e} as the radius, which gives ${piStr(new Frac(cube))} for the cylinder.`, `Giving the cylinder's volume ${piStr(cyl)} instead of the space left over.`],
      };
    },
  },
  {
    id: 'sat-trig-ratio-sides',
    exam: 'sat',
    topicId: 'sat-trigonometry',
    difficulty: 1,
    build: (r) => {
      const [a0, b0, c0] = r.pick(TRIPLES);
      const [p, q] = r.next() < 0.5 ? [a0, b0] : [b0, a0];
      const s = r.int(1, 4);
      const [opp, adj, hyp] = [p * s, q * s, c0 * s];
      const fn = r.pick(['sin', 'cos', 'tan']);
      const val = { sin: new Frac(opp, hyp), cos: new Frac(adj, hyp), tan: new Frac(opp, adj) };
      const others = (['sin', 'cos', 'tan'] as const).filter((f) => f !== fn).map((f) => val[f].toString());
      const ans = val[fn as 'sin' | 'cos' | 'tan'];
      return {
        prompt: `In right triangle ABC, angle C is the right angle, BC = ${opp}, AC = ${adj} and AB = ${hyp}. What is the value of ${fn} A?`,
        answer: ans.toString(),
        wrong: [...others, new Frac(ans.d, ans.n).toString()],
        steps: [
          `From angle A: the opposite side is BC = ${opp}, the adjacent side is AC = ${adj}, and the hypotenuse is AB = ${hyp}.`,
          fn === 'sin' ? `sin A = opposite/hypotenuse = ${eq(opp, hyp)}.` : fn === 'cos' ? `cos A = adjacent/hypotenuse = ${eq(adj, hyp)}.` : `tan A = opposite/adjacent = ${eq(opp, adj)}.`,
        ],
        pitfalls: [`Using the sides as seen from angle B, which swaps BC = ${opp} and AC = ${adj}.`],
      };
    },
  },
  {
    id: 'sat-trig-radians',
    exam: 'sat',
    topicId: 'sat-trigonometry',
    difficulty: 1,
    build: (r) => {
      const deg = r.pick([15, 20, 30, 36, 40, 45, 60, 72, 90, 120, 135, 150, 210, 225, 240, 270, 300, 315, 330, 450, 540]);
      const rad = new Frac(deg, 180);
      if (r.next() < 0.5) {
        return {
          prompt: `What is the measure of an angle of ${deg}° in radians?`,
          answer: piStr(rad),
          wrong: [piStr(new Frac(deg, 360)), piStr(new Frac(180, deg)), piStr(new Frac(deg, 90))],
          steps: [`Multiply by π/180: ${deg} × π/180.`, `${deg}/180 = ${rad}, so the angle is ${piStr(rad)} radians.`],
          pitfalls: [`Dividing ${deg} by 360 instead of 180. A full turn is 2π, so 180° = π.`],
        };
      }
      return {
        prompt: `An angle measures ${piStr(rad)} radians. What is its measure in degrees?`,
        answer: `${deg}°`,
        wrong: [`${num(deg * 2)}°`, `${num(deg / 2)}°`, `${num(Math.abs(180 - deg) || 90)}°`],
        steps: [`Multiply by 180/π: ${piStr(rad)} × 180/π.`, `${rad} × 180 = ${deg}, so the angle is ${deg}°.`],
        pitfalls: [`Treating π as 360° instead of 180°, which doubles the answer to ${deg * 2}°.`],
      };
    },
  },
  {
    id: 'sat-trig-complementary',
    exam: 'sat',
    topicId: 'sat-trigonometry',
    difficulty: 2,
    build: (r) => {
      const x = r.int(4, 15);
      const m = r.int(1, 4);
      const n = r.int(1, 4);
      let A = r.int(20, 70);
      let c1 = A - m * x;
      let c2 = 90 - A - n * x;
      while (c1 === 0 || c2 === 0) {
        A += 1;
        c1 = A - m * x;
        c2 = 90 - A - n * x;
      }
      const B = 90 - A;
      const lhs = `(${poly([m, c1])})°`;
      const rhs = `(${poly([n, c2])})°`;
      const w1 = new Frac(180 - c1 - c2, m + n);
      const w2 = m === n ? new Frac(90 + c1 + c2, m + n) : new Frac(c2 - c1, m - n);
      const w3 = new Frac(90, m + n);
      return {
        prompt: `In a right triangle, the two acute angles measure ${lhs} and ${rhs}, so sin${lhs} = cos${rhs}. What is the value of x?`,
        answer: num(x),
        wrong: [w1.toString(), w2.toString(), w3.toString()],
        steps: [
          'sin θ = cos(90° − θ), so the two angles add up to 90°.',
          `${poly([m, c1])} + ${poly([n, c2])} = 90 gives ${m + n}x${c1 + c2 ? ` ${signed(c1 + c2)}` : ''} = 90.`,
          `${m + n}x = ${90 - c1 - c2}, so x = ${x}. The angles are ${A}° and ${B}°.`,
        ],
        pitfalls: [`Setting the angles equal to each other instead of adding them to 90°.`, `Using 180° as the sum, which gives x = ${w1}.`],
      };
    },
  },
  {
    id: 'sat-trig-other-ratio',
    exam: 'sat',
    topicId: 'sat-trigonometry',
    difficulty: 2,
    build: (r) => {
      const [a0, b0, c] = r.pick(TRIPLES);
      const [o, a] = r.next() < 0.5 ? [a0, b0] : [b0, a0];
      const val = { sin: new Frac(o, c), cos: new Frac(a, c), tan: new Frac(o, a) };
      const given = r.pick(['sin', 'cos', 'tan'] as const);
      const ask = r.pick((['sin', 'cos', 'tan'] as const).filter((f) => f !== given));
      const third = (['sin', 'cos', 'tan'] as const).find((f) => f !== given && f !== ask)!;
      const ans = val[ask];
      const missing = given === 'sin' ? a : given === 'cos' ? o : c;
      const missingName = given === 'sin' ? 'adjacent side' : given === 'cos' ? 'opposite side' : 'hypotenuse';
      return {
        prompt: `For an acute angle θ in a right triangle, ${given} θ = ${val[given]}. What is the value of ${ask} θ?`,
        answer: ans.toString(),
        wrong: [new Frac(ans.d, ans.n).toString(), val[third].toString(), val[given].toString()],
        steps: [
          `Draw a right triangle with sides matching ${given} θ = ${val[given]}.`,
          `Find the missing ${missingName} with the Pythagorean theorem: it is ${missing}, since ${o}² + ${a}² = ${c}².`,
          `${ask} θ = ${ans}.`,
        ],
        pitfalls: [`Writing the ratio upside down as ${new Frac(ans.d, ans.n)}.`, `Using the wrong side for ${ask} θ. With legs ${o} and ${a} and hypotenuse ${c}, the side opposite θ is ${o}.`],
      };
    },
  },
  {
    id: 'sat-trig-side-from-ratio',
    exam: 'sat',
    topicId: 'sat-trigonometry',
    difficulty: 3,
    build: (r) => {
      const [a0, b0, c0] = r.pick(TRIPLES);
      const [p, q] = r.next() < 0.5 ? [a0, b0] : [b0, a0];
      const s = r.int(2, 5);
      const side = { BC: p * s, AC: q * s, AB: c0 * s };
      const fn = r.pick(['sin', 'cos', 'tan'] as const);
      const pair: Record<string, ['BC' | 'AC' | 'AB', 'BC' | 'AC' | 'AB']> = { sin: ['BC', 'AB'], cos: ['AC', 'AB'], tan: ['BC', 'AC'] };
      const ratio = { sin: new Frac(p, c0), cos: new Frac(q, c0), tan: new Frac(p, q) }[fn];
      const [n1, n2] = pair[fn];
      const givenName = r.next() < 0.5 ? n1 : n2;
      const partner = givenName === n1 ? n2 : n1;
      const askName = (['BC', 'AC', 'AB'] as const).find((x) => x !== n1 && x !== n2)!;
      const ans = side[askName];
      const unscaled = { BC: p, AC: q, AB: c0 }[askName];
      return {
        prompt: `In right triangle ABC, angle C is the right angle and ${fn} A = ${ratio}. If ${givenName} = ${side[givenName]}, what is the length of ${askName}?`,
        answer: String(ans),
        wrong: [String(side[partner]), String(unscaled), String(askName === 'AB' ? side.BC + side.AC : Math.abs(side.AB - side[givenName === 'AB' ? partner : givenName]))],
        steps: [
          `${fn} A = ${ratio} means ${n1} : ${n2} = ${ratio.n} : ${ratio.d}. With ${givenName} = ${side[givenName]}, the scale is ${s}, so ${partner} = ${side[partner]}.`,
          `The sides are ${p}, ${q} and ${c0}, each multiplied by ${s}.`,
          `So ${askName} = ${unscaled} × ${s} = ${ans}.`,
        ],
        pitfalls: [`Stopping at ${partner} = ${side[partner]}, the other side in the ratio, when the question asks for ${askName}.`, `Giving ${unscaled} from the basic triangle with sides ${p}, ${q} and ${c0} without multiplying by ${s}.`],
      };
    },
  },
  {
    id: 'sat-nl-exponential-value',
    exam: 'sat',
    topicId: 'sat-nonlinear-functions',
    difficulty: 1,
    build: (r) => {
      if (r.next() < 0.6) {
        const a = r.int(2, 9);
        const b = r.pick([2, 3, 4, 5]);
        const k = b === 5 ? r.int(2, 3) : r.int(2, 4);
        const ans = a * b ** k;
        return {
          prompt: `The function f is defined by f(x) = ${a}(${b})ˣ. What is the value of f(${k})?`,
          answer: num(ans),
          wrong: [num((a * b) ** k), num(a * b * k), num(a * b ** (k - 1))],
          steps: [`Substitute x = ${k}: f(${k}) = ${a}(${b})^${k}.`, `${b}^${k} = ${b ** k}, so f(${k}) = ${a} × ${b ** k} = ${ans}.`],
          pitfalls: [`Multiplying ${a} × ${b} first and raising ${a * b} to the power ${k}.`, `Computing ${b} × ${k} instead of ${b}^${k}.`],
        };
      }
      const k = r.int(2, 5);
      const mm = r.int(2, 9);
      const A = mm * 2 ** k;
      return {
        prompt: `The function g is defined by g(t) = ${A}(1/2)ᵗ. What is the value of g(${k})?`,
        answer: num(mm),
        wrong: [num(A / (2 * k)), num(A * 2 ** k), num(A - 2 * k), num(A / 2), num(mm * 2), num(A / 2 ** (k + 1))],
        steps: [`Substitute t = ${k}: g(${k}) = ${A}(1/2)^${k}.`, `(1/2)^${k} = 1/${2 ** k}, so g(${k}) = ${A} ÷ ${2 ** k} = ${mm}.`],
        pitfalls: [`Dividing ${A} by 2 × ${k} = ${2 * k} instead of by 2^${k} = ${2 ** k}.`],
      };
    },
  },
  {
    id: 'sat-nl-composition',
    exam: 'sat',
    topicId: 'sat-nonlinear-functions',
    difficulty: 2,
    build: (r) => {
      const a = r.nonZero(-5, 5);
      const b = r.int(-9, 9);
      const p = r.pick([1, 2, -1, 3]);
      const q = r.int(-8, 8);
      const k = r.nonZero(-4, 4);
      const g = (x: number) => p * x * x + q;
      const f = (x: number) => a * x + b;
      const ans = f(g(k));
      const flipNames = r.next() < 0.5;
      const [F, G] = flipNames ? ['h', 'k'] : ['f', 'g'];
      return {
        prompt: `The functions ${F} and ${G} are defined by ${F}(x) = ${poly([a, b])} and ${G}(x) = ${poly([p, 0, q])}. What is the value of ${F}(${G}(${k}))?`,
        answer: num(ans),
        wrong: [num(g(f(k))), num(f(k) * g(k)), num(a * p * k * k + q + b)],
        steps: [
          `Work from the inside out: ${G}(${k}) = ${p === 1 ? '' : p === -1 ? '−' : p}(${num(k)})²${q ? ` ${signed(q)}` : ''} = ${num(g(k))}.`,
          `Then ${F}(${num(g(k))}) = ${paren(a)}·${paren(g(k))}${b ? ` ${signed(b)}` : ''} = ${num(ans)}.`,
        ],
        pitfalls: [`Applying ${F} first and then ${G}, which gives ${G}(${F}(${k})) = ${num(g(f(k)))}.`, `Multiplying ${F}(${k}) by ${G}(${k}) instead of substituting.`],
      };
    },
  },
  {
    id: 'sat-nl-absolute-value',
    exam: 'sat',
    topicId: 'sat-nonlinear-functions',
    difficulty: 2,
    build: (r) => {
      const h = r.nonZero(-9, 9);
      const d = r.int(1, 9);
      const q = r.int(-8, 8);
      const R = d + q;
      const lhs = `|x ${signed(-h)}|${q ? ` ${signed(q)}` : ''}`;
      const ask = r.int(0, 2);
      const big = h + d;
      const small = h - d;
      const ans = ask === 0 ? big + small : ask === 1 ? big : big * small;
      const wrong =
        ask === 0
          ? [num(-2 * h), num(big), num(2 * d)]
          : ask === 1
            ? [num(h + R), num(-h + d), num(small)]
            : [num(-(big * small)), num(h * h + d * d), num(big)];
      return {
        prompt: `What is the ${ask === 0 ? 'sum of all solutions' : ask === 1 ? 'greatest solution' : 'product of all solutions'} of the equation ${lhs} = ${R}?`,
        answer: num(ans),
        wrong,
        steps: [
          q ? `Isolate the absolute value: |x ${signed(-h)}| = ${R} ${signed(-q)} = ${d}.` : `The absolute value is already isolated: |x ${signed(-h)}| = ${d}.`,
          `So x ${signed(-h)} = ${d} or x ${signed(-h)} = −${d}, giving x = ${big} or x = ${small}.`,
          ask === 0 ? `Sum: ${big} + ${paren(small)} = ${ans}.` : ask === 1 ? `The greater solution is ${big}.` : `Product: ${big} × ${paren(small)} = ${num(ans)}.`,
        ],
        pitfalls: [
          q ? `Splitting into ± cases before subtracting ${num(q)}, which uses ${R} instead of ${d}.` : `Solving only x ${signed(-h)} = ${d} and missing x = ${small}.`,
          `Reading |x ${signed(-h)}| as centered at ${num(-h)} instead of ${num(h)}.`,
        ],
      };
    },
  },
  {
    id: 'sat-nl-polynomial-zeros',
    exam: 'sat',
    topicId: 'sat-nonlinear-functions',
    difficulty: 2,
    build: (r) => {
      const p = r.int(1, 9);
      const q = r.int(1, 9);
      const m = r.int(2, 5);
      let n = r.int(1, 9);
      while (n % m === 0 || new Frac(n, m).d !== m) n += 1;
      const zeros = [new Frac(p), new Frac(-q), new Frac(n, m)];
      const pick = r.int(0, 2);
      const ans = zeros[pick];
      const isZero = (f: Frac) => zeros.some((z) => z.n === f.n && z.d === f.d);
      const cands = [new Frac(-p), new Frac(q), new Frac(-n, m), new Frac(m, n), new Frac(n), new Frac(-n), new Frac(p + q), new Frac(-(p + q)), new Frac(n + 1, m)].filter((f) => !isZero(f));
      const uniq: string[] = [];
      for (const f of cands) if (!uniq.includes(f.toString())) uniq.push(f.toString());
      return {
        prompt: `The function f is defined by f(x) = (x − ${p})(x + ${q})(${m}x − ${n}). Which of the following is a zero of f?`,
        answer: ans.toString(),
        wrong: r.shuffle(uniq).slice(0, 3),
        steps: [
          'A product is zero when one of its factors is zero.',
          `x − ${p} = 0 gives x = ${p}; x + ${q} = 0 gives x = −${q}; ${m}x − ${n} = 0 gives x = ${new Frac(n, m)}.`,
          `Of the choices, only ${ans} is one of these zeros.`,
        ],
        pitfalls: [`Reading x + ${q} as a zero at ${q} instead of −${q}.`, `Taking ${n} or ${new Frac(m, n)} from ${m}x − ${n} instead of solving it to get ${new Frac(n, m)}.`],
      };
    },
  },
  {
    id: 'sat-nl-shifted-vertex',
    exam: 'sat',
    topicId: 'sat-nonlinear-functions',
    difficulty: 3,
    build: (r) => {
      const h = r.nonZero(-6, 6);
      const k = r.int(-9, 9);
      const b = -2 * h;
      const c = h * h + k;
      const a = r.nonZero(-5, 5);
      const e = r.nonZero(-6, 6);
      const vx = h - a;
      const vy = k + e;
      return {
        prompt: `The function f is defined by f(x) = ${poly([1, b, c])}. The function g is defined by g(x) = f(x ${signed(a)}) ${signed(e)}. What are the coordinates of the vertex of the graph of y = g(x)?`,
        answer: pt(vx, vy),
        wrong: [pt(h + a, vy), pt(vx, k - e), pt(h, k)],
        steps: [
          `Complete the square: f(x) = (x ${signed(-h)})²${k ? ` ${signed(k)}` : ''}, so the vertex of f is ${pt(h, k)}.`,
          `f(x ${signed(a)}) shifts the graph ${a > 0 ? 'left' : 'right'} ${Math.abs(a)}, and ${signed(e)} shifts it ${e > 0 ? 'up' : 'down'} ${Math.abs(e)}.`,
          `New vertex: (${h} ${signed(-a)}, ${k} ${signed(e)}) = ${pt(vx, vy)}.`,
        ],
        pitfalls: [`Shifting ${a > 0 ? 'right' : 'left'} for x ${signed(a)}. A change inside the function moves the graph the opposite way, to x = ${num(vx)}.`],
      };
    },
  },
  {
    id: 'sat-data-median',
    exam: 'sat',
    topicId: 'sat-data',
    difficulty: 1,
    build: (r) => {
      const n = r.int(7, 10);
      const [what, when, lo, hi] = r.pick([
        ['the number of minutes Ana spent on homework', 'on each of', 15, 90],
        ['the points a basketball team scored', 'in each of', 40, 110],
        ['the number of books a shop sold', 'on each of', 10, 60],
        ['the number of pages Theo read', 'on each of', 5, 45],
      ] as const);
      const span = what.includes('team') ? 'games' : what.includes('Theo') ? 'nights' : 'days';
      const vals = Array.from({ length: n }, () => r.int(lo, hi));
      const med = median(vals);
      const mid = n % 2 ? vals[(n - 1) / 2] : (vals[n / 2 - 1] + vals[n / 2]) / 2;
      const mean = vals.reduce((s, v) => s + v, 0) / n;
      const s = vals.slice().sort((x, y) => x - y);
      return {
        prompt: `A list shows ${what} ${when} ${n} ${span}: ${vals.join(', ')}. What is the median of these data?`,
        answer: num(med),
        wrong: [num(mid), num(mean), num((s[0] + s[n - 1]) / 2)],
        steps: [
          `Sort the values: ${s.join(', ')}.`,
          n % 2 ? `With ${n} values, the median is the ${(n + 1) / 2}th value: ${num(med)}.` : `With ${n} values, the median is the mean of the ${n / 2}th and ${n / 2 + 1}th values: (${s[n / 2 - 1]} + ${s[n / 2]}) ÷ 2 = ${num(med)}.`,
        ],
        pitfalls: [`Taking the middle of the unsorted list, ${num(mid)}, without sorting first.`],
      };
    },
  },
  {
    id: 'sat-data-range',
    exam: 'sat',
    topicId: 'sat-data',
    difficulty: 1,
    build: (r) => {
      const n = r.int(6, 8);
      const vals = Array.from({ length: n }, () => r.int(-12, 20));
      vals[r.int(0, n - 1)] = r.int(-12, -1);
      const city = r.pick(['Duluth', 'Fargo', 'Bismarck', 'Anchorage', 'Billings']);
      const max = Math.max(...vals);
      const min = Math.min(...vals);
      return {
        prompt: `The daily low temperatures, in degrees Fahrenheit, in ${city} over ${n} days were ${vals.map(num).join(', ')}. What is the range of these temperatures?`,
        answer: num(max - min),
        wrong: [num(max + min), num(vals[n - 1] - vals[0]), num(max)],
        steps: [`Highest value: ${num(max)}. Lowest value: ${num(min)}.`, `Range = ${num(max)} − ${paren(min)} = ${num(max - min)}.`],
        pitfalls: [`Subtracting ${Math.abs(min)} instead of ${num(min)}, which gives ${num(max + min)}. Subtracting a negative adds.`, 'Using the last value minus the first value instead of the largest minus the smallest.'],
      };
    },
  },
  {
    id: 'sat-data-frequency-table',
    exam: 'sat',
    topicId: 'sat-data',
    difficulty: 2,
    build: (r) => {
      const [label, who] = r.pick([
        ['Number of siblings', 'students'],
        ['Goals scored in a game', 'games'],
        ['Books read last month', 'club members'],
        ['Pets at home', 'families'],
      ]);
      const s0 = r.int(0, 2);
      const values = [0, 1, 2, 3, 4].map((v) => v + s0);
      const freq = values.map(() => r.int(1, 9));
      const list: number[] = [];
      values.forEach((v, i) => {
        for (let j = 0; j < freq[i]; j++) list.push(v);
      });
      const n = list.length;
      const med = median(list);
      const fmed = median(freq);
      const mean = list.reduce((s, v) => s + v, 0) / n;
      const cum: number[] = [];
      freq.reduce((s, f, i) => ((cum[i] = s + f), s + f), 0);
      return {
        prompt: `A frequency table shows data for ${n} ${who}. ${label}: ${values.join(', ')}. Frequency: ${freq.join(', ')}. What is the median value of ${label.toLowerCase()}?`,
        answer: num(med),
        wrong: [num(values[2]), num(fmed), num(mean), num(values[freq.indexOf(Math.max(...freq))]), num(n / 2), num(values[1]), num(values[3])],
        steps: [
          `There are ${freq.join(' + ')} = ${n} data values.`,
          n % 2 ? `The median is the ${(n + 1) / 2}th value in order.` : `The median is the mean of the ${n / 2}th and ${n / 2 + 1}th values in order.`,
          `Running totals are ${cum.join(', ')}, so the median is ${num(med)}.`,
        ],
        pitfalls: [`Taking the median of the frequencies (${num(fmed)}) instead of the data values.`, `Picking the middle row of the table, ${values[2]}, without using the frequencies.`],
      };
    },
  },
  {
    id: 'sat-data-two-way-percent',
    exam: 'sat',
    topicId: 'sat-data',
    difficulty: 2,
    build: (r) => {
      const [[g1, g2], [o1, o2], who] = r.pick([
        [['Juniors', 'Seniors'], ['bus', 'car'], 'students surveyed about how they get to school'],
        [['Weekday visitors', 'Weekend visitors'], ['bought a ticket online', 'bought at the door'], 'museum visitors'],
        [['Dogs', 'Cats'], ['vaccinated', 'not yet vaccinated'], 'animals at a shelter'],
        [['Day campers', 'Overnight campers'], ['chose swimming', 'chose hiking'], 'campers'],
      ]);
      const R1 = r.pick([20, 40, 60, 80]);
      const pct = 5 * r.int(2, 18);
      const a = (R1 * pct) / 100;
      const R2 = r.int(15, 60);
      const c = r.int(1, R2 - 1);
      const total = R1 + R2;
      return {
        prompt: `A table summarizes ${total} ${who}. ${g1}: ${o1} ${a}, ${o2} ${R1 - a}. ${g2}: ${o1} ${c}, ${o2} ${R2 - c}. What percent of the ${g1.toLowerCase()} are in the "${o1}" group?`,
        answer: `${pct}%`,
        wrong: [`${Math.round((a / (a + c)) * 100)}%`, `${Math.round((a / total) * 100)}%`, `${100 - pct}%`],
        steps: [`The ${g1.toLowerCase()} row total is ${a} + ${R1 - a} = ${R1}.`, `${a} ÷ ${R1} = ${num(pct / 100)}.`, `${num(pct / 100)} × 100 = ${pct}%.`],
        pitfalls: [`Dividing ${a} by the "${o1}" column total ${a + c} instead of the ${g1.toLowerCase()} row total ${R1}.`, `Dividing by all ${total} instead of only the ${g1.toLowerCase()}.`],
      };
    },
  },
  {
    id: 'sat-data-outlier-effect',
    exam: 'sat',
    topicId: 'sat-data',
    difficulty: 3,
    build: (r) => {
      const n = r.pick([5, 7]);
      const vals: number[] = [];
      let v = r.int(8, 20);
      for (let i = 0; i < n; i++) {
        vals.push(v);
        v += r.int(1, 6);
      }
      const S0 = vals.reduce((s, x) => s + x, 0);
      vals[0] -= S0 % n;
      const S = S0 - (S0 % n);
      const oldMean = S / n;
      const base = vals[n - 1] * 3 + r.int(0, 20);
      const X = base + ((n + 1 - ((S + base) % (n + 1))) % (n + 1));
      const newMean = (S + X) / (n + 1);
      const mid = (n - 1) / 2;
      const oldMed = vals[mid];
      const newMed = (vals[mid] + vals[mid + 1]) / 2;
      const dm = newMean - oldMean;
      const dmed = newMed - oldMed;
      const say = (a: number, b: number) => `The mean increases by ${num(a)}, and the median increases by ${num(b)}.`;
      const what = r.pick(['commute times, in minutes,', 'wait times, in minutes,', 'daily step counts, in hundreds,', 'weekly sales totals, in dollars,']);
      return {
        prompt: `A data set of ${n} ${what} is ${vals.join(', ')}. The value ${X} is added to the data set. How do the mean and median change?`,
        answer: say(dm, dmed),
        wrong: [say(dmed, dm), `The mean increases by ${num(dm)}, and the median does not change.`, say(dm, dm)],
        steps: [
          `Old mean: ${S} ÷ ${n} = ${num(oldMean)}. New mean: ${S + X} ÷ ${n + 1} = ${num(newMean)}, an increase of ${num(dm)}.`,
          `Old median: ${oldMed}, the middle of ${n} values.`,
          `New median: with ${n + 1} values, (${vals[mid]} + ${vals[mid + 1]}) ÷ 2 = ${num(newMed)}, an increase of ${num(dmed)}.`,
        ],
        pitfalls: [`Assuming the median jumps as much as the mean. The outlier ${X} only shifts the median to the average of ${vals[mid]} and ${vals[mid + 1]}.`, 'Thinking the median cannot change at all when a value is added.'],
      };
    },
  },
];
