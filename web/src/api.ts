import { EXAMS, ExamId, Problem, TEMPLATES, generateSet, getTopic, problemFromId } from '../../src/engine';
import type { Env } from './env';

export const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export function json(data: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS, ...extra },
  });
}

const EXAM_VALUES = ['sat', 'ap-calc-ab', 'a-level', 'other'];
const PLATFORM_VALUES = ['ios', 'android', 'both'];
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const MAX_BODY = 8 * 1024;

type Body = Record<string, unknown>;

async function readBody(req: Request): Promise<{ body: Body; form: boolean } | null> {
  const ct = (req.headers.get('content-type') ?? '').toLowerCase();
  const len = Number(req.headers.get('content-length') ?? 0);
  if (len > MAX_BODY) return null;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) return null;
    if (ct.includes('application/x-www-form-urlencoded')) {
      return { body: Object.fromEntries(new URLSearchParams(text)), form: true };
    }
    const parsed = text ? JSON.parse(text) : {};
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return { body: parsed as Body, form: false };
  } catch {
    return null;
  }
}

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function redirect(location: string): Response {
  return new Response(null, { status: 303, headers: { Location: location, 'Cache-Control': 'no-store' } });
}

export async function handleWaitlist(req: Request, env: Env): Promise<Response> {
  const parsed = await readBody(req);
  const form = parsed?.form ?? (req.headers.get('content-type') ?? '').includes('form');
  const body = parsed?.body ?? {};
  const rawEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!rawEmail || rawEmail.length > 254 || !EMAIL_RE.test(rawEmail)) {
    return form ? redirect('/?error=email#join') : json({ ok: false, error: 'invalid_email' }, 400);
  }
  const examIn = str(body.exam, 20);
  const platformIn = str(body.platform, 20);
  const exam = EXAM_VALUES.includes(examIn) ? examIn : null;
  const platform = PLATFORM_VALUES.includes(platformIn) ? platformIn : null;
  const source = str(body.source, 100).replace(/[^\w\-/.:]/g, '') || (form ? 'form' : 'api');
  const cf = (req as Request & { cf?: { country?: unknown } }).cf;
  const country = typeof cf?.country === 'string' ? cf.country.slice(0, 8) : null;

  if (!env.DB) return form ? redirect('/?error=server#join') : json({ ok: false, error: 'unavailable' }, 503);
  let already = false;
  try {
    const res = await env.DB.prepare(
      'INSERT INTO waitlist (email, exam, platform, source, country) VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT(email) DO NOTHING',
    )
      .bind(rawEmail, exam, platform, source, country)
      .run();
    already = (res.meta?.changes ?? 0) === 0;
  } catch (err) {
    console.error('waitlist insert failed', String(err));
    return form ? redirect('/?error=server#join') : json({ ok: false, error: 'server_error' }, 500);
  }
  return form ? redirect('/?joined=1#join') : json({ ok: true, already });
}

const MODEL = '@cf/meta/llama-3.1-8b-instruct-fast';
const FALLBACK_MODEL = '@cf/meta/llama-3.1-8b-instruct';
const AI_TIMEOUT_MS = 9000;

const SYSTEM_PROMPT = `You are CalmExam's calm, encouraging math coach. A student answered a multiple-choice exam problem.
Rules you must follow:
- The VERIFIED ANSWER given to you is correct. Never question it, change it, recompute it into something else, or suggest another answer.
- Explain in plain words why the student's choice is likely wrong: name the specific slip (use the listed pitfalls and steps), then point to the step that fixes it.
- Only use the verified steps for any calculation you mention. Do not invent new numbers.
- At most 90 words. Plain text, no markdown, no headings, no lists. Use the real minus sign (−).
- If the student asks something unrelated to this problem, briefly steer back to the problem.`;

function fallbackExplanation(p: Problem, chosen: string | null): string {
  const L = 'ABCD';
  const right = `${L[p.answerIndex]}) ${p.answer}`;
  const steps = p.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
  if (chosen === p.answer) {
    return `Your answer ${right} is correct. Here is the verified method:\n${steps}`;
  }
  const lead = chosen
    ? `You chose ${L[p.choices.indexOf(chosen)]}) ${chosen}, but the verified answer is ${right}.`
    : `The verified answer is ${right}.`;
  const pit = p.pitfalls[0]?.replace(/\.$/, '') ?? '';
  const slip = pit ? ` A common slip here: ${pit[0].toLowerCase()}${pit.slice(1)}.` : '';
  return `${lead}${slip}\nWork through the verified steps:\n${steps}`;
}

async function runModel(env: Env, model: string, messages: { role: string; content: string }[]): Promise<string> {
  const ai = env.AI as unknown as { run: (m: string, i: unknown) => Promise<unknown> };
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, rej) => {
    timer = setTimeout(() => rej(new Error('ai_timeout')), AI_TIMEOUT_MS);
  });
  try {
    const out = (await Promise.race([ai.run(model, { messages, max_tokens: 180, temperature: 0.2 }), timeout])) as {
      response?: unknown;
    };
    const text = typeof out?.response === 'string' ? out.response.trim() : '';
    if (!text) throw new Error('empty_response');
    return text;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function handleExplain(req: Request, env: Env): Promise<Response> {
  const parsed = await readBody(req);
  if (!parsed) return json({ ok: false, error: 'bad_request' }, 400);
  const { body } = parsed;
  const id = str(body.problemId, 120);
  let p: Problem | null = null;
  try {
    p = id ? problemFromId(id) : null;
  } catch {
    p = null;
  }
  if (!p) return json({ ok: false, error: 'unknown_problem' }, 400);

  const chosenIn = str(body.chosen, 200);
  const chosen = p.choices.includes(chosenIn) ? chosenIn : null; // not a real choice -> generic explanation
  const question = str(body.question, 300).replace(/\s+/g, ' ');

  if (chosen === p.answer || !env.AI) {
    return json({ ok: true, explanation: fallbackExplanation(p, chosen), answer: p.answer, source: 'steps' });
  }

  const L = 'ABCD';
  const user = [
    `Problem: ${p.prompt}`,
    `Choices: ${p.choices.map((c, i) => `${L[i]}) ${c}`).join('   ')}`,
    `VERIFIED ANSWER: ${L[p.answerIndex]}) ${p.answer}`,
    `Student chose: ${chosen ? `${L[p.choices.indexOf(chosen)]}) ${chosen}` : '(no valid choice given; explain the key idea)'}`,
    `Verified steps:\n${p.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    p.pitfalls.length ? `Common pitfalls:\n- ${p.pitfalls.join('\n- ')}` : '',
    question ? `Student's question: ${question}` : '',
    `Explain why the student's choice is wrong and how the verified steps reach ${p.answer}.`,
  ]
    .filter(Boolean)
    .join('\n');
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: user },
  ];

  for (const model of [MODEL, FALLBACK_MODEL]) {
    try {
      const text = await runModel(env, model, messages);
      return json({ ok: true, explanation: text.slice(0, 1200), answer: p.answer, source: 'ai' });
    } catch (err) {
      console.warn('explain model failed', model, String(err));
    }
  }
  return json({ ok: true, explanation: fallbackExplanation(p, chosen), answer: p.answer, source: 'steps' });
}

export function handleProblems(url: URL): Response {
  const q = url.searchParams;
  const exam = (q.get('exam') ?? 'sat') as ExamId;
  if (!EXAMS.some((e) => e.id === exam)) return json({ ok: false, error: 'unknown_exam' }, 400);
  const topic = q.get('topic') || q.get('topicId') || undefined;
  if (topic && getTopic(topic)?.exam !== exam) return json({ ok: false, error: 'unknown_topic' }, 400);
  const countIn = Number(q.get('count') ?? 10);
  const count = Number.isFinite(countIn) ? Math.max(1, Math.min(20, Math.floor(countIn))) : 10;
  const seedIn = Number(q.get('seed'));
  const seed = q.get('seed') !== null && Number.isFinite(seedIn) ? Math.abs(Math.floor(seedIn)) % 2147483647 : Math.floor(Math.random() * 1e9);
  try {
    return json({ problems: generateSet({ exam, topicId: topic, count, seed }) });
  } catch (err) {
    console.error('generateSet failed', String(err));
    return json({ ok: false, error: 'generation_failed' }, 500);
  }
}

export function handleHealth(): Response {
  return json({ ok: true, templates: TEMPLATES.length });
}
