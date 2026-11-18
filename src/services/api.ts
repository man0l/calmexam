import type { Problem } from '../engine';

const DEFAULT_BASE = 'https://calmexam.manol-trendafilov.workers.dev/api';
const API_BASE = (process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_BASE).replace(/\/+$/, '');
const TIMEOUT_MS = 12000;

export interface Explanation {
  text: string;
  source: 'ai' | 'steps' | 'local';
}

export function localExplanation(problem: Problem, chosen: string): string {
  const lines = [
    `You chose ${chosen}. The verified answer is ${problem.answer}.`,
    '',
    'Here is the path that gets there:',
    ...problem.steps.map((s, i) => `${i + 1}. ${s}`),
  ];
  if (problem.pitfalls.length) {
    lines.push('', `A likely slip: ${problem.pitfalls[0]}`);
  }
  return lines.join('\n');
}

export async function explainMistake(problem: Problem, chosen: string): Promise<Explanation> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemId: problem.id, chosen }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as { ok?: boolean; explanation?: string; source?: 'ai' | 'steps' };
    if (!data.ok || !data.explanation) throw new Error('bad payload');
    return { text: data.explanation, source: data.source === 'ai' ? 'ai' : 'steps' };
  } catch {
    return { text: localExplanation(problem, chosen), source: 'local' };
  } finally {
    clearTimeout(timer);
  }
}
