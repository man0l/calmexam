import { EXAMS, Exam, Topic, generateSet, getExam, topicsFor } from '../../../src/engine';
import { HUB_COPY, TOPIC_TIPS, topicFaqs } from '../content';
import { ORIGIN, hubPath, topicPath } from '../site';
import { breadcrumbLd, ctaSection, faqLd, faqSection, page } from './layout';
import { practiceSection, quizLd } from './practice';
import { esc } from './util';

const PER_PAGE = 10;

function topicLinks(topics: Topic[], noun: string): string {
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

export function hubPage(exam: Exam, seed: number): string {
  const c = HUB_COPY[exam.id];
  const path = hubPath(exam.id);
  const problems = generateSet({ exam: exam.id, count: PER_PAGE, seed });
  const topics = topicsFor(exam.id);
  const body = `<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">CalmExam</a> / <span aria-current="page">${esc(c.h1)}</span></nav>
<div class="pagehead narrow"><span class="eyebrow">${esc(exam.name)} · Free · Verified answers</span>
<h1>${esc(c.h1)}</h1><p class="lead">${esc(c.lead)}</p></div>
</div>
<section style="padding-top:24px" aria-labelledby="practice"><div class="wrap narrow">
${practiceSection({ exam: exam.id, problems, title: c.practiceTitle, intro: 'Pick an answer to check it. Wrong? Open the steps or tap “Explain my mistake”.' })}
</div></section>
<section aria-labelledby="topics" style="padding-top:0"><div class="wrap">
<h2 id="topics">Practice ${esc(exam.name)} by topic</h2>
<p class="muted">Focus on one skill at a time. Each topic page has 10 new ${c.topicNoun} every day.</p>
${topicLinks(topics, c.topicNoun)}
</div></section>
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
      quizLd({ name: c.practiceTitle, url: ORIGIN + path, about: exam.name, level: c.level, problems }),
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
  const tip = TOPIC_TIPS[topic.id];
  const problems = generateSet({ exam: exam.id, topicId: topic.id, count: PER_PAGE, seed });
  const noun = c.topicNoun;
  const Noun = noun.replace(/\b\w/g, (ch) => ch.toUpperCase());
  const h1 = `${exam.name} ${topic.name} ${noun}`;
  const faqs = topicFaqs(exam.name, topic.name, noun);
  const siblings = topicsFor(exam.id).filter((t) => t.id !== topic.id);
  const body = `<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">CalmExam</a> / <a href="${hubPath(exam.id)}">${esc(c.h1)}</a> / <span aria-current="page">${esc(topic.name)}</span></nav>
<div class="pagehead narrow"><span class="eyebrow">${esc(exam.name)} · ${esc(topic.name)}</span>
<h1>${esc(h1)}</h1>
<p class="lead">${esc(tip?.why ?? topic.blurb)} Ten fresh questions every day, each with a verified answer and worked steps.</p></div>
</div>
<section style="padding-top:24px" aria-labelledby="practice"><div class="wrap narrow">
${tip ? `<div class="card" style="margin-bottom:28px"><h2 style="font-size:20px;margin-bottom:6px">Key idea</h2><p style="margin:0">${esc(tip.key)}</p></div>` : ''}
${practiceSection({ exam: exam.id, topicId: topic.id, problems, title: `${topic.name}: today's ${noun}`, intro: 'Pick an answer to check it. Wrong? Open the steps or tap “Explain my mistake”.' })}
<p style="margin-top:28px"><a class="btn ghost" href="${hubPath(exam.id)}">Mixed-topic set: ${esc(c.h1)}</a></p>
</div></section>
<section aria-labelledby="more" style="padding-top:0"><div class="wrap">
<h2 id="more">More ${esc(exam.name)} ${noun}</h2>
${topicLinks(siblings, noun)}
</div></section>
${faqSection(faqs, `${topic.name} ${noun}: FAQ`)}
${ctaSection(path)}`;
  return page({
    path,
    title: `${exam.name} ${topic.name} ${Noun} (Free, With Steps) | CalmExam`,
    description: `Free ${exam.name} ${topic.name} ${noun}: ${topic.blurb} 10 new questions daily with verified answers, worked steps and common pitfalls.`,
    body,
    jsonLd: [
      quizLd({ name: h1, url: ORIGIN + path, about: `${exam.name}: ${topic.name}`, level: c.level, problems }),
      faqLd(faqs),
      breadcrumbLd([
        { name: 'CalmExam', path: '/' },
        { name: c.h1, path: hubPath(exam.id) },
        { name: topic.name, path },
      ]),
    ],
  });
}
