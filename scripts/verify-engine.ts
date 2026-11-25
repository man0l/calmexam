import { EXAMS, generate, generateSet, placementTest, TEMPLATES, templatesMatching, TOPICS } from '../src/engine';

const SEEDS = Number(process.env.SEEDS ?? 3000);
const ONLY = (process.env.TOPICS ?? '').split(',').filter(Boolean);
const MIN_TEMPLATES = Number(process.env.MIN_TEMPLATES ?? 4);
const bad = /NaN|undefined|Infinity|null|\[object/;
let failures = 0;

function fail(msg: string) {
  failures++;
  if (failures < 40) console.error('FAIL', msg);
}

const ids = new Set<string>();
for (const t of TEMPLATES) {
  if (ids.has(t.id)) fail(`duplicate template id ${t.id}`);
  ids.add(t.id);
}

const topics = TOPICS.filter((tp) => !ONLY.length || ONLY.includes(tp.id));
const templates = TEMPLATES.filter((t) => !ONLY.length || ONLY.includes(t.topicId));

for (const t of templates) {
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

for (const tp of topics) {
  const count = templatesMatching({ exam: tp.exam, topicId: tp.id }).length;
  if (count < MIN_TEMPLATES) fail(`${tp.id}: only ${count} templates (need ${MIN_TEMPLATES})`);
  for (let s = 1; s < 60; s++) {
    const set = generateSet({ exam: tp.exam, topicId: tp.id, count: 15, seed: s });
    if (set.length !== 15) fail(`${tp.id} set#${s}: ${set.length} problems`);
    if (new Set(set.map((p) => p.prompt)).size !== set.length) fail(`${tp.id} set#${s}: duplicate prompts`);
  }
}

for (const exam of EXAMS) {
  if (ONLY.length) break;
  for (const difficulty of [[1], [3], [2, 3]] as const) {
    const set = generateSet({ exam: exam.id, count: 15, seed: 5, difficulty: [...difficulty] });
    if (set.length !== 15) fail(`set ${exam.id} difficulty ${difficulty.join('')}: ${set.length}`);
  }
  for (let s = 1; s < 200; s++) {
    if (placementTest(exam.id, s).length !== 5) fail(`placement ${exam.id}`);
    if (generateSet({ exam: exam.id, count: 10, seed: s }).length !== 10) fail(`set ${exam.id}`);
  }
}

if (process.argv.includes('--sample')) {
  for (const t of templates) {
    const p = generate(t.id, 7);
    console.log(`\n[${t.id}] ${p.prompt}\n  ✓ ${p.answer}   ✗ ${p.choices.filter((c) => c !== p.answer).join(' | ')}\n  ${p.steps.join('\n  ')}`);
  }
}

console.log(`${templates.length} templates × ${SEEDS} seeds, ${topics.length} topics: ${failures} failures`);
process.exit(failures ? 1 : 0);
