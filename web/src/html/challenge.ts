import { Problem, getExam, getTopic } from '../../../src/engine';
import { HUB_COPY } from '../content';
import { hubPath, topicPath } from '../site';
import { badges, page } from './layout';
import { problemHtml } from './practice';
import { esc } from './util';

export function challengePath(p: Pick<Problem, 'templateId' | 'seed'>): string {
  return `/c/${p.templateId}/${p.seed}`;
}

export function parseChallenge(path: string): { templateId: string; seed: number } | null {
  const m = path.match(/^\/c\/([a-z0-9-]{1,64})\/(\d{1,9})$/);
  return m ? { templateId: m[1], seed: Number(m[2]) } : null;
}

export function challengePage(p: Problem): string {
  const exam = getExam(p.exam);
  const topic = getTopic(p.topicId);
  const c = HUB_COPY[exam.id];
  const path = challengePath(p);
  const more = topic ? topicPath(topic) : hubPath(exam.id);
  const title = `Can you solve this ${exam.name} problem?`;
  const body = `<div class="wrap narrow">
<div class="pagehead">
<h1>${esc(title)}</h1>
<p class="lead">Someone sent you one verified ${esc(topic?.name.toLowerCase() ?? 'math')} question. Pick an answer, then check the steps.</p>
</div>
<div data-practice data-exam="${esc(exam.id)}" data-count="1">
<ol class="problems">${problemHtml(p, 0)}</ol>
</div>
<div class="setbar" style="margin-top:20px">
<a class="btn" href="${more}">Try 10 more like it</a>
<button type="button" class="btn ghost sm" data-share data-url="${esc(path)}" data-text="${esc(`Can you solve this ${exam.shortName} question? Every answer on CalmExam is verified.`)}">Send it to a friend</button>
</div>
<p class="muted" data-share-msg aria-live="polite"></p>
<div class="card" style="margin-top:32px">
<h2 style="margin-top:0">One problem a night adds up</h2>
<p class="muted">The CalmExam app finds your weakest ${esc(c.topicNoun)} topics and builds a short daily plan around your exam date. Practice is free and unlimited.</p>
${badges()}
</div>
</div>`;
  return page({ path, title: `${title} | CalmExam`, description: `A verified ${exam.name} practice question: ${topic?.name ?? exam.name}. Solve it, then see the steps.`, body, noindex: true });
}
