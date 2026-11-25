import { Problem, Topic, getExam, getTopic } from '../../../src/engine';
import { HUB_COPY } from '../content';
import { Landing, LandingSection } from '../landing';
import { ORIGIN, hubPath, landingFor, landingPath } from '../site';
import { practicePair, topicLinks } from './exam-pages';
import { breadcrumbLd, ctaSection, faqLd, faqSection, page } from './layout';
import { quizLd } from './practice';
import { esc } from './util';

function section(s: LandingSection, i: number): string {
  const id = `s${i + 1}`;
  return `<h2 id="${id}">${esc(s.h)}</h2>
${(s.p ?? []).map((p) => `<p>${esc(p)}</p>`).join('')}
${s.list ? `<ul>${s.list.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>` : ''}
${s.links ? `<ul>${s.links.map((l) => `<li><a href="${esc(l.href)}" rel="noopener">${esc(l.label)}</a></li>`).join('')}</ul>` : ''}`;
}

export function landingPage(l: Landing, seed: number): string {
  const exam = getExam(l.exam);
  const c = HUB_COPY[exam.id];
  const path = landingPath(l);
  let core: Problem[] = [];
  let practice = '';
  if (l.set) {
    const pair = practicePair({
      set: { exam: exam.id, difficulty: l.set.difficulty, style: l.set.style },
      seed,
      coreSeed: l.set.coreSeed,
      coreTitle: l.set.coreTitle,
      dailyTitle: l.set.dailyTitle,
    });
    core = pair.core;
    practice = `<section style="padding-top:24px" aria-labelledby="practice"><div class="wrap narrow">
${pair.html}
<p style="margin-top:28px"><a class="btn ghost" href="${hubPath(exam.id)}">Mixed-topic set: ${esc(c.h1)}</a></p>
</div></section>`;
  }
  const guide = `<section aria-labelledby="s1" style="padding-top:${l.guideFirst ? '24px' : '0'}"><div class="wrap narrow prose">
${l.sections.map(section).join('\n')}
</div></section>`;
  const featured = (l.topicIds ?? []).map(getTopic).filter((t): t is Topic => !!t);
  const topics = featured.length
    ? `<section aria-labelledby="by-topic" style="padding-top:0"><div class="wrap">
<h2 id="by-topic">Practise by topic</h2>
${topicLinks(featured, c.topicNoun)}
</div></section>`
    : '';
  const others = landingFor(exam.id).filter((o) => o.slug !== l.slug);
  const more = `<section aria-labelledby="more" style="padding-top:0"><div class="wrap">
<h2 id="more">More ${esc(exam.name)} practice</h2>
<div class="tlinks"><a class="tlink" href="${hubPath(exam.id)}"><strong>${esc(c.h1)}</strong><span>Mixed questions from every topic.</span></a>${others
    .map((o) => `<a class="tlink" href="${landingPath(o)}"><strong>${esc(o.h1)}</strong><span>${esc(o.card)}</span></a>`)
    .join('')}</div>
</div></section>`;
  const body = `<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">CalmExam</a> / <a href="${hubPath(exam.id)}">${esc(c.h1)}</a> / <span aria-current="page">${esc(l.crumb)}</span></nav>
<div class="pagehead narrow">
<h1>${esc(l.h1)}</h1><p class="lead">${esc(l.lead)}</p></div>
</div>
${l.guideFirst ? guide + practice : practice + guide}
${topics}
${more}
${faqSection(l.faqs, `${l.crumb}: FAQ`)}
${ctaSection(path)}`;
  const jsonLd: unknown[] = [
    faqLd(l.faqs),
    breadcrumbLd([
      { name: 'CalmExam', path: '/' },
      { name: c.h1, path: hubPath(exam.id) },
      { name: l.crumb, path },
    ]),
  ];
  if (core.length && l.set) jsonLd.unshift(quizLd({ name: l.set.coreTitle, url: ORIGIN + path, about: exam.name, level: c.level, problems: core }));
  if (l.guideFirst) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: l.h1,
      description: l.description,
      url: ORIGIN + path,
      inLanguage: 'en',
      publisher: { '@type': 'Organization', name: 'CalmExam', url: ORIGIN },
    });
  }
  return page({ path, title: l.title, description: l.description, body, jsonLd, ogType: l.guideFirst ? 'article' : undefined });
}
