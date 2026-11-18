import { EXAMS, TOPICS } from '../../../src/engine';
import { CONTACT, ORIGIN, hubPath, topicPath } from '../site';
import { CLIENT_JS } from './client';
import { hasOg, ogPath } from './screens';
import { CSS } from './styles';
import { esc, ldJson } from './util';

export const LOGO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#0D3A36"/><path d="M10 47c6-3 12-3 18 0s12 3 18 0 6-1.5 8-1.5" stroke="#147A6E" stroke-width="3" stroke-linecap="round" fill="none"/><ellipse cx="18" cy="40" rx="7" ry="4.5" fill="#F2D9A9"/><ellipse cx="32" cy="31" rx="8" ry="5" fill="#8FD8C4"/><ellipse cx="46" cy="20" rx="9" ry="5.5" fill="#fff"/></svg>';

export interface PageOpts {
  path: string;
  title: string;
  description: string;
  body: string;
  jsonLd?: unknown[];
  noindex?: boolean;
  ogType?: string;
}

/** indiestack cookie-free analytics (page views) and AI bot tracking (Worker). */
export const INDIESTACK_ORIGIN = 'https://indiestack.manol-trendafilov.workers.dev';
export const INDIESTACK_SITE = '769f2f15dd0f432e827a27af0a4bad5d';

export function page(o: PageOpts): string {
  const url = ORIGIN + (o.path === '/' ? '/' : o.path);
  const ld = (o.jsonLd ?? []).map(ldJson).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.description)}">
${o.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta property="og:type" content="${o.ogType ?? 'website'}">
<meta property="og:site_name" content="CalmExam">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.description)}">
<meta property="og:url" content="${url}">
${hasOg() ? `<meta property="og:image" content="${ORIGIN}${ogPath()}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<meta name="theme-color" content="#F4F7F5">
<!-- TODO(app launch): <meta name="apple-itunes-app" content="app-id=APP_STORE_ID"> once the App Store id exists -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap">
<style>${CSS}</style>
<script defer src="${INDIESTACK_ORIGIN}/a.js" data-site="${INDIESTACK_SITE}"></script>
${ld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header()}
<main id="main">
${o.body}
</main>
${footer()}
<script>${CLIENT_JS}</script>
</body>
</html>`;
}

function header(): string {
  return `<header class="top"><div class="wrap">
<a class="brand" href="/" aria-label="CalmExam home">${LOGO_SVG}<span>CalmExam</span></a>
<nav class="main" aria-label="Main">
<a class="hide-sm" href="${hubPath('sat')}">SAT Math</a>
<a class="hide-sm" href="${hubPath('ap-calc-ab')}">AP Calculus</a>
<a class="hide-sm" href="${hubPath('a-level')}">A-Level Maths</a>
<a class="btn" href="/#join">Join waitlist</a>
</nav>
</div></header>`;
}

function footer(): string {
  const examCols = EXAMS.map(
    (e) => `<div><h2><a href="${hubPath(e.id)}">${esc(e.name)}</a></h2><ul>${TOPICS.filter((t) => t.exam === e.id)
      .map((t) => `<li><a href="${topicPath(t)}">${esc(t.name)}</a></li>`)
      .join('')}</ul></div>`,
  ).join('');
  return `<footer class="foot"><div class="wrap">
<div class="cols">
<div><a class="brand" href="/">${LOGO_SVG}<span>CalmExam</span></a>
<p style="margin-top:12px">The exam coach that's never wrong. Unlimited verified practice for SAT Math, AP Calculus AB and A-Level Maths.</p>
<ul><li><a href="/#join">Join the waitlist</a></li><li><a href="/privacy">Privacy</a></li><li><a href="/terms">Terms</a></li><li><a href="mailto:${CONTACT}">${CONTACT}</a></li></ul></div>
${examCols}
</div>
<p class="legal">© ${new Date().getUTCFullYear()} CalmExam. SAT® and AP® are trademarks registered by the College Board, which is not affiliated with, and does not endorse, CalmExam. A-Level exam boards are not affiliated with CalmExam.</p>
</div></footer>`;
}

export function badges(): string {
  return `<div class="badges">
<p class="soon">Coming soon on <span>iOS &amp; Android</span></p>
<div class="row">
<a href="/#join" aria-label="App Store: coming soon. Join the waitlist"><img class="apple" src="/assets/badges/app-store-badge.svg" width="120" height="40" alt="Download on the App Store"></a>
<a href="/#join" aria-label="Google Play: coming soon. Join the waitlist"><img class="google" src="/assets/badges/google-play-badge.png" width="154" height="60" alt="Get it on Google Play"></a>
</div></div>`;
}

export function waitlistForm(id: string, source: string, state?: 'joined' | 'error' | 'server'): string {
  const notice =
    state === 'joined'
      ? `<p class="thanks" role="status">Thanks, you're on the list. We'll email you once when the app launches.</p>`
      : state === 'error'
        ? `<p class="thanks err" role="alert">That email didn't look right. Please try again.</p>`
        : state === 'server'
          ? `<p class="thanks err" role="alert">Something went wrong on our side. Please try again in a minute.</p>`
          : '';
  return `${notice}<form class="wl" data-wl method="post" action="/api/waitlist" aria-label="Join the CalmExam waitlist">
<input type="hidden" name="source" value="${esc(source)}">
<div class="field"><label for="${id}-email">Email</label><input id="${id}-email" type="email" name="email" required maxlength="254" autocomplete="email" placeholder="you@example.com"></div>
<div class="row2">
<div class="field"><label for="${id}-exam">Your exam</label><select id="${id}-exam" name="exam">
<option value="sat">SAT Math</option><option value="ap-calc-ab">AP Calculus AB</option><option value="a-level">A-Level Maths</option><option value="other">Something else</option></select></div>
<fieldset class="field seg"><legend>Phone</legend><div class="opts">
<label><input type="radio" name="platform" value="ios"><span>iOS</span></label>
<label><input type="radio" name="platform" value="android"><span>Android</span></label>
<label><input type="radio" name="platform" value="both" checked><span>Both</span></label>
</div></fieldset>
</div>
<button class="btn" type="submit">Join the waitlist</button>
<p class="msg" aria-live="polite"></p>
<p class="faint" style="margin:0">One email when the app launches. No spam. <a href="/privacy">Privacy</a></p>
</form>`;
}

export interface Faq {
  q: string;
  a: string;
}

export function faqSection(faqs: Faq[], title = 'Frequently asked questions'): string {
  return `<section class="faq" aria-labelledby="faq"><div class="wrap narrow">
<h2 id="faq">${esc(title)}</h2>
${faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n')}
</div></section>`;
}

export function faqLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: ORIGIN + it.path })),
  };
}

export function ctaSection(source: string, title = 'Get a daily plan built around your exam date'): string {
  return `<section class="cta band" aria-labelledby="cta-h"><div class="wrap narrow">
<span class="eyebrow">The app is coming soon</span>
<h2 id="cta-h">${esc(title)}</h2>
<p class="lead" style="margin:0 auto 28px">The CalmExam app turns verified problems like these into a 5-question placement, a short daily plan and an "explain my mistake" coach. Join the waitlist and we'll email you once at launch.</p>
<div class="card" style="max-width:600px;margin:0 auto;color:var(--ink)">
${waitlistForm('cta', source)}
${badges()}
</div>
</div></section>`;
}
