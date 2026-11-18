import { EXAMS, generate, generateSet, placementTest, TEMPLATES, TOPICS } from '../src/engine';

const SEEDS = Number(process.env.SEEDS ?? 3000);
const bad = /NaN|undefined|Infinity|null|\[object/;
let failures = 0;

function fail(msg: string) {
  failures++;
  if (failures < 40) console.error('FAIL', msg);
}

for (const t of TEMPLATES) {
  if (!TOPICS.some((tp) => tp.id === t.topicId && tp.exam === t.exam)) fail(`${t.id}: unknown topic ${t.topicId}`);
  for (let seed = 1; seed <= SEEDS; seed++) {
    let p;
    try {
      p = generate(t.id, seed);
    } catch (e) {
      fail(`${t.id}#${seed}: threw ${(e as Error).message}`);
      continue;
    }
    if (p.choices.length !== 4) fail(`${t.id}#${seed}: ${p.choices.length} choices`);
    if (new Set(p.choices).size !== 4) fail(`${t.id}#${seed}: duplicate choices ${p.choices.join(' | ')}`);
    if (p.choices[p.answerIndex] !== p.answer) fail(`${t.id}#${seed}: answerIndex mismatch`);
    const text = [p.prompt, ...p.choices, ...p.steps, ...p.pitfalls].join(' ');
    if (bad.test(text)) fail(`${t.id}#${seed}: bad token in "${text.slice(0, 200)}"`);
    if (p.choices.some((c) => !c.trim())) fail(`${t.id}#${seed}: empty choice`);
    const again = generate(t.id, seed);
    if (again.prompt !== p.prompt || again.answer !== p.answer) fail(`${t.id}#${seed}: not deterministic`);
  }
}

for (const exam of EXAMS) {
  for (let s = 1; s < 200; s++) {
    if (placementTest(exam.id, s).length !== 5) fail(`placement ${exam.id}`);
    if (generateSet({ exam: exam.id, count: 10, seed: s }).length !== 10) fail(`set ${exam.id}`);
  }
}

if (process.argv.includes('--sample')) {
  for (const t of TEMPLATES) {
    const p = generate(t.id, 7);
    console.log(`\n[${t.id}] ${p.prompt}\n  ✓ ${p.answer}   ✗ ${p.choices.filter((c) => c !== p.answer).join(' | ')}\n  ${p.steps.join('\n  ')}`);
  }
}

console.log(`${TEMPLATES.length} templates × ${SEEDS} seeds, ${TOPICS.length} topics: ${failures} failures`);
process.exit(failures ? 1 : 0);
