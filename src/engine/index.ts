import { buildProblem, Exam, ExamId, hash, Problem, Rng, Template, Topic } from './core';
import { ALEVEL_TEMPLATES } from './templates/alevel';
import { CALC_TEMPLATES } from './templates/calc';
import { SAT_TEMPLATES } from './templates/sat';

export * from './core';

export const EXAMS: Exam[] = [
  {
    id: 'sat',
    name: 'SAT Math',
    shortName: 'SAT',
    region: 'US',
    scale: { min: 200, max: 800, label: 'SAT Math score' },
    hubSlug: 'sat-math-practice-test',
    hubKeyword: 'SAT Math practice test',
  },
  {
    id: 'ap-calc-ab',
    name: 'AP Calculus AB',
    shortName: 'AP Calc AB',
    region: 'US',
    scale: { min: 1, max: 5, label: 'AP score' },
    hubSlug: 'ap-calculus-practice-test',
    hubKeyword: 'AP Calculus practice test',
  },
  {
    id: 'a-level',
    name: 'A-Level Maths',
    shortName: 'A-Level',
    region: 'UK',
    scale: { min: 0, max: 6, label: 'A-Level grade (E–A*)' },
    hubSlug: 'a-level-maths-practice-questions',
    hubKeyword: 'A-Level Maths practice questions',
  },
];

export const TOPICS: Topic[] = [
  { id: 'sat-linear-equations', exam: 'sat', name: 'Linear equations', slug: 'linear-equations', blurb: 'Solve one-variable equations and turn word problems into equations.' },
  { id: 'sat-linear-functions', exam: 'sat', name: 'Linear functions & slope', slug: 'linear-functions', blurb: 'Slope between two points and evaluating functions.' },
  { id: 'sat-systems', exam: 'sat', name: 'Systems of equations', slug: 'systems-of-equations', blurb: 'Two equations, two unknowns: elimination and substitution.' },
  { id: 'sat-quadratics', exam: 'sat', name: 'Quadratics', slug: 'quadratics', blurb: 'Factoring, roots and the vertex of a parabola.' },
  { id: 'sat-percentages', exam: 'sat', name: 'Percentages', slug: 'percentages', blurb: 'Percent of a number and successive percent changes.' },
  { id: 'sat-exponentials', exam: 'sat', name: 'Exponential growth', slug: 'exponential-growth', blurb: 'Doubling, growth and decay models.' },
  { id: 'sat-circles', exam: 'sat', name: 'Circles', slug: 'circles', blurb: 'Circle equations, radius and sector area.' },
  { id: 'sat-geometry', exam: 'sat', name: 'Right triangles', slug: 'right-triangles', blurb: 'The Pythagorean theorem and special triples.' },
  { id: 'sat-statistics', exam: 'sat', name: 'Mean & statistics', slug: 'mean-and-statistics', blurb: 'Averages, totals and missing values.' },
  { id: 'calc-limits', exam: 'ap-calc-ab', name: 'Limits', slug: 'limits', blurb: 'Removable discontinuities and limits by factoring.' },
  { id: 'calc-derivatives', exam: 'ap-calc-ab', name: 'Derivatives', slug: 'derivatives', blurb: 'Power, product, chain and trig derivative rules.' },
  { id: 'calc-applications', exam: 'ap-calc-ab', name: 'Applications of derivatives', slug: 'applications-of-derivatives', blurb: 'Tangent lines and local extrema.' },
  { id: 'calc-integrals', exam: 'ap-calc-ab', name: 'Integrals', slug: 'integrals', blurb: 'Definite integrals, average value and the Fundamental Theorem.' },
  { id: 'al-algebra', exam: 'a-level', name: 'Algebra', slug: 'algebra', blurb: 'Binomial expansion and the discriminant.' },
  { id: 'al-differentiation', exam: 'a-level', name: 'Differentiation', slug: 'differentiation', blurb: 'Stationary points of curves.' },
  { id: 'al-integration', exam: 'a-level', name: 'Integration', slug: 'integration', blurb: 'Definite integrals with negative powers.' },
  { id: 'al-exponentials-logs', exam: 'a-level', name: 'Exponentials & logarithms', slug: 'logarithms', blurb: 'Laws of logs and solving log equations.' },
  { id: 'al-sequences', exam: 'a-level', name: 'Sequences & series', slug: 'sequences-and-series', blurb: 'Arithmetic sums and geometric sums to infinity.' },
  { id: 'al-trigonometry', exam: 'a-level', name: 'Trigonometry', slug: 'trigonometry', blurb: 'Solving trig equations in a given interval.' },
  { id: 'al-coordinate-geometry', exam: 'a-level', name: 'Coordinate geometry', slug: 'coordinate-geometry', blurb: 'Perpendicular gradients and circle equations.' },
  { id: 'al-mechanics', exam: 'a-level', name: 'Mechanics (SUVAT)', slug: 'mechanics', blurb: 'Constant acceleration equations.' },
];

export const TEMPLATES: Template[] = [...SAT_TEMPLATES, ...CALC_TEMPLATES, ...ALEVEL_TEMPLATES];

export function getExam(id: ExamId): Exam {
  return EXAMS.find((e) => e.id === id) as Exam;
}

export function topicsFor(exam: ExamId): Topic[] {
  return TOPICS.filter((t) => t.exam === exam);
}

export function getTopic(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}

export function templatesFor(exam: ExamId, topicId?: string): Template[] {
  return TEMPLATES.filter((t) => t.exam === exam && (!topicId || t.topicId === topicId));
}

export function generate(templateId: string, seed: number): Problem {
  const t = TEMPLATES.find((x) => x.id === templateId);
  if (!t) throw new Error(`unknown template ${templateId}`);
  return buildProblem(t, seed);
}

export function problemFromId(id: string): Problem | null {
  const [templateId, seedStr] = id.split(':');
  const seed = Number(seedStr);
  if (!TEMPLATES.some((t) => t.id === templateId) || !Number.isFinite(seed)) return null;
  return generate(templateId, seed);
}

export function generateSet(opts: { exam: ExamId; topicId?: string; count: number; seed: number }): Problem[] {
  const pool = templatesFor(opts.exam, opts.topicId);
  const rng = new Rng(opts.seed ^ hash(opts.exam + (opts.topicId ?? '')));
  const order = rng.shuffle(pool);
  const out: Problem[] = [];
  for (let i = 0; i < opts.count; i++) {
    const t = order[i % order.length];
    out.push(buildProblem(t, opts.seed * 31 + i));
  }
  return out;
}

export function placementTest(exam: ExamId, seed: number): Problem[] {
  const topics = topicsFor(exam);
  const rng = new Rng(seed ^ hash('placement' + exam));
  const picked = rng.shuffle(topics).slice(0, 5);
  while (picked.length < 5) picked.push(topics[picked.length % topics.length]);
  return picked.map((tp, i) => {
    const ts = templatesFor(exam, tp.id);
    return buildProblem(rng.pick(ts), seed + i * 13);
  });
}

export interface PlanInput {
  exam: ExamId;
  examDate: string;
  today?: string;
  minutesPerDay: number;
  results: { topicId: string; correct: boolean }[];
}

export interface StudyPlan {
  daysLeft: number;
  weakTopics: Topic[];
  strongTopics: Topic[];
  problemsPerDay: number;
  projected: { now: number; target: number; label: string };
}

export function buildPlan(input: PlanInput): StudyPlan {
  const exam = getExam(input.exam);
  const today = input.today ? new Date(input.today) : new Date();
  const date = new Date(input.examDate);
  const daysLeft = Math.max(1, Math.ceil((date.getTime() - today.getTime()) / 86400000));
  const wrongIds = new Set(input.results.filter((r) => !r.correct).map((r) => r.topicId));
  const rightIds = new Set(input.results.filter((r) => r.correct).map((r) => r.topicId));
  const all = topicsFor(input.exam);
  const untested = all.filter((t) => !wrongIds.has(t.id) && !rightIds.has(t.id));
  const weakTopics = [...all.filter((t) => wrongIds.has(t.id)), ...untested].slice(0, 3);
  const strongTopics = all.filter((t) => rightIds.has(t.id));
  const ratio = input.results.length ? input.results.filter((r) => r.correct).length / input.results.length : 0.5;
  const { min, max } = exam.scale;
  const span = max - min;
  const now = roundScale(exam.id, min + span * (0.35 + ratio * 0.4));
  const gain = Math.min(0.25, 0.04 + daysLeft / 600) * span;
  const target = roundScale(exam.id, Math.min(max, now + gain));
  return {
    daysLeft,
    weakTopics,
    strongTopics,
    problemsPerDay: Math.max(5, Math.round(input.minutesPerDay / 1.5)),
    projected: { now, target, label: exam.scale.label },
  };
}

function roundScale(exam: ExamId, v: number): number {
  if (exam === 'sat') return Math.round(v / 10) * 10;
  return Math.round(v);
}

export const A_LEVEL_GRADES = ['U', 'E', 'D', 'C', 'B', 'A', 'A*'];

export function formatScore(exam: ExamId, v: number): string {
  if (exam === 'a-level') return A_LEVEL_GRADES[Math.max(0, Math.min(6, Math.round(v)))];
  return String(v);
}
