import { EXAMS, generateSet, topicsFor } from '../../../src/engine';
import { HUB_COPY } from '../content';
import { APP_STORE_URL, CONTACT, ORIGIN, hubPath } from '../site';
import { Faq, badges, faqLd, faqSection, page, waitlistForm } from './layout';
import { practiceSection, quizLd } from './practice';
import { gallery, heroPhone } from './screens';
import { esc } from './util';

const FAQS: Faq[] = [
  {
    q: 'What is CalmExam?',
    a: 'CalmExam is an exam math coach for SAT Math, AP Calculus AB and A-Level Maths. It gives you unlimited practice where every answer is verified by a generator, a daily plan built around your exam date, and an "explain my mistake" coach grounded in the verified steps.',
  },
  {
    q: 'Where can I get the app?',
    a: 'CalmExam is available now on the App Store for iPhone and iPad. The Android app is coming soon: join the waitlist and we will send you one email when it is on Google Play. The practice sets on this website stay free to use.',
  },
  {
    q: 'How can every answer be right?',
    a: 'We do not scrape or type in answers. Each problem is generated from a template that computes the answer and the worked steps from the same numbers it puts in the question, so the answer key always matches the question.',
  },
  {
    q: 'Does the AI decide the answer?',
    a: 'No. The AI model only explains why a chosen answer is wrong. It is given the verified answer, steps and common pitfalls, and it is told never to change the answer. If it is unavailable you get an explanation built from the verified steps.',
  },
  {
    q: 'Is CalmExam free?',
    a: 'The practice sets on calmexam.com are free with no account. The app is free to download with unlimited practice. An optional Pro plan adds unlimited mistake explanations and the full daily plan, and the price is shown before you pay anything.',
  },
  {
    q: 'Is CalmExam affiliated with the College Board or UK exam boards?',
    a: 'No. CalmExam is independent. All practice questions are original and written to match the skills each exam tests.',
  },
];

export function homePage(seed: number, state?: 'joined' | 'error' | 'server'): string {
  const problems = generateSet({ exam: 'sat', count: 3, seed });
  const hubCards = EXAMS.map((e) => {
    const c = HUB_COPY[e.id];
    return `<a class="card hubcard" href="${hubPath(e.id)}"><span class="tag">${esc(e.region)} · ${topicsFor(e.id).length} topics</span>
<h3>${esc(c.h1)}</h3><p class="muted" style="margin:0">${esc(c.description.split('.')[0])}.</p><span class="go">Start practising →</span></a>`;
  }).join('');

  const body = `<section class="hero" id="join" aria-labelledby="hero-h"><div class="wrap">
<div>
<h1 id="hero-h">Exam math practice that's <em>never wrong</em></h1>
<p class="lead">Unlimited SAT Math, AP Calculus AB and A-Level Maths practice where every answer is verified by a generator, a 5-question placement that builds your daily plan, and a calm coach that explains your mistakes using the real steps.</p>
${badges()}
${waitlistForm('hero', 'home-hero', state)}
</div>
${heroPhone('today', 'CalmExam app: today’s session, a weekly streak and a stepping-stone path of your weakest topics')}
</div></section>

<section aria-labelledby="how-h"><div class="wrap">
<h2 id="how-h">From "where do I start?" to a plan in five minutes</h2>
<div class="grid g3 steps3" style="margin-top:28px">
<div class="card"><h3>Pick your exam and date</h3><p class="muted" style="margin:0">SAT Math, AP Calculus AB or A-Level Maths. We count the days so you don't have to.</p></div>
<div class="card"><h3>Take a 5-question placement</h3><p class="muted" style="margin:0">Five real questions across the syllabus show which topics need you most.</p></div>
<div class="card"><h3>Follow a short daily plan</h3><p class="muted" style="margin:0">A few focused minutes a day on your weak topics, with every answer verified and explained.</p></div>
</div>
</div></section>

<section class="band" aria-labelledby="screens-h"><div class="wrap">
<h2 id="screens-h">A calm app, one problem at a time</h2>
<p class="lead">No confetti, no red badges, no countdown pressure. Just the next useful problem and an answer you can trust.</p>
<div style="margin-top:36px">${gallery()}</div>
</div></section>

<section aria-labelledby="practice"><div class="wrap narrow">
${practiceSection({ exam: 'sat', problems, title: 'Try a free SAT Math practice set', intro: `Three SAT Math questions generated today. Answer to check, then see the verified steps. Want a full set? Try the <a href="${hubPath('sat')}">SAT Math practice test</a>.` })}
</div></section>

<section aria-labelledby="exams-h" style="padding-top:0"><div class="wrap">
<h2 id="exams-h">Free practice for your exam</h2>
<p class="muted">Ten fresh, verified questions per page, every day. No account needed.</p>
<div class="grid g3" style="margin-top:24px">${hubCards}</div>
</div></section>

<section aria-labelledby="vs-h" style="padding-top:0"><div class="wrap">
<h2 id="vs-h">Photo solvers guess. CalmExam verifies.</h2>
<p class="lead">AI homework apps read your photo and predict an answer. Usually that works. On exam prep, "usually" is not good enough.</p>
<div class="vs" style="margin-top:28px">
<div class="card them"><h3>Typical AI photo solver</h3><ul>
<li>Reads a photo, so a misread sign changes the whole answer</li>
<li>The model writes both the answer and the explanation</li>
<li>Confident tone whether it is right or wrong</li>
<li>Solves your homework; doesn't plan your prep</li></ul></div>
<div class="card us"><h3>CalmExam</h3><ul>
<li>Each problem is generated with its answer computed, not predicted</li>
<li>Steps come from the same generator as the answer</li>
<li>AI only explains your mistake, and can't change the answer</li>
<li>Placement and a daily plan built around your exam date</li></ul></div>
</div>
</div></section>

${faqSection(FAQS)}

<section class="cta band" aria-labelledby="cta-h"><div class="wrap narrow">
<h2 id="cta-h">Start practising with CalmExam today</h2>
<p class="lead" style="margin:0 auto 28px">Free on the App Store for iPhone and iPad. On Android? Join the waitlist for one email at launch. No spam, and you can ask us to delete your email any time at ${CONTACT}.</p>
<div class="card" style="max-width:600px;margin:0 auto;color:var(--ink)">
${badges()}
${waitlistForm('cta', 'home-bottom')}
</div>
</div></section>`;

  return page({
    path: '/',
    title: "CalmExam: SAT Math, AP Calculus & A-Level Maths Practice That's Never Wrong",
    description:
      'Unlimited SAT Math, AP Calculus AB and A-Level Maths practice where every answer is verified, plus an AI coach that explains your mistakes. Free practice sets and a free iOS app.',
    body,
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'CalmExam', url: ORIGIN, logo: ORIGIN + '/favicon.svg', email: CONTACT },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'CalmExam', url: ORIGIN },
      {
        '@context': 'https://schema.org',
        '@type': 'MobileApplication',
        name: 'CalmExam',
        operatingSystem: 'iOS',
        applicationCategory: 'EducationalApplication',
        installUrl: APP_STORE_URL,
        url: ORIGIN,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      quizLd({ name: 'Free SAT Math practice set', url: ORIGIN + '/', about: 'SAT Math', level: 'High school', problems }),
      faqLd(FAQS),
    ],
  });
}
