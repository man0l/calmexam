// "Possible screens" gallery. Each screen is an HTML/CSS mockup inside a CSS phone frame.
// To replace a mockup with a real screenshot: commit web/assets/screens/{id}.png, list the id in
// web/assets/screens/manifest.json (read at runtime, see manifest.ts; no redeploy). The gallery then renders <img src="/screens/{id}.png?v=...">
// and the Worker proxies the file from GitHub (see index.ts). Not inlined, to keep the bundle small.
import { activeManifest } from '../manifest';

export const SCREENS = [
  { id: 'exam', title: 'Pick your exam', caption: 'SAT Math, AP Calculus AB or A-Level Maths, then your exam date.' },
  { id: 'placement', title: '5-question placement', caption: 'Five real questions find your weak topics in about four minutes.' },
  { id: 'plan', title: 'Your plan, projected', caption: 'Minutes per day, focus topics and where steady practice can take you.' },
  { id: 'answer', title: 'Verified answers', caption: 'The answer, numbered steps and the pitfalls that catch most students.' },
  { id: 'explain', title: 'Explain my mistake', caption: 'Ask why your choice was wrong. The coach is grounded in the verified steps.' },
  { id: 'today', title: 'Today', caption: 'A calm daily goal, your week at a glance and days left to the exam.' },
] as const;

export type ScreenId = (typeof SCREENS)[number]['id'];

function version(): string {
  return encodeURIComponent(activeManifest().version || '1');
}

export function hasScreenPng(id: string): boolean {
  return activeManifest().screens.includes(id);
}

export function hasOg(): boolean {
  return activeManifest().og;
}

export function ogPath(): string {
  return `/og.png?v=${version()}`;
}

const status = '<span class="st" aria-hidden="true">9:41</span>';

const MOCKS: Record<ScreenId, string> = {
  exam: `${status}
<span class="cap">Step 1 of 4</span>
<h4>Which exam are you preparing for?</h4>
<div class="opt sel"><span class="ico">SAT</span><span>SAT Math<small>United States · Digital SAT</small></span></div>
<div class="opt"><span class="ico">AP</span><span>AP Calculus AB<small>United States · May exam</small></span></div>
<div class="opt"><span class="ico">A</span><span>A-Level Maths<small>United Kingdom · Pure &amp; applied</small></span></div>
<div class="mcard rowx"><span>Exam date</span><b style="color:var(--primary)">Mar 13 · 115 days</b></div>
<div class="mbtn">Continue</div>`,

  placement: `${status}
<div class="prog" aria-hidden="true"><i class="on"></i><i class="on"></i><i></i><i></i><i></i></div>
<span class="cap">Placement · Question 2 of 5</span>
<div class="mcard"><b style="font-size:15px">If 3x + 7 = x − 5, what is the value of x?</b></div>
<div class="opt"><span class="ico">A</span>−1</div>
<div class="opt sel"><span class="ico">B</span>−6</div>
<div class="opt"><span class="ico">C</span>6</div>
<div class="opt"><span class="ico">D</span>−12</div>
<div class="mbtn">Check</div>`,

  plan: `${status}
<span class="cap">Your SAT Math plan</span>
<h4>115 days · 12 min a day</h4>
<div class="mcard">
<div class="rowx"><b>Projected score</b><span class="cap">estimate</span></div>
<svg viewBox="0 0 220 110" role="img" aria-label="Projection graph: with CalmExam rising from 560 to 680, on your own rising to 600">
<line x1="10" y1="95" x2="212" y2="95" stroke="#E0DBD1"/>
<line x1="10" y1="55" x2="212" y2="55" stroke="#E0DBD1" stroke-dasharray="3 4"/>
<line x1="10" y1="15" x2="212" y2="15" stroke="#E0DBD1" stroke-dasharray="3 4"/>
<path d="M12 80 C60 76 120 70 206 62" fill="none" stroke="#8C979C" stroke-width="2.5" stroke-dasharray="5 5"/>
<path d="M12 80 C60 64 120 34 206 22" fill="none" stroke="#147A6E" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="12" cy="80" r="4" fill="#147A6E"/><circle cx="206" cy="22" r="5" fill="#147A6E"/>
<text x="12" y="108" font-size="9" fill="#8C979C">Today 560</text>
<text x="150" y="12" font-size="10" font-weight="600" fill="#147A6E">680</text>
<text x="168" y="76" font-size="9" fill="#8C979C">600</text>
</svg>
<div class="rowx cap"><span style="color:var(--primary);font-weight:600">— With CalmExam</span><span>- - On your own</span></div>
</div>
<span class="cap">Focus topics</span>
<div class="chips"><span class="chip">Quadratics</span><span class="chip">Systems</span><span class="chip">Circles</span></div>
<div class="mbtn">Start today's practice</div>`,

  answer: `${status}
<span class="cap">Quadratics · Core</span>
<div class="mcard"><b style="font-size:14px">What are the solutions of x² − 5x + 6 = 0?</b></div>
<div class="opt bad"><span class="ico">A</span>x = −2 and x = −3</div>
<div class="opt good"><span class="ico">B</span>x = 2 and x = 3</div>
<span class="ver">✓ Verified answer: B</span>
<div class="mcard"><ol>
<li>Find two numbers with product 6 and sum −5: −2 and −3.</li>
<li>Factor: (x − 2)(x − 3) = 0.</li>
<li>Set each factor to 0: x = 2 or x = 3.</li></ol></div>
<div class="pit"><b>Common pitfall</b><br>Reading the roots off the factors with the wrong sign.</div>`,

  explain: `${status}
<span class="cap">Explain my mistake</span>
<div class="mcard" style="font-size:12px">x² − 5x + 6 = 0 · You chose <b style="color:var(--bad)">A</b> · Verified <b style="color:var(--ok)">B</b></div>
<div class="bub me">Why isn't it −2 and −3?</div>
<div class="bub ai">You found the right pair, −2 and −3, for the factors. But (x − 2) = 0 means x = +2. The roots have the opposite sign of the numbers inside the brackets, so x = 2 and x = 3.</div>
<span class="chip" style="align-self:flex-start">Grounded in the verified steps</span>
<div class="bub me">Got it, so flip the sign.</div>
<div class="inp">Ask a follow-up…</div>`,

  today: `${status}
<div class="rowx"><span class="cap">Wednesday</span><span class="cap">38 days to SAT</span></div>
<h4>Today</h4>
<div class="mcard rowx">
<svg width="72" height="72" viewBox="0 0 72 72" role="img" aria-label="Daily goal: 8 of 10 problems">
<circle cx="36" cy="36" r="30" fill="none" stroke="#ECE8E0" stroke-width="8"/>
<circle cx="36" cy="36" r="30" fill="none" stroke="#147A6E" stroke-width="8" stroke-linecap="round" stroke-dasharray="150.8 188.5" transform="rotate(-90 36 36)"/>
<text x="36" y="41" text-anchor="middle" font-size="15" font-weight="600" fill="#1E2A2F">8/10</text></svg>
<div style="flex:1"><b>Daily goal</b><br><span class="cap">2 more problems · about 3 min</span></div>
</div>
<div class="mcard"><div class="week">
<span><b class="on"></b>M</span><span><b class="on"></b>T</span><span><b class="now"></b>W</span><span><b></b>T</span><span><b></b>F</span><span><b></b>S</span><span><b></b>S</span>
</div><p class="cap" style="margin:8px 0 0">5-day streak. Nice and steady.</p></div>
<div class="opt"><span class="ico">∑</span><span>Systems of equations<small>Focus topic · 4 problems</small></span></div>
<div class="mbtn">Continue practice</div>`,
};

export function phone(id: ScreenId, label: string): string {
  return `<div class="phone" role="img" aria-label="${label}"><div class="screen">${MOCKS[id]}</div></div>`;
}

export function heroPhone(id: ScreenId, label: string): string {
  const inner = hasScreenPng(id)
    ? `<div class="phone" role="img" aria-label="${label}"><img class="shot" src="/screens/${id}.png?v=${version()}" width="260" height="560" alt=""></div>`
    : phone(id, label);
  return `<div class="stage">${inner}<div class="stones" aria-hidden="true"><i></i><i></i><i></i></div></div>`;
}

export function screenFigure(s: (typeof SCREENS)[number]): string {
  const visual = hasScreenPng(s.id)
    ? `<img src="/screens/${s.id}.png?v=${version()}" width="280" height="580" loading="lazy" alt="CalmExam app screen: ${s.title}">`
    : phone(s.id, `Mockup of the CalmExam app screen: ${s.title}`);
  return `<figure>${visual}<figcaption><strong>${s.title}</strong><span>${s.caption}</span></figcaption></figure>`;
}

export function gallery(): string {
  return `<div class="gallery" tabindex="0" aria-label="Possible app screens">${SCREENS.map(screenFigure).join('')}</div>`;
}
