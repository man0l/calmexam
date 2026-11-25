import { EXAMS, Exam, Problem, SetOptions, Topic, generateSet, getExam, topicsFor } from '../../../src/engine';
import { BRAND, HUB_COPY, TOPIC_COPY, topicFaqs } from '../content';
import { ORIGIN, hubPath, landingFor, landingPath, topicPath } from '../site';
import { breadcrumbLd, ctaSection, faqLd, faqSection, page } from './layout';
import { practiceSection, quizLd } from './practice';
import { esc } from './util';

export const CORE_COUNT = 15;
export const DAILY_COUNT = 10;
/** Fixed seed for the core set: the same 15 questions on every crawl and visit. */
export const CORE_SEED = 2026;

const INTRO = 'Pick an answer to check it. Wrong? Open the steps or tap “Explain my mistake”.';

/** The fixed core set and a daily set that never repeats a core question. */
export function coreAndDaily(opts: Omit<SetOptions, 'count' | 'seed'>, seed: number, coreSeed = CORE_SEED): { core: Problem[]; daily: Problem[] } {
  const core = generateSet({ ...opts, count: CORE_COUNT, seed: coreSeed });
  const seen = new Set(core.map((p) => p.prompt));
  const daily = generateSet({ ...opts, count: 20, seed })
    .filter((p) => !seen.has(p.prompt))
    .slice(0, DAILY_COUNT);
  return { core, daily };
}

export function practicePair(opts: {
  set: Omit<SetOptions, 'count' | 'seed'>;
  seed: number;
  coreSeed?: number;
  coreTitle: string;
  dailyTitle: string;
}): { html: string; core: Problem[] } {
  const { core, daily } = coreAndDaily(opts.set, opts.seed, opts.coreSeed);
  const common = { exam: opts.set.exam, topicId: opts.set.topicId, difficulty: opts.set.difficulty, style: opts.set.style };
  const html = `${practiceSection({ ...common, problems: core, title: opts.coreTitle, intro: `These ${core.length} questions stay the same, so you can come back and retry them. ${INTRO}` })}
<div style="margin-top:44px">${practiceSection({ ...common, problems: daily, title: opts.dailyTitle, intro: 'A different set every day, on top of the core questions above.', headingId: 'daily' })}</div>`;
  return { html, core };
}

export function topicLinks(topics: Topic[], noun: string): string {
  return `<div class="tlinks">${topics
    .map(
      (t) =>
        `<a class="tlink" href="${topicPath(t)}"><strong>${esc(t.name)} ${noun}</strong><span>${esc(t.blurb)}</span></a>`,
    )
    .join('')}</div>`;
}

function otherExams(current: Exam): string {
  return EXAMS.filter((e) => e.id !== current.id)
    .map((e) => `<a href="${hubPath(e.id)}">${esc(HUB_COPY[e.id].h1)}</a>`)
    .join(' · ');
}

function landingLinks(exam: Exam): string {
  const pages = landingFor(exam.id);
  if (!pages.length) return '';
  return `<section aria-labelledby="more-ways" style="padding-top:0"><div class="wrap">
<h2 id="more-ways">More ways to practise ${esc(exam.name)}</h2>
<div class="tlinks">${pages
    .map((l) => `<a class="tlink" href="${landingPath(l)}"><strong>${esc(l.h1)}</strong><span>${esc(l.card)}</span></a>`)
    .join('')}</div>
</div></section>`;
}

export function hubPage(exam: Exam, seed: number): string {
  const c = HUB_COPY[exam.id];
  const path = hubPath(exam.id);
  const { html: practice, core } = practicePair({ set: { exam: exam.id }, seed, coreTitle: c.coreTitle, dailyTitle: c.dailyTitle });
  const topics = topicsFor(exam.id);
  const body = `<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">CalmExam</a> / <span aria-current="page">${esc(c.h1)}</span></nav>
<div class="pagehead narrow">
<h1>${esc(c.h1)}</h1><p class="lead">${esc(c.lead)}</p></div>
</div>
<section style="padding-top:24px" aria-labelledby="practice"><div class="wrap narrow">
${practice}
</div></section>
<section aria-labelledby="topics" style="padding-top:0"><div class="wrap">
<h2 id="topics">Practice ${esc(exam.name)} by topic</h2>
<p class="muted">Focus on one skill at a time. Each of the ${topics.length} topic pages has 15 core ${c.topicNoun} and a new daily set.</p>
${topicLinks(topics, c.topicNoun)}
</div></section>
${landingLinks(exam)}
<section aria-labelledby="about" style="padding-top:0"><div class="wrap narrow prose">
<h2 id="about">${esc(c.about.h)}</h2>
${c.about.p.map((p) => `<p>${esc(p)}</p>`).join('')}
<div class="card"><h3>${esc(exam.name)} at a glance</h3><dl style="margin:0">${c.facts
    .map((f) => `<dt style="font-weight:600">${esc(f.k)}</dt><dd style="margin:0 0 10px;color:var(--muted)">${esc(f.v)}</dd>`)
    .join('')}</dl><p class="faint" style="margin:0">Exam details can change; check the official exam website for the latest format.</p></div>
<h2>How to get the most from each set</h2>
<ol>${c.howTo.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
<p class="muted">More practice: ${otherExams(exam)}</p>
</div></section>
${faqSection(c.faqs, `${exam.name} practice: FAQ`)}
${ctaSection(path)}`;
  return page({
    path,
    title: c.title,
    description: c.description,
    body,
    jsonLd: [
      quizLd({ name: c.coreTitle, url: ORIGIN + path, about: exam.name, level: c.level, problems: core }),
      faqLd(c.faqs),
      breadcrumbLd([
        { name: 'CalmExam', path: '/' },
        { name: c.h1, path },
      ]),
    ],
  });
}

export function topicPage(topic: Topic, seed: number): string {
  const exam = getExam(topic.exam);
  const c = HUB_COPY[exam.id];
  const path = topicPath(topic);
  const copy = TOPIC_COPY[topic.id];
  const noun = c.topicNoun;
  const Noun = noun.replace(/\b\w/g, (ch) => ch.toUpperCase());
  const h1 = `${exam.name} ${topic.name} ${noun}`;
  const { html: practice, core } = practicePair({
    set: { exam: exam.id, topicId: topic.id },
    seed,
    coreTitle: `${topic.name}: ${CORE_COUNT} core ${noun}`,
    dailyTitle: `${topic.name}: today's extra ${noun}`,
  });
  const faqs = topicFaqs(exam.name, topic.name, noun, copy?.faqs);
  const siblings = topicsFor(exam.id).filter((t) => t.id !== topic.id);
  const guide = copy
    ? `<div class="card" style="margin-bottom:28px"><h2 style="font-size:20px;margin-bottom:6px">Key idea</h2><p style="margin:0">${esc(copy.key)}</p></div>`
    : '';
  const mistakes = copy
    ? `<section aria-labelledby="mistakes" style="padding-top:0"><div class="wrap narrow prose">
<h2 id="mistakes">Common ${esc(topic.name.toLowerCase())} mistakes</h2>
<ul>${copy.mistakes.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
<p><b>Exam tip:</b> ${esc(copy.examTip)}</p>
</div></section>`
    : '';
  const body = `<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">CalmExam</a> / <a href="${hubPath(exam.id)}">${esc(c.h1)}</a> / <span aria-current="page">${esc(topic.name)}</span></nav>
<div class="pagehead narrow">
<h1>${esc(h1)}</h1>
<p class="lead">${esc(copy?.why ?? topic.blurb)} ${CORE_COUNT} core questions plus a new daily set, each with a verified answer and worked steps.</p></div>
</div>
<section style="padding-top:24px" aria-labelledby="practice"><div class="wrap narrow">
${guide}
${practice}
<p style="margin-top:28px"><a class="btn ghost" href="${hubPath(exam.id)}">Mixed-topic set: ${esc(c.h1)}</a></p>
</div></section>
${mistakes}
<section aria-labelledby="more" style="padding-top:0"><div class="wrap">
<h2 id="more">More ${esc(exam.name)} ${noun}</h2>
${topicLinks(siblings, noun)}
</div></section>
${faqSection(faqs, `${topic.name} ${noun}: FAQ`)}
${ctaSection(path)}`;
  return page({
    path,
    title: `${exam.name} ${topic.name} ${Noun} | ${BRAND}`,
    description: `Free ${exam.name} ${topic.name.toLowerCase()} ${noun}: ${topic.blurb} 15 core questions plus a daily set, with verified answers, worked steps and common mistakes.`,
    body,
    jsonLd: [
      quizLd({ name: h1, url: ORIGIN + path, about: `${exam.name}: ${topic.name}`, level: c.level, problems: core }),
      faqLd(faqs),
      breadcrumbLd([
        { name: 'CalmExam', path: '/' },
        { name: c.h1, path: hubPath(exam.id) },
        { name: topic.name, path },
      ]),
    ],
  });
}
