import { generate, generateSet, Rng, templatesFor, topicsFor, type ExamId, type Problem, type Topic } from '../engine';
import type { TopicStat } from '../types';

export const SESSION_LENGTH = 10;
export const SIMILAR_COUNT = 3;

export function randomSeed(): number {
  return Math.floor(Math.random() * 1_000_000) + 1;
}

export function accuracy(stat: TopicStat | undefined): number | null {
  if (!stat || stat.attempts === 0) return null;
  return stat.correct / stat.attempts;
}

export function weakestTopics(
  exam: ExamId,
  stats: Record<string, TopicStat>,
  planWeak: Topic[],
  count = 3,
): Topic[] {
  const all = topicsFor(exam);
  const measured = all
    .filter((t) => (stats[t.id]?.attempts ?? 0) >= 3)
    .sort((a, b) => (accuracy(stats[a.id]) ?? 1) - (accuracy(stats[b.id]) ?? 1));
  const out: Topic[] = [];
  for (const t of [...measured.filter((t) => (accuracy(stats[t.id]) ?? 1) < 0.8), ...planWeak, ...all]) {
    if (!out.some((o) => o.id === t.id)) out.push(t);
    if (out.length >= count) break;
  }
  return out;
}

export function buildTodaySession(exam: ExamId, weak: Topic[], seed: number): Problem[] {
  const rng = new Rng(seed);
  const all = topicsFor(exam);
  const out: Problem[] = [];
  for (let i = 0; out.length < SESSION_LENGTH && i < SESSION_LENGTH * 4; i++) {
    const useWeak = weak.length > 0 && i % 5 < 3;
    const topic = useWeak ? weak[i % weak.length] : rng.pick(all);
    const template = rng.pick(templatesFor(exam, topic.id));
    const p = generate(template.id, seed + i * 101);
    if (!out.some((o) => o.id === p.id || o.prompt === p.prompt)) out.push(p);
  }
  return out;
}

export function buildTopicSession(exam: ExamId, topicId: string, seed: number): Problem[] {
  return generateSet({ exam, topicId, count: SESSION_LENGTH, seed });
}

export function buildSimilar(problem: Problem, seed: number): Problem[] {
  const out: Problem[] = [];
  for (let i = 0; out.length < SIMILAR_COUNT && i < 20; i++) {
    const p = generate(problem.templateId, seed + i * 7 + 1);
    if (p.prompt !== problem.prompt && !out.some((o) => o.prompt === p.prompt)) out.push(p);
  }
  return out;
}

export function sessionMessage(correct: number, total: number): string {
  const pct = total ? correct / total : 0;
  if (pct >= 0.8) return 'Steady and accurate. This is how scores move.';
  if (pct >= 0.5) return 'Good work. The misses are your next lessons.';
  return 'Every miss today is one you will not make on exam day.';
}

export function problemsPerDay(minutes: number): number {
  return Math.max(5, Math.round(minutes / 1.5));
}
