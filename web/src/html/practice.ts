import { Difficulty, ExamId, Problem, QuestionStyle, getTopic, topicsFor } from '../../../src/engine';
import { esc } from './util';

const L = 'ABCD';
const LEVEL = ['', 'Warm-up', 'Core', 'Stretch'];
const FRQ = '<span class="lvl">FRQ style</span>';

/** Server-rendered problem. Must mirror renderProblem() in client.ts. */
export function problemHtml(p: Problem, i: number): string {
  const choices = p.choices
    .map(
      (c, k) =>
        `<button type="button" class="choice" data-i="${k}" aria-pressed="false"><span class="l" aria-hidden="true">${L[k]}</span><span class="t">${esc(c)}</span></button>`,
    )
    .join('');
  const pit = p.pitfalls.length
    ? `<div class="pit"><h3>Common pitfalls</h3><ul>${p.pitfalls.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>`
    : '';
  return (
    `<li class="problem" data-id="${esc(p.id)}" data-answer="${p.answerIndex}">` +
    `<p class="pmeta"><span>Question ${i + 1}</span><span aria-hidden="true">·</span><span>${esc(getTopic(p.topicId)?.name ?? '')}</span><span class="lvl">${LEVEL[p.difficulty]}</span>${p.style === 'frq' ? FRQ : ''}</p>` +
    `<p class="prompt">${esc(p.prompt)}</p>` +
    `<div class="choices" role="group" aria-label="Answer choices for question ${i + 1}">${choices}</div>` +
    `<p class="fb" aria-live="polite"></p>` +
    `<details class="sol"><summary>Show verified answer and steps</summary>` +
    `<p class="verified"><b>Verified answer:</b> <span>${L[p.answerIndex]}) ${esc(p.answer)}</span></p>` +
    `<ol>${p.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>${pit}</details>` +
    `<div class="explain" hidden><button type="button" class="btn ghost sm" data-explain>Explain my mistake</button><div class="out" aria-live="polite"></div></div>` +
    `</li>`
  );
}

export function practiceSection(opts: {
  exam: ExamId;
  topicId?: string;
  difficulty?: Difficulty[];
  style?: QuestionStyle;
  problems: Problem[];
  title: string;
  intro: string;
  headingId?: string;
}): string {
  const names: Record<string, string> = {};
  for (const t of topicsFor(opts.exam)) names[t.id] = t.name;
  const hid = opts.headingId ?? 'practice';
  return `<div data-practice data-exam="${esc(opts.exam)}" data-topic="${esc(opts.topicId ?? '')}" data-difficulty="${esc((opts.difficulty ?? []).join(','))}" data-style="${esc(opts.style ?? '')}" data-count="${opts.problems.length}" data-names="${esc(JSON.stringify(names))}">
<h2 id="${hid}">${esc(opts.title)}</h2>
<p class="muted">${opts.intro}</p>
<div class="setbar"><span class="score" aria-live="polite">${opts.problems.length} questions</span><button type="button" class="btn ghost sm" data-newset>New set</button></div>
<ol class="problems">${opts.problems.map(problemHtml).join('')}</ol>
</div>`;
}

/** schema.org Quiz (a LearningResource subtype) for a practice set. */
export function quizLd(opts: { name: string; url: string; about: string; level: string; problems: Problem[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: opts.name,
    url: opts.url,
    about: { '@type': 'Thing', name: opts.about },
    educationalLevel: opts.level,
    learningResourceType: 'Practice problems',
    isAccessibleForFree: true,
    inLanguage: 'en',
    provider: { '@type': 'Organization', name: 'CalmExam', url: 'https://calmexam.com' },
    hasPart: opts.problems.map((p) => ({
      '@type': 'Question',
      eduQuestionType: 'Multiple choice',
      learningResourceType: 'Practice problem',
      text: p.prompt,
      suggestedAnswer: p.choices
        .filter((_, k) => k !== p.answerIndex)
        .map((c) => ({ '@type': 'Answer', text: c })),
      acceptedAnswer: {
        '@type': 'Answer',
        text: p.answer,
        answerExplanation: { '@type': 'Comment', text: p.steps.join(' ') },
      },
    })),
  };
}
